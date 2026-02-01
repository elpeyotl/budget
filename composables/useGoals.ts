import type { Goal } from '~/types'
export function useGoals() {
  const goals = useState<Goal[]>('goals', () => [])
  const isLoading = ref(true)
  const toast = useToast()
  const { liquidSavings, totalSavings, pensionSavings, monthlyBalance } = useBudget()
  const { accounts, liquidTotal, netWorthTotal } = useAccounts()
  const { annualReturnFor } = useAssetClasses()

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
    const current = currentAmount(goal)
    const remaining = goal.targetAmount - current
    const savings = goal.targetType === 'liquid'
      ? liquidSavings.value
      : totalSavings.value - (goal.includePension ? 0 : pensionSavings.value)
    const surplus = Math.max(0, monthlyBalance.value)
    const monthly = savings + surplus
    const relevant = accounts.value.filter((a) =>
      goal.targetType === 'liquid' ? a.isLiquid : (goal.includePension || a.type !== 'pension'),
    )
    const totalRelevant = relevant.reduce((s, a) => s + a.currentValue, 0)
    const avgReturn = totalRelevant > 0
      ? relevant.reduce((s, a) => s + a.currentValue * annualReturnFor(a.assetClass), 0) / totalRelevant : 0
    return { current, remaining, savings, surplus, monthly, avgReturn, relevant }
  }

  function monthsToGoal(goal: Goal) {
    const { current, monthly, avgReturn } = goalBreakdown(goal)
    const target = goal.targetAmount
    if (current >= target) return 0
    if (monthly <= 0 && avgReturn <= 0) return Infinity
    const r = avgReturn / 100 / 12
    let balance = current
    for (let m = 1; m <= 600; m++) {
      balance = balance * (1 + r) + monthly
      if (balance >= target) return m
    }
    return Infinity
  }

  function estimatedDate(goal: Goal) {
    const m = monthsToGoal(goal)
    if (m === Infinity || m === 0) return null
    const d = new Date(); d.setMonth(d.getMonth() + m); return d
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
