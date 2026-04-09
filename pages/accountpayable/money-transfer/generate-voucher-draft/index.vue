<script setup>
definePageMeta({
  title: "Generate Voucher Draft",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Generate Voucher Draft</div>
      </template>
      <template #body>
        <div>Content for Generate Voucher Draft</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
