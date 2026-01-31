<template>
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
    <UFormGroup label="Anlageklasse" name="assetClass">
      <USelect
        v-model="form.assetClass"
        :options="assetClassOptions"
        option-attribute="label"
        value-attribute="value"
      />
    </UFormGroup>
    <UFormGroup label="Ticker / ISIN" name="ticker">
      <UInput v-model="form.ticker" placeholder="z.B. VWRL, BTC" />
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
</template>

<script setup lang="ts">
import type { AccountType, AssetClass } from '~/types'

const { options: assetOptions, isLiquidDefault } = useAssetClasses()
const { persons } = usePersons()

const form = defineModel<{
  name: string
  institution: string
  type: AccountType
  assetClass: string
  ticker: string
  personId: string
  currentValue: number
  isLiquid: boolean
}>('form', { required: true })

const typeOptions = [
  { label: 'Bankkonto', value: 'bank' },
  { label: 'Investment', value: 'investment' },
  { label: 'Krypto', value: 'crypto' },
  { label: 'Vorsorge (3a)', value: 'pension' },
  { label: 'Andere', value: 'other' },
]

const assetClassOptions = computed(() => [
  { label: '– Keine –', value: '' },
  ...assetOptions,
])

const personOptions = computed(() => [
  { label: 'Gemeinsam', value: '' },
  ...persons.value.map((p) => ({ label: p.name, value: p.id })),
])

watch(() => form.value.assetClass, (val) => {
  if (val) {
    form.value.isLiquid = isLiquidDefault(val)
  }
})
</script>
