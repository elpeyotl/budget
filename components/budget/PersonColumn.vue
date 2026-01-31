<template>
  <div class="flex-1 min-w-[300px] bg-gray-800 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4 group">
      <div class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: person.color }"
        />
        <h2 class="text-lg font-bold uppercase text-white">{{ person.name }}</h2>
      </div>
      <UButton
        size="2xs"
        icon="i-heroicons-trash"
        color="red"
        variant="ghost"
        class="opacity-0 group-hover:opacity-100"
        @click="showDeleteConfirm = true"
      />
    </div>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <div class="text-center p-2 bg-green-900/30 rounded">
        <div class="text-xs text-gray-400">Einnahmen</div>
        <div class="text-sm font-semibold text-green-400">
          {{ formatMoney(sumByType('income', person.id)) }}
        </div>
      </div>
      <div class="text-center p-2 bg-red-900/30 rounded">
        <div class="text-xs text-gray-400">Ausgaben</div>
        <div class="text-sm font-semibold text-red-400">
          {{ formatMoney(sumByType('expense', person.id)) }}
        </div>
      </div>
      <div class="text-center p-2 bg-blue-900/30 rounded">
        <div class="text-xs text-gray-400">Sparen</div>
        <div class="text-sm font-semibold text-blue-400">
          {{ formatMoney(sumByType('savings', person.id)) }}
        </div>
      </div>
    </div>

    <BudgetSection
      :person-id="person.id"
      type="income"
      title="Einnahmen"
    />
    <BudgetSection
      :person-id="person.id"
      type="expense"
      title="Ausgaben"
    />
    <BudgetSection
      :person-id="person.id"
      type="savings"
      title="Sparen"
    />

    <SharedConfirmModal
      v-model="showDeleteConfirm"
      title="Person löschen"
      :message="`${person.name} und alle zugehörigen Einträge werden gelöscht.`"
      @confirm="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Person } from '~/types'

const props = defineProps<{
  person: Person
}>()

const { sumByType } = useBudget()
const { formatMoney } = useFormatters()
const { deletePerson } = usePersons()

const showDeleteConfirm = ref(false)

async function onDelete() {
  await deletePerson(props.person.id)
}
</script>
