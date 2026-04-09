<script setup>
definePageMeta({
  title: "Listing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Listing</div>
      </template>
      <template #body>
        <div>Content for Listing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
