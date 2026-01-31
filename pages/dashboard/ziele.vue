<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-white">Sparziele</h1>
      <UButton
        size="sm"
        variant="outline"
        icon="i-heroicons-plus"
        @click="showForm = true"
      >
        Ziel
      </UButton>
    </div>

    <div v-if="isLoading" class="space-y-4">
      <USkeleton class="h-32" />
      <USkeleton class="h-32" />
    </div>

    <div v-else-if="goals.length > 0" class="space-y-4">
      <GoalsCard
        v-for="goal in goals"
        :key="goal.id"
        :goal="goal"
        @edit="onEdit"
      />
    </div>

    <SharedEmptyState
      v-else
      message="Noch keine Sparziele. Setze dir ein Ziel!"
      icon="i-heroicons-flag"
    />

    <GoalsForm
      v-model="showForm"
      :edit-goal="editingGoal"
    />
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

definePageMeta({ layout: 'dashboard' })

const { goals, isLoading } = useGoals()
const showForm = ref(false)
const editingGoal = ref<Goal | null>(null)

function onEdit(goal: Goal) {
  editingGoal.value = goal
  showForm.value = true
}

watch(showForm, (open) => {
  if (!open) editingGoal.value = null
})
</script>
