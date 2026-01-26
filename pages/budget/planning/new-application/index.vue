<script setup>
definePageMeta({
  title: "New Application",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Planning", path: "/budget/planning" },
    { name: "New Application", path: "/budget/planning/new-application" },
  ],
});

const { $swal } = useNuxtApp();

const form = ref({
  reference_no: "",
  year: new Date().getFullYear().toString(),
  ptj_code: "",
  ptj_name: "",
  fund: "",
  activity: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/planning/new-application", {
      method: "POST",
      body: form.value,
      initialCache: false,
    });

    if (data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: "New application created successfully",
        icon: "success",
        timer: 2000,
      });
      // Reset form
      form.value = {
        reference_no: "",
        year: new Date().getFullYear().toString(),
        ptj_code: "",
        ptj_name: "",
        fund: "",
        activity: "",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to create application",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error creating application:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while creating application",
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
        <div class="text-lg font-semibold">Planning Info</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Reference No:</label>
              <div class="flex-1">
                <FormKit v-model="form.reference_no" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Year:</label>
              <div class="flex-1">
                <FormKit v-model="form.year" type="text" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">PTJ Code:</label>
              <div class="flex-1">
                <FormKit v-model="form.ptj_code" type="text" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">PTJ Name:</label>
              <div class="flex-1">
                <FormKit v-model="form.ptj_name" type="text" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Fund<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit v-model="form.fund" type="text" validation="required" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-48 text-sm font-medium">Activity<span class="text-red-500"> *</span>:</label>
              <div class="flex-1">
                <FormKit v-model="form.activity" type="text" validation="required" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <rs-button variant="primary" @click="handleSubmit" :disabled="loading">
                {{ loading ? "Submitting..." : "Submit" }}
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

