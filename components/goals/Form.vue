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
        <UFormGroup label="Deadline (optional)" name="deadline">
          <UInput v-model="form.deadline" type="date" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">
            Abbrechen
          </UButton>
          <UButton
            :disabled="!form.name || form.targetAmount <= 0"
            :loading="isSubmitting"
            @click="onSubmit"
          >
            Speichern
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { Goal } from '~/types'

const props = defineProps<{
  editGoal?: Goal | null
}>()

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
  deadline: '',
})

watch(isOpen, (open) => {
  if (open && props.editGoal) {
    form.name = props.editGoal.name
    form.targetAmount = props.editGoal.targetAmount
    form.targetType = props.editGoal.targetType
    form.deadline = props.editGoal.deadline
      ? new Date(props.editGoal.deadline).toISOString().split('T')[0]
      : ''
  } else if (open) {
    Object.assign(form, { name: '', targetAmount: 0, targetType: 'liquid', deadline: '' })
  }
})

async function onSubmit() {
  isSubmitting.value = true
  const data = {
    name: form.name,
    targetAmount: form.targetAmount,
    targetType: form.targetType,
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
