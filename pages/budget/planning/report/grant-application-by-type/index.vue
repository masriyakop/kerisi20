<script setup>
definePageMeta({
  title: "Grant Application by Type",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Planning",
      path: "/budget/planning",
    },
    {
      name: "Report",
      path: "/budget/planning/report",
    },
    {
      name: "Grant Application by Type",
      path: "/budget/planning/report/grant-application-by-type",
    },
  ],
});

const { $swal } = useNuxtApp();

// Form state
const filterForm = ref({
  year: new Date().getFullYear().toString(),
  votType: "",
  fund: "",
  ptj: "",
});

// Dropdown options
const votTypeOptions = ref([]);
const fundOptions = ref([]);
const ptjOptions = ref([]);

// Loading state
const loading = ref(false);

// Fetch dropdown options
const fetchVOTTypes = async () => {
  try {
    const { data } = await useFetch("/api/budget/planning/report/lookups/vot-type", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      votTypeOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching VOT Type options:", error);
  }
};

const fetchFundTypes = async () => {
  try {
    const { data } = await useFetch("/api/budget/planning/report/lookups/fund-type", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      fundOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching Fund Type options:", error);
  }
};

const fetchPTJOptions = async () => {
  try {
    const { data } = await useFetch("/api/budget/planning/report/lookups/ptj", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      ptjOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
  }
};

// Handle CSV download
const handleDownloadCSV = async () => {
  if (!filterForm.value.year || !filterForm.value.fund) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in required fields (Year and Fund)",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    // TODO: Implement CSV download API call
    $swal.fire({
      title: "Info",
      text: "CSV download functionality will be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error downloading CSV:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while downloading CSV",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle PDF download
const handleDownloadPDF = async () => {
  if (!filterForm.value.year || !filterForm.value.fund) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in required fields (Year and Fund)",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    // TODO: Implement PDF download API call
    $swal.fire({
      title: "Info",
      text: "PDF download functionality will be implemented",
      icon: "info",
    });
  } catch (error) {
    console.error("Error downloading PDF:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while downloading PDF",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchVOTTypes();
  fetchFundTypes();
  fetchPTJOptions();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Top Filter Form -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Year -->
              <div class="md:col-span-1">
                <label class="block text-sm font-medium mb-2">
                  Year<span class="text-red-500"> *</span>:
                </label>
                <FormKit
                  v-model="filterForm.year"
                  type="text"
                  placeholder="Enter Year"
                  validation="required"
                  outer-class="mb-0"
                />
              </div>

              <!-- VOT Type -->
              <div>
                <label class="block text-sm font-medium mb-2">VOT Type:</label>
                <FormKit
                  v-model="filterForm.votType"
                  type="select"
                  :options="votTypeOptions"
                  placeholder="Select VOT Type"
                  outer-class="mb-0"
                />
              </div>

              <!-- Fund -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Fund<span class="text-red-500"> *</span>:
                </label>
                <FormKit
                  v-model="filterForm.fund"
                  type="select"
                  :options="fundOptions"
                  placeholder="Select Fund"
                  validation="required"
                  outer-class="mb-0"
                />
              </div>

              <!-- PTJ -->
              <div>
                <label class="block text-sm font-medium mb-2">PTJ:</label>
                <FormKit
                  v-model="filterForm.ptj"
                  type="select"
                  :options="ptjOptions"
                  placeholder="Select PTJ"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Download Buttons -->
            <div class="flex justify-end gap-3 mt-4">
              <rs-button
                variant="primary"
                @click="handleDownloadCSV"
                :disabled="loading"
              >
                <Icon name="material-symbols:file-download" class="mr-1" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button
                variant="primary"
                @click="handleDownloadPDF"
                :disabled="loading"
              >
                <Icon name="material-symbols:picture-as-pdf" class="mr-1" size="1rem" />
                Download PDF
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

