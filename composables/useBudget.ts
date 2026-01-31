import type { BudgetItem, BudgetItemType } from '~/types'

export function useBudget() {
  const items = useState<BudgetItem[]>('budgetItems', () => [])
  const isLoading = ref(true)
  const toast = useToast()

  async function fetch() {
    isLoading.value = true
    try {
      items.value = await $fetch<BudgetItem[]>('/api/budget-items')
    } catch {
      toast.add({ title: 'Fehler beim Laden des Budgets', color: 'red' })
    } finally {
      isLoading.value = false
    }
  }

  const byPerson = computed(() => {
    const grouped: Record<string, BudgetItem[]> = {}
    for (const item of items.value) {
      if (!grouped[item.personId]) grouped[item.personId] = []
      grouped[item.personId].push(item)
    }
    return grouped
  })

  function sumByType(type: BudgetItemType, personId?: string) {
    return items.value
      .filter((i) => i.type === type && (!personId || i.personId === personId))
      .reduce((sum, i) => sum + i.amount, 0)
  }

  const totalIncome = computed(() => sumByType('income'))
  const totalExpenses = computed(() => sumByType('expense'))
  const totalSavings = computed(() => sumByType('savings'))
  const monthlyBalance = computed(
    () => totalIncome.value - totalExpenses.value - totalSavings.value,
  )

  async function addItem(data: Omit<BudgetItem, 'id' | 'householdId' | 'sortOrder'>) {
    try {
      const item = await $fetch<BudgetItem>('/api/budget-items', {
        method: 'POST',
        body: data,
      })
      items.value = [...items.value, item]
      toast.add({ title: 'Hinzugefügt' })
      return item
    } catch {
      toast.add({ title: 'Fehler beim Hinzufügen', color: 'red' })
    }
  }

  async function updateItem(id: string, data: Partial<BudgetItem>) {
    const backup = [...items.value]
    items.value = items.value.map((i) => (i.id === id ? { ...i, ...data } : i))
    try {
      await $fetch(`/api/budget-items/${id}`, { method: 'PUT', body: data })
    } catch {
      items.value = backup
      toast.add({ title: 'Fehler beim Aktualisieren', color: 'red' })
    }
  }

  async function reorderItems(itemIds: string[]) {
    try {
      await $fetch('/api/budget-items/reorder', {
        method: 'POST',
        body: { itemIds },
      })
    } catch {
      toast.add({ title: 'Fehler beim Sortieren', color: 'red' })
    }
  }

  async function deleteItem(id: string) {
    const backup = [...items.value]
    items.value = items.value.filter((i) => i.id !== id)
    try {
      await $fetch(`/api/budget-items/${id}`, { method: 'DELETE' })
      toast.add({ title: 'Gelöscht' })
    } catch {
      items.value = backup
      toast.add({ title: 'Fehler beim Löschen', color: 'red' })
    }
  }

  onMounted(fetch)

  return {
    items, byPerson, isLoading,
    totalIncome, totalExpenses, totalSavings, monthlyBalance,
    sumByType, addItem, updateItem, deleteItem, reorderItems, refresh: fetch,
  }
}
