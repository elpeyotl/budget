import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  personId: z.string().uuid(),
  type: z.enum(['income', 'expense', 'savings']),
  category: z.string().max(50).nullable().optional(),
  name: z.string().min(1).max(100),
  amount: z.number().int().min(0),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const existing = await db.query.budgetItems.findMany({
    where: eq(budgetItems.householdId, householdId),
  })

  const [item] = await db.insert(budgetItems).values({
    id: crypto.randomUUID(),
    householdId,
    personId: body.personId,
    type: body.type,
    category: body.category ?? null,
    name: body.name,
    amount: body.amount,
    sortOrder: existing.length,
  }).returning()

  return item
})
