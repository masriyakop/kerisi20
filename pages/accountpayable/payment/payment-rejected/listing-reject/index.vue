<script setup>
definePageMeta({
  title: "Listing Reject",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Listing Reject</div>
      </template>
      <template #body>
        <div>Content for Listing Reject</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
