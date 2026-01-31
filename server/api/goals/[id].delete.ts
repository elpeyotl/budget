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

  const id = getRouterParam(event, 'id')!
  const db = useDatabase()

  const goal = await db.query.goals.findFirst({
    where: eq(goals.id, id),
  })
  if (!goal || goal.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Ziel nicht gefunden' })
  }

  await db.delete(goals).where(eq(goals.id, id))
  return { success: true }
})
