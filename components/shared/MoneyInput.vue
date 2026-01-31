<template>
  <UInput
    v-model="input"
    type="number"
    inputmode="numeric"
    placeholder="0"
    @blur="onBlur"
  >
    <template #trailing>
      <span class="text-gray-400 text-sm">CHF</span>
    </template>
  </UInput>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number // in cents
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const input = ref('')

watch(() => props.modelValue, (val) => {
  const chf = Math.round(val / 100)
  if (chf !== Number(input.value)) {
    input.value = chf === 0 ? '' : String(chf)
  }
}, { immediate: true })

watch(input, (val) => {
  const num = parseInt(val, 10)
  emit('update:modelValue', isNaN(num) ? 0 : num * 100)
})

function onBlur() {
  const num = parseInt(input.value, 10)
  input.value = isNaN(num) || num === 0 ? '' : String(num)
}
</script>
