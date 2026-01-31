import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const id = getRouterParam(event, 'id')!
  const db = useDatabase()

  const item = await db.query.budgetItems.findFirst({
    where: eq(budgetItems.id, id),
  })

  if (!item || item.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Eintrag nicht gefunden' })
  }

  await db.delete(budgetItems).where(eq(budgetItems.id, id))
  return { success: true }
})
