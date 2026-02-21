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

const pageName = "Activity Code";
const moduleName = "Setup";
const pageBreadcrumbText = "Dashboard > Setup > GL Structure Setup > Activity Code";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Column definitions (4 cascading levels)
const columns = ref([
  { key: 'group', title: 'ACTIVITY GROUP', level: 0 },
  { key: 'subgroup', title: 'ACTIVITY SUBGROUP', level: 1 },
  { key: 'subsiri', title: 'ACTIVITY SUBSIRI', level: 2 },
  { key: 'activityType', title: 'ACTIVITY TYPE', level: 3 },
]);

// Data for each level
const listData = ref({
  group: [],
  subgroup: [],
  subsiri: [],
  activityType: [],
});

// Loading states
const loading = ref({
  group: false,
  subgroup: false,
  subsiri: false,
  activityType: false,
});

// Selected items for cascade
const selected = ref({
  group: null,
  subgroup: null,
  subsiri: null,
  activityType: null,
});

// Visible columns (group always visible, others appear on selection)
const visibleColumns = computed(() => {
  const visible = ['group'];
  if (selected.value.group) visible.push('subgroup');
  if (selected.value.subgroup) visible.push('subsiri');
  if (selected.value.subsiri) visible.push('activityType');
  return visible;
});

// Search keywords per column
const searchKeywords = ref({
  group: "",
  subgroup: "",
  subsiri: "",
  activityType: "",
});

// Modals
const showModal = ref(false);
const modalLevel = ref('group');
const isEditMode = ref(false);
const isViewMode = ref(false);

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Form data per level type
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

// Column browser container ref for auto-scroll
const columnBrowser = ref(null);

// Resizable column widths
const columnWidths = ref({
  group: 260,
  subgroup: 280,
  subsiri: 280,
  activityType: 320,
});

const resizing = ref({ active: false, colKey: '', startX: 0, startWidth: 0 });

const startResize = (e, colKey) => {
  e.preventDefault();
  e.stopPropagation();
  resizing.value = {
    active: true,
    colKey,
    startX: e.clientX,
    startWidth: columnWidths.value[colKey],
  };

  const onMouseMove = (moveEvent) => {
    if (!resizing.value.active) return;
    const diff = moveEvent.clientX - resizing.value.startX;
    const newWidth = Math.max(120, Math.min(600, resizing.value.startWidth + diff));
    columnWidths.value[resizing.value.colKey] = newWidth;
  };

  const onMouseUp = () => {
    resizing.value.active = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

// Helper: get display label for an item
const getItemLabel = (levelKey, item) => {
  if (levelKey === 'group') return item.activity_group_code || item.Group || '';
  if (levelKey === 'subgroup') return item.activity_subgroup_code || item['Code Activity'] || '';
  if (levelKey === 'subsiri') return item.activity_subsiri_code || item['Code Activity'] || '';
  if (levelKey === 'activityType') return item.at_activity_code || item['Activity Code'] || '';
  return '';
};

const getItemDescription = (levelKey, item) => {
  if (levelKey === 'group') return item.activity_group_desc || item.Description || '';
  if (levelKey === 'subgroup') return item.activity_subgroup_desc || item.Description || '';
  if (levelKey === 'subsiri') return item.activity_subsiri_desc || item['Description (Malay)'] || '';
  if (levelKey === 'activityType') return item.at_activity_description_bm || item['Description (Malay)'] || '';
  return '';
};

const getItemStatus = (levelKey, item) => {
  if (levelKey === 'activityType') return item.at_status || item.Status || '';
  return ''; // Group, subgroup, subsiri don't have status in the API
};

const isItemSelected = (levelKey, item) => {
  const sel = selected.value[levelKey];
  if (!sel) return false;
  if (levelKey === 'group') return sel.activity_group_code === item.activity_group_code;
  if (levelKey === 'subgroup') return sel.activity_subgroup_code === item.activity_subgroup_code;
  if (levelKey === 'subsiri') return sel.activity_subsiri_code === item.activity_subsiri_code;
  if (levelKey === 'activityType') return sel.at_activity_id === item.at_activity_id;
  return false;
};

// Fetch Activity Group Level 0
const fetchGroup = async () => {
  try {
    loading.value.group = true;
    const query = { level: 0 };
    if (searchKeywords.value.group) query.search = searchKeywords.value.group;

    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value.group = (data.value.data || []).map((item) => ({
        ...item,
        activity_group_code: item.activity_group_code || item.Group || '',
        activity_group_desc: item.activity_group_desc || item.Description || '',
      }));
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
  } finally {
    loading.value.group = false;
  }
};

// Fetch Activity Subgroup Level 1
const fetchSubgroup = async () => {
  if (!selected.value.group) {
    listData.value.subgroup = [];
    return;
  }
  try {
    loading.value.subgroup = true;
    const query = {
      level: 1,
      activity_group_code: selected.value.group.activity_group_code,
    };
    if (searchKeywords.value.subgroup) query.search = searchKeywords.value.subgroup;

    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value.subgroup = (data.value.data || []).map((item) => ({
        ...item,
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code || item['Code Activity'] || '',
        activity_subgroup_desc: item.activity_subgroup_desc || item.Description || '',
      }));
    }
  } catch (error) {
    console.error("Error fetching subgroups:", error);
  } finally {
    loading.value.subgroup = false;
  }
};

// Fetch Activity Subsiri Level 2
const fetchSubsiri = async () => {
  if (!selected.value.subgroup) {
    listData.value.subsiri = [];
    return;
  }
  try {
    loading.value.subsiri = true;
    const query = {
      level: 2,
      activity_group_code: selected.value.group.activity_group_code,
      activity_subgroup_code: selected.value.subgroup.activity_subgroup_code,
    };
    if (searchKeywords.value.subsiri) query.search = searchKeywords.value.subsiri;

    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value.subsiri = (data.value.data || []).map((item) => ({
        ...item,
        activity_group: item.activity_group,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code || item['Code Activity'] || '',
        activity_subsiri_desc: item.activity_subsiri_desc || item['Description (Malay)'] || '',
        activity_subsiri_desc_eng: item.activity_subsiri_desc_eng || item['Description (English)'] || '',
      }));
    }
  } catch (error) {
    console.error("Error fetching subsiris:", error);
  } finally {
    loading.value.subsiri = false;
  }
};

// Fetch Activity Type Level 3
const fetchActivityType = async () => {
  if (!selected.value.subsiri) {
    listData.value.activityType = [];
    return;
  }
  try {
    loading.value.activityType = true;
    const query = {
      level: 3,
      activity_group_code: selected.value.group.activity_group_code,
      activity_subgroup_code: selected.value.subgroup.activity_subgroup_code,
      activity_subsiri_code: selected.value.subsiri.activity_subsiri_code,
    };
    if (searchKeywords.value.activityType) query.search = searchKeywords.value.activityType;

    const { data } = await useFetch("/api/setup/activity-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value.activityType = (data.value.data || []).map((item) => {
        // Normalize status: API may return '1'/1/'ACTIVE' or '0'/0/'INACTIVE'
        const rawStatus = item.at_status ?? item.Status ?? '';
        const normalizedStatus = (String(rawStatus) === '1' || String(rawStatus).toUpperCase() === 'ACTIVE') ? 'ACTIVE' : 
                                 (String(rawStatus) === '0' || String(rawStatus).toUpperCase() === 'INACTIVE') ? 'INACTIVE' : 
                                 String(rawStatus);
        return {
          ...item,
          at_activity_id: item.at_activity_id,
          activity_group_code: item.activity_group_code,
          activity_subgroup_code: item.activity_subgroup_code,
          activity_subsiri_code: item.activity_subsiri_code,
          at_activity_code: item.at_activity_code || item['Activity Code'] || '',
          at_activity_description_bm: item.at_activity_description_bm || item['Description (Malay)'] || '',
          at_activity_description_en: item.at_activity_description_en || item['Description (English)'] || '',
          at_status: normalizedStatus,
        };
      });
    }
  } catch (error) {
    console.error("Error fetching activity types:", error);
  } finally {
    loading.value.activityType = false;
  }
};

// Auto-scroll to the right when a new column appears
const scrollToEnd = () => {
  nextTick(() => {
    if (columnBrowser.value) {
      columnBrowser.value.scrollTo({
        left: columnBrowser.value.scrollWidth,
        behavior: 'smooth',
      });
    }
  });
};

// Clear downstream selections and data
const clearDownstream = (fromLevel) => {
  const order = ['group', 'subgroup', 'subsiri', 'activityType'];
  const idx = order.indexOf(fromLevel);
  for (let i = idx + 1; i < order.length; i++) {
    selected.value[order[i]] = null;
    listData.value[order[i]] = [];
  }
};

// Handle item click in a column
const handleItemClick = (levelKey, item) => {
  // If clicking already selected item, deselect
  if (isItemSelected(levelKey, item)) {
    selected.value[levelKey] = null;
    clearDownstream(levelKey);
    return;
  }

  selected.value[levelKey] = item;
  clearDownstream(levelKey);

  // Fetch next level
  if (levelKey === 'group') fetchSubgroup();
  else if (levelKey === 'subgroup') fetchSubsiri();
  else if (levelKey === 'subsiri') fetchActivityType();

  scrollToEnd();
};

// Watch search keywords to refetch
watch(() => searchKeywords.value.group, () => fetchGroup());
watch(() => searchKeywords.value.subgroup, () => { if (selected.value.group) fetchSubgroup(); });
watch(() => searchKeywords.value.subsiri, () => { if (selected.value.subgroup) fetchSubsiri(); });
watch(() => searchKeywords.value.activityType, () => { if (selected.value.subsiri) fetchActivityType(); });

// Modal title
const modalTitle = computed(() => {
  const levelNames = {
    group: 'Activity Group',
    subgroup: 'Activity Subgroup',
    subsiri: 'Activity Subsiri',
    activityType: 'Activity Type',
  };
  const name = levelNames[modalLevel.value] || '';
  if (isViewMode.value) return `View ${name}`;
  if (isEditMode.value) return `Edit ${name}`;
  return `Add ${name}`;
});

// Add handler
const handleAdd = (levelKey) => {
  isEditMode.value = false;
  isViewMode.value = false;
  modalLevel.value = levelKey;

  if (levelKey === 'group') {
    groupForm.value = { activity_group_code: "", activity_group_desc: "" };
  } else if (levelKey === 'subgroup') {
    subgroupForm.value = {
      activity_group_code: selected.value.group?.activity_group_code || "",
      activity_subgroup_code: "",
      activity_subgroup_desc: "",
    };
  } else if (levelKey === 'subsiri') {
    subsiriForm.value = {
      activity_group: selected.value.group?.activity_group_code || "",
      activity_subgroup_code: selected.value.subgroup?.activity_subgroup_code || "",
      activity_subsiri_code: "",
      activity_subsiri_desc: "",
      activity_subsiri_desc_eng: "",
    };
  } else if (levelKey === 'activityType') {
    activityTypeForm.value = {
      at_activity_id: null,
      activity_group_code: selected.value.group?.activity_group_code || "",
      activity_subgroup_code: selected.value.subgroup?.activity_subgroup_code || "",
      activity_subsiri_code: selected.value.subsiri?.activity_subsiri_code || "",
      at_activity_code: "",
      at_activity_description_bm: "",
      at_activity_description_en: "",
      at_status: "ACTIVE",
    };
  }
  showModal.value = true;
};

// Edit handler
const handleEdit = (levelKey, item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  modalLevel.value = levelKey;

  if (levelKey === 'group') {
    groupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_group_desc: item.activity_group_desc,
    };
  } else if (levelKey === 'subgroup') {
    subgroupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subgroup_desc: item.activity_subgroup_desc,
    };
  } else if (levelKey === 'subsiri') {
    subsiriForm.value = {
      activity_group: item.activity_group,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      activity_subsiri_desc: item.activity_subsiri_desc,
      activity_subsiri_desc_eng: item.activity_subsiri_desc_eng || "",
    };
  } else if (levelKey === 'activityType') {
    activityTypeForm.value = {
      at_activity_id: item.at_activity_id,
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      at_activity_code: item.at_activity_code,
      at_activity_description_bm: item.at_activity_description_bm || "",
      at_activity_description_en: item.at_activity_description_en || "",
      at_status: item.at_status || 'ACTIVE',
    };
  }
  showModal.value = true;
};

// View handler
const handleView = (levelKey, item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  modalLevel.value = levelKey;

  if (levelKey === 'group') {
    groupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_group_desc: item.activity_group_desc,
    };
  } else if (levelKey === 'subgroup') {
    subgroupForm.value = {
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subgroup_desc: item.activity_subgroup_desc,
    };
  } else if (levelKey === 'subsiri') {
    subsiriForm.value = {
      activity_group: item.activity_group,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      activity_subsiri_desc: item.activity_subsiri_desc,
      activity_subsiri_desc_eng: item.activity_subsiri_desc_eng || "",
    };
  } else if (levelKey === 'activityType') {
    activityTypeForm.value = {
      at_activity_id: item.at_activity_id,
      activity_group_code: item.activity_group_code,
      activity_subgroup_code: item.activity_subgroup_code,
      activity_subsiri_code: item.activity_subsiri_code,
      at_activity_code: item.at_activity_code,
      at_activity_description_bm: item.at_activity_description_bm || "",
      at_activity_description_en: item.at_activity_description_en || "",
      at_status: item.at_status || 'ACTIVE',
    };
  }
  showModal.value = true;
};

// Save handler
const handleSave = async () => {
  const level = modalLevel.value;

  // Validate required fields
  if (level === 'group') {
    if (!groupForm.value.activity_group_code || !groupForm.value.activity_group_desc) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  } else if (level === 'subgroup') {
    if (!subgroupForm.value.activity_group_code || !subgroupForm.value.activity_subgroup_code || !subgroupForm.value.activity_subgroup_desc) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  } else if (level === 'subsiri') {
    if (!subsiriForm.value.activity_group || !subsiriForm.value.activity_subgroup_code || !subsiriForm.value.activity_subsiri_code || !subsiriForm.value.activity_subsiri_desc) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  } else if (level === 'activityType') {
    if (!activityTypeForm.value.at_activity_code || !activityTypeForm.value.at_activity_description_bm || !activityTypeForm.value.at_status) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  }

  try {
    loading.value[level] = true;

    if (level === 'group') {
      const url = isEditMode.value && groupForm.value.activity_group_code
        ? `/api/setup/activity-code/group/${groupForm.value.activity_group_code}`
        : "/api/setup/activity-code/group";
      const method = isEditMode.value ? "PUT" : "POST";

      const { data } = await useFetch(url, {
        method,
        body: {
          activity_group_code: groupForm.value.activity_group_code,
          activity_group_desc: groupForm.value.activity_group_desc,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200 || data.value?.statusCode === 201) {
        const msg = isEditMode.value ? "Activity group updated successfully" : "Activity group created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Activity group updated");
        else await logCreateSuccess(msg, "Activity group created");
        showModal.value = false;
        await fetchGroup();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to save", icon: "error" });
      }
    } else if (level === 'subgroup') {
      const url = isEditMode.value && subgroupForm.value.activity_subgroup_code
        ? `/api/setup/activity-code/subgroup/${subgroupForm.value.activity_subgroup_code}`
        : "/api/setup/activity-code/subgroup";
      const method = isEditMode.value ? "PUT" : "POST";

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
        const msg = isEditMode.value ? "Activity subgroup updated successfully" : "Activity subgroup created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Activity subgroup updated");
        else await logCreateSuccess(msg, "Activity subgroup created");
        showModal.value = false;
        await fetchSubgroup();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to save", icon: "error" });
      }
    } else if (level === 'subsiri') {
      const url = isEditMode.value && subsiriForm.value.activity_subsiri_code
        ? `/api/setup/activity-code/subsiri/${subsiriForm.value.activity_subsiri_code}`
        : "/api/setup/activity-code/subsiri";
      const method = isEditMode.value ? "PUT" : "POST";

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
        const msg = isEditMode.value ? "Activity subsiri updated successfully" : "Activity subsiri created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Activity subsiri updated");
        else await logCreateSuccess(msg, "Activity subsiri created");
        showModal.value = false;
        await fetchSubsiri();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to save", icon: "error" });
      }
    } else if (level === 'activityType') {
      const url = isEditMode.value && activityTypeForm.value.at_activity_id
        ? `/api/setup/activity-code/activity-type/${activityTypeForm.value.at_activity_id}`
        : "/api/setup/activity-code/activity-type";
      const method = isEditMode.value ? "PUT" : "POST";

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
        const msg = isEditMode.value ? "Activity type updated successfully" : "Activity type created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Activity type updated");
        else await logCreateSuccess(msg, "Activity type created");
        showModal.value = false;
        await fetchActivityType();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to save", icon: "error" });
      }
    }
  } catch (error) {
    console.error("Error saving:", error);
    $swal.fire({ title: "Error", text: "An error occurred while saving", icon: "error" });
  } finally {
    loading.value[level] = false;
  }
};

// Cancel modal
const handleCancel = () => {
  showModal.value = false;
  isViewMode.value = false;
  isEditMode.value = false;
};

// Delete handler
const handleDelete = async (levelKey, item) => {
  const messageText = "Are you sure? Do you want to delete this record?";
  const logId = await logDeleteConfirmationPrompt(messageText);

  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this record?",
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
      loading.value[levelKey] = true;
      let url = "";

      if (levelKey === 'group') {
        url = `/api/setup/activity-code/group/${item.activity_group_code}`;
      } else if (levelKey === 'subgroup') {
        url = `/api/setup/activity-code/subgroup/${item.activity_subgroup_code}?activity_group_code=${item.activity_group_code}`;
      } else if (levelKey === 'subsiri') {
        url = `/api/setup/activity-code/subsiri/${item.activity_subsiri_code}?activity_group=${item.activity_group}&activity_subgroup_code=${item.activity_subgroup_code}`;
      } else if (levelKey === 'activityType') {
        url = `/api/setup/activity-code/activity-type/${item.at_activity_id}`;
      }

      const { data } = await useFetch(url, { method: "DELETE", initialCache: false });

      if (data.value?.statusCode === 200) {
        $swal.fire({ title: "Deleted!", text: "Record has been deleted.", icon: "success", timer: 2000, showConfirmButton: false });
        const fetchMap = { group: fetchGroup, subgroup: fetchSubgroup, subsiri: fetchSubsiri, activityType: fetchActivityType };
        if (fetchMap[levelKey]) await fetchMap[levelKey]();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to delete", icon: "error" });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      $swal.fire({ title: "Error", text: "An error occurred while deleting", icon: "error" });
    } finally {
      loading.value[levelKey] = false;
    }
  }
};

// Breadcrumb path showing current selection chain
const selectionPath = computed(() => {
  const parts = [];
  if (selected.value.group) parts.push({ key: 'group', label: selected.value.group.activity_group_code, desc: selected.value.group.activity_group_desc });
  if (selected.value.subgroup) parts.push({ key: 'subgroup', label: selected.value.subgroup.activity_subgroup_code, desc: selected.value.subgroup.activity_subgroup_desc });
  if (selected.value.subsiri) parts.push({ key: 'subsiri', label: selected.value.subsiri.activity_subsiri_code, desc: selected.value.subsiri.activity_subsiri_desc });
  if (selected.value.activityType) parts.push({ key: 'activityType', label: selected.value.activityType.at_activity_code, desc: selected.value.activityType.at_activity_description_bm });
  return parts;
});

// Action menu (3-dot menu and right-click context menu)
const actionMenu = ref({ show: false, x: 0, y: 0, levelKey: '', item: null });

const toggleActionMenu = (e, levelKey, item) => {
  e.stopPropagation();
  if (actionMenu.value.show && actionMenu.value.item === item) {
    actionMenu.value.show = false;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  actionMenu.value = { show: true, x: rect.right + 4, y: rect.top, levelKey, item };

  nextTick(() => {
    const menuWidth = 160;
    const menuHeight = 120;
    if (actionMenu.value.x + menuWidth > window.innerWidth) {
      actionMenu.value.x = rect.left - menuWidth - 4;
    }
    if (actionMenu.value.y + menuHeight > window.innerHeight) {
      actionMenu.value.y = window.innerHeight - menuHeight - 8;
    }
  });
};

const handleContextMenu = (e, levelKey, item) => {
  e.preventDefault();
  actionMenu.value = { show: true, x: e.clientX, y: e.clientY, levelKey, item };
};

const closeActionMenu = () => {
  actionMenu.value.show = false;
};

// Close menu on click anywhere
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeActionMenu);
}

// Column download menu
const downloadMenu = ref({ show: false, x: 0, y: 0, colKey: '' });

const toggleDownloadMenu = (e, colKey) => {
  e.stopPropagation();
  if (downloadMenu.value.show && downloadMenu.value.colKey === colKey) {
    downloadMenu.value.show = false;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  downloadMenu.value = { show: true, x: rect.left, y: rect.bottom + 4, colKey };
  nextTick(() => {
    const menuWidth = 180;
    const menuHeight = 130;
    if (downloadMenu.value.x + menuWidth > window.innerWidth) {
      downloadMenu.value.x = window.innerWidth - menuWidth - 8;
    }
    if (downloadMenu.value.y + menuHeight > window.innerHeight) {
      downloadMenu.value.y = rect.top - menuHeight - 4;
    }
  });
};

const closeDownloadMenu = () => {
  downloadMenu.value.show = false;
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDownloadMenu);
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', closeActionMenu);
    window.removeEventListener('click', closeDownloadMenu);
  }
});

// Helper: get column title
const getColumnTitle = (colKey) => columns.value.find(c => c.key === colKey)?.title || colKey;

// Helper: get export data for a column
const getExportData = (colKey) => {
  const items = listData.value[colKey] || [];
  if (colKey === 'group') {
    return items.map((item, idx) => ({
      no: idx + 1,
      'Group Code': item.activity_group_code || '',
      'Description': item.activity_group_desc || '',
    }));
  }
  if (colKey === 'subgroup') {
    return items.map((item, idx) => ({
      no: idx + 1,
      'Group Code': item.activity_group_code || '',
      'Subgroup Code': item.activity_subgroup_code || '',
      'Description': item.activity_subgroup_desc || '',
    }));
  }
  if (colKey === 'subsiri') {
    return items.map((item, idx) => ({
      no: idx + 1,
      'Subsiri Code': item.activity_subsiri_code || '',
      'Description (Malay)': item.activity_subsiri_desc || '',
      'Description (English)': item.activity_subsiri_desc_eng || '',
    }));
  }
  // activityType
  return items.map((item, idx) => ({
    no: idx + 1,
    'Activity Code': item.at_activity_code || '',
    'Description (Malay)': item.at_activity_description_bm || '',
    'Description (English)': item.at_activity_description_en || '',
    'Status': item.at_status || '',
  }));
};

const getExportColumns = (colKey) => {
  if (colKey === 'group') return ['Group Code', 'Description'];
  if (colKey === 'subgroup') return ['Group Code', 'Subgroup Code', 'Description'];
  if (colKey === 'subsiri') return ['Subsiri Code', 'Description (Malay)', 'Description (English)'];
  return ['Activity Code', 'Description (Malay)', 'Description (English)', 'Status'];
};

// Format datetime helper
const formatExportDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');
  return `Date : ${day}/${month}/${year} ${displayHours}:${minutes}:${seconds} ${ampm}`;
};

// Download PDF
const handleDownloadPDF = async (colKey) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const dataToExport = getExportData(colKey);
    if (dataToExport.length === 0) {
      $swal.fire({ title: "No Data", text: "There is no data to export", icon: "warning" });
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const formattedDateTime = formatExportDateTime();
    const title = getColumnTitle(colKey);

    // Logo
    let logoHeight = 0;
    try {
      const logoUrl = '/img/logo/organization_logo.png';
      const response = await fetch(logoUrl);
      if (response.ok) {
        const blob = await response.blob();
        const logoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read logo'));
          reader.readAsDataURL(blob);
        });
        const img = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('Failed to load image'));
          image.src = logoData;
        });
        const aspectRatio = img.width / img.height;
        logoHeight = 12;
        doc.addImage(logoData, 'PNG', margin, margin, 12 * aspectRatio, 12);
      }
    } catch (e) { logoHeight = 0; }

    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    const dtw = doc.getTextWidth(formattedDateTime);
    doc.text(formattedDateTime, pageWidth - margin - dtw, margin + 8);

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const tw = doc.getTextWidth(title);
    const titleY = margin + (logoHeight > 0 ? logoHeight + 3 : 10);
    doc.text(title, (pageWidth - tw) / 2, titleY);

    const exportColumns = getExportColumns(colKey);
    const tableData = dataToExport.map((item, idx) => {
      const row = [(idx + 1).toString()];
      exportColumns.forEach(col => row.push((item[col] || '').toString()));
      return row;
    });

    autoTable(doc, {
      head: [['No.', ...exportColumns]],
      body: tableData,
      startY: titleY + 8,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2, textColor: [0, 0, 0] },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      bodyStyles: { halign: 'left' },
      columnStyles: { 0: { halign: 'center', cellWidth: 15 } },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const safeName = title.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`${safeName}_${new Date().toISOString().split('T')[0]}.pdf`);
    $swal.fire({ title: "Success", text: "PDF downloaded successfully", icon: "success", timer: 2000, showConfirmButton: false });
  } catch (error) {
    console.error("Error generating PDF:", error);
    $swal.fire({ title: "Error", text: "Failed to generate PDF", icon: "error" });
  }
};

// Download CSV
const handleDownloadCSV = (colKey) => {
  try {
    const dataToExport = getExportData(colKey);
    if (dataToExport.length === 0) {
      $swal.fire({ title: "No Data", text: "There is no data to export", icon: "warning" });
      return;
    }

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const title = getColumnTitle(colKey);
    const exportColumns = getExportColumns(colKey);
    const headers = ['No.', ...exportColumns];

    let csvContent = '';
    csvContent += escapeCSV(formatExportDateTime()) + '\n';
    csvContent += escapeCSV(title) + '\n\n';
    csvContent += headers.map(escapeCSV).join(',') + '\n';

    dataToExport.forEach((item, idx) => {
      const row = [(idx + 1).toString()];
      exportColumns.forEach(col => row.push(item[col] || ''));
      csvContent += row.map(escapeCSV).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    const safeName = title.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `${safeName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    $swal.fire({ title: "Success", text: "CSV downloaded successfully", icon: "success", timer: 2000, showConfirmButton: false });
  } catch (error) {
    console.error("Error generating CSV:", error);
    $swal.fire({ title: "Error", text: "Failed to generate CSV", icon: "error" });
  }
};

// Download Excel
const handleDownloadExcel = async (colKey) => {
  try {
    const ExcelJS = await import('exceljs');
    const dataToExport = getExportData(colKey);
    if (dataToExport.length === 0) {
      $swal.fire({ title: "No Data", text: "There is no data to export", icon: "warning" });
      return;
    }

    const title = getColumnTitle(colKey);
    const exportColumns = getExportColumns(colKey);
    const worksheetData = [];

    worksheetData.push([formatExportDateTime()]);
    worksheetData.push([title]);
    worksheetData.push([]);
    worksheetData.push(['No.', ...exportColumns]);

    const headerRowIndex = 3; // 0-based

    dataToExport.forEach((item, idx) => {
      const row = [(idx + 1).toString()];
      exportColumns.forEach(col => row.push(item[col] || ''));
      worksheetData.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    worksheetData.forEach((row, rowIndex) => {
      const wsRow = worksheet.addRow(row);
      if (rowIndex === headerRowIndex) {
        wsRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
          cell.font = { bold: true };
          cell.alignment = { horizontal: colNumber === 1 ? 'center' : 'left', vertical: 'middle' };
        });
      }
    });

    worksheet.getColumn(1).width = 8;
    exportColumns.forEach((col, index) => {
      worksheet.getColumn(index + 2).width = 25;
    });

    const safeName = title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${safeName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    $swal.fire({ title: "Success", text: "Excel downloaded successfully", icon: "success", timer: 2000, showConfirmButton: false });
  } catch (error) {
    console.error("Error generating Excel:", error);
    if (error.message && (error.message.includes('exceljs') || error.message.includes('Cannot find module'))) {
      $swal.fire({ title: "Package Required", text: "Please install exceljs: npm install exceljs", icon: "warning" });
    } else {
      $swal.fire({ title: "Error", text: "Failed to generate Excel", icon: "error" });
    }
  }
};

// Initialize
onMounted(() => {
  fetchGroup();
});
</script>

<template>
  <div class="space-y-4">
    <LayoutsBreadcrumb />

    <!-- Selection path breadcrumb -->
    <rs-card>
      <template #body>
        <div class="flex items-center gap-1 text-sm min-h-[28px] flex-wrap">
          <span class="text-gray-500 dark:text-gray-400 font-medium">Path:</span>
          <template v-if="selectionPath.length === 0">
            <span class="text-gray-400 dark:text-gray-500 italic">Select an item to begin browsing...</span>
          </template>
          <template v-for="(part, idx) in selectionPath" :key="part.key">
            <span v-if="idx > 0" class="text-gray-400 dark:text-gray-500 mx-1">
              <Icon name="material-symbols:chevron-right" size="16" />
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 cursor-default"
              :title="part.desc"
            >
              {{ part.label }}
            </span>
          </template>
        </div>
      </template>
    </rs-card>

    <!-- Finder-style column browser -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Activity Code Browser</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ visibleColumns.length }} of {{ columns.length }} levels
          </div>
        </div>
      </template>
      <template #body>
        <div
          ref="columnBrowser"
          class="finder-browser flex overflow-x-auto"
        >
          <!-- Each column panel with resize handle -->
          <template v-for="(colKey, colIdx) in visibleColumns" :key="colKey">
          <div
            class="finder-column flex-shrink-0 flex flex-col border-r border-gray-100 dark:border-gray-800"
            :style="{ width: columnWidths[colKey] + 'px' }"
          >
            <!-- Column header -->
            <div class="finder-column-header flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide truncate">
                {{ columns.find(c => c.key === colKey)?.title }}
              </span>
              <div class="flex items-center gap-1">
                <span class="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                  {{ listData[colKey].length }}
                </span>
                <button
                  @click.stop="handleAdd(colKey)"
                  class="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Add new"
                >
                  <Icon name="material-symbols:add" size="16" class="text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  @click.stop="toggleDownloadMenu($event, colKey)"
                  class="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Download"
                >
                  <Icon name="mdi:dots-vertical" size="16" class="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <!-- Column search -->
            <div class="px-2 py-1.5 border-b border-gray-100 dark:border-gray-700">
              <div class="relative">
                <Icon name="material-symbols:search" size="14" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchKeywords[colKey]"
                  type="text"
                  placeholder="Search..."
                  class="w-full pl-7 pr-7 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <button
                  v-if="searchKeywords[colKey]"
                  @click="searchKeywords[colKey] = ''"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon name="material-symbols:close" size="12" class="text-gray-400" />
                </button>
              </div>
            </div>

            <!-- Column items list -->
            <div class="finder-column-body flex-1 overflow-y-auto">
              <!-- Loading -->
              <div v-if="loading[colKey]" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              </div>

              <!-- Empty state -->
              <div v-else-if="listData[colKey].length === 0" class="flex items-center justify-center py-8 px-3">
                <span class="text-xs text-gray-400 dark:text-gray-500 italic">No items found</span>
              </div>

              <!-- Items -->
              <div v-else class="py-0.5">
                <div
                  v-for="(item, idx) in listData[colKey]"
                  :key="idx"
                  @click="handleItemClick(colKey, item)"
                  @contextmenu="handleContextMenu($event, colKey, item)"
                  class="finder-item group flex items-center gap-2 px-3 py-1.5 mx-0.5 rounded cursor-pointer transition-all duration-100"
                  :class="{
                    'bg-primary text-white': isItemSelected(colKey, item),
                    'hover:bg-gray-100 dark:hover:bg-gray-700/50': !isItemSelected(colKey, item),
                  }"
                >
                  <!-- Status dot -->
                  <span
                    class="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-green-400': getItemStatus(colKey, item) === 'ACTIVE' || !getItemStatus(colKey, item),
                      'bg-red-400': getItemStatus(colKey, item) === 'INACTIVE',
                    }"
                  ></span>

                  <!-- Item content -->
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold truncate" :class="{ 'text-white': isItemSelected(colKey, item) }">
                      {{ getItemLabel(colKey, item) }}
                    </div>
                    <div
                      class="text-[10px] truncate leading-tight"
                      :class="{
                        'text-white/70': isItemSelected(colKey, item),
                        'text-gray-500 dark:text-gray-400': !isItemSelected(colKey, item),
                      }"
                    >
                      {{ getItemDescription(colKey, item) }}
                    </div>
                  </div>

                  <!-- 3-dot action menu (visible on hover or selected) -->
                  <button
                    @click.stop="toggleActionMenu($event, colKey, item)"
                    class="flex-shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
                    :class="{
                      'opacity-100': isItemSelected(colKey, item),
                      'opacity-0 group-hover:opacity-100': !isItemSelected(colKey, item),
                    }"
                    title="Actions"
                  >
                    <Icon name="mdi:dots-vertical" size="16" :class="isItemSelected(colKey, item) ? 'text-white/80' : 'text-gray-400'" />
                  </button>

                </div>
              </div>
            </div>
          </div>
          <!-- Resize handle -->
          <div
            class="finder-resize-handle flex-shrink-0 w-[5px] cursor-col-resize relative group/resize"
            @mousedown="startResize($event, colKey)"
          >
            <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-gray-200 dark:bg-gray-700 group-hover/resize:w-[3px] group-hover/resize:bg-primary/40 transition-all"></div>
          </div>
          </template>
        </div>
      </template>
    </rs-card>

    <!-- Action Menu Dropdown (3-dot menu + right-click) -->
    <Teleport to="body">
      <div
        v-if="actionMenu.show"
        class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[150px]"
        :style="{ left: actionMenu.x + 'px', top: actionMenu.y + 'px' }"
      >
        <button
          @click="handleView(actionMenu.levelKey, actionMenu.item); closeActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:visibility" size="15" class="text-gray-500" /> View
        </button>
        <button
          @click="handleEdit(actionMenu.levelKey, actionMenu.item); closeActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:edit" size="15" class="text-gray-500" /> Edit
        </button>
        <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
        <button
          @click="handleDelete(actionMenu.levelKey, actionMenu.item); closeActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <Icon name="material-symbols:delete" size="15" /> Delete
        </button>
      </div>
    </Teleport>

    <!-- Download Menu Dropdown -->
    <Teleport to="body">
      <div
        v-if="downloadMenu.show"
        class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[170px]"
        :style="{ left: downloadMenu.x + 'px', top: downloadMenu.y + 'px' }"
        @click.stop
      >
        <button
          @click="handleDownloadPDF(downloadMenu.colKey); closeDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:picture-as-pdf" size="15" class="text-red-500" /> Download PDF
        </button>
        <button
          @click="handleDownloadCSV(downloadMenu.colKey); closeDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:file-download" size="15" class="text-green-500" /> Download CSV
        </button>
        <button
          @click="handleDownloadExcel(downloadMenu.colKey); closeDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="material-symbols:table-chart" size="15" class="text-blue-500" /> Download Excel
        </button>
      </div>
    </Teleport>

    <!-- Add/Edit/View Modal -->
    <rs-modal
      v-model="showModal"
      :title="modalTitle"
      size="lg"
      dialog-class="activity-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg activity-modal-header">
          <h4 class="text-base font-semibold text-white">{{ modalTitle }}</h4>
          <Icon
            @click="handleCancel"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <!-- Group form -->
          <div v-if="modalLevel === 'group'" class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="groupForm.activity_group_code" type="text" :disabled="isViewMode || isEditMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="groupForm.activity_group_desc" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
          </div>

          <!-- Subgroup form -->
          <div v-else-if="modalLevel === 'subgroup'" class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit v-model="subgroupForm.activity_group_code" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="subgroupForm.activity_subgroup_code" type="text" :disabled="isViewMode || isEditMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="subgroupForm.activity_subgroup_desc" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
          </div>

          <!-- Subsiri form -->
          <div v-else-if="modalLevel === 'subsiri'" class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit v-model="subsiriForm.activity_group" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code:</label>
              <div class="flex-1">
                <FormKit v-model="subsiriForm.activity_subgroup_code" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subsiri Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="subsiriForm.activity_subsiri_code" type="text" :disabled="isViewMode || isEditMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="subsiriForm.activity_subsiri_desc" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit v-model="subsiriForm.activity_subsiri_desc_eng" type="text" :disabled="isViewMode" outer-class="mb-0" />
              </div>
            </div>
          </div>

          <!-- Activity Type form -->
          <div v-else-if="modalLevel === 'activityType'" class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group Code:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.activity_group_code" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subgroup Code:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.activity_subgroup_code" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Subsiri Code:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.activity_subsiri_code" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Activity Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.at_activity_code" type="text" :disabled="isViewMode || isEditMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.at_activity_description_bm" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.at_activity_description_en" type="text" :disabled="isViewMode" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityTypeForm.at_status" type="select" :options="statusOptions" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancel">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSave">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Finder browser container */
.finder-browser {
  min-height: 500px;
  max-height: calc(100vh - 280px);
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  background: white;
}

.dark .finder-browser {
  border-color: rgb(55 65 81);
  background: rgb(17 24 39);
}

/* Column styling */
.finder-column {
  min-height: 100%;
}

.finder-column-body {
  scrollbar-width: thin;
  scrollbar-color: rgb(209 213 219) transparent;
}

.finder-column-body::-webkit-scrollbar {
  width: 4px;
}

.finder-column-body::-webkit-scrollbar-track {
  background: transparent;
}

.finder-column-body::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 2px;
}

.dark .finder-column-body::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
}

/* Resize handle */
.finder-resize-handle {
  z-index: 10;
}

.finder-resize-handle:hover {
  background: rgba(59, 130, 246, 0.05);
}

.finder-resize-handle:active {
  background: rgba(59, 130, 246, 0.1);
}

/* Item hover animation */
.finder-item {
  transition: background-color 0.1s ease;
}
</style>

<style>
/* Modal styles (non-scoped because modal is teleported to body) */
.activity-modal-custom {
  width: 600px !important;
}

.activity-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.activity-modal-custom .activity-modal-header {
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
}

.activity-modal-custom .modal-header > *:not(.activity-modal-header) {
  display: none !important;
}

.activity-modal-custom .modal-header > .activity-modal-header {
  display: flex !important;
}
</style>
