<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Konto hinzufügen</h3>
      </template>
      <div class="space-y-4">
        <UFormGroup label="Name" name="name">
          <UInput v-model="form.name" placeholder="z.B. Neon Privat" />
        </UFormGroup>
        <UFormGroup label="Institut" name="institution">
          <UInput v-model="form.institution" placeholder="z.B. Neon, ZKB" />
        </UFormGroup>
        <UFormGroup label="Typ" name="type">
          <USelect
            v-model="form.type"
            :options="typeOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormGroup>
        <UFormGroup label="Person" name="personId">
          <USelect
            v-model="form.personId"
            :options="personOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </UFormGroup>
        <UFormGroup label="Aktueller Wert" name="currentValue">
          <SharedMoneyInput v-model="form.currentValue" />
        </UFormGroup>
        <div class="flex items-center gap-2">
          <UToggle v-model="form.isLiquid" />
          <span class="text-sm text-gray-300">Liquide Mittel</span>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="isOpen = false">
            Abbrechen
          </UButton>
          <UButton
            :disabled="!form.name"
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
import type { AccountType } from '~/types'

const isOpen = defineModel<boolean>({ default: false })
const { addAccount } = useAccounts()
const { persons } = usePersons()
const isSubmitting = ref(false)

const typeOptions = [
  { label: 'Bankkonto', value: 'bank' },
  { label: 'Investment', value: 'investment' },
  { label: 'Krypto', value: 'crypto' },
  { label: 'Vorsorge (3a)', value: 'pension' },
  { label: 'Andere', value: 'other' },
]

const personOptions = computed(() => [
  { label: 'Gemeinsam', value: '' },
  ...persons.value.map((p) => ({ label: p.name, value: p.id })),
])

const form = reactive({
  name: '',
  institution: '',
  type: 'bank' as AccountType,
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
    personId: form.personId || null,
    currentValue: form.currentValue,
    isLiquid: form.isLiquid,
  })
  Object.assign(form, {
    name: '', institution: '', type: 'bank',
    personId: '', currentValue: 0, isLiquid: true,
  })
  isSubmitting.value = false
  isOpen.value = false
}
</script>
