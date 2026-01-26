<script setup>
definePageMeta({
  title: "Process Closing",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Order", path: "/purchasing/purchase-order" },
    { name: "Closing", path: "/purchasing/purchase-order/closing" },
    { name: "Process Closing", path: "/purchasing/purchase-order/closing/process-closing" },
  ],
});

const { $swal } = useNuxtApp();

// Filter form
const filterForm = ref({
  year: new Date().getFullYear().toString(),
});

// Process messages
const msgStartProcess = ref("");
const msgPOReverse = ref("");
const loading = ref(false);

// Handle PO Process
const handlePOProcess = async () => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to start PO Process?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, process!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      msgStartProcess.value = "";
      
      const { data } = await useFetch("/api/purchasing/purchase-order/closing/process-closing/po-process", {
        method: "POST",
        body: {
          year: filterForm.value.year,
        },
        initialCache: false,
      });

      if (data.value?.status === 'ok') {
        msgStartProcess.value = data.value.successmessage || "Process completed successfully";
        $swal.fire({
          title: "Success",
          text: data.value.successmessage || "PO Process completed successfully",
          icon: "success",
        });
      } else {
        msgStartProcess.value = data.value?.errorMessage || "Process failed";
        $swal.fire({
          title: "Error",
          text: data.value?.errorMessage || "Failed to process PO",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error processing PO:", error);
      msgStartProcess.value = "An error occurred while processing PO";
      $swal.fire({
        title: "Error",
        text: "An error occurred while processing PO",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Handle PO Reverse
const handlePOReverse = async () => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to start PO Reverse?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, reverse!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      msgPOReverse.value = "";
      
      const { data } = await useFetch("/api/purchasing/purchase-order/closing/process-closing/po-reverse", {
        method: "POST",
        body: {
          year: filterForm.value.year,
        },
        initialCache: false,
      });

      if (data.value?.status === 'ok') {
        msgPOReverse.value = data.value.successmessage || "Reverse completed successfully";
        $swal.fire({
          title: "Success",
          text: data.value.successmessage || "PO Reverse completed successfully",
          icon: "success",
        });
      } else {
        msgPOReverse.value = data.value?.errorMessage || "Reverse failed";
        $swal.fire({
          title: "Error",
          text: data.value?.errorMessage || "Failed to reverse PO",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error reversing PO:", error);
      msgPOReverse.value = "An error occurred while reversing PO";
      $swal.fire({
        title: "Error",
        text: "An error occurred while reversing PO",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Handle Download CSV
const handleDownloadCSV = () => {
  $swal.fire({
    title: "Info",
    text: "CSV download functionality will be implemented",
    icon: "info",
  });
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Filter</div>
      </template>
      <template #body>
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Year:</label>
            <FormKit
              v-model="filterForm.year"
              type="text"
              disabled
              outer-class="mb-0"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Closing Process -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Closing Process</div>
      </template>
      <template #body>
        <div class="row p-2 d-flex justify-content-center">
          <div class="col-sm-3">
            <rs-button
              variant="primary"
              class="w-full"
              @click="handlePOProcess"
              :disabled="loading"
            >
              PO Process
            </rs-button>
            <FormKit
              v-model="msgStartProcess"
              type="text"
              disabled
              outer-class="mt-2 mb-0"
            />
          </div>
          <div class="col-sm-3">
            <rs-button
              variant="primary"
              class="w-full"
              @click="handlePOReverse"
              :disabled="loading"
            >
              PO Reverse
            </rs-button>
            <FormKit
              v-model="msgPOReverse"
              type="text"
              disabled
              outer-class="mt-2 mb-0"
            />
          </div>
          <div class="col-sm-3">
            <rs-button
              variant="primary"
              class="w-full"
              @click="handleDownloadCSV"
            >
              <Icon name="material-symbols:print" class="mr-2" size="1rem" />
              Download CSV
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}

.col-sm-3 {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 15px;
}

@media (max-width: 768px) {
  .col-sm-3 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
