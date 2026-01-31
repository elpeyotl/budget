<template>
  <ChartsDistributionDonut
    title="Vermögen nach Typ"
    :segments="segments"
  />
</template>

<script setup lang="ts">
const { byType } = useAccounts()

const TYPE_LABELS: Record<string, string> = {
  bank: 'Bank',
  investment: 'Investition',
  crypto: 'Krypto',
  pension: 'Vorsorge',
  other: 'Sonstiges',
}

const TYPE_COLORS: Record<string, string> = {
  bank: '#3b82f6',
  investment: '#10b981',
  crypto: '#f59e0b',
  pension: '#8b5cf6',
  other: '#6b7280',
}

const segments = computed(() => {
  return Object.entries(byType.value).map(([type, accs]) => ({
    label: TYPE_LABELS[type] ?? type,
    value: accs.reduce((s, a) => s + a.currentValue, 0),
    color: TYPE_COLORS[type] ?? '#6b7280',
  })).filter((s) => s.value > 0)
})
</script>
