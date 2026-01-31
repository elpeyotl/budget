import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { accounts, accountHistory } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
  institution: z.string().max(100).nullable().optional(),
  type: z.enum(['bank', 'investment', 'crypto', 'pension', 'other']).optional(),
  assetClass: z.string().nullable().optional(),
  ticker: z.string().max(20).nullable().optional(),
  isLiquid: z.boolean().optional(),
  currentValue: z.number().int().optional(),
  personId: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, id),
  })
  if (!account || account.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Konto nicht gefunden' })
  }

  // Record history if value changed
  if (body.currentValue !== undefined && body.currentValue !== account.currentValue) {
    await db.insert(accountHistory).values({
      id: crypto.randomUUID(),
      accountId: id,
      value: body.currentValue,
    })
  }

  const [updated] = await db.update(accounts)
    .set({ ...body, lastUpdated: new Date() })
    .where(eq(accounts.id, id))
    .returning()

  return updated
})
