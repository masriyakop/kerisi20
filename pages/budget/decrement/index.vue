<script setup>
definePageMeta({
  title: "Budget Decrement",
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
      name: "Decrement",
      path: "/budget/decrement",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const decrementList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Smart Filter modal state
const showSmartFilter = ref(false);
const smartFilter = ref({
  sm_bmm_year: "",
  sm_bmm_status: "",
});

// Store original filter values for reset
const originalFilter = ref({
  sm_bmm_year: "",
  sm_bmm_status: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredDecrementList = ref([...decrementList.value]);

// Cancel modal state
const showCancelModal = ref(false);
const cancelForm = ref({
  bmm_cancel_remark: "",
});
const cancelingId = ref(null);

// Dropdown options
const statusOptions = ref([
  { label: "DRAFT", value: "DRAFT" },
  { label: "APPROVE", value: "APPROVE" },
  { label: "APPROVED", value: "APPROVED" },
  { label: "CANCEL", value: "CANCEL" },
]);

const pageSizeOptions = ref([
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...decrementList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const year = (item.Year || "").toString().toLowerCase();
      const referenceNo = (item['Reference No'] || "").toLowerCase();
      const authorityApproval = (item['Authority Approval'] || "").toLowerCase();
      const remarkReason = (item['Remark/Reason'] || "").toLowerCase();
      const amount = (item.Amount || "").toString().toLowerCase();
      const status = (item.Status || "").toLowerCase();
      const date = (item.Date || "").toLowerCase();

      return (
        year.includes(keyword) ||
        referenceNo.includes(keyword) ||
        authorityApproval.includes(keyword) ||
        remarkReason.includes(keyword) ||
        amount.includes(keyword) ||
        status.includes(keyword) ||
        date.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.sm_bmm_year) {
    filtered = filtered.filter((item) => {
      const itemYear = (item.Year || "").toString();
      return itemYear === smartFilter.value.sm_bmm_year;
    });
  }

  if (smartFilter.value.sm_bmm_status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.sm_bmm_status);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredDecrementList.value = [];
  nextTick(() => {
    filteredDecrementList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredDecrementList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and fetch from API when it changes
watch(smartFilter, () => {
  fetchDecrements();
}, { deep: true });

// Fetch budget decrement records from API
const fetchDecrements = async () => {
  try {
    loading.value = true;
    const query = {};
    
    // Add smart filters
    if (smartFilter.value.sm_bmm_year) {
      query.sm_bmm_year = smartFilter.value.sm_bmm_year;
    }
    if (smartFilter.value.sm_bmm_status) {
      query.sm_bmm_status = smartFilter.value.sm_bmm_status;
    }
    
    const { data } = await useFetch("/api/budget/decrement", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      decrementList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        Year: item.bmm_year,
        "Reference No": item.bmm_budget_movement_no,
        "Authority Approval": item.bmm_endorse_doc,
        "Remark/Reason": item.bmm_description,
        Amount: item.bmm_total_amt,
        Status: item.bmm_status,
        Date: item.date,
        Action: "", // Action column with icons
        // Keep original data for actions (not displayed as columns)
        bmm_budget_movement_id: item.bmm_budget_movement_id,
        bmm_status: item.bmm_status,
        bmm_year: item.bmm_year,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget decrement records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget decrement records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget decrement records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchDecrements();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    sm_bmm_year: smartFilter.value.sm_bmm_year,
    sm_bmm_status: smartFilter.value.sm_bmm_status,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    sm_bmm_year: "",
    sm_bmm_status: "",
  };
  originalFilter.value = {
    sm_bmm_year: "",
    sm_bmm_status: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    sm_bmm_year: originalFilter.value.sm_bmm_year,
    sm_bmm_status: originalFilter.value.sm_bmm_status,
  };
  showSmartFilter.value = false;
};

// Handle cancel
const handleCancel = (item) => {
  if (item.bmm_status !== "APPROVE" && item.bmm_status !== "APPROVED") {
    $swal.fire({
      title: "Error",
      text: "Only approved applications can be cancelled",
      icon: "error",
    });
    return;
  }
  cancelingId.value = item.bmm_budget_movement_id;
  cancelForm.value.bmm_cancel_remark = "";
  showCancelModal.value = true;
};

// Handle cancel submit
const handleCancelSubmit = async () => {
  if (!cancelForm.value.bmm_cancel_remark) {
    $swal.fire({
      title: "Validation Error",
      text: "Please enter cancellation remarks",
      icon: "warning",
    });
    return;
  }
  // TODO: Implement cancel API call
  $swal.fire({
    title: "Success",
    text: "Application cancelled successfully",
    icon: "success",
  });
  showCancelModal.value = false;
  fetchDecrements();
};

// Handle add - create new decrement record
const handleAdd = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/decrement-v2-form/new", {
      method: "POST",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const bmmId = data.value.data.bmm_budget_movement_id;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('decrement_form_id', bmmId.toString());
        sessionStorage.setItem('decrement_form_mode', 'add');
      }
      navigateTo("/budget/decrement-v2-form");
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to create new decrement record",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error creating new decrement:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while creating new decrement record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Download PDF function
const handleDownloadPDF = () => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
};

// Download CSV function
const handleDownloadCSV = () => {
  $swal.fire({
    title: "Info",
    text: "CSV download functionality will be implemented",
    icon: "info",
  });
};

// Handle edit - navigate to form for editing
const handleEdit = (item) => {
  if (item.bmm_status !== "DRAFT") {
    $swal.fire({
      title: "Error",
      text: "Only draft applications can be edited",
      icon: "error",
    });
    return;
  }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('decrement_form_id', item.bmm_budget_movement_id.toString());
    sessionStorage.setItem('decrement_form_mode', 'edit');
  }
  navigateTo("/budget/decrement-v2-form");
};

// Handle view - navigate to form for viewing
const handleView = (item) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('decrement_form_id', item.bmm_budget_movement_id.toString());
    sessionStorage.setItem('decrement_form_mode', 'view');
  }
  navigateTo("/budget/decrement-v2-form");
};

// Handle delete
const handleDelete = async (item) => {
  if (item.bmm_status !== "DRAFT") {
    $swal.fire({
      title: "Error",
      text: "Only draft applications can be deleted",
      icon: "error",
    });
    return;
  }
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete this record?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      // TODO: Implement delete API call
      $swal.fire({
        title: "Success",
        text: "Record deleted successfully",
        icon: "success",
      });
      fetchDecrements();
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting the record",
        icon: "error",
      });
    }
  }
};

// Format currency
const toCurrency = (value) => {
  if (!value && value !== 0) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Budget Decrement Section -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Decrement</div>
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

          <!-- Table with built-in search and pagination -->
          <div class="budget-decrement-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-decrement-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredDecrementList"
              :field="['no', 'Year', 'Reference No', 'Authority Approval', 'Remark/Reason', 'Amount', 'Status', 'Date', 'Action']"
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
              <template v-slot:Year="data">
                {{ data.value.Year }}
              </template>
              <template v-slot:ReferenceNo="data">
                {{ data.value['Reference No'] }}
              </template>
              <template v-slot:AuthorityApproval="data">
                {{ data.value['Authority Approval'] }}
              </template>
              <template v-slot:RemarkReason="data">
                {{ data.value['Remark/Reason'] }}
              </template>
              <template v-slot:Amount="data">
                {{ toCurrency(data.value.Amount) }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': data.value.Status === 'DRAFT',
                    'text-green-600 dark:text-green-400': data.value.Status === 'APPROVE' || data.value.Status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.Status === 'CANCEL',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:Date="data">
                {{ data.value.Date }}
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
                    :disabled="data.value.bmm_status !== 'DRAFT'"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                    :disabled="data.value.bmm_status !== 'DRAFT'"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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

          <!-- Custom Footer with Records Count and Buttons -->
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

    <!-- Smart Filter Modal -->
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
            <!-- Year -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Year:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.sm_bmm_year"
                  type="text"
                  placeholder="Enter Year"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.sm_bmm_year"
                  type="button"
                  @click="smartFilter.sm_bmm_year = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.sm_bmm_status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.sm_bmm_status"
                  type="button"
                  @click="smartFilter.sm_bmm_status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
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

    <!-- Cancel Modal -->
    <rs-modal
      v-model="showCancelModal"
      title="Are you sure to cancel the approved application?"
      size="md"
      :overlay-close="false"
      position="center"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                Remarks <span class="text-red-500">*</span>:
              </label>
              <FormKit
                v-model="cancelForm.bmm_cancel_remark"
                type="textarea"
                placeholder="Enter cancellation remarks"
                validation="required"
                outer-class="mb-0"
                rows="4"
              />
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="danger" @click="showCancelModal = false">
            Cancel
          </rs-button>
          <rs-button variant="primary" @click="handleCancelSubmit">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.budget-decrement-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Hide default close icon for Smart Filter modal */
.smart-filter-modal-custom .modal-header > :last-child:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure Smart Filter modal header matches Fund Type modal styling */
.smart-filter-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.smart-filter-modal-custom .smart-filter-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>

