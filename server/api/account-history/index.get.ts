import { eq, inArray } from 'drizzle-orm'
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

  const entries = await db.query.accountHistory.findMany({
    where: inArray(accountHistory.accountId, accountIds),
    orderBy: accountHistory.recordedAt,
  })

  // Build net worth snapshots: for each date, total = sum of latest value per account
  const dates = [...new Set(entries.map((e) =>
    new Date(e.recordedAt).toISOString().slice(0, 10),
  ))].sort()

  const latestValues = new Map<string, number>()

  return dates.map((date) => {
    for (const e of entries) {
      if (new Date(e.recordedAt).toISOString().slice(0, 10) <= date) {
        latestValues.set(e.accountId, e.value)
      }
    }
    const total = Array.from(latestValues.values()).reduce((s, v) => s + v, 0)
    return { date, totalCHF: Math.round(total / 100) }
  })
})
