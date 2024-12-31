// File: apps/chat-web/app/server-functions/langchain-send-chat-message.ts
import { createServerFn } from '@tanstack/start'
import { z } from 'zod'
import { chatStore } from '../store/langchain-chat-store'

export const sendChatMessage = createServerFn({ method: 'POST' })
  .validator((data: unknown) =>
    z
      .object({
        message: z.string().max(200),
        sessionId: z.string().max(10),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    // session flow is not passed anymore
    return chatStore.sendChatMessage(data.message, data.sessionId)
  })
