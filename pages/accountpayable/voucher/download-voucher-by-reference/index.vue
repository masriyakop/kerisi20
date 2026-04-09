<script setup>
definePageMeta({
  title: "Download Voucher By Reference",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Download Voucher By Reference</div>
      </template>
      <template #body>
        <div>Content for Download Voucher By Reference</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
