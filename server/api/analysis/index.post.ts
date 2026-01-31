import Anthropic from '@anthropic-ai/sdk'
import { getHouseholdForUser } from '../../utils/household'
import { gatherFinancialData } from '../../utils/gatherFinancialData'
import { ANALYSIS_SYSTEM_PROMPT } from '../../utils/analysisPrompt'

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

  const data = await gatherFinancialData(householdId)

  const client = new Anthropic({ apiKey: config.anthropicApiKey })
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Analysiere diese Haushaltsdaten:\n\n${JSON.stringify(data, null, 2)}`,
    }],
  })

  const textBlock = message.content.find((b) => b.type === 'text')
  return { analysis: textBlock?.text ?? 'Keine Analyse verfügbar.' }
})
