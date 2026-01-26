<script setup>
    definePageMeta({
  title: "Activity Code",
      middleware: ["auth"],
      requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "Activity Code", path: "/setup/glstructure/activity" },
  ],
});

const { $swal } = useNuxtApp();

// Data for 4 cascading datatables
const groupList = ref([]);
const subgroupList = ref([]);
const subsiriList = ref([]);
const activityTypeList = ref([]);

// Loading states
const loading = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

// Search keywords for each datatable
const searchKeywords = ref({
  group: "",
  subgroup: "",
  subsiri: "",
  activityType: "",
});

// Page sizes
const pageSizes = ref({
  group: 5,
  subgroup: 5,
  subsiri: 5,
  activityType: 5,
});

// Selected items for cascade filtering
const selectedGroup = ref(null);
const selectedSubgroup = ref(null);
const selectedSubsiri = ref(null);

// Smart Filter modals
const showSmartFilter = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

// Smart Filter values
const smartFilters = ref({
  group: {},
  subgroup: {},
  subsiri: {},
  activityType: { at_status: "" },
});

// Store original filter values for reset
const originalFilters = ref({
  group: {},
  subgroup: {},
  subsiri: {},
  activityType: { at_status: "" },
});

// Add/Edit modals
const showModals = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

// Edit/View mode flags
const isEditMode = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

const isViewMode = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

// Form data
const groupForm = ref({
  activity_group_code: "",
  activity_group_desc: "",
});

const subgroupForm = ref({
  activity_group_code: "",
  activity_subgroup_code: "",
  activity_subgroup_desc: "",
});

const subsiriForm = ref({
  activity_group: "",
  activity_subgroup_code: "",
  activity_subsiri_code: "",
  activity_subsiri_desc: "",
  activity_subsiri_desc_eng: "",
});

const activityTypeForm = ref({
  at_activity_id: null,
  activity_group_code: "",
  activity_subgroup_code: "",
  activity_subsiri_code: "",
  at_activity_code: "",
  at_activity_description_bm: "",
  at_activity_description_en: "",
  at_status: "ACTIVE",
});

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Fetch Activity Group Level 1
const fetchGroup = async () => {
  try {
    loading.value.group = true;
    const query = {
      level: 0,
    };
    if (searchKeywords.value.group) {
      query.search = searchKeywords.value.group;
    }
    
    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      groupList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        Group: item.Group || '',
        Description: item.Description || '',
        Action: '',
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_group_desc: item.activity_group_desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
  } finally {
    loading.value.group = false;
  }
};

// Fetch Activity Subgroup Level 2
const fetchSubgroup = async () => {
  if (!selectedGroup.value) {
    subgroupList.value = [];
    return;
  }
  
  try {
    loading.value.subgroup = true;
    const query = {
      level: 1,
      activity_group_code: selectedGroup.value.activity_group_code,
    };
    if (searchKeywords.value.subgroup) {
      query.search = searchKeywords.value.subgroup;
    }
    
    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      subgroupList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Code Activity': item['Code Activity'] || '',
        'Description': item.Description || '',
        'Action': '',
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subgroup_desc: item.activity_subgroup_desc,
      }));
    }
  } catch (error) {
    console.error("Error fetching subgroups:", error);
  } finally {
    loading.value.subgroup = false;
  }
};

// Fetch Activity Subsiri Level 3
const fetchSubsiri = async () => {
  if (!selectedSubgroup.value) {
    subsiriList.value = [];
    return;
  }
  
  try {
    loading.value.subsiri = true;
    const query = {
      level: 2,
      activity_group_code: selectedGroup.value.activity_group_code,
      activity_subgroup_code: selectedSubgroup.value.activity_subgroup_code,
    };
    if (searchKeywords.value.subsiri) {
      query.search = searchKeywords.value.subsiri;
    }
    
    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      subsiriList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Code Activity': item['Code Activity'] || '',
        'Description (Malay)': item['Description (Malay)'] || '',
        'Description (English)': item['Description (English)'] || '',
        'Action': '',
        // Keep original data
        activity_group: item.activity_group,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        activity_subsiri_desc: item.activity_subsiri_desc,
        activity_subsiri_desc_eng: item.activity_subsiri_desc_eng,
      }));
    }
  } catch (error) {
    console.error("Error fetching subsiris:", error);
  } finally {
    loading.value.subsiri = false;
  }
};

// Fetch Activity Type Level 4
const fetchActivityType = async () => {
  if (!selectedSubsiri.value) {
    activityTypeList.value = [];
    return;
  }
  
  try {
    loading.value.activityType = true;
    const query = {
      level: 3,
      activity_group_code: selectedGroup.value.activity_group_code,
      activity_subgroup_code: selectedSubgroup.value.activity_subgroup_code,
      activity_subsiri_code: selectedSubsiri.value.activity_subsiri_code,
    };
    if (searchKeywords.value.activityType) {
      query.search = searchKeywords.value.activityType;
    }
    if (smartFilters.value.activityType.at_status) {
      query.smartFilter_at_status = smartFilters.value.activityType.at_status;
    }
    
    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      activityTypeList.value = (data.value.data || []).map((item) => ({
        no: item.no,
        'Activity Code': item['Activity Code'] || '',
        'Description (Malay)': item['Description (Malay)'] || '',
        'Description (English)': item['Description (English)'] || '',
        'Status': item.Status || '',
        'Action': '',
        // Keep original data
        at_activity_id: item.at_activity_id,
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        at_activity_code: item.at_activity_code,
        at_activity_description_bm: item.at_activity_description_bm,
        at_activity_description_en: item.at_activity_description_en,
        at_status: item.at_status,
      }));
    }
  } catch (error) {
    console.error("Error fetching activity types:", error);
  } finally {
    loading.value.activityType = false;
  }
};

// Watch for cascade selections
watch(selectedGroup, () => {
  selectedSubgroup.value = null;
  selectedSubsiri.value = null;
  fetchSubgroup();
});

watch(selectedSubgroup, () => {
  selectedSubsiri.value = null;
  fetchSubsiri();
});

watch(selectedSubsiri, () => {
  fetchActivityType();
});

// Watch search keywords
watch(() => searchKeywords.value.group, () => {
  fetchGroup();
});

watch(() => searchKeywords.value.subgroup, () => {
  if (selectedGroup.value) fetchSubgroup();
});

watch(() => searchKeywords.value.subsiri, () => {
  if (selectedSubgroup.value) fetchSubsiri();
});

watch(() => searchKeywords.value.activityType, () => {
  if (selectedSubsiri.value) fetchActivityType();
});

// Initialize
onMounted(() => {
  fetchGroup();
});

// Handle row click for cascade
const handleGroupClick = (item) => {
  selectedGroup.value = item;
};

const handleSubgroupClick = (item) => {
  selectedSubgroup.value = item;
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
  if (level === 'activityType') {
    smartFilters.value.activityType.at_status = "";
  }
};

const handleFilterOk = (level) => {
  showSmartFilter.value[level] = false;
  if (level === 'group') {
    fetchGroup();
  } else if (level === 'subgroup') {
    fetchSubgroup();
  } else if (level === 'subsiri') {
    fetchSubsiri();
  } else if (level === 'activityType') {
    fetchActivityType();
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
  
  if (level === 'group') {
    groupForm.value = {
      activity_group_code: "",
      activity_group_desc: "",
    };
  } else if (level === 'subgroup') {
    subgroupForm.value = {
      activity_group_code: selectedGroup.value?.activity_group_code || "",
      activity_subgroup_code: "",
      activity_subgroup_desc: "",
    };
  } else if (level === 'subsiri') {
    subsiriForm.value = {
      activity_group: selectedGroup.value?.activity_group_code || "",
      activity_subgroup_code: selectedSubgroup.value?.activity_subgroup_code || "",
      activity_subsiri_code: "",
      activity_subsiri_desc: "",
      activity_subsiri_desc_eng: "",
    };
  } else if (level === 'activityType') {
    activityTypeForm.value = {
      at_activity_id: null,
      activity_group_code: selectedGroup.value?.activity_group_code || "",
      activity_subgroup_code: selectedSubgroup.value?.activity_subgroup_code || "",
      activity_subsiri_code: selectedSubsiri.value?.activity_subsiri_code || "",
      at_activity_code: "",
      at_activity_description_bm: "",
      at_activity_description_en: "",
      at_status: "ACTIVE",
    };
  }
  showModals.value[level] = true;
};

const handleEdit = (level, item) => {
  isEditMode.value[level] = true;
  isViewMode.value[level] = false;
  
  if (level === 'group') {
    groupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_group_desc: item.activity_group_desc,
    };
  } else if (level === 'subgroup') {
    subgroupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subgroup_desc: item.activity_subgroup_desc,
    };
  } else if (level === 'subsiri') {
    subsiriForm.value = {
      activity_group: item.activity_group,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      activity_subsiri_desc: item.activity_subsiri_desc,
      activity_subsiri_desc_eng: item.activity_subsiri_desc_eng || "",
    };
  } else if (level === 'activityType') {
    activityTypeForm.value = {
      at_activity_id: item.at_activity_id,
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      at_activity_code: item.at_activity_code,
      at_activity_description_bm: item.at_activity_description_bm || "",
      at_activity_description_en: item.at_activity_description_en || "",
      at_status: item.at_status === '1' ? 'ACTIVE' : 'INACTIVE',
    };
  }
  showModals.value[level] = true;
};

const handleView = (level, item) => {
  isViewMode.value[level] = true;
  isEditMode.value[level] = false;
  
  // Set selected item to trigger cascade for child datatables
  if (level === 'group') {
    selectedGroup.value = item;
    groupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_group_desc: item.activity_group_desc,
    };
  } else if (level === 'subgroup') {
    selectedSubgroup.value = item;
    subgroupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subgroup_desc: item.activity_subgroup_desc,
    };
  } else if (level === 'subsiri') {
    selectedSubsiri.value = item;
    subsiriForm.value = {
      activity_group: item.activity_group,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      activity_subsiri_desc: item.activity_subsiri_desc,
      activity_subsiri_desc_eng: item.activity_subsiri_desc_eng || "",
    };
  } else {
    activityTypeForm.value = {
      at_activity_id: item.at_activity_id,
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      at_activity_code: item.at_activity_code,
      at_activity_description_bm: item.at_activity_description_bm || "",
      at_activity_description_en: item.at_activity_description_en || "",
      at_status: item.at_status === '1' ? 'ACTIVE' : 'INACTIVE',
    };
  }
  showModals.value[level] = true;
};

const handleSave = async (level) => {
  // Validate required fields before try block
  if (level === 'group') {
    if (!groupForm.value.activity_group_code || !groupForm.value.activity_group_desc) {
      $swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }
  } else if (level === 'subgroup') {
    if (!subgroupForm.value.activity_group_code || !subgroupForm.value.activity_subgroup_code || !subgroupForm.value.activity_subgroup_desc) {
      $swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }
  } else if (level === 'subsiri') {
    if (!subsiriForm.value.activity_group || !subsiriForm.value.activity_subgroup_code || !subsiriForm.value.activity_subsiri_code || !subsiriForm.value.activity_subsiri_desc) {
      $swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }
  } else if (level === 'activityType') {
    if (!activityTypeForm.value.activity_group_code || !activityTypeForm.value.activity_subgroup_code || !activityTypeForm.value.activity_subsiri_code || !activityTypeForm.value.at_activity_code || !activityTypeForm.value.at_activity_description_bm || !activityTypeForm.value.at_status) {
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
    
    if (level === 'group') {
      const url = isEditMode.value.group && groupForm.value.activity_group_code
        ? `/api/setup/activity-code/group/${groupForm.value.activity_group_code}`
        : "/api/setup/activity-code/group";
      const method = isEditMode.value.group ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          activity_group_code: groupForm.value.activity_group_code,
          activity_group_desc: groupForm.value.activity_group_desc,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        $swal.fire({
          title: "Success",
          text: isEditMode.value.group ? "Activity group updated successfully" : "Activity group created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        showModals.value.group = false;
        isEditMode.value.group = false;
        groupForm.value = { activity_group_code: "", activity_group_desc: "" };
        await fetchGroup();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save activity group",
          icon: "error",
        });
      }
    } else if (level === 'subgroup') {
      const url = isEditMode.value.subgroup && subgroupForm.value.activity_subgroup_code
        ? `/api/setup/activity-code/subgroup/${subgroupForm.value.activity_subgroup_code}`
        : "/api/setup/activity-code/subgroup";
      const method = isEditMode.value.subgroup ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          activity_group_code: subgroupForm.value.activity_group_code,
          activity_subgroup_code: subgroupForm.value.activity_subgroup_code,
          activity_subgroup_desc: subgroupForm.value.activity_subgroup_desc,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        $swal.fire({
          title: "Success",
          text: isEditMode.value.subgroup ? "Activity subgroup updated successfully" : "Activity subgroup created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        showModals.value.subgroup = false;
        isEditMode.value.subgroup = false;
        subgroupForm.value = { activity_group_code: "", activity_subgroup_code: "", activity_subgroup_desc: "" };
        await fetchSubgroup();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save activity subgroup",
          icon: "error",
        });
      }
    } else if (level === 'subsiri') {
      const url = isEditMode.value.subsiri && subsiriForm.value.activity_subsiri_code
        ? `/api/setup/activity-code/subsiri/${subsiriForm.value.activity_subsiri_code}`
        : "/api/setup/activity-code/subsiri";
      const method = isEditMode.value.subsiri ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          activity_group: subsiriForm.value.activity_group,
          activity_subgroup_code: subsiriForm.value.activity_subgroup_code,
          activity_subsiri_code: subsiriForm.value.activity_subsiri_code,
          activity_subsiri_desc: subsiriForm.value.activity_subsiri_desc,
          activity_subsiri_desc_eng: subsiriForm.value.activity_subsiri_desc_eng,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        $swal.fire({
          title: "Success",
          text: isEditMode.value.subsiri ? "Activity subsiri updated successfully" : "Activity subsiri created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        showModals.value.subsiri = false;
        isEditMode.value.subsiri = false;
        subsiriForm.value = { activity_group: "", activity_subgroup_code: "", activity_subsiri_code: "", activity_subsiri_desc: "", activity_subsiri_desc_eng: "" };
        await fetchSubsiri();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save activity subsiri",
          icon: "error",
        });
      }
    } else if (level === 'activityType') {
      const url = isEditMode.value.activityType && activityTypeForm.value.at_activity_id
        ? `/api/setup/activity-code/activity-type/${activityTypeForm.value.at_activity_id}`
        : "/api/setup/activity-code/activity-type";
      const method = isEditMode.value.activityType ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          activity_group_code: activityTypeForm.value.activity_group_code,
          activity_subgroup_code: activityTypeForm.value.activity_subgroup_code,
          activity_subsiri_code: activityTypeForm.value.activity_subsiri_code,
          at_activity_code: activityTypeForm.value.at_activity_code,
          at_activity_description_bm: activityTypeForm.value.at_activity_description_bm,
          at_activity_description_en: activityTypeForm.value.at_activity_description_en,
          at_status: activityTypeForm.value.at_status,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        $swal.fire({
          title: "Success",
          text: isEditMode.value.activityType ? "Activity type updated successfully" : "Activity type created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        showModals.value.activityType = false;
        isEditMode.value.activityType = false;
        activityTypeForm.value = { at_activity_id: null, activity_group_code: "", activity_subgroup_code: "", activity_subsiri_code: "", at_activity_code: "", at_activity_description_bm: "", at_activity_description_en: "", at_status: "ACTIVE" };
        await fetchActivityType();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to save activity type",
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
  isEditMode.value[level] = false;
  isViewMode.value[level] = false;
  
  // Reset forms
  if (level === 'group') {
    groupForm.value = { activity_group_code: "", activity_group_desc: "" };
  } else if (level === 'subgroup') {
    subgroupForm.value = { activity_group_code: "", activity_subgroup_code: "", activity_subgroup_desc: "" };
  } else if (level === 'subsiri') {
    subsiriForm.value = { activity_group: "", activity_subgroup_code: "", activity_subsiri_code: "", activity_subsiri_desc: "", activity_subsiri_desc_eng: "" };
  } else if (level === 'activityType') {
    activityTypeForm.value = { at_activity_id: null, activity_group_code: "", activity_subgroup_code: "", activity_subsiri_code: "", at_activity_code: "", at_activity_description_bm: "", at_activity_description_en: "", at_status: "ACTIVE" };
  }
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
      let url = "";
      
      if (level === 'group') {
        url = `/api/setup/activity-code/group/${item.activity_group_code}`;
      } else if (level === 'subgroup') {
        url = `/api/setup/activity-code/subgroup/${item.activity_subgroup_code}?activity_group_code=${item.activity_group_code}`;
      } else if (level === 'subsiri') {
        url = `/api/setup/activity-code/subsiri/${item.activity_subsiri_code}?activity_group=${item.activity_group}&activity_subgroup_code=${item.activity_subgroup_code}`;
      } else if (level === 'activityType') {
        url = `/api/setup/activity-code/activity-type/${item.at_activity_id}`;
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
        if (level === 'group') {
          await fetchGroup();
        } else if (level === 'subgroup') {
          await fetchSubgroup();
        } else if (level === 'subsiri') {
          await fetchSubsiri();
        } else if (level === 'activityType') {
          await fetchActivityType();
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

    <!-- Activity Group Level 1 Datatable -->
        <rs-card>
          <template #header>
        <div class="text-lg font-semibold">Activity Group Level 1</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.group"
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
                  v-model="searchKeywords.group"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.group"
                      type="button"
                      @click="searchKeywords.group = ''"
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
                  @click="handleFilter('group')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="group-table-wrapper" :style="{ maxHeight: groupList.length > 10 ? '600px' : 'auto', overflowY: groupList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.group" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="groupList"
              :field="['No', 'Group', 'Description', 'Action']"
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
              :pageSize="pageSizes.group"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:Group="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedGroup?.activity_group_code === data.value.activity_group_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleGroupClick(data.value)"
                >
                  {{ data.value.Group }}
                </span>
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleGroupClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('group', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('group', data.value)"
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
              {{ groupList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('group')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('group')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('group')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Activity Subgroup Level 2 Datatable -->
    <rs-card v-if="selectedGroup">
      <template #header>
        <div class="text-lg font-semibold">Activity Subgroup Level 2</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.subgroup"
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
                  v-model="searchKeywords.subgroup"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.subgroup"
                      type="button"
                      @click="searchKeywords.subgroup = ''"
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
                  @click="handleFilter('subgroup')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="subgroup-table-wrapper" :style="{ maxHeight: subgroupList.length > 10 ? '600px' : 'auto', overflowY: subgroupList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.subgroup" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="subgroupList"
              :field="['No', 'Code Activity', 'Description', 'Action']"
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
              :pageSize="pageSizes.subgroup"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:CodeActivity="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubgroup?.activity_subgroup_code === data.value.activity_subgroup_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubgroupClick(data.value)"
                >
                  {{ data.value['Code Activity'] }}
                </span>
              </template>
              <template v-slot:Description="data">
                {{ data.value.Description }}
              </template>
              <template v-slot:Action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleSubgroupClick(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View List"
                  >
                    <i class="fas fa-level-down-alt text-gray-600 dark:text-gray-400" style="font-size: 16px;"></i>
                  </button>
                  <button
                    @click="handleView('subgroup', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('subgroup', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('subgroup', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ subgroupList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('subgroup')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('subgroup')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('subgroup')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Activity Subsiri Level 3 Datatable -->
    <rs-card v-if="selectedSubgroup">
      <template #header>
        <div class="text-lg font-semibold">Activity Subsiri Level 3</div>
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
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
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
                        class="!w-3.5 !h-3.5 text-gray-500"
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
              :field="['No', 'Code Activity', 'Description (Malay)', 'Description (English)', 'Action']"
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
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:CodeActivity="data">
                <span 
                  :class="{ 'bg-yellow-200 dark:bg-yellow-800': selectedSubsiri?.activity_subsiri_code === data.value.activity_subsiri_code }"
                  class="cursor-pointer px-2 py-1 rounded"
                  @click="handleSubsiriClick(data.value)"
                >
                  {{ data.value['Code Activity'] }}
                </span>
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] }}
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
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
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

    <!-- Activity Type Level 4 Datatable -->
    <rs-card v-if="selectedSubsiri">
      <template #header>
        <div class="text-lg font-semibold">Activity Type Level 4</div>
          </template>
          <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Display:</label>
              <FormKit
                type="select"
                v-model="pageSizes.activityType"
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
                  v-model="searchKeywords.activityType"
                  type="text"
                  placeholder="Search..."
                  outer-class="mb-0"
                  input-class="!h-8 !text-sm !px-2"
                  inner-class="!h-8"
                >
                  <template #suffix>
                    <button
                      v-if="searchKeywords.activityType"
                      type="button"
                      @click="searchKeywords.activityType = ''"
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
                  @click="handleFilter('activityType')"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>
          <div class="activitytype-table-wrapper" :style="{ maxHeight: activityTypeList.length > 10 ? '600px' : 'auto', overflowY: activityTypeList.length > 10 ? 'auto' : 'visible' }">
            <div v-if="loading.activityType" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <rs-table
              v-else
              :data="activityTypeList"
              :field="['No', 'Activity Code', 'Description (Malay)', 'Description (English)', 'Status', 'Action']"
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
              :pageSize="pageSizes.activityType"
            >
              <template v-slot:No="data">
                {{ data.value.no }}
              </template>
              <template v-slot:ActivityCode="data">
                {{ data.value['Activity Code'] }}
              </template>
              <template v-slot:DescriptionMalay="data">
                {{ data.value['Description (Malay)'] }}
              </template>
              <template v-slot:DescriptionEnglish="data">
                {{ data.value['Description (English)'] }}
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
                    @click="handleView('activityType', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="View"
                  >
                    <Icon name="material-symbols:visibility" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleEdit('activityType', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Icon name="material-symbols:edit" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                  <button
                    @click="handleDelete('activityType', data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Icon name="material-symbols:delete" class="text-gray-600 dark:text-gray-400" size="20" />
                  </button>
                </div>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ activityTypeList.length }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="handleDownloadPDF('activityType')">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                Download PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleDownloadCSV('activityType')">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                Download CSV
              </rs-button>
              <rs-button variant="primary" @click="handleAdd('activityType')">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
            </div>
          </template>
        </rs-card>

    <!-- Smart Filter Modals -->
    <template v-for="level in ['group', 'subgroup', 'subsiri', 'activityType']" :key="level">
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
            <div class="space-y-4" v-if="level === 'activityType'">
              <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-medium">Status:</label>
                <div class="flex-1 relative">
                  <FormKit
                    v-model="smartFilters.activityType.at_status"
                    type="select"
                    :options="statusOptions"
                    placeholder="Select Status"
                    outer-class="mb-0"
                  />
                  <button
                    v-if="smartFilters.activityType.at_status"
                    type="button"
                    @click="smartFilters.activityType.at_status = ''"
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

    <!-- Add/Edit Modal for Group -->
    <rs-modal
      v-model="showModals.group"
      title="Activity Group"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.group ? 'View Activity Group' : (isEditMode.group ? 'Edit Activity Group' : 'Add Activity Group') }}
          </h4>
          <Icon
            @click="handleCancel('group')"
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
              <label class="w-40 text-xs font-medium">Group Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="groupForm.activity_group_code"
                  type="text"
                  :disabled="isViewMode.group || isEditMode.group"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="groupForm.activity_group_desc"
                  type="text"
                  :disabled="isViewMode.group"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('group')">
            {{ isViewMode.group ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.group" variant="primary" size="sm" @click="handleSave('group')">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Modal for Subgroup -->
    <rs-modal
      v-model="showModals.subgroup"
      title="Activity Subgroup"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.subgroup ? 'View Activity Subgroup' : (isEditMode.subgroup ? 'Edit Activity Subgroup' : 'Add Activity Subgroup') }}
          </h4>
          <Icon
            @click="handleCancel('subgroup')"
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
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subgroupForm.activity_group_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subgroupForm.activity_subgroup_code"
                  type="text"
                  :disabled="isViewMode.subgroup || isEditMode.subgroup"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subgroupForm.activity_subgroup_desc"
                  type="text"
                  :disabled="isViewMode.subgroup"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('subgroup')">
            {{ isViewMode.subgroup ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.subgroup" variant="primary" size="sm" @click="handleSave('subgroup')">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Modal for Subsiri -->
    <rs-modal
      v-model="showModals.subsiri"
      title="Activity Subsiri"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.subsiri ? 'View Activity Subsiri' : (isEditMode.subsiri ? 'Edit Activity Subsiri' : 'Add Activity Subsiri') }}
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
        <FormKit type="form" :actions="false">
          <div class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.activity_group"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.activity_subgroup_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subsiri Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="subsiriForm.activity_subsiri_code"
                  type="text"
                  :disabled="isViewMode.subsiri || isEditMode.subsiri"
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
                  v-model="subsiriForm.activity_subsiri_desc"
                  type="text"
                  :disabled="isViewMode.subsiri"
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
                  v-model="subsiriForm.activity_subsiri_desc_eng"
                  type="text"
                  :disabled="isViewMode.subsiri"
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
          <rs-button v-if="!isViewMode.subsiri" variant="primary" size="sm" @click="handleSave('subsiri')">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Modal for Activity Type -->
    <rs-modal
      v-model="showModals.activityType"
      title="Activity Type"
      size="lg"
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode.activityType ? 'View Activity Type' : (isEditMode.activityType ? 'Edit Activity Type' : 'Add Activity Type') }}
          </h4>
          <Icon
            @click="handleCancel('activityType')"
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
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityTypeForm.activity_group_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityTypeForm.activity_subgroup_code"
                  type="text"
                  :disabled="true"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subsiri Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="activityTypeForm.activity_subsiri_code"
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
                  v-model="activityTypeForm.at_activity_code"
                  type="text"
                  :disabled="isViewMode.activityType || isEditMode.activityType"
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
                  v-model="activityTypeForm.at_activity_description_bm"
                  type="text"
                  :disabled="isViewMode.activityType"
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
                  v-model="activityTypeForm.at_activity_description_en"
                  type="text"
                  :disabled="isViewMode.activityType"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="activityTypeForm.at_status"
                  type="select"
                  :options="statusOptions"
                  :disabled="isViewMode.activityType"
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
          <rs-button variant="danger" size="sm" @click="handleCancel('activityType')">
            {{ isViewMode.activityType ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode.activityType" variant="primary" size="sm" @click="handleSave('activityType')">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>
    
    <style scoped>
/* Hide default table header since we're using custom header */
.group-table-wrapper :deep(.table-header),
.subgroup-table-wrapper :deep(.table-header),
.subsiri-table-wrapper :deep(.table-header),
.activitytype-table-wrapper :deep(.table-header) {
  display: none;
}

/* Blue column headers */
.group-table-wrapper :deep(th),
.subgroup-table-wrapper :deep(th),
.subsiri-table-wrapper :deep(th),
.activitytype-table-wrapper :deep(th) {
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
    