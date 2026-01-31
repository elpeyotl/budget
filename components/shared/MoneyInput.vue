<template>
  <UInput
    :model-value="displayValue"
    type="text"
    inputmode="decimal"
    placeholder="0.00"
    @update:model-value="onInput"
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

const displayValue = computed(() => {
  if (props.modelValue === 0) return ''
  return (props.modelValue / 100).toFixed(2)
})

function onInput(val: string | number) {
  const str = String(val).replace(/[^0-9.,\-]/g, '').replace(',', '.')
  const num = parseFloat(str)
  if (!isNaN(num)) {
    emit('update:modelValue', Math.round(num * 100))
  }
}

function onBlur() {
  if (props.modelValue === 0) return
  emit('update:modelValue', props.modelValue)
}
</script>
