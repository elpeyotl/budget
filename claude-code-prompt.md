# Haushalts-Finanz-App (Household Finance App)

## Project Overview

Build a Nuxt 3 app for household financial management. Two people (e.g., a couple) can track their combined budget, net worth, and savings goals in one place.

## Tech Stack

- **Framework:** Nuxt 3
- **UI:** Nuxt UI (use components extensively - no custom styling unless necessary)
- **Database:** Turso (libSQL)
- **ORM:** Drizzle ORM
- **Auth:** nuxt-auth-utils with Google OAuth
- **Hosting-ready:** Vercel/Cloudflare

## Code Style Rules

1. **Small files** - Max 100 lines per file, split aggressively
2. **Reusable components** - Extract any UI pattern used twice
3. **Composables** - All business logic in `/composables`
4. **Server routes** - Thin controllers, logic in `/server/utils`
5. **TypeScript** - Full typing, no `any`
6. **Naming:** 
   - Components: `PascalCase.vue`
   - Composables: `useCamelCase.ts`
   - Server routes: `kebab-case.ts`

## Database Schema (Drizzle)

```typescript
// server/database/schema.ts

// Users from OAuth
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// Household (a budget group)
export const households = sqliteTable('households', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Unser Haushalt'),
  ownerId: text('owner_id').references(() => users.id),
  shareCode: text('share_code').unique(), // 6-char code to invite partner
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

// Household members
export const householdMembers = sqliteTable('household_members', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id),
  userId: text('user_id').references(() => users.id),
  role: text('role').default('member'), // owner | member
});

// Persons (columns in budget view - doesn't have to match users)
export const persons = sqliteTable('persons', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id),
  name: text('name').notNull(),
  color: text('color').default('#3b82f6'), // Tailwind blue
  sortOrder: integer('sort_order').default(0),
});

// Budget items (income, expenses, savings per person)
export const budgetItems = sqliteTable('budget_items', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id),
  personId: text('person_id').references(() => persons.id),
  type: text('type').notNull(), // 'income' | 'expense' | 'savings'
  category: text('category'), // e.g., 'Wohnen', 'Abos', 'Transport'
  name: text('name').notNull(),
  amount: integer('amount').notNull(), // in cents
  sortOrder: integer('sort_order').default(0),
});

// Accounts (for net worth tracking)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id),
  personId: text('person_id').references(() => persons.id).nullable(), // null = shared
  name: text('name').notNull(),
  institution: text('institution'), // e.g., 'Neon', 'Finpension', 'Coinbase'
  type: text('type').notNull(), // 'bank' | 'investment' | 'crypto' | 'pension' | 'other'
  isLiquid: integer('is_liquid', { mode: 'boolean' }).default(true),
  currentValue: integer('current_value').default(0), // in cents
  lastUpdated: integer('last_updated', { mode: 'timestamp' }),
});

// Account value history (for charts)
export const accountHistory = sqliteTable('account_history', {
  id: text('id').primaryKey(),
  accountId: text('account_id').references(() => accounts.id),
  value: integer('value').notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' }).defaultNow(),
});

// Goals
export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  householdId: text('household_id').references(() => households.id),
  name: text('name').notNull(),
  targetAmount: integer('target_amount').notNull(), // in cents
  targetType: text('target_type').default('liquid'), // 'liquid' | 'net_worth' | 'custom'
  deadline: integer('deadline', { mode: 'timestamp' }).nullable(),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});
```

## App Structure

```
/
├── app.vue
├── pages/
│   ├── index.vue              # Landing / redirect to dashboard
│   ├── login.vue              # Login page
│   ├── dashboard/
│   │   ├── index.vue          # Budget view (default)
│   │   ├── vermoegen.vue      # Net worth view
│   │   └── ziele.vue          # Goals view
│   └── settings.vue           # Household settings, invite partner
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── DashboardNav.vue
│   ├── budget/
│   │   ├── PersonColumn.vue       # One person's budget column
│   │   ├── PersonHeader.vue       # Name, color, summary cards
│   │   ├── BudgetSection.vue      # Income/Expense/Savings section
│   │   ├── BudgetItemRow.vue      # Single editable row
│   │   ├── BudgetItemForm.vue     # Add/edit modal
│   │   ├── BudgetSummary.vue      # Household totals bar
│   │   └── AddPersonButton.vue
│   ├── vermoegen/
│   │   ├── AccountCard.vue        # Single account display
│   │   ├── AccountForm.vue        # Add/edit account modal
│   │   ├── AccountsList.vue       # Grouped by type
│   │   ├── NetWorthSummary.vue    # Total, liquid, invested
│   │   └── NetWorthChart.vue      # History over time
│   ├── goals/
│   │   ├── GoalCard.vue           # Single goal with progress
│   │   ├── GoalForm.vue           # Add/edit goal modal
│   │   ├── GoalProgress.vue       # Progress bar + time calc
│   │   └── GoalsList.vue
│   ├── charts/
│   │   ├── ComparisonBarChart.vue # Chris vs Dani
│   │   ├── DistributionPieChart.vue
│   │   └── TimelineChart.vue
│   └── shared/
│       ├── MoneyInput.vue         # CHF formatted input
│       ├── ColorPicker.vue
│       ├── ConfirmModal.vue
│       └── EmptyState.vue
├── composables/
│   ├── useHousehold.ts        # Current household state
│   ├── usePersons.ts          # CRUD for persons
│   ├── useBudget.ts           # CRUD for budget items + calculations
│   ├── useAccounts.ts         # CRUD for accounts
│   ├── useGoals.ts            # CRUD for goals + calculations
│   └── useFormatters.ts       # Money formatting, dates
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   └── google.get.ts
│   │   ├── households/
│   │   │   ├── index.get.ts       # Get user's household
│   │   │   ├── index.post.ts      # Create household
│   │   │   └── join.post.ts       # Join via share code
│   │   ├── persons/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   └── [id].delete.ts
│   │   ├── budget-items/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── reorder.post.ts
│   │   ├── accounts/
│   │   │   ├── index.get.ts
│   │   │   ├── index.post.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── [id].delete.ts
│   │   │   └── [id]/history.get.ts
│   │   └── goals/
│   │       ├── index.get.ts
│   │       ├── index.post.ts
│   │       ├── [id].put.ts
│   │       └── [id].delete.ts
│   ├── database/
│   │   ├── schema.ts
│   │   └── index.ts           # Drizzle client init
│   ├── utils/
│   │   ├── auth.ts            # requireAuth helper
│   │   ├── household.ts       # getHouseholdForUser helper
│   │   └── calculations.ts    # Goal calculations
│   └── middleware/
│       └── auth.ts
├── types/
│   └── index.ts               # Shared TypeScript types
└── nuxt.config.ts
```

## Key Composables

### useBudget.ts
```typescript
// Returns reactive budget data + CRUD methods
export function useBudget() {
  const items = ref<BudgetItem[]>([])
  
  // Computed
  const byPerson = computed(() => groupBy(items.value, 'personId'))
  const totalIncome = computed(() => sum(items.value.filter(i => i.type === 'income')))
  const totalExpenses = computed(() => sum(items.value.filter(i => i.type === 'expense')))
  const totalSavings = computed(() => sum(items.value.filter(i => i.type === 'savings')))
  const monthlyBalance = computed(() => totalIncome.value - totalExpenses.value - totalSavings.value)
  
  // Methods
  async function addItem(item: NewBudgetItem) { ... }
  async function updateItem(id: string, data: Partial<BudgetItem>) { ... }
  async function deleteItem(id: string) { ... }
  async function reorderItems(personId: string, itemIds: string[]) { ... }
  
  return { items, byPerson, totalIncome, totalExpenses, totalSavings, monthlyBalance, addItem, updateItem, deleteItem, reorderItems }
}
```

### useGoals.ts
```typescript
export function useGoals() {
  const { totalSavings, monthlyBalance } = useBudget()
  const { liquidTotal, netWorthTotal } = useAccounts()
  
  // Calculate months to goal
  function monthsToGoal(goal: Goal) {
    const currentAmount = goal.targetType === 'liquid' 
      ? liquidTotal.value 
      : netWorthTotal.value
    
    const remaining = goal.targetAmount - currentAmount
    const monthlyContribution = totalSavings.value + Math.max(0, monthlyBalance.value)
    
    if (monthlyContribution <= 0) return Infinity
    return Math.ceil(remaining / monthlyContribution)
  }
}
```

## UI Components (Nuxt UI to use)

Use these Nuxt UI components - don't reinvent:

- `UButton` - All buttons
- `UInput` - Text/number inputs
- `USelect` - Dropdowns
- `UModal` - All modals (add/edit forms)
- `UCard` - Section containers
- `UTable` - Lists where appropriate
- `UBadge` - Status indicators
- `UAvatar` - User avatars
- `UDropdown` - Context menus
- `USlideover` - Mobile sidebar
- `UProgress` - Goal progress bars
- `UToast` - Notifications (via useToast)
- `UForm` + `UFormGroup` - All forms
- `UColorPicker` - Person colors
- `USkeleton` - Loading states
- `UContextMenu` - Right-click on rows

## Page: Budget View (dashboard/index.vue)

Layout:
```
┌─────────────────────────────────────────────────┐
│ [Household Summary Bar - totals, balance]       │
├─────────────────────────────────────────────────┤
│ [Charts Row - Comparison | Distribution]        │
├───────────────────────┬─────────────────────────┤
│ CHRIS                 │ DANI                    │
│ ┌─────────────────┐   │ ┌─────────────────┐     │
│ │ Summary Cards   │   │ │ Summary Cards   │     │
│ └─────────────────┘   │ └─────────────────┘     │
│ ▼ Einnahmen           │ ▼ Einnahmen             │
│   Lohn        9400    │   Lohn        2000      │
│   [+ Add]             │   [+ Add]               │
│ ▼ Ausgaben            │ ▼ Ausgaben              │
│   Miete       1910    │   Mobile        27      │
│   ...                 │   ...                   │
│   [+ Add]             │   [+ Add]               │
│ ▼ Sparen              │ ▼ Sparen                │
│   3. Säule     500    │   3. Säule     200      │
│   [+ Add]             │   [+ Add]               │
├───────────────────────┴─────────────────────────┤
│ [+ Add Person]                                  │
└─────────────────────────────────────────────────┘
```

Each row is editable inline (click to edit) with delete on hover.

## Page: Net Worth View (dashboard/vermoegen.vue)

Layout:
```
┌─────────────────────────────────────────────────┐
│ VERMÖGEN ÜBERSICHT                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│ │ Net Worth │ │  Liquid   │ │ Invested  │       │
│ │  156'000  │ │   45'000  │ │  111'000  │       │
│ └───────────┘ └───────────┘ └───────────┘       │
├─────────────────────────────────────────────────┤
│ [Timeline Chart - Net worth over months]        │
├─────────────────────────────────────────────────┤
│ BANK ACCOUNTS                    [+ Add]        │
│ ├─ Neon Privat (Chris)     CHF 12'000    ✓ Liq │
│ └─ ZKB Gemeinsam           CHF 33'000    ✓ Liq │
│                                                 │
│ INVESTMENTS                      [+ Add]        │
│ ├─ Neon Aktien (Chris)     CHF 15'000    ✗     │
│ └─ IBKR                    CHF 8'000     ✗     │
│                                                 │
│ CRYPTO                           [+ Add]        │
│ └─ Coinbase (Chris)        CHF 3'000     ✗     │
│                                                 │
│ PENSION (3A)                     [+ Add]        │
│ ├─ Finpension (Chris)      CHF 45'000    ✗     │
│ └─ Finpension (Dani)       CHF 40'000    ✗     │
└─────────────────────────────────────────────────┘
```

Each account: click to update value, last updated date shown.

## Page: Goals View (dashboard/ziele.vue)

Layout:
```
┌─────────────────────────────────────────────────┐
│ SPARZIELE                            [+ Add]    │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ 🎯 100k Notgroschen                         │ │
│ │ Target: CHF 100'000 (Liquid)                │ │
│ │ ████████████████░░░░░░░░░░  45% (45'000)    │ │
│ │ +3'600/month → 15 months (Aug 2027)         │ │
│ │ [Edit] [Delete]                             │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🏠 Eigentumswohnung                         │ │
│ │ Target: CHF 200'000 (Net Worth)             │ │
│ │ ██████████████████████████░░  78% (156'000) │ │
│ │ +3'600/month → 12 months (Jan 2027)         │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

Goal calculation logic:
- Current = sum of accounts matching targetType (liquid or all)
- Monthly contribution = budget savings + positive balance
- Months remaining = (target - current) / monthly contribution

## Auth Flow

1. User visits `/` → redirect to `/login` if not authenticated
2. `/login` shows Google button
3. After OAuth → check if user has household
   - No → create household, add user as owner, create 2 default persons
   - Yes → load existing
4. Redirect to `/dashboard`

## Environment Variables

```env
NUXT_OAUTH_GOOGLE_CLIENT_ID=
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
NUXT_SESSION_SECRET=
```

## First Steps for Claude Code

1. Initialize Nuxt 3 project with TypeScript
2. Install dependencies:
   ```bash
   npx nuxi module add @nuxt/ui
   npm install @libsql/client drizzle-orm nuxt-auth-utils
   npm install -D drizzle-kit
   ```
3. Set up Drizzle with Turso connection
4. Create database schema and run migrations
5. Implement auth flow
6. Build composables (start with useFormatters, then useHousehold)
7. Build components bottom-up (shared → budget → pages)
8. Add accounts and goals features

## Quality Checklist

- [ ] All money stored in cents, displayed with formatters
- [ ] Loading states on all async operations
- [ ] Optimistic updates for better UX
- [ ] Mobile responsive (stack columns on mobile)
- [ ] Form validation with Zod
- [ ] Error handling with UToast
- [ ] Confirm before delete
- [ ] Keyboard shortcuts (Escape to close modals)

## Future Features (Not MVP)

- AI analysis (monthly report via Claude API)
- CSV import from bank
- Recurring transactions
- Multi-currency support
- Dark mode
- Export to PDF
