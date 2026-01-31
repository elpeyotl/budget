<template>
  <header class="border-b border-gray-700 bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <UButton
          class="md:hidden"
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="gray"
          size="sm"
          @click="sidebarOpen = true"
        />
        <h1 class="text-lg font-bold text-white">Haushalts-Finanz-App</h1>
      </div>
      <div class="flex items-center gap-3">
        <UAvatar
          v-if="user?.avatar"
          :src="user.avatar"
          :alt="user.name"
          size="sm"
        />
        <span class="text-sm text-gray-300 hidden sm:inline">
          {{ user?.name }}
        </span>
        <UButton
          size="xs"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-right-start-on-rectangle"
          @click="clear"
        />
      </div>
    </div>
    <LayoutAppSidebar v-model="sidebarOpen" />
  </header>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()
const sidebarOpen = ref(false)
</script>
