<script setup>
definePageMeta({
  title: "Cascade Structure",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "Cascade Structure", path: "/setup/glstructure/cascade-structure" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const cascadeList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Smart Filter modal state
const showSmartFilter = ref(false);

// Add/Edit/Duplicate Cascade Structure modal state
const showCascadeModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const isDuplicateMode = ref(false);
const editingId = ref(null);

// Smart Filter values
const smartFilter = ref({
  fty_fund_type_sm: "",
  activity_smptj: "",
  activity_smou: "",
  oun_codePTJ: "",
  costcenter_sm: "",
  ouc_status: "",
});

// Store original filter values for reset
const originalFilter = ref({
  fty_fund_type_sm: "",
  activity_smptj: "",
  activity_smou: "",
  oun_codePTJ: "",
  costcenter_sm: "",
  ouc_status: "",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Cascade Structure form data
const cascadeForm = ref({
  ouc_ounit_costcentre_id: null,
  fty_fund_type: "",
  fty_fund_desc: "",
  at_activity_code: "",
  at_activity_description_bm: "",
  oun_code: "",
  oun_desc: "",
  ccr_costcentre: "",
  ccr_costcentre_desc: "",
  ouc_status: "ACTIVE",
});

// Dropdown options
const fundOptions = ref([]);
const activityOptions = ref([]);
const ptjOptions = ref([]);
const costCentreOptions = ref([]);

// Smart filter dropdown options
const smartFilterFundOptions = ref([]);
const smartFilterActivityOptions = ref([]);
const smartFilterPTJOptions = ref([]);
const smartFilterCostCentreOptions = ref([]);

// Filtered data
const filteredCascadeList = ref([]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...cascadeList.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const fund = (item.Fund || "").toLowerCase();
      const fundDesc = (item["Fund Desc"] || "").toLowerCase();
      const activity = (item.Activity || "").toLowerCase();
      const activityDesc = (item["Activity Description"] || "").toLowerCase();
      const ptj = (item.PTJ || "").toLowerCase();
      const ptjDesc = (item["PTJ Description"] || "").toLowerCase();
      const costCenter = (item["Cost Center"] || "").toLowerCase();
      const costCenterDesc = (item["Cost Center Description"] || "").toLowerCase();
      const status = (item.Status || "").toLowerCase();

      return (
        fund.includes(keyword) ||
        fundDesc.includes(keyword) ||
        activity.includes(keyword) ||
        activityDesc.includes(keyword) ||
        ptj.includes(keyword) ||
        ptjDesc.includes(keyword) ||
        costCenter.includes(keyword) ||
        costCenterDesc.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Apply smart filter
  if (smartFilter.value.fty_fund_type_sm) {
    filtered = filtered.filter((item) => item.Fund === smartFilter.value.fty_fund_type_sm);
  }

  if (smartFilter.value.activity_smptj) {
    filtered = filtered.filter((item) => item.Activity === smartFilter.value.activity_smptj);
  }

  if (smartFilter.value.activity_smou) {
    filtered = filtered.filter((item) => item.Activity === smartFilter.value.activity_smou);
  }

  if (smartFilter.value.oun_codePTJ) {
    filtered = filtered.filter((item) => item.PTJ === smartFilter.value.oun_codePTJ);
  }

  if (smartFilter.value.costcenter_sm) {
    filtered = filtered.filter((item) => item["Cost Center"] === smartFilter.value.costcenter_sm);
  }

  if (smartFilter.value.ouc_status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.ouc_status);
  }

  // Update the filtered list
  filteredCascadeList.value = [];
  nextTick(() => {
    filteredCascadeList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredCascadeList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Watch smartFilter and apply filters when it changes
watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

// Fetch cascade structures from API
const fetchCascadeStructures = async () => {
  try {
    loading.value = true;
    const query = {};
    if (searchKeyword.value) {
      query.search = searchKeyword.value;
    }
    if (smartFilter.value.fty_fund_type_sm) {
      query.smartFilter_fty_fund_type_sm = smartFilter.value.fty_fund_type_sm;
    }
    if (smartFilter.value.activity_smptj) {
      query.smartFilter_activity_smptj = smartFilter.value.activity_smptj;
    }
    if (smartFilter.value.activity_smou) {
      query.smartFilter_activity_smou = smartFilter.value.activity_smou;
    }
    if (smartFilter.value.oun_codePTJ) {
      query.smartFilter_oun_codePTJ = smartFilter.value.oun_codePTJ;
    }
    if (smartFilter.value.costcenter_sm) {
      query.smartFilter_costcenter_sm = smartFilter.value.costcenter_sm;
    }
    if (smartFilter.value.ouc_status) {
      query.smartFilter_ouc_status = smartFilter.value.ouc_status;
    }

    const { data } = await useFetch("/api/setup/cascade-structure", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      cascadeList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Costcentre ID': item['Costcentre ID'],
        'Fund': item.Fund || '',
        'Fund Desc': item['Fund Desc'] || '',
        'Activity': item.Activity || '',
        'Activity Description': item['Activity Description'] || '',
        'PTJ': item.PTJ || '',
        'OU Code': item['OU Code'] || '',
        'PTJ Description': item['PTJ Description'] || '',
        'OU Description': item['OU Description'] || '',
        'Cost Center': item['Cost Center'] || '',
        'Cost Center Description': item['Cost Center Description'] || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data for actions
        ouc_ounit_costcentre_id: item.ouc_ounit_costcentre_id,
        fty_fund_type: item.fty_fund_type,
        at_activity_code: item.at_activity_code,
        oun_code: item.oun_code,
        ccr_costcentre: item.ccr_costcentre,
        ouc_status: item.ouc_status,
      }));
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch cascade structures",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching cascade structures:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching cascade structures",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Fetch dropdown options
const fetchFundOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/cascade-structure/autosuggest-fund", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      fundOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
        desc: item._Desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching fund options:", error);
  }
};

const fetchActivityOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/cascade-structure/autosuggest-activity", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      activityOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
        desc: item._Desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching activity options:", error);
  }
};

const fetchPTJOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/cascade-structure/autosuggest-ptj", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      ptjOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
        desc: item._Desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
  }
};

const fetchCostCentreOptions = async (search = "", ptjCode = "") => {
  try {
    const query = { search };
    if (ptjCode) {
      query.PTJCode = ptjCode;
    }
    const { data } = await useFetch("/api/setup/cascade-structure/autosuggest-costcentre", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      costCentreOptions.value = (data.value.results || []).map(item => ({
        label: item.text,
        value: item.id,
        desc: item._Desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching cost centre options:", error);
  }
};

// Fetch smart filter options
const fetchSmartFilterOptions = async () => {
  await Promise.all([
    fetchFundOptions(),
    fetchActivityOptions(),
    fetchPTJOptions(),
    fetchCostCentreOptions(),
  ]);
  
  smartFilterFundOptions.value = [...fundOptions.value];
  smartFilterActivityOptions.value = [...activityOptions.value];
  smartFilterPTJOptions.value = [...ptjOptions.value];
  smartFilterCostCentreOptions.value = [...costCentreOptions.value];
};

// Initialize on mount
onMounted(() => {
  fetchCascadeStructures();
  fetchFundOptions();
  fetchActivityOptions();
  fetchPTJOptions();
  fetchCostCentreOptions();
  fetchSmartFilterOptions();
});

// Handle filter - open Smart Filter modal
const handleFilter = () => {
  originalFilter.value = {
    fty_fund_type_sm: smartFilter.value.fty_fund_type_sm,
    activity_smptj: smartFilter.value.activity_smptj,
    activity_smou: smartFilter.value.activity_smou,
    oun_codePTJ: smartFilter.value.oun_codePTJ,
    costcenter_sm: smartFilter.value.costcenter_sm,
    ouc_status: smartFilter.value.ouc_status,
  };
  showSmartFilter.value = true;
};

// Handle Smart Filter Reset
const handleFilterReset = () => {
  smartFilter.value = {
    fty_fund_type_sm: "",
    activity_smptj: "",
    activity_smou: "",
    oun_codePTJ: "",
    costcenter_sm: "",
    ouc_status: "",
  };
  originalFilter.value = {
    fty_fund_type_sm: "",
    activity_smptj: "",
    activity_smou: "",
    oun_codePTJ: "",
    costcenter_sm: "",
    ouc_status: "",
  };
};

// Handle Smart Filter Ok
const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchCascadeStructures();
};

// Handle Smart Filter Cancel/Close
const handleFilterClose = () => {
  smartFilter.value = {
    fty_fund_type_sm: originalFilter.value.fty_fund_type_sm,
    activity_smptj: originalFilter.value.activity_smptj,
    activity_smou: originalFilter.value.activity_smou,
    oun_codePTJ: originalFilter.value.oun_codePTJ,
    costcenter_sm: originalFilter.value.costcenter_sm,
    ouc_status: originalFilter.value.ouc_status,
  };
  showSmartFilter.value = false;
};

// Handle dropdown selections
const handleFundSelection = (value) => {
  if (value) {
    const selected = fundOptions.value.find(opt => opt.value === value);
    if (selected) {
      cascadeForm.value.fty_fund_desc = selected.desc || '';
    }
  }
};

const handleActivitySelection = (value) => {
  if (value) {
    const selected = activityOptions.value.find(opt => opt.value === value);
    if (selected) {
      cascadeForm.value.at_activity_description_bm = selected.desc || '';
    }
  }
};

const handlePTJSelection = async (value) => {
  if (value) {
    const selected = ptjOptions.value.find(opt => opt.value === value);
    if (selected) {
      cascadeForm.value.oun_desc = selected.desc || '';
    }
    // Refresh cost centre options based on PTJ
    await fetchCostCentreOptions("", value);
  }
};

const handleCostCentreSelection = (value) => {
  if (value) {
    const selected = costCentreOptions.value.find(opt => opt.value === value);
    if (selected) {
      cascadeForm.value.ccr_costcentre_desc = selected.desc || '';
    }
  }
};

// View function
const handleView = async (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  isDuplicateMode.value = false;
  editingId.value = item.ouc_ounit_costcentre_id;
  
  try {
    const { data } = await useFetch(`/api/setup/cascade-structure/${item.ouc_ounit_costcentre_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      cascadeForm.value = {
        ouc_ounit_costcentre_id: data.value.data.ouc_ounit_costcentre_id,
        fty_fund_type: data.value.data.fty_fund_type,
        fty_fund_desc: data.value.data.fty_fund_desc,
        at_activity_code: data.value.data.at_activity_code,
        at_activity_description_bm: data.value.data.at_activity_description_bm,
        oun_code: data.value.data.oun_code,
        oun_desc: data.value.data.oun_desc,
        ccr_costcentre: data.value.data.ccr_costcentre,
        ccr_costcentre_desc: data.value.data.ccr_costcentre_desc,
        ouc_status: data.value.data.ouc_status,
      };
      // Fetch dropdown options
      await Promise.all([
        fetchFundOptions(),
        fetchActivityOptions(),
        fetchPTJOptions(),
        fetchCostCentreOptions("", data.value.data.oun_code),
      ]);
    }
  } catch (error) {
    console.error("Error fetching cascade structure:", error);
  }
  
  showCascadeModal.value = true;
};

// Edit function
const handleEdit = async (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  isDuplicateMode.value = false;
  editingId.value = item.ouc_ounit_costcentre_id;
  
  try {
    const { data } = await useFetch(`/api/setup/cascade-structure/${item.ouc_ounit_costcentre_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      cascadeForm.value = {
        ouc_ounit_costcentre_id: data.value.data.ouc_ounit_costcentre_id,
        fty_fund_type: data.value.data.fty_fund_type,
        fty_fund_desc: data.value.data.fty_fund_desc,
        at_activity_code: data.value.data.at_activity_code,
        at_activity_description_bm: data.value.data.at_activity_description_bm,
        oun_code: data.value.data.oun_code,
        oun_desc: data.value.data.oun_desc,
        ccr_costcentre: data.value.data.ccr_costcentre,
        ccr_costcentre_desc: data.value.data.ccr_costcentre_desc,
        ouc_status: data.value.data.ouc_status,
      };
      // Fetch dropdown options
      await Promise.all([
        fetchFundOptions(),
        fetchActivityOptions(),
        fetchPTJOptions(),
        fetchCostCentreOptions("", data.value.data.oun_code),
      ]);
    }
  } catch (error) {
    console.error("Error fetching cascade structure:", error);
  }
  
  showCascadeModal.value = true;
};

// Duplicate function
const handleDuplicate = async (item) => {
  isDuplicateMode.value = true;
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  
  try {
    const { data } = await useFetch(`/api/setup/cascade-structure/${item.ouc_ounit_costcentre_id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      cascadeForm.value = {
        ouc_ounit_costcentre_id: null,
        fty_fund_type: data.value.data.fty_fund_type,
        fty_fund_desc: data.value.data.fty_fund_desc,
        at_activity_code: data.value.data.at_activity_code,
        at_activity_description_bm: data.value.data.at_activity_description_bm,
        oun_code: data.value.data.oun_code,
        oun_desc: data.value.data.oun_desc,
        ccr_costcentre: data.value.data.ccr_costcentre,
        ccr_costcentre_desc: data.value.data.ccr_costcentre_desc,
        ouc_status: data.value.data.ouc_status,
      };
      // Fetch dropdown options
      await Promise.all([
        fetchFundOptions(),
        fetchActivityOptions(),
        fetchPTJOptions(),
        fetchCostCentreOptions("", data.value.data.oun_code),
      ]);
    }
  } catch (error) {
    console.error("Error fetching cascade structure:", error);
  }
  
  showCascadeModal.value = true;
};

// Add function
const handleAdd = async () => {
  isEditMode.value = false;
  isViewMode.value = false;
  isDuplicateMode.value = false;
  editingId.value = null;
  cascadeForm.value = {
    ouc_ounit_costcentre_id: null,
    fty_fund_type: "",
    fty_fund_desc: "",
    at_activity_code: "",
    at_activity_description_bm: "",
    oun_code: "",
    oun_desc: "",
    ccr_costcentre: "",
    ccr_costcentre_desc: "",
    ouc_status: "ACTIVE",
  };
  // Fetch dropdown options
  await Promise.all([
    fetchFundOptions(),
    fetchActivityOptions(),
    fetchPTJOptions(),
    fetchCostCentreOptions(),
  ]);
  showCascadeModal.value = true;
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

// Save Cascade Structure
const handleSaveCascadeStructure = async () => {
  // Validation
  if (
    !cascadeForm.value.fty_fund_type ||
    !cascadeForm.value.at_activity_code ||
    !cascadeForm.value.oun_code ||
    !cascadeForm.value.ccr_costcentre ||
    !cascadeForm.value.ouc_status
  ) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Fund Type, Activity Code, PTJ Code, Cost Centre, and Status)",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/setup/cascade-structure/${editingId.value}`, {
        method: "PUT",
        body: {
          fty_fund_type: cascadeForm.value.fty_fund_type,
          at_activity_code: cascadeForm.value.at_activity_code,
          oun_code: cascadeForm.value.oun_code,
          ccr_costcentre: cascadeForm.value.ccr_costcentre,
          ouc_status: cascadeForm.value.ouc_status,
        },
        initialCache: false,
      });
    } else {
      // Add new record (or duplicate)
      response = await useFetch("/api/setup/cascade-structure", {
        method: "POST",
        body: {
          fty_fund_type: cascadeForm.value.fty_fund_type,
          at_activity_code: cascadeForm.value.at_activity_code,
          oun_code: cascadeForm.value.oun_code,
          ccr_costcentre: cascadeForm.value.ccr_costcentre,
          ouc_status: cascadeForm.value.ouc_status,
        },
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200 || response.data.value?.statusCode === 201) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Cascade structure updated successfully" : "Cascade structure created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchCascadeStructures();
      
      // Reset form and close modal
      showCascadeModal.value = false;
      cascadeForm.value = {
        ouc_ounit_costcentre_id: null,
        fty_fund_type: "",
        fty_fund_desc: "",
        at_activity_code: "",
        at_activity_description_bm: "",
        oun_code: "",
        oun_desc: "",
        ccr_costcentre: "",
        ccr_costcentre_desc: "",
        ouc_status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save cascade structure",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving cascade structure:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving cascade structure",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Cascade Structure form
const handleCancelCascadeStructure = () => {
  showCascadeModal.value = false;
  isViewMode.value = false;
  isEditMode.value = false;
  isDuplicateMode.value = false;
  cascadeForm.value = {
    ouc_ounit_costcentre_id: null,
    fty_fund_type: "",
    fty_fund_desc: "",
    at_activity_code: "",
    at_activity_description_bm: "",
    oun_code: "",
    oun_desc: "",
    ccr_costcentre: "",
    ccr_costcentre_desc: "",
    ouc_status: "ACTIVE",
  };
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete this cascade structure?`,
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
      const response = await useFetch(`/api/setup/cascade-structure/${item.ouc_ounit_costcentre_id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Cascade structure has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchCascadeStructures();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete cascade structure",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting cascade structure:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting cascade structure",
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
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Cascade Structure</div>
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
          <div class="cascade-structure-table-wrapper" :style="{ maxHeight: filteredCascadeList.length > 10 ? '600px' : 'auto', overflowY: filteredCascadeList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`cascade-structure-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredCascadeList"
              :field="['No', 'Fund', 'Fund Desc', 'Activity', 'Activity Description', 'PTJ', 'PTJ Description', 'Cost Center', 'Cost Center Description', 'Status', 'Action']"
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
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Fund="data">
                {{ data.value.Fund }}
              </template>
              <template v-slot:FundDesc="data">
                {{ data.value['Fund Desc'] }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value.Activity }}
              </template>
              <template v-slot:ActivityDescription="data">
                {{ data.value['Activity Description'] }}
              </template>
              <template v-slot:PTJ="data">
                {{ data.value.PTJ }}
              </template>
              <template v-slot:PTJDescription="data">
                {{ data.value['PTJ Description'] }}
              </template>
              <template v-slot:CostCenter="data">
                {{ data.value['Cost Center'] }}
              </template>
              <template v-slot:CostCenterDescription="data">
                {{ data.value['Cost Center Description'] }}
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
                    @click="handleDuplicate(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Duplicate"
                  >
                    <Icon
                      name="material-symbols:content-copy"
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
            <!-- Fund -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Fund:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.fty_fund_type_sm"
                  type="select"
                  :options="smartFilterFundOptions"
                  placeholder="Select Fund"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.fty_fund_type_sm"
                  type="button"
                  @click="smartFilter.fty_fund_type_sm = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Activity (PTJ) -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Activity:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.activity_smptj"
                  type="select"
                  :options="smartFilterActivityOptions"
                  placeholder="Select Activity"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.activity_smptj"
                  type="button"
                  @click="smartFilter.activity_smptj = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- PTJ -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">PTJ:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.oun_codePTJ"
                  type="select"
                  :options="smartFilterPTJOptions"
                  placeholder="Select PTJ"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.oun_codePTJ"
                  type="button"
                  @click="smartFilter.oun_codePTJ = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-4 !h-4 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Cost Center -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Cost Center:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="smartFilter.costcenter_sm"
                  type="select"
                  :options="smartFilterCostCentreOptions"
                  placeholder="Select Cost Center"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.costcenter_sm"
                  type="button"
                  @click="smartFilter.costcenter_sm = ''"
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
                  v-model="smartFilter.ouc_status"
                  type="select"
                  :options="statusOptions"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.ouc_status"
                  type="button"
                  @click="smartFilter.ouc_status = ''"
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

    <!-- Add/Edit/Duplicate Cascade Structure Modal -->
    <rs-modal
      v-model="showCascadeModal"
      :title="isViewMode ? 'View Cascade Structure' : (isEditMode ? 'Edit Cascade Structure' : (isDuplicateMode ? 'Duplicate Cascade Structure' : 'Add Cascade Structure'))"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Cascade Structure' : (isEditMode ? 'Edit Cascade Structure' : (isDuplicateMode ? 'Duplicate Cascade Structure' : 'Add Cascade Structure')) }}
          </h4>
          <Icon
            @click="handleCancelCascadeStructure"
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
              <label class="w-40 text-xs font-medium">Fund Type<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.fty_fund_type"
                  type="select"
                  :options="fundOptions"
                  :disabled="isViewMode || isEditMode"
                  @input="handleFundSelection"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Fund Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.fty_fund_desc"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Activity Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.at_activity_code"
                  type="select"
                  :options="activityOptions"
                  :disabled="isViewMode"
                  @input="handleActivitySelection"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Activity Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.at_activity_description_bm"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">PTJ Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.oun_code"
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
              <label class="w-40 text-xs font-medium">PTJ Desc:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.oun_desc"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Cost Centre Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.ccr_costcentre"
                  type="select"
                  :options="costCentreOptions"
                  :disabled="isViewMode"
                  @input="handleCostCentreSelection"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Cost Centre Desc:</label>
              <div class="flex-1">
                <FormKit
                  v-model="cascadeForm.ccr_costcentre_desc"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="cascadeForm.ouc_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelCascadeStructure">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveCascadeStructure">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.cascade-structure-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.cascade-structure-table-wrapper :deep(th) {
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
