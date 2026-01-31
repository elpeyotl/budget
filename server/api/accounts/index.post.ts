import { z } from 'zod'
import { useDatabase } from '../../database'
import { accounts } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  personId: z.string().nullable().optional(),
  name: z.string().min(1).max(100),
  institution: z.string().max(100).nullable().optional(),
  type: z.enum(['bank', 'investment', 'crypto', 'pension', 'other']),
  assetClass: z.string().nullable().optional(),
  ticker: z.string().max(20).nullable().optional(),
  isLiquid: z.boolean().default(true),
  currentValue: z.number().int().default(0),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const [account] = await db.insert(accounts).values({
    id: crypto.randomUUID(),
    householdId,
    personId: body.personId ?? null,
    name: body.name,
    institution: body.institution ?? null,
    type: body.type,
    assetClass: body.assetClass ?? null,
    ticker: body.ticker ?? null,
    isLiquid: body.isLiquid,
    currentValue: body.currentValue,
    lastUpdated: new Date(),
  }).returning()

  return account
})
