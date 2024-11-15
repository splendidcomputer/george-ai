import * as dotenv from 'dotenv'
dotenv.config()

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { formatDocumentsAsString } from 'langchain/util/document'
import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api'
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableLambda,
  RunnableBranch,
  RunnableWithMessageHistory,
} from '@langchain/core/runnables'
import { UpstashRedisChatMessageHistory } from '@langchain/community/stores/message/upstash_redis'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { z } from 'zod'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

// Paths and Configurations
const localDataFilePath = './data/mag_example1.pdf'
const CHUNK_SIZE = 200
const CHUNK_OVERLAP = 20
const LOCAL_RETRIEVAL_K = 10
const WEB_RETRIEVAL_K = 10

// Load and split documents
async function loadAndSplitDocuments(path) {
  const loader = new PDFLoader(path)
  const docs = await loader.load()
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  })
  return await splitter.splitDocuments(docs)
}

// Set up the local retriever with vector store
async function setupLocalRetriever(docs) {
  const embeddings = new OpenAIEmbeddings()
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)
  return vectorStore.asRetriever({ k: LOCAL_RETRIEVAL_K })
}

// Define the prompt template with message history
function createPromptTemplate() {
  return ChatPromptTemplate.fromMessages([
    [
      'system',
      `
      You are a helpful assistant.
      Use the following pieces of retrieved context to answer the question.
      If you don't know the answer, say that you don't know.
      Use three sentences maximum and keep the answer concise.

      State that you cannot answer if there were no data about the question in the context by returning null.

      This is the context:
      {context}
    `,
    ],
    new MessagesPlaceholder('history'), // Placeholder for chat history
    ['human', '{input}'],
  ])
}

// Main function
const splitDocs = await loadAndSplitDocuments(localDataFilePath)
const retrieverLocal = await setupLocalRetriever(splitDocs)
const retrieverWeb = new TavilySearchAPIRetriever({ k: WEB_RETRIEVAL_K })

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.2,
})

const modelWithStructuredOutput = model.withStructuredOutput(
  z.object({ answer: z.string().nullable() }),
)

const promptTemplate = createPromptTemplate()
const promptChain = promptTemplate.pipe(modelWithStructuredOutput)

// Helper functions for formatting and output
const formattedPairOfInputContext = new RunnableLambda({
  func: (input) => ({
    ...input,
    context: formatDocumentsAsString(input.docs),
  }),
})

const outputChain = new RunnableLambda({
  func: (input) => ({ answer: input.answerFromPrompt.answer }),
})

// Set up retrieval maps
const mapLocal = RunnableMap.from({
  input: new RunnablePassthrough(),
  docs: retrieverLocal,
})

const mapWeb = RunnableMap.from({
  input: (input) => input.input,
  docs: (input) => retrieverWeb.invoke(input.input),
})

// Set up the web chain
const webChain = mapWeb
  .pipe(formattedPairOfInputContext)
  .assign({ answerFromPrompt: promptChain })
  .pipe(outputChain)

// Set up Upstash Redis for message history
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: promptChain,
  getMessageHistory: (sessionId) =>
    new UpstashRedisChatMessageHistory({
      sessionId,
      config: {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      },
    }),
  inputMessagesKey: 'input',
  historyMessagesKey: 'history',
})

// Main chain with conditional branching
const mainChain = mapLocal.pipe(formattedPairOfInputContext).pipe(
  RunnableMap.from({
    input: (input) => input.input,
    answerFromPrompt: chainWithHistory, // Pass chain with history here
  }).pipe(
    RunnableBranch.from([
      [
        (input) => {
          const noDataInPdfFound = !input.answerFromPrompt.answer

          if (noDataInPdfFound) {
            console.warn(
              'No relevant information found in the provided PDF. Switching to the web retriever for further search.',
            )
          }

          return noDataInPdfFound
        },
        webChain,
      ],
      outputChain,
    ]),
  ),
)

// const result = await mainChain.invoke(
//   {
//     input: 'Was muss ich in Greifswald unbedingt ansehen?',
//     // input: 'Was muss ich im Verzasca Tal unbedingt ansehen?',
//   },
//   {
//     configurable: {
//       sessionId: 'some_string_identifying_a_user',
//     },
//   },
// )

// console.log(result)
