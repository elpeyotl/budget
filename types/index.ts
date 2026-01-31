import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type {
  users,
  households,
  householdMembers,
  persons,
  budgetItems,
  accounts,
  accountHistory,
  goals,
} from '~/server/database/schema'

// Select types (read from DB)
export type User = InferSelectModel<typeof users>
export type Household = InferSelectModel<typeof households>
export type HouseholdMember = InferSelectModel<typeof householdMembers>
export type Person = InferSelectModel<typeof persons>
export type BudgetItem = InferSelectModel<typeof budgetItems>
export type Account = InferSelectModel<typeof accounts>
export type AccountHistory = InferSelectModel<typeof accountHistory>
export type Goal = InferSelectModel<typeof goals>

// Insert types (write to DB)
export type NewUser = InferInsertModel<typeof users>
export type NewHousehold = InferInsertModel<typeof households>
export type NewHouseholdMember = InferInsertModel<typeof householdMembers>
export type NewPerson = InferInsertModel<typeof persons>
export type NewBudgetItem = InferInsertModel<typeof budgetItems>
export type NewAccount = InferInsertModel<typeof accounts>
export type NewAccountHistory = InferInsertModel<typeof accountHistory>
export type NewGoal = InferInsertModel<typeof goals>

// Budget item types
export type BudgetItemType = 'income' | 'expense' | 'savings'

// Account types
export type AccountType = 'bank' | 'investment' | 'crypto' | 'pension' | 'other'

// Asset classes
export type AssetClass =
  | 'cash'
  | 'etf_world'
  | 'etf_emerging'
  | 'etf_bonds'
  | 'single_stock'
  | 'bitcoin'
  | 'ethereum'
  | 'crypto_other'
  | 'pension_3a'
  | 'real_estate'
  | 'other'

// Goal target types
export type GoalTargetType = 'liquid' | 'net_worth' | 'custom'

// Household member roles
export type HouseholdRole = 'owner' | 'member'
