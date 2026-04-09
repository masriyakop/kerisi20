<script setup>
definePageMeta({
  title: "Payment Batch Form",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment Batch Form</div>
      </template>
      <template #body>
        <div>Content for Payment Batch Form</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
