<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ editGoal ? 'Ziel bearbeiten' : 'Ziel hinzufügen' }}
        </h3>
      </template>
      <div class="space-y-4">
        <UFormGroup label="Name" name="name">
          <UInput v-model="form.name" placeholder="z.B. Notgroschen" />
        </UFormGroup>
        <UFormGroup label="Zielbetrag" name="targetAmount">
          <SharedMoneyInput v-model="form.targetAmount" />
        </UFormGroup>
        <UFormGroup label="Basis" name="targetType">
          <USelect
            v-model="form.targetType"
            :options="typeOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormGroup>
        <div v-if="form.targetType === 'net_worth'" class="flex items-center gap-2">
          <UToggle v-model="form.includePension" />
          <span class="text-sm text-gray-300">3. Säule einbeziehen</span>
        </div>
        <UFormGroup label="Deadline (optional)" name="deadline">
          <UInput v-model="form.deadline" type="date" />
        </UFormGroup>
      </div>
      <template #footer>
        <VermoegenFormActions
          :disabled="!form.name || form.targetAmount <= 0"
          :loading="isSubmitting"
          @cancel="isOpen = false"
          @submit="onSubmit"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{ editGoal?: Goal | null }>()
const isOpen = defineModel<boolean>({ default: false })
const { addGoal, updateGoal } = useGoals()
const isSubmitting = ref(false)

const typeOptions = [
  { label: 'Liquide Mittel', value: 'liquid' },
  { label: 'Gesamtvermögen', value: 'net_worth' },
]

const form = reactive({
  name: '',
  targetAmount: 0,
  targetType: 'liquid',
  includePension: false,
  deadline: '',
})

watch(isOpen, (open) => {
  if (open && props.editGoal) {
    form.name = props.editGoal.name
    form.targetAmount = props.editGoal.targetAmount
    form.targetType = props.editGoal.targetType
    form.includePension = props.editGoal.includePension ?? false
    form.deadline = props.editGoal.deadline
      ? new Date(props.editGoal.deadline).toISOString().split('T')[0]
      : ''
  } else if (open) {
    Object.assign(form, {
      name: '', targetAmount: 0, targetType: 'liquid', includePension: false, deadline: '',
    })
  }
})

async function onSubmit() {
  isSubmitting.value = true
  const data = {
    name: form.name,
    targetAmount: form.targetAmount,
    targetType: form.targetType,
    includePension: form.targetType === 'net_worth' ? form.includePension : false,
    deadline: form.deadline || null,
  }

  if (props.editGoal) {
    await updateGoal(props.editGoal.id, data)
  } else {
    await addGoal(data)
  }

  isSubmitting.value = false
  isOpen.value = false
}
</script>
