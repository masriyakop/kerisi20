<script setup>
definePageMeta({
  title: "PTJ Code",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "PTJ Code", path: "/setup/glstructure/ptj-code" },
  ],
});

const { $swal } = useNuxtApp();

// Data for 4 cascading datatables
const level1List = ref([]);
const level2List = ref([]);
const level3List = ref([]);
const level4List = ref([]);

// Loading states
const loading = ref({
  level1: false,
  level2: false,
  level3: false,
  level4: false,
});

// Search keywords for each datatable
const searchKeywords = ref({
  level1: "",
  level2: "",
  level3: "",
  level4: "",
});

// Page sizes
const pageSizes = ref({
  level1: 5,
  level2: 5,
  level3: 5,
  level4: 5,
});

// Selected items for cascade filtering
const selectedLevel1 = ref(null);
const selectedLevel2 = ref(null);
const selectedLevel3 = ref(null);

// Smart Filter modals
const showSmartFilter = ref({
  level1: false,
  level2: false,
  level3: false,
  level4: false,
});

// Smart Filter values
const smartFilters = ref({
  level1: { oun_status: "" },
  level2: { oun_status: "" },
  level3: { oun_status: "" },
  level4: { oun_status: "" },
});

// Store original filter values for reset
const originalFilters = ref({
  level1: { oun_status: "" },
  level2: { oun_status: "" },
  level3: { oun_status: "" },
  level4: { oun_status: "" },
});

// Add/Edit modals
const showModals = ref({
  level1: false,
  level2: false,
  level3: false,
  level4: false,
});

// Edit/View mode flags
const isEditMode = ref({
  level1: false,
  level2: false,
  level3: false,
  level4: false,
});

const isViewMode = ref({
  level1: false,
  level2: false,
  level3: false,
  level4: false,
});

// Form data
const ptjForm = ref({
  oun_id: null,
  oun_code: "",
  oun_desc: "",
  oun_desc_bi: "",
  org_code: "",
  org_desc: "",
  oun_address: "",
  oun_state: "",
  st_staff_id_head: "",
  oun_tel_no: "",
  oun_fax_no: "",
  oun_code_parent: "",
  oun_level: "",
  oun_status: "ACTIVE",
  st_staff_id_superior: "",
  tanggung_start_date: "",
  tanggung_end_date: "",
  oun_shortname: "",
  oun_region: "",
  cny_country_code: "",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Fetch PTJ Code Level 1
const fetchLevel1 = async () => {
  try {
    loading.value.level1 = true;
    const query = {
      level: 1,
    };
    if (searchKeywords.value.level1) {
      query.search = searchKeywords.value.level1;
    }
    if (smartFilters.value.level1.oun_status) {
      query.smartFilter_oun_status = smartFilters.value.level1.oun_status;
    }
    
    const { data } = await useFetch("/api/setup/ptj-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      level1List.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'PTJ Code': item['PTJ Code'] || '',
        'PTJ Desc (Malay)': item['PTJ Desc (Malay)'] || '',
        'Country': item.Country || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching level 1:", error);
  } finally {
    loading.value.level1 = false;
  }
};

// Fetch PTJ Code Level 2
const fetchLevel2 = async () => {
  if (!selectedLevel1.value) {
    level2List.value = [];
    return;
  }
  
  try {
    loading.value.level2 = true;
    const query = {
      level: 2,
      oun_code_parent: selectedLevel1.value.oun_code,
    };
    if (searchKeywords.value.level2) {
      query.search = searchKeywords.value.level2;
    }
    if (smartFilters.value.level2.oun_status) {
      query.smartFilter_oun_status = smartFilters.value.level2.oun_status;
    }
    
    const { data } = await useFetch("/api/setup/ptj-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      level2List.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'PTJ Code': item['PTJ Code'] || '',
        'PTJ Desc (Malay)': item['PTJ Desc (Malay)'] || '',
        'Code Parent': item['Code Parent'] || '',
        'Country': item.Country || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching level 2:", error);
  } finally {
    loading.value.level2 = false;
  }
};

// Fetch PTJ Code Level 3
const fetchLevel3 = async () => {
  if (!selectedLevel2.value) {
    level3List.value = [];
    return;
  }
  
  try {
    loading.value.level3 = true;
    const query = {
      level: 3,
      oun_code_parent: selectedLevel2.value.oun_code,
    };
    if (searchKeywords.value.level3) {
      query.search = searchKeywords.value.level3;
    }
    if (smartFilters.value.level3.oun_status) {
      query.smartFilter_oun_status = smartFilters.value.level3.oun_status;
    }
    
    const { data } = await useFetch("/api/setup/ptj-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      level3List.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'PTJ Code': item['PTJ Code'] || '',
        'PTJ Desc (Malay)': item['PTJ Desc (Malay)'] || '',
        'Code Parent': item['Code Parent'] || '',
        'Region': item.Region || '',
        'Country': item.Country || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching level 3:", error);
  } finally {
    loading.value.level3 = false;
  }
};

// Fetch PTJ Code Level 4
const fetchLevel4 = async () => {
  if (!selectedLevel3.value) {
    level4List.value = [];
    return;
  }
  
  try {
    loading.value.level4 = true;
    const query = {
      level: 4,
      oun_code_parent: selectedLevel3.value.oun_code,
    };
    if (searchKeywords.value.level4) {
      query.search = searchKeywords.value.level4;
    }
    if (smartFilters.value.level4.oun_status) {
      query.smartFilter_oun_status = smartFilters.value.level4.oun_status;
    }
    
    const { data } = await useFetch("/api/setup/ptj-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      level4List.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'PTJ Code': item['PTJ Code'] || '',
        'PTJ Desc (Malay)': item['PTJ Desc (Malay)'] || '',
        'Code Parent': item['Code Parent'] || '',
        'Region': item.Region || '',
        'Country': item.Country || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching level 4:", error);
  } finally {
    loading.value.level4 = false;
  }
};

// Watch for cascade selections
watch(selectedLevel1, () => {
  selectedLevel2.value = null;
  selectedLevel3.value = null;
  level2List.value = [];
  level3List.value = [];
  level4List.value = [];
  fetchLevel2();
});

watch(selectedLevel2, () => {
  selectedLevel3.value = null;
  level3List.value = [];
  level4List.value = [];
  fetchLevel3();
});

watch(selectedLevel3, () => {
  level4List.value = [];
  fetchLevel4();
});

// Watch modals to handle close
watch(() => showModals.value.level1, (newVal) => {
  if (!newVal) handleCancel('level1');
});
watch(() => showModals.value.level2, (newVal) => {
  if (!newVal) handleCancel('level2');
});
watch(() => showModals.value.level3, (newVal) => {
  if (!newVal) handleCancel('level3');
});
watch(() => showModals.value.level4, (newVal) => {
  if (!newVal) handleCancel('level4');
});

// Watch smart filter modals
watch(() => showSmartFilter.value.level1, (newVal) => {
  if (!newVal) handleFilterClose('level1');
});
watch(() => showSmartFilter.value.level2, (newVal) => {
  if (!newVal) handleFilterClose('level2');
});
watch(() => showSmartFilter.value.level3, (newVal) => {
  if (!newVal) handleFilterClose('level3');
});
watch(() => showSmartFilter.value.level4, (newVal) => {
  if (!newVal) handleFilterClose('level4');
});

// Watch search keywords
watch(() => searchKeywords.value.level1, () => {
  fetchLevel1();
});

watch(() => searchKeywords.value.level2, () => {
  if (selectedLevel1.value) fetchLevel2();
});

watch(() => searchKeywords.value.level3, () => {
  if (selectedLevel2.value) fetchLevel3();
});

watch(() => searchKeywords.value.level4, () => {
  if (selectedLevel3.value) fetchLevel4();
});

// Initialize
onMounted(() => {
  fetchLevel1();
});

// Handle row click for cascade
const handleLevel1Click = (item) => {
  selectedLevel1.value = item;
};

const handleLevel2Click = (item) => {
  selectedLevel2.value = item;
};

const handleLevel3Click = (item) => {
  selectedLevel3.value = item;
};

// Smart Filter handlers
const handleFilter = (level) => {
  originalFilters.value[level] = { ...smartFilters.value[level] };
  showSmartFilter.value[level] = true;
};

const handleFilterReset = (level) => {
  smartFilters.value[level] = { ...originalFilters.value[level] };
  smartFilters.value[level].oun_status = "";
};

const handleFilterOk = (level) => {
  showSmartFilter.value[level] = false;
  if (level === 'level1') {
    fetchLevel1();
  } else if (level === 'level2') {
    fetchLevel2();
  } else if (level === 'level3') {
    fetchLevel3();
  } else if (level === 'level4') {
    fetchLevel4();
  }
};

const handleFilterClose = (level) => {
  smartFilters.value[level] = { ...originalFilters.value[level] };
  showSmartFilter.value[level] = false;
};

// Add/Edit handlers
const handleAdd = (level) => {
  isEditMode.value[level] = false;
  isViewMode.value[level] = false;
  
  ptjForm.value = {
    oun_id: null,
    oun_code: "",
    oun_desc: "",
    oun_desc_bi: "",
    org_code: "",
    org_desc: "",
    oun_address: "",
    oun_state: "",
    st_staff_id_head: "",
    oun_tel_no: "",
    oun_fax_no: "",
    oun_code_parent: level === 'level1' ? "" : 
                    level === 'level2' ? (selectedLevel1.value?.oun_code || "") :
                    level === 'level3' ? (selectedLevel2.value?.oun_code || "") :
                    (selectedLevel3.value?.oun_code || ""),
    oun_level: level === 'level1' ? "1" : level === 'level2' ? "2" : level === 'level3' ? "3" : "4",
    oun_status: "ACTIVE",
    st_staff_id_superior: "",
    tanggung_start_date: "",
    tanggung_end_date: "",
    oun_shortname: "",
    oun_region: "",
    cny_country_code: "",
  };
  showModals.value[level] = true;
};

const handleEdit = (level, item) => {
  isEditMode.value[level] = true;
  isViewMode.value[level] = false;
  
  ptjForm.value = {
    oun_id: item.oun_id,
    oun_code: item.oun_code,
    oun_desc: item.oun_desc,
    oun_desc_bi: item.oun_desc_bi || "",
    org_code: item.org_code || "",
    org_desc: item.org_desc || "",
    oun_address: item.oun_address || "",
    oun_state: item.oun_state || "",
    st_staff_id_head: item.st_staff_id_head || "",
    oun_tel_no: item.oun_tel_no || "",
    oun_fax_no: item.oun_fax_no || "",
    oun_code_parent: item.oun_code_parent || "",
    oun_level: item.oun_level?.toString() || "",
    oun_status: item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
    st_staff_id_superior: item.st_staff_id_superior || "",
    tanggung_start_date: item.tanggung_start_date ? new Date(item.tanggung_start_date).toISOString().split('T')[0] : "",
    tanggung_end_date: item.tanggung_end_date ? new Date(item.tanggung_end_date).toISOString().split('T')[0] : "",
    oun_shortname: item.oun_shortname || "",
    oun_region: item.oun_region || "",
    cny_country_code: item.cny_country_code || "",
  };
  showModals.value[level] = true;
};

const handleView = (level, item) => {
  isViewMode.value[level] = true;
  isEditMode.value[level] = false;
  
  // Set selected item to trigger cascade for child datatables
  if (level === 'level1') {
    selectedLevel1.value = item;
  } else if (level === 'level2') {
    selectedLevel2.value = item;
  } else if (level === 'level3') {
    selectedLevel3.value = item;
  }
  
  ptjForm.value = {
    oun_id: item.oun_id,
    oun_code: item.oun_code,
    oun_desc: item.oun_desc,
    oun_desc_bi: item.oun_desc_bi || "",
    org_code: item.org_code || "",
    org_desc: item.org_desc || "",
    oun_address: item.oun_address || "",
    oun_state: item.oun_state || "",
    st_staff_id_head: item.st_staff_id_head || "",
    oun_tel_no: item.oun_tel_no || "",
    oun_fax_no: item.oun_fax_no || "",
    oun_code_parent: item.oun_code_parent || "",
    oun_level: item.oun_level?.toString() || "",
    oun_status: item.oun_status === '1' ? 'ACTIVE' : 'INACTIVE',
    st_staff_id_superior: item.st_staff_id_superior || "",
    tanggung_start_date: item.tanggung_start_date ? new Date(item.tanggung_start_date).toISOString().split('T')[0] : "",
    tanggung_end_date: item.tanggung_end_date ? new Date(item.tanggung_end_date).toISOString().split('T')[0] : "",
    oun_shortname: item.oun_shortname || "",
    oun_region: item.oun_region || "",
    cny_country_code: item.cny_country_code || "",
  };
  showModals.value[level] = true;
};

const handleSave = async (level) => {
  // Validation
  if (!ptjForm.value.oun_code || !ptjForm.value.oun_desc || !ptjForm.value.oun_status) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value[level] = true;
    
    // TODO: Implement save logic
    $swal.fire({
      title: "Info",
      text: `Save functionality for ${level} will be implemented`,
      icon: "info",
    });
    
    showModals.value[level] = false;
    isEditMode.value[level] = false;
  } catch (error) {
    console.error("Error saving:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving",
      icon: "error",
    });
  } finally {
    loading.value[level] = false;
  }
};

const handleCancel = (level) => {
  showModals.value[level] = false;
  isEditMode.value[level] = false;
  isViewMode.value[level] = false;
  
  // Reset form
  ptjForm.value = {
    oun_id: null,
    oun_code: "",
    oun_desc: "",
    oun_desc_bi: "",
    org_code: "",
    org_desc: "",
    oun_address: "",
    oun_state: "",
    st_staff_id_head: "",
    oun_tel_no: "",
    oun_fax_no: "",
    oun_code_parent: "",
    oun_level: "",
    oun_status: "ACTIVE",
    st_staff_id_superior: "",
    tanggung_start_date: "",
    tanggung_end_date: "",
    oun_shortname: "",
    oun_region: "",
    cny_country_code: "",
  };
};

const handleDelete = async (level, item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      loading.value[level] = true;
      const url = `/api/setup/ptj-code/${item.oun_code}`;

      const { data } = await useFetch(url, {
        method: "DELETE",
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Record has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refetch the appropriate level
        if (level === 'level1') {
          await fetchLevel1();
        } else if (level === 'level2') {
          await fetchLevel2();
        } else if (level === 'level3') {
          await fetchLevel3();
        } else if (level === 'level4') {
          await fetchLevel4();
        }
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to delete record",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting",
        icon: "error",
      });
    } finally {
      loading.value[level] = false;
    }
  }
};

// Download functions
const handleDownloadPDF = (level) => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
};

const handleDownloadCSV = (level) => {
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

    <!-- List of PTJ Code - Level 1 Datatable -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">List of PTJ Code - Level 1</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.level1"
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
                  v-model="searchKeywords.level1"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.level1"
                      type="button"
                      @click="searchKeywords.level1 = ''"
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
                  @click="handleFilter('level1')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="level1-table-wrapper" :style="{ maxHeight: level1List.length > 10 ? '600px' : 'auto', overflowY: level1List.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.level1" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="level1List"
              :field="['No', 'PTJ Code', 'PTJ Desc (Malay)', 'Country', 'Status', 'Action']"
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
              :pageSize="pageSizes.level1"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PTJCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedLevel1?.oun_code === data.value.oun_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleLevel1Click(data.value)"
                >
                  {{ data.value['PTJ Code'] }}
                </span>
              </template>
              <template v-slot:PTJDescMalay="data">
                {{ data.value['PTJ Desc (Malay)'] }}
              </template>
              <template v-slot:Country="data">
                {{ data.value.Country }}
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
                    @click="handleLevel1Click(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('level1', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('level1', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('level1', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ level1List.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('level1')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('level1')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('level1')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- List of PTJ Code - Level 2 Datatable -->
    <rs-card v-if="selectedLevel1">
      <template #header>
        <div class="text-lg font-semibold">List of PTJ Code - Level 2</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.level2"
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
                  v-model="searchKeywords.level2"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.level2"
                      type="button"
                      @click="searchKeywords.level2 = ''"
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
                  @click="handleFilter('level2')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="level2-table-wrapper" :style="{ maxHeight: level2List.length > 10 ? '600px' : 'auto', overflowY: level2List.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.level2" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="level2List"
              :field="['No', 'PTJ Code', 'PTJ Desc (Malay)', 'Code Parent', 'Country', 'Status', 'Action']"
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
              :pageSize="pageSizes.level2"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PTJCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedLevel2?.oun_code === data.value.oun_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleLevel2Click(data.value)"
                >
                  {{ data.value['PTJ Code'] }}
                </span>
              </template>
              <template v-slot:PTJDescMalay="data">
                {{ data.value['PTJ Desc (Malay)'] }}
              </template>
              <template v-slot:CodeParent="data">
                {{ data.value['Code Parent'] }}
              </template>
              <template v-slot:Country="data">
                {{ data.value.Country }}
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
                    @click="handleLevel2Click(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('level2', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('level2', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('level2', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ level2List.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('level2')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('level2')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('level2')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- List of PTJ Code - Level 3 Datatable -->
    <rs-card v-if="selectedLevel2">
      <template #header>
        <div class="text-lg font-semibold">List of PTJ Code - Level 3</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.level3"
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
                  v-model="searchKeywords.level3"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.level3"
                      type="button"
                      @click="searchKeywords.level3 = ''"
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
                  @click="handleFilter('level3')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="level3-table-wrapper" :style="{ maxHeight: level3List.length > 10 ? '600px' : 'auto', overflowY: level3List.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.level3" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="level3List"
              :field="['No', 'PTJ Code', 'PTJ Desc (Malay)', 'Code Parent', 'Region', 'Country', 'Status', 'Action']"
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
              :pageSize="pageSizes.level3"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PTJCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedLevel3?.oun_code === data.value.oun_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleLevel3Click(data.value)"
                >
                  {{ data.value['PTJ Code'] }}
                </span>
              </template>
              <template v-slot:PTJDescMalay="data">
                {{ data.value['PTJ Desc (Malay)'] }}
              </template>
              <template v-slot:CodeParent="data">
                {{ data.value['Code Parent'] }}
              </template>
              <template v-slot:Region="data">
                {{ data.value.Region }}
              </template>
              <template v-slot:Country="data">
                {{ data.value.Country }}
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
                    @click="handleLevel3Click(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('level3', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('level3', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('level3', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ level3List.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('level3')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('level3')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('level3')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- List of PTJ Code - Level 4 Datatable -->
    <rs-card v-if="selectedLevel3">
      <template #header>
        <div class="text-lg font-semibold">List of PTJ Code - Level 4</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.level4"
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
                  v-model="searchKeywords.level4"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.level4"
                      type="button"
                      @click="searchKeywords.level4 = ''"
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
                  @click="handleFilter('level4')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="level4-table-wrapper" :style="{ maxHeight: level4List.length > 10 ? '600px' : 'auto', overflowY: level4List.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.level4" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="level4List"
              :field="['No', 'PTJ Code', 'PTJ Desc (Malay)', 'Code Parent', 'Region', 'Country', 'Status', 'Action']"
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
              :pageSize="pageSizes.level4"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PTJCode="data">
                {{ data.value['PTJ Code'] }}
              </template>
              <template v-slot:PTJDescMalay="data">
                {{ data.value['PTJ Desc (Malay)'] }}
              </template>
              <template v-slot:CodeParent="data">
                {{ data.value['Code Parent'] }}
              </template>
              <template v-slot:Region="data">
                {{ data.value.Region }}
              </template>
              <template v-slot:Country="data">
                {{ data.value.Country }}
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
                    @click="handleView('level4', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('level4', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('level4', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ level4List.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('level4')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('level4')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('level4')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Smart Filter Modals -->
    <template v-for="level in ['level1', 'level2', 'level3', 'level4']" :key="level">
      <rs-modal
        v-model="showSmartFilter[level]"
        :title="`Smart Filter - ${level.toUpperCase()}`"
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
              @click="handleFilterClose(level)"
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
                    v-model="smartFilters[level].oun_status"
                    type="select"
                    :options="statusOptions"
                    placeholder="Select Status"
                    outer-class="mb-0"
                  />
                  <button
                    v-if="smartFilters[level].oun_status"
                    type="button"
                    @click="smartFilters[level].oun_status = ''"
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
            <rs-button variant="danger" @click="handleFilterReset(level)">
              Reset
            </rs-button>
            <rs-button variant="primary" @click="handleFilterOk(level)">
              Ok
            </rs-button>
          </div>
        </template>
      </rs-modal>
    </template>

    <!-- Add/Edit Modals for all levels -->
    <template v-for="level in ['level1', 'level2', 'level3', 'level4']" :key="level">
      <rs-modal
        v-model="showModals[level]"
        :title="`PTJ Code ${level.replace('level', 'Level ')}`"
        size="lg"
        dialog-class="account-modal-custom"
        :overlay-close="true"
        :hide-footer="false"
        position="center"
      >
        <template #header>
          <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
            <h4 class="text-base font-semibold text-white">
              {{ isViewMode[level] ? `View PTJ Code ${level.replace('level', 'Level ')}` : (isEditMode[level] ? `Edit PTJ Code ${level.replace('level', 'Level ')}` : `Add PTJ Code ${level.replace('level', 'Level ')}`) }}
            </h4>
            <Icon
              @click="handleCancel(level)"
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
                <label class="w-40 text-xs font-medium">PTJ Code<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_code"
                    type="text"
                    :disabled="isViewMode[level] || isEditMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">PTJ Desc (Malay)<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_desc"
                    type="text"
                    :disabled="isViewMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">PTJ Desc (English):</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_desc_bi"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Organization Code<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.org_code"
                    type="text"
                    :disabled="isViewMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Organization Desc:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.org_desc"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div v-if="level !== 'level1'" class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Code Parent:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_code_parent"
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
                    v-model="ptjForm.oun_status"
                    type="select"
                    :options="statusOptions"
                    :disabled="isViewMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">PTJ Short Name:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_shortname"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div v-if="level === 'level3' || level === 'level4'" class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Region:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.oun_region"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Country:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="ptjForm.cny_country_code"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
            </div>
          </FormKit>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2 py-2">
            <rs-button variant="danger" size="sm" @click="handleCancel(level)">
              {{ isViewMode[level] ? 'Close' : 'Cancel' }}
            </rs-button>
            <rs-button v-if="!isViewMode[level]" variant="primary" size="sm" @click="handleSave(level)">
              Save
            </rs-button>
          </div>
        </template>
      </rs-modal>
    </template>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.level1-table-wrapper :deep(.table-header),
.level2-table-wrapper :deep(.table-header),
.level3-table-wrapper :deep(.table-header),
.level4-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.level1-table-wrapper :deep(th),
.level2-table-wrapper :deep(th),
.level3-table-wrapper :deep(th),
.level4-table-wrapper :deep(th) {
  background-color: #3b82f6 !important;
  color: white !important;
}

/* Modal custom styles */
.account-modal-custom {
  width: 600px !important;
}

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

/* Ensure Smart Filter modal header matches Account modal styling */
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

<style>
/* Modal styles must be non-scoped because modal is teleported to body */
/* Hide all direct children of modal-header except the custom header */
.account-modal-custom .modal-header > *:not(.account-modal-header) {
  display: none !important;
}

/* Ensure custom header is visible */
.account-modal-custom .modal-header > .account-modal-header {
  display: flex !important;
}

/* Hide all direct children of modal-header except the custom header for Smart Filter */
.smart-filter-modal-custom .modal-header > *:not(.smart-filter-modal-header) {
  display: none !important;
}

/* Ensure custom header is visible for Smart Filter */
.smart-filter-modal-custom .modal-header > .smart-filter-modal-header {
  display: flex !important;
}
</style>
