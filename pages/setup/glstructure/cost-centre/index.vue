<script setup>
definePageMeta({
  title: "Cost Centre",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "Cost Centre", path: "/setup/glstructure/cost-centre" },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Cost Centre";
const moduleName = "Setup";
const pageBreadcrumbText = "Dashboard > Setup > GL Structure Setup > Cost Centre";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Table data
const costCentreList = ref([]);
const loading = ref(false);
const datatableRef = ref(null);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit Cost Centre modal state
const showCostCentreModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({
  ccr_costcentre: "",
  PTJCodesm: "",
  OUcodesm: "",
  statussm: "",
});

// Store original filter values for reset
const originalFilter = ref({
  ccr_costcentre: "",
  PTJCodesm: "",
  OUcodesm: "",
  statussm: "",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Flag Salary options
const flagSalaryOptions = ref([
  { label: "YES", value: "Y" },
  { label: "NO", value: "N" },
]);

// Cost Centre form data
const costCentreForm = ref({
  ccr_costcentre_id: null,
  ccr_costcentre: "",
  ccr_costcentre_desc: "",
  ccr_costcentre_desc_eng: "",
  oun_code: "",
  oun_desc: "",
  ccr_address: "",
  ccr_hostel_code: "",
  ccr_status: "ACTIVE",
  ccr_flag_salary: "N",
});

// PTJ dropdown options
const ptjOptions = ref([]);
const ptjSearchTerm = ref("");

// Cost Centre code dropdown options (for smart filter)
const costCentreCodeOptions = ref([]);
const costCentreCodeSearchTerm = ref("");

// Filtered data
const filteredCostCentreList = ref([]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...costCentreList.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const code = (item.Code || "").toLowerCase();
      const desc = (item["Description (Malay)"] || "").toLowerCase();
      const ptj = (item.PTJ || "").toLowerCase();
      const ptjDesc = (item["PTJ Description"] || "").toLowerCase();
      const address = (item.Address || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        code.includes(keyword) ||
        desc.includes(keyword) ||
        ptj.includes(keyword) ||
        ptjDesc.includes(keyword) ||
        address.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.ccr_costcentre) {
    filtered = filtered.filter((item) => item.Code === smartFilter.value.ccr_costcentre);
  }

  if (smartFilter.value.PTJCodesm) {
    filtered = filtered.filter((item) => item.PTJ === smartFilter.value.PTJCodesm);
  }

  if (smartFilter.value.OUcodesm) {
    filtered = filtered.filter((item) => item.PTJ === smartFilter.value.OUcodesm);
  }

  if (smartFilter.value.statussm) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.statussm);
  }

  // Update the filtered list
  filteredCostCentreList.value = [];
  nextTick(() => {
    filteredCostCentreList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredCostCentreList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch cost centres from API
const fetchCostCentres = async () => {
  try {
    loading.value = true;
    const query = {};
    if (searchKeyword.value) {
      query.search = searchKeyword.value;
    }
    if (smartFilter.value.ccr_costcentre) {
      query.smartFilter_ccr_costcentre = smartFilter.value.ccr_costcentre;
    }
    if (smartFilter.value.PTJCodesm) {
      query.smartFilter_PTJCodesm = smartFilter.value.PTJCodesm;
    }
    if (smartFilter.value.OUcodesm) {
      query.smartFilter_OUcodesm = smartFilter.value.OUcodesm;
    }
    if (smartFilter.value.statussm) {
      query.smartFilter_statussm = smartFilter.value.statussm;
    }

    const { data } = await useFetch("/api/setup/cost-centre", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      costCentreList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Code': item.Code || '',
        'Description (Malay)': item['Description (Malay)'] || '',
        'Description (English)': item['Description (English)'] || '',
        'PTJ': item.PTJ || '',
        'OU': item.OU || '',
        'PTJ Description': item['PTJ Description'] || '',
        'OU Description': item['OU Description'] || '',
        'Address': item.Address || '',
        'Hostel Code': item['Hostel Code'] || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data for actions
        ccr_costcentre_id: item.ccr_costcentre_id,
        ccr_costcentre: item.ccr_costcentre,
        ccr_costcentre_desc: item.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: item.ccr_costcentre_desc_eng,
        oun_code: item.oun_code,
        ccr_address: item.ccr_address,
        ccr_hostel_code: item.ccr_hostel_code,
        ccr_status: item.ccr_status,
        ccr_flag_salary: item.ccr_flag_salary,
        oun_desc: item.oun_desc,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch cost centres",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching cost centres:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching cost centres",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Fetch PTJ options for dropdown
const fetchPTJOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/cost-centre/autosuggest-ptj", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      ptjOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
        desc: item._Desc,
        address: item._Add,
      }));
    }
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
  }
};

// Fetch Cost Centre code options for smart filter
const fetchCostCentreCodeOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/cost-centre/autosuggest-code", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      costCentreCodeOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
      }));
    }
  } catch (error) {
    console.error("Error fetching cost centre code options:", error);
  }
};

// Initialize on mount
onMounted(() => {
  fetchCostCentres();
  fetchPTJOptions();
  fetchCostCentreCodeOptions();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    ccr_costcentre: smartFilter.value.ccr_costcentre,
    PTJCodesm: smartFilter.value.PTJCodesm,
    OUcodesm: smartFilter.value.OUcodesm,
    statussm: smartFilter.value.statussm,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    ccr_costcentre: "",
    PTJCodesm: "",
    OUcodesm: "",
    statussm: "",
  };
  originalFilter.value = {
    ccr_costcentre: "",
    PTJCodesm: "",
    OUcodesm: "",
    statussm: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchCostCentres();
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    ccr_costcentre: originalFilter.value.ccr_costcentre,
    PTJCodesm: originalFilter.value.PTJCodesm,
    OUcodesm: originalFilter.value.OUcodesm,
    statussm: originalFilter.value.statussm,
  };
  showSmartFilter.value = false;
};

// Handle PTJ selection
const handlePTJSelection = async (value) => {
  if (value) {
    const selected = ptjOptions.value.find(opt => opt.value === value);
    if (selected) {
      costCentreForm.value.oun_desc = selected.desc || '';
    }
    // Refresh PTJ options
    await fetchPTJOptions();
  }
};

// View function
const handleView = async (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.ccr_costcentre_id;
  
  try {
    const { data } = await useFetch(`/api/setup/cost-centre/${item.ccr_costcentre_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      costCentreForm.value = {
        ccr_costcentre_id: data.value.data.ccr_costcentre_id,
        ccr_costcentre: data.value.data.ccr_costcentre,
        ccr_costcentre_desc: data.value.data.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: data.value.data.ccr_costcentre_desc_eng || '',
        oun_code: data.value.data.oun_code || '',
        oun_desc: data.value.data.oun_desc || '',
        ccr_address: data.value.data.ccr_address || '',
        ccr_hostel_code: data.value.data.ccr_hostel_code || '',
        ccr_status: data.value.data.ccr_status,
        ccr_flag_salary: data.value.data.ccr_flag_salary || 'N',
      };
      // Fetch PTJ options to populate dropdown
      await fetchPTJOptions();
    }
  } catch (error) {
    console.error("Error fetching cost centre:", error);
  }
  
  showCostCentreModal.value = true;
};

// Edit function
const handleEdit = async (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.ccr_costcentre_id;
  
  try {
    const { data } = await useFetch(`/api/setup/cost-centre/${item.ccr_costcentre_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      costCentreForm.value = {
        ccr_costcentre_id: data.value.data.ccr_costcentre_id,
        ccr_costcentre: data.value.data.ccr_costcentre,
        ccr_costcentre_desc: data.value.data.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: data.value.data.ccr_costcentre_desc_eng || '',
        oun_code: data.value.data.oun_code || '',
        oun_desc: data.value.data.oun_desc || '',
        ccr_address: data.value.data.ccr_address || '',
        ccr_hostel_code: data.value.data.ccr_hostel_code || '',
        ccr_status: data.value.data.ccr_status,
        ccr_flag_salary: data.value.data.ccr_flag_salary || 'N',
      };
      // Fetch PTJ options to populate dropdown
      await fetchPTJOptions();
    }
  } catch (error) {
    console.error("Error fetching cost centre:", error);
  }
  
  showCostCentreModal.value = true;
};

// Add function
const handleAdd = async () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  costCentreForm.value = {
    ccr_costcentre_id: null,
    ccr_costcentre: "",
    ccr_costcentre_desc: "",
    ccr_costcentre_desc_eng: "",
    oun_code: "",
    oun_desc: "",
    ccr_address: "",
    ccr_hostel_code: "",
    ccr_status: "ACTIVE",
    ccr_flag_salary: "N",
  };
  // Fetch PTJ options to populate dropdown
  await fetchPTJOptions();
  showCostCentreModal.value = true;
};

// Datatable features (Save/Load Template, Ungroup/Group, Generate API, Download PDF/CSV)
const {
  templateFileInputRef,
  exportConfigRef,
  isGrouped,
  showGenerateApiModal,
  apiOutputType,
  generateApiLoading,
  handleSaveTemplate,
  handleLoadTemplate,
  onTemplateFileChange,
  handleGenerateApi,
  handleGenerateApiProceed,
  handleCloseGenerateApiModal,
  handleUngroupList,
  handleGroupList,
  handleDownloadPDF,
  handleDownloadCSV,
} = useDatatableFeatures({
  pageName: "Cost Centre",
  apiDataPath: "/api/setup/cost-centre",
  defaultExportColumns: ["Code", "Description (Malay)", "PTJ", "PTJ Description", "Address", "Status"],
  getFilteredList: () => filteredCostCentreList.value,
  datatableRef,
  searchKeyword,
  smartFilter,
  applyFilters,
  getLookupLabel: (opts, val) => {
    if (!opts || !Array.isArray(opts) || val == null || val === "") return val ?? "";
    const opt = opts.find((o) => String(o.value) === String(val) || String(o.label) === String(val));
    return opt ? opt.label : val;
  },
  columnOptionsLookup: { Status: statusOptions },
  smartFilterLabels: { ccr_costcentre: "Code", PTJCodesm: "PTJ", OUcodesm: "OU", statussm: "Status" },
  smartFilterOptionsLookup: { statussm: statusOptions },
});

// Save Cost Centre
const handleSaveCostCentre = async () => {
  // Validation
  if (
    !costCentreForm.value.ccr_costcentre ||
    !costCentreForm.value.ccr_costcentre_desc ||
    !costCentreForm.value.oun_code ||
    !costCentreForm.value.ccr_status
  ) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Cost Centre Code, Description (Malay), PTJ, and Status)",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/setup/cost-centre/${editingId.value}`, {
        method: "PUT",
        body: {
          ccr_costcentre: costCentreForm.value.ccr_costcentre,
          ccr_costcentre_desc: costCentreForm.value.ccr_costcentre_desc,
          ccr_costcentre_desc_eng: costCentreForm.value.ccr_costcentre_desc_eng,
          oun_code: costCentreForm.value.oun_code,
          ccr_address: costCentreForm.value.ccr_address,
          ccr_hostel_code: costCentreForm.value.ccr_hostel_code,
          ccr_status: costCentreForm.value.ccr_status,
          ccr_flag_salary: costCentreForm.value.ccr_flag_salary,
        },
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/setup/cost-centre", {
        method: "POST",
        body: {
          ccr_costcentre: costCentreForm.value.ccr_costcentre,
          ccr_costcentre_desc: costCentreForm.value.ccr_costcentre_desc,
          ccr_costcentre_desc_eng: costCentreForm.value.ccr_costcentre_desc_eng,
          oun_code: costCentreForm.value.oun_code,
          ccr_address: costCentreForm.value.ccr_address,
          ccr_hostel_code: costCentreForm.value.ccr_hostel_code,
          ccr_status: costCentreForm.value.ccr_status,
          ccr_flag_salary: costCentreForm.value.ccr_flag_salary,
        },
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      const successMessage = isEditMode.value ? "Success. Cost Centre updated successfully" : "Success. Cost Centre is created successfully";
      $swal.fire({
        title: "Success",
        text: successMessage,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      if (isEditMode.value) await logUpdateSuccess(successMessage, "Cost Centre updated");
      else await logCreateSuccess(successMessage, "Cost Centre created");
      
      // Refresh data from API
      await fetchCostCentres();
      
      // Reset form and close modal
      showCostCentreModal.value = false;
      costCentreForm.value = {
        ccr_costcentre_id: null,
        ccr_costcentre: "",
        ccr_costcentre_desc: "",
        ccr_costcentre_desc_eng: "",
        oun_code: "",
        oun_desc: "",
        ccr_address: "",
        ccr_hostel_code: "",
        ccr_status: "ACTIVE",
        ccr_flag_salary: "N",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save cost centre",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving cost centre:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving cost centre",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Cost Centre form
const handleCancelCostCentre = () => {
  showCostCentreModal.value = false;
  isViewMode.value = false;
  costCentreForm.value = {
    ccr_costcentre_id: null,
    ccr_costcentre: "",
    ccr_costcentre_desc: "",
    ccr_costcentre_desc_eng: "",
    oun_code: "",
    oun_desc: "",
    ccr_address: "",
    ccr_hostel_code: "",
    ccr_status: "ACTIVE",
    ccr_flag_salary: "N",
  };
};

// Delete function
const handleDelete = async (item) => {
  const messageText = `Are you sure? Do you want to delete cost centre "${item.Code}"?`;
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete cost centre "${item.Code}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  await updateMessageLogAction(logId, result.isConfirmed ? "Yes, delete it!" : "Cancel");

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const response = await useFetch(`/api/setup/cost-centre/${item.ccr_costcentre_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Cost centre has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchCostCentres();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete cost centre",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting cost centre:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting cost centre",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <input
      ref="templateFileInputRef"
      type="file"
      accept=".json,application/json"
      class="hidden"
      @change="onTemplateFileChange"
    />
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div class="text-lg font-semibold">List of Cost Centre</div>
          <rs-dropdown
            variant="secondary-text"
            size="sm"
            :hideChevron="true"
            position="bottom"
            textAlign="right"
            itemSize="11rem"
            class="[&_.button]:!h-8 [&_.button]:!min-h-8 [&_.button]:!p-1 [&_.button]:!border-0 [&_.button]:!min-w-0"
          >
            <template #title>
              <Icon name="mdi:dots-vertical" size="1rem" />
            </template>
            <rs-dropdown-item @click="handleSaveTemplate">Save Template</rs-dropdown-item>
            <rs-dropdown-item @click="handleLoadTemplate">Load Template</rs-dropdown-item>
            <rs-dropdown-item v-if="isGrouped" @click="handleUngroupList">Ungroup List</rs-dropdown-item>
            <rs-dropdown-item v-else @click="handleGroupList">Group List</rs-dropdown-item>
            <rs-dropdown-item @click="handleGenerateApi">Generate API</rs-dropdown-item>
          </rs-dropdown>
        </div>
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
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
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
                        class="!w-3.5 !h-3.5 text-gray-500"
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
          <div class="cost-centre-table-wrapper" :style="{ maxHeight: filteredCostCentreList.length > 10 ? '600px' : 'auto', overflowY: filteredCostCentreList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              ref="datatableRef"
              :exportConfigRef="exportConfigRef"
              :key="`cost-centre-table`"
              :data="filteredCostCentreList"
              :field="['No', 'Code', 'Description (Malay)', 'PTJ', 'PTJ Description', 'Address', 'Status', 'Action']"
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
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="isGrouped"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                {{ data.value.Code }}
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
              </template>
              <template v-slot:PTJDescription="data">
                {{ data.value['PTJ Description'] }}
              </template>
              <template v-slot:Address="data">
                {{ data.value.Address }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.Status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.Status === 'INACTIVE',
                  }"
                >
                  {{ data.value.Status }}
                </span>
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
            <!-- Code -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Code:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.ccr_costcentre"
                  type="select"
                  :options="costCentreCodeOptions"
                  placeholder="Select Code"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.ccr_costcentre"
                  type="button"
                  @click="smartFilter.ccr_costcentre = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- PTJ Code -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PTJ Code:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.PTJCodesm"
                  type="select"
                  :options="ptjOptions"
                  placeholder="Select PTJ Code"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.PTJCodesm"
                  type="button"
                  @click="smartFilter.PTJCodesm = ''"
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
                  v-model="smartFilter.statussm"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.statussm"
                  type="button"
                  @click="smartFilter.statussm = ''"
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

    <!-- Add/Edit Cost Centre Modal -->
    <rs-modal
      v-model="showCostCentreModal"
      :title="isViewMode ? 'View Cost Centre' : (isEditMode ? 'Edit Cost Centre' : 'Add Cost Centre')"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Cost Centre' : (isEditMode ? 'Edit Cost Centre' : 'Add Cost Centre') }}
          </h4>
          <Icon
            @click="handleCancelCostCentre"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Cost Centre Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.ccr_costcentre"
                  type="text"
                  :disabled="isViewMode || isEditMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Cost Centre Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.ccr_costcentre_desc"
                  type="textarea"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Cost Centre Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.ccr_costcentre_desc_eng"
                  type="textarea"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">PTJ<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.oun_code"
                  type="select"
                  :options="ptjOptions"
                  :disabled="isViewMode"
                  @input="handlePTJSelection"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">PTJ Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.oun_desc"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Address:</label>
              <div class="flex-1">
                <FormKit
                  v-model="costCentreForm.ccr_address"
                  type="textarea"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="costCentreForm.ccr_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Is Flag Salary?:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="costCentreForm.ccr_flag_salary"
                  type="select"
                  :options="flagSalaryOptions"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelCostCentre">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveCostCentre">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Generate API Modal -->
    <rs-modal v-model="showGenerateApiModal" title="Generate API" size="md">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Type</label>
            <FormKit
              v-model="apiOutputType"
              type="select"
              :options="[
                { label: 'JSON', value: 'JSON' },
                { label: 'PDF', value: 'PDF' },
                { label: 'CSV', value: 'CSV' },
                { label: 'EXCEL', value: 'EXCEL' },
              ]"
              outer-class="mb-0"
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            A unique API key will be generated. Use the URL to access data in the selected format. JSON and PDF display in browser; CSV and Excel download.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="handleCloseGenerateApiModal">Cancel</rs-button>
          <rs-button variant="primary" :disabled="generateApiLoading" @click="handleGenerateApiProceed">
            {{ generateApiLoading ? 'Generating...' : 'Proceed' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.cost-centre-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.cost-centre-table-wrapper :deep(th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>

<style>
/* Modal styles must be non-scoped because modal is teleported to body */
.account-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.account-modal-custom .account-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

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

/* Hide all direct children of modal-header except the custom header */
.account-modal-custom .modal-header > *:not(.account-modal-header) {
  display: none !important;
}

.account-modal-custom .modal-header > .account-modal-header {
  display: flex !important;
}

.smart-filter-modal-custom .modal-header > *:not(.smart-filter-modal-header) {
  display: none !important;
}

.smart-filter-modal-custom .modal-header > .smart-filter-modal-header {
  display: flex !important;
}
</style>
