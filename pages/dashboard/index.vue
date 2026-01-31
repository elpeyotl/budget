<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-white">Budget</h1>
      <BudgetAddPersonButton />
    </div>

    <BudgetSummary />
    <BudgetSurplusTip />

    <div v-if="isLoading" class="flex gap-6">
      <div v-for="i in 2" :key="i" class="flex-1 space-y-3">
        <USkeleton class="h-8 w-32" />
        <USkeleton class="h-20" />
        <USkeleton class="h-40" />
      </div>
    </div>

    <div v-else class="flex flex-col md:flex-row gap-6">
      <BudgetPersonColumn
        v-for="person in persons"
        :key="person.id"
        :person="person"
      />
    </div>

    <div v-if="!isLoading && persons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <ChartsBudgetComparison />
      <ChartsExpenseBreakdown />
    </div>

    <SharedEmptyState
      v-if="!isLoading && persons.length === 0"
      message="Noch keine Personen. Füge eine hinzu!"
      icon="i-heroicons-users"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { persons, isLoading } = usePersons()
</script>
