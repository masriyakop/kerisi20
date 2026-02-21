<script setup>
definePageMeta({
  title: "Account Code v2",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setup", path: "/setup" },
    { name: "GL Structure Setup", path: "/glstructure" },
    { name: "Account Code v2", path: "/setup/glstructure/account-code-v2" },
  ],
});

const { $swal } = useNuxtApp();

const pageName = "Account Code v2";
const moduleName = "Setup";
const pageBreadcrumbText = "Dashboard > Setup > GL Structure Setup > Account Code v2";
const { logDeleteConfirmationPrompt, updateMessageLogAction, logCreateSuccess, logUpdateSuccess } = useMessageLog({
  pageName,
  moduleName,
  pageBreadcrumbText,
});

// Column definitions
const columns = ref([
  { key: 'activity', title: 'ACCOUNT ACTIVITY', level: 0, queryKey: 'dt_accountactvty' },
  { key: 'class', title: 'ACCOUNT CLASS', level: 1, queryKey: 'level_1' },
  { key: 'subClass', title: 'ACCOUNT SUB-CLASS', level: 2, queryKey: 'level2' },
  { key: 'siri', title: 'ACCOUNT SIRI', level: 3, queryKey: 'level3' },
  { key: 'subSiri', title: 'ACCOUNT SUB-SIRI', level: 4, queryKey: 'level4' },
  { key: 'accountCode', title: 'ACCOUNT CODE', level: 5, queryKey: 'level5' },
]);

// Data for each level
const listData = ref({
  activity: [],
  class: [],
  subClass: [],
  siri: [],
  subSiri: [],
  accountCode: [],
});

// Loading states
const loading = ref({
  activity: false,
  class: false,
  subClass: false,
  siri: false,
  subSiri: false,
  accountCode: false,
});

// Selected items for cascade
const selected = ref({
  activity: null,
  class: null,
  subClass: null,
  siri: null,
  subSiri: null,
  accountCode: null,
});

// Visible columns (activity always visible, others appear on selection)
const visibleColumns = computed(() => {
  const visible = ['activity'];
  if (selected.value.activity) visible.push('class');
  if (selected.value.class) visible.push('subClass');
  if (selected.value.subClass) visible.push('siri');
  if (selected.value.siri) visible.push('subSiri');
  if (selected.value.subSiri) visible.push('accountCode');
  return visible;
});

// Search keywords per column
const searchKeywords = ref({
  activity: "",
  class: "",
  subClass: "",
  siri: "",
  subSiri: "",
  accountCode: "",
});

// Modals
const showModal = ref(false);
const modalLevel = ref('activity');
const isEditMode = ref(false);
const isViewMode = ref(false);

// Status options
const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Form data
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

// Column browser container ref for auto-scroll
const columnBrowser = ref(null);

// Resizable column widths
const columnWidths = ref({
  activity: 156,
  class: 280,
  subClass: 280,
  siri: 280,
  subSiri: 280,
  accountCode: 280,
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
  if (levelKey === 'activity') {
    return item.lde_value;
  }
  return item.acm_acct_code || item['Account Code'] || '';
};

const getItemDescription = (levelKey, item) => {
  if (levelKey === 'activity') {
    return item.lde_description || '';
  }
  return item.acm_acct_desc || item['Description (Malay)'] || '';
};

const getItemStatus = (levelKey, item) => {
  if (levelKey === 'activity') {
    return item.lde_status || '';
  }
  return item.acm_acct_status || item['Status'] || '';
};

const isItemSelected = (levelKey, item) => {
  const sel = selected.value[levelKey];
  if (!sel) return false;
  if (levelKey === 'activity') {
    return sel.lde_value === item.lde_value;
  }
  return sel.acm_acct_code === item.acm_acct_code;
};

// Fetch Account Activity (Level 0)
const fetchActivity = async () => {
  try {
    loading.value.activity = true;
    const query = { level: 0, dt_accountactvty: 1 };
    if (searchKeywords.value.activity) {
      query.search = searchKeywords.value.activity;
    }

    const { data, error } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value.activity = data.value.data || [];
    }
    if (error.value) {
      console.error("Fetch error:", error.value);
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
  } finally {
    loading.value.activity = false;
  }
};

// Generic fetch for levels 1-5
const fetchLevel = async (levelKey, level, queryKeyName, parentValue, activityValue) => {
  try {
    loading.value[levelKey] = true;
    const query = { level };
    query[queryKeyName] = 1;

    if (level === 1) {
      query.activity = activityValue;
    } else {
      query.parent = parentValue;
    }

    if (searchKeywords.value[levelKey]) {
      query.search = searchKeywords.value[levelKey];
    }

    const { data } = await useFetch("/api/setup/account-code", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      listData.value[levelKey] = (data.value.data || []).map((item) => ({
        no: item.no,
        'Account Code': item.acm_acct_code || '',
        'Description (Malay)': item.acm_acct_desc || '',
        'Description (English)': item.acm_acct_desc_eng || '',
        'Activity': item.acm_acct_activity || '',
        'Group': item.acm_acct_group || '',
        'Status': item.acm_acct_status || '',
        'Date Created': item.datecreate || '',
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
    } else {
      listData.value[levelKey] = [];
    }
  } catch (error) {
    console.error(`Error fetching ${levelKey}:`, error);
    listData.value[levelKey] = [];
  } finally {
    loading.value[levelKey] = false;
  }
};

const fetchClass = () => fetchLevel('class', 1, 'level_1', null, selected.value.activity?.lde_value);
const fetchSubClass = () => fetchLevel('subClass', 2, 'level2', selected.value.class?.acm_acct_code);
const fetchSiri = () => fetchLevel('siri', 3, 'level3', selected.value.subClass?.acm_acct_code);
const fetchSubSiri = () => fetchLevel('subSiri', 4, 'level4', selected.value.siri?.acm_acct_code);
const fetchAccountCode = () => fetchLevel('accountCode', 5, 'level5', selected.value.subSiri?.acm_acct_code);

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
  const order = ['activity', 'class', 'subClass', 'siri', 'subSiri', 'accountCode'];
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
  if (levelKey === 'activity') fetchClass();
  else if (levelKey === 'class') fetchSubClass();
  else if (levelKey === 'subClass') fetchSiri();
  else if (levelKey === 'siri') fetchSubSiri();
  else if (levelKey === 'subSiri') fetchAccountCode();

  scrollToEnd();
};

// Watch search keywords to refetch
watch(() => searchKeywords.value.activity, () => fetchActivity());
watch(() => searchKeywords.value.class, () => { if (selected.value.activity) fetchClass(); });
watch(() => searchKeywords.value.subClass, () => { if (selected.value.class) fetchSubClass(); });
watch(() => searchKeywords.value.siri, () => { if (selected.value.subClass) fetchSiri(); });
watch(() => searchKeywords.value.subSiri, () => { if (selected.value.siri) fetchSubSiri(); });
watch(() => searchKeywords.value.accountCode, () => { if (selected.value.subSiri) fetchAccountCode(); });

// Modal title
const modalTitle = computed(() => {
  const levelNames = {
    activity: 'Account Activity',
    class: 'Account Class',
    subClass: 'Account Sub-Class',
    siri: 'Account Siri',
    subSiri: 'Account Sub-Siri',
    accountCode: 'Account Code',
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

  if (levelKey === 'activity') {
    activityForm.value = { lde_id: null, lde_value: "", lde_description: "", lde_description2: "", lde_status: "ACTIVE" };
  } else {
    accountForm.value = {
      acm_acct_code: "",
      acm_acct_desc: "",
      acm_acct_desc_eng: "",
      acm_acct_activity: levelKey === 'class' ? (selected.value.activity?.lde_value || "") : "",
      acm_acct_group: "",
      acm_acct_status: "ACTIVE",
      acm_acct_level: levelKey === 'class' ? "1" : levelKey === 'subClass' ? "2" : levelKey === 'siri' ? "3" : levelKey === 'subSiri' ? "4" : "5",
      acm_acct_parent: levelKey === 'class' ? "" :
                        levelKey === 'subClass' ? (selected.value.class?.acm_acct_code || "") :
                        levelKey === 'siri' ? (selected.value.subClass?.acm_acct_code || "") :
                        levelKey === 'subSiri' ? (selected.value.siri?.acm_acct_code || "") :
                        (selected.value.subSiri?.acm_acct_code || ""),
    };
  }
  showModal.value = true;
};

// Edit handler
const handleEdit = (levelKey, item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  modalLevel.value = levelKey;

  if (levelKey === 'activity') {
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
  showModal.value = true;
};

// View handler
const handleView = (levelKey, item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  modalLevel.value = levelKey;

  if (levelKey === 'activity') {
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
  showModal.value = true;
};

// Save handler
const handleSave = async () => {
  const level = modalLevel.value;

  if (level === 'activity') {
    if (!activityForm.value.lde_value || !activityForm.value.lde_description || !activityForm.value.lde_status) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  } else {
    if (!accountForm.value.acm_acct_code || !accountForm.value.acm_acct_desc || !accountForm.value.acm_acct_status) {
      $swal.fire({ title: "Validation Error", text: "Please fill in all required fields", icon: "warning" });
      return;
    }
  }

  try {
    loading.value[level] = true;

    if (level === 'activity') {
      const url = isEditMode.value && activityForm.value.lde_id
        ? `/api/setup/account-code/activity/${activityForm.value.lde_id}`
        : "/api/setup/account-code/activity";
      const method = isEditMode.value ? "PUT" : "POST";

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
        const msg = isEditMode.value ? "Account activity updated successfully" : "Account activity created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Account activity updated");
        else await logCreateSuccess(msg, "Account activity created");
        showModal.value = false;
        await fetchActivity();
      } else {
        $swal.fire({ title: "Error", text: data.value?.message || "Failed to save", icon: "error" });
      }
    } else {
      const url = isEditMode.value && accountForm.value.acm_acct_code
        ? `/api/setup/account-code/${accountForm.value.acm_acct_code}`
        : "/api/setup/account-code";
      const method = isEditMode.value ? "PUT" : "POST";

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
        const msg = isEditMode.value ? "Account updated successfully" : "Account created successfully";
        $swal.fire({ title: "Success", text: msg, icon: "success", timer: 2000, showConfirmButton: false });
        if (isEditMode.value) await logUpdateSuccess(msg, "Account updated");
        else await logCreateSuccess(msg, "Account created");
        showModal.value = false;

        // Refetch the appropriate level
        const fetchMap = { class: fetchClass, subClass: fetchSubClass, siri: fetchSiri, subSiri: fetchSubSiri, accountCode: fetchAccountCode };
        if (fetchMap[level]) await fetchMap[level]();
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
      const url = levelKey === 'activity'
        ? `/api/setup/account-code/activity/${item.lde_id}`
        : `/api/setup/account-code/${item.acm_acct_code}`;

      const { data } = await useFetch(url, { method: "DELETE", initialCache: false });

      if (data.value?.statusCode === 200) {
        $swal.fire({ title: "Deleted!", text: "Record has been deleted.", icon: "success", timer: 2000, showConfirmButton: false });
        const fetchMap = { activity: fetchActivity, class: fetchClass, subClass: fetchSubClass, siri: fetchSiri, subSiri: fetchSubSiri, accountCode: fetchAccountCode };
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
  if (selected.value.activity) parts.push({ key: 'activity', label: selected.value.activity.lde_value, desc: selected.value.activity.lde_description });
  if (selected.value.class) parts.push({ key: 'class', label: selected.value.class.acm_acct_code, desc: selected.value.class.acm_acct_desc });
  if (selected.value.subClass) parts.push({ key: 'subClass', label: selected.value.subClass.acm_acct_code, desc: selected.value.subClass.acm_acct_desc });
  if (selected.value.siri) parts.push({ key: 'siri', label: selected.value.siri.acm_acct_code, desc: selected.value.siri.acm_acct_desc });
  if (selected.value.subSiri) parts.push({ key: 'subSiri', label: selected.value.subSiri.acm_acct_code, desc: selected.value.subSiri.acm_acct_desc });
  if (selected.value.accountCode) parts.push({ key: 'accountCode', label: selected.value.accountCode.acm_acct_code, desc: selected.value.accountCode.acm_acct_desc });
  return parts;
});

// Action menu (3-dot menu and right-click context menu)
const actionMenu = ref({ show: false, x: 0, y: 0, levelKey: '', item: null });

const toggleActionMenu = (e, levelKey, item) => {
  e.stopPropagation();
  // If clicking the same item's menu, toggle off
  if (actionMenu.value.show && actionMenu.value.item === item) {
    actionMenu.value.show = false;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  actionMenu.value = { show: true, x: rect.right + 4, y: rect.top, levelKey, item };

  // Adjust if menu goes off-screen
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

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', closeActionMenu);
    window.removeEventListener('click', closeDownloadMenu);
  }
});

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

// Close download menu on click
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDownloadMenu);
}

// Helper: get column title
const getColumnTitle = (colKey) => columns.value.find(c => c.key === colKey)?.title || colKey;

// Helper: get export data for a column
const getExportData = (colKey) => {
  const items = listData.value[colKey] || [];
  if (colKey === 'activity') {
    return items.map((item, idx) => ({
      no: idx + 1,
      'Code': item.lde_value || '',
      'Description (Malay)': item.lde_description || '',
      'Description (English)': item.lde_description2 || '',
      'Status': item.lde_status || '',
    }));
  }
  return items.map((item, idx) => ({
    no: idx + 1,
    'Account Code': item.acm_acct_code || item['Account Code'] || '',
    'Description (Malay)': item.acm_acct_desc || item['Description (Malay)'] || '',
    'Description (English)': item.acm_acct_desc_eng || item['Description (English)'] || '',
    'Status': item.acm_acct_status || item['Status'] || '',
  }));
};

const getExportColumns = (colKey) => {
  if (colKey === 'activity') return ['Code', 'Description (Malay)', 'Description (English)', 'Status'];
  return ['Account Code', 'Description (Malay)', 'Description (English)', 'Status'];
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
  fetchActivity();
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
          <div class="text-lg font-semibold">Account Code Browser</div>
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
                      'bg-green-400': getItemStatus(colKey, item) === 'ACTIVE',
                      'bg-red-400': getItemStatus(colKey, item) === 'INACTIVE',
                      'bg-gray-300': !getItemStatus(colKey, item),
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
      dialog-class="account-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg account-modal-header">
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
          <!-- Activity form -->
          <div v-if="modalLevel === 'activity'" class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Activity Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityForm.lde_value" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityForm.lde_description" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit v-model="activityForm.lde_description2" type="text" :disabled="isViewMode" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="activityForm.lde_status" type="select" :options="statusOptions" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
          </div>

          <!-- Account form (Class, Sub-Class, Siri, Sub-Siri, Account Code) -->
          <div v-else class="space-y-2 py-2">
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Account Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_code" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (Malay)<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_desc" type="text" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Description (English):</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_desc_eng" type="text" :disabled="isViewMode" outer-class="mb-0" />
              </div>
            </div>
            <div v-if="modalLevel === 'class'" class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Activity:</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_activity" type="text" :disabled="true" outer-class="mb-0" />
              </div>
            </div>
            <div v-if="modalLevel === 'class'" class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Group:</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_group" type="text" :disabled="isViewMode" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <label class="w-40 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit v-model="accountForm.acm_acct_status" type="select" :options="statusOptions" :disabled="isViewMode" validation="required" validation-visibility="dirty" outer-class="mb-0" />
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
  margin: 0 !important;
  box-sizing: border-box;
}

.account-modal-custom .modal-header > *:not(.account-modal-header) {
  display: none !important;
}

.account-modal-custom .modal-header > .account-modal-header {
  display: flex !important;
}
</style>
