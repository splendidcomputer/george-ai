import { ChatOpenAI } from '@langchain/openai'
import {
  RunnableSequence,
  RunnableLambda,
  RunnableWithMessageHistory,
} from '@langchain/core/runnables'

import {
  localPrompt,
  webPrompt,
  apologyPromptOnlyLocal,
  apologyPromptOnlyWeb,
  apologyPromptLocalAndWeb,
  searchQueryPrompt,
} from './prompts'
import { getMessageHistory } from './message-history'
// import { getPDFContentForQuestion } from './memory-vectorstore'
import { getPDFContentForQuestion } from './typesense-vectorstore'
import { getWebContent } from './web-vectorstore'
import { getRetrievalFlow } from './session-flow-store'

import * as z from 'zod'

const outputSchema = z.object({
  answer: z.string().describe('The answer to the human question ...'),
  source: z
    .string()
    .describe('One of "local", "web", or "model", indicating the origin.'),
  notEnoughInformation: z
    .boolean()
    .describe('True only if the given context lacks relevant info.'),
})

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7,
  maxTokens: 500,
})

const historyToQueryChain = RunnableSequence.from([
  (input) => ({
    chat_history: input.chat_history,
    question: input.question,
  }),
  searchQueryPrompt,
  model,
  (modelResponse) => modelResponse.text,
])

const pdfChain = RunnableSequence.from([
  localPrompt,
  model.withStructuredOutput(outputSchema, { strict: true }),
])

const webChain = RunnableSequence.from([
  async (input, options) => {
    const sessionId = options?.configurable?.sessionId
    const messageHistory = sessionId
      ? await getMessageHistory(sessionId).getMessages()
      : []
    const historyContent = messageHistory.map((m) => m.content).join('\n')
    const combinedQuery =
      historyContent.trim().length > 0
        ? `Relevant conversation history:
${historyContent}

User's current question:
${input.question}`
        : input.question

    const context = await getWebContent({ question: combinedQuery })
    return { ...input, context }
  },
  webPrompt,
  model.withStructuredOutput(outputSchema, { strict: true }),
])

const apologyChainOnlyLocal = RunnableSequence.from([
  apologyPromptOnlyLocal,
  model.withStructuredOutput(outputSchema, { strict: true }),
])

const apologyChainOnlyWeb = RunnableSequence.from([
  apologyPromptOnlyWeb,
  model.withStructuredOutput(outputSchema, { strict: true }),
])

const apologyChainLocalAndWeb = RunnableSequence.from([
  apologyPromptLocalAndWeb,
  model.withStructuredOutput(outputSchema, { strict: true }),
])

const branchChain = RunnableLambda.from(
  async (input: { question: string }, options) => {
    const sessionId = options?.configurable?.sessionId

    const retrievalFlow = sessionId ? getRetrievalFlow(sessionId) : 'Sequential'

    switch (retrievalFlow) {
      case 'onlyLocal': {
        const localResponse = await pdfChain.invoke(input, options)
        if (!localResponse.notEnoughInformation) {
          return localResponse
        }
        return apologyChainOnlyLocal.invoke(input, options)
      }

      case 'onlyWeb': {
        const webResponse = await webChain.invoke(input, options)
        if (!webResponse.notEnoughInformation) {
          return webResponse
        }
        return apologyChainOnlyWeb.invoke(input, options)
      }

      case 'Sequential': {
        const localResponse = await pdfChain.invoke(input, options)
        if (!localResponse.notEnoughInformation) {
          return localResponse
        }
        const webResponse = await webChain.invoke(input, options)
        if (!webResponse.notEnoughInformation) {
          return webResponse
        }
        return apologyChainLocalAndWeb.invoke(input, options)
      }

      case 'Parallel': {
        const [localResponse, webResponse] = await Promise.all([
          pdfChain.invoke(input, options),
          webChain.invoke(input, options),
        ])

        if (!localResponse.notEnoughInformation) {
          return localResponse
        }
        if (!webResponse.notEnoughInformation) {
          return webResponse
        }
        return apologyChainLocalAndWeb.invoke(input, options)
      }

      default: {
        return apologyChainLocalAndWeb.invoke(input, options)
      }
    }
  },
)

// Main chain
const mainChain = RunnableSequence.from([
  async (input) => {
    const searchQuery = await historyToQueryChain.invoke({
      question: input.question,
      chat_history: input.chat_history,
    })
    return { ...input, searchQuery }
  },

  async (input) => ({
    ...input,
    context: await getPDFContentForQuestion(input.searchQuery),
  }),

  branchChain,
])

export const historyChain = new RunnableWithMessageHistory({
  runnable: mainChain,
  getMessageHistory,
  inputMessagesKey: 'question',
  outputMessagesKey: 'answer',
  historyMessagesKey: 'chat_history',
})
