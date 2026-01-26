<script setup>
definePageMeta({
  title: "List of Agreement",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Agreement", path: "/purchasing/agreement" },
    { name: "List of Agreement", path: "/purchasing/agreement/list" },
  ],
});

const { $swal } = useNuxtApp();

const agreementList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(10);
const showSmartFilter = ref(false);

const smartFilter = ref({
  Status: "",
  VendorCode: "",
  StartDate: "",
  EndDate: "",
});

const originalFilter = ref({
  Status: "",
  VendorCode: "",
  StartDate: "",
  EndDate: "",
});

const filteredAgreementList = ref([...agreementList.value]);

const applyFilters = () => {
  let filtered = [...agreementList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const agreementNo = (item["Agreement No"] || "").toString().toLowerCase();
      const agreementRef = (item["Agreement Ref"] || "").toString().toLowerCase();
      const vendorCode = (item["Vendor Code"] || "").toString().toLowerCase();
      const vendorName = (item["Vendor Name"] || "").toString().toLowerCase();
      const description = (item.Description || "").toString().toLowerCase();
      const status = (item["Status Agreement"] || "").toString().toLowerCase();

      return (
        agreementNo.includes(keyword) ||
        agreementRef.includes(keyword) ||
        vendorCode.includes(keyword) ||
        vendorName.includes(keyword) ||
        description.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  if (smartFilter.value.Status) {
    filtered = filtered.filter((item) => item["Status Agreement"] === smartFilter.value.Status);
  }

  if (smartFilter.value.VendorCode) {
    const filterTerm = smartFilter.value.VendorCode.toLowerCase();
    filtered = filtered.filter((item) => {
      const vendorCode = (item["Vendor Code"] || "").toLowerCase();
      return vendorCode.includes(filterTerm);
    });
  }

  if (smartFilter.value.StartDate) {
    const [day, month, year] = smartFilter.value.StartDate.split('/');
    const filterDate = new Date(`${year}-${month}-${day}`);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item["Start Date"] || item.StartDate);
      return itemDate >= filterDate;
    });
  }

  if (smartFilter.value.EndDate) {
    const [day, month, year] = smartFilter.value.EndDate.split('/');
    const filterDate = new Date(`${year}-${month}-${day} 23:59:59`);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item["End Date"] || item.EndDate);
      return itemDate <= filterDate;
    });
  }

  filteredAgreementList.value = [];
  nextTick(() => {
    filteredAgreementList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredAgreementList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fetchAgreements = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
      smartFilter_VendorCode: smartFilter.value.VendorCode || undefined,
      smartFilter_StartDate: smartFilter.value.StartDate || undefined,
      smartFilter_EndDate: smartFilter.value.EndDate || undefined,
    };

    const { data } = await useFetch("/api/purchasing/agreement/list", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      agreementList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Agreement ID": item.AgreementID || '',
        "Agreement No": item.AgreementNo || '',
        "Agreement Ref": item.AgreementRef || '',
        "Vendor Code": item.VendorCode || '',
        "Vendor Name": item.VendorName || '',
        Address: item.Address || '',
        Description: item.Description || '',
        "Start Date": item.StartDate || '',
        "End Date": item.EndDate || '',
        "Amount Agreement  (RM)": item.Amount || 0,
        "Amount Balance  (RM)": item.AmountBalance || 0,
        "Amount Monthly (RM)": item.AmountMonthly || 0,
        Duration: item.Duration || '',
        "Type Duration": item.Type || '',
        "Tender No": item.tdm_tender_no || '',
        "Status Agreement": item.Status || '',
        "Status Workflow Agreement": item.StatusWfAgreement || '',
        Action: "",
        AgreementID: item.AgreementID,
        urlEdit: item.urlEdit,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch agreements",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching agreements:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching agreements",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAgreements();
});

const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
    VendorCode: smartFilter.value.VendorCode,
    StartDate: smartFilter.value.StartDate,
    EndDate: smartFilter.value.EndDate,
  };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
    VendorCode: "",
    StartDate: "",
    EndDate: "",
  };
  originalFilter.value = {
    Status: "",
    VendorCode: "",
    StartDate: "",
    EndDate: "",
  };
  fetchAgreements();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchAgreements();
};

const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
    VendorCode: originalFilter.value.VendorCode,
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
    text: `Do you want to delete "${item["Agreement No"]}"?`,
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
      await fetchAgreements();
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
        <div class="text-lg font-semibold">List Of Agreement</div>
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

          <div class="agreement-list-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`agreement-list-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredAgreementList"
              :field="['no', 'Agreement ID', 'Agreement No', 'Agreement Ref', 'Vendor Code', 'Vendor Name', 'Address', 'Description', 'Start Date', 'End Date', 'Amount Agreement  (RM)', 'Amount Balance  (RM)', 'Amount Monthly (RM)', 'Duration', 'Type Duration', 'Tender No', 'Status Agreement', 'Status Workflow Agreement', 'Action']"
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
              <template v-slot:AgreementID="data">
                {{ data.value['Agreement ID'] }}
              </template>
              <template v-slot:AgreementNo="data">
                {{ data.value['Agreement No'] }}
              </template>
              <template v-slot:AgreementRef="data">
                {{ data.value['Agreement Ref'] }}
              </template>
              <template v-slot:VendorCode="data">
                {{ data.value['Vendor Code'] }}
              </template>
              <template v-slot:VendorName="data">
                {{ data.value['Vendor Name'] }}
              </template>
              <template v-slot:Address="data">
                {{ data.value.Address }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:StartDate="data">
                {{ data.value['Start Date'] }}
              </template>
              <template v-slot:EndDate="data">
                {{ data.value['End Date'] }}
              </template>
              <template v-slot:AmountAgreementRM="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amount Agreement  (RM)']) }}
                </div>
              </template>
              <template v-slot:AmountBalanceRM="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amount Balance  (RM)']) }}
                </div>
              </template>
              <template v-slot:AmountMonthlyRM="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amount Monthly (RM)']) }}
                </div>
              </template>
              <template v-slot:Duration="data">
                {{ data.value.Duration }}
              </template>
              <template v-slot:TypeDuration="data">
                {{ data.value['Type Duration'] }}
              </template>
              <template v-slot:TenderNo="data">
                {{ data.value['Tender No'] }}
              </template>
              <template v-slot:StatusAgreement="data">
                {{ data.value['Status Agreement'] }}
              </template>
              <template v-slot:StatusWorkflowAgreement="data">
                {{ data.value['Status Workflow Agreement'] }}
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
                  :options="[]"
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
              <label class="w-32 text-sm font-medium">Vendor Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="smartFilter.VendorCode"
                  type="text"
                  placeholder="Enter Vendor Code"
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
.agreement-list-table-wrapper :deep(.table-header) {
  display: none;
}

.agreement-list-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
