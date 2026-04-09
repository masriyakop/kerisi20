<script setup>
definePageMeta({
  title: "Listing of Payee old",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Listing of Payee old</div>
      </template>
      <template #body>
        <div>Content for Listing of Payee old</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
