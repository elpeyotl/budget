<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h3 class="text-sm font-semibold text-gray-300 mb-4">Vermögensverlauf</h3>
    <div v-if="isLoading" class="space-y-2">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-32 w-full" />
    </div>
    <div v-else-if="points.length < 2" class="text-gray-500 text-sm">
      Noch nicht genug Daten für einen Verlauf.
    </div>
    <div v-else class="space-y-2">
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ formatDate(points[0].date) }}</span>
        <span>{{ formatDate(points[points.length - 1].date) }}</span>
      </div>
      <svg viewBox="0 0 300 100" class="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgb(56, 189, 248)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="rgb(56, 189, 248)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path :d="areaPath" fill="url(#fill)" />
        <polyline :points="linePath" fill="none" stroke="rgb(56, 189, 248)" stroke-width="2" />
      </svg>
      <div class="text-center text-sm text-gray-300">
        Aktuell: {{ formatMoney(currentTotal) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccountHistory } from '~/types'

const { formatMoney, formatDate } = useFormatters()
const { netWorthTotal } = useAccounts()

const history = ref<AccountHistory[]>([])
const isLoading = ref(true)

const currentTotal = computed(() => netWorthTotal.value)

async function fetchHistory() {
  isLoading.value = true
  try {
    history.value = await $fetch<AccountHistory[]>('/api/account-history')
  } catch {
    // silently fail - chart is optional
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchHistory)

interface Point { date: Date; value: number }

const points = computed<Point[]>(() => {
  const byDate = new Map<string, number>()
  for (const h of history.value) {
    const d = new Date(h.recordedAt).toISOString().slice(0, 10)
    byDate.set(d, (byDate.get(d) ?? 0) + h.value)
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, v]) => ({ date: new Date(d), value: v }))
})

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  const vals = points.value.map((p) => p.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return points.value
    .map((p, i) => {
      const x = (i / (points.value.length - 1)) * 300
      const y = 100 - ((p.value - min) / range) * 90 - 5
      return `${x},${y}`
    })
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const vals = points.value.map((p) => p.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const pts = points.value.map((p, i) => {
    const x = (i / (points.value.length - 1)) * 300
    const y = 100 - ((p.value - min) / range) * 90 - 5
    return `${x} ${y}`
  })
  return `M0 100 L${pts.join(' L')} L300 100 Z`
})
</script>
