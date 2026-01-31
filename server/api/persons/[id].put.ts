import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { persons } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const person = await db.query.persons.findFirst({
    where: eq(persons.id, id),
  })

  if (!person || person.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Person nicht gefunden' })
  }

  const [updated] = await db.update(persons)
    .set(body)
    .where(eq(persons.id, id))
    .returning()

  return updated
})
