<template>
  <div class="text-center py-8">
    <UIcon :name="icon" class="text-4xl text-gray-300 mb-2" />
    <p class="text-gray-400 text-sm">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message: string
  icon?: string
}>(), {
  icon: 'i-heroicons-inbox',
})
</script>
