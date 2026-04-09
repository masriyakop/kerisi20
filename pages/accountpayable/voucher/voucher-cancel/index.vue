<script setup>
definePageMeta({
  title: "Voucher Cancel",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Voucher Cancel</div>
      </template>
      <template #body>
        <div>Content for Voucher Cancel</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
