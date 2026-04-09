<script setup>
definePageMeta({
  title: "Credit Note Cancellation",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Credit Note Cancellation</div>
      </template>
      <template #body>
        <div>Content for Credit Note Cancellation</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
