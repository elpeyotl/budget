<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <UCard class="max-w-sm w-full">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Haushalts-Finanz-App</h1>
          <p class="text-sm text-gray-500 mt-1">
            Budget, Vermögen und Sparziele gemeinsam verwalten.
          </p>
        </div>
      </template>

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
        color="white"
        variant="solid"
        icon="i-heroicons-user-circle"
      >
        Mit Google anmelden
      </UButton>
    </UCard>
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
