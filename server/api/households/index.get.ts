import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { householdMembers, households } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const db = useDatabase()

  const membership = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, user.id),
  })

  if (!membership) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const household = await db.query.households.findFirst({
    where: eq(households.id, membership.householdId),
  })

  return household
})
