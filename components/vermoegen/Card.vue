<template>
  <div
    class="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-700/50 group"
  >
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-200">{{ account.name }}</span>
        <span v-if="personName" class="text-xs text-gray-500">
          ({{ personName }})
        </span>
      </div>
      <div v-if="account.institution" class="text-xs text-gray-500">
        {{ account.institution }}
      </div>
    </div>

    <div class="flex items-center gap-3">
      <UBadge
        :color="account.isLiquid ? 'green' : 'gray'"
        variant="subtle"
        size="xs"
      >
        {{ account.isLiquid ? 'Liquid' : 'Gebunden' }}
      </UBadge>

      <button
        class="text-right min-w-[120px] cursor-pointer"
        @click="showEdit = true"
      >
        <div class="text-sm font-semibold text-white tabular-nums">
          {{ formatMoney(account.currentValue) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ formatRelativeDate(account.lastUpdated) }}
        </div>
      </button>

      <UButton
        size="2xs"
        icon="i-heroicons-trash"
        color="red"
        variant="ghost"
        class="opacity-0 group-hover:opacity-100"
        @click="showDeleteConfirm = true"
      />
    </div>

    <SharedConfirmModal
      v-model="showDeleteConfirm"
      title="Konto löschen"
      :message="`${account.name} wirklich löschen?`"
      @confirm="onDelete"
    />

    <VermoegenValueModal
      v-model="showEdit"
      :account="account"
    />
  </div>
</template>

<script setup lang="ts">
import type { Account } from '~/types'

const props = defineProps<{
  account: Account
  personName?: string
}>()

const { formatMoney, formatRelativeDate } = useFormatters()
const { deleteAccount } = useAccounts()

const showDeleteConfirm = ref(false)
const showEdit = ref(false)

async function onDelete() {
  await deleteAccount(props.account.id)
}
</script>
