<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h2 class="text-lg font-semibold text-white mb-2">Partner einladen</h2>
    <p class="text-sm text-gray-400 mb-4">
      Teile diesen Code mit deinem Partner, damit er dem Haushalt beitreten kann.
    </p>
    <div v-if="household?.shareCode" class="flex items-center gap-3">
      <code class="text-2xl font-mono font-bold tracking-widest text-primary-400 bg-gray-900 px-4 py-2 rounded">
        {{ household.shareCode }}
      </code>
      <UButton
        size="sm"
        variant="ghost"
        icon="i-heroicons-clipboard"
        @click="copy"
      >
        Kopieren
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { household } = useHousehold()
const toast = useToast()

async function copy() {
  if (household.value?.shareCode) {
    await navigator.clipboard.writeText(household.value.shareCode)
    toast.add({ title: 'Code kopiert' })
  }
}
</script>
