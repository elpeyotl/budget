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
      <span class="text-gray-300">{{ formatMoney(bd.savings) }}</span>
    </div>
    <div v-if="bd.surplus > 0" class="flex justify-between">
      <span>+ Überschuss / Monat</span>
      <span class="text-gray-300">{{ formatMoney(bd.surplus) }}</span>
    </div>
    <div v-if="bd.monthlyReturn > 0" class="flex justify-between">
      <span>+ Erw. Rendite / Monat</span>
      <span class="text-blue-400">~{{ formatMoney(bd.monthlyReturn) }}</span>
    </div>
    <div class="flex justify-between font-medium">
      <span>= Effektiv / Monat</span>
      <span class="text-emerald-400">{{ formatMoney(effective) }}</span>
    </div>
    <div class="text-gray-500 pt-1">
      {{ formatMoney(bd.remaining) }} ÷ {{ formatMoney(effective) }} = ~{{ months }} Monate
    </div>
    <div v-if="bd.monthlyReturn > 0" class="text-gray-600 italic">
      Rendite basiert auf hist. Durchschnitt, keine Garantie
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
const effective = computed(() => bd.value.monthly + bd.value.monthlyReturn)
</script>
