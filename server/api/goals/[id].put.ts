import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { goals } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetAmount: z.number().int().min(1).optional(),
  targetType: z.enum(['liquid', 'net_worth', 'custom']).optional(),
  deadline: z.string().nullable().optional(),
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

  const goal = await db.query.goals.findFirst({
    where: eq(goals.id, id),
  })
  if (!goal || goal.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Ziel nicht gefunden' })
  }

  const updateData: Record<string, unknown> = { ...body }
  if (body.deadline !== undefined) {
    updateData.deadline = body.deadline ? new Date(body.deadline) : null
  }

  const [updated] = await db.update(goals)
    .set(updateData)
    .where(eq(goals.id, id))
    .returning()

  return updated
})
