<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h2 class="text-lg font-semibold text-white mb-4">Haushalt</h2>
    <UFormGroup label="Name" name="name">
      <div class="flex gap-2">
        <UInput v-model="name" class="flex-1" />
        <UButton :loading="isSaving" @click="save">
          Speichern
        </UButton>
      </div>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
const { household, refresh } = useHousehold()
const toast = useToast()

const name = ref('')
const isSaving = ref(false)

watch(household, (h) => {
  if (h) name.value = h.name
}, { immediate: true })

async function save() {
  isSaving.value = true
  try {
    await $fetch('/api/households', {
      method: 'PUT',
      body: { name: name.value },
    })
    await refresh()
    toast.add({ title: 'Name gespeichert' })
  } catch {
    toast.add({ title: 'Fehler', color: 'red' })
  } finally {
    isSaving.value = false
  }
}
</script>
