<script setup>
definePageMeta({
  title: "Lampiran ABM 7",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Planning", path: "/budget/planning" },
    { name: "Report", path: "/budget/planning/report" },
    { name: "Lampiran ABM 7", path: "/budget/planning/report/lampiran-abm-7" },
  ],
});

const { $swal } = useNuxtApp();

const abmList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  region: "",
  ptj: "",
  status: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredAbmList = ref([...abmList.value]);

const ptjOptions = ref([]);
const statusOptions = ref([]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

const columns = ref([
  { key: "index", label: "No", sortable: false },
  { key: "oun_parent", label: "PTJ", sortable: false },
  { key: "oun_region", label: "Region", sortable: false },
  { key: "ccr_costcentre", label: "ccr_costcentre", sortable: false },
  { key: "oun", label: "Pejabat", sortable: false },
  { key: "total_amt", label: "Amount (RM)", sortable: false },
  { key: "actions", label: "Action", sortable: false },
]);

const fetchDropdownOptions = async () => {
  try {
    const [ptjs, statuses] = await Promise.all([
      useFetch("/api/budget/planning/report/lookups/ptj"),
      useFetch("/api/budget/planning/report/lookups/status"),
    ]);

    if (ptjs.data.value?.statusCode === 200) {
      ptjOptions.value = ptjs.data.value.data.map((item) => ({
        label: `${item.oun_code} - ${item.oun_desc}`,
        value: item.oun_code,
      }));
    }

    if (statuses.data.value?.statusCode === 200) {
      statusOptions.value = statuses.data.value.data.map((item) => ({
        label: item.bpm_status,
        value: item.bpm_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Function to apply filters
const applyFilters = () => {
  let filtered = [...abmList.value];

  // Apply search filter - search all columns
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      // Search across all text fields
      const searchableText = Object.values(item)
        .filter(val => val !== null && val !== undefined && typeof val !== 'object')
        .map(val => String(val).toLowerCase())
        .join(' ');
      
      return searchableText.includes(keyword);
    });
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredAbmList.value = [];
  nextTick(() => {
    filteredAbmList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredAbmList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchLampiranABM7();
}, { deep: true });

const fetchLampiranABM7 = async () => {
  loading.value = true;
  try {
    const query = {};

    if (topFilter.value.region) query.tf_region = topFilter.value.region;
    if (topFilter.value.ptj) query.tf_ptj = topFilter.value.ptj;
    if (topFilter.value.status) query.tf_status = topFilter.value.status;

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null") delete query[key];
    });

    const { data } = await useFetch("/api/budget/planning/report/lampiran-abm-7", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      abmList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        oun_parent: item.oun_parent,
        oun_region: item.oun_region,
        ccr_costcentre: item.ccr_costcentre,
        oun: item.oun,
        total_amt: item.total_amt,
        oun_code: item.oun_code,
        oun_code_parent: item.oun_code_parent,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch Lampiran ABM 7 records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching Lampiran ABM 7 records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching Lampiran ABM 7 records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDropdownOptions();
  fetchLampiranABM7();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchLampiranABM7();
};

const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleDownloadLampiran7 = (ounRegion, ounCode, ounCodeParent) => {
  $swal.fire({
    title: "Info",
    text: "Download functionality will be implemented",
    icon: "info",
  });
};

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="topFilter.region"
              type="text"
              label="Region"
              placeholder="Enter Region"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.ptj"
              type="select"
              label="PTJ"
              :options="ptjOptions"
              placeholder="Select PTJ"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.status"
              type="select"
              label="Status"
              :options="statusOptions"
              placeholder="Select Status"
              outer-class="mb-0 d-none"
            />
          </div>
          <div class="flex justify-end gap-2">
            <rs-button @click="handleSearch" color="primary">Search</rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Listing</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Custom Table Header: Display on left, Search on right -->
          <div class="flex justify-between items-center gap-4 mb-4">
            <!-- Display on Left -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSize"
                :options="[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '25', value: 25 },
                  { label: '50', value: 50 },
                  { label: '100', value: 100 },
                ]"
                outer-class="mb-0"
              />
            </div>

            <!-- Search on Right -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search:</label>
              <FormKit
                v-model="searchKeyword"
                type="text"
                placeholder="Search..."
                outer-class="mb-0"
              >
                <template #suffix>
                  <button
                    v-if="searchKeyword"
                    type="button"
                    @click="searchKeyword = ''"
                    class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon
                      name="material-symbols:close"
                      class="!w-4 !h-4 text-gray-500"
                    />
                  </button>
                </template>
              </FormKit>
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="lampiran-abm-7-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`lampiran-abm-7-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredAbmList"
              :options="{
                variant: 'primary',
                striped: false,
                bordered: false,
                borderless: true,
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: false,
                outsideBorder: false,
              }"
              advanced
              :pageSize="pageSize"
            >
              <template v-slot:no="data">{{ data.value.no }}</template>
              <template v-slot:ounparent="data">{{ data.value.oun_parent }}</template>
              <template v-slot:ounregion="data">{{ data.value.oun_region }}</template>
              <template v-slot:ccrcostcentre="data">{{ data.value.ccr_costcentre }}</template>
              <template v-slot:oun="data">{{ data.value.oun }}</template>
              <template v-slot:totalamt="data">{{ toCurrency(data.value.total_amt) }}</template>
              <template v-slot:action="data">
                <div class="flex items-center gap-2 justify-end">
                  <button
                    @click="handleDownloadLampiran7(data.value.oun_region, data.value.oun_code, data.value.oun_code_parent)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Download Lampiran ABM 7"
                  >
                    <Icon name="ic:round-picture-as-pdf" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
          </div>
        </div>
      </template>
    </rs-card>

  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.lampiran-abm-7-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

