import type { Goal } from '~/types'

export function useGoals() {
  const goals = useState<Goal[]>('goals', () => [])
  const isLoading = ref(true)
  const toast = useToast()

  async function fetch() {
    isLoading.value = true
    try {
      goals.value = await $fetch<Goal[]>('/api/goals')
    } catch {
      toast.add({ title: 'Fehler beim Laden der Ziele', color: 'red' })
    } finally {
      isLoading.value = false
    }
  }

  function currentAmount(goal: Goal) {
    const { liquidTotal, netWorthTotal } = useAccounts()
    return goal.targetType === 'liquid' ? liquidTotal.value : netWorthTotal.value
  }

  function progress(goal: Goal) {
    const current = currentAmount(goal)
    if (goal.targetAmount <= 0) return 100
    return Math.min(100, Math.round((current / goal.targetAmount) * 100))
  }

  function monthsToGoal(goal: Goal) {
    const { totalSavings, monthlyBalance } = useBudget()
    const current = currentAmount(goal)
    const remaining = goal.targetAmount - current
    if (remaining <= 0) return 0

    const monthly = totalSavings.value + Math.max(0, monthlyBalance.value)
    if (monthly <= 0) return Infinity
    return Math.ceil(remaining / monthly)
  }

  function estimatedDate(goal: Goal) {
    const months = monthsToGoal(goal)
    if (months === Infinity || months === 0) return null
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date
  }

  async function addGoal(data: {
    name: string
    targetAmount: number
    targetType: string
    deadline?: string | null
  }) {
    try {
      const goal = await $fetch<Goal>('/api/goals', {
        method: 'POST',
        body: data,
      })
      goals.value = [...goals.value, goal]
      toast.add({ title: 'Ziel hinzugefügt' })
      return goal
    } catch {
      toast.add({ title: 'Fehler beim Hinzufügen', color: 'red' })
    }
  }

  async function updateGoal(id: string, data: Partial<Goal>) {
    const backup = [...goals.value]
    goals.value = goals.value.map((g) => (g.id === id ? { ...g, ...data } : g))
    try {
      await $fetch(`/api/goals/${id}`, { method: 'PUT', body: data })
    } catch {
      goals.value = backup
      toast.add({ title: 'Fehler beim Aktualisieren', color: 'red' })
    }
  }

  async function deleteGoal(id: string) {
    const backup = [...goals.value]
    goals.value = goals.value.filter((g) => g.id !== id)
    try {
      await $fetch(`/api/goals/${id}`, { method: 'DELETE' })
      toast.add({ title: 'Ziel gelöscht' })
    } catch {
      goals.value = backup
      toast.add({ title: 'Fehler beim Löschen', color: 'red' })
    }
  }

  onMounted(fetch)

  return {
    goals, isLoading,
    currentAmount, progress, monthsToGoal, estimatedDate,
    addGoal, updateGoal, deleteGoal, refresh: fetch,
  }
}
