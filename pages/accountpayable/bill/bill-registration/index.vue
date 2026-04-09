<script setup>
definePageMeta({
  title: "Bill Registration",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Bill Registration</div>
      </template>
      <template #body>
        <div>Content for Bill Registration</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
