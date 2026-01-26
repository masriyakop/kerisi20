<script setup>
definePageMeta({
  title: "PO Confirmation Process",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Order", path: "/purchasing/purchase-order" },
    { name: "Closing", path: "/purchasing/purchase-order/closing" },
    { name: "PO Confirmation Process", path: "/purchasing/purchase-order/closing/po-confirmation-process" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const poList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(5);

// Top Filter
const topFilter = ref({
  fund: "",
});

// Fund options
const fundOptions = ref([
  { label: "E01 - MENGURUS", value: "E01" },
  { label: "OTHERS", value: "other" },
]);

// View Details modal state
const showViewModal = ref(false);
const viewForm = ref({
  ppc_id: "",
  ppc_year: "",
  pom_order_no: "",
  pod_order_detl_id: "",
  pod_line_no: "",
  at_activity_code: "",
  ccr_costcentre: "",
  am_account_code: "",
  cpa_project_no: "",
  ppc_balance_amount: "",
  pod_ccr_costcentre_budget: "",
  pod_at_activity_code_budget: "",
  sbg_budget_id: "",
  pod_at_activity_code_budget_NEW: "",
  pod_ccr_costcentre_budget_NEW: "",
  sbg_budget_id_NEW: "",
  fty_fund_type: "",
  oun_code: "",
  budget_code: "",
});

// Process modal state
const showProcessModal = ref(false);
const processForm = ref({
  modal_ppcid: "",
  modal_budget_code: "",
});

// Selected POs for confirmation
const selectedPOs = ref([]);
const checkboxMonitoring = ref([]);

// Filtered data
const filteredPOList = ref([...poList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...poList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const searchableFields = [
        item.ID,
        item.Year,
        item["Pod Order No"],
        item["Pod Order ID"],
        item["Pod Line No"],
        item["PO Detail Account"],
        item["Fund Type"],
        item["Activity Code"],
        item.PTJ,
        item["Cost Centre"],
        item["Account Code"],
        item["Cpa Project No"],
        item["Old Structure Budget"],
        item["New Structure Budget"],
        item.Remark,
      ].map(f => (f || "").toString().toLowerCase());

      return searchableFields.some(field => field.includes(keyword));
    });
  }

  filteredPOList.value = [];
  nextTick(() => {
    filteredPOList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredPOList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(topFilter, () => {
  fetchPOs();
}, { deep: true });

// Currency formatter
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch PO data
const fetchPOs = async () => {
  try {
    loading.value = true;
    const query = {
      fund: topFilter.value.fund || undefined,
      search: searchKeyword.value || undefined,
    };

    const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-confirmation-process", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      poList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ...item,
      }));
      checkboxMonitoring.value = data.value.checkboxMonitoring || [];
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch PO Confirmation Process data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching PO Confirmation Process:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching PO Confirmation Process data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPOs();
});

// Handle view
const handleView = async (item) => {
  try {
    loading.value = true;
    const { data } = await useFetch(`/api/purchasing/purchase-order/closing/po-confirmation-process/${item.ppc_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      viewForm.value = {
        ppc_id: data.value.data.ppc_id || "",
        ppc_year: data.value.data.ppc_year || "",
        pom_order_no: data.value.data.pom_order_no || "",
        pod_order_detl_id: data.value.data.pod_order_detl_id || "",
        pod_line_no: data.value.data.pod_line_no || "",
        at_activity_code: data.value.data.at_activity_code || "",
        ccr_costcentre: data.value.data.ccr_costcentre || "",
        am_account_code: data.value.data.am_account_code || "",
        cpa_project_no: data.value.data.cpa_project_no || "",
        ppc_balance_amount: data.value.data.ppc_balance_amount || "",
        pod_ccr_costcentre_budget: data.value.data.pod_ccr_costcentre_budget || "",
        pod_at_activity_code_budget: data.value.data.pod_at_activity_code_budget || "",
        sbg_budget_id: data.value.data.sbg_budget_id || "",
        pod_at_activity_code_budget_NEW: data.value.data.pod_at_activity_code_budget_NEW || "",
        pod_ccr_costcentre_budget_NEW: data.value.data.pod_ccr_costcentre_budget_NEW || "",
        sbg_budget_id_NEW: data.value.data.sbg_budget_id_NEW || "",
        fty_fund_type: data.value.data.fty_fund_type || "",
        oun_code: data.value.data.oun_code || "",
        budget_code: data.value.data.sbg_budget_id_NEW || "",
      };
      showViewModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch PO details",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching PO details:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching PO details",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle process (update budget)
const handleProcess = async () => {
  if (!processForm.value.modal_budget_code) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a budget code",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-confirmation-process/process", {
      method: "POST",
      body: {
        modal_ppcid: processForm.value.modal_ppcid,
        modal_budget_code: processForm.value.modal_budget_code,
      },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: "Budget updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      showProcessModal.value = false;
      await fetchPOs();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to update budget",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error updating budget:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while updating budget",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle confirm (process selected POs)
const handleConfirm = async () => {
  if (selectedPOs.value.length === 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select at least one PO",
      icon: "warning",
    });
    return;
  }

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to confirm ${selectedPOs.value.length} selected PO(s)?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const poData = {};
      selectedPOs.value.forEach(id => {
        poData[id] = true;
      });

      const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-confirmation-process/confirm", {
        method: "POST",
        body: {
          poData,
          tf_fund: topFilter.value.fund,
        },
        initialCache: false,
      });

      if (data.value?.status === 'ok') {
        $swal.fire({
          title: "Success",
          text: data.value.successmessage || "PO confirmation completed successfully",
          icon: "success",
        });
        selectedPOs.value = [];
        await fetchPOs();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.errorMessage || "Failed to confirm PO",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error confirming PO:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while confirming PO",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Handle checkbox change
const handleCheckboxChange = (item, checked) => {
  if (checked) {
    if (!selectedPOs.value.includes(item.ID)) {
      selectedPOs.value.push(item.ID);
    }
  } else {
    selectedPOs.value = selectedPOs.value.filter(id => id !== item.ID);
  }
};

// Handle select all
const handleSelectAll = (checked) => {
  if (checked) {
    selectedPOs.value = filteredPOList.value
      .filter(item => item.sbg_budget_id_NEW !== null)
      .map(item => item.ID);
  } else {
    selectedPOs.value = [];
  }
};

// Check if item is selected
const isSelected = (item) => {
  return selectedPOs.value.includes(item.ID);
};

// Check if item can be selected (has sbg_budget_id_NEW)
const canSelect = (item) => {
  return item.sbg_budget_id_NEW !== null && item.sbg_budget_id_NEW !== '';
};

// Open process modal
const openProcessModal = (item) => {
  processForm.value = {
    modal_ppcid: item.ppc_id,
    modal_budget_code: item.sbg_budget_id_NEW || "",
  };
  showProcessModal.value = true;
};

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
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Fund:</label>
            <FormKit
              v-model="topFilter.fund"
              type="select"
              :options="fundOptions"
              placeholder="Select Fund"
              outer-class="mb-0"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- PO Confirmation Process List -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Listing</div>
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

          <div class="po-confirmation-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`po-confirmation-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredPOList"
              :field="['no', 'Year', 'Pod Order No', 'Pod Order ID', 'Pod Line No', 'PO Detail Account', 'Balance Amount', 'Old Structure Budget', 'New Structure Budget', 'Remark', 'Action', 'Select']"
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
              <template v-slot:Year="data">
                {{ data.value.Year }}
              </template>
              <template v-slot:PodOrderNo="data">
                {{ data.value['Pod Order No'] }}
              </template>
              <template v-slot:PodOrderID="data">
                {{ data.value['Pod Order ID'] }}
              </template>
              <template v-slot:PodLineNo="data">
                {{ data.value['Pod Line No'] }}
              </template>
              <template v-slot:PODetailAccount="data">
                {{ data.value['PO Detail Account'] }}
              </template>
              <template v-slot:BalanceAmount="data">
                <div class="text-right">
                  {{ toCurrency(data.value['Balance Amount']) }}
                </div>
              </template>
              <template v-slot:OldStructureBudget="data">
                {{ data.value['Old Structure Budget'] }}
              </template>
              <template v-slot:NewStructureBudget="data">
                {{ data.value['New Structure Budget'] }}
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
                    v-if="canSelect(data.value)"
                    @click="openProcessModal(data.value)"
                    class="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    title="Process"
                  >
                    <Icon
                      name="material-symbols:edit"
                      class="text-blue-600 dark:text-blue-400"
                      size="20"
                    />
                  </button>
                </div>
              </template>
              <template v-slot:Select="data">
                <input
                  type="checkbox"
                  :checked="isSelected(data.value)"
                  :disabled="!canSelect(data.value)"
                  @change="handleCheckboxChange(data.value, $event.target.checked)"
                  class="form-check-input"
                />
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
              <rs-button variant="primary" @click="handleConfirm" :disabled="selectedPOs.length === 0">
                <Icon name="material-symbols:check-circle" class="mr-2" size="1rem" />
                Confirm ({{ selectedPOs.length }})
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- View Details Modal -->
    <rs-modal
      v-model="showViewModal"
      title="View Details"
      size="lg"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="viewForm.ppc_year"
              type="text"
              label="Year"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pom_order_no"
              type="text"
              label="POD Order No"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_order_detl_id"
              type="text"
              label="Pod Order ID"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_line_no"
              type="text"
              label="Pod Line No"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.at_activity_code"
              type="text"
              label="Activity Code"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.ccr_costcentre"
              type="text"
              label="Cost Centre"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.am_account_code"
              type="text"
              label="Account Code"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.cpa_project_no"
              type="text"
              label="Cpa Project No"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.ppc_balance_amount"
              type="text"
              label="Balance Amount"
              readonly
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_ccr_costcentre_budget"
              type="text"
              label="Cost Centre Budget"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_at_activity_code_budget"
              type="text"
              label="Activity Code Budget"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.sbg_budget_id"
              type="text"
              label="Sbg Budget ID"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_at_activity_code_budget_NEW"
              type="text"
              label="New Activity Code Budget"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.pod_ccr_costcentre_budget_NEW"
              type="text"
              label="New Cost Centre Budget"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.sbg_budget_id_NEW"
              type="text"
              label="New Sbg Budget ID"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.fty_fund_type"
              type="text"
              label="Fund Type"
              disabled
              outer-class="mb-0"
            />
            <FormKit
              v-model="viewForm.oun_code"
              type="text"
              label="PTJ"
              disabled
              outer-class="mb-0"
            />
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showViewModal = false">
            Close
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Process Modal -->
    <rs-modal
      v-model="showProcessModal"
      title="Process"
      size="md"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <FormKit
              v-model="processForm.modal_budget_code"
              type="text"
              label="Budget Code"
              placeholder="Enter or select budget code"
              outer-class="mb-0"
            />
            <input type="hidden" v-model="processForm.modal_ppcid" />
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showProcessModal = false">
            Cancel
          </rs-button>
          <rs-button variant="primary" @click="handleProcess">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.po-confirmation-table-wrapper :deep(.table-header) {
  display: none;
}

.po-confirmation-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
