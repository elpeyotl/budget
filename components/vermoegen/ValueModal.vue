<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Wert aktualisieren</h3>
        <p class="text-sm text-gray-500">{{ account.name }}</p>
      </template>
      <UFormGroup label="Aktueller Wert" name="value">
        <SharedMoneyInput v-model="newValue" />
      </UFormGroup>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">
            Abbrechen
          </UButton>
          <UButton :loading="isSubmitting" @click="onSubmit">
            Speichern
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { Account } from '~/types'

const props = defineProps<{
  account: Account
}>()

const isOpen = defineModel<boolean>({ default: false })
const { updateAccount } = useAccounts()
const isSubmitting = ref(false)
const newValue = ref(props.account.currentValue)

watch(() => props.account.currentValue, (val) => {
  newValue.value = val
})

watch(isOpen, (open) => {
  if (open) newValue.value = props.account.currentValue
})

async function onSubmit() {
  isSubmitting.value = true
  await updateAccount(props.account.id, { currentValue: newValue.value })
  isSubmitting.value = false
  isOpen.value = false
}
</script>
