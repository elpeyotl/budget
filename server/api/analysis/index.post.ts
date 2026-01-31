import Anthropic from '@anthropic-ai/sdk'
import { getHouseholdForUser } from '../../utils/household'
import { gatherFinancialData } from '../../utils/gatherFinancialData'

const SYSTEM_PROMPT = `Du bist ein Schweizer Finanzberater für einen Haushalt.
Analysiere die Finanzdaten und gib eine strukturierte Analyse auf Deutsch.

Antworte im folgenden Format mit Markdown:

## Zusammenfassung
Kurze Übersicht der finanziellen Situation.

## Stärken
- Was gut läuft

## Verbesserungen
- Konkrete, umsetzbare Vorschläge

## Asset Allocation
Bewerte die Verteilung der Anlageklassen (Liquidität, ETFs, Krypto, Vorsorge).
Gib Empfehlungen für eine bessere Diversifikation.

## Sparziele
Bewerte den Fortschritt und schlage Anpassungen vor.

Halte die Analyse kurz und praxisorientiert. Benutze CHF als Währung.`

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
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Analysiere diese Haushaltsdaten:\n\n${JSON.stringify(data, null, 2)}`,
    }],
  })

  const textBlock = message.content.find((b) => b.type === 'text')
  return { analysis: textBlock?.text ?? 'Keine Analyse verfügbar.' }
})
