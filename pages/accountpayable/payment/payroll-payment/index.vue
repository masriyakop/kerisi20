<script setup>
definePageMeta({
  title: "Payroll Payment",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payroll Payment</div>
      </template>
      <template #body>
        <div>Content for Payroll Payment</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
