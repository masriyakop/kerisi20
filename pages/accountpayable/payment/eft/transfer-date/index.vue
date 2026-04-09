<script setup>
definePageMeta({
  title: "Transfer Date",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Transfer Date</div>
      </template>
      <template #body>
        <div>Content for Transfer Date</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
