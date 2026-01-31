<template>
  <div class="flex justify-end gap-2">
    <UButton variant="ghost" @click="$emit('cancel')">
      Abbrechen
    </UButton>
    <UButton
      :disabled="disabled"
      :loading="loading"
      @click="$emit('submit')"
    >
      Speichern
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  disabled: boolean
  loading: boolean
}>()

defineEmits<{
  cancel: []
  submit: []
}>()
</script>
