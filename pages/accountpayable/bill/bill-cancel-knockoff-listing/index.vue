<script setup>
definePageMeta({
  title: "Bill Cancel @ Knockoff Listing",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Bill Cancel @ Knockoff Listing</div>
      </template>
      <template #body>
        <div>Content for Bill Cancel @ Knockoff Listing</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
