<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h3 class="text-sm font-semibold text-gray-300 mb-4">{{ title }}</h3>
    <div v-if="segments.length === 0" class="text-gray-500 text-sm">
      Keine Daten
    </div>
    <div v-else>
      <div class="relative w-36 h-36 mx-auto mb-4">
        <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
          <circle
            v-for="(seg, i) in arcs"
            :key="i"
            cx="18" cy="18" r="14"
            fill="none"
            :stroke="seg.color"
            stroke-width="5"
            :stroke-dasharray="`${seg.length} ${100 - seg.length}`"
            :stroke-dashoffset="`${-seg.offset}`"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-sm font-semibold text-white">
            {{ formatMoney(total) }}
          </span>
        </div>
      </div>
      <div class="space-y-1">
        <div
          v-for="seg in segments"
          :key="seg.label"
          class="flex items-center justify-between text-xs"
        >
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" :style="{ background: seg.color }" />
            <span class="text-gray-400">{{ seg.label }}</span>
          </span>
          <span class="text-gray-300">{{ formatMoney(seg.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Segment {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  title: string
  segments: Segment[]
}>()

const { formatMoney } = useFormatters()

const total = computed(() =>
  props.segments.reduce((s, seg) => s + seg.value, 0),
)

const arcs = computed(() => {
  if (total.value === 0) return []
  let offset = 0
  return props.segments.map((seg) => {
    const length = (seg.value / total.value) * 100
    const arc = { color: seg.color, length, offset }
    offset += length
    return arc
  })
})
</script>
