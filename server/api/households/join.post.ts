import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { households, householdMembers, persons } from '../../database/schema'
import { leaveHousehold } from '../../utils/leaveHousehold'

const schema = z.object({
  shareCode: z.string().length(6),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const household = await db.query.households.findFirst({
    where: eq(households.shareCode, body.shareCode.toUpperCase()),
  })
  if (!household) {
    throw createError({ statusCode: 404, message: 'Ungültiger Einladungscode' })
  }

  // Check if already in this household
  const existing = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, user.id),
  })
  if (existing?.householdId === household.id) {
    throw createError({ statusCode: 400, message: 'Bereits in diesem Haushalt' })
  }

  // Leave current household (deletes it if sole member)
  if (existing) {
    await leaveHousehold(user.id)
  }

  // Join new household
  await db.insert(householdMembers).values({
    id: crypto.randomUUID(),
    householdId: household.id,
    userId: user.id,
    role: 'member',
  })

  // Create a person for the new member
  const existingPersons = await db.query.persons.findMany({
    where: eq(persons.householdId, household.id),
  })

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
  await db.insert(persons).values({
    id: crypto.randomUUID(),
    householdId: household.id,
    name: user.name?.split(' ')[0] ?? 'Person',
    color: colors[existingPersons.length] ?? '#8b5cf6',
    sortOrder: existingPersons.length,
  })

  return household
})
