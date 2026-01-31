import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { persons } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const existing = await db.query.persons.findMany({
    where: eq(persons.householdId, householdId),
  })

  const [person] = await db.insert(persons).values({
    id: crypto.randomUUID(),
    householdId,
    name: body.name,
    color: body.color,
    sortOrder: existing.length,
  }).returning()

  return person
})
