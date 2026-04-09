<script setup>
definePageMeta({
  title: "Voucher",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Voucher</div>
      </template>
      <template #body>
        <div>Content for Voucher</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
