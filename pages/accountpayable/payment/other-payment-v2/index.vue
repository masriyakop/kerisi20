<script setup>
definePageMeta({
  title: "Other Payment V2",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Other Payment V2</div>
      </template>
      <template #body>
        <div>Content for Other Payment V2</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
