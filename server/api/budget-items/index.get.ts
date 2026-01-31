import { eq, asc } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)

  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const db = useDatabase()
  return db.query.budgetItems.findMany({
    where: eq(budgetItems.householdId, householdId),
    orderBy: [asc(budgetItems.sortOrder)],
  })
})
