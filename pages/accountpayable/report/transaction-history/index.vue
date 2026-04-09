<script setup>
definePageMeta({
  title: "Transaction History",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Transaction History</div>
      </template>
      <template #body>
        <div>Content for Transaction History</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
