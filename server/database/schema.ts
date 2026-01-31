import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const households = sqliteTable('households', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Unser Haushalt'),
  city: text('city'),
  childrenCount: integer('children_count').notNull().default(0),
  maritalStatus: text('marital_status').notNull().default('single'),
  ownerId: text('owner_id').references(() => users.id),
  shareCode: text('share_code').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const householdMembers = sqliteTable('household_members', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => households.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  role: text('role').notNull().default('member'),
})

export const persons = sqliteTable('persons', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => households.id),
  name: text('name').notNull(),
  color: text('color').notNull().default('#3b82f6'),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const budgetItems = sqliteTable('budget_items', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => households.id),
  personId: text('person_id')
    .notNull()
    .references(() => persons.id),
  type: text('type').notNull(),
  category: text('category'),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => households.id),
  personId: text('person_id').references(() => persons.id),
  name: text('name').notNull(),
  institution: text('institution'),
  type: text('type').notNull(),
  assetClass: text('asset_class'),
  ticker: text('ticker'),
  isLiquid: integer('is_liquid', { mode: 'boolean' })
    .notNull()
    .default(true),
  currentValue: integer('current_value').notNull().default(0),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }),
})

export const accountHistory = sqliteTable('account_history', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id),
  value: integer('value').notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => households.id),
  name: text('name').notNull(),
  targetAmount: integer('target_amount').notNull(),
  targetType: text('target_type').notNull().default('liquid'),
  includePension: integer('include_pension', { mode: 'boolean' })
    .notNull()
    .default(false),
  deadline: integer('deadline', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})
