<script setup>
definePageMeta({
  title: "Account Bank by Payee",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Account Bank by Payee</div>
      </template>
      <template #body>
        <div>Content for Account Bank by Payee</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
