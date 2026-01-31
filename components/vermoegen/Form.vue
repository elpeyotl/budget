<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Konto hinzufügen</h3>
      </template>
      <VermoegenFormFields v-model:form="form" />
      <template #footer>
        <VermoegenFormActions
          :disabled="!form.name"
          :loading="isSubmitting"
          @cancel="isOpen = false"
          @submit="onSubmit"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { AccountType } from '~/types'

const isOpen = defineModel<boolean>({ default: false })
const { addAccount } = useAccounts()
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  institution: '',
  type: 'bank' as AccountType,
  assetClass: '',
  ticker: '',
  personId: '',
  currentValue: 0,
  isLiquid: true,
})

async function onSubmit() {
  isSubmitting.value = true
  await addAccount({
    name: form.name,
    institution: form.institution || null,
    type: form.type,
    assetClass: form.assetClass || null,
    ticker: form.ticker || null,
    personId: form.personId || null,
    currentValue: form.currentValue,
    isLiquid: form.isLiquid,
  })
  Object.assign(form, {
    name: '', institution: '', type: 'bank',
    assetClass: '', ticker: '', personId: '',
    currentValue: 0, isLiquid: true,
  })
  isSubmitting.value = false
  isOpen.value = false
}
</script>
