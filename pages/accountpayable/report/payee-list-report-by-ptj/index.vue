<script setup>
definePageMeta({
  title: "Payee List Report by PTJ",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Payee List Report by PTJ</div>
      </template>
      <template #body>
        <div>Content for Payee List Report by PTJ</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
