<template>
  <UAlert
    v-if="monthlyBalance > 0"
    icon="i-heroicons-light-bulb"
    color="primary"
    variant="subtle"
    class="mb-6"
    :title="tipTitle"
    :description="tipDescription"
  />
</template>

<script setup lang="ts">
const { monthlyBalance } = useBudget()
const { goals } = useGoals()
const { accounts } = useAccounts()
const { formatMoney } = useFormatters()

const liquidTotal = computed(() =>
  accounts.value.filter((a) => a.isLiquid).reduce((sum, a) => sum + a.currentValue, 0),
)

const unreachedGoal = computed(() => {
  const sorted = [...goals.value].sort((a, b) =>
    a.targetType === 'liquid' && b.targetType !== 'liquid' ? -1
      : a.targetType !== 'liquid' && b.targetType === 'liquid' ? 1 : 0,
  )
  return sorted.find((g) => {
    if (g.targetType === 'liquid') return liquidTotal.value < g.targetAmount
    const total = accounts.value
      .filter((a) => g.includePension || a.type !== 'pension')
      .reduce((sum, a) => sum + a.currentValue, 0)
    return total < g.targetAmount
  })
})

const tipTitle = computed(() => {
  const chf = formatMoney(monthlyBalance.value)
  return `${chf} monatlich verfügbar`
})

const tipDescription = computed(() => {
  const chf = formatMoney(monthlyBalance.value)
  if (unreachedGoal.value) {
    const g = unreachedGoal.value
    const label = g.targetType === 'liquid' ? 'Liquidität' : 'Vermögen'
    return `Erhöhe deinen Sparplan um ${chf} für dein Ziel «${g.name}» (${label}).`
  }
  return `Investiere ${chf} zusätzlich in ETFs oder erhöhe deine Sparquote.`
})
</script>
