<template>
  <div>
    <h1 class="text-xl font-bold text-white mb-6">Einstellungen</h1>
    <div class="space-y-6 max-w-lg">
      <SettingsHouseholdName />
      <SettingsShareCode />
      <SettingsJoinHousehold />

      <div class="bg-gray-800 rounded-lg p-5">
        <h2 class="text-lg font-semibold text-white mb-4">Personen</h2>
        <div class="space-y-2">
          <div
            v-for="person in persons"
            :key="person.id"
            class="flex items-center gap-3 py-2"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: person.color }"
            />
            <span class="text-gray-200">{{ person.name }}</span>
          </div>
        </div>
      </div>

      <SettingsAccountInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { persons } = usePersons()
</script>
