import { eq, and, inArray } from 'drizzle-orm'
import { useDatabase } from '../database'
import {
  households,
  householdMembers,
  persons,
  budgetItems,
  accounts,
  accountHistory,
  goals,
} from '../database/schema'

export async function leaveHousehold(userId: string) {
  const db = useDatabase()

  const membership = await db.query.householdMembers.findFirst({
    where: eq(householdMembers.userId, userId),
  })
  if (!membership) return

  const householdId = membership.householdId

  // Check if user is the only member
  const members = await db.query.householdMembers.findMany({
    where: eq(householdMembers.householdId, householdId),
  })

  // Remove membership
  await db.delete(householdMembers)
    .where(eq(householdMembers.id, membership.id))

  // If sole member, delete the entire household and its data
  if (members.length <= 1) {
    await deleteHouseholdData(db, householdId)
  }
}

async function deleteHouseholdData(
  db: ReturnType<typeof useDatabase>,
  householdId: string,
) {
  // Delete account history (depends on accounts)
  const accs = await db.query.accounts.findMany({
    where: eq(accounts.householdId, householdId),
  })
  if (accs.length > 0) {
    const accIds = accs.map((a) => a.id)
    await db.delete(accountHistory)
      .where(inArray(accountHistory.accountId, accIds))
  }

  // Delete in order of dependencies
  await db.delete(budgetItems)
    .where(eq(budgetItems.householdId, householdId))
  await db.delete(accounts)
    .where(eq(accounts.householdId, householdId))
  await db.delete(goals)
    .where(eq(goals.householdId, householdId))
  await db.delete(persons)
    .where(eq(persons.householdId, householdId))
  await db.delete(households)
    .where(eq(households.id, householdId))
}
