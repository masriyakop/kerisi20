<script setup>
definePageMeta({
  title: "Account Code",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "Account Code", path: "/setup/account-code" },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Account Code";
const moduleName = "Setup";
const pageBreadcrumbText = "Dashboard > Setup > GL Structure Setup > Account Code";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Data for 6 cascading datatables
const activityList = ref([]);
const classList = ref([]);
const subClassList = ref([]);
const siriList = ref([]);
const subSiriList = ref([]);
const accountCodeList = ref([]);

// Loading states
const loading = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

// Search keywords for each datatable
const searchKeywords = ref({
  activity: "",
  class: "",
  subClass: "",
  siri: "",
  subSiri: "",
  accountCode: "",
});

// Page sizes
const pageSizes = ref({
  activity: 10,
  class: 10,
  subClass: 10,
  siri: 10,
  subSiri: 10,
  accountCode: 10,
});

// Selected items for cascade filtering
const selectedActivity = ref(null);
const selectedClass = ref(null);
const selectedSubClass = ref(null);
const selectedSiri = ref(null);
const selectedSubSiri = ref(null);

// Smart Filter modals
const showSmartFilter = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

// Smart Filter values
const smartFilters = ref({
  activity: { lde_status: "" },
  class: { acm_acct_status: "" },
  subClass: { acm_acct_status: "" },
  siri: { acm_acct_status: "" },
  subSiri: { acm_acct_status: "" },
  accountCode: { acm_acct_status: "" },
});

// Store original filter values for reset
const originalFilters = ref({
  activity: { lde_status: "" },
  class: { acm_acct_status: "" },
  subClass: { acm_acct_status: "" },
  siri: { acm_acct_status: "" },
  subSiri: { acm_acct_status: "" },
  accountCode: { acm_acct_status: "" },
});

// Add/Edit modals
const showModals = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

const isEditMode = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

const isViewMode = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

// Form data for each level
const activityForm = ref({
  lde_id: null,
  lde_value: "",
  lde_description: "",
  lde_description2: "",
  lde_status: "ACTIVE",
});

const accountForm = ref({
  acm_acct_code: "",
  acm_acct_desc: "",
  acm_acct_desc_eng: "",
  acm_acct_activity: "",
  acm_acct_group: "",
  acm_acct_status: "ACTIVE",
  acm_acct_level: "",
  acm_acct_parent: "",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Fetch Account Activity (Level 0)
const fetchActivity = async () => {
  try {
    loading.value.activity = true;
    const query = {};
    if (searchKeywords.value.activity) {
      query.search = searchKeywords.value.activity;
    }
    if (smartFilters.value.activity.lde_status) {
      query.smartFilter_lde_status = smartFilters.value.activity.lde_status;
    }
    
    const { data, error } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query: { ...query, level: 0, dt_accountactvty: 1 },
      initialCache: false,
    });

    console.log("Activity API Response:", { data: data.value, error: error.value });

    if (data.value?.statusCode === 200) {
      activityList.value = data.value.data || [];
      console.log("Activity List:", activityList.value);
    } else {
      console.error("Error fetching activities:", data.value);
      if (data.value?.message) {
        $swal.fire({
          title: "Error",
          text: data.value.message,
          icon: "error",
        });
      }
    }
    
    if (error.value) {
      console.error("Fetch error:", error.value);
      $swal.fire({
        title: "Error",
        text: "Failed to fetch account activities",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch account activities",
      icon: "error",
    });
  } finally {
    loading.value.activity = false;
  }
};

// Fetch Account Class (Level 1)
const fetchClass = async () => {
  if (!selectedActivity.value) {
    classList.value = [];
    return;
  }
  
  try {
    loading.value.class = true;
    const query = {
      level: 1,
      level_1: 1,
      activity: selectedActivity.value.lde_value,
    };
    if (searchKeywords.value.class) {
      query.search = searchKeywords.value.class;
    }
    if (smartFilters.value.class.acm_acct_status) {
      query.smartFilter_acm_acct_status = smartFilters.value.class.acm_acct_status;
    }
    
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    console.log("Fetch Class API Response:", { data: data.value, query });
    
    if (data.value?.statusCode === 200) {
      // Map API response to match datatable field names
      console.log("Class data received:", data.value.data);
      console.log("Class data array length:", data.value.data?.length);
      console.log("Class data first item:", data.value.data?.[0]);
      
      if (!data.value.data || data.value.data.length === 0) {
        console.warn("No class data returned from API");
        classList.value = [];
        return;
      }
      
      classList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Group': item.acm_acct_group || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
        'Action': '',
        // Keep original data for actions and cascade
        acm_acct_code: item.acm_acct_code,
        acm_acct_desc: item.acm_acct_desc,
        acm_acct_desc_eng: item.acm_acct_desc_eng,
        acm_acct_activity: item.acm_acct_activity,
        acm_acct_group: item.acm_acct_group,
        acm_acct_status: item.acm_acct_status,
        datecreate: item.datecreate,
        acm_acct_level: item.acm_acct_level,
        acm_acct_parent: item.acm_acct_parent,
      }));
      console.log("Mapped classList:", classList.value);
    } else {
      console.error("API returned error:", data.value);
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch account classes",
        icon: "error",
      });
      classList.value = [];
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching account classes",
      icon: "error",
    });
    classList.value = [];
  } finally {
    loading.value.class = false;
  }
};

// Fetch Account Sub-Class (Level 2)
const fetchSubClass = async () => {
  if (!selectedClass.value) {
    subClassList.value = [];
    return;
  }
  
  try {
    loading.value.subClass = true;
    const query = {
      level: 2,
      level2: 1,
      parent: selectedClass.value.acm_acct_code,
    };
    if (searchKeywords.value.subClass) {
      query.search = searchKeywords.value.subClass;
    }
    if (smartFilters.value.subClass.acm_acct_status) {
      query.smartFilter_acm_acct_status = smartFilters.value.subClass.acm_acct_status;
    }
    
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Map API response to match datatable field names
      subClassList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
        'Action': '',
        // Keep original data for actions and cascade
        acm_acct_code: item.acm_acct_code,
        acm_acct_desc: item.acm_acct_desc,
        acm_acct_desc_eng: item.acm_acct_desc_eng,
        acm_acct_activity: item.acm_acct_activity,
        acm_acct_status: item.acm_acct_status,
        datecreate: item.datecreate,
        acm_acct_level: item.acm_acct_level,
        acm_acct_parent: item.acm_acct_parent,
      }));
    }
  } catch (error) {
    console.error("Error fetching sub-classes:", error);
  } finally {
    loading.value.subClass = false;
  }
};

// Fetch Account Siri (Level 3)
const fetchSiri = async () => {
  if (!selectedSubClass.value) {
    siriList.value = [];
    return;
  }
  
  try {
    loading.value.siri = true;
    const query = {
      level: 3,
      level3: 1,
      parent: selectedSubClass.value.acm_acct_code,
    };
    if (searchKeywords.value.siri) {
      query.search = searchKeywords.value.siri;
    }
    if (smartFilters.value.siri.acm_acct_status) {
      query.smartFilter_acm_acct_status = smartFilters.value.siri.acm_acct_status;
    }
    
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Map API response to match datatable field names
      siriList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
        'Action': '',
        // Keep original data for actions and cascade
        acm_acct_code: item.acm_acct_code,
        acm_acct_desc: item.acm_acct_desc,
        acm_acct_desc_eng: item.acm_acct_desc_eng,
        acm_acct_activity: item.acm_acct_activity,
        acm_acct_status: item.acm_acct_status,
        datecreate: item.datecreate,
        acm_acct_level: item.acm_acct_level,
        acm_acct_parent: item.acm_acct_parent,
      }));
    }
  } catch (error) {
    console.error("Error fetching siri:", error);
  } finally {
    loading.value.siri = false;
  }
};

// Fetch Account Sub-Siri (Level 4)
const fetchSubSiri = async () => {
  if (!selectedSiri.value) {
    subSiriList.value = [];
    return;
  }
  
  try {
    loading.value.subSiri = true;
    const query = {
      level: 4,
      level4: 1,
      parent: selectedSiri.value.acm_acct_code,
    };
    if (searchKeywords.value.subSiri) {
      query.search = searchKeywords.value.subSiri;
    }
    if (smartFilters.value.subSiri.acm_acct_status) {
      query.smartFilter_acm_acct_status = smartFilters.value.subSiri.acm_acct_status;
    }
    
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Map API response to match datatable field names
      subSiriList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
        'Action': '',
        // Keep original data for actions and cascade
        acm_acct_code: item.acm_acct_code,
        acm_acct_desc: item.acm_acct_desc,
        acm_acct_desc_eng: item.acm_acct_desc_eng,
        acm_acct_activity: item.acm_acct_activity,
        acm_acct_status: item.acm_acct_status,
        datecreate: item.datecreate,
        acm_acct_level: item.acm_acct_level,
        acm_acct_parent: item.acm_acct_parent,
      }));
    }
  } catch (error) {
    console.error("Error fetching sub-siri:", error);
  } finally {
    loading.value.subSiri = false;
  }
};

// Fetch Account Code (Level 5)
const fetchAccountCode = async () => {
  if (!selectedSubSiri.value) {
    accountCodeList.value = [];
    return;
  }
  
  try {
    loading.value.accountCode = true;
    const query = {
      level: 5,
      level5: 1,
      parent: selectedSubSiri.value.acm_acct_code,
    };
    if (searchKeywords.value.accountCode) {
      query.search = searchKeywords.value.accountCode;
    }
    if (smartFilters.value.accountCode.acm_acct_status) {
      query.smartFilter_acm_acct_status = smartFilters.value.accountCode.acm_acct_status;
    }
    
    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      // Map API response to match datatable field names
      accountCodeList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
        'Action': '',
        // Keep original data for actions and cascade
        acm_acct_code: item.acm_acct_code,
        acm_acct_desc: item.acm_acct_desc,
        acm_acct_desc_eng: item.acm_acct_desc_eng,
        acm_acct_activity: item.acm_acct_activity,
        acm_acct_status: item.acm_acct_status,
        datecreate: item.datecreate,
        acm_acct_level: item.acm_acct_level,
        acm_acct_parent: item.acm_acct_parent,
      }));
    }
  } catch (error) {
    console.error("Error fetching account codes:", error);
  } finally {
    loading.value.accountCode = false;
  }
};

// Watch for cascade selections
watch(selectedActivity, () => {
  selectedClass.value = null;
  selectedSubClass.value = null;
  selectedSiri.value = null;
  selectedSubSiri.value = null;
  fetchClass();
});

watch(selectedClass, () => {
  selectedSubClass.value = null;
  selectedSiri.value = null;
  selectedSubSiri.value = null;
  fetchSubClass();
});

watch(selectedSubClass, () => {
  selectedSiri.value = null;
  selectedSubSiri.value = null;
  fetchSiri();
});

watch(selectedSiri, () => {
  selectedSubSiri.value = null;
  fetchSubSiri();
});

watch(selectedSubSiri, () => {
  fetchAccountCode();
});

// Watch for modal close via X button to reset forms
// Note: handleCancel and handleFilterClose already close the modal, so we only need to reset forms when closed via X
watch(() => showModals.value.activity, (newVal, oldVal) => {
  if (oldVal && !newVal && !isViewMode.value.activity && !isEditMode.value.activity) {
    // Modal was closed via X button, reset form
    activityForm.value = {
      lde_id: null,
      lde_value: "",
      lde_description: "",
      lde_description2: "",
      lde_status: "ACTIVE",
    };
  }
});

watch(() => showSmartFilter.value.activity, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    // Modal was closed via X button, reset filter
    smartFilters.value.activity = { ...originalFilters.value.activity };
  }
});

['class', 'subClass', 'siri', 'subSiri', 'accountCode'].forEach(level => {
  watch(() => showModals.value[level], (newVal, oldVal) => {
    if (oldVal && !newVal && !isViewMode.value[level] && !isEditMode.value[level]) {
      // Modal was closed via X button, reset form
      accountForm.value = {
        acm_acct_code: "",
        acm_acct_desc: "",
        acm_acct_desc_eng: "",
        acm_acct_activity: "",
        acm_acct_group: "",
        acm_acct_status: "ACTIVE",
        acm_acct_level: "",
        acm_acct_parent: "",
      };
    }
  });
  
  watch(() => showSmartFilter.value[level], (newVal, oldVal) => {
    if (oldVal && !newVal) {
      // Modal was closed via X button, reset filter
      smartFilters.value[level] = { ...originalFilters.value[level] };
    }
  });
});

// Watch search keywords
watch(() => searchKeywords.value.activity, () => {
  fetchActivity();
});

watch(() => searchKeywords.value.class, () => {
  if (selectedActivity.value) fetchClass();
});

watch(() => searchKeywords.value.subClass, () => {
  if (selectedClass.value) fetchSubClass();
});

watch(() => searchKeywords.value.siri, () => {
  if (selectedSubClass.value) fetchSiri();
});

watch(() => searchKeywords.value.subSiri, () => {
  if (selectedSiri.value) fetchSubSiri();
});

watch(() => searchKeywords.value.accountCode, () => {
  if (selectedSubSiri.value) fetchAccountCode();
});

// Initialize
onMounted(() => {
  fetchActivity();
});

// Handle row click for cascade
const handleActivityClick = (item) => {
  selectedActivity.value = item;
};

const handleClassClick = (item) => {
  selectedClass.value = item;
};

const handleSubClassClick = (item) => {
  selectedSubClass.value = item;
};

const handleSiriClick = (item) => {
  selectedSiri.value = item;
};

const handleSubSiriClick = (item) => {
  selectedSubSiri.value = item;
};

// Smart Filter handlers
const handleFilter = (level) => {
  originalFilters.value[level] = { ...smartFilters.value[level] };
  showSmartFilter.value[level] = true;
};

const handleFilterReset = (level) => {
  smartFilters.value[level] = { ...originalFilters.value[level] };
  if (level === 'activity') {
    smartFilters.value.activity.lde_status = "";
  } else {
    smartFilters.value[level].acm_acct_status = "";
  }
};

const handleFilterOk = (level) => {
  showSmartFilter.value[level] = false;
  // Refetch data with filters - filters are applied via watch on smartFilters
  if (level === 'activity') {
    fetchActivity();
  } else if (level === 'class') {
    fetchClass();
  } else if (level === 'subClass') {
    fetchSubClass();
  } else if (level === 'siri') {
    fetchSiri();
  } else if (level === 'subSiri') {
    fetchSubSiri();
  } else if (level === 'accountCode') {
    fetchAccountCode();
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
  
  if (level === 'activity') {
    activityForm.value = {
      lde_value: "",
      lde_description: "",
      lde_description2: "",
      lde_status: "ACTIVE",
    };
  } else {
    accountForm.value = {
      acm_acct_code: "",
      acm_acct_desc: "",
      acm_acct_desc_eng: "",
      acm_acct_activity: level === 'class' ? (selectedActivity.value?.lde_value || "") : "",
      acm_acct_group: "",
      acm_acct_status: "ACTIVE",
      acm_acct_level: level === 'class' ? "1" : level === 'subClass' ? "2" : level === 'siri' ? "3" : level === 'subSiri' ? "4" : "5",
      acm_acct_parent: level === 'class' ? "" : 
                      level === 'subClass' ? (selectedClass.value?.acm_acct_code || "") :
                      level === 'siri' ? (selectedSubClass.value?.acm_acct_code || "") :
                      level === 'subSiri' ? (selectedSiri.value?.acm_acct_code || "") :
                      (selectedSubSiri.value?.acm_acct_code || ""),
    };
  }
  showModals.value[level] = true;
};

const handleEdit = (level, item) => {
  isEditMode.value[level] = true;
  isViewMode.value[level] = false;
  
  if (level === 'activity') {
    activityForm.value = {
      lde_id: item.lde_id,
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: item.lde_description2,
      lde_status: item.lde_status,
    };
  } else {
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  }
  showModals.value[level] = true;
};

const handleView = (level, item) => {
  isViewMode.value[level] = true;
  isEditMode.value[level] = false;
  
  // Set selected item to trigger cascade for child datatables
  if (level === 'activity') {
    selectedActivity.value = item;
    activityForm.value = {
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: item.lde_description2,
      lde_status: item.lde_status,
    };
  } else if (level === 'class') {
    selectedClass.value = item;
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  } else if (level === 'subClass') {
    selectedSubClass.value = item;
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  } else if (level === 'siri') {
    selectedSiri.value = item;
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  } else if (level === 'subSiri') {
    selectedSubSiri.value = item;
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  } else {
    accountForm.value = {
      acm_acct_code: item.acm_acct_code,
      acm_acct_desc: item.acm_acct_desc,
      acm_acct_desc_eng: item.acm_acct_desc_eng,
      acm_acct_activity: item.acm_acct_activity,
      acm_acct_group: item.acm_acct_group || "",
      acm_acct_status: item.acm_acct_status,
      acm_acct_level: item.acm_acct_level?.toString() || "",
      acm_acct_parent: item.acm_acct_parent || "",
    };
  }
  showModals.value[level] = true;
};

const handleSave = async (level) => {
  // Validate required fields before try block
  if (level === 'activity') {
    if (!activityForm.value.lde_value || !activityForm.value.lde_description || !activityForm.value.lde_status) {
      $swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }
  } else {
    if (!accountForm.value.acm_acct_code || !accountForm.value.acm_acct_desc || !accountForm.value.acm_acct_status) {
      $swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }
  }

  try {
    loading.value[level] = true;
    
    if (level === 'activity') {
      const url = isEditMode.value.activity && activityForm.value.lde_id
        ? `/api/setup/account-code/activity/${activityForm.value.lde_id}`
        : "/api/setup/account-code/activity";
      const method = isEditMode.value.activity ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          lde_value: activityForm.value.lde_value,
          lde_description: activityForm.value.lde_description,
          lde_description2: activityForm.value.lde_description2,
          lde_status: activityForm.value.lde_status,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        const successMessage = isEditMode.value.activity ? "Success. Account activity updated successfully" : "Success. Account activity is created successfully";
        $swal.fire({
          title: "Success",
          text: successMessage,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        if (isEditMode.value.activity) await logUpdateSuccess(successMessage, "Account activity updated");
        else await logCreateSuccess(successMessage, "Account activity created");
        showModals.value.activity = false;
        isEditMode.value.activity = false;
        activityForm.value = {
          lde_id: null,
          lde_value: "",
          lde_description: "",
          lde_description2: "",
          lde_status: "ACTIVE",
        };
        await fetchActivity();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save account activity",
          icon: "error",
        });
      }
    } else {
      const url = isEditMode.value[level] && accountForm.value.acm_acct_code
        ? `/api/setup/account-code/${accountForm.value.acm_acct_code}`
        : "/api/setup/account-code";
      const method = isEditMode.value[level] ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        query: method === 'POST' ? { level: accountForm.value.acm_acct_level } : {},
        body: {
          acm_acct_code: accountForm.value.acm_acct_code,
          acm_acct_desc: accountForm.value.acm_acct_desc,
          acm_acct_desc_eng: accountForm.value.acm_acct_desc_eng,
          acm_acct_activity: accountForm.value.acm_acct_activity,
          acm_acct_group: accountForm.value.acm_acct_group,
          acm_acct_status: accountForm.value.acm_acct_status,
          acm_acct_level: accountForm.value.acm_acct_level,
          acm_acct_parent: accountForm.value.acm_acct_parent,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        const successMessage = isEditMode.value[level] ? "Success. Account updated successfully" : "Success. Account is created successfully";
        $swal.fire({
          title: "Success",
          text: successMessage,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        if (isEditMode.value[level]) await logUpdateSuccess(successMessage, "Account updated");
        else await logCreateSuccess(successMessage, "Account created");
        showModals.value[level] = false;
        isEditMode.value[level] = false;
        accountForm.value = {
          acm_acct_code: "",
          acm_acct_desc: "",
          acm_acct_desc_eng: "",
          acm_acct_activity: "",
          acm_acct_group: "",
          acm_acct_status: "ACTIVE",
          acm_acct_level: "",
          acm_acct_parent: "",
        };
        
        // Refetch the appropriate level
        if (level === 'class') {
          await fetchClass();
        } else if (level === 'subClass') {
          await fetchSubClass();
        } else if (level === 'siri') {
          await fetchSiri();
        } else if (level === 'subSiri') {
          await fetchSubSiri();
        } else if (level === 'accountCode') {
          await fetchAccountCode();
        }
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save account",
          icon: "error",
        });
      }
    }
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
  isViewMode.value[level] = false;
  isEditMode.value[level] = false;
  
  // Reset forms
  if (level === 'activity') {
    activityForm.value = {
      lde_id: null,
      lde_value: "",
      lde_description: "",
      lde_description2: "",
      lde_status: "ACTIVE",
    };
  } else {
    accountForm.value = {
      acm_acct_code: "",
      acm_acct_desc: "",
      acm_acct_desc_eng: "",
      acm_acct_activity: "",
      acm_acct_group: "",
      acm_acct_status: "ACTIVE",
      acm_acct_level: "",
      acm_acct_parent: "",
    };
  }
};

const handleDelete = async (level, item) => {
  const messageText = "Are you sure? Do you want to delete this record?";
  const logId = await logDeleteConfirmationPrompt(messageText);

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

  await updateMessageLogAction(logId, result.isConfirmed ? "Yes, delete it!" : "Cancel");

  if (result.isConfirmed) {
    try {
      loading.value[level] = true;
      
      let url;
      if (level === 'activity') {
        url = `/api/setup/account-code/activity/${item.lde_id}`;
      } else {
        url = `/api/setup/account-code/${item.acm_acct_code}`;
      }

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
        if (level === 'activity') {
          await fetchActivity();
        } else if (level === 'class') {
          await fetchClass();
        } else if (level === 'subClass') {
          await fetchSubClass();
        } else if (level === 'siri') {
          await fetchSiri();
        } else if (level === 'subSiri') {
          await fetchSubSiri();
        } else if (level === 'accountCode') {
          await fetchAccountCode();
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

// Download functions for each level
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

    <!-- ACCOUNT ACTIVITY Datatable -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT ACTIVITY</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.activity"
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
                  v-model="searchKeywords.activity"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.activity"
                      type="button"
                      @click="searchKeywords.activity = ''"
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
                  @click="handleFilter('activity')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="activity-table-wrapper" :style="{ maxHeight: activityList.length > 10 ? '600px' : 'auto', overflowY: activityList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.activity" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="activityList"
              :field="['No', 'Account Activity Code', 'Description (Malay)', 'Description (English)', 'Status', 'Action']"
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
              :pageSize="pageSizes.activity"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountActivityCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedActivity?.lde_value === data.value.lde_value }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleActivityClick(data.value)"
                >
                  {{ data.value.lde_value }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value.lde_description }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value.lde_description2 }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.lde_status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.lde_status === 'INACTIVE',
                  }"
                >
                  {{ data.value.lde_status }}
                </span>
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleActivityClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View Account Class"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleActivityClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleEdit('activity', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ACCOUNT CLASS Datatable -->
    <rs-card v-if="selectedActivity">
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT CLASS</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.class"
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
                  v-model="searchKeywords.class"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.class"
                      type="button"
                      @click="searchKeywords.class = ''"
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
                  @click="handleFilter('class')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="class-table-wrapper" :style="{ maxHeight: classList.length > 10 ? '600px' : 'auto', overflowY: classList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.class" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="classList"
              :field="['No', 'Account Code', 'Description (Malay)', 'Description (English)', 'Activity', 'Group', 'Status', 'Date Created', 'Action']"
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
              :pageSize="pageSizes.class"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedClass?.acm_acct_code === data.value.acm_acct_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleClassClick(data.value)"
                >
                  {{ data.value['Account Code'] }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] || '-' }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value['Activity'] }}
              </template>
              <template v-slot:Group="data">
                {{ data.value['Group'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value['Status'] === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value['Status'] === 'INACTIVE',
                  }"
                >
                  {{ data.value['Status'] }}
                </span>
              </template>
              <template v-slot:DateCreated="data">
                {{ data.value['Date Created'] ? new Date(data.value['Date Created']).toLocaleDateString('en-GB') : '' }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView('class', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleClassClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleEdit('class', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('class', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ classList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('class')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('class')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('class')" :disabled="!selectedActivity">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ACCOUNT SUB-CLASS Datatable -->
    <rs-card v-if="selectedClass">
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT SUB-CLASS</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.subClass"
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
                  v-model="searchKeywords.subClass"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.subClass"
                      type="button"
                      @click="searchKeywords.subClass = ''"
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
                  @click="handleFilter('subClass')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="subclass-table-wrapper" :style="{ maxHeight: subClassList.length > 10 ? '600px' : 'auto', overflowY: subClassList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.subClass" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="subClassList"
              :field="['No', 'Account Code', 'Description (Malay)', 'Description (English)', 'Activity', 'Status', 'Date Created', 'Action']"
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
              :pageSize="pageSizes.subClass"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubClass?.acm_acct_code === data.value.acm_acct_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubClassClick(data.value)"
                >
                  {{ data.value['Account Code'] }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] || '-' }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value['Activity'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value['Status'] === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value['Status'] === 'INACTIVE',
                  }"
                >
                  {{ data.value['Status'] }}
                </span>
              </template>
              <template v-slot:DateCreated="data">
                {{ data.value['Date Created'] ? new Date(data.value['Date Created']).toLocaleDateString('en-GB') : '' }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView('subClass', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleSubClassClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleEdit('subClass', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('subClass', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ subClassList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('subClass')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('subClass')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('subClass')" :disabled="!selectedClass">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ACCOUNT SIRIES Datatable -->
    <rs-card v-if="selectedSubClass">
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT SIRIES</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.siri"
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
                  v-model="searchKeywords.siri"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.siri"
                      type="button"
                      @click="searchKeywords.siri = ''"
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
                  @click="handleFilter('siri')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="siri-table-wrapper" :style="{ maxHeight: siriList.length > 10 ? '600px' : 'auto', overflowY: siriList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.siri" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="siriList"
              :field="['No', 'Account Code', 'Description (Malay)', 'Description (English)', 'Activity', 'Status', 'Date Created', 'Action']"
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
              :pageSize="pageSizes.siri"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSiri?.acm_acct_code === data.value.acm_acct_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSiriClick(data.value)"
                >
                  {{ data.value['Account Code'] }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] || '-' }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value['Activity'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value['Status'] === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value['Status'] === 'INACTIVE',
                  }"
                >
                  {{ data.value['Status'] }}
                </span>
              </template>
              <template v-slot:DateCreated="data">
                {{ data.value['Date Created'] ? new Date(data.value['Date Created']).toLocaleDateString('en-GB') : '' }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView('siri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleSiriClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleEdit('siri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('siri', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ siriList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('siri')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('siri')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('siri')" :disabled="!selectedSubClass">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ACCOUNT SUB-SIRIES Datatable -->
    <rs-card v-if="selectedSiri">
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT SUB-SIRIES</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.subSiri"
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
                  v-model="searchKeywords.subSiri"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.subSiri"
                      type="button"
                      @click="searchKeywords.subSiri = ''"
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
                  @click="handleFilter('subSiri')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="subsiri-table-wrapper" :style="{ maxHeight: subSiriList.length > 10 ? '600px' : 'auto', overflowY: subSiriList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.subSiri" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="subSiriList"
              :field="['No', 'Account Code', 'Description (Malay)', 'Description (English)', 'Activity', 'Status', 'Date Created', 'Action']"
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
              :pageSize="pageSizes.subSiri"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountCode="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubSiri?.acm_acct_code === data.value.acm_acct_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubSiriClick(data.value)"
                >
                  {{ data.value['Account Code'] }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] || '-' }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value['Activity'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value['Status'] === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value['Status'] === 'INACTIVE',
                  }"
                >
                  {{ data.value['Status'] }}
                </span>
              </template>
              <template v-slot:DateCreated="data">
                {{ data.value['Date Created'] ? new Date(data.value['Date Created']).toLocaleDateString('en-GB') : '' }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView('subSiri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleSubSiriClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleEdit('subSiri', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('subSiri', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ subSiriList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('subSiri')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('subSiri')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('subSiri')" :disabled="!selectedSiri">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ACCOUNT CODE Datatable -->
    <rs-card v-if="selectedSubSiri">
      <template #header>
        <div class="text-lg font-semibold">ACCOUNT CODE</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.accountCode"
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
                  v-model="searchKeywords.accountCode"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.accountCode"
                      type="button"
                      @click="searchKeywords.accountCode = ''"
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
                  @click="handleFilter('accountCode')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="accountcode-table-wrapper" :style="{ maxHeight: accountCodeList.length > 10 ? '600px' : 'auto', overflowY: accountCodeList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.accountCode" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="accountCodeList"
              :field="['No', 'Account Code', 'Description (Malay)', 'Description (English)', 'Activity', 'Status', 'Date Created', 'Action']"
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
              :pageSize="pageSizes.accountCode"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:AccountCode="data">
                {{ data.value['Account Code'] }}
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] || '-' }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value['Activity'] }}
              </template>
              <template v-slot:Status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value['Status'] === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value['Status'] === 'INACTIVE',
                  }"
                >
                  {{ data.value['Status'] }}
                </span>
              </template>
              <template v-slot:DateCreated="data">
                {{ data.value['Date Created'] ? new Date(data.value['Date Created']).toLocaleDateString('en-GB') : '' }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleView('accountCode', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('accountCode', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Duplicate"
                  >
                    <Icon name="material-symbols:content-copy" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('accountCode', data.value)"
                    class="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-red-600 dark:text-red-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ accountCodeList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('accountCode')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('accountCode')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('accountCode')" :disabled="!selectedSubSiri">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Smart Filter Modals for each level -->
    <template v-for="level in ['activity', 'class', 'subClass', 'siri', 'subSiri', 'accountCode']" :key="level">
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
                    v-model="smartFilters[level][level === 'activity' ? 'lde_status' : 'acm_acct_status']"
                    type="select"
                    :options="statusOptions"
                    placeholder="Select Status"
                    outer-class="mb-0"
                  />
                  <button
                    v-if="smartFilters[level][level === 'activity' ? 'lde_status' : 'acm_acct_status']"
                    type="button"
                    @click="smartFilters[level][level === 'activity' ? 'lde_status' : 'acm_acct_status'] = ''"
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

    <!-- Add/Edit Modal for Activity -->
    <rs-modal
      v-model="showModals.activity"
      title="Account Activity"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.activity ? 'View Account Activity' : (isEditMode.activity ? 'Edit Account Activity' : 'Add Account Activity') }}
          </h4>
          <Icon
            @click="handleCancel('activity')"
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
              <label class="w-40 text-xs font-medium">Account Activity Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityForm.lde_value"
                  type="text"
                  :disabled="isViewMode.activity"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityForm.lde_description"
                  type="text"
                  :disabled="isViewMode.activity"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityForm.lde_description2"
                  type="text"
                  :disabled="isViewMode.activity"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="activityForm.lde_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.activity"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('activity')">
            {{ isViewMode.activity ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.activity" variant="primary" size="sm" @click="handleSave('activity')">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Modal for Account Levels (Class, Sub-Class, Siri, Sub-Siri, Account Code) -->
    <template v-for="level in ['class', 'subClass', 'siri', 'subSiri', 'accountCode']" :key="level">
      <rs-modal
        v-model="showModals[level]"
        :title="`Account ${level === 'class' ? 'Class' : level === 'subClass' ? 'Sub-Class' : level === 'siri' ? 'Siri' : level === 'subSiri' ? 'Sub-Siri' : 'Code'}`"
        size="lg"
        dialog-class="account-modal-custom"
        :overlay-close="true"
        :hide-footer="false"
        position="center"
      >
        <template #header>
          <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
            <h4 class="text-base font-semibold text-white">
              {{ isViewMode[level] ? `View Account ${level === 'class' ? 'Class' : level === 'subClass' ? 'Sub-Class' : level === 'siri' ? 'Siri' : level === 'subSiri' ? 'Sub-Siri' : 'Code'}` : (isEditMode[level] ? `Edit Account ${level === 'class' ? 'Class' : level === 'subClass' ? 'Sub-Class' : level === 'siri' ? 'Siri' : level === 'subSiri' ? 'Sub-Siri' : 'Code'}` : `Add Account ${level === 'class' ? 'Class' : level === 'subClass' ? 'Sub-Class' : level === 'siri' ? 'Siri' : level === 'subSiri' ? 'Sub-Siri' : 'Code'}`) }}
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
                <label class="w-40 text-xs font-medium">Account Code<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="accountForm.acm_acct_code"
                    type="text"
                    :disabled="isViewMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="accountForm.acm_acct_desc"
                    type="text"
                    :disabled="isViewMode[level]"
                    validation="required"
                    validation-visibility="dirty"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Description (English):</label>
                <div class="flex-1">
                  <FormKit
                    v-model="accountForm.acm_acct_desc_eng"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div v-if="level === 'class'" class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Activity:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="accountForm.acm_acct_activity"
                    type="text"
                    :disabled="true"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div v-if="level === 'class'" class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Group:</label>
                <div class="flex-1">
                  <FormKit
                    v-model="accountForm.acm_acct_group"
                    type="text"
                    :disabled="isViewMode[level]"
                    outer-class="mb-0"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
                <div class="flex-1 relative">
                  <FormKit
                    v-model="accountForm.acm_acct_status"
                    type="select"
                    :options="statusOptions"
                    :disabled="isViewMode[level]"
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
.activity-table-wrapper :deep(.table-header),
.class-table-wrapper :deep(.table-header),
.subclass-table-wrapper :deep(.table-header),
.siri-table-wrapper :deep(.table-header),
.subsiri-table-wrapper :deep(.table-header),
.accountcode-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.activity-table-wrapper :deep(th),
.class-table-wrapper :deep(th),
.subclass-table-wrapper :deep(th),
.siri-table-wrapper :deep(th),
.subsiri-table-wrapper :deep(th),
.accountcode-table-wrapper :deep(th) {
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
