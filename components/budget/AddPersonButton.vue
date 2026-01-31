<template>
  <div>
    <UButton
      size="sm"
      variant="outline"
      icon="i-heroicons-plus"
      @click="showModal = true"
    >
      Person
    </UButton>

    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Person hinzufügen</h3>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Name" name="name">
            <UInput v-model="form.name" placeholder="z.B. Chris, Dani..." />
          </UFormGroup>
          <UFormGroup label="Farbe" name="color">
            <div class="flex gap-2">
              <button
                v-for="c in COLORS"
                :key="c"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :class="form.color === c ? 'border-gray-800 scale-110' : 'border-transparent'"
                :style="{ backgroundColor: c }"
                @click="form.color = c"
              />
            </div>
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showModal = false">
              Abbrechen
            </UButton>
            <UButton
              :disabled="!form.name"
              :loading="isSubmitting"
              @click="onSubmit"
            >
              Hinzufügen
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const { addPerson } = usePersons()
const showModal = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  color: COLORS[0],
})

async function onSubmit() {
  isSubmitting.value = true
  await addPerson({ name: form.name, color: form.color })
  form.name = ''
  form.color = COLORS[0]
  isSubmitting.value = false
  showModal.value = false
}
</script>
