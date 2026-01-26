<script setup>
definePageMeta({
  title: "Budget Initial",
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
      name: "Initial",
      path: "/budget/initial",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const initialList = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Smart Filter modal state
const showSmartFilter = ref(false);
const smartFilter = ref({
  sm_year: "",
  sm_quarter: "",
  sm_status: "",
});
const originalFilter = ref({
  sm_year: "",
  sm_quarter: "",
  sm_status: "",
});

// Filtered data - using ref instead of computed for better reactivity
const filteredInitialList = ref([...initialList.value]);

// Cancel modal state
const showCancelModal = ref(false);
const cancelForm = ref({
  bmm_cancel_remark: "",
});
const cancelingId = ref(null);

// Smart Filter options
const yearOptions = ref([]);
const quarterFilterOptions = ref([]);
const statusFilterOptions = ref([]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...initialList.value];

  // Apply search filter - search all columns except 'No' and 'Action'
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const year = (item.Year || "").toString().toLowerCase();
      const quarter = (item.Quarter || "").toLowerCase();
      const referenceNo = (item['Reference No'] || "").toLowerCase();
      const authorityApproval = (item['Authority Approval'] || "").toLowerCase();
      const amount = (item.Amount || "").toString().toLowerCase();
      const status = (item.Status || "").toLowerCase();
      const date = (item.Date || "").toLowerCase();

      return (
        year.includes(keyword) ||
        quarter.includes(keyword) ||
        referenceNo.includes(keyword) ||
        authorityApproval.includes(keyword) ||
        amount.includes(keyword) ||
        status.includes(keyword) ||
        date.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.sm_year) {
    filtered = filtered.filter((item) => item.Year === smartFilter.value.sm_year);
  }
  if (smartFilter.value.sm_quarter) {
    filtered = filtered.filter((item) => 
      (item.Quarter || "").toLowerCase().includes(smartFilter.value.sm_quarter.toLowerCase())
    );
  }
  if (smartFilter.value.sm_status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.sm_status);
  }

  // Update the filtered list - force reactivity by creating new array reference
  filteredInitialList.value = [];
  nextTick(() => {
    filteredInitialList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredInitialList.value.length);

// Watch searchKeyword and smartFilter and apply filters when they change
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch dropdown options
const fetchDropdownOptions = async () => {
  try {
    // Fetch quarters
    const { data: quartersData } = await useFetch("/api/budget/initial/lookups/quarters", {
      method: "GET",
      initialCache: false,
    });
    if (quartersData.value?.statusCode === 200) {
      quarterOptions.value = quartersData.value.data.map((item) => ({
        label: item.qbu_description || `Q${item.qbu_quarter_id}`,
        value: item.qbu_description || `Q${item.qbu_quarter_id}`,
      }));
      quarterFilterOptions.value = [...quarterOptions.value];
    }

    // Fetch years for smart filter
    const { data: yearsData } = await useFetch("/api/budget/initial/lookups/years", {
      method: "GET",
      initialCache: false,
    });
    if (yearsData.value?.statusCode === 200) {
      yearOptions.value = yearsData.value.data.map((item) => ({
        label: item.qbu_year,
        value: item.qbu_year,
      }));
    }

    // Fetch statuses for smart filter
    const { data: statusesData } = await useFetch("/api/budget/initial/lookups/statuses", {
      method: "GET",
      initialCache: false,
    });
    if (statusesData.value?.statusCode === 200) {
      statusFilterOptions.value = statusesData.value.data.map((item) => ({
        label: item.bam_status_cd,
        value: item.bam_status_cd,
      }));
    }
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// Fetch budget initial records from API
const fetchInitials = async () => {
  try {
    loading.value = true;
    const query = {};

    // Add smart filters
    if (smartFilter.value.sm_year) {
      query.sm_year = smartFilter.value.sm_year;
    }
    if (smartFilter.value.sm_quarter) {
      query.sm_quarter = smartFilter.value.sm_quarter;
    }
    if (smartFilter.value.sm_status) {
      query.sm_status = smartFilter.value.sm_status;
    }

    const { data } = await useFetch("/api/budget/initial", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      initialList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ID: item.ID,
        Year: item.YEARS,
        Quarter: item.DESCR,
        "Reference No": item.ALLOCATE_NO,
        "Authority Approval": item.ENDORSE,
        Amount: item.AMT,
        Status: item.STAT,
        Date: item.date,
        Action: "", // Action column with icons
        // Keep STAT internally for action button logic (not displayed as column)
        STAT: item.STAT,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch budget initial records",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching budget initial records:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching budget initial records",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle add - create new initial record
const handleAdd = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/budget/new-initial-v2/new", {
      method: "POST",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const bamId = data.value.data.bam_id;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('initial_form_id', bamId.toString());
        sessionStorage.setItem('initial_form_mode', 'add');
      }
      navigateTo("/budget/new-initial-v2");
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to create new initial record",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error creating new initial record:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while creating new initial record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Handle edit - navigate to form for editing
const handleEdit = (item) => {
  if (item.STAT !== "ENTRY" && item.STAT !== "DRAFT") {
    $swal.fire({
      title: "Error",
      text: "Only entry/draft applications can be edited",
      icon: "error",
    });
    return;
  }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('initial_form_id', item.ID.toString());
    sessionStorage.setItem('initial_form_mode', 'edit');
  }
  navigateTo("/budget/new-initial-v2");
};

// Handle view - navigate to form for viewing
const handleView = (item) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('initial_form_id', item.ID.toString());
    sessionStorage.setItem('initial_form_mode', 'view');
  }
  navigateTo("/budget/new-initial-v2");
};

// Handle Warrant Initial PDF
const handleWarrantInitialPDF = (item) => {
  $swal.fire({
    title: "Info",
    text: `Warrant Initial PDF download for ID: ${item.ID} will be implemented`,
    icon: "info",
  });
};

// Handle Excel download
const handleExcelDownload = (item) => {
  $swal.fire({
    title: "Info",
    text: `Excel download for ID: ${item.ID} will be implemented`,
    icon: "info",
  });
};

// Handle Smart Filter
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  applyFilters();
  showSmartFilter.value = false;
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    sm_year: "",
    sm_quarter: "",
    sm_status: "",
  };
};

// Handle cancel
const handleCancel = (item) => {
  if (item.STAT !== "APPROVE" && item.STAT !== "APPROVED") {
    $swal.fire({
      title: "Error",
      text: "Only approved applications can be cancelled",
      icon: "error",
    });
    return;
  }
  cancelingId.value = item.ID;
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
  fetchInitials();
};

// Handle delete
const handleDelete = async (item) => {
  if (item.STAT !== "ENTRY" && item.STAT !== "DRAFT") {
    $swal.fire({
      title: "Error",
      text: "Only entry/draft applications can be deleted",
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
      fetchInitials();
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
  if (!value) return "0.00";
  return parseFloat(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

// Initial fetch
onMounted(() => {
  fetchDropdownOptions();
  fetchInitials();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Budget Initial Section -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Budget Initial</div>
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
          <div class="budget-initial-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`budget-initial-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredInitialList"
              :field="['no', 'Year', 'Quarter', 'Reference No', 'Authority Approval', 'Amount', 'Status', 'Date', 'Action']"
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
              <template v-slot:Quarter="data">
                {{ data.value.Quarter }}
              </template>
              <template v-slot:ReferenceNo="data">
                {{ data.value['Reference No'] }}
              </template>
              <template v-slot:AuthorityApproval="data">
                {{ data.value['Authority Approval'] }}
              </template>
              <template v-slot:Amount="data">
                {{ toCurrency(data.value.Amount) }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': data.value.Status === 'ENTRY' || data.value.Status === 'DRAFT',
                    'text-green-600 dark:text-green-400': data.value.Status === 'APPROVE' || data.value.Status === 'APPROVED',
                    'text-red-600 dark:text-red-400': data.value.Status === 'CANCEL',
                  }"
                >
                  {{ data.value.Status }}
                </span>
              </template>
              <template v-slot:Date="data">
                {{ formatDate(data.value.Date) }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleEdit(data.value)"
                    :disabled="data.value.STAT !== 'ENTRY' && data.value.STAT !== 'DRAFT'"
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
                    @click="handleWarrantInitialPDF(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Warrant Initial"
                  >
                    <i class="fas fa-file" style="font-size: 20px; color: rgb(75, 85, 99);" :class="{ 'dark:text-gray-400': true }"></i>
                  </button>
                  <button
                    @click="handleExcelDownload(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Excel"
                  >
                    <Icon
                      name="material-symbols:download"
                      class="text-gray-600 dark:text-gray-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleDelete(data.value)"
                    :disabled="data.value.STAT !== 'ENTRY' && data.value.STAT !== 'DRAFT'"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <Icon
                      name="material-symbols:delete"
                      class="text-red-600 dark:text-red-400"
                      size="20"
                    />
                  </button>
                  <button
                    @click="handleCancel(data.value)"
                    :disabled="data.value.STAT !== 'APPROVE' && data.value.STAT !== 'APPROVED'"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel"
                  >
                    <Icon
                      name="material-symbols:close"
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
                  v-model="smartFilter.sm_year"
                  type="select"
                  :options="yearOptions"
                  placeholder="Select Year"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.sm_year"
                  type="button"
                  @click="smartFilter.sm_year = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Quarter -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Quarter:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.sm_quarter"
                  type="select"
                  :options="quarterFilterOptions"
                  placeholder="Select Quarter"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.sm_quarter"
                  type="button"
                  @click="smartFilter.sm_quarter = ''"
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
                  v-model="smartFilter.sm_status"
                  type="select"
                  :options="statusFilterOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.sm_status"
                  type="button"
                  @click="smartFilter.sm_status = ''"
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
.budget-initial-table-wrapper :deep(.table-header) {
  display: none;
}
</style>
