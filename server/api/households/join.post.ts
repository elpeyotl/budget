import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { households, householdMembers, persons } from '../../database/schema'

const schema = z.object({
  shareCode: z.string().length(6),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const existing = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, user.id),
  })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Bereits in einem Haushalt' })
  }

  const household = await db.query.households.findFirst({
    where: eq(households.shareCode, body.shareCode.toUpperCase()),
  })
  if (!household) {
    throw createError({ statusCode: 404, message: 'Ungültiger Einladungscode' })
  }

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

  await db.insert(persons).values({
    id: crypto.randomUUID(),
    householdId: household.id,
    name: user.name?.split(' ')[0] ?? 'Person',
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][existingPersons.length] ?? '#8b5cf6',
    sortOrder: existingPersons.length,
  })

  return household
})
