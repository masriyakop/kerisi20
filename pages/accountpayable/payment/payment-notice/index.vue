<script setup>
definePageMeta({
  title: "Payment Notice",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payment Notice</div>
      </template>
      <template #body>
        <div>Content for Payment Notice</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
