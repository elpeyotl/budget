import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { households, householdMembers } from '../../database/schema'

const schema = z.object({
  name: z.string().min(1).max(100),
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

  const householdId = crypto.randomUUID()
  const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const [household] = await db.insert(households).values({
    id: householdId,
    name: body.name,
    ownerId: user.id,
    shareCode,
  }).returning()

  await db.insert(householdMembers).values({
    id: crypto.randomUUID(),
    householdId,
    userId: user.id,
    role: 'owner',
  })

  return household
})
