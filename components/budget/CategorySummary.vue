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
          :style="{ backgroundColor: row.color + '18' }"
        >
          <td class="py-2 pl-2 text-gray-200 rounded-l">
            <span class="inline-block w-1 h-4 rounded-full mr-2 align-middle" :style="{ backgroundColor: row.color }" />
            {{ row.category }}
          </td>
          <td class="py-2 text-right text-gray-300">{{ formatMoney(row.monthly) }}</td>
          <td class="py-2 text-right text-gray-300">{{ formatMoney(row.monthly * 12) }}</td>
          <td class="py-2 text-right text-gray-400 w-24">
            <div class="flex items-center gap-1.5 justify-end">
              <div class="w-12 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                <div class="h-full rounded-full" :style="{ width: row.percent + '%', backgroundColor: row.color }" />
              </div>
              <span class="w-8 text-right">{{ row.percent }}%</span>
            </div>
          </td>
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

interface Row { category: string; monthly: number; percent: number; color: string }

const COLORS = [
  '#f43f5e', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981',
  '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f97316',
  '#a855f7', '#84cc16', '#ef4444', '#0ea5e9', '#d946ef',
  '#22c55e', '#eab308', '#e11d48', '#7c3aed', '#059669',
]

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
    .map(([category, monthly], i) => ({
      category,
      monthly,
      percent: total.value > 0 ? Math.round((monthly / total.value) * 100) : 0,
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.monthly - a.monthly)
})
</script>
