<script setup>
definePageMeta({
  title: "Report Vendor Assessment (GRN)",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Report", path: "/purchasing/report" },
    { name: "Report Vendor Assessment (GRN)", path: "/purchasing/report/vendor-assessment-grn" },
  ],
});

const { $swal } = useNuxtApp();

const vendorAssessmentList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(10);
const showSmartFilter = ref(false);

const smartFilter = ref({});
const originalFilter = ref({});

const filteredVendorAssessmentList = ref([...vendorAssessmentList.value]);

const applyFilters = () => {
  let filtered = [...vendorAssessmentList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const preNo = (item["No PRE"] || "").toString().toLowerCase();
      const porNo = (item["No POR"] || "").toString().toLowerCase();
      const grnBilNo = (item["No GRN/Bil"] || "").toString().toLowerCase();
      const ptj = (item.PTJ || "").toString().toLowerCase();
      const namaPembekal = (item["Nama Pembekal"] || "").toString().toLowerCase();
      const kodPembekal = (item["Kod Pembekal"] || "").toString().toLowerCase();

      return (
        preNo.includes(keyword) ||
        porNo.includes(keyword) ||
        grnBilNo.includes(keyword) ||
        ptj.includes(keyword) ||
        namaPembekal.includes(keyword) ||
        kodPembekal.includes(keyword)
      );
    });
  }

  filteredVendorAssessmentList.value = [];
  nextTick(() => {
    filteredVendorAssessmentList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredVendorAssessmentList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

const fetchVendorAssessments = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
    };

    const { data } = await useFetch("/api/purchasing/report/vendor-assessment-grn", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      vendorAssessmentList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "No PRE": item.pre_no || '',
        "No POR": item.por_no || '',
        "No GRN/Bil": item.grn_bil_no || '',
        PTJ: item.ptj || '',
        "Tarikh Penilaian": item.tarikh_penilaian || '',
        "Nama Pembekal": item.nama_pembekal || '',
        "Kod Pembekal": item.kod_pembekal || '',
        Status: '',
        "Jenis Perolehan": '',
        "Ulasan Penilai": '',
        Pengesahan: '',
        Cadangan: '',
        Action: "",
        grm_receive_id: item.grm_receive_id,
        urlEdit: item.urlEdit,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch vendor assessment (GRN) list",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching vendor assessment (GRN) list:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching vendor assessment (GRN) list",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVendorAssessments();
});

const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {};
  originalFilter.value = {};
  fetchVendorAssessments();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchVendorAssessments();
};

const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

const handleView = (item) => {
  if (item.urlEdit) {
    navigateTo(item.urlEdit);
  }
};

const handleEdit = (item) => {
  if (item.urlEdit) {
    navigateTo(item.urlEdit);
  }
};

const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete "${item["No GRN/Bil"]}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      // TODO: Implement delete API
      $swal.fire({
        title: "Deleted!",
        text: "Record has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchVendorAssessments();
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

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

const handleAdd = () => {
  $swal.fire({
    title: "Info",
    text: "Add functionality will be implemented",
    icon: "info",
  });
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">List Of Vendor Assesment (GRN)</div>
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
              <div class="flex gap-2">
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
                <rs-button
                  class="!px-3"
                  style="height: 40px; min-height: 40px;"
                  @click="handleFilter"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>

          <div class="vendor-assessment-grn-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`vendor-assessment-grn-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredVendorAssessmentList"
              :field="['no', 'No PRE', 'No POR', 'No GRN/Bil', 'PTJ', 'Tarikh Penilaian', 'Nama Pembekal', 'Kod Pembekal', 'Status', 'Jenis Perolehan', 'Ulasan Penilai', 'Pengesahan', 'Cadangan', 'Action']"
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
              <template v-slot:NoPRE="data">
                {{ data.value['No PRE'] }}
              </template>
              <template v-slot:NoPOR="data">
                {{ data.value['No POR'] }}
              </template>
              <template v-slot:NoGRNBil="data">
                {{ data.value['No GRN/Bil'] }}
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
              </template>
              <template v-slot:TarikhPenilaian="data">
                {{ data.value['Tarikh Penilaian'] }}
              </template>
              <template v-slot:NamaPembekal="data">
                {{ data.value['Nama Pembekal'] }}
              </template>
              <template v-slot:KodPembekal="data">
                {{ data.value['Kod Pembekal'] }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:JenisPerolehan="data">
                {{ data.value['Jenis Perolehan'] }}
              </template>
              <template v-slot:UlasanPenilai="data">
                {{ data.value['Ulasan Penilai'] }}
              </template>
              <template v-slot:Pengesahan="data">
                {{ data.value.Pengesahan }}
              </template>
              <template v-slot:Cadangan="data">
                {{ data.value.Cadangan }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView(data.value)"
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
                    @click="handleEdit(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleDelete(data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon
                      name="material-symbols:delete"
                      class="text-red-600 dark:text-red-400"
                      size="20"
                    />
                  </button>
                </div>
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
              <rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <rs-modal
      v-model="showSmartFilter"
      title="Smart Filter"
      size="md"
      dialog-class="smart-filter-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg smart-filter-modal-header">
          <h4 class="text-base font-semibold text-white">Smart Filter</h4>
          <Icon
            @click="handleFilterClose"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <!-- Add filter fields as needed -->
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="handleFilterReset">
            Reset
          </rs-button>
          <rs-button variant="primary" @click="handleFilterOk">
            Ok
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.vendor-assessment-grn-table-wrapper :deep(.table-header) {
  display: none;
}

.vendor-assessment-grn-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
