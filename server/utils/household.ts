import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../database'
import { householdMembers } from '../database/schema'

export async function requireHouseholdAccess(event: H3Event, householdId: string) {
  const user = await requireAuth(event)
  const db = useDatabase()

  const membership = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, user.id),
  })

  if (!membership || membership.householdId !== householdId) {
    throw createError({ statusCode: 403, message: 'Kein Zugriff auf diesen Haushalt' })
  }

  return { user, householdId }
}

export async function getHouseholdForUser(userId: string) {
  const db = useDatabase()

  const membership = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, userId),
  })

  return membership?.householdId ?? null
}
