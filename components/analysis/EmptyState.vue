<template>
  <UCard class="text-center py-12">
    <UIcon
      name="i-heroicons-sparkles"
      class="text-5xl text-primary-400 mx-auto mb-4"
    />
    <h3 class="text-lg font-semibold mb-2">KI-Finanzanalyse</h3>
    <p class="text-sm text-gray-400 mb-6 max-w-md mx-auto">
      Lass deine Finanzdaten von der KI analysieren. Du erhältst
      personalisierte Empfehlungen zu Budget, Vermögen und Sparzielen.
    </p>
    <UButton
      icon="i-heroicons-sparkles"
      :loading="loading"
      size="lg"
      @click="$emit('analyze')"
    >
      Analyse starten
    </UButton>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
}>()

defineEmits<{
  analyze: []
}>()
</script>
