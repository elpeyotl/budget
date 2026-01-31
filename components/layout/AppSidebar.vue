<template>
  <USlideover v-model="isOpen" side="left">
    <UCard class="h-full bg-gray-800">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" class="w-7 h-7" />
            <span class="text-lg font-bold text-white">Navigation</span>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            size="sm"
            @click="isOpen = false"
          />
        </div>
      </template>

      <nav class="space-y-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
          :class="isActive(link.to)
            ? 'bg-primary-500/10 text-primary-400'
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
          @click="isOpen = false"
        >
          <UIcon :name="link.icon" class="text-lg" />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <template #footer>
        <div class="flex items-center gap-3">
          <UAvatar
            v-if="user?.avatar"
            :src="user.avatar"
            :alt="user.name"
            size="sm"
          />
          <span class="text-sm text-gray-300 flex-1 truncate">
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
      </template>
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>()
const route = useRoute()
const { user, clear } = useUserSession()

const links = [
  { to: '/dashboard', label: 'Budget', icon: 'i-heroicons-calculator' },
  { to: '/dashboard/vermoegen', label: 'Vermögen', icon: 'i-heroicons-banknotes' },
  { to: '/dashboard/ziele', label: 'Ziele', icon: 'i-heroicons-flag' },
  { to: '/settings', label: 'Einstellungen', icon: 'i-heroicons-cog-6-tooth' },
]

function isActive(path: string) {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>
