'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

interface UserContext {
  level?: number
  xp?: number
  streak?: number
  currentTasks?: number
}

export function useAIChat(userContext?: UserContext) {
  return useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: async ({ messages }) => {
        return {
          body: {
            messages,
            userContext,
          },
        }
      },
    }),
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })
}
