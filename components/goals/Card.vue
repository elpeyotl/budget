<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-white">{{ goal.name }}</h3>
      <div class="flex items-center gap-1">
        <UButton
          size="2xs"
          icon="i-heroicons-pencil"
          color="gray"
          variant="ghost"
          @click="$emit('edit', goal)"
        />
        <UButton
          size="2xs"
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          @click="showDeleteConfirm = true"
        />
      </div>
    </div>

    <div class="text-sm text-gray-400 mb-3">
      Ziel: {{ formatMoney(goal.targetAmount) }}
      ({{ goal.targetType === 'liquid' ? 'Liquid' : 'Gesamtvermögen' }})
      <span v-if="goal.targetType === 'net_worth' && !goal.includePension" class="text-xs">
        · ohne 3. Säule
      </span>
    </div>

    <GoalsProgress :goal="goal" />

    <div class="mt-3 text-sm text-gray-400">
      <template v-if="months === 0">
        Ziel erreicht!
      </template>
      <template v-else-if="months === Infinity">
        Kein monatlicher Beitrag
      </template>
      <template v-else>
        ~{{ months }} Monate
        <span v-if="estimated">
          ({{ formatDate(estimated) }})
        </span>
      </template>
    </div>

    <SharedConfirmModal
      v-model="showDeleteConfirm"
      title="Ziel löschen"
      :message="`${goal.name} wirklich löschen?`"
      @confirm="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{
  goal: Goal
}>()

defineEmits<{
  edit: [goal: Goal]
}>()

const { formatMoney, formatDate } = useFormatters()
const { monthsToGoal, estimatedDate, deleteGoal } = useGoals()

const showDeleteConfirm = ref(false)
const months = computed(() => monthsToGoal(props.goal))
const estimated = computed(() => estimatedDate(props.goal))

async function onDelete() {
  await deleteGoal(props.goal.id)
}
</script>
