import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { accounts } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const db = useDatabase()
  return db.query.accounts.findMany({
    where: eq(accounts.householdId, householdId),
  })
})
