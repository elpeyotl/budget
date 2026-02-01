<template>
  <div v-if="months > 0 && months !== Infinity" class="mt-3 space-y-1.5 text-xs text-gray-500">
    <div class="flex justify-between">
      <span>Aktuell</span>
      <span class="text-gray-300">{{ formatMoney(bd.current) }}</span>
    </div>
    <div class="flex justify-between">
      <span>Fehlbetrag</span>
      <span class="text-gray-300">{{ formatMoney(bd.remaining) }}</span>
    </div>
    <div class="border-t border-gray-700/50 pt-1.5 flex justify-between">
      <span>Sparen / Monat</span>
      <span class="text-gray-300">{{ formatMoney(bd.monthly) }}</span>
    </div>
    <div v-if="bd.avgReturn > 0" class="flex justify-between">
      <span>Ø Rendite / Jahr</span>
      <span class="text-blue-400">~{{ bd.avgReturn.toFixed(1) }}%</span>
    </div>
    <div v-if="bd.avgReturn > 0" class="text-gray-600 italic">
      Zinseszins-Berechnung (hist. Durchschnitt, keine Garantie)
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{ goal: Goal }>()
const { formatMoney } = useFormatters()
const { goalBreakdown, monthsToGoal } = useGoals()

const bd = computed(() => goalBreakdown(props.goal))
const months = computed(() => monthsToGoal(props.goal))
</script>
