<script setup>
definePageMeta({
  title: "Voucher Registration",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Voucher Registration</div>
      </template>
      <template #body>
        <div>Content for Voucher Registration</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
