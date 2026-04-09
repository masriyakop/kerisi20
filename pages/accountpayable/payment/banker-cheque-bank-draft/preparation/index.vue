<script setup>
definePageMeta({
  title: "Preparation",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Preparation</div>
      </template>
      <template #body>
        <div>Content for Preparation</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
