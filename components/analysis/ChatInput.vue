<template>
  <div class="flex gap-2">
    <UInput
      v-model="text"
      placeholder="Frage zur Analyse stellen..."
      class="flex-1"
      :disabled="loading"
      @keydown.enter="send"
    />
    <UButton
      icon="i-heroicons-paper-airplane"
      :loading="loading"
      :disabled="!text.trim()"
      @click="send"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean }>()
const emit = defineEmits<{ send: [text: string] }>()

const text = ref('')

function send() {
  const msg = text.value.trim()
  if (!msg) return
  emit('send', msg)
  text.value = ''
}
</script>
