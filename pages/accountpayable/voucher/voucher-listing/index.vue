<script setup>
definePageMeta({
  title: "Voucher Listing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Voucher Listing</div>
      </template>
      <template #body>
        <div>Content for Voucher Listing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
