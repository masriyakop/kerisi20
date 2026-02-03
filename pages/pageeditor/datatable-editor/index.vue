<script setup>
definePageMeta({
  title: "Datatable Editor",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Page Editor", path: "/pageeditor" },
    { name: "Datatable Editor", path: "/pageeditor/datatable-editor" },
  ],
});

const { $swal } = useNuxtApp();
const router = useRouter();

const loading = ref(false);
const componentId = ref(null);
const pageId = ref(null);
const component = ref(null);

// Store original values to detect changes
const originalComponentForm = ref(null);
const originalDtConfig = ref(null);

// Component form data
const componentForm = ref({
  title: "",
  name: "",
  cssClass: "",
  type: "datatable",
  collapseEnable: false,
  collapseByDefault: false,
  visible: true,
  active: "active", // 'active' or 'inactive'
  order: 1,
  queryMapping: "",
});

// Component Type options from lookup.json
const componentTypeOptions = ref([]);

const dtConfig = ref({
  dt_ajax: "",
  dt_bm: [],
  dt_bi: [],
  dt_class: [],
  dt_key: [],
  dt_sort: [],
  dt_title: "",
  dt_pageLength: "5",
  dt_aLengthMenu: "5,10,25,50,100",
  dt_bLengthChange: true,
  dt_bPaginate: true,
  dt_freeze_left: "0",
  dt_freeze_right: "0",
  dt_filter: "none",
  dt_popup_view: false,
  dt_popup_edit: false,
  dt_popup_add: false,
  dt_popup_delete: false,
  dt_download_pdf: false,
  dt_download_csv: false,
  dt_download_excel: false,
});

const filterOptions = [
  { label: "None", value: "none" },
  { label: "Smart", value: "smart" },
  { label: "Top", value: "top" },
];

// Load component types from lookup.json
const loadComponentTypes = async () => {
  try {
    const lookupData = await import("~/assets/json/lookup.json");
    const data = lookupData.default || lookupData;
    if (data?.ComponentType) {
      componentTypeOptions.value = data.ComponentType.map((item) => ({
        label: item.name,
        value: item.name,
      }));
    }
  } catch (error) {
    console.error("Error loading component types:", error);
    // Fallback: hardcode the types from lookup.json
    componentTypeOptions.value = [
      { label: "form_1_col", value: "form_1_col" },
      { label: "form_TopFilter", value: "form_TopFilter" },
      { label: "form_SmartFilter", value: "form_SmartFilter" },
      { label: "form_PopupModal", value: "form_PopupModal" },
      { label: "datatable", value: "datatable" },
    ];
  }
};

const sortOptions = [
  { label: "Unsortable", value: "unsortable" },
  { label: "Asc", value: "asc" },
  { label: "Desc", value: "desc" },
  { label: "Default", value: "default" },
];

const normalizeRows = () => {
  const maxLen = Math.max(
    dtConfig.value.dt_bi.length,
    dtConfig.value.dt_bm.length,
    dtConfig.value.dt_class.length,
    dtConfig.value.dt_key.length,
    dtConfig.value.dt_sort.length,
    1
  );
  const ensureLength = (arr) => {
    while (arr.length < maxLen) arr.push("");
    return arr;
  };
  dtConfig.value.dt_bi = ensureLength(dtConfig.value.dt_bi || []);
  dtConfig.value.dt_bm = ensureLength(dtConfig.value.dt_bm || []);
  dtConfig.value.dt_class = ensureLength(dtConfig.value.dt_class || []);
  dtConfig.value.dt_key = ensureLength(dtConfig.value.dt_key || []);
  dtConfig.value.dt_sort = ensureLength(dtConfig.value.dt_sort || []);
};

const parseComponentData = (componentData) => {
  if (!componentData) return;
  try {
    const parsed = typeof componentData === "string" ? JSON.parse(componentData) : componentData;
    dtConfig.value = {
      dt_ajax: parsed.dt_ajax || "",
      dt_bm: parsed.dt_bm || [],
      dt_bi: parsed.dt_bi || [],
      dt_class: parsed.dt_class || [],
      dt_key: parsed.dt_key || [],
      dt_sort: parsed.dt_sort || [],
      dt_title: parsed.dt_title || "",
      dt_pageLength: parsed.dt_pageLength || "5",
      dt_aLengthMenu: parsed.dt_aLengthMenu || "5,10,25,50,100",
      dt_bLengthChange: parsed.dt_bLengthChange === "true" || parsed.dt_bLengthChange === true,
      dt_bPaginate: parsed.dt_bPaginate === "true" || parsed.dt_bPaginate === true,
      dt_freeze_left: parsed.dt_freeze_left?.toString() || "0",
      dt_freeze_right: parsed.dt_freeze_right?.toString() || "0",
      dt_filter: parsed.dt_filter || "none",
      dt_popup_view: parsed.dt_popup_view === "true" || parsed.dt_popup_view === true || false,
      dt_popup_edit: parsed.dt_popup_edit === "true" || parsed.dt_popup_edit === true || false,
      dt_popup_add: parsed.dt_popup_add === "true" || parsed.dt_popup_add === true || false,
      dt_popup_delete: parsed.dt_popup_delete === "true" || parsed.dt_popup_delete === true || false,
      dt_download_pdf: parsed.dt_download_pdf === "true" || parsed.dt_download_pdf === true || false,
      dt_download_csv: parsed.dt_download_csv === "true" || parsed.dt_download_csv === true || false,
      dt_download_excel: parsed.dt_download_excel === "true" || parsed.dt_download_excel === true || false,
    };
    normalizeRows();
  } catch (err) {
    console.error("Error parsing componentData:", err);
    $swal.fire({
      title: "Error",
      text: "Failed to parse datatable configuration",
      icon: "error",
    });
  }
};

const fetchComponent = async () => {
  if (!componentId.value) return;
  try {
    loading.value = true;
    const { data } = await useFetch("/api/component-editor", {
      method: "GET",
      query: { id: componentId.value },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      component.value = data.value.data;
      // Populate component form
      const isActive = component.value.active === 1 || component.value.active === true;
      componentForm.value = {
        title: component.value.title || "",
        name: component.value.name || "",
        cssClass: component.value.cssClass || "",
        type: component.value.type || "datatable",
        collapseEnable: component.value.collapseEnable === 1 || component.value.collapseEnable === true,
        collapseByDefault: component.value.collapseByDefault === 1 || component.value.collapseByDefault === true,
        visible: component.value.visible === 1 || component.value.visible === true,
        active: isActive ? "active" : "inactive",
        order: component.value.order || 1,
        queryMapping: component.value.queryMapping || "",
      };
      parseComponentData(component.value?.componentData);
      
      // Store original values for change detection
      originalComponentForm.value = JSON.parse(JSON.stringify(componentForm.value));
      originalDtConfig.value = JSON.parse(JSON.stringify(dtConfig.value));
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching datatable component:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const initFromSession = () => {
  if (!process.client) return false;
  const stored = sessionStorage.getItem("datatableEditorComponent");
  if (!stored) return false;
  try {
    const parsed = JSON.parse(stored);
    componentId.value = parsed.componentId;
    pageId.value = parsed.pageId;
    return true;
  } catch (error) {
    console.error("Error parsing datatableEditorComponent session data:", error);
    return false;
  }
};

// Check if there are unsaved changes
const hasUnsavedChanges = () => {
  if (!originalComponentForm.value || !originalDtConfig.value) return false;
  
  // Compare component form
  const formChanged = JSON.stringify(componentForm.value) !== JSON.stringify(originalComponentForm.value);
  
  // Compare dtConfig (deep comparison for arrays)
  const dtConfigChanged = JSON.stringify(dtConfig.value) !== JSON.stringify(originalDtConfig.value);
  
  return formChanged || dtConfigChanged;
};

const handleBack = async () => {
  // Check if there are unsaved changes
  if (hasUnsavedChanges()) {
    const result = await $swal.fire({
      title: "Unsaved Changes",
      text: "You have unsaved changes. What would you like to do?",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Discard",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      // Save changes first
      const saveSuccess = await handleSave();
      if (saveSuccess) {
        // Wait a moment for the success message to be visible, then navigate
        setTimeout(() => {
          navigateToPageCreator();
        }, 500);
      }
      // If save failed, stay on page (error already shown by handleSave)
    } else if (result.isDenied) {
      // Discard changes and navigate back
      navigateToPageCreator();
    }
    // If cancelled, do nothing (stay on page)
  } else {
    // No changes, navigate back immediately
    navigateToPageCreator();
  }
};

// Navigate to Page Creator with pageId and componentId to restore selection
const navigateToPageCreator = () => {
  if (pageId.value && componentId.value) {
    router.push(`/page-creator?pageId=${pageId.value}&componentId=${componentId.value}`);
  } else {
    router.push("/page-creator");
  }
};

onMounted(async () => {
  await loadComponentTypes();
  const ok = initFromSession();
  if (!ok || !componentId.value) {
    $swal.fire({
      title: "Info",
      text: "No component selected. Returning to Page Creator.",
      icon: "info",
    });
    return router.push("/page-creator");
  }
  await fetchComponent();
});

const handleAddRow = () => {
  dtConfig.value.dt_bi.push("");
  dtConfig.value.dt_bm.push("");
  dtConfig.value.dt_class.push("");
  dtConfig.value.dt_key.push("");
  dtConfig.value.dt_sort.push("unsortable");
};

const handleDeleteRow = (idx) => {
  const arrays = ["dt_bm", "dt_bi", "dt_class", "dt_key", "dt_sort"];
  arrays.forEach((key) => {
    if (Array.isArray(dtConfig.value[key])) dtConfig.value[key].splice(idx, 1);
  });
};

// Keep all column configuration arrays in sync when rows are reordered via drag & drop
const handleRowReorder = (evt) => {
  const move = evt?.moved;
  if (!move) return;

  const { oldIndex, newIndex } = move;
  if (oldIndex === undefined || newIndex === undefined) return;

  // Sync all other arrays with dt_bi (which is the draggable model)
  const arraysToSync = ["dt_bm", "dt_class", "dt_key", "dt_sort"];

  arraysToSync.forEach((key) => {
    const arr = dtConfig.value[key];
    if (!Array.isArray(arr)) return;
    if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) return;

    const [item] = arr.splice(oldIndex, 1);
    arr.splice(newIndex, 0, item);
  });
};

const saving = ref(false);

const handleSave = async () => {
  // Validation
  if (!componentForm.value.title || !componentForm.value.name) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in Title and Name fields",
      icon: "warning",
    });
    return false;
  }

  if (!componentId.value) {
    $swal.fire({
      title: "Error",
      text: "Component ID is missing",
      icon: "error",
    });
    return false;
  }

  // Validate datatable configuration rows - Title BI, Title BM, and Key are required
  const rowCount = dtConfig.value.dt_bi.length;
  const emptyRows = [];
  
  for (let i = 0; i < rowCount; i++) {
    const titleBi = dtConfig.value.dt_bi[i]?.trim() || "";
    const titleBm = dtConfig.value.dt_bm[i]?.trim() || "";
    const key = dtConfig.value.dt_key[i]?.trim() || "";
    
    const missingFields = [];
    if (!titleBi) missingFields.push("Title BI");
    if (!titleBm) missingFields.push("Title BM");
    if (!key) missingFields.push("Key");
    
    if (missingFields.length > 0) {
      emptyRows.push({ row: i + 1, fields: missingFields });
    }
  }
  
  if (emptyRows.length > 0) {
    const errorDetails = emptyRows.map(r => `Row ${r.row}: ${r.fields.join(", ")}`).join("<br>");
    $swal.fire({
      title: "Validation Error",
      html: `Please fill in required fields (Title BI, Title BM, Key) for all rows:<br><br>${errorDetails}`,
      icon: "warning",
    });
    return false;
  }

  // Check for duplicate values in Title BM, Title BI, and Key
  const findDuplicates = (arr) => {
    const valueToRows = new Map();
    arr.forEach((value, index) => {
      const trimmed = value?.trim() || "";
      if (trimmed) {
        if (!valueToRows.has(trimmed)) {
          valueToRows.set(trimmed, []);
        }
        valueToRows.get(trimmed).push(index + 1); // 1-based row number
      }
    });
    // Return only values that appear more than once
    const duplicates = [];
    valueToRows.forEach((rows, value) => {
      if (rows.length > 1) {
        duplicates.push({ value, rows });
      }
    });
    return duplicates;
  };

  const duplicateBi = findDuplicates(dtConfig.value.dt_bi);
  const duplicateBm = findDuplicates(dtConfig.value.dt_bm);
  const duplicateKey = findDuplicates(dtConfig.value.dt_key);

  const allDuplicates = [];
  if (duplicateBi.length > 0) {
    duplicateBi.forEach(d => allDuplicates.push(`Title BI "${d.value}" is duplicated in rows ${d.rows.join(", ")}`));
  }
  if (duplicateBm.length > 0) {
    duplicateBm.forEach(d => allDuplicates.push(`Title BM "${d.value}" is duplicated in rows ${d.rows.join(", ")}`));
  }
  if (duplicateKey.length > 0) {
    duplicateKey.forEach(d => allDuplicates.push(`Key "${d.value}" is duplicated in rows ${d.rows.join(", ")}`));
  }

  if (allDuplicates.length > 0) {
    $swal.fire({
      title: "Validation Error",
      html: `Duplicate values are not allowed:<br><br>${allDuplicates.join("<br>")}`,
      icon: "warning",
    });
    return false;
  }

  try {
    saving.value = true;

    // Prepare componentData as JSON string
    const componentDataJson = JSON.stringify(dtConfig.value);

    // Prepare form data
    const formData = {
      title: componentForm.value.title,
      name: componentForm.value.name,
      cssClass: componentForm.value.cssClass || "",
      type: componentForm.value.type || "datatable",
      collapseEnable: componentForm.value.collapseEnable ? 1 : 0,
      collapseByDefault: componentForm.value.collapseByDefault ? 1 : 0,
      visible: componentForm.value.visible ? 1 : 0,
      active: componentForm.value.active === "active" ? 1 : 0,
      order: componentForm.value.order || 1,
      queryMapping: componentForm.value.queryMapping || "",
      componentData: componentDataJson,
      pageId: pageId.value,
    };

    // Update component
    const response = await useFetch(`/api/component-editor/${componentId.value}`, {
      method: "PUT",
      body: formData,
      initialCache: false,
    });

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: "Datatable configuration saved successfully",
        icon: "success",
        timer: 2000,
      });
      // Update original values to reflect saved state
      originalComponentForm.value = JSON.parse(JSON.stringify(componentForm.value));
      originalDtConfig.value = JSON.parse(JSON.stringify(dtConfig.value));
      return true;
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save datatable configuration",
        icon: "error",
      });
      return false;
    }
  } catch (error) {
    console.error("Error saving datatable configuration:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving the configuration",
      icon: "error",
    });
    return false;
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-semibold">Datatable Editor</div>
            <div class="text-sm text-gray-500">
              {{ component?.title || component?.name || "Datatable" }}
            </div>
          </div>
          <rs-button variant="secondary" @click="handleBack">
            <Icon name="material-symbols:arrow-back" class="mr-1" size="1rem" />
            Back
          </rs-button>
        </div>
      </template>

      <template #body>
        <div v-if="loading" class="flex items-center justify-center py-12 text-gray-500">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span class="ml-2">Loading datatable configuration...</span>
        </div>

        <div v-else class="space-y-4">
          <!-- Modify Component Section -->
          <rs-card>
            <template #header>
              <div class="text-sm font-semibold">Modify Component</div>
            </template>
            <template #body>
              <div class="space-y-3">
                <!-- Title -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Title:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.title"
                      type="text"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Name -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Name:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.name"
                      type="text"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Type -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Type:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.type"
                      type="select"
                      :options="componentTypeOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Status -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Status:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.active"
                      type="select"
                      :options="[
                        { label: 'Active', value: 'active' },
                        { label: 'Inactive', value: 'inactive' },
                      ]"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Collapse -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Collapse:</label>
                  <div class="flex-1 flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="componentForm.collapseEnable"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Enable</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="componentForm.collapseByDefault"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Collapse by default</label>
                    </div>
                    <div class="flex items-center gap-2 ml-auto">
                      <label class="text-xs font-medium">Visible:</label>
                      <input
                        type="checkbox"
                        v-model="componentForm.visible"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <!-- CSS Class -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">CSS Class:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.cssClass"
                      type="text"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Order -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Order:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.order"
                      type="number"
                      min="1"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Query Mapping -->
                <div class="flex items-start gap-2">
                  <label class="w-32 text-xs font-medium pt-2">Query Mapping:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="componentForm.queryMapping"
                      type="textarea"
                      rows="5"
                      outer-class="mb-0"
                    />
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Datatable Configuration Section -->
          <rs-card>
            <template #header>
              <div class="text-sm font-semibold">Datatable Configuration</div>
            </template>
            <template #body>
              <div class="space-y-4">
                <!-- API Field -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">API:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="dtConfig.dt_ajax"
                      type="text"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Length Per Page -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Length Per Page:</label>
                  <div class="flex-1 flex items-center gap-3">
                    <div class="w-20">
                      <FormKit
                        v-model="dtConfig.dt_pageLength"
                        type="number"
                        min="1"
                        outer-class="mb-0"
                      />
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_bLengthChange"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Allow Change</label>
                    </div>
                    <div class="text-xs text-gray-500">{{ dtConfig.dt_aLengthMenu }}</div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_bPaginate"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Show Pagination</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_download_pdf"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Download PDF</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_download_csv"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Download CSV</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_download_excel"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Download Excel</label>
                    </div>
                  </div>
                </div>

                <!-- Freeze Column -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Freeze Column:</label>
                  <div class="flex-1 flex items-center gap-4">
                    <div class="flex items-center gap-2 flex-1">
                      <label class="text-xs font-medium">Left:</label>
                      <FormKit
                        v-model="dtConfig.dt_freeze_left"
                        type="number"
                        min="0"
                        outer-class="mb-0 flex-1"
                      />
                    </div>
                    <div class="flex items-center gap-2 flex-1">
                      <label class="text-xs font-medium">Right:</label>
                      <FormKit
                        v-model="dtConfig.dt_freeze_right"
                        type="number"
                        min="0"
                        outer-class="mb-0 flex-1"
                      />
                    </div>
                  </div>
                </div>

                <!-- Filter -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Filter:</label>
                  <div class="flex-1">
                    <FormKit
                      v-model="dtConfig.dt_filter"
                      type="select"
                      :options="filterOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Popup Modal -->
                <div class="flex items-center gap-2">
                  <label class="w-32 text-xs font-medium">Popup Modal:</label>
                  <div class="flex-1 flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_popup_view"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">View</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_popup_edit"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Edit</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_popup_add"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Add</label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        v-model="dtConfig.dt_popup_delete"
                        class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <label class="text-xs font-medium">Delete</label>
                    </div>
                  </div>
                </div>

                <div class="overflow-auto">
                  <table class="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                    <thead class="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Title BI <span class="text-red-500">*</span></th>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Title BM <span class="text-red-500">*</span></th>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Class</th>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Key <span class="text-red-500">*</span></th>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Sort</th>
                        <th class="px-3 py-2 border border-gray-200 dark:border-gray-700">Action</th>
                      </tr>
                    </thead>
                    <draggable
                      v-model="dtConfig.dt_bi"
                      tag="tbody"
                      handle=".drag-handle"
                      @change="handleRowReorder"
                    >
                      <template #item="{ index }">
                        <tr>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700">
                            <input v-model="dtConfig.dt_bi[index]" class="w-full input input-sm" />
                          </td>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700">
                            <input v-model="dtConfig.dt_bm[index]" class="w-full input input-sm" />
                          </td>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700">
                            <input v-model="dtConfig.dt_class[index]" class="w-full input input-sm" />
                          </td>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700">
                            <input v-model="dtConfig.dt_key[index]" class="w-full input input-sm" />
                          </td>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700">
                            <select v-model="dtConfig.dt_sort[index]" class="w-full input input-sm">
                              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                              </option>
                            </select>
                          </td>
                          <td class="px-2 py-1 border border-gray-200 dark:border-gray-700 text-center">
                            <div class="flex items-center justify-center gap-2 text-primary">
                              <span
                                class="drag-handle cursor-move text-gray-400 hover:text-gray-600"
                                title="Drag to reorder"
                              >
                                <Icon name="material-symbols:drag-handle-rounded" size="16" />
                              </span>
                              <button
                                class="text-red-500 hover:text-red-600"
                                title="Delete"
                                @click="handleDeleteRow(index)"
                              >
                                <Icon name="material-symbols:delete" size="16" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </draggable>
                  </table>
                  <div class="flex justify-end mt-3">
                    <rs-button size="sm" variant="primary" @click="handleAddRow">
                      <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                      Add
                    </rs-button>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Save Button -->
        <div v-if="!loading" class="flex justify-end mt-6">
          <rs-button variant="primary" :disabled="saving" @click="handleSave">
            <Icon v-if="saving" name="material-symbols:hourglass-empty" class="mr-1 animate-spin" size="1rem" />
            <Icon v-else name="material-symbols:save" class="mr-1" size="1rem" />
            {{ saving ? "Saving..." : "Save" }}
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>
