<template>
  <div class="space-y-6">
    <div v-for="(group, type) in byType" :key="type">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">
          {{ typeLabels[type as string] ?? type }}
        </h3>
        <span class="text-sm text-gray-500 tabular-nums">
          {{ formatMoney(groupTotal(group)) }}
        </span>
      </div>
      <div class="bg-gray-800 rounded-lg divide-y divide-gray-700">
        <VermoegenCard
          v-for="account in group"
          :key="account.id"
          :account="account"
          :person-name="getPersonName(account.personId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Account } from '~/types'

const { byType } = useAccounts()
const { persons } = usePersons()
const { formatMoney } = useFormatters()

const typeLabels: Record<string, string> = {
  bank: 'Bankkonten',
  investment: 'Investments',
  crypto: 'Krypto',
  pension: 'Vorsorge (3a)',
  other: 'Andere',
}

function groupTotal(group: Account[]) {
  return group.reduce((sum, a) => sum + a.currentValue, 0)
}

function getPersonName(personId: string | null) {
  if (!personId) return undefined
  return persons.value.find((p) => p.id === personId)?.name
}
</script>
