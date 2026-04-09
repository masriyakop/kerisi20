<script setup>
definePageMeta({
  title: "Payee Registration (Others)",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payee Registration (Others)</div>
      </template>
      <template #body>
        <div>Content for Payee Registration (Others)</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
