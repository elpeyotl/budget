<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Konto bearbeiten</h3>
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
import type { Account, AccountType } from '~/types'

const props = defineProps<{ account: Account }>()

const isOpen = defineModel<boolean>({ default: false })
const { updateAccount } = useAccounts()
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

watch(isOpen, (open) => {
  if (open) {
    Object.assign(form, {
      name: props.account.name,
      institution: props.account.institution ?? '',
      type: props.account.type as AccountType,
      assetClass: props.account.assetClass ?? '',
      ticker: props.account.ticker ?? '',
      personId: props.account.personId ?? '',
      currentValue: props.account.currentValue,
      isLiquid: props.account.isLiquid,
    })
  }
})

async function onSubmit() {
  isSubmitting.value = true
  await updateAccount(props.account.id, {
    name: form.name,
    institution: form.institution || null,
    type: form.type,
    assetClass: form.assetClass || null,
    ticker: form.ticker || null,
    personId: form.personId || null,
    currentValue: form.currentValue,
    isLiquid: form.isLiquid,
  })
  isSubmitting.value = false
  isOpen.value = false
}
</script>
