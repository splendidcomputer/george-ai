import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import {
  RunnableSequence,
  RunnableBranch,
  RunnableLambda,
  RunnableWithMessageHistory,
  RunnableConfig,
} from '@langchain/core/runnables'
import readline from 'readline'
import { BaseMessage } from '@langchain/core/messages'
import { ChatMessageHistory } from 'langchain/stores/message/in_memory'

// Types
interface QueryInput {
  question: string
}

interface ChainInput extends QueryInput {
  context?: string
  webResults?: string
  chat_history?: BaseMessage[]
}

// Constants
const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const DATA_PATH = path.join(PROJECT_ROOT, 'chat-ui', 'data', 'mag_example1.pdf') // Path to the PDF document
const CHUNK_SIZE = 1000 // Increased for better context
const CHUNK_OVERLAP = 100
const LOCAL_RETRIEVAL_K = 4

const createChatSystem = async () => {
  // Initialize components
  const model = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0.7 })
  const embeddings = new OpenAIEmbeddings()

  // Create web search tool
  const searchTool = {
    name: 'web_search',
    description: 'Web search tool',
    func: async (query: string) => {
      console.log('Performing web search for:', query)
      return `Web search results for "${query}". Since this information wasn't found in our travel magazine, here's what we know from general knowledge: This would be detailed information about ${query} from web sources.`
    },
  }

  // Load and process documents
  console.log('Loading PDF document...')
  const loader = new PDFLoader(DATA_PATH)
  const rawDocs = await loader.load()
  console.log(`Loaded ${rawDocs.length} pages from PDF`)

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  })

  const splitDocs = await splitter.splitDocuments(rawDocs)
  console.log(`Split into ${splitDocs.length} chunks`)

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  )
  const retriever = vectorStore.asRetriever(LOCAL_RETRIEVAL_K)

  // Create prompt templates
  const pdfPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a helpful travel assistant with access to the following magazine content:

{context}

Please use the above content to answer the user's question as specifically as possible.

If you cannot find the answer in the content, say 'NOT_FOUND'.`,
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{question}'],
  ])

  const webPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are a travel assistant providing information from web search.
Web search results: {webResults}

Provide helpful information based on these web results.`,
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{question}'],
  ])

  // Helper functions
  const getPdfContent = async (question: string): Promise<string> => {
    try {
      console.log('Searching PDF for:', question)
      const docs = await retriever.getRelevantDocuments(question)
      const content = docs.map((doc) => doc.pageContent).join('\n\n')
      console.log('Found PDF content:', content.length > 0)
      return content
    } catch (error) {
      console.error('Error retrieving PDF content:', error)
      return ''
    }
  }

  const getWebContent = async (question: string): Promise<string> => {
    try {
      console.log('Retrieving web information for:', question)
      return await searchTool.func(question)
    } catch (error) {
      console.error('Error retrieving web content:', error)
      return `Unable to retrieve specific web information about ${question}`
    }
  }

  // Create the processing chains
  const pdfChain = RunnableSequence.from<ChainInput, string>([
    pdfPrompt,
    model,
    (output: BaseMessage) => `[Magazine Source] ${output.content}`,
  ])

  const webChain = RunnableSequence.from<ChainInput, string>([
    async (input) => ({
      ...input,
      webResults: await getWebContent(input.question),
    }),
    webPrompt,
    model,
    (output: BaseMessage) => `[Web Source] ${output.content}`,
  ])

  // Create pdfOrWebChain using RunnableLambda
  const pdfOrWebChain = new RunnableLambda<ChainInput, string>({
    func: async (input: ChainInput, options?: RunnableConfig) => {
      const pdfResponse = await pdfChain.invoke(input, options)
      if (pdfResponse.includes('NOT_FOUND')) {
        console.log('Magazine content insufficient, switching to web...')
        const webResponse = await webChain.invoke(input, options)
        return webResponse
      } else {
        return pdfResponse
      }
    },
  })

  // Create the main chain using RunnableBranch
  const mainChain = RunnableSequence.from<
    QueryInput & { chat_history?: BaseMessage[] },
    string
  >([
    async (input) => ({
      ...input,
      context: await getPdfContent(input.question),
    }),
    RunnableBranch.from<ChainInput, string>([
      [
        (input: ChainInput) =>
          !!(input.context && input.context.trim().length > 0),
        pdfOrWebChain,
      ],
      webChain,
    ]),
  ])

  // Message history management using RunnableWithMessageHistory
  const messageHistories = new Map<string, ChatMessageHistory>()

  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: mainChain,
    getMessageHistory: (sessionId: string) => {
      if (!messageHistories.has(sessionId)) {
        messageHistories.set(sessionId, new ChatMessageHistory())
      }
      return messageHistories.get(sessionId)!
    },
    inputMessagesKey: 'question',
    historyMessagesKey: 'chat_history',
  })

  return chainWithHistory
}

const createCLIInterface = (chain: {
  invoke: (
    input: QueryInput,
    options?: { configurable: { sessionId: string } },
  ) => Promise<string>
}) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const chat = async () => {
    console.log('\nTravel Assistant initialized!')
    console.log('- Ask any travel-related question')
    console.log('- Type "exit" to quit\n')

    const sessionId = 'default_session'

    const askQuestion = async () => {
      rl.question('\nYou: ', async (userInput) => {
        if (userInput.toLowerCase() === 'exit') {
          rl.close()
          return
        }

        const question = userInput

        try {
          const response = await chain.invoke(
            { question },
            { configurable: { sessionId } },
          )
          console.log('\nAssistant:', response)
        } catch (error) {
          console.error(
            'Error:',
            error instanceof Error ? error.message : String(error),
          )
          console.log(
            '\nAssistant: I apologize, but I encountered an error. Could you rephrase your question?',
          )
        }

        askQuestion()
      })
    }

    askQuestion()
  }

  return chat
}

const main = async () => {
  try {
    console.log('Initializing travel assistant...')
    const chain = await createChatSystem()
    const chat = createCLIInterface(chain)
    await chat()
  } catch (error) {
    console.error(
      'Startup error:',
      error instanceof Error ? error.message : String(error),
    )
    process.exit(1)
  }
}

main().catch(console.error)

export {}
