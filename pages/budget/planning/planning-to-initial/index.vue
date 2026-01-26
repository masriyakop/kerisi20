<script setup>
definePageMeta({
  title: "Planning to Initial",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Planning", path: "/budget/planning" },
    { name: "Planning to Initial", path: "/budget/planning/planning-to-initial" },
  ],
});

const { $swal } = useNuxtApp();

const form = ref({
  planning_year: new Date().getFullYear().toString(),
  status: "DRAFT",
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    $swal.fire({
      title: "Success",
      text: "Planning converted to initial successfully",
      icon: "success",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error converting planning:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while converting planning",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Planning to Initial</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Planning Year<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit v-model="form.planning_year" type="text" validation="required" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Status:</label>
              <div class="flex-1">
                <FormKit v-model="form.status" type="text" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <rs-button variant="primary" @click="handleSubmit" :disabled="loading">
                {{ loading ? "Processing..." : "Convert to Initial" }}
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

