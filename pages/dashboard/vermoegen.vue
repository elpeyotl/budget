<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold text-white">Vermögen</h1>
      <UButton
        size="sm"
        variant="outline"
        icon="i-heroicons-plus"
        @click="showForm = true"
      >
        Konto
      </UButton>
    </div>

    <VermoegenSummary />

    <div v-if="isLoading" class="space-y-4">
      <USkeleton class="h-12" />
      <USkeleton class="h-12" />
      <USkeleton class="h-12" />
    </div>

    <VermoegenList v-else-if="accounts.length > 0" />

    <SharedEmptyState
      v-else
      message="Noch keine Konten. Füge dein erstes Konto hinzu!"
      icon="i-heroicons-banknotes"
    />

    <div v-if="!isLoading && accounts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <ChartsAccountTypeBreakdown />
      <ChartsNetWorthTimeline />
    </div>

    <VermoegenForm v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { accounts, isLoading } = useAccounts()
const showForm = ref(false)
</script>
