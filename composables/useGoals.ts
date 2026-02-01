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
    const { accounts, liquidTotal, netWorthTotal } = useAccounts()
    if (goal.targetType === 'liquid') return liquidTotal.value
    if (goal.includePension) return netWorthTotal.value
    return accounts.value
      .filter((a) => a.type !== 'pension')
      .reduce((sum, a) => sum + a.currentValue, 0)
  }

  function progress(goal: Goal) {
    const current = currentAmount(goal)
    if (goal.targetAmount <= 0) return 100
    return Math.min(100, Math.round((current / goal.targetAmount) * 100))
  }

  function goalBreakdown(goal: Goal) {
    const { totalSavings, monthlyBalance } = useBudget()
    const { accounts } = useAccounts()
    const { annualReturnFor } = useAssetClasses()
    const current = currentAmount(goal)
    const remaining = goal.targetAmount - current
    const savings = totalSavings.value
    const surplus = Math.max(0, monthlyBalance.value)
    const relevant = accounts.value.filter((a) =>
      goal.targetType === 'liquid' ? a.isLiquid : (goal.includePension || a.type !== 'pension'),
    )
    const yearReturn = relevant.reduce((s, a) => s + a.currentValue * (annualReturnFor(a.assetClass) / 100), 0)
    const monthlyReturn = Math.round(yearReturn / 12)
    const monthly = savings + surplus
    return { current, remaining, savings, surplus, monthly, monthlyReturn }
  }

  function monthsToGoal(goal: Goal) {
    const { remaining, monthly, monthlyReturn } = goalBreakdown(goal)
    if (remaining <= 0) return 0
    const effective = monthly + monthlyReturn
    if (effective <= 0) return Infinity
    return Math.ceil(remaining / effective)
  }

  function estimatedDate(goal: Goal) {
    const months = monthsToGoal(goal)
    if (months === Infinity || months === 0) return null
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date
  }

  async function addGoal(data: { name: string; targetAmount: number; targetType: string; includePension?: boolean; deadline?: string | null }) {
    try {
      const goal = await $fetch<Goal>('/api/goals', { method: 'POST', body: data })
      goals.value = [...goals.value, goal]
      toast.add({ title: 'Ziel hinzugefügt' })
    } catch { toast.add({ title: 'Fehler beim Hinzufügen', color: 'red' }) }
  }

  async function updateGoal(id: string, data: Partial<Goal>) {
    const backup = [...goals.value]
    goals.value = goals.value.map((g) => (g.id === id ? { ...g, ...data } : g))
    try { await $fetch(`/api/goals/${id}`, { method: 'PUT', body: data }) }
    catch { goals.value = backup; toast.add({ title: 'Fehler', color: 'red' }) }
  }

  async function deleteGoal(id: string) {
    const backup = [...goals.value]
    goals.value = goals.value.filter((g) => g.id !== id)
    try { await $fetch(`/api/goals/${id}`, { method: 'DELETE' }); toast.add({ title: 'Gelöscht' }) }
    catch { goals.value = backup; toast.add({ title: 'Fehler', color: 'red' }) }
  }

  onMounted(fetch)
  return {
    goals, isLoading,
    currentAmount, progress, monthsToGoal, goalBreakdown, estimatedDate,
    addGoal, updateGoal, deleteGoal, refresh: fetch,
  }
}
