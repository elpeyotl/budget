<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="text-xl font-bold text-white">Analyse</h1>

    <div v-if="isLoading && !analysis" class="space-y-4">
      <USkeleton class="h-8 w-48" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
      <USkeleton class="h-4 w-5/6" />
      <USkeleton class="h-4 w-2/3" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-4/5" />
    </div>

    <AnalysisResultCard
      v-else-if="analysis"
      :content="analysis"
      :loading="isLoading"
      @refresh="runAnalysis"
    />

    <AnalysisEmptyState
      v-else
      :loading="isLoading"
      @analyze="runAnalysis"
    />

    <template v-if="analysis">
      <AnalysisChatMessages :messages="messages" :loading="isChatLoading" />
      <AnalysisChatInput :loading="isChatLoading" @send="sendMessage" />
    </template>

    <UAlert
      v-if="error"
      color="red"
      icon="i-heroicons-exclamation-triangle"
      :title="error"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { analysis, isLoading, isChatLoading, error, messages, runAnalysis, sendMessage } = useAnalysis()
</script>
