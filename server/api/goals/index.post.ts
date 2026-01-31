import { z } from 'zod'
import { useDatabase } from '../../database'
import { goals } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

const schema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().int().min(1),
  targetType: z.enum(['liquid', 'net_worth', 'custom']).default('liquid'),
  includePension: z.boolean().default(false),
  deadline: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const body = await readValidatedBody(event, schema.parse)
  const db = useDatabase()

  const [goal] = await db.insert(goals).values({
    id: crypto.randomUUID(),
    householdId,
    name: body.name,
    targetAmount: body.targetAmount,
    targetType: body.targetType,
    includePension: body.includePension,
    deadline: body.deadline ? new Date(body.deadline) : null,
  }).returning()

  return goal
})
