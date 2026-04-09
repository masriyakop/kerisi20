<script setup>
definePageMeta({
  title: "PTJ VOT Information",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>PTJ VOT Information</div>
      </template>
      <template #body>
        <div>Content for PTJ VOT Information</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
