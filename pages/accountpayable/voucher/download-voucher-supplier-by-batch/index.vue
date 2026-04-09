<script setup>
definePageMeta({
  title: "Download Voucher Supplier By Batch",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Download Voucher Supplier By Batch</div>
      </template>
      <template #body>
        <div>Content for Download Voucher Supplier By Batch</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
