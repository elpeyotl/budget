<template>
  <div>
    <div class="flex items-center justify-between text-sm mb-1">
      <span class="text-gray-300">
        {{ formatMoney(current) }}
      </span>
      <span class="font-semibold" :class="pct >= 100 ? 'text-emerald-400' : 'text-primary-400'">
        {{ pct }}%
      </span>
    </div>
    <UProgress :value="pct" :color="pct >= 100 ? 'emerald' : 'primary'" />
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{
  goal: Goal
}>()

const { currentAmount, progress } = useGoals()
const { formatMoney } = useFormatters()

const current = computed(() => currentAmount(props.goal))
const pct = computed(() => progress(props.goal))
</script>
