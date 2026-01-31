# CLAUDE.md

## Project: Haushalts-Finanz-App

A household finance app for couples to track budget, net worth, and savings goals together.

## Tech Stack

- Nuxt 3 (Vue 3 + TypeScript)
- Nuxt UI (component library - use extensively)
- Turso + Drizzle ORM (database)
- nuxt-auth-utils (authentication)

## Code Principles

### File Size
- **Max 100 lines per file** - split aggressively
- One component = one responsibility
- Extract repeated patterns immediately

### Component Rules
- Use Nuxt UI components for everything (UButton, UInput, UCard, UModal, etc.)
- No custom CSS unless absolutely necessary - use Tailwind utilities
- Props go at top of script, emits second, composables third
- Prefer `defineProps` with TypeScript types, not runtime validation

### Composables
- All business logic lives in `/composables`
- Name: `useCamelCase.ts`
- Return object with clear destructuring: `{ items, isLoading, addItem, deleteItem }`
- Handle loading/error states inside composable, expose via refs

### Server Routes
- Thin controllers - logic in `/server/utils`
- Always validate input with Zod
- Always check auth with `requireAuth(event)`
- Always check household access with `requireHouseholdAccess(event, householdId)`
- Return typed responses

### TypeScript
- Full typing everywhere, no `any`
- Shared types in `/types/index.ts`
- Infer types from Drizzle schema where possible

## Naming Conventions

```
Components:     PascalCase.vue      (PersonColumn.vue)
Composables:    useCamelCase.ts     (useBudget.ts)
Server routes:  kebab-case.ts       (budget-items.get.ts)
Types:          PascalCase          (BudgetItem, Person)
Variables:      camelCase           (totalIncome, isLoading)
Constants:      SCREAMING_SNAKE     (MAX_PERSONS, DEFAULT_COLOR)
```

## Money Handling

- **Always store in cents** (integer) in database
- **Always display formatted** via `useFormatters().formatMoney()`
- Input component `MoneyInput.vue` handles conversion both ways

```typescript
// Good
const amount = 150000 // 1500.00 CHF in cents
formatMoney(amount) // "1'500 CHF"

// Bad
const amount = 1500.00 // Don't use floats for money
```

## Common Patterns

### Fetching data in composables
```typescript
export function useBudget() {
  const items = ref<BudgetItem[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetch() {
    isLoading.value = true
    error.value = null
    try {
      items.value = await $fetch('/api/budget-items')
    } catch (e) {
      error.value = 'Failed to load'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetch)

  return { items, isLoading, error, refresh: fetch }
}
```

### CRUD operations with optimistic updates
```typescript
async function deleteItem(id: string) {
  const backup = [...items.value]
  items.value = items.value.filter(i => i.id !== id) // Optimistic
  
  try {
    await $fetch(`/api/budget-items/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Gelöscht' })
  } catch {
    items.value = backup // Rollback
    toast.add({ title: 'Fehler', color: 'red' })
  }
}
```

### Forms with UForm
```vue
<UForm :state="form" :schema="schema" @submit="onSubmit">
  <UFormGroup label="Name" name="name">
    <UInput v-model="form.name" />
  </UFormGroup>
  <UButton type="submit" :loading="isSubmitting">Speichern</UButton>
</UForm>
```

### Modals
```vue
<UModal v-model="isOpen">
  <UCard>
    <template #header>Title</template>
    <!-- content -->
    <template #footer>
      <UButton @click="isOpen = false" variant="ghost">Abbrechen</UButton>
      <UButton @click="save">Speichern</UButton>
    </template>
  </UCard>
</UModal>
```

## File Organization

```
/components
  /budget         # Budget view components
  /vermoegen      # Net worth view components  
  /goals          # Goals view components
  /charts         # Reusable chart components
  /shared         # App-wide reusable components
  /layout         # Header, sidebar, nav

/composables      # All business logic + state

/server
  /api            # Route handlers (thin)
  /utils          # Business logic for server
  /database       # Schema + client

/types            # Shared TypeScript types
```

## UI Language

App is in **German (Swiss)**. Use:
- Einnahmen (income)
- Ausgaben (expenses)  
- Sparen (savings)
- Vermögen (net worth / assets)
- Ziele (goals)
- Haushalt (household)
- Hinzufügen (add)
- Bearbeiten (edit)
- Löschen (delete)
- Speichern (save)
- Abbrechen (cancel)

## Don't

- Don't use `<style>` blocks - use Tailwind classes
- Don't create custom form inputs - use UInput, USelect, etc.
- Don't fetch in components - use composables
- Don't use `any` type
- Don't hardcode colors - use Tailwind color classes
- Don't write files over 100 lines
- Don't duplicate code - extract to composable or component
- Don't use alert/confirm - use UModal and UToast

## Do

- Use Nuxt UI for all UI elements
- Use composables for all data fetching and state
- Use TypeScript strictly
- Use Tailwind for all styling
- Use optimistic updates for better UX
- Use loading states (USkeleton, :loading prop)
- Use German labels in UI
- Split large components into smaller ones
- Add proper error handling with toast notifications
