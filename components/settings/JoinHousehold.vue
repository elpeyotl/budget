<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h2 class="text-lg font-semibold text-white mb-2">Haushalt beitreten</h2>
    <p class="text-sm text-gray-400 mb-4">
      Hast du einen Einladungscode erhalten?
    </p>
    <div class="flex gap-2">
      <UInput
        v-model="code"
        placeholder="CODE"
        class="flex-1 font-mono uppercase"
        maxlength="6"
      />
      <UButton
        :disabled="code.length !== 6"
        :loading="isJoining"
        @click="join"
      >
        Beitreten
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { refresh } = useHousehold()
const toast = useToast()

const code = ref('')
const isJoining = ref(false)

async function join() {
  isJoining.value = true
  try {
    await $fetch('/api/households/join', {
      method: 'POST',
      body: { shareCode: code.value },
    })
    await refresh()
    toast.add({ title: 'Haushalt beigetreten!' })
    code.value = ''
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? 'Fehler'
    toast.add({ title: msg, color: 'red' })
  } finally {
    isJoining.value = false
  }
}
</script>
