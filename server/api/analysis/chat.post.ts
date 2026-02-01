import { z } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { getHouseholdForUser } from '../../utils/household'
import { gatherFinancialData } from '../../utils/gatherFinancialData'
import { ANALYSIS_SYSTEM_PROMPT } from '../../utils/analysisPrompt'

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const config = useRuntimeConfig()
  if (!config.anthropicApiKey) {
    throw createError({ statusCode: 500, message: 'Anthropic API Key nicht konfiguriert' })
  }

  const { messages } = await readValidatedBody(event, schema.parse)
  const data = await gatherFinancialData(householdId)

  const client = new Anthropic({ apiKey: config.anthropicApiKey })
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `Haushaltsdaten:\n\n${JSON.stringify(data, null, 2)}` },
      ...messages,
    ],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return { reply: textBlock?.text ?? 'Keine Antwort.' }
})
