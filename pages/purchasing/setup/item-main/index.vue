<script setup>
definePageMeta({
  title: "Item Main",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Setup", path: "/purchasing/setup" },
    { name: "Item Main", path: "/purchasing/setup/item-main" },
  ],
});

const { $swal } = useNuxtApp();

// Top filter: Search Group
const groupLookup = ref("PO");

// Data for 4 cascading datatables
const mainCategoryList = ref([]);
const subcategoryList = ref([]);
const subsiriList = ref([]);
const itemMainList = ref([]);

// Loading states
const loading = ref({
  mainCategory: false,
  subcategory: false,
  subsiri: false,
  itemMain: false,
});

// Search keywords for each datatable
const searchKeywords = ref({
  mainCategory: "",
  subcategory: "",
  subsiri: "",
  itemMain: "",
});

// Page sizes
const pageSizes = ref({
  mainCategory: 5,
  subcategory: 5,
  subsiri: 5,
  itemMain: 5,
});

// Selected items for cascade filtering
const selectedMainCategory = ref(null);
const selectedSubcategory = ref(null);
const selectedSubsiri = ref(null);

// Smart Filter modals
const showSmartFilter = ref({
  mainCategory: false,
  subcategory: false,
  subsiri: false,
  itemMain: false,
});

// Smart Filter values
const smartFilters = ref({
  mainCategory: {},
  subcategory: {},
  subsiri: {},
  itemMain: {},
});

// Store original filter values for reset
const originalFilters = ref({
  mainCategory: {},
  subcategory: {},
  subsiri: {},
  itemMain: {},
});

// Add/Edit modals
const showModals = ref({
  mainCategory: false,
  subcategory: false,
  subsiri: false,
  itemMain: false,
});

// Edit/View mode flags
const isEditMode = ref({
  mainCategory: false,
  subcategory: false,
  subsiri: false,
  itemMain: false,
});

const isViewMode = ref({
  mainCategory: false,
  subcategory: false,
  subsiri: false,
  itemMain: false,
});

// Form data
const mainCategoryForm = ref({
  lde_id: null,
  lde_value: "",
  lde_description: "",
  lde_description2: "",
  lde_status: "ACTIVE",
});

const subcategoryForm = ref({
  isc_subcategory_id: null,
  isc_subcategory_code: "",
  isc_subcategory_desc: "",
  isc_subcategory_desceng: "",
  isc_category_code: "",
  isc_status: "ACTIVE",
});

const subsiriForm = ref({
  iss_subsiri_id: null,
  iss_subsiri_code: "",
  iss_subsiri_desc: "",
  iss_subsiri_desceng: "",
  isc_subcategory_code: "",
  iss_category_code: "",
  iss_status: "ACTIVE",
});

const itemMainForm = ref({
  itm_item_id: null,
  itm_item_code: "",
  itm_item_desc: "",
  itm_item_desceng: "",
  acm_acct_code: "",
  itm_category_code: "",
  isc_subcategory_code: "",
  iss_subsiri_code: "",
  itm_myfislite_flag: "NO",
  itm_status: "ACTIVE",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// MyFisLite options
const myfisliteOptions = ref([
  { label: "YES", value: "Y" },
  { label: "NO", value: "N" },
]);

// Group lookup options
const groupLookupOptions = ref([]);

// Account code options
const accountCodeOptions = ref([]);

// Fetch Group Lookup options
const fetchGroupLookupOptions = async () => {
  try {
    const { data } = await useFetch("/api/purchasing/setup/item-main/group-lookup", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      groupLookupOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching group lookup options:", error);
  }
};

// Fetch Account Code options
const fetchAccountCodeOptions = async (search = "") => {
  try {
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query: { search },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      accountCodeOptions.value = (data.value.data || []).map((item) => ({
        label: `${item.acm_acct_code} - ${item.acm_acct_desc || ""}`,
        value: item.acm_acct_code,
      }));
    }
  } catch (error) {
    console.error("Error fetching account code options:", error);
  }
};

// Fetch Main Category Level 1
const fetchMainCategory = async () => {
  try {
    loading.value.mainCategory = true;
    const query = {
      grouplookup: groupLookup.value,
    };
    if (searchKeywords.value.mainCategory) {
      query.search = searchKeywords.value.mainCategory;
    }
    
    const { data } = await useFetch("/api/purchasing/setup/item-main/main-category", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      mainCategoryList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        Code: item.lde_value || '',
        Description: item.lde_description || '',
        Status: item.lde_status || '',
        Action: '',
        // Keep original data
        lde_id: item.lde_id,
        lde_value: item.lde_value,
        lde_description: item.lde_description,
        lde_status: item.lde_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching main categories:", error);
  } finally {
    loading.value.mainCategory = false;
  }
};

// Fetch Item Subcategory Level 2
const fetchSubcategory = async () => {
  if (!selectedMainCategory.value) {
    subcategoryList.value = [];
    return;
  }
  
  try {
    loading.value.subcategory = true;
    const query = {
      isc_category_code: selectedMainCategory.value.lde_value,
    };
    if (searchKeywords.value.subcategory) {
      query.search = searchKeywords.value.subcategory;
    }
    
    const { data } = await useFetch("/api/purchasing/setup/item-main/subcategory", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      subcategoryList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        Code: item.isc_subcategory_code || '',
        Description: item.isc_subcategory_desc || '',
        Status: item.isc_status || '',
        Action: '',
        // Keep original data
        isc_subcategory_id: item.isc_subcategory_id,
        isc_subcategory_code: item.isc_subcategory_code,
        isc_subcategory_desc: item.isc_subcategory_desc,
        isc_category_code: item.isc_category_code,
        isc_status: item.isc_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  } finally {
    loading.value.subcategory = false;
  }
};

// Fetch Item Subsiri Level 3
const fetchSubsiri = async () => {
  if (!selectedSubcategory.value) {
    subsiriList.value = [];
    return;
  }
  
  try {
    loading.value.subsiri = true;
    const query = {
      iss_category_code: selectedMainCategory.value.lde_value,
      isc_subcategory_code: selectedSubcategory.value.isc_subcategory_code,
    };
    if (searchKeywords.value.subsiri) {
      query.search = searchKeywords.value.subsiri;
    }
    
    const { data } = await useFetch("/api/purchasing/setup/item-main/subsiri", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      subsiriList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        Code: item.iss_subsiri_code || '',
        Description: item.iss_subsiri_desc || '',
        Status: item.iss_status || '',
        Action: '',
        // Keep original data
        iss_subsiri_id: item.iss_subsiri_id,
        iss_subsiri_code: item.iss_subsiri_code,
        iss_subsiri_desc: item.iss_subsiri_desc,
        isc_subcategory_code: item.isc_subcategory_code,
        iss_category_code: item.iss_category_code,
        iss_status: item.iss_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching subsiris:", error);
  } finally {
    loading.value.subsiri = false;
  }
};

// Fetch Item Main Level 4
const fetchItemMain = async () => {
  if (!selectedSubsiri.value) {
    itemMainList.value = [];
    return;
  }
  
  try {
    loading.value.itemMain = true;
    const query = {
      itm_category_code: selectedMainCategory.value.lde_value,
      isc_subcategory_code: selectedSubcategory.value.isc_subcategory_code,
      iss_subsiri_code: selectedSubsiri.value.iss_subsiri_code,
    };
    if (searchKeywords.value.itemMain) {
      query.search = searchKeywords.value.itemMain;
    }
    
    const { data } = await useFetch("/api/purchasing/setup/item-main/item-main-list", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      itemMainList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        Code: item.itm_item_code || '',
        Description: item.itm_item_desc || '',
        "Account Code": item.acm_acct_code || '',
        MyFisLite: item.itm_myfislite_flag,
        Status: item.itm_status || '',
        Action: '',
        // Keep original data
        itm_item_id: item.itm_item_id,
        itm_item_code: item.itm_item_code,
        itm_item_desc: item.itm_item_desc,
        itm_category_code: item.itm_category_code,
        isc_subcategory_code: item.isc_subcategory_code,
        iss_subsiri_code: item.iss_subsiri_code,
        acm_acct_code: item.acm_acct_code,
        itm_myfislite_flag: item.itm_myfislite_flag,
        itm_status: item.itm_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching item mains:", error);
  } finally {
    loading.value.itemMain = false;
  }
};

// Watch for cascade selections
watch(selectedMainCategory, () => {
  selectedSubcategory.value = null;
  selectedSubsiri.value = null;
  fetchSubcategory();
});

watch(selectedSubcategory, () => {
  selectedSubsiri.value = null;
  fetchSubsiri();
});

watch(selectedSubsiri, () => {
  fetchItemMain();
});

// Watch group lookup change
watch(groupLookup, () => {
  selectedMainCategory.value = null;
  selectedSubcategory.value = null;
  selectedSubsiri.value = null;
  fetchMainCategory();
});

// Watch search keywords
watch(() => searchKeywords.value.mainCategory, () => {
  fetchMainCategory();
});

watch(() => searchKeywords.value.subcategory, () => {
  if (selectedMainCategory.value) fetchSubcategory();
});

watch(() => searchKeywords.value.subsiri, () => {
  if (selectedSubcategory.value) fetchSubsiri();
});

watch(() => searchKeywords.value.itemMain, () => {
  if (selectedSubsiri.value) fetchItemMain();
});

// Initialize
onMounted(async () => {
  await fetchGroupLookupOptions();
  await fetchAccountCodeOptions();
  await fetchMainCategory();
});

// Handle row click for cascade
const handleMainCategoryClick = (item) => {
  selectedMainCategory.value = item;
};

const handleSubcategoryClick = (item) => {
  selectedSubcategory.value = item;
};

const handleSubsiriClick = (item) => {
  selectedSubsiri.value = item;
};

// Smart Filter handlers
const handleFilter = (level) => {
  originalFilters.value[level] = { ...smartFilters.value[level] };
  showSmartFilter.value[level] = true;
};

const handleFilterReset = (level) => {
  smartFilters.value[level] = { ...originalFilters.value[level] };
};

const handleFilterOk = (level) => {
  showSmartFilter.value[level] = false;
  if (level === 'mainCategory') {
    fetchMainCategory();
  } else if (level === 'subcategory') {
    fetchSubcategory();
  } else if (level === 'subsiri') {
    fetchSubsiri();
  } else if (level === 'itemMain') {
    fetchItemMain();
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
  
  if (level === 'mainCategory') {
    mainCategoryForm.value = {
      lde_id: null,
      lde_value: "",
      lde_description: "",
      lde_description2: "",
      lde_status: "ACTIVE",
    };
  } else if (level === 'subcategory') {
    subcategoryForm.value = {
      isc_subcategory_id: null,
      isc_subcategory_code: "",
      isc_subcategory_desc: "",
      isc_subcategory_desceng: "",
      isc_category_code: selectedMainCategory.value?.lde_value || "",
      isc_status: "ACTIVE",
    };
  } else if (level === 'subsiri') {
    subsiriForm.value = {
      iss_subsiri_id: null,
      iss_subsiri_code: "",
      iss_subsiri_desc: "",
      iss_subsiri_desceng: "",
      isc_subcategory_code: selectedSubcategory.value?.isc_subcategory_code || "",
      iss_category_code: selectedMainCategory.value?.lde_value || "",
      iss_status: "ACTIVE",
    };
  } else if (level === 'itemMain') {
    itemMainForm.value = {
      itm_item_id: null,
      itm_item_code: "",
      itm_item_desc: "",
      itm_item_desceng: "",
      acm_acct_code: "",
      itm_category_code: selectedMainCategory.value?.lde_value || "",
      isc_subcategory_code: selectedSubcategory.value?.isc_subcategory_code || "",
      iss_subsiri_code: selectedSubsiri.value?.iss_subsiri_code || "",
      itm_myfislite_flag: "N",
      itm_status: "ACTIVE",
    };
  }
  showModals.value[level] = true;
};

const handleEdit = (level, item) => {
  isEditMode.value[level] = true;
  isViewMode.value[level] = false;
  
  if (level === 'mainCategory') {
    mainCategoryForm.value = {
      lde_id: item.lde_id,
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: "",
      lde_status: item.lde_status,
    };
  } else if (level === 'subcategory') {
    subcategoryForm.value = {
      isc_subcategory_id: item.isc_subcategory_id,
      isc_subcategory_code: item.isc_subcategory_code,
      isc_subcategory_desc: item.isc_subcategory_desc,
      isc_subcategory_desceng: "",
      isc_category_code: item.isc_category_code,
      isc_status: item.isc_status,
    };
  } else if (level === 'subsiri') {
    subsiriForm.value = {
      iss_subsiri_id: item.iss_subsiri_id,
      iss_subsiri_code: item.iss_subsiri_code,
      iss_subsiri_desc: item.iss_subsiri_desc,
      iss_subsiri_desceng: "",
      isc_subcategory_code: item.isc_subcategory_code,
      iss_category_code: item.iss_category_code,
      iss_status: item.iss_status,
    };
  } else if (level === 'itemMain') {
    itemMainForm.value = {
      itm_item_id: item.itm_item_id,
      itm_item_code: item.itm_item_code,
      itm_item_desc: item.itm_item_desc,
      itm_item_desceng: "",
      acm_acct_code: item.acm_acct_code?.split(' - ')[0] || "",
      itm_category_code: item.itm_category_code,
      isc_subcategory_code: item.isc_subcategory_code,
      iss_subsiri_code: item.iss_subsiri_code,
      itm_myfislite_flag: (item.itm_myfislite_flag === 'YES' || item.itm_myfislite_flag === 'Y') ? 'Y' : 'N',
      itm_status: item.itm_status,
    };
  }
  showModals.value[level] = true;
};

const handleView = (level, item) => {
  isViewMode.value[level] = true;
  isEditMode.value[level] = false;
  
  // Set selected item to trigger cascade for child datatables
  if (level === 'mainCategory') {
    selectedMainCategory.value = item;
    mainCategoryForm.value = {
      lde_id: item.lde_id,
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: "",
      lde_status: item.lde_status,
    };
  } else if (level === 'subcategory') {
    selectedSubcategory.value = item;
    subcategoryForm.value = {
      isc_subcategory_id: item.isc_subcategory_id,
      isc_subcategory_code: item.isc_subcategory_code,
      isc_subcategory_desc: item.isc_subcategory_desc,
      isc_subcategory_desceng: "",
      isc_category_code: item.isc_category_code,
      isc_status: item.isc_status,
    };
  } else if (level === 'subsiri') {
    selectedSubsiri.value = item;
    subsiriForm.value = {
      iss_subsiri_id: item.iss_subsiri_id,
      iss_subsiri_code: item.iss_subsiri_code,
      iss_subsiri_desc: item.iss_subsiri_desc,
      iss_subsiri_desceng: "",
      isc_subcategory_code: item.isc_subcategory_code,
      iss_category_code: item.iss_category_code,
      iss_status: item.iss_status,
    };
  } else {
    itemMainForm.value = {
      itm_item_id: item.itm_item_id,
      itm_item_code: item.itm_item_code,
      itm_item_desc: item.itm_item_desc,
      itm_item_desceng: "",
      acm_acct_code: item.acm_acct_code?.split(' - ')[0] || "",
      itm_category_code: item.itm_category_code,
      isc_subcategory_code: item.isc_subcategory_code,
      iss_subsiri_code: item.iss_subsiri_code,
      itm_myfislite_flag: (item.itm_myfislite_flag === 'YES' || item.itm_myfislite_flag === 'Y') ? 'Y' : 'N',
      itm_status: item.itm_status,
    };
  }
  showModals.value[level] = true;
};

const handleSave = async (level) => {
  // Validation will be handled by FormKit
  try {
    loading.value[level] = true;
    
    // TODO: Implement save API endpoints for each level
    $swal.fire({
      title: "Info",
      text: "Save functionality will be implemented",
      icon: "info",
    });
    
    showModals.value[level] = false;
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
      // TODO: Implement delete API endpoints
      $swal.fire({
        title: "Deleted!",
        text: "Record has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refetch the appropriate level
      if (level === 'mainCategory') {
        await fetchMainCategory();
      } else if (level === 'subcategory') {
        await fetchSubcategory();
      } else if (level === 'subsiri') {
        await fetchSubsiri();
      } else if (level === 'itemMain') {
        await fetchItemMain();
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

    <!-- Top Filter: Search Group -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Search Group</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="groupLookup"
              type="select"
              :options="groupLookupOptions"
              placeholder="Select Group"
              outer-class="mb-0"
              validation="required"
            />
          </div>
          <div class="md:col-span-2 flex justify-end items-end">
            <rs-button variant="primary" @click="fetchMainCategory">
              <Icon name="material-symbols:search" class="mr-2" size="1rem" />
              Search
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Main Category Level 1 Datatable -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Main Category</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.mainCategory"
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
                  v-model="searchKeywords.mainCategory"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.mainCategory"
                      type="button"
                      @click="searchKeywords.mainCategory = ''"
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
                  @click="handleFilter('mainCategory')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="main-category-table-wrapper" :style="{ maxHeight: mainCategoryList.length > 10 ? '600px' : 'auto', overflowY: mainCategoryList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.mainCategory" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="mainCategoryList"
              :field="['No', 'Code', 'Description', 'Status', 'Action']"
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
              :pageSize="pageSizes.mainCategory"
              hideTableSearch
              hideTablePageSize
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedMainCategory?.lde_id === data.value.lde_id }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleMainCategoryClick(data.value)"
                >
                  {{ data.value.Code }}
                </span>
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleMainCategoryClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('mainCategory', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('mainCategory', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ mainCategoryList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('mainCategory')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('mainCategory')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('mainCategory')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Item Subcategory Level 2 Datatable -->
    <rs-card v-if="selectedMainCategory">
      <template #header>
        <div class="text-lg font-semibold">Item Subcategory</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.subcategory"
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
                  v-model="searchKeywords.subcategory"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.subcategory"
                      type="button"
                      @click="searchKeywords.subcategory = ''"
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
                  @click="handleFilter('subcategory')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="subcategory-table-wrapper" :style="{ maxHeight: subcategoryList.length > 10 ? '600px' : 'auto', overflowY: subcategoryList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.subcategory" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="subcategoryList"
              :field="['No', 'Code', 'Description', 'Status', 'Action']"
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
              :pageSize="pageSizes.subcategory"
              hideTableSearch
              hideTablePageSize
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubcategory?.isc_subcategory_id === data.value.isc_subcategory_id }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubcategoryClick(data.value)"
                >
                  {{ data.value.Code }}
                </span>
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleSubcategoryClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('subcategory', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('subcategory', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('subcategory', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
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
              {{ subcategoryList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('subcategory')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('subcategory')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('subcategory')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Item Subsiri Level 3 Datatable -->
    <rs-card v-if="selectedSubcategory">
      <template #header>
        <div class="text-lg font-semibold">Item Subsiri</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.subsiri"
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
                  v-model="searchKeywords.subsiri"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.subsiri"
                      type="button"
                      @click="searchKeywords.subsiri = ''"
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
                  @click="handleFilter('subsiri')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="subsiri-table-wrapper" :style="{ maxHeight: subsiriList.length > 10 ? '600px' : 'auto', overflowY: subsiriList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.subsiri" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="subsiriList"
              :field="['No', 'Code', 'Description', 'Status', 'Action']"
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
              :pageSize="pageSizes.subsiri"
              hideTableSearch
              hideTablePageSize
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubsiri?.iss_subsiri_id === data.value.iss_subsiri_id }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubsiriClick(data.value)"
                >
                  {{ data.value.Code }}
                </span>
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleSubsiriClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('subsiri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('subsiri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('subsiri', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
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
              {{ subsiriList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('subsiri')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('subsiri')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('subsiri')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Item Main Level 4 Datatable -->
    <rs-card v-if="selectedSubsiri">
      <template #header>
        <div class="text-lg font-semibold">Item Main</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.itemMain"
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
                  v-model="searchKeywords.itemMain"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.itemMain"
                      type="button"
                      @click="searchKeywords.itemMain = ''"
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
                  @click="handleFilter('itemMain')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="item-main-table-wrapper" :style="{ maxHeight: itemMainList.length > 10 ? '600px' : 'auto', overflowY: itemMainList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.itemMain" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="itemMainList"
              :field="['No', 'Code', 'Description', 'Account Code', 'MyFisLite', 'Status', 'Action']"
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
              :pageSize="pageSizes.itemMain"
              hideTableSearch
              hideTablePageSize
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Code="data">
                {{ data.value.Code }}
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:AccountCode="data">
                {{ data.value['Account Code'] }}
              </template>
              <template v-slot:MyFisLite="data">
                {{ data.value.MyFisLite }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleEdit('itemMain', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ itemMainList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('itemMain')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('itemMain')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('itemMain')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Main Category Modal -->
    <rs-modal
      v-model="showModals.mainCategory"
      size="lg"
      dialog-class="main-category-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg main-category-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.mainCategory ? 'View Main Category' : (isEditMode.mainCategory ? 'Edit Main Category' : 'Add Main Category') }}
          </h4>
          <Icon
            @click="handleCancel('mainCategory')"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave('mainCategory')">
          <div class="space-y-2 py-2">
            <div v-if="isEditMode.mainCategory" class="hidden">
              <FormKit v-model="mainCategoryForm.lde_id" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="mainCategoryForm.lde_value"
                  type="text"
                  :disabled="isViewMode.mainCategory || isEditMode.mainCategory"
                  :validation="!isViewMode.mainCategory ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="mainCategoryForm.lde_description"
                  type="textarea"
                  :disabled="isViewMode.mainCategory"
                  :validation="!isViewMode.mainCategory ? 'required' : ''"
                  validation-visibility="dirty"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="mainCategoryForm.lde_description2"
                  type="textarea"
                  :disabled="isViewMode.mainCategory"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="mainCategoryForm.lde_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.mainCategory"
                  :validation="!isViewMode.mainCategory ? 'required' : ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('mainCategory')">
            {{ isViewMode.mainCategory ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.mainCategory" variant="primary" size="sm" @click="handleSave('mainCategory')" :disabled="loading.mainCategory">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Subcategory Modal -->
    <rs-modal
      v-model="showModals.subcategory"
      size="lg"
      dialog-class="subcategory-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg subcategory-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.subcategory ? 'View Subcategory' : (isEditMode.subcategory ? 'Edit Subcategory' : 'Add Subcategory') }}
          </h4>
          <Icon
            @click="handleCancel('subcategory')"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave('subcategory')">
          <div class="space-y-2 py-2">
            <div v-if="isEditMode.subcategory" class="hidden">
              <FormKit v-model="subcategoryForm.isc_subcategory_id" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subcategoryForm.isc_subcategory_code"
                  type="text"
                  :disabled="isViewMode.subcategory || isEditMode.subcategory"
                  :validation="!isViewMode.subcategory ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subcategoryForm.isc_subcategory_desc"
                  type="textarea"
                  :disabled="isViewMode.subcategory"
                  :validation="!isViewMode.subcategory ? 'required' : ''"
                  validation-visibility="dirty"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="subcategoryForm.isc_subcategory_desceng"
                  type="textarea"
                  :disabled="isViewMode.subcategory"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="subcategoryForm.isc_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.subcategory"
                  :validation="!isViewMode.subcategory ? 'required' : ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('subcategory')">
            {{ isViewMode.subcategory ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.subcategory" variant="primary" size="sm" @click="handleSave('subcategory')" :disabled="loading.subcategory">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Subsiri Modal -->
    <rs-modal
      v-model="showModals.subsiri"
      size="lg"
      dialog-class="subsiri-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg subsiri-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.subsiri ? 'View Subsiri' : (isEditMode.subsiri ? 'Edit Subsiri' : 'Add Subsiri') }}
          </h4>
          <Icon
            @click="handleCancel('subsiri')"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave('subsiri')">
          <div class="space-y-2 py-2">
            <div v-if="isEditMode.subsiri" class="hidden">
              <FormKit v-model="subsiriForm.iss_subsiri_id" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.iss_subsiri_code"
                  type="text"
                  :disabled="isViewMode.subsiri || isEditMode.subsiri"
                  :validation="!isViewMode.subsiri ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.iss_subsiri_desc"
                  type="textarea"
                  :disabled="isViewMode.subsiri"
                  :validation="!isViewMode.subsiri ? 'required' : ''"
                  validation-visibility="dirty"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.iss_subsiri_desceng"
                  type="textarea"
                  :disabled="isViewMode.subsiri"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Account Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="subsiriForm.acm_acct_code"
                  type="select"
                  :options="accountCodeOptions"
                  :disabled="isViewMode.subsiri"
                  :validation="!isViewMode.subsiri ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="subsiriForm.iss_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.subsiri"
                  :validation="!isViewMode.subsiri ? 'required' : ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('subsiri')">
            {{ isViewMode.subsiri ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.subsiri" variant="primary" size="sm" @click="handleSave('subsiri')" :disabled="loading.subsiri">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Item Main Modal -->
    <rs-modal
      v-model="showModals.itemMain"
      size="lg"
      dialog-class="item-main-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg item-main-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.itemMain ? 'View Item Main' : (isEditMode.itemMain ? 'Edit Item Main' : 'Add Item Main') }}
          </h4>
          <Icon
            @click="handleCancel('itemMain')"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave('itemMain')">
          <div class="space-y-2 py-2">
            <div v-if="isEditMode.itemMain" class="hidden">
              <FormKit v-model="itemMainForm.itm_item_id" type="text" disabled />
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="itemMainForm.itm_item_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="itemMainForm.itm_item_desc"
                  type="textarea"
                  :disabled="isViewMode.itemMain"
                  :validation="!isViewMode.itemMain ? 'required' : ''"
                  validation-visibility="dirty"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="itemMainForm.itm_item_desceng"
                  type="textarea"
                  :disabled="isViewMode.itemMain"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Account Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="itemMainForm.acm_acct_code"
                  type="select"
                  :options="accountCodeOptions"
                  :disabled="isViewMode.itemMain"
                  :validation="!isViewMode.itemMain ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">MyFisLite<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="itemMainForm.itm_myfislite_flag"
                  type="select"
                  :options="myfisliteOptions"
                  :disabled="isViewMode.itemMain"
                  :validation="!isViewMode.itemMain ? 'required' : ''"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="itemMainForm.itm_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.itemMain"
                  :validation="!isViewMode.itemMain ? 'required' : ''"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('itemMain')">
            {{ isViewMode.itemMain ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.itemMain" variant="primary" size="sm" @click="handleSave('itemMain')" :disabled="loading.itemMain">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.main-category-table-wrapper :deep(.table-header),
.subcategory-table-wrapper :deep(.table-header),
.subsiri-table-wrapper :deep(.table-header),
.item-main-table-wrapper :deep(.table-header) {
  display: none;
}

.main-category-table-wrapper :deep(.rs-table thead th),
.subcategory-table-wrapper :deep(.rs-table thead th),
.subsiri-table-wrapper :deep(.rs-table thead th),
.item-main-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
  font-weight: 600;
}

.main-category-table-wrapper :deep(.rs-table thead th.sortable),
.subcategory-table-wrapper :deep(.rs-table thead th.sortable),
.subsiri-table-wrapper :deep(.rs-table thead th.sortable),
.item-main-table-wrapper :deep(.rs-table thead th.sortable) {
  cursor: pointer;
}

.main-category-table-wrapper :deep(.rs-table thead th.sortable:hover),
.subcategory-table-wrapper :deep(.rs-table thead th.sortable:hover),
.subsiri-table-wrapper :deep(.rs-table thead th.sortable:hover),
.item-main-table-wrapper :deep(.rs-table thead th.sortable:hover) {
  background-color: #2563eb !important;
}
</style>

<style>
.main-category-modal-custom,
.subcategory-modal-custom,
.subsiri-modal-custom,
.item-main-modal-custom {
  width: 600px !important;
}

.main-category-modal-custom .modal-header,
.subcategory-modal-custom .modal-header,
.subsiri-modal-custom .modal-header,
.item-main-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.main-category-modal-custom .main-category-modal-header,
.subcategory-modal-custom .subcategory-modal-header,
.subsiri-modal-custom .subsiri-modal-header,
.item-main-modal-custom .item-main-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Hide default close icon when custom header is used */
.main-category-modal-custom .modal-header > :last-child:not(.main-category-modal-header),
.subcategory-modal-custom .modal-header > :last-child:not(.subcategory-modal-header),
.subsiri-modal-custom .modal-header > :last-child:not(.subsiri-modal-header),
.item-main-modal-custom .modal-header > :last-child:not(.item-main-modal-header) {
  display: none !important;
}
</style>
