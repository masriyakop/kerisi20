<script setup>
definePageMeta({
  title: "Pembayaran Bil dan Tuntutan",
  middleware: ["auth"],
  requiresAuth: true,
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div>Pembayaran Bil dan Tuntutan</div>
      </template>
      <template #body>
        <div>Content for Pembayaran Bil dan Tuntutan</div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped></style>
