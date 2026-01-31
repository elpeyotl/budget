import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  itemIds: z.array(z.string()),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const { itemIds } = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  for (let i = 0; i < itemIds.length; i++) {
    await db.update(budgetItems)
      .set({ sortOrder: i })
      .where(eq(budgetItems.id, itemIds[i]))
  }

  return { success: true }
})
