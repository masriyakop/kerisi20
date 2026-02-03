<script setup>
definePageMeta({
  title: "Component Editor",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "System Admin",
      path: "/pageeditor",
    },
    {
      name: "Page Editor",
      path: "/page-list",
    },
    {
      name: "Component Editor",
      path: "/pageeditor/component-editor",
    },
  ],
});

const { $swal } = useNuxtApp();
const route = useRoute();
const router = useRouter();

// Show Lookup Query Mapping info
const showLookupQueryMappingInfo = () => {
  $swal.fire({
    title: "Lookup Query Mapping Format",
    html: `
      <div class="text-left space-y-4">
        <p class="font-semibold mb-2">The data can be in this SQL format (example below):</p>
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
          <div class="mb-2">SELECT lde_value AS label, lde_id AS value FROM lookup_details WHERE lma_code_name='STATUS';</div>
          <div class="mb-2">SELECT description, code FROM status_table WHERE active=1;</div>
          <div>SELECT DISTINCT bam_status_cd flc_id, bam_status_cd flc_name FROM status_table WHERE active=1;</div>
        </div>
        <p class="font-semibold mt-4 mb-2">OR in Array of JSON (example below):</p>
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
          [<br/>
          &nbsp;&nbsp;{ "label": "ACTIVE", "value": "1" },<br/>
          &nbsp;&nbsp;{ "label": "INACTIVE", "value": "0" }<br/>
          ]
        </div>
      </div>
    `,
    icon: "info",
    width: "600px",
    confirmButtonText: "Got it",
  });
};

// Get pageId from sessionStorage (from Page Editor Edit icon) - not exposed in URL
const pageIdFromStorage = ref(null);

// Table data
const componentList = ref([]);
const componentListFull = ref([]); // Store full component data with pageId for dropdown
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Add/Edit Component modal state
const showComponentModal = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

// Page selection state
const selectedPage = ref(null);
const selectedPageDisplay = ref("");
const showSelectMenuModal = ref(false);
const menuSearchKeyword = ref("");
const availablePages = ref([]);
const filteredPages = ref([]);

// Import modal state
const showImportModal = ref(false);
const migrationFiles = ref([]);
const selectedFiles = ref([]);
const importLoading = ref(false);
const importSearchKeyword = ref("");

// Component form data
const componentForm = ref({
  title: "",
  name: "",
  cssClass: "",
  type: "custom",
  collapseEnable: false,
  collapseByDefault: false,
  visible: true,
  active: true,
  order: 1,
  queryMapping: "",
});

// Filtered data
const filteredComponentList = ref([...componentList.value]);

// Component Item state
const componentItemList = ref([]);
const componentItemLoading = ref(false);
const componentItemSearchKeyword = ref("");
const componentItemPageSize = ref(10);
const filteredComponentItemList = ref([...componentItemList.value]);

// Add/Edit Component Item modal state
const showComponentItemModal = ref(false);
const isComponentItemEditMode = ref(false);
const editingComponentItemId = ref(null);

// Component Item form data
const componentItemForm = ref({
  name: "",
  title: "",
  component: "", // Store component name for display
  componentId: null, // Store componentId (used as value in dropdown)
  type: "",
  cssClass: "",
  additionalAttribute: "",
  defaultValue: "",
  lookup_queryMapping: "",
  visible: true,
  active: true,
  order: 1,
});

// Component Item Type options from lookup.json
const componentItemTypeOptions = ref([]);

// Component Type options from lookup.json
const componentTypeOptions = ref([]);

// Component Item Import modal state
const showComponentItemImportModal = ref(false);
const componentItemMigrationFiles = ref([]);
const componentItemSelectedFiles = ref([]);
const componentItemImportLoading = ref(false);
const componentItemImportSearchKeyword = ref("");

// Function to apply filters
const applyFilters = () => {
  let filtered = [...componentList.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const id = item.id?.toString().toLowerCase() || "";
      const name = (item.name || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const type = (item.type || "").toLowerCase();
      const cssClass = (item.cssClass || "").toLowerCase();

      return (
        id.includes(keyword) ||
        name.includes(keyword) ||
        title.includes(keyword) ||
        type.includes(keyword) ||
        cssClass.includes(keyword)
      );
    });
  }

  // Update the filtered list immediately
  filteredComponentList.value = [...filtered];
};

// Total records count
const totalRecords = computed(() => filteredComponentList.value.length);

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Fetch components from API
const fetchComponents = async (pageId = null) => {
  try {
    loading.value = true;
    const query = pageId ? `?pageId=${pageId}` : "";
    const { data } = await useFetch(`/api/component-editor${query}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      componentList.value = data.value.data || [];
      // Also fetch full component data (with pageId) for dropdown
      if (pageId) {
        const { data: rawData } = await useFetch(`/api/component-editor?pageId=${pageId}&raw=true`, {
          method: "GET",
          initialCache: false,
        });
        if (rawData.value?.statusCode === 200) {
          componentListFull.value = rawData.value.data || [];
        }
      } else {
        componentListFull.value = [];
      }
      // Ensure filtered list is updated
      nextTick(() => {
        applyFilters();
      });
      // Also fetch component items for the selected page
      if (pageId) {
        fetchComponentItems(pageId);
      }
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch components",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching components:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching components",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Fetch available pages (only menus with Page attached)
const fetchAvailablePages = async () => {
  try {
    const { data } = await useFetch("/api/component-editor/available-pages", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      availablePages.value = data.value.data || [];
      filteredPages.value = [...availablePages.value];
      
      // If pageId from sessionStorage, set it as default
      if (pageIdFromStorage.value) {
        const page = availablePages.value.find(p => p.pageId === pageIdFromStorage.value);
        if (page) {
          selectedPage.value = page.pageId;
          selectedPageDisplay.value = `[${page.pageId}] ${page.pageTitle}`;
          fetchComponents(page.pageId);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching available pages:", error);
  }
};

// Filter pages based on search keyword
const filterPages = () => {
  if (!menuSearchKeyword.value || menuSearchKeyword.value.trim() === "") {
    filteredPages.value = [...availablePages.value];
    return;
  }
  
  const keyword = menuSearchKeyword.value.toLowerCase().trim();
  filteredPages.value = availablePages.value.filter((page) => {
    const pageId = page.pageId?.toString().toLowerCase() || "";
    const pageTitle = (page.pageTitle || "").toLowerCase();
    const menu = (page.menu || "").toLowerCase();
    
    return (
      pageId.includes(keyword) ||
      pageTitle.includes(keyword) ||
      menu.includes(keyword)
    );
  });
};

// Watch menu search keyword
watch(menuSearchKeyword, () => {
  filterPages();
});

// Open Select Menu modal
const openSelectMenuModal = () => {
  menuSearchKeyword.value = "";
  filteredPages.value = [...availablePages.value];
  showSelectMenuModal.value = true;
};

// Select a page from modal
const selectPage = (page) => {
  selectedPage.value = page.pageId;
  selectedPageDisplay.value = `[${page.pageId}] ${page.pageTitle}`;
  showSelectMenuModal.value = false;
  menuSearchKeyword.value = "";
  // Fetch components for selected page
  fetchComponents(page.pageId);
};

// Clear page selection
const clearPageSelection = () => {
  selectedPage.value = null;
  selectedPageDisplay.value = "";
  componentList.value = [];
  componentListFull.value = [];
  filteredComponentList.value = [];
  componentItemList.value = [];
  filteredComponentItemList.value = [];
};

// Show List button handler
const handleShowList = () => {
  if (!selectedPage.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }
  fetchComponents(selectedPage.value);
};

// Initialize on mount
onMounted(() => {
  // Read pageId from sessionStorage first (not exposed in URL)
  if (process.client) {
    try {
      const stored = sessionStorage.getItem('componentEditorPageId');
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data is not too old (e.g., within 1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - data.timestamp < oneHour) {
          pageIdFromStorage.value = parseInt(data.pageId);
          // Clear after reading
          sessionStorage.removeItem('componentEditorPageId');
        } else {
          sessionStorage.removeItem('componentEditorPageId');
        }
      }
    } catch (error) {
      console.error("Error reading pageId from sessionStorage:", error);
      sessionStorage.removeItem('componentEditorPageId');
    }
  }
  
  // Then fetch available pages
  fetchAvailablePages();
  // Load component item types
  loadComponentItemTypes();
  // Load component types
  loadComponentTypes();
});

// Add function
const handleAdd = async () => {
  if (!selectedPage.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }
  
  // Ensure componentTypeOptions is loaded
  if (componentTypeOptions.value.length === 0) {
    await loadComponentTypes();
  }
  
  isEditMode.value = false;
  editingId.value = null;
  componentForm.value = {
    title: "",
    name: "",
    cssClass: "",
    type: "custom",
    collapseEnable: false,
    collapseByDefault: false,
    visible: true,
    active: true,
    order: componentList.value.length > 0 
      ? Math.max(...componentList.value.map(c => c.order || 0)) + 1 
      : 1,
    queryMapping: "",
  };
  showComponentModal.value = true;
};

// Edit function
const handleEdit = async (item) => {
  try {
    // Ensure componentTypeOptions is loaded
    if (componentTypeOptions.value.length === 0) {
      await loadComponentTypes();
    }
    
    isEditMode.value = true;
    editingId.value = item.id;
    
    // Fetch full component data including queryMapping and componentData
    const { data } = await useFetch(`/api/component-editor?id=${item.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponent = data.value.data;
      componentForm.value = {
        title: fullComponent.title || "",
        name: fullComponent.name || "",
        cssClass: fullComponent.cssClass || "",
        type: fullComponent.type || "custom",
        collapseEnable: fullComponent.collapseEnable === 1 || fullComponent.collapseEnable === true,
        collapseByDefault: fullComponent.collapseByDefault === 1 || fullComponent.collapseByDefault === true,
        visible: fullComponent.visible === 1 || fullComponent.visible === true,
        active: fullComponent.active === 1 || fullComponent.active === true,
        order: fullComponent.order || 1,
        queryMapping: fullComponent.queryMapping || "",
      };
      showComponentModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component for editing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component data",
      icon: "error",
    });
  }
};

// Save Component
const handleSaveComponent = async () => {
  // Validation
  if (!componentForm.value.title || !componentForm.value.name || componentForm.value.active === null || componentForm.value.active === undefined) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Title, Name, and Active)",
      icon: "warning",
    });
    return;
  }

  if (!selectedPage.value) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    const formData = {
      ...componentForm.value,
      pageId: selectedPage.value,
      collapseEnable: componentForm.value.collapseEnable ? 1 : 0,
      collapseByDefault: componentForm.value.collapseByDefault ? 1 : 0,
      visible: componentForm.value.visible ? 1 : 0,
      active: componentForm.value.active ? 1 : 0,
      queryMapping: componentForm.value.queryMapping || "",
    };

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/component-editor/${editingId.value}`, {
        method: "PUT",
        body: formData,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/component-editor", {
        method: "POST",
        body: formData,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Component updated successfully" : "Component created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchComponents(selectedPage.value);
      
      // Reset form and close modal
      showComponentModal.value = false;
      componentForm.value = {
        title: "",
        name: "",
        cssClass: "",
        type: "custom",
        collapseEnable: false,
        collapseByDefault: false,
        visible: true,
        active: true,
        order: 1,
        queryMapping: "",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save component",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving component:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving component",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Component form
const handleCancelComponent = () => {
  showComponentModal.value = false;
  componentForm.value = {
    title: "",
    name: "",
    cssClass: "",
    type: "custom",
    collapseEnable: false,
    collapseByDefault: false,
    visible: true,
    active: true,
    order: 1,
    queryMapping: "",
  };
};

// Fetch migration files
const fetchMigrationFiles = async () => {
  try {
    importLoading.value = true;
    const { data } = await useFetch("/api/component-editor/migration-files", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      migrationFiles.value = data.value.data || [];
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch migration files",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching migration files:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching migration files",
      icon: "error",
    });
  } finally {
    importLoading.value = false;
  }
};

// Open import modal
const handleImport = async () => {
  selectedFiles.value = [];
  importSearchKeyword.value = "";
  showImportModal.value = true;
  await fetchMigrationFiles();
};

// Close import modal
const handleCloseImport = () => {
  showImportModal.value = false;
  selectedFiles.value = [];
  importSearchKeyword.value = "";
};

// Toggle file selection
const toggleFileSelection = (fileName) => {
  const index = selectedFiles.value.indexOf(fileName);
  if (index > -1) {
    selectedFiles.value.splice(index, 1);
  } else {
    selectedFiles.value.push(fileName);
  }
};

// Toggle select all files
const toggleSelectAll = () => {
  const filteredFiles = getFilteredFiles();
  if (selectedFiles.value.length === filteredFiles.length) {
    selectedFiles.value = [];
  } else {
    selectedFiles.value = [...filteredFiles.map((f) => f.name)];
  }
};

// Get filtered files based on search
const getFilteredFiles = () => {
  if (!importSearchKeyword.value || importSearchKeyword.value.trim() === "") {
    return migrationFiles.value;
  }
  const keyword = importSearchKeyword.value.toLowerCase().trim();
  return migrationFiles.value.filter((file) =>
    file.name.toLowerCase().includes(keyword)
  );
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

// Execute import
const executeImport = async () => {
  if (selectedFiles.value.length === 0) {
    $swal.fire({
      title: "No Files Selected",
      text: "Please select at least one file to import",
      icon: "warning",
    });
    return;
  }

  try {
    importLoading.value = true;
    const response = await useFetch("/api/component-editor/import", {
      method: "POST",
      body: { files: selectedFiles.value },
      initialCache: false,
    });

    if (response.data.value?.statusCode === 200) {
      const data = response.data.value.data;
      let message = response.data.value.message;
      
      if (data.errorsList && data.errorsList.length > 0) {
        message += "\n\nErrors:\n" + data.errorsList.slice(0, 10).join("\n");
        if (data.errorsList.length > 10) {
          message += `\n... and ${data.errorsList.length - 10} more errors`;
        }
      }

      await $swal.fire({
        title: "Import Completed",
        text: message,
        icon: "success",
        width: "600px",
      });

      // Close modal and refresh data
      handleCloseImport();
      if (selectedPage.value) {
        await fetchComponents(selectedPage.value);
      }
    } else {
      $swal.fire({
        title: "Import Failed",
        text: response.data.value?.message || "Failed to import components",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error importing components:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while importing components",
      icon: "error",
    });
  } finally {
    importLoading.value = false;
  }
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete component "${item.name}"?`,
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
      const response = await useFetch(`/api/component-editor/${item.id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Component has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchComponents(selectedPage.value);
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete component",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting component:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting component",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Bulk Edit function (placeholder)
const handleBulkEdit = (item) => {
  $swal.fire({
    title: "Info",
    text: "Bulk Edit functionality will be implemented",
    icon: "info",
  });
};

// Pin function - filter Component Items by component name
const handlePin = (item) => {
  if (!item || !item.name) {
    $swal.fire({
      title: "Error",
      text: "Component name not found",
      icon: "error",
    });
    return;
  }
  
  // Set the search keyword in Component Item section to the component name
  componentItemSearchKeyword.value = item.name;
  
  // The watch on componentItemSearchKeyword will automatically trigger applyComponentItemFilters
  // Scroll to Component Item section for better UX
  nextTick(() => {
    const componentItemSection = document.querySelector('.component-item-table-wrapper');
    if (componentItemSection) {
      componentItemSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

// Duplicate function (placeholder)
const handleDuplicate = (item) => {
  $swal.fire({
    title: "Info",
    text: "Duplicate functionality will be implemented",
    icon: "info",
  });
};

// Duplicate and Link to Other Page function (placeholder)
const handleDuplicateAndLink = (item) => {
  $swal.fire({
    title: "Info",
    text: "Duplicate and Link to Other Page functionality will be implemented",
    icon: "info",
  });
};

// Handle checkbox change - auto update
const handleCheckboxChange = async (item, field, newCheckedValue) => {
  try {
    const currentValue = item[field] === 1 || item[field] === true;
    const newValue = newCheckedValue ? 1 : 0;

    // Optimistically update the UI
    const componentIndex = componentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentIndex !== -1) {
      componentList.value[componentIndex][field] = newValue;
    }
    
    const filteredIndex = filteredComponentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentList.value[filteredIndex][field] = newValue;
    }

    // Prepare update data with current values
    const updateData = {
      title: item.title,
      name: item.name,
      cssClass: item.cssClass || "",
      type: item.type || "custom",
      collapseEnable: field === 'collapseEnable' ? newValue : (item.collapseEnable === 1 || item.collapseEnable === true ? 1 : 0),
      collapseByDefault: field === 'collapseByDefault' ? newValue : (item.collapseByDefault === 1 || item.collapseByDefault === true ? 1 : 0),
      visible: field === 'visible' ? newValue : (item.visible === 1 || item.visible === true ? 1 : 0),
      active: field === 'active' ? newValue : (item.active === 1 || item.active === true ? 1 : 0),
      order: item.order || 1,
    };

    // Call API to update
    const response = await useFetch(`/api/component-editor/${item.id}`, {
      method: "PUT",
      body: updateData,
      initialCache: false,
    });

    if (response.data.value?.statusCode !== 200) {
      // Revert on error
      if (componentIndex !== -1) {
        componentList.value[componentIndex][field] = currentValue ? 1 : 0;
      }
      if (filteredIndex !== -1) {
        filteredComponentList.value[filteredIndex][field] = currentValue ? 1 : 0;
      }
      
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to update component",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error updating checkbox:", error);
    
    // Revert on error
    const currentValue = item[field] === 1 || item[field] === true;
    const componentIndex = componentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentIndex !== -1) {
      componentList.value[componentIndex][field] = currentValue ? 1 : 0;
    }
    
    const filteredIndex = filteredComponentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentList.value[filteredIndex][field] = currentValue ? 1 : 0;
    }
    
    $swal.fire({
      title: "Error",
      text: "An error occurred while updating component",
      icon: "error",
    });
  }
};

// Handle order change - auto update
const handleOrderChange = async (item, newOrderValue) => {
  try {
    const currentOrder = item.order || 1;
    const newOrder = parseInt(newOrderValue) || 1;

    // Skip if value hasn't changed
    if (newOrder === currentOrder) {
      return;
    }

    // Validate order value
    if (newOrder < 1) {
      $swal.fire({
        title: "Validation Error",
        text: "Order must be a positive number",
        icon: "warning",
      });
      // Revert to original value
      const componentIndex = componentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
      if (componentIndex !== -1) {
        componentList.value[componentIndex].order = currentOrder;
      }
      const filteredIndex = filteredComponentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
      if (filteredIndex !== -1) {
        filteredComponentList.value[filteredIndex].order = currentOrder;
      }
      return;
    }

    // Optimistically update the UI
    const componentIndex = componentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentIndex !== -1) {
      componentList.value[componentIndex].order = newOrder;
    }
    
    const filteredIndex = filteredComponentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentList.value[filteredIndex].order = newOrder;
    }

    // Prepare update data with current values
    const updateData = {
      title: item.title,
      name: item.name,
      cssClass: item.cssClass || "",
      type: item.type || "custom",
      collapseEnable: item.collapseEnable === 1 || item.collapseEnable === true ? 1 : 0,
      collapseByDefault: item.collapseByDefault === 1 || item.collapseByDefault === true ? 1 : 0,
      visible: item.visible === 1 || item.visible === true ? 1 : 0,
      active: item.active === 1 || item.active === true ? 1 : 0,
      order: newOrder,
      pageId: item.pageId || selectedPage.value,
    };

    // Call API to update
    const response = await useFetch(`/api/component-editor/${item.id}`, {
      method: "PUT",
      body: updateData,
      initialCache: false,
    });

    if (response.data.value?.statusCode !== 200) {
      // Revert on error
      if (componentIndex !== -1) {
        componentList.value[componentIndex].order = currentOrder;
      }
      if (filteredIndex !== -1) {
        filteredComponentList.value[filteredIndex].order = currentOrder;
      }
      
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to update component order",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    
    // Revert on error
    const currentOrder = item.order || 1;
    const componentIndex = componentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentIndex !== -1) {
      componentList.value[componentIndex].order = currentOrder;
    }
    
    const filteredIndex = filteredComponentList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentList.value[filteredIndex].order = currentOrder;
    }
    
    $swal.fire({
      title: "Error",
      text: "An error occurred while updating component order",
      icon: "error",
    });
  }
};

// ========== Component Item Functions ==========

// Fetch component items from API
const fetchComponentItems = async (pageId = null) => {
  try {
    componentItemLoading.value = true;
    const query = pageId ? `?pageId=${pageId}` : "";
    const { data } = await useFetch(`/api/component-item-editor${query}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      componentItemList.value = data.value.data || [];
      nextTick(() => {
        applyComponentItemFilters();
      });
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component items",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component items:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component items",
      icon: "error",
    });
  } finally {
    componentItemLoading.value = false;
  }
};

// Function to apply filters for component items
const applyComponentItemFilters = () => {
  let filtered = [...componentItemList.value];

  // Apply search filter
  if (componentItemSearchKeyword.value && componentItemSearchKeyword.value.trim() !== "") {
    const keyword = componentItemSearchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const id = item.id?.toString().toLowerCase() || "";
      const name = (item.name || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const component = (item.component || "").toLowerCase();
      const type = (item.type || "").toLowerCase();

      return (
        id.includes(keyword) ||
        name.includes(keyword) ||
        title.includes(keyword) ||
        component.includes(keyword) ||
        type.includes(keyword)
      );
    });
  }

  filteredComponentItemList.value = [...filtered];
};

// Watch componentItemSearchKeyword and apply filters
watch(componentItemSearchKeyword, () => {
  applyComponentItemFilters();
}, { immediate: false });

// Total records count for component items
const totalComponentItemRecords = computed(() => filteredComponentItemList.value.length);

// Load component item types from lookup.json
const loadComponentItemTypes = async () => {
  try {
    // Import the JSON file directly (works in Nuxt)
    const lookupData = await import("~/assets/json/lookup.json");
    const data = lookupData.default || lookupData;
    if (data?.ComponentItemType) {
      componentItemTypeOptions.value = data.ComponentItemType.map((item) => ({
        label: item.name,
        value: item.name,
      }));
    }
  } catch (error) {
    console.error("Error loading component item types:", error);
    // Fallback: try $fetch
    try {
      const lookupData = await $fetch("/assets/json/lookup.json");
      if (lookupData?.ComponentItemType) {
        componentItemTypeOptions.value = lookupData.ComponentItemType.map((item) => ({
          label: item.name,
          value: item.name,
        }));
      }
    } catch (fallbackError) {
      console.error("Error loading component item types (fallback):", fallbackError);
      // Last resort: hardcode the types
      componentItemTypeOptions.value = [
        { label: "textfield", value: "textfield" },
        { label: "radiobutton", value: "radiobutton" },
        { label: "checkbox", value: "checkbox" },
        { label: "datepicker", value: "datepicker" },
        { label: "dropdown", value: "dropdown" },
        { label: "textarea", value: "textarea" },
        { label: "fileupload", value: "fileupload" },
        { label: "html", value: "html" },
        { label: "iframe", value: "iframe" },
        { label: "button", value: "button" },
        { label: "link", value: "link" },
        { label: "image", value: "image" },
        { label: "video", value: "video" },
        { label: "audio", value: "audio" },
        { label: "map", value: "map" },
      ];
    }
  }
};

// Load component types from lookup.json
const loadComponentTypes = async () => {
  try {
    // Import the JSON file directly (works in Nuxt)
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
    // Fallback: try $fetch
    try {
      const lookupData = await $fetch("/assets/json/lookup.json");
      if (lookupData?.ComponentType) {
        componentTypeOptions.value = lookupData.ComponentType.map((item) => ({
          label: item.name,
          value: item.name,
        }));
      }
    } catch (fallbackError) {
      console.error("Error loading component types (fallback):", fallbackError);
      // Last resort: hardcode the types from lookup.json
      componentTypeOptions.value = [
        { label: "form_1_col", value: "form_1_col" },
        { label: "form_TopFilter", value: "form_TopFilter" },
        { label: "form_SmartFilter", value: "form_SmartFilter" },
        { label: "form_PopupModal", value: "form_PopupModal" },
        { label: "datatable", value: "datatable" },
      ];
    }
  }
};

// Get available components for selected page
const getAvailableComponents = computed(() => {
  if (!selectedPage.value) return [];
  // Use componentListFull which has pageId
  // Use componentId as value for direct binding
  return componentListFull.value
    .filter((c) => parseInt(c.pageId) === parseInt(selectedPage.value))
    .map((c) => ({
      label: c.name,
      value: parseInt(c.id) || c.id, // Use componentId as value, ensure it's a number
    }));
});

// Add Component Item function
const handleAddComponentItem = async () => {
  if (!selectedPage.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }
  
  // Ensure componentListFull is populated - always fetch to ensure fresh data
  try {
    const { data: rawData } = await useFetch(`/api/component-editor?pageId=${selectedPage.value}&raw=true`, {
      method: "GET",
      initialCache: false,
    });
    if (rawData.value?.statusCode === 200) {
      componentListFull.value = rawData.value.data || [];
    } else {
      componentListFull.value = [];
    }
  } catch (error) {
    console.error("Error fetching components for dropdown:", error);
    componentListFull.value = [];
  }
  
  // Ensure componentItemTypeOptions is loaded
  if (componentItemTypeOptions.value.length === 0) {
    await loadComponentItemTypes();
  }
  
  isComponentItemEditMode.value = false;
  editingComponentItemId.value = null;
  componentItemForm.value = {
    name: "",
    title: "",
    component: "",
    componentId: null, // Will be set from dropdown
    type: "",
    cssClass: "",
    additionalAttribute: "",
    defaultValue: "",
    lookup_queryMapping: "",
    visible: true,
    active: true,
    order: componentItemList.value.length > 0 
      ? Math.max(...componentItemList.value.map(c => c.order || 0)) + 1 
      : 1,
  };
  showComponentItemModal.value = true;
};

// Edit Component Item function
const handleEditComponentItem = async (item) => {
  try {
    isComponentItemEditMode.value = true;
    editingComponentItemId.value = item.id;
    
    // Fetch full component item data
    const { data } = await useFetch(`/api/component-item-editor?id=${item.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponentItem = data.value.data;
      componentItemForm.value = {
        name: fullComponentItem.name || "",
        title: fullComponentItem.title || "",
        component: fullComponentItem.component || "",
        componentId: fullComponentItem.componentId || null, // This will be used as dropdown value
        type: fullComponentItem.type || "",
        cssClass: fullComponentItem.cssClass || "",
        additionalAttribute: fullComponentItem.additionalAttribute || "",
        defaultValue: fullComponentItem.defaultValue || "",
        lookup_queryMapping: fullComponentItem.lookup_queryMapping || "",
        visible: fullComponentItem.visible === 1 || fullComponentItem.visible === true,
        active: fullComponentItem.active === 1 || fullComponentItem.active === true,
        order: fullComponentItem.order || 1,
      };
      showComponentItemModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component item data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component item for editing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component item data",
      icon: "error",
    });
  }
};

// Save Component Item
const handleSaveComponentItem = async () => {
  // Validation
  if (!componentItemForm.value.title || !componentItemForm.value.name || componentItemForm.value.active === null || componentItemForm.value.active === undefined) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Title, Name, and Active)",
      icon: "warning",
    });
    return;
  }

  if (!selectedPage.value) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }

  // Validation - componentId should be set directly from dropdown
  // Wait for next tick to ensure v-model has updated
  await nextTick();
  
  // Debug: Check available components
  const availableComponents = getAvailableComponents.value;
  if (availableComponents.length === 0) {
    $swal.fire({
      title: "Error",
      text: "No components available for the selected page. Please ensure components exist for this page.",
      icon: "error",
    });
    return;
  }
  
  // Normalize componentId to integer (FormKit might return string)
  if (componentItemForm.value.componentId) {
    componentItemForm.value.componentId = parseInt(componentItemForm.value.componentId) || componentItemForm.value.componentId;
  }
  
  // Check if componentId is set (could be 0, so check for null/undefined/empty string specifically)
  if (!componentItemForm.value.componentId && componentItemForm.value.componentId !== 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a component from the dropdown",
      icon: "warning",
    });
    return;
  }
  
  // Ensure component name is set if componentId is set
  if (componentItemForm.value.componentId && !componentItemForm.value.component) {
    const selectedComponent = componentListFull.value.find((c) => parseInt(c.id) === parseInt(componentItemForm.value.componentId));
    if (selectedComponent) {
      componentItemForm.value.component = selectedComponent.name;
    }
  }

  try {
    componentItemLoading.value = true;
    let response;

    // Ensure type is captured (FormKit might return empty string if not selected)
    const typeValue = componentItemForm.value.type || "";
    
    const formData = {
      name: componentItemForm.value.name,
      title: componentItemForm.value.title,
      component: componentItemForm.value.component || "",
      componentId: componentItemForm.value.componentId,
      type: typeValue,
      cssClass: componentItemForm.value.cssClass || "",
      additionalAttribute: componentItemForm.value.additionalAttribute || "",
      defaultValue: componentItemForm.value.defaultValue || "",
      lookup_queryMapping: componentItemForm.value.lookup_queryMapping || "",
      visible: componentItemForm.value.visible ? 1 : 0,
      active: componentItemForm.value.active ? 1 : 0,
      order: componentItemForm.value.order || 1,
      pageId: selectedPage.value,
    };

    if (isComponentItemEditMode.value && editingComponentItemId.value) {
      // Update existing record
      response = await useFetch(`/api/component-item-editor/${editingComponentItemId.value}`, {
        method: "PUT",
        body: formData,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/component-item-editor", {
        method: "POST",
        body: formData,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isComponentItemEditMode.value ? "Component Item updated successfully" : "Component Item created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchComponentItems(selectedPage.value);
      
      // Reset form and close modal
      showComponentItemModal.value = false;
      componentItemForm.value = {
        name: "",
        title: "",
        component: "",
        componentId: null,
        type: "",
        cssClass: "",
        additionalAttribute: "",
        defaultValue: "",
        lookup_queryMapping: "",
        visible: true,
        active: true,
        order: 1,
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save component item",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving component item:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving component item",
      icon: "error",
    });
  } finally {
    componentItemLoading.value = false;
  }
};

// Cancel Component Item form
const handleCancelComponentItem = () => {
  showComponentItemModal.value = false;
  componentItemForm.value = {
    name: "",
    title: "",
    component: "",
    componentId: null,
    type: "",
    cssClass: "",
    additionalAttribute: "",
    defaultValue: "",
    lookup_queryMapping: "",
    visible: true,
    active: true,
    order: 1,
  };
};

// Delete Component Item function
const handleDeleteComponentItem = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete component item "${item.name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      componentItemLoading.value = true;
      const response = await useFetch(`/api/component-item-editor/${item.id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Component Item has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchComponentItems(selectedPage.value);
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete component item",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting component item:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting component item",
        icon: "error",
      });
    } finally {
      componentItemLoading.value = false;
    }
  }
};

// ========== Component Item Import Functions ==========

// Fetch component item migration files
const fetchComponentItemMigrationFiles = async () => {
  try {
    componentItemImportLoading.value = true;
    const { data } = await useFetch("/api/component-item-editor/migration-files", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      componentItemMigrationFiles.value = data.value.data || [];
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch migration files",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component item migration files:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching migration files",
      icon: "error",
    });
  } finally {
    componentItemImportLoading.value = false;
  }
};

// Open component item import modal
const handleComponentItemImport = async () => {
  componentItemSelectedFiles.value = [];
  componentItemImportSearchKeyword.value = "";
  showComponentItemImportModal.value = true;
  await fetchComponentItemMigrationFiles();
};

// Close component item import modal
const handleCloseComponentItemImport = () => {
  showComponentItemImportModal.value = false;
  componentItemSelectedFiles.value = [];
  componentItemImportSearchKeyword.value = "";
};

// Toggle component item file selection
const toggleComponentItemFileSelection = (fileName) => {
  const index = componentItemSelectedFiles.value.indexOf(fileName);
  if (index > -1) {
    componentItemSelectedFiles.value.splice(index, 1);
  } else {
    componentItemSelectedFiles.value.push(fileName);
  }
};

// Toggle select all component item files
const toggleSelectAllComponentItemFiles = () => {
  const filteredFiles = getFilteredComponentItemFiles();
  if (componentItemSelectedFiles.value.length === filteredFiles.length) {
    componentItemSelectedFiles.value = [];
  } else {
    componentItemSelectedFiles.value = [...filteredFiles.map((f) => f.name)];
  }
};

// Get filtered component item files based on search
const getFilteredComponentItemFiles = () => {
  if (!componentItemImportSearchKeyword.value || componentItemImportSearchKeyword.value.trim() === "") {
    return componentItemMigrationFiles.value;
  }
  const keyword = componentItemImportSearchKeyword.value.toLowerCase().trim();
  return componentItemMigrationFiles.value.filter((file) =>
    file.name.toLowerCase().includes(keyword)
  );
};

// Execute component item import
const executeComponentItemImport = async () => {
  if (componentItemSelectedFiles.value.length === 0) {
    $swal.fire({
      title: "No Files Selected",
      text: "Please select at least one file to import",
      icon: "warning",
    });
    return;
  }

  try {
    componentItemImportLoading.value = true;
    const response = await useFetch("/api/component-item-editor/import", {
      method: "POST",
      body: { files: componentItemSelectedFiles.value },
      initialCache: false,
    });

    if (response.data.value?.statusCode === 200) {
      const data = response.data.value.data;
      let message = response.data.value.message;
      
      if (data.errorsList && data.errorsList.length > 0) {
        message += "\n\nErrors:\n" + data.errorsList.slice(0, 10).join("\n");
        if (data.errorsList.length > 10) {
          message += `\n... and ${data.errorsList.length - 10} more errors`;
        }
      }

      await $swal.fire({
        title: "Import Completed",
        text: message,
        icon: "success",
        width: "600px",
      });

      // Close modal and refresh data
      handleCloseComponentItemImport();
      if (selectedPage.value) {
        await fetchComponentItems(selectedPage.value);
      }
    } else {
      $swal.fire({
        title: "Import Failed",
        text: response.data.value?.message || "Failed to import component items",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error importing component items:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while importing component items",
      icon: "error",
    });
  } finally {
    componentItemImportLoading.value = false;
  }
};

// Handle Component Item checkbox change - auto update
const handleComponentItemCheckboxChange = async (item, field, newCheckedValue) => {
  try {
    const currentValue = item[field] === 1 || item[field] === true;
    const newValue = newCheckedValue ? 1 : 0;

    // Optimistically update the UI
    const componentItemIndex = componentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentItemIndex !== -1) {
      componentItemList.value[componentItemIndex][field] = newValue;
    }
    
    const filteredIndex = filteredComponentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentItemList.value[filteredIndex][field] = newValue;
    }

    // Prepare update data with current values
    const updateData = {
      name: item.name,
      title: item.title,
      component: item.component || "",
      type: item.type || "",
      visible: field === 'visible' ? newValue : (item.visible === 1 || item.visible === true ? 1 : 0),
      active: field === 'active' ? newValue : (item.active === 1 || item.active === true ? 1 : 0),
      order: item.order || 1,
    };

    // Call API to update
    const response = await useFetch(`/api/component-item-editor/${item.id}`, {
      method: "PUT",
      body: updateData,
      initialCache: false,
    });

    if (response.data.value?.statusCode !== 200) {
      // Revert on error
      if (componentItemIndex !== -1) {
        componentItemList.value[componentItemIndex][field] = currentValue ? 1 : 0;
      }
      if (filteredIndex !== -1) {
        filteredComponentItemList.value[filteredIndex][field] = currentValue ? 1 : 0;
      }
      
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to update component item",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error updating component item checkbox:", error);
    
    // Revert on error
    const currentValue = item[field] === 1 || item[field] === true;
    const componentItemIndex = componentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentItemIndex !== -1) {
      componentItemList.value[componentItemIndex][field] = currentValue ? 1 : 0;
    }
    
    const filteredIndex = filteredComponentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentItemList.value[filteredIndex][field] = currentValue ? 1 : 0;
    }
    
    $swal.fire({
      title: "Error",
      text: "An error occurred while updating component item",
      icon: "error",
    });
  }
};

// Handle Component Item order change - auto update
const handleComponentItemOrderChange = async (item, newOrderValue) => {
  try {
    const currentOrder = item.order || 1;
    const newOrder = parseInt(newOrderValue) || 1;

    // Skip if value hasn't changed
    if (newOrder === currentOrder) {
      return;
    }

    // Validate order value
    if (newOrder < 1) {
      $swal.fire({
        title: "Validation Error",
        text: "Order must be a positive number",
        icon: "warning",
      });
      // Revert to original value
      const componentItemIndex = componentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
      if (componentItemIndex !== -1) {
        componentItemList.value[componentItemIndex].order = currentOrder;
      }
      const filteredIndex = filteredComponentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
      if (filteredIndex !== -1) {
        filteredComponentItemList.value[filteredIndex].order = currentOrder;
      }
      return;
    }

    // Optimistically update the UI
    const componentItemIndex = componentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentItemIndex !== -1) {
      componentItemList.value[componentItemIndex].order = newOrder;
    }
    
    const filteredIndex = filteredComponentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentItemList.value[filteredIndex].order = newOrder;
    }

    // Prepare update data with current values
    const updateData = {
      name: item.name,
      title: item.title,
      component: item.component || "",
      type: item.type || "",
      visible: item.visible === 1 || item.visible === true ? 1 : 0,
      active: item.active === 1 || item.active === true ? 1 : 0,
      order: newOrder,
    };

    // Call API to update
    const response = await useFetch(`/api/component-item-editor/${item.id}`, {
      method: "PUT",
      body: updateData,
      initialCache: false,
    });

    if (response.data.value?.statusCode !== 200) {
      // Revert on error
      if (componentItemIndex !== -1) {
        componentItemList.value[componentItemIndex].order = currentOrder;
      }
      if (filteredIndex !== -1) {
        filteredComponentItemList.value[filteredIndex].order = currentOrder;
      }
      
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to update component item order",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error updating component item order:", error);
    
    // Revert on error
    const currentOrder = item.order || 1;
    const componentItemIndex = componentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (componentItemIndex !== -1) {
      componentItemList.value[componentItemIndex].order = currentOrder;
    }
    
    const filteredIndex = filteredComponentItemList.value.findIndex((c) => parseInt(c.id) === parseInt(item.id));
    if (filteredIndex !== -1) {
      filteredComponentItemList.value[filteredIndex].order = currentOrder;
    }
    
    $swal.fire({
      title: "Error",
      text: "An error occurred while updating component item order",
      icon: "error",
    });
  }
};

// Watch selectedPage and fetch component items when it changes
watch(selectedPage, (newPageId) => {
  if (newPageId) {
    fetchComponentItems(newPageId);
  } else {
    componentItemList.value = [];
    filteredComponentItemList.value = [];
  }
});

// Watch componentId to update component name when it changes
watch(() => componentItemForm.value.componentId, (newComponentId) => {
  if (newComponentId) {
    // Find the component name for the selected componentId
    const selectedComponent = componentListFull.value.find((c) => parseInt(c.id) === parseInt(newComponentId));
    if (selectedComponent) {
      componentItemForm.value.component = selectedComponent.name;
    } else {
      // If not found in componentListFull, try to fetch it
      const fallbackComponent = componentList.value.find((c) => parseInt(c.id) === parseInt(newComponentId));
      if (fallbackComponent && fallbackComponent.name) {
        componentItemForm.value.component = fallbackComponent.name;
      }
    }
  } else {
    componentItemForm.value.component = "";
  }
}, { immediate: true });
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Page List Panel -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Page List</div>
      </template>
      <template #body>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page:</label>
            <div class="relative">
              <FormKit
                :model-value="selectedPageDisplay"
                type="text"
                placeholder="Select Page"
                readonly
                @click="openSelectMenuModal"
                outer-class="mb-0"
                input-class="cursor-pointer"
              />
              <button
                v-if="selectedPageDisplay"
                type="button"
                @click.stop="clearPageSelection"
                class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Icon
                  name="material-symbols:close"
                  class="!w-4 !h-4 text-gray-500"
                />
              </button>
              <button
                type="button"
                @click.stop="openSelectMenuModal"
                class="absolute right-8 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Icon
                  name="material-symbols:arrow-drop-down"
                  class="!w-4 !h-4 text-gray-500"
                />
              </button>
            </div>
          </div>
          <div class="pt-6">
            <rs-button variant="primary" @click="handleShowList">
              Show List
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Component Panel -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Component</div>
          <Icon
            name="material-symbols:help-outline"
            class="text-gray-500 cursor-pointer"
            size="20"
          />
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
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="component-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <div v-else-if="!selectedPage" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">Please select a page and click "Show List" to view components</p>
            </div>
            <div v-else-if="filteredComponentList.length === 0" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">No components found for the selected page</p>
            </div>
            <rs-table
              v-else
              :key="`component-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredComponentList"
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
              <template v-slot:id="data">
                {{ data.value.id }}
              </template>
              <template v-slot:name="data">
                {{ data.value.name }}
              </template>
              <template v-slot:title="data">
                {{ data.value.title }}
              </template>
              <template v-slot:type="data">
                {{ data.value.type }}
              </template>
              <template v-slot:cssClass="data">
                {{ data.value.cssClass || "-" }}
              </template>
              <template v-slot:collapseEnable="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.collapseEnable === 1 || data.value.collapseEnable === true"
                    @change="handleCheckboxChange(data.value, 'collapseEnable', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:collapseByDefault="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.collapseByDefault === 1 || data.value.collapseByDefault === true"
                    @change="handleCheckboxChange(data.value, 'collapseByDefault', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:visible="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.visible === 1 || data.value.visible === true"
                    @change="handleCheckboxChange(data.value, 'visible', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:active="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.active === 1 || data.value.active === true"
                    @change="handleCheckboxChange(data.value, 'active', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:order="data">
                <input
                  type="number"
                  :value="data.value.order"
                  @blur="handleOrderChange(data.value, $event.target.value)"
                  @keyup.enter="handleOrderChange(data.value, $event.target.value); $event.target.blur()"
                  min="1"
                  class="w-16 px-2 py-1 border rounded text-sm focus:ring-primary focus:border-primary"
                />
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleBulkEdit(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Bulk Edit"
                  >
                    <i class="fas fa-table p-1 pointer"></i>
                  </button>
                  <button
                    @click="handlePin(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Pin"
                  >
                    <i class="fas fa-thumbtack p-1 pointer"></i>
                  </button>
                  <button
                    @click="handleDuplicate(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Duplicate"
                  >
                    <i class="fas fa-copy p-1 pointer"></i>
                  </button>
                  <button
                    @click="handleDuplicateAndLink(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Duplicate and Link to Other Page"
                  >
                    <i class="fas fa-share-alt p-1 pointer"></i>
                  </button>
                  <button
                    @click="handleEdit(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <i class="fas fa-edit p-1 pointer"></i>
                  </button>
                  <button
                    @click="handleDelete(data.value)"
                    class="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt p-1 pointer"></i>
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
              <rs-button variant="info" @click="handleImport">
                <Icon name="material-symbols:upload-file" class="mr-2" size="1rem" />
                Import from Migration
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

    <!-- Component Item Panel -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Component Item</div>
          <Icon
            name="material-symbols:help-outline"
            class="text-gray-500 cursor-pointer"
            size="20"
          />
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
                v-model="componentItemPageSize"
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
              <FormKit
                v-model="componentItemSearchKeyword"
                type="text"
                placeholder="Search..."
                outer-class="mb-0"
              >
                <template #suffix>
                  <button
                    v-if="componentItemSearchKeyword"
                    type="button"
                    @click="componentItemSearchKeyword = ''"
                    class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon
                      name="material-symbols:close"
                      class="!w-4 !h-4 text-gray-500"
                    />
                  </button>
                </template>
              </FormKit>
            </div>
          </div>

          <!-- Table with built-in search and pagination -->
          <div class="component-item-table-wrapper">
            <div v-if="componentItemLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <div v-else-if="!selectedPage" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">Please select a page and click "Show List" to view component items</p>
            </div>
            <div v-else-if="filteredComponentItemList.length === 0" class="text-center py-8">
              <p class="text-gray-600 dark:text-gray-400">No component items found for the selected page</p>
            </div>
            <rs-table
              v-else
              :key="`component-item-table-${componentItemSearchKeyword || 'all'}-${componentItemPageSize}`"
              :data="filteredComponentItemList"
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
              :pageSize="componentItemPageSize"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:id="data">
                {{ data.value.id }}
              </template>
              <template v-slot:name="data">
                {{ data.value.name }}
              </template>
              <template v-slot:title="data">
                {{ data.value.title }}
              </template>
              <template v-slot:component="data">
                <span class="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded text-sm">
                  {{ data.value.component }}
                </span>
              </template>
              <template v-slot:type="data">
                {{ data.value.type }}
              </template>
              <template v-slot:visible="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.visible === 1 || data.value.visible === true"
                    @change="handleComponentItemCheckboxChange(data.value, 'visible', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:active="data">
                <div class="flex justify-center">
                  <input
                    type="checkbox"
                    :checked="data.value.active === 1 || data.value.active === true"
                    @change="handleComponentItemCheckboxChange(data.value, 'active', $event.target.checked)"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </template>
              <template v-slot:order="data">
                <input
                  type="number"
                  :value="data.value.order"
                  @blur="handleComponentItemOrderChange(data.value, $event.target.value)"
                  @keyup.enter="handleComponentItemOrderChange(data.value, $event.target.value); $event.target.blur()"
                  min="1"
                  class="w-16 px-2 py-1 border rounded text-sm focus:ring-primary focus:border-primary"
                />
              </template>
              <template v-slot:action="data">
                <div class="flex gap-2 justify-end">
                  <button
                    @click="handleEditComponentItem(data.value)"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <i class="fas fa-edit p-1 pointer"></i>
                  </button>
                  <button
                    @click="handleDeleteComponentItem(data.value)"
                    class="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt p-1 pointer"></i>
                  </button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- Custom Footer with Records Count and Buttons -->
          <div class="flex justify-between items-center pt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ totalComponentItemRecords }} records
            </div>
            <div class="flex items-center gap-2">
              <rs-button variant="info" @click="handleComponentItemImport">
                <Icon name="material-symbols:upload-file" class="mr-2" size="1rem" />
                Import from Migration
              </rs-button>
              <rs-button variant="primary" @click="handleAddComponentItem">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Select Menu Modal -->
    <rs-modal
      v-model="showSelectMenuModal"
      title="Select Menu"
      size="lg"
      dialog-class="select-menu-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg select-menu-modal-header">
          <h4 class="text-base font-semibold text-white">Select Menu</h4>
          <Icon
            @click="showSelectMenuModal = false"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <div class="space-y-4 py-2">
          <!-- Search Input -->
          <div class="flex items-center gap-2">
            <label class="w-32 text-xs font-medium">Search:</label>
            <div class="flex-1">
              <FormKit
                v-model="menuSearchKeyword"
                type="text"
                placeholder="Search by Page ID, Title, or Menu..."
                outer-class="mb-0"
              />
            </div>
          </div>

          <!-- Page List -->
          <div class="max-h-96 overflow-y-auto border rounded p-2">
            <div v-if="filteredPages.length === 0" class="text-center py-8 text-gray-500">
              No pages found
            </div>
            <div
              v-else
              v-for="page in filteredPages"
              :key="page.pageId"
              @click="selectPage(page)"
              class="p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors last:border-b-0"
            >
              <div class="font-medium text-sm">
                [{{ page.pageId }}] {{ page.pageTitle }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ page.menu || "-" }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="showSelectMenuModal = false">
            Cancel
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Component Modal -->
    <rs-modal
      v-model="showComponentModal"
      title="Component"
      size="lg"
      dialog-class="component-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg component-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isEditMode ? 'Edit Component' : 'Add Component' }}
          </h4>
          <Icon
            @click="handleCancelComponent"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveComponent">
          <div class="space-y-2 py-2">
            <!-- Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.title"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Name -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Name<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.name"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
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

            <!-- Type -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Type:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.type"
                  type="select"
                  :options="componentTypeOptions"
                  placeholder="Select a type"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Collapse Enable & Collapse By Default (side by side) -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Collapse Enable:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.collapseEnable"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Collapse By Default:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.collapseByDefault"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Visible & Active (side by side) -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Visible:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.visible"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Active<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.active"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Order -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Order:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.order"
                  type="number"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Query Mapping (only in edit mode) -->
            <div v-if="isEditMode" class="flex items-start gap-2">
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
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelComponent">
            Cancel
          </rs-button>
          <rs-button variant="primary" size="sm" @click="handleSaveComponent">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Import Components Modal -->
    <rs-modal
      v-model="showImportModal"
      title="Import Components"
      size="lg"
      dialog-class="import-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg import-modal-header">
          <h4 class="text-base font-semibold text-white">Import Components from Migration</h4>
          <Icon
            @click="handleCloseImport"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <div class="space-y-4 py-2">
          <!-- Search Files -->
          <div class="flex items-center gap-2">
            <label class="w-32 text-xs font-medium">Search:</label>
            <div class="flex-1">
              <FormKit
                v-model="importSearchKeyword"
                type="text"
                placeholder="Search files..."
                outer-class="mb-0"
              />
            </div>
          </div>

          <!-- Select All -->
          <div class="flex items-center gap-2 pb-2 border-b">
            <input
              type="checkbox"
              :checked="selectedFiles.length > 0 && selectedFiles.length === getFilteredFiles().length"
              @change="toggleSelectAll"
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label class="text-xs font-medium cursor-pointer" @click="toggleSelectAll">Select All</label>
            <span class="text-xs text-gray-500">
              {{ selectedFiles.length }} of {{ getFilteredFiles().length }} files selected
            </span>
          </div>

          <!-- File List -->
          <div v-if="importLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Loading files...</p>
          </div>
          <div v-else-if="getFilteredFiles().length === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">
              {{ importSearchKeyword ? "No files found matching your search" : "No migration files found" }}
            </p>
          </div>
          <div v-else class="max-h-96 overflow-y-auto border rounded p-2 space-y-2">
            <div
              v-for="file in getFilteredFiles()"
              :key="file.name"
              class="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <input
                type="checkbox"
                :checked="selectedFiles.includes(file.name)"
                @change="toggleFileSelection(file.name)"
                @click.stop
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{{ file.name }}</div>
                <div class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }} • Modified: {{ new Date(file.modified).toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCloseImport" :disabled="importLoading">
            Cancel
          </rs-button>
          <rs-button 
            variant="primary" 
            size="sm" 
            @click="executeImport" 
            :disabled="importLoading || selectedFiles.length === 0"
          >
            <Icon v-if="importLoading" name="material-symbols:hourglass-empty" class="mr-2 animate-spin" size="1rem" />
            <Icon v-else name="material-symbols:upload-file" class="mr-2" size="1rem" />
            Import Selected ({{ selectedFiles.length }})
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Component Item Modal -->
    <rs-modal
      v-model="showComponentItemModal"
      title="Component Item"
      size="lg"
      dialog-class="component-item-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg component-item-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isComponentItemEditMode ? 'Edit Component Item' : 'Add Component Item' }}
          </h4>
          <Icon
            @click="handleCancelComponentItem"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveComponentItem">
          <div class="space-y-2 py-2">
            <!-- Name -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Name<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.name"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.title"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Component -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Component<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.componentId"
                  type="select"
                  :options="getAvailableComponents"
                  placeholder="Select a component"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Type -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Type:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.type"
                  type="select"
                  :options="componentItemTypeOptions"
                  placeholder="Select a type"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- CSS Class -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">CSS Class:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.cssClass"
                  type="text"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Additional Attribute -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Additional Attribute:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.additionalAttribute"
                  type="text"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Default Value -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Default Value:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.defaultValue"
                  type="text"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Lookup Query Mapping -->
            <div class="flex items-start gap-2">
              <div class="w-32 flex items-center gap-1 pt-2">
                <label class="text-xs font-medium">Lookup Query Mapping:</label>
                <Icon
                  name="material-symbols:info-outline"
                  class="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-primary"
                  size="16"
                  @click="showLookupQueryMappingInfo"
                />
              </div>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.lookup_queryMapping"
                  type="textarea"
                  rows="5"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Visible -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Visible:</label>
              <div class="flex-1">
                <input
                  type="checkbox"
                  v-model="componentItemForm.visible"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <!-- Active -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Active<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <input
                  type="checkbox"
                  v-model="componentItemForm.active"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <!-- Order -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Order:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.order"
                  type="number"
                  min="1"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelComponentItem">
            Cancel
          </rs-button>
          <rs-button variant="primary" size="sm" @click="handleSaveComponentItem">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Import Component Items Modal -->
    <rs-modal
      v-model="showComponentItemImportModal"
      title="Import Component Items"
      size="lg"
      dialog-class="component-item-import-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg component-item-import-modal-header">
          <h4 class="text-base font-semibold text-white">Import Component Items from Migration</h4>
          <Icon
            @click="handleCloseComponentItemImport"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <div class="space-y-4 py-2">
          <!-- Search Files -->
          <div class="flex items-center gap-2">
            <label class="w-32 text-xs font-medium">Search:</label>
            <div class="flex-1">
              <FormKit
                v-model="componentItemImportSearchKeyword"
                type="text"
                placeholder="Search files..."
                outer-class="mb-0"
              />
            </div>
          </div>

          <!-- Select All -->
          <div class="flex items-center gap-2 pb-2 border-b">
            <input
              type="checkbox"
              :checked="componentItemSelectedFiles.length > 0 && componentItemSelectedFiles.length === getFilteredComponentItemFiles().length"
              @change="toggleSelectAllComponentItemFiles"
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <label class="text-xs font-medium cursor-pointer" @click="toggleSelectAllComponentItemFiles">Select All</label>
            <span class="text-xs text-gray-500">
              {{ componentItemSelectedFiles.length }} of {{ getFilteredComponentItemFiles().length }} files selected
            </span>
          </div>

          <!-- File List -->
          <div v-if="componentItemImportLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Loading files...</p>
          </div>
          <div v-else-if="getFilteredComponentItemFiles().length === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">
              {{ componentItemImportSearchKeyword ? "No files found matching your search" : "No migration files found" }}
            </p>
          </div>
          <div v-else class="max-h-96 overflow-y-auto border rounded p-2 space-y-2">
            <div
              v-for="file in getFilteredComponentItemFiles()"
              :key="file.name"
              class="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <input
                type="checkbox"
                :checked="componentItemSelectedFiles.includes(file.name)"
                @change="toggleComponentItemFileSelection(file.name)"
                @click.stop
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate">{{ file.name }}</div>
                <div class="text-xs text-gray-500">
                  {{ formatFileSize(file.size) }} • Modified: {{ new Date(file.modified).toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCloseComponentItemImport" :disabled="componentItemImportLoading">
            Cancel
          </rs-button>
          <rs-button 
            variant="primary" 
            size="sm" 
            @click="executeComponentItemImport" 
            :disabled="componentItemImportLoading || componentItemSelectedFiles.length === 0"
          >
            <Icon v-if="componentItemImportLoading" name="material-symbols:hourglass-empty" class="mr-2 animate-spin" size="1rem" />
            <Icon v-else name="material-symbols:upload-file" class="mr-2" size="1rem" />
            Import Selected ({{ componentItemSelectedFiles.length }})
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.component-table-wrapper :deep(.table-header) {
  display: none;
}

/* Make Collapse Enable and Collapse By Default headers wrap to 2 lines */
/* Column order: no, id, title, name, cssClass, type, collapseEnable, collapseByDefault, visible, active, order, action */
.component-table-wrapper :deep(thead th:nth-child(7)),
.component-table-wrapper :deep(thead th:nth-child(8)) {
  max-width: 100px !important;
  min-width: 100px !important;
  width: 100px !important;
  white-space: normal !important;
  word-break: break-word !important;
  line-height: 1.3 !important;
  text-align: center !important;
  padding: 0.5rem 0.25rem !important;
}

/* Also make the corresponding td cells narrower */
.component-table-wrapper :deep(tbody td:nth-child(7)),
.component-table-wrapper :deep(tbody td:nth-child(8)) {
  max-width: 100px !important;
  min-width: 100px !important;
  width: 100px !important;
  text-align: center !important;
}

/* Hide default table header for component item table */
.component-item-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Component modal */
.component-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.component-modal-custom .modal-header > :last-child:not(.component-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.component-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.component-modal-custom .component-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Select Menu Modal Styles */
.select-menu-modal-custom {
  width: 700px !important;
}

.select-menu-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.select-menu-modal-custom .select-menu-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Import Modal Styles */
.import-modal-custom {
  width: 700px !important;
}

/* Hide default close icon when custom header is used */
.import-modal-custom .modal-header > :last-child:not(.import-modal-header) {
  display: none !important;
}

.import-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.import-modal-custom .import-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Component Item Modal Styles */
.component-item-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.component-item-modal-custom .modal-header > :last-child:not(.component-item-modal-header) {
  display: none !important;
}

.component-item-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.component-item-modal-custom .component-item-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Component Item Import Modal Styles */
.component-item-import-modal-custom {
  width: 700px !important;
}

/* Hide default close icon when custom header is used */
.component-item-import-modal-custom .modal-header > :last-child:not(.component-item-import-modal-header) {
  display: none !important;
}

.component-item-import-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.component-item-import-modal-custom .component-item-import-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>
