<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h3 class="text-sm font-semibold text-gray-300 mb-4">Ausgaben nach Kategorie</h3>
    <div v-if="rows.length === 0" class="text-gray-500 text-sm">
      Keine Ausgaben vorhanden.
    </div>
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="text-gray-400 text-xs border-b border-gray-700">
          <th class="text-left py-2">Kategorie</th>
          <th class="text-right py-2">Monat</th>
          <th class="text-right py-2">Jahr</th>
          <th class="text-right py-2">Anteil</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.category"
          class="border-b border-gray-700/50"
        >
          <td class="py-2 text-gray-200">{{ row.category }}</td>
          <td class="py-2 text-right text-gray-300">{{ formatMoney(row.monthly) }}</td>
          <td class="py-2 text-right text-gray-300">{{ formatMoney(row.monthly * 12) }}</td>
          <td class="py-2 text-right text-gray-400">{{ row.percent }}%</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-gray-600 font-semibold">
          <td class="py-2 text-gray-200">Total</td>
          <td class="py-2 text-right text-gray-200">{{ formatMoney(total) }}</td>
          <td class="py-2 text-right text-gray-200">{{ formatMoney(total * 12) }}</td>
          <td class="py-2 text-right text-gray-400">100%</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
const { items } = useBudget()
const { formatMoney } = useFormatters()

interface Row { category: string; monthly: number; percent: number }

const total = computed(() =>
  items.value.filter((i) => i.type === 'expense').reduce((s, i) => s + i.amount, 0),
)

const rows = computed<Row[]>(() => {
  const byCategory = new Map<string, number>()
  for (const item of items.value.filter((i) => i.type === 'expense')) {
    const cat = item.category || 'Andere'
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + item.amount)
  }
  return Array.from(byCategory.entries())
    .map(([category, monthly]) => ({
      category,
      monthly,
      percent: total.value > 0 ? Math.round((monthly / total.value) * 100) : 0,
    }))
    .sort((a, b) => b.monthly - a.monthly)
})
</script>
