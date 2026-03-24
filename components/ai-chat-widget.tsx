'use client'

import { useState, useRef, useEffect } from 'react'
import { useAIChat } from '@/hooks/use-ai-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageCircle, X } from 'lucide-react'

interface AIChatWidgetProps {
  userLevel?: number
  userXP?: number
  userStreak?: number
  currentTasks?: number
}

export function AIChatWidget({
  userLevel = 1,
  userXP = 0,
  userStreak = 0,
  currentTasks = 0,
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input: hookInput, handleInputChange, handleSubmit, status } = useAIChat({
    level: userLevel,
    xp: userXP,
    streak: userStreak,
    currentTasks,
  })

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (hookInput.trim()) {
      handleSubmit(e)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-96 bg-gray-950 border border-orange-500/30 rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <h3 className="font-semibold text-orange-400">AI Coach</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-300 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-900/50">
        <div ref={scrollRef} className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <MessageCircle className="w-8 h-8 text-orange-500/50 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                Hey Champion! I'm your AI Coach. Ask me anything about optimizing your quests or leveling up!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-50'
                      : 'bg-gray-800 border border-gray-700 text-gray-100'
                  }`}
                >
                  {typeof message.content === 'string' ? (
                    message.content
                  ) : Array.isArray(message.content) ? (
                    message.content
                      .filter((part) => part.type === 'text')
                      .map((part, i) =>
                        part.type === 'text' ? (
                          <div key={i}>{part.text}</div>
                        ) : null
                      )
                  ) : null}
                </div>
              </div>
            ))
          )}
          {status === 'streaming' && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-orange-500/20 p-3 flex gap-2">
        <Input
          value={hookInput}
          onChange={handleInputChange}
          placeholder="Ask the coach..."
          disabled={status === 'streaming'}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm"
        />
        <Button
          type="submit"
          disabled={status === 'streaming' || !hookInput.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3"
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
