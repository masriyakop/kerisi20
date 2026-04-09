<script setup>
definePageMeta({
  title: "List of Voucher Money Transfer",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>List of Voucher Money Transfer</div>
      </template>
      <template #body>
        <div>Content for List of Voucher Money Transfer</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
