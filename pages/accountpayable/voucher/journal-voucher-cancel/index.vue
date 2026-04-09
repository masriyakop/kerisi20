<script setup>
definePageMeta({
  title: "Journal Voucher Cancel",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Journal Voucher Cancel</div>
      </template>
      <template #body>
        <div>Content for Journal Voucher Cancel</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
