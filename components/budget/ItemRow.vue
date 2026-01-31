<template>
  <div
    class="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700/50 group"
  >
    <UIcon
      name="i-heroicons-bars-2"
      class="drag-handle cursor-grab text-gray-600 hover:text-gray-400 mr-2 shrink-0"
    />
    <div v-if="!isEditing" class="flex-1 cursor-pointer" @click="startEdit">
      <span class="text-sm text-gray-200">{{ item.name }}</span>
      <span v-if="item.category" class="text-xs text-gray-500 ml-2">
        {{ item.category }}
      </span>
    </div>

    <div v-if="isEditing" class="flex-1 flex gap-2">
      <UInput
        v-model="editName"
        size="sm"
        class="flex-1"
        @keydown.enter="saveEdit"
        @keydown.escape="cancelEdit"
      />
      <USelect
        v-model="editCategory"
        :options="categoryOptions"
        option-attribute="label"
        value-attribute="value"
        size="sm"
        class="w-40"
      />
      <SharedMoneyInput
        v-model="editAmount"
        class="w-32"
      />
    </div>

    <div v-if="!isEditing" class="text-sm font-medium tabular-nums text-gray-300">
      {{ formatMoney(item.amount) }}
    </div>

    <div class="flex items-center gap-1 ml-2">
      <template v-if="isEditing">
        <UButton size="2xs" @click="saveEdit" icon="i-heroicons-check" color="green" variant="ghost" />
        <UButton size="2xs" @click="cancelEdit" icon="i-heroicons-x-mark" color="gray" variant="ghost" />
      </template>
      <UButton
        v-else
        size="2xs"
        icon="i-heroicons-trash"
        color="red"
        variant="ghost"
        class="opacity-0 group-hover:opacity-100"
        @click="$emit('delete', item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BudgetItem } from '~/types'

const props = defineProps<{ item: BudgetItem }>()
defineEmits<{ delete: [id: string] }>()

const { formatMoney } = useFormatters()
const { updateItem } = useBudget()
const { optionsFor } = useBudgetCategories()

const isEditing = ref(false)
const editName = ref('')
const editCategory = ref('')
const editAmount = ref(0)

const categoryOptions = computed(() =>
  optionsFor(props.item.type as 'income' | 'expense' | 'savings'),
)

function startEdit() {
  editName.value = props.item.name
  editCategory.value = props.item.category ?? ''
  editAmount.value = props.item.amount
  isEditing.value = true
}

function cancelEdit() { isEditing.value = false }

async function saveEdit() {
  await updateItem(props.item.id, {
    name: editName.value,
    category: editCategory.value || null,
    amount: editAmount.value,
  })
  isEditing.value = false
}
</script>
