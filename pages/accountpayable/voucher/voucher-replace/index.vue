<script setup>
definePageMeta({
  title: "Voucher Replace",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Voucher Replace</div>
      </template>
      <template #body>
        <div>Content for Voucher Replace</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
