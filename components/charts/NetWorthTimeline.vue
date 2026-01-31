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
        <span>{{ points[0].date }}</span>
        <span>{{ points[points.length - 1].date }}</span>
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
        Aktuell: {{ formatMoney(netWorthTotal) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { formatMoney } = useFormatters()
const { netWorthTotal } = useAccounts()

interface Snapshot { date: string; totalCHF: number }

const points = ref<Snapshot[]>([])
const isLoading = ref(true)

async function fetchHistory() {
  isLoading.value = true
  try {
    points.value = await $fetch<Snapshot[]>('/api/account-history')
  } catch {
    // chart is optional
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchHistory)

function toCoords(pts: Snapshot[]) {
  const vals = pts.map((p) => p.totalCHF)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return pts.map((p, i) => ({
    x: (i / (pts.length - 1)) * 300,
    y: 100 - ((p.totalCHF - min) / range) * 90 - 5,
  }))
}

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return toCoords(points.value).map((c) => `${c.x},${c.y}`).join(' ')
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const coords = toCoords(points.value)
  const pts = coords.map((c) => `${c.x} ${c.y}`).join(' L')
  return `M0 100 L${pts} L300 100 Z`
})
</script>
