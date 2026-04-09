<script setup>
definePageMeta({
  title: "Loan Disbursement",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Loan Disbursement</div>
      </template>
      <template #body>
        <div>Content for Loan Disbursement</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
