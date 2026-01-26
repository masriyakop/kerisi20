<script setup>
definePageMeta({
  title: "ABM 4",
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
      name: "ABM 4",
      path: "/budget/planning/report/abm-4",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const abmList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Top Filter
const topFilter = ref({
  planningNo: "",
  year: "",
  ptj: "",
  status: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredAbmList = ref([...abmList.value]);

// Dropdown options
const ptjOptions = ref([]);
const statusOptions = ref([]);
const typeOptions = ref([]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Table columns
const columns = ref([
  { key: "index", label: "No", sortable: false },
  { key: "bpm_type", label: "Type", sortable: true },
  { key: "lde_description", label: "Description", sortable: false },
  { key: "oun_code_parent", label: "PTJ", sortable: true },
  { key: "bpm_remark", label: "Remark", sortable: false },
  { key: "bpm_total_amtsemasa", label: "Current Year Amount (RM)", sortable: false },
  { key: "Perjawatansemasa", label: "Current Perjawatan", sortable: false },
  { key: "A", label: "Year- 1 Amount (RM)", sortable: false },
  { key: "B", label: "Year- 1 Perjawatan", sortable: false },
  { key: "C", label: "Year- 2 Amount (RM)", sortable: false },
  { key: "D", label: "Year- 2 Perjawatan", sortable: false },
  { key: "actions", label: "Action", sortable: false },
]);

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    const [ptjs, statuses, types] = await Promise.all([
      useFetch("/api/budget/planning/report/lookups/ptj"),
      useFetch("/api/budget/planning/report/lookups/status"),
      useFetch("/api/budget/planning/report/lookups/vot-type"),
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

    if (types.data.value?.statusCode === 200) {
      typeOptions.value = types.data.value.data.map((item) => ({
        label: `${item.lde_value} - ${item.lde_description}`,
        value: item.lde_value,
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
  fetchABM4();
}, { deep: true });

// Fetch ABM 4 data
const fetchABM4 = async () => {
  loading.value = true;
  try {
    const query = {};

    // Add top filters
    if (topFilter.value.planningNo) {
      query.tf_planningno = topFilter.value.planningNo;
    }
    if (topFilter.value.year) {
      query.tf_year = topFilter.value.year;
    }
    if (topFilter.value.ptj) {
      query.tf_oun_code = topFilter.value.ptj;
    }
    if (topFilter.value.status) {
      query.tf_status = topFilter.value.status;
    }

    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null || query[key] === "null")
        delete query[key];
    });

    const { data } = await useFetch("/api/budget/planning/report/abm-4", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      abmList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        bpm_id: item.bpm_id,
        bpm_type: item.bpm_type,
        lde_description: item.lde_description,
        oun_code_parent: item.oun_code_parent,
        bpm_remark: item.bpm_remark,
        bpm_total_amtsemasa: item.bpm_total_amtsemasa,
        Perjawatansemasa: item.Perjawatansemasa,
        A: item.A,
        B: item.B,
        C: item.C,
        D: item.D,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch ABM 4 records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching ABM 4 records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching ABM 4 records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchDropdownOptions();
  fetchABM4();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchABM4();
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Handle download ABM 4
const handleDownloadABM4 = (ounCodeParent, bpmId) => {
  // TODO: Implement download functionality
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

    <!-- Top Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormKit
              v-model="topFilter.planningNo"
              type="text"
              label="Planning No"
              placeholder="Enter Planning No"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.year"
              type="text"
              label="Planing Year"
              placeholder="Enter Year"
              outer-class="mb-0"
              :validation="'required'"
              :validation-messages="{ required: 'Year is required' }"
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
              outer-class="mb-0"
            />
          </div>
          <div class="flex justify-end gap-2">
            <rs-button @click="handleSearch" color="primary">Search</rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Listing -->
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
          <div class="abm-4-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`abm-4-table-${searchKeyword || 'all'}-${pageSize}`"
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
              <template v-slot:bpmtype="data">{{ data.value.bpm_type }}</template>
              <template v-slot:ldedescription="data">{{ data.value.lde_description }}</template>
              <template v-slot:ouncodeparent="data">{{ data.value.oun_code_parent }}</template>
              <template v-slot:bpmremark="data">{{ data.value.bpm_remark }}</template>
              <template v-slot:bpmtotalamtsemasa="data">{{ toCurrency(data.value.bpm_total_amtsemasa) }}</template>
              <template v-slot:Perjawatansemasa="data">{{ data.value.Perjawatansemasa }}</template>
              <template v-slot:A="data">{{ toCurrency(data.value.A) }}</template>
              <template v-slot:B="data">{{ data.value.B }}</template>
              <template v-slot:C="data">{{ toCurrency(data.value.C) }}</template>
              <template v-slot:D="data">{{ data.value.D }}</template>
              <template v-slot:action="data">
                <div class="flex items-center gap-2 justify-end">
                  <button
                    @click="handleDownloadABM4(data.value.oun_code_parent, data.value.bpm_id)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Download ABM 4"
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
.abm-4-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

