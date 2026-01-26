<script setup>
definePageMeta({
  title: "List of Bank Guarantee",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Bank Guarantee", path: "/purchasing/bank-guarantee" },
    { name: "List of Bank Guarantee", path: "/purchasing/bank-guarantee/list" },
  ],
});

const { $swal } = useNuxtApp();

const bankGuaranteeList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(10);
const showSmartFilter = ref(false);

const smartFilter = ref({
  Status: "",
  VendorCode: "",
});

const originalFilter = ref({
  Status: "",
  VendorCode: "",
});

const filteredBankGuaranteeList = ref([...bankGuaranteeList.value]);

const applyFilters = () => {
  let filtered = [...bankGuaranteeList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const vendorCode = (item["Vendor Code"] || "").toString().toLowerCase();
      const vendorName = (item["Vendor Name"] || "").toString().toLowerCase();
      const issuerBank = (item["Issuer Bank"] || "").toString().toLowerCase();
      const branch = (item.Branch || "").toString().toLowerCase();
      const docNo = (item["Doc No"] || "").toString().toLowerCase();
      const bgNo = (item["BG No"] || "").toString().toLowerCase();
      const status = (item.Status || "").toString().toLowerCase();

      return (
        vendorCode.includes(keyword) ||
        vendorName.includes(keyword) ||
        issuerBank.includes(keyword) ||
        branch.includes(keyword) ||
        docNo.includes(keyword) ||
        bgNo.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  if (smartFilter.value.Status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.Status);
  }

  if (smartFilter.value.VendorCode) {
    const filterTerm = smartFilter.value.VendorCode.toLowerCase();
    filtered = filtered.filter((item) => {
      const vendorCode = (item["Vendor Code"] || "").toLowerCase();
      return vendorCode.includes(filterTerm);
    });
  }

  filteredBankGuaranteeList.value = [];
  nextTick(() => {
    filteredBankGuaranteeList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredBankGuaranteeList.value.length);

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

const fetchBankGuarantees = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
      smartFilter_VendorCode: smartFilter.value.VendorCode || undefined,
    };

    const { data } = await useFetch("/api/purchasing/bank-guarantee/list", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      bankGuaranteeList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Vendor Code": item.vcs_vendor_code || '',
        "Vendor Name": item.vcs_vendor_name || '',
        "Issuer Bank": item.cbg_issuer_bank || '',
        Branch: item.cbg_branch_name || '',
        "Doc No": item.cbg_bog_no || '',
        "BG Date": item.cbg_bog_date || '',
        "BG Expired Date": item.cbg_bog_expired || '',
        "BG No": item.cbg_agreement_no || '',
        "Amount (RM)": item.cbg_amount || 0,
        "No Reference": item.cbg_po_no || '',
        "PO Date": item.cbg_po_date || '',
        "Agreement Date": item.cbg_agreement_end_date || '',
        Status: item.cbg_status || '',
        Remark: item.cbg_remark || '',
        Action: "",
        urlEdit: item.urlEdit,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch bank guarantees",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching bank guarantees:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching bank guarantees",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBankGuarantees();
});

const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
    VendorCode: smartFilter.value.VendorCode,
  };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
    VendorCode: "",
  };
  originalFilter.value = {
    Status: "",
    VendorCode: "",
  };
  fetchBankGuarantees();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchBankGuarantees();
};

const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
    VendorCode: originalFilter.value.VendorCode,
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
    text: `Do you want to delete "${item["BG No"]}"?`,
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
      await fetchBankGuarantees();
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
        <div class="text-lg font-semibold">List of Bank Guarantee</div>
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

          <div class="bank-guarantee-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`bank-guarantee-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredBankGuaranteeList"
              :field="['no', 'Vendor Code', 'Vendor Name', 'Issuer Bank', 'Branch', 'Doc No', 'BG Date', 'BG Expired Date', 'BG No', 'Amount (RM)', 'No Reference', 'PO Date', 'Agreement Date', 'Status', 'Remark', 'Action']"
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
              <template v-slot:VendorCode="data">
                {{ data.value['Vendor Code'] }}
              </template>
              <template v-slot:VendorName="data">
                {{ data.value['Vendor Name'] }}
              </template>
              <template v-slot:IssuerBank="data">
                {{ data.value['Issuer Bank'] }}
              </template>
              <template v-slot:Branch="data">
                {{ data.value.Branch }}
              </template>
              <template v-slot:DocNo="data">
                {{ data.value['Doc No'] }}
              </template>
              <template v-slot:BGDate="data">
                {{ data.value['BG Date'] }}
              </template>
              <template v-slot:BGExpiredDate="data">
                {{ data.value['BG Expired Date'] }}
              </template>
              <template v-slot:BGNo="data">
                {{ data.value['BG No'] }}
              </template>
              <template v-slot:AmountRM="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Amount (RM)']) }}
                </div>
              </template>
              <template v-slot:NoReference="data">
                {{ data.value['No Reference'] }}
              </template>
              <template v-slot:PODate="data">
                {{ data.value['PO Date'] }}
              </template>
              <template v-slot:AgreementDate="data">
                {{ data.value['Agreement Date'] }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Remark="data">
                {{ data.value.Remark }}
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
.bank-guarantee-table-wrapper :deep(.table-header) {
  display: none;
}

.bank-guarantee-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
