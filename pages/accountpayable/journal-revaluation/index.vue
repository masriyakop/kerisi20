<script setup>
definePageMeta({
  title: "Journal Revaluation",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Journal Revaluation</div>
      </template>
      <template #body>
        <div>Content for Journal Revaluation</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
