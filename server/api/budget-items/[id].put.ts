import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
  amount: z.number().int().min(0).optional(),
  category: z.string().max(50).nullable().optional(),
  type: z.enum(['income', 'expense', 'savings']).optional(),
  sortOrder: z.number().int().min(0).optional(),
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

  const item = await db.query.budgetItems.findFirst({
    where: eq(budgetItems.id, id),
  })

  if (!item || item.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Eintrag nicht gefunden' })
  }

  const [updated] = await db.update(budgetItems)
    .set(body)
    .where(eq(budgetItems.id, id))
    .returning()

  return updated
})
