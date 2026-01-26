<script setup>
definePageMeta({
  title: "Expenditure and Balance of Allocation",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Expenditure and Balance of Allocation", path: "/budget/report/expenditure-and-balance-of-allocation" },
  ],
});

const { $swal } = useNuxtApp();

const reportList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  bdg_year: new Date().getFullYear().toString(),
  Fund: "",
  Activity: "",
  oun_code: "",
  Cost_Center: "",
  date_from: "",
  date_to: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredReportList = ref([...reportList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...reportList.value];

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
  filteredReportList.value = [];
  nextTick(() => {
    filteredReportList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredReportList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch topFilter and fetch when it changes
watch(topFilter, () => {
  fetchReport();
}, { deep: true });

const fetchReport = async () => {
  try {
    loading.value = true;
    const query = { ...topFilter.value };

    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === null) delete query[key];
    });

    const { data } = await useFetch("/api/budget/report/total-allocation-expenditure-balance", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Budget Code': item.lbc_budget_code,
        'Description of Budget': item.lbc_description,
        'Fund Type': item.fty_fund_type,
        PTJ: item.oun_code,
        'Cost Center': item.ccr_costcentre,
        'Activity Code': item.at_activity_code,
        'Opening (RM)': parseFloat(item.opening || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Allocated (RM)': parseFloat(item.allocated || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Commit (RM)': parseFloat(item.commits || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Expenses (RM)': parseFloat(item.expenses || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Total Expenses (RM)': parseFloat(item.total_expenses || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Balance (RM)': parseFloat(item.balance || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
      }));
      applyFilters();
    }
  } catch (error) {
    console.error("Error fetching report:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReport();
});

// Handle search - trigger fetch with top filter
const handleSearch = () => {
  fetchReport();
};

const downloadCSV = () => {
  console.log("Downloading CSV");
};

const downloadPDF = () => {
  console.log("Downloading PDF");
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Report Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Report Filter</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">Year<span class="text-red-500"> *</span>:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.bdg_year" type="text" validation="required" placeholder="Select Year" outer-class="mb-0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">Fund:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.Fund" type="text" placeholder="Select Fund" outer-class="mb-0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">Activity:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.Activity" type="text" placeholder="Select Activity" outer-class="mb-0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">PTJ:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.oun_code" type="text" placeholder="Select PTJ" outer-class="mb-0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">Cost Center:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.Cost_Center" type="text" placeholder="Select Cost Center" outer-class="mb-0" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <label class="w-32 text-sm font-medium">Date From:</label>
            <div class="flex-1">
              <FormKit v-model="topFilter.date_from" type="date" outer-class="mb-0" />
            </div>
            <span class="text-sm font-medium mx-2">to</span>
            <div class="flex-1">
              <FormKit v-model="topFilter.date_to" type="date" outer-class="mb-0" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <rs-button @click="downloadCSV">
            <Icon name="material-symbols:download" class="mr-1" size="1rem" />
            Download CSV
          </rs-button>
          <rs-button @click="downloadPDF">
            <Icon name="material-symbols:description" class="mr-1" size="1rem" />
            Download PDF
          </rs-button>
          <rs-button @click="handleSearch">
            <Icon name="material-symbols:search" class="mr-1" size="1rem" />
            Search
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Report Table -->
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
          <div class="expenditure-balance-allocation-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`expenditure-balance-allocation-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredReportList"
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
              <template v-slot:BudgetCode="data">{{ data.value['Budget Code'] }}</template>
              <template v-slot:DescriptionofBudget="data">{{ data.value['Description of Budget'] }}</template>
              <template v-slot:FundType="data">{{ data.value['Fund Type'] }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:CostCenter="data">{{ data.value['Cost Center'] }}</template>
              <template v-slot:ActivityCode="data">{{ data.value['Activity Code'] }}</template>
              <template v-slot:OpeningRM="data">{{ data.value['Opening (RM)'] }}</template>
              <template v-slot:AllocatedRM="data">{{ data.value['Allocated (RM)'] }}</template>
              <template v-slot:CommitRM="data">{{ data.value['Commit (RM)'] }}</template>
              <template v-slot:ExpensesRM="data">{{ data.value['Expenses (RM)'] }}</template>
              <template v-slot:TotalExpensesRM="data">{{ data.value['Total Expenses (RM)'] }}</template>
              <template v-slot:BalanceRM="data">{{ data.value['Balance (RM)'] }}</template>
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
.expenditure-balance-allocation-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

