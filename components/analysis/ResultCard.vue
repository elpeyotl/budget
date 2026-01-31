<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">KI-Analyse</h3>
        <UButton
          icon="i-heroicons-arrow-path"
          variant="ghost"
          size="sm"
          :loading="loading"
          @click="$emit('refresh')"
        >
          Neu analysieren
        </UButton>
      </div>
    </template>
    <div
      class="prose prose-invert prose-sm max-w-none"
      v-html="renderedHtml"
    />
  </UCard>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{
  content: string
  loading: boolean
}>()

defineEmits<{
  refresh: []
}>()

const renderedHtml = computed(() => marked.parse(props.content) as string)
</script>
