<script setup>
definePageMeta({
  title: "Journal Payment Reject/Replace",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Journal Payment Reject/Replace</div>
      </template>
      <template #body>
        <div>Content for Journal Payment Reject/Replace</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
