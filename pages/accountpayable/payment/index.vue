<script setup>
definePageMeta({
  title: "Payment",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment</div>
      </template>
      <template #body>
        <div>Content for Payment</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
