import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_API_ORG,
})
const openai = new OpenAIApi(configuration)

const createChatCompletion = async (content: string, prompts: string[]) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        ...prompts.map((prompt) => ({
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: prompt,
        })),
        { role: ChatCompletionRequestMessageRoleEnum.User, content },
      ],
    })

    return response.data.choices.at(0)?.message?.content
  } catch (error) {
    console.error('Error using chatGPT')
    console.log(JSON.stringify(error, undefined, 2))
  }
}

export const getSummary = async (content: string, summaryPrompt: string[]) => {
  return await createChatCompletion(content, summaryPrompt)
}

export const getKeywords = async (content: string, keywordPrompt: string[]) => {
  const response = await createChatCompletion(content, keywordPrompt)

  return response
    ?.split(',')
    .map((word) => word.replace(/Keywords: \n1\. |^\d+\. |\.$/, '').trim())
    .slice(0, 10)
}
