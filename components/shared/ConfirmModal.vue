<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">{{ title }}</h3>
      </template>
      <p class="text-gray-600">{{ message }}</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">
            Abbrechen
          </UButton>
          <UButton :color="confirmColor" @click="onConfirm">
            {{ confirmLabel }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  message: string
  confirmLabel?: string
  confirmColor?: string
}>(), {
  confirmLabel: 'Löschen',
  confirmColor: 'red',
})

const emit = defineEmits<{
  confirm: []
}>()

const isOpen = defineModel<boolean>({ default: false })

function onConfirm() {
  emit('confirm')
  isOpen.value = false
}
</script>
