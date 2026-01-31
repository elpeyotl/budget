import { eq, and, inArray } from 'drizzle-orm'
import { useDatabase } from '../../database'
import { accounts, accountHistory } from '../../database/schema'
import { getHouseholdForUser } from '../../utils/household'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const householdId = await getHouseholdForUser(user.id)
  if (!householdId) {
    throw createError({ statusCode: 404, message: 'Kein Haushalt gefunden' })
  }

  const db = useDatabase()

  const householdAccounts = await db.query.accounts.findMany({
    where: eq(accounts.householdId, householdId),
  })

  const accountIds = householdAccounts.map((a) => a.id)
  if (accountIds.length === 0) return []

  return db.query.accountHistory.findMany({
    where: inArray(accountHistory.accountId, accountIds),
    orderBy: accountHistory.recordedAt,
  })
})
