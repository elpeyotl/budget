<template>
  <div v-if="months > 0 && months !== Infinity" class="mt-3 space-y-1.5 text-xs text-gray-500">
    <div class="flex justify-between">
      <span>Aktuell</span>
      <span class="text-gray-300">{{ formatMoney(breakdown.current) }}</span>
    </div>
    <div class="flex justify-between">
      <span>Fehlbetrag</span>
      <span class="text-gray-300">{{ formatMoney(breakdown.remaining) }}</span>
    </div>
    <div class="border-t border-gray-700/50 pt-1.5 flex justify-between">
      <span>Sparen / Monat</span>
      <span class="text-gray-300">{{ formatMoney(breakdown.savings) }}</span>
    </div>
    <div v-if="breakdown.surplus > 0" class="flex justify-between">
      <span>+ Überschuss / Monat</span>
      <span class="text-gray-300">{{ formatMoney(breakdown.surplus) }}</span>
    </div>
    <div class="flex justify-between font-medium">
      <span>= Total / Monat</span>
      <span class="text-emerald-400">{{ formatMoney(breakdown.monthly) }}</span>
    </div>
    <div class="text-gray-500 pt-1">
      {{ formatMoney(breakdown.remaining) }} ÷ {{ formatMoney(breakdown.monthly) }} = ~{{ months }} Monate
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{ goal: Goal }>()
const { formatMoney } = useFormatters()
const { goalBreakdown, monthsToGoal } = useGoals()

const breakdown = computed(() => goalBreakdown(props.goal))
const months = computed(() => monthsToGoal(props.goal))
</script>
