<template>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Gesamtvermögen</div>
      <div class="text-2xl font-bold text-white">
        {{ formatMoney(netWorthTotal) }}
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Liquide Mittel</div>
      <div class="text-xl font-bold text-green-400">
        {{ formatMoney(liquidTotal) }}
      </div>
    </div>
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="text-sm text-gray-400">Investiert</div>
      <div class="text-xl font-bold text-blue-400">
        {{ formatMoney(investedTotal) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { netWorthTotal, liquidTotal, investedTotal } = useAccounts()
const { formatMoney } = useFormatters()
</script>
