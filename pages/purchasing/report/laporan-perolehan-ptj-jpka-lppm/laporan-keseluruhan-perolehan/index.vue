<script setup>
definePageMeta({
  title: "Laporan Keseluruhan Perolehan",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Report", path: "/purchasing/report" },
    { name: "Laporan Perolehan PTJ JPKA: LPPM", path: "/purchasing/report/laporan-perolehan-ptj-jpka-lppm" },
    { name: "Laporan Keseluruhan Perolehan", path: "/purchasing/report/laporan-perolehan-ptj-jpka-lppm/laporan-keseluruhan-perolehan" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const reportList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(5);

// Top Filter
const topFilter = ref({
  updateddateFromRM: "",
  updateddateToRM: "",
  updateddateFrom: "",
  updateddateTo: "",
  acm_acct_desc: "",
  rqm_requisition_no: "",
  pom_order_no: "",
  status: "",
});

// Fund options
const fundOptions = ref([
  { label: "E01", value: "E01" },
  { label: "OTHERS", value: "Other" },
]);

// Filtered data
const filteredReportList = ref([...reportList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...reportList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const searchableFields = [
        item["Kod Akaun"],
        item["Jenis Perbelanjaan"],
        item["No PRE"],
        item["No POR"],
        item["Status PRE"],
        item["Status POR"],
        item["Status Pembekal"],
      ].map(f => (f || "").toString().toLowerCase());

      return searchableFields.some(field => field.includes(keyword));
    });
  }

  filteredReportList.value = [];
  nextTick(() => {
    filteredReportList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredReportList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(topFilter, () => {
  fetchReport();
}, { deep: true });

// Currency formatter
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  } catch {
    return dateString;
  }
};

// Fetch report data
const fetchReport = async () => {
  try {
    loading.value = true;
    const query = {
      search: searchKeyword.value || undefined,
      updateddateFromRM: topFilter.value.updateddateFromRM || undefined,
      updateddateToRM: topFilter.value.updateddateToRM || undefined,
      updateddateFrom: topFilter.value.updateddateFrom || undefined,
      updateddateTo: topFilter.value.updateddateTo || undefined,
      acm_acct_desc: topFilter.value.acm_acct_desc || undefined,
      rqm_requisition_no: topFilter.value.rqm_requisition_no || undefined,
      pom_order_no: topFilter.value.pom_order_no || undefined,
      status: topFilter.value.status || undefined,
    };

    const { data } = await useFetch("/api/purchasing/report/laporan-perolehan-ptj-jpka-lppm/laporan-keseluruhan-perolehan", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      reportList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ...item,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch report data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching report data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReport();
});

// Download functions
const handleDownloadPDF = () => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
};

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

    <!-- Top Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Tarikh PRE Dari:</label>
            <div class="flex items-center gap-2">
              <FormKit
                v-model="topFilter.updateddateFromRM"
                type="date"
                outer-class="mb-0 flex-1"
              />
              <span class="px-2">Hingga</span>
              <FormKit
                v-model="topFilter.updateddateToRM"
                type="date"
                outer-class="mb-0 flex-1"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Tarikh POR Dari:</label>
            <div class="flex items-center gap-2">
              <FormKit
                v-model="topFilter.updateddateFrom"
                type="date"
                outer-class="mb-0 flex-1"
              />
              <span class="px-2">Hingga</span>
              <FormKit
                v-model="topFilter.updateddateTo"
                type="date"
                outer-class="mb-0 flex-1"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Kod Akaun:</label>
            <FormKit
              v-model="topFilter.acm_acct_desc"
              type="text"
              placeholder="Enter Kod Akaun"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">No PRE:</label>
            <FormKit
              v-model="topFilter.rqm_requisition_no"
              type="text"
              placeholder="Enter No PRE"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">No POR:</label>
            <FormKit
              v-model="topFilter.pom_order_no"
              type="text"
              placeholder="Enter No POR"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Status Pembekal:</label>
            <FormKit
              v-model="topFilter.status"
              type="select"
              :options="[]"
              placeholder="Select Status Pembekal"
              outer-class="mb-0"
            />
          </div>
        </div>
        <div class="mt-4">
          <rs-button @click="fetchReport">
            <Icon name="material-symbols:search" class="mr-1" size="1rem" />
            Search
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Report List -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Laporan Jumlah Keseluruhan Perolehan</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
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

          <div class="laporan-keseluruhan-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`laporan-keseluruhan-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredReportList"
              :field="['no', 'Kod Akaun', 'Jenis Perbelanjaan', 'No PRE', 'Bill PRE', 'Amaun  PRE (RM)', 'Status PRE', 'No POR', 'Bill POR', 'Amaun POR (RM)', 'Status POR', 'Status Pembekal']"
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
              :hideTableSearch="true"
              :hideTablePageSize="true"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:KodAkaun="data">
                {{ data.value['Kod Akaun'] }}
              </template>
              <template v-slot:JenisPerbelanjaan="data">
                {{ data.value['Jenis Perbelanjaan'] }}
              </template>
              <template v-slot:NoPRE="data">
                <div v-if="data.value['No PRE']" class="text-nowrap">
                  <div v-for="(pre, idx) in data.value['No PRE'].split(',')" :key="idx">
                    {{ pre.replace('-', ' - ') }}
                  </div>
                </div>
              </template>
              <template v-slot:BillPRE="data">
                {{ data.value['Bill PRE'] }}
              </template>
              <template v-slot:AmaunPRE="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amaun  PRE (RM)']) }}
                </div>
              </template>
              <template v-slot:StatusPRE="data">
                {{ data.value['Status PRE'] }}
              </template>
              <template v-slot:NoPOR="data">
                <div v-if="data.value['No POR']" class="text-nowrap">
                  <div v-for="(por, idx) in data.value['No POR'].split(',')" :key="idx">
                    {{ por.replace('-', ' - ') }}
                  </div>
                </div>
              </template>
              <template v-slot:BillPOR="data">
                {{ data.value['Bill POR'] }}
              </template>
              <template v-slot:AmaunPOR="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amaun POR (RM)']) }}
                </div>
              </template>
              <template v-slot:StatusPOR="data">
                {{ data.value['Status POR'] }}
              </template>
              <template v-slot:StatusPembekal="data">
                {{ data.value['Status Pembekal'] }}
              </template>
            </rs-table>
          </div>

          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalRecords }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.laporan-keseluruhan-table-wrapper :deep(.table-header) {
  display: none;
}

.laporan-keseluruhan-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
