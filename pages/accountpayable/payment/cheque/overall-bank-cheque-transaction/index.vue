<script setup>
definePageMeta({
  title: "Overall Bank Cheque Transaction",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Overall Bank Cheque Transaction</div>
      </template>
      <template #body>
        <div>Content for Overall Bank Cheque Transaction</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
