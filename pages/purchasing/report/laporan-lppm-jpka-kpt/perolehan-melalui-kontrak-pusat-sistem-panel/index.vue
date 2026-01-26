<script setup>
definePageMeta({
  title: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Report", path: "/purchasing/report" },
    { name: "Laporan LPPM JPKA: KPT", path: "/purchasing/report/laporan-lppm-jpka-kpt" },
    { name: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel", path: "/purchasing/report/laporan-lppm-jpka-kpt/perolehan-melalui-kontrak-pusat-sistem-panel" },
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
  vendorName: "",
  status: "",
  oun_code: "",
});

// Filtered data
const filteredReportList = ref([...reportList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...reportList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const searchableFields = [
        item["Item Kontrak"],
        item["No.Rujukan PRE"],
        item["No.Rujukan POR"],
        item["Nama Pembekal"],
        item["Alamat Pembekal"],
        item["Status Pembekal"],
        item["Jenis Pembelian"],
        item["No. Perjanjian"],
        item.PTJ,
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
      vendorName: topFilter.value.vendorName || undefined,
      status: topFilter.value.status || undefined,
      oun_code: topFilter.value.oun_code || undefined,
    };

    const { data } = await useFetch("/api/purchasing/report/laporan-lppm-jpka-kpt/perolehan-melalui-kontrak-pusat-sistem-panel", {
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <label class="block text-sm font-medium mb-2">Nama pembekal:</label>
            <FormKit
              v-model="topFilter.vendorName"
              type="text"
              placeholder="Enter Nama pembekal"
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
          <div>
            <label class="block text-sm font-medium mb-2">PTJ:</label>
            <FormKit
              v-model="topFilter.oun_code"
              type="text"
              placeholder="Enter PTJ"
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
        <div class="text-lg font-semibold">Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel</div>
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

          <div class="perolehan-kontrak-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`perolehan-kontrak-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredReportList"
              :field="['no', 'Item Kontrak', 'No.Rujukan PRE', 'Tarikh Kelulusan PRE', 'Perkara PRE', 'Status Pembekal', 'Jenis Pembelian', 'No. Perjanjian', 'Status PRE', 'No.Rujukan POR', 'Tarikh Kelulusan POR', 'Perkara POR', 'Amaun POR (RM)', 'Status POR', 'Nama Pembekal', 'Alamat Pembekal', 'Amaun PRE (RM)', 'PTJ']"
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
              <template v-slot:ItemKontrak="data">
                {{ data.value['Item Kontrak'] }}
              </template>
              <template v-slot:NoRujukanPRE="data">
                {{ data.value['No.Rujukan PRE'] }}
              </template>
              <template v-slot:TarikhKelulusanPRE="data">
                {{ data.value['Tarikh Kelulusan PRE'] }}
              </template>
              <template v-slot:PerkaraPRE="data">
                {{ data.value['Perkara PRE'] }}
              </template>
              <template v-slot:StatusPembekal="data">
                {{ data.value['Status Pembekal'] }}
              </template>
              <template v-slot:JenisPembelian="data">
                {{ data.value['Jenis Pembelian'] }}
              </template>
              <template v-slot:NoPerjanjian="data">
                {{ data.value['No. Perjanjian'] }}
              </template>
              <template v-slot:StatusPRE="data">
                {{ data.value['Status PRE'] }}
              </template>
              <template v-slot:NoRujukanPOR="data">
                {{ data.value['No.Rujukan POR'] }}
              </template>
              <template v-slot:TarikhKelulusanPOR="data">
                {{ data.value['Tarikh Kelulusan POR'] }}
              </template>
              <template v-slot:PerkaraPOR="data">
                {{ data.value['Perkara POR'] }}
              </template>
              <template v-slot:AmaunPOR="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amaun POR (RM)']) }}
                </div>
              </template>
              <template v-slot:StatusPOR="data">
                {{ data.value['Status POR'] }}
              </template>
              <template v-slot:NamaPembekal="data">
                {{ data.value['Nama Pembekal'] }}
              </template>
              <template v-slot:AlamatPembekal="data">
                {{ data.value['Alamat Pembekal'] }}
              </template>
              <template v-slot:AmaunPRE="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amaun PRE (RM)']) }}
                </div>
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
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
.perolehan-kontrak-table-wrapper :deep(.table-header) {
  display: none;
}

.perolehan-kontrak-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
