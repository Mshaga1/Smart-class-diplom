<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

await navigateTo('/classrooms', { replace: true })
</script>

<template>
  <div />
</template>
