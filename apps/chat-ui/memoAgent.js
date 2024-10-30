import * as dotenv from 'dotenv'
dotenv.config()

import readline from 'readline'
import { ChatOpenAI } from '@langchain/openai'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents'
import { createRetrieverTool } from 'langchain/tools/retriever'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { fileURLToPath } from 'url'
import path from 'path'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api'

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pdf_file = path.resolve(__dirname, './data/mag_example1.pdf')

const loader = new PDFLoader(pdf_file)
const docs = await loader.load()

// Step 1: Split the PDF content
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 2000,
  chunkOverlap: 200,
})
const splitDocs = await splitter.splitDocuments(docs)

// Step 2: Create a Vector Store
const embeddings = new OpenAIEmbeddings()
const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

// Local retriever for PDF data
const retrieverLocal = vectorStore.asRetriever({ k: 2 })

// Uncomment if you have web retrieval (for fallback):
const retrieverWeb = new TavilySearchAPIRetriever({ k: 3 })
const retrieverWebTool = createRetrieverTool(retrieverWeb, {
  name: 'web_search',
  description: 'Searches for additional information on the web.',
})

// Step 3: Instantiate the model
const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.2,
})

// Step 4: Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant with memory.'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
])

// Tools for retrieval
const retrieverLocalTool = createRetrieverTool(retrieverLocal, {
  name: 'pdf_search',
  description: 'Retrieves information from the loaded PDF document.',
})
const tools = [retrieverLocalTool]

// Uncomment to add web retrieval as a fallback:
tools.push(retrieverWebTool)

// Step 5: Create the agent and executor
const agent = await createOpenAIFunctionsAgent({
  llm: model,
  prompt,
  tools,
})

const agentExecutor = new AgentExecutor({
  agent,
  tools,
})

// Step 6: User Interaction via Command Line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const chatHistory = []

function askQuestion() {
  rl.question('User: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close()
      return
    }

    // Attempt to retrieve from PDF
    const response = await agentExecutor.invoke({
      input,
      chat_history: chatHistory,
    })

    // Check if local PDF retrieval had an answer
    let outputText =
      response.output || "I couldn't find relevant information in the PDF."

    // Uncomment this block to enable web retrieval fallback:
    if (!response.output) {
      const webResponse = await agentExecutor.invoke({
        input,
        chat_history: chatHistory,
        tool_names: ['web_search'],
      })
      outputText = webResponse.output
        ? `PDF lacked the answer, but here's what I found on the web: ${webResponse.output}`
        : "I couldn't find relevant information in either the PDF or the web."
    }

    console.log('Agent: ', outputText)

    // Update chat history
    chatHistory.push(new HumanMessage(input))
    chatHistory.push(new AIMessage(outputText))

    askQuestion()
  })
}

askQuestion()
