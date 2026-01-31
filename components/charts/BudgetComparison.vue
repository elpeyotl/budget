<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h3 class="text-sm font-semibold text-gray-300 mb-4">Budget pro Person</h3>
    <div v-if="persons.length === 0" class="text-gray-500 text-sm">
      Keine Daten
    </div>
    <div v-else class="space-y-3">
      <div v-for="person in persons" :key="person.id">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span :style="{ color: person.color }">{{ person.name }}</span>
          <span>{{ formatMoney(personIncome(person.id)) }}</span>
        </div>
        <div class="flex gap-1 h-5">
          <div
            class="bg-green-500/80 rounded-sm"
            :style="{ width: barWidth(personIncome(person.id)) }"
          />
          <div
            class="bg-red-500/80 rounded-sm"
            :style="{ width: barWidth(personExpenses(person.id)) }"
          />
          <div
            class="bg-blue-500/80 rounded-sm"
            :style="{ width: barWidth(personSavings(person.id)) }"
          />
        </div>
      </div>
      <div class="flex gap-4 text-xs text-gray-500 mt-2">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500/80 rounded-sm" /> Einnahmen
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 bg-red-500/80 rounded-sm" /> Ausgaben
        </span>
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 bg-blue-500/80 rounded-sm" /> Sparen
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { persons } = usePersons()
const { sumByType, totalIncome } = useBudget()
const { formatMoney } = useFormatters()

function personIncome(id: string) { return sumByType('income', id) }
function personExpenses(id: string) { return sumByType('expense', id) }
function personSavings(id: string) { return sumByType('savings', id) }

const maxAmount = computed(() => {
  if (persons.value.length === 0) return 1
  return Math.max(
    ...persons.value.map((p) =>
      personIncome(p.id) + personExpenses(p.id) + personSavings(p.id),
    ),
    1,
  )
})

function barWidth(amount: number) {
  const pct = (amount / maxAmount.value) * 100
  return `${Math.max(pct, 0)}%`
}
</script>
