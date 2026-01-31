<template>
  <div class="bg-gray-800 rounded-lg p-5">
    <h2 class="text-lg font-semibold text-white mb-2">Konto</h2>
    <div class="flex items-center gap-3">
      <UAvatar
        v-if="user?.avatar"
        :src="user.avatar"
        :alt="user.name"
        size="sm"
      />
      <div>
        <div class="text-gray-200">{{ user?.name }}</div>
        <div class="text-sm text-gray-500">{{ user?.email }}</div>
      </div>
    </div>
    <UButton class="mt-4" color="red" variant="soft" @click="clear">
      Abmelden
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()
</script>
