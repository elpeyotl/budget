<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Einnahmen</div>
      <div class="text-xl font-bold text-green-400">
        {{ formatMoney(totalIncome) }}
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Ausgaben</div>
      <div class="text-xl font-bold text-red-400">
        {{ formatMoney(totalExpenses) }}
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Sparen</div>
      <div class="text-xl font-bold text-blue-400">
        {{ formatMoney(totalSavings) }}
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Verfügbar</div>
      <div
        class="text-xl font-bold"
        :class="monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'"
      >
        {{ formatMoney(monthlyBalance) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { totalIncome, totalExpenses, totalSavings, monthlyBalance } = useBudget()
const { formatMoney } = useFormatters()
</script>
