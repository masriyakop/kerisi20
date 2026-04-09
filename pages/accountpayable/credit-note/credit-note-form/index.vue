<script setup>
definePageMeta({
  title: "Credit Note Form",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Credit Note Form</div>
      </template>
      <template #body>
        <div>Content for Credit Note Form</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
