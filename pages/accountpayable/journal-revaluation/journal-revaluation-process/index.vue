<script setup>
definePageMeta({
  title: "Journal Revaluation Process",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Journal Revaluation Process</div>
      </template>
      <template #body>
        <div>Content for Journal Revaluation Process</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
