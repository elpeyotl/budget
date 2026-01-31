import { eq } from 'drizzle-orm'
import { useDatabase } from '../database'
import { budgetItems, accounts, goals, persons } from '../database/schema'

export async function gatherFinancialData(householdId: string) {
  const db = useDatabase()

  const [personList, budget, accountList, goalList] = await Promise.all([
    db.query.persons.findMany({ where: eq(persons.householdId, householdId) }),
    db.query.budgetItems.findMany({ where: eq(budgetItems.householdId, householdId) }),
    db.query.accounts.findMany({ where: eq(accounts.householdId, householdId) }),
    db.query.goals.findMany({ where: eq(goals.householdId, householdId) }),
  ])

  const personMap = Object.fromEntries(personList.map((p) => [p.id, p.name]))

  return {
    persons: personList.map((p) => ({ name: p.name })),
    budget: budget.map((b) => ({
      person: personMap[b.personId] ?? 'Gemeinsam',
      type: b.type,
      category: b.category,
      name: b.name,
      amountCHF: Math.round(b.amount / 100),
    })),
    accounts: accountList.map((a) => ({
      name: a.name,
      person: a.personId ? (personMap[a.personId] ?? '–') : 'Gemeinsam',
      institution: a.institution,
      type: a.type,
      assetClass: a.assetClass,
      ticker: a.ticker,
      isLiquid: a.isLiquid,
      valueCHF: Math.round(a.currentValue / 100),
    })),
    goals: goalList.map((g) => ({
      name: g.name,
      targetCHF: Math.round(g.targetAmount / 100),
      targetType: g.targetType,
      deadline: g.deadline?.toISOString().split('T')[0] ?? null,
    })),
  }
}
