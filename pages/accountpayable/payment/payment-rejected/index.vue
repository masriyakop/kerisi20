<script setup>
definePageMeta({
  title: "Payment Rejected",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment Rejected</div>
      </template>
      <template #body>
        <div>Content for Payment Rejected</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
