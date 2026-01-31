import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { households } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const [updated] = await db.update(households)
    .set(body)
    .where(eq(households.id, householdId))
    .returning()

  return updated
})
