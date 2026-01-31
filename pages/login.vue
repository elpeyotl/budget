<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="max-w-sm w-full bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div class="text-center mb-6">
        <img src="/logo.svg" alt="Logo" class="w-14 h-14 mx-auto mb-3" />
        <h1 class="text-2xl font-bold text-white">Haushalts-Finanz-App</h1>
        <p class="text-sm text-gray-400 mt-1">
          Budget, Vermögen und Sparziele gemeinsam verwalten.
        </p>
      </div>

      <div v-if="error" class="mb-4">
        <UAlert
          title="Anmeldung fehlgeschlagen"
          description="Bitte versuche es erneut."
          color="red"
          variant="soft"
        />
      </div>

      <UButton
        to="/auth/google"
        external
        block
        size="lg"
        color="primary"
        variant="solid"
        icon="i-heroicons-user-circle"
      >
        Mit Google anmelden
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const error = computed(() => route.query.error === 'auth')

const { loggedIn } = useUserSession()
if (loggedIn.value) {
  navigateTo('/dashboard')
}
</script>
