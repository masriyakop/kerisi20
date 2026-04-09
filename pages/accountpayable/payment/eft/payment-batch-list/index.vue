<script setup>
definePageMeta({
  title: "Payment Batch List",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment Batch List</div>
      </template>
      <template #body>
        <div>Content for Payment Batch List</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
