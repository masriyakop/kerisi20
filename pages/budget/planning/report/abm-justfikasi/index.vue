<script setup>
definePageMeta({
  title: "ABM Justfikasi",
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
      name: "ABM Justfikasi",
      path: "/budget/planning/report/abm-justfikasi",
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
  fundType: "",
  activity: "",
  ptj: "",
  costCentre: "",
  budgetCode: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredABMList = ref([...abmList.value]);

// Dropdown options
const fundTypeOptions = ref([]);
const ptjOptions = ref([]);
const costCentreOptions = ref([]);
const activityOptions = ref([]);
const budgetCodeOptions = ref([]);
const statusOptions = ref([
  { label: "DRAFT", value: "DRAFT" },
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    const [fundTypes, ptjs, budgetCodes] = await Promise.all([
      useFetch("/api/budget/planning/report/lookups/fund-type"),
      useFetch("/api/budget/planning/report/lookups/ptj"),
      useFetch("/api/budget/setup/budget-code", { query: { pageSize: 1000 } }),
    ]);

    if (fundTypes.data.value?.statusCode === 200) {
      fundTypeOptions.value = fundTypes.data.value.data || [];
    }
    if (ptjs.data.value?.statusCode === 200) {
      ptjOptions.value = ptjs.data.value.data || [];
    }
    if (budgetCodes.data.value?.statusCode === 200) {
      budgetCodeOptions.value = (budgetCodes.data.value.data || []).map((item) => ({
        label: item.lbc_budget_code,
        value: item.lbc_budget_code,
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
  filteredABMList.value = [];
  nextTick(() => {
    filteredABMList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredABMList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchABMJustfikasi();
}, { deep: true });

// Fetch ABM Justfikasi records from API
const fetchABMJustfikasi = async () => {
  try {
    loading.value = true;
    const query = {};

    // Add top filters
    if (topFilter.value.planningNo) {
      query.tf_planningno = topFilter.value.planningNo;
    }
    if (topFilter.value.year) {
      query.tf_year = topFilter.value.year;
    }
    if (topFilter.value.fundType) {
      query.tf_fty_fund_type = topFilter.value.fundType;
    }
    if (topFilter.value.activity) {
      query.ft_at_activity_code = topFilter.value.activity;
    }
    if (topFilter.value.ptj) {
      query.ft_bpm_oun_code = topFilter.value.ptj;
    }
    if (topFilter.value.costCentre) {
      query.ft_bpm_ccr_costcentre = topFilter.value.costCentre;
    }
    if (topFilter.value.budgetCode) {
      query.ft_lbc_budget_code = topFilter.value.budgetCode;
    }

    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === null || query[key] === 'null') delete query[key];
    });

    const { data } = await useFetch("/api/budget/planning/report/abm-justfikasi", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      abmList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        'Application No': item.bpm_planning_no,
        Type: item.bpm_type,
        PTJ: item.bpm_oun_code,
        'Cost Center': item.bpm_ccr_costcentre,
        Activity: item.at_activity_code,
        'Budget Code': item.lbc_budget_code,
        Status: item.bpm_status,
        'Amount (RM)': item.bpm_total_amt,
        url_view: item.url_view,
        bpm_id: item.bpm_id,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch ABM Justfikasi records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching ABM Justfikasi records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching ABM Justfikasi records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchDropdownOptions();
  fetchABMJustfikasi();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchABMJustfikasi();
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Handle download Justifikasi
const handleDownloadJustifikasi = (bpmId) => {
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
              label="Year"
              placeholder="Enter Year"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.fundType"
              type="select"
              label="Fund Type"
              :options="fundTypeOptions"
              placeholder="Select Fund Type"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.activity"
              type="select"
              label="Activity"
              :options="activityOptions"
              placeholder="Select Activity"
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
              v-model="topFilter.costCentre"
              type="select"
              label="Cost Centre"
              :options="costCentreOptions"
              placeholder="Select Cost Centre"
              outer-class="mb-0"
            />
            <FormKit
              v-model="topFilter.budgetCode"
              type="select"
              label="Budget Code"
              :options="budgetCodeOptions"
              placeholder="Select Budget Code"
              outer-class="mb-0"
            />
          </div>
          <div class="flex justify-end gap-3">
            <rs-button variant="primary" @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Search
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ABM Justfikasi Listing -->
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
          <div class="abm-justfikasi-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`abm-justfikasi-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredABMList"
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
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:ApplicationNo="data">
                {{ data.value['Application No'] }}
              </template>
              <template v-slot:Type="data">
                {{ data.value.Type }}
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
              </template>
              <template v-slot:CostCenter="data">
                {{ data.value['Cost Center'] }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value.Activity }}
              </template>
              <template v-slot:BudgetCode="data">
                {{ data.value['Budget Code'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': data.value.Status === 'DRAFT',
                    'text-green-600 dark:text-green-400': data.value.Status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.Status === 'REJECTED',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:AmountRM="data">
                {{ toCurrency(data.value['Amount (RM)']) }}
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="navigateTo(data.value.url_view)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon
                      name="material-symbols:visibility"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleDownloadJustifikasi(data.value.bpm_id)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Download ABM Justfikasi"
                  >
                    <Icon
                      name="material-symbols:picture-as-pdf"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
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
.abm-justfikasi-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

