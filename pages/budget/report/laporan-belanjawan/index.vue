<script setup>
definePageMeta({
  title: "Laporan Belanjawan",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Budget", path: "/budget" },
    { name: "Report", path: "/budget/report" },
    { name: "Laporan Belanjawan", path: "/budget/report/laporan-belanjawan" },
  ],
});

const { $swal } = useNuxtApp();

const reportList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

const topFilter = ref({
  tf_year: new Date().getFullYear().toString(),
  tf_fund: "",
  tf_account: "",
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

    const { data } = await useFetch("/api/budget/report/laporan-belanjawan", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Fund: item.fund,
        Activty: item.activity,
        'Cost Centre': item.costcentre,
        'Account Series': item.account_siries,
        'Account Code': item.account,
        'Glacct Code': item.glacct_code,
        Opening: parseFloat(item.opening || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Peruntukan  Asal': parseFloat(item.initial || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Peruntukan  Tambahan': parseFloat(item.additional || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Peruntukan  Pindahan': parseFloat(item.virement || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Top Up': parseFloat(item.topup || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Jumlah Peruntukan': parseFloat(item.allocated || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        Locked: parseFloat(item.locked || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Pre Request': parseFloat(item.pre_request || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        Request: parseFloat(item.request || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        Commit: parseFloat(item.commit || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        Belanja: parseFloat(item.expenses || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Baki Peruntukan ': parseFloat(item.balance || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' }),
        'Expense Balance': item.expenses_percentage + '%',
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Year:</label>
            <FormKit v-model="topFilter.tf_year" type="text" placeholder="Enter Year" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Fund:</label>
            <FormKit v-model="topFilter.tf_fund" type="text" placeholder="Enter Fund" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Account:</label>
            <FormKit v-model="topFilter.tf_account" type="text" placeholder="Enter Account" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date From:</label>
            <FormKit v-model="topFilter.date_from" type="date" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date To:</label>
            <FormKit v-model="topFilter.date_to" type="date" outer-class="mb-0" />
          </div>
        </div>
        <div class="flex gap-3 mt-4">
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
          <div class="laporan-belanjawan-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`laporan-belanjawan-table-${searchKeyword || 'all'}-${pageSize}`"
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
              <template v-slot:Fund="data">{{ data.value.Fund }}</template>
              <template v-slot:Activty="data">{{ data.value.Activty }}</template>
              <template v-slot:CostCentre="data">{{ data.value['Cost Centre'] }}</template>
              <template v-slot:AccountSeries="data">{{ data.value['Account Series'] }}</template>
              <template v-slot:AccountCode="data">{{ data.value['Account Code'] }}</template>
              <template v-slot:GlacctCode="data">{{ data.value['Glacct Code'] }}</template>
              <template v-slot:Opening="data">{{ data.value.Opening }}</template>
              <template v-slot:PeruntukanAsal="data">{{ data.value['Peruntukan  Asal'] }}</template>
              <template v-slot:PeruntukanTambahan="data">{{ data.value['Peruntukan  Tambahan'] }}</template>
              <template v-slot:PeruntukanPindahan="data">{{ data.value['Peruntukan  Pindahan'] }}</template>
              <template v-slot:TopUp="data">{{ data.value['Top Up'] }}</template>
              <template v-slot:JumlahPeruntukan="data">{{ data.value['Jumlah Peruntukan'] }}</template>
              <template v-slot:Locked="data">{{ data.value.Locked }}</template>
              <template v-slot:PreRequest="data">{{ data.value['Pre Request'] }}</template>
              <template v-slot:Request="data">{{ data.value.Request }}</template>
              <template v-slot:Commit="data">{{ data.value.Commit }}</template>
              <template v-slot:Belanja="data">{{ data.value.Belanja }}</template>
              <template v-slot:BakiPeruntukan="data">{{ data.value['Baki Peruntukan '] }}</template>
              <template v-slot:ExpenseBalance="data">{{ data.value['Expense Balance'] }}</template>
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
.laporan-belanjawan-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

