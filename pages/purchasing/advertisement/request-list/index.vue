<script setup>
definePageMeta({
  title: "Advertisement Request List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Purchasing",
      path: "/purchasing",
    },
    {
      name: "Advertisement",
      path: "/purchasing/advertisement",
    },
    {
      name: "Advertisement Request List",
      path: "/purchasing/advertisement/request-list",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const advertisementRequestList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Smart Filter values
const smartFilter = ref({
  Status: "",
  Type: "",
  StartDate: "",
  EndDate: "",
});

// Store original filter values for reset
const originalFilter = ref({
  Status: "",
  Type: "",
  StartDate: "",
  EndDate: "",
});

// Status options
const statusOptions = ref([]);

// Filtered data
const filteredAdvertisementRequestList = ref([...advertisementRequestList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...advertisementRequestList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const tenderNo = (item["Quotation/Tender No"] || "").toString().toLowerCase();
      const refNo = (item["Reference No"] || "").toString().toLowerCase();
      const type = (item.Type || "").toString().toLowerCase();
      const title = (item.Title || "").toString().toLowerCase();
      const prNo = (item["PR No"] || "").toString().toLowerCase();
      const status = (item.Status || "").toString().toLowerCase();

      return (
        tenderNo.includes(keyword) ||
        refNo.includes(keyword) ||
        type.includes(keyword) ||
        title.includes(keyword) ||
        prNo.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  if (smartFilter.value.Status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.Status);
  }

  if (smartFilter.value.Type) {
    filtered = filtered.filter((item) => item.Type === smartFilter.value.Type);
  }

  filteredAdvertisementRequestList.value = [];
  nextTick(() => {
    filteredAdvertisementRequestList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredAdvertisementRequestList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Format currency
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch advertisement requests
const fetchAdvertisementRequests = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
      smartFilter_Type: smartFilter.value.Type || undefined,
      smartFilter_StartDate: smartFilter.value.StartDate || undefined,
      smartFilter_EndDate: smartFilter.value.EndDate || undefined,
    };

    const { data } = await useFetch("/api/purchasing/advertisement/request-list", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      advertisementRequestList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Quotation/Tender No": item.tdm_tender_no || '',
        "Reference No": item.tdm_briefing_ref_no || '',
        Type: item.tdm_tender_type || '',
        "Start Date Project": item.tdm_start_date || '',
        "End Date Project": item.tdm_end_date || '',
        Title: item.tdm_title || '',
        "Estimated Price (RM)": item.tdm_estimated_amount || 0,
        "PR No": item.tdm_requisition_no || '',
        Status: item.tdm_status || '',
        Action: "",
        tdm_tender_id: item.tdm_tender_id,
        urlEdit: item.urlEdit,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch advertisement requests",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching advertisement requests:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching advertisement requests",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAdvertisementRequests();
});

const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
    Type: smartFilter.value.Type,
    StartDate: smartFilter.value.StartDate,
    EndDate: smartFilter.value.EndDate,
  };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
    Type: "",
    StartDate: "",
    EndDate: "",
  };
  originalFilter.value = {
    Status: "",
    Type: "",
    StartDate: "",
    EndDate: "",
  };
  fetchAdvertisementRequests();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchAdvertisementRequests();
};

const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
    Type: originalFilter.value.Type,
    StartDate: originalFilter.value.StartDate,
    EndDate: originalFilter.value.EndDate,
  };
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
    text: `Do you want to delete "${item["Quotation/Tender No"]}"?`,
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
      await fetchAdvertisementRequests();
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
        <div class="text-lg font-semibold">List Of Tender Advertisement Request</div>
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

          <div class="advertisement-request-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`advertisement-request-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredAdvertisementRequestList"
              :field="['no', 'Quotation/Tender No', 'Reference No', 'Type', 'Start Date Project', 'End Date Project', 'Title', 'Estimated Price (RM)', 'PR No', 'Status', 'Action']"
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
              <template v-slot:QuotationTenderNo="data">
                {{ data.value['Quotation/Tender No'] }}
              </template>
              <template v-slot:ReferenceNo="data">
                {{ data.value['Reference No'] }}
              </template>
              <template v-slot:Type="data">
                {{ data.value.Type }}
              </template>
              <template v-slot:StartDateProject="data">
                {{ data.value['Start Date Project'] }}
              </template>
              <template v-slot:EndDateProject="data">
                {{ data.value['End Date Project'] }}
              </template>
              <template v-slot:Title="data">
                {{ data.value.Title }}
              </template>
              <template v-slot:EstimatedPriceRM="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Estimated Price (RM)']) }}
                </div>
              </template>
              <template v-slot:PRNo="data">
                {{ data.value['PR No'] }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
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
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.Status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Status"
                  type="button"
                  @click="smartFilter.Status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Type:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.Type"
                  type="text"
                  placeholder="Enter Type"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Start Date:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.StartDate"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">End Date:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.EndDate"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  outer-class="mb-0"
                />
              </div>
            </div>
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
.advertisement-request-table-wrapper :deep(.table-header) {
  display: none;
}

.advertisement-request-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
