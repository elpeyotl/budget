<template>
  <div v-if="messages.length > 0" class="space-y-4">
    <div
      v-for="(msg, i) in messages"
      :key="i"
      :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
    >
      <div
        :class="[
          'max-w-[85%] rounded-lg px-4 py-3 text-sm',
          msg.role === 'user'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-800 text-gray-200',
        ]"
      >
        <div
          v-if="msg.role === 'assistant'"
          class="prose prose-invert prose-sm max-w-none"
          v-html="renderMarkdown(msg.content)"
        />
        <span v-else>{{ msg.content }}</span>
      </div>
    </div>
    <div v-if="loading" class="flex justify-start">
      <div class="bg-gray-800 rounded-lg px-4 py-3">
        <USkeleton class="h-4 w-32" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

defineProps<{
  messages: { role: 'user' | 'assistant'; content: string }[]
  loading: boolean
}>()

function renderMarkdown(content: string) {
  return marked.parse(content) as string
}
</script>
