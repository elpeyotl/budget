<template>
  <div />
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
await navigateTo(loggedIn.value ? '/dashboard' : '/login', { redirectCode: 302 })
</script>
