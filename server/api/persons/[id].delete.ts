import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { persons, budgetItems } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const id = getRouterParam(event, 'id')!
  const db = useDatabase()

  const person = await db.query.persons.findFirst({
    where: eq(persons.id, id),
  })

  if (!person || person.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Person nicht gefunden' })
  }

  await db.delete(budgetItems).where(eq(budgetItems.personId, id))
  await db.delete(persons).where(eq(persons.id, id))

  return { success: true }
})
