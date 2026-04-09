<script setup>
definePageMeta({
  title: "Bank Cheque To Print or To Cancel",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Bank Cheque To Print or To Cancel</div>
      </template>
      <template #body>
        <div>Content for Bank Cheque To Print or To Cancel</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
