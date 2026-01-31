<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h2 class="text-lg font-semibold text-white mb-4">Haushaltsprofil</h2>
    <div class="space-y-4">
      <UFormGroup label="Stadt" name="city">
        <UInput v-model="city" placeholder="z.B. Zürich, Basel, Bern" />
      </UFormGroup>
      <UFormGroup label="Zivilstand" name="maritalStatus">
        <USelect
          v-model="maritalStatus"
          :options="maritalOptions"
          option-attribute="label"
          value-attribute="value"
        />
      </UFormGroup>
      <UFormGroup label="Anzahl Kinder" name="childrenCount">
        <UInput
          v-model.number="childrenCount"
          type="number"
          inputmode="numeric"
          min="0"
          max="20"
          placeholder="0"
        />
      </UFormGroup>
      <UButton :loading="isSaving" size="sm" @click="save">
        Speichern
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { household, refresh } = useHousehold()
const toast = useToast()

const city = ref('')
const childrenCount = ref(0)
const maritalStatus = ref('single')
const isSaving = ref(false)

const maritalOptions = [
  { label: 'Ledig', value: 'single' },
  { label: 'Verheiratet', value: 'married' },
  { label: 'Eingetragene Partnerschaft', value: 'partnership' },
]

watch(household, (h) => {
  if (h) {
    city.value = h.city ?? ''
    childrenCount.value = h.childrenCount ?? 0
    maritalStatus.value = h.maritalStatus ?? 'single'
  }
}, { immediate: true })

async function save() {
  isSaving.value = true
  try {
    await $fetch('/api/households', {
      method: 'PUT',
      body: {
        city: city.value || null,
        childrenCount: childrenCount.value,
        maritalStatus: maritalStatus.value,
      },
    })
    await refresh()
    toast.add({ title: 'Profil gespeichert' })
  } catch {
    toast.add({ title: 'Fehler', color: 'red' })
  } finally {
    isSaving.value = false
  }
}
</script>
