<template>
  <ChartsDistributionDonut
    title="Ausgabenverteilung"
    :segments="segments"
  />
</template>

<script setup lang="ts">
const { items } = useBudget()
const { persons } = usePersons()

const segments = computed(() => {
  return persons.value.map((p) => {
    const total = items.value
      .filter((i) => i.type === 'expense' && i.personId === p.id)
      .reduce((s, i) => s + i.amount, 0)
    return { label: p.name, value: total, color: p.color }
  }).filter((s) => s.value > 0)
})
</script>
