import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { goals } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const db = useDatabase()
  return db.query.goals.findMany({
    where: eq(goals.householdId, householdId),
  })
})
