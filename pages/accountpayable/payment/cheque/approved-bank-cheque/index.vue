<script setup>
definePageMeta({
  title: "Approved Bank Cheque",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Approved Bank Cheque</div>
      </template>
      <template #body>
        <div>Content for Approved Bank Cheque</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
