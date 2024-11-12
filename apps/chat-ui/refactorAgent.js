import * as dotenv from 'dotenv'
dotenv.config()

import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { formatDocumentsAsString } from 'langchain/util/document'
import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api'
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableLambda,
  RunnableBranch,
} from '@langchain/core/runnables'

// Custom Data Source, Vector Stores
import { OpenAIEmbeddings } from '@langchain/openai'

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

import { z } from 'zod'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

const mag_example1 = './data/mag_example1.pdf'

const loader = new PDFLoader(mag_example1)

const docs = await loader.load()
// console.log(docs[0])

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
})

const splitDocs = await splitter.splitDocuments(docs)

const embeddings = new OpenAIEmbeddings()

const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

const retrieverLocal = vectorStore.asRetriever({
  k: 10,
})

const retrieverWeb = new TavilySearchAPIRetriever({
  k: 6, // Number of articles to retrieve
})

// Instantiate the model
const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.2,
})

// Tool calling setup with structured output
const modelWithStructuredOutput = model.withStructuredOutput(
  z.object({
    answer: z.string().nullable(),
  }),
)

// Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  ('system',
  `You are a helpful assistant.
    Use the following pieces of retrieved context to answer 
    the question. If you don't know the answer, say that you 
    don't know. Use three sentences maximum and keep the
    answer concise.

    State that you cannot answer if there were no data about the question in the context by returning null.

    This is the context:

    {context}
    `),
  //new MessagesPlaceholder('chat_history'),
  ('human', '{input}'),
  //new MessagesPlaceholder('agent_scratchpad'),
])

const promptChain = prompt.pipe(modelWithStructuredOutput)

const mapLocal = RunnableMap.from({
  input: new RunnablePassthrough(),
  docs: retrieverLocal,
  // Array,
})

const mapWeb = RunnableMap.from({
  input: (input) => input.input,
  docs: (input) => retrieverWeb.invoke(input.input),
  // Array,
})

const formatDocs = new RunnableLambda({
  func: (input) => {
    return {
      ...input,
      context: formatDocumentsAsString(input.docs),
    }
  },
})

const outputChain = new RunnableLambda({
  func: (input) => {
    return {
      answer: input.answerFromPrompt.answer,
    }
  },
})

// const debuggerChain = (tag) =>
//   new RunnableLambda({
//     func: (input) => {
//       console.log('debug', tag, input)
//       return input
//     },
//   })

const webChain = mapWeb
  // .pipe(debuggerChain('after retrieve'))
  .pipe(formatDocs)
  // .pipe(debuggerChain('after formatting'))
  .assign({ answerFromPrompt: promptChain })
  // .pipe(debuggerChain('after prompt'))
  .pipe(outputChain)

const mainChain = mapLocal.pipe(formatDocs).pipe(
  RunnableMap.from({
    input: (input) => input.input,
    answerFromPrompt: promptChain,
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
console.log(
  //   await mainChain.invoke('Was muss ich in Greifswald unbedingt ansehen?'),
  await mainChain.invoke('Was muss ich im Verzasca Tal unbedingt ansehen?'),
)
