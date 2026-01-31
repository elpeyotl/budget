<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">{{ typeLabel }} hinzufügen</h3>
      </template>

      <div class="space-y-4">
        <UFormGroup label="Name" name="name">
          <UInput v-model="form.name" placeholder="z.B. Lohn, Miete..." />
        </UFormGroup>
        <UFormGroup label="Kategorie" name="category">
          <USelect
            v-model="form.category"
            :options="categoryOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormGroup>
        <UFormGroup label="Betrag" name="amount">
          <SharedMoneyInput v-model="form.amount" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">
            Abbrechen
          </UButton>
          <UButton
            :disabled="!form.name || form.amount <= 0"
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
import type { BudgetItemType } from '~/types'

const props = defineProps<{
  personId: string
  type: BudgetItemType
}>()

const isOpen = defineModel<boolean>({ default: false })
const { addItem } = useBudget()
const { optionsFor } = useBudgetCategories()
const isSubmitting = ref(false)

const categoryOptions = computed(() => optionsFor(props.type))

const TYPE_LABELS: Record<BudgetItemType, string> = {
  income: 'Einnahme',
  expense: 'Ausgabe',
  savings: 'Sparbetrag',
}

const typeLabel = computed(() => TYPE_LABELS[props.type])

const form = reactive({
  name: '',
  category: '',
  amount: 0,
})

async function onSubmit() {
  isSubmitting.value = true
  await addItem({
    personId: props.personId,
    type: props.type,
    name: form.name,
    category: form.category || null,
    amount: form.amount,
  })
  form.name = ''
  form.category = ''
  form.amount = 0
  isSubmitting.value = false
  isOpen.value = false
}
</script>
