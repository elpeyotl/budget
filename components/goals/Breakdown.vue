<template>
  <div v-if="months > 0 && months !== Infinity" class="mt-3">
    <button
      class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      @click="open = !open"
    >
      <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-3.5 h-3.5" />
      Aufschlüsselung
    </button>

    <div v-if="open" class="mt-2 space-y-1.5 text-xs text-gray-500">
      <div class="font-medium text-gray-400 mb-1">Vermögen</div>
      <div v-for="acc in bd.relevant" :key="acc.id" class="flex justify-between pl-2">
        <span class="truncate mr-2">{{ acc.name }}</span>
        <span class="text-gray-300 shrink-0">{{ formatMoney(acc.currentValue) }}</span>
      </div>
      <div class="flex justify-between font-medium text-gray-300 border-t border-gray-700/50 pt-1">
        <span>Total</span>
        <span>{{ formatMoney(bd.current) }}</span>
      </div>
      <div class="flex justify-between">
        <span>Fehlbetrag</span>
        <span class="text-gray-300">{{ formatMoney(bd.remaining) }}</span>
      </div>

      <div class="font-medium text-gray-400 mt-2 mb-1">Monatlicher Beitrag</div>
      <div class="flex justify-between pl-2">
        <span>{{ goal.targetType === 'liquid' ? 'Liquid-Sparen' : 'Invest-Sparen' }}</span>
        <span class="text-gray-300">{{ formatMoney(bd.savings) }}</span>
      </div>
      <div v-if="bd.surplus > 0" class="flex justify-between pl-2">
        <span>Überschuss</span>
        <span class="text-gray-300">{{ formatMoney(bd.surplus) }}</span>
      </div>
      <div class="flex justify-between font-medium text-gray-300 border-t border-gray-700/50 pt-1">
        <span>Total / Monat</span>
        <span>{{ formatMoney(bd.monthly) }}</span>
      </div>

      <template v-if="bd.avgReturn > 0">
        <div class="flex justify-between mt-2">
          <span>Ø Rendite / Jahr</span>
          <span class="text-blue-400">~{{ bd.avgReturn.toFixed(1) }}%</span>
        </div>
        <div class="text-gray-600 italic">
          Zinseszins (hist. Durchschnitt, keine Garantie)
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{ goal: Goal }>()
const { formatMoney } = useFormatters()
const { goalBreakdown, monthsToGoal } = useGoals()

const open = ref(false)
const bd = computed(() => goalBreakdown(props.goal))
const months = computed(() => monthsToGoal(props.goal))
</script>
