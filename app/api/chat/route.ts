import { convertToModelMessages, streamText, UIMessage } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userContext } = await req.json() as {
    messages: UIMessage[]
    userContext?: {
      level?: number
      xp?: number
      streak?: number
      currentTasks?: number
    }
  }

  const systemPrompt = `You are TIME BOT's AI Coach - a supportive gaming assistant for the TIME BOT task management app. 

You help users:
- Create engaging quests and tasks
- Optimize their productivity and leveling
- Provide motivational support based on their progress
- Suggest strategies for maintaining streaks
- Celebrate achievements

${userContext ? `Current user stats:
- Level: ${userContext.level || 1}
- XP: ${userContext.xp || 0}
- Current Streak: ${userContext.streak || 0} days
- Active Tasks: ${userContext.currentTasks || 0}` : ''}

Be encouraging, concise, and keep responses under 150 words when possible. Use gaming/quest terminology when appropriate. Always support the user's growth!`

  const result = streamText({
    model: 'openai/gpt-5-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
