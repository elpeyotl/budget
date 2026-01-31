<template>
  <nav class="border-b border-gray-700 bg-gray-800 hidden md:block">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-4">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="py-3 px-1 text-sm font-medium border-b-2 transition-colors"
          :class="isActive(link.to)
            ? 'border-primary-400 text-primary-400'
            : 'border-transparent text-gray-400 hover:text-gray-200'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/dashboard', label: 'Budget' },
  { to: '/dashboard/vermoegen', label: 'Vermögen' },
  { to: '/dashboard/ziele', label: 'Ziele' },
  { to: '/settings', label: 'Einstellungen' },
]

function isActive(path: string) {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>
