<template>
  <div class="mb-4">
    <div
      class="flex items-center justify-between cursor-pointer py-2"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2">
        <UIcon
          :name="isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
          class="text-gray-400"
        />
        <h3 class="font-semibold text-sm uppercase tracking-wide text-gray-300">
          {{ title }}
        </h3>
      </div>
      <span class="text-sm font-medium tabular-nums" :class="totalClass">
        {{ formatMoney(total) }}
      </span>
    </div>

    <div v-if="isExpanded" class="ml-2">
      <draggable
        :model-value="sectionItems"
        item-key="id"
        handle=".drag-handle"
        ghost-class="opacity-30"
        animation="150"
        @end="onReorder"
      >
        <template #item="{ element }">
          <BudgetItemRow
            :item="element"
            @delete="onDelete"
          />
        </template>
      </draggable>

      <UButton
        size="xs"
        variant="ghost"
        icon="i-heroicons-plus"
        class="mt-1"
        @click="showForm = true"
      >
        Hinzufügen
      </UButton>
    </div>

    <BudgetItemForm
      v-model="showForm"
      :person-id="personId"
      :type="type"
    />

    <SharedConfirmModal
      v-model="showDeleteConfirm"
      title="Eintrag löschen"
      message="Möchtest du diesen Eintrag wirklich löschen?"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import type { BudgetItemType } from '~/types'

const props = defineProps<{
  personId: string
  type: BudgetItemType
  title: string
}>()

const { items, deleteItem, reorderItems, sumByType } = useBudget()
const { formatMoney } = useFormatters()

const isExpanded = ref(true)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const deleteId = ref<string | null>(null)

const sectionItems = computed(() =>
  items.value.filter(
    (i) => i.personId === props.personId && i.type === props.type,
  ),
)

const total = computed(() => sumByType(props.type, props.personId))

const totalClass = computed(() => {
  if (props.type === 'income') return 'text-emerald-400'
  if (props.type === 'expense') return 'text-rose-400'
  return 'text-violet-400'
})

function onReorder(event: { oldIndex?: number; newIndex?: number }) {
  if (event.oldIndex == null || event.newIndex == null) return
  if (event.oldIndex === event.newIndex) return
  const reordered = [...sectionItems.value]
  const [moved] = reordered.splice(event.oldIndex, 1)
  reordered.splice(event.newIndex, 0, moved)
  reorderItems(reordered.map((i) => i.id))
}

function onDelete(id: string) {
  deleteId.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (deleteId.value) {
    await deleteItem(deleteId.value)
    deleteId.value = null
  }
}
</script>
