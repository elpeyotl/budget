import { eq } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { accounts, accountHistory } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const id = getRouterParam(event, 'id')!
  const db = useDatabase()

  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, id),
  })
  if (!account || account.householdId !== householdId) {
    throw createError({ statusCode: 404, message: 'Konto nicht gefunden' })
  }

  await db.delete(accountHistory).where(eq(accountHistory.accountId, id))
  await db.delete(accounts).where(eq(accounts.id, id))

  return { success: true }
})
