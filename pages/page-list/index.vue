<script setup>
definePageMeta({
  title: "Page List",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Page Editor",
      path: "/pageeditor",
    },
    {
      name: "Page List",
      path: "/page-list",
    },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const pageList = ref([]);
const loading = ref(false);

// Search and filter state
const searchKeyword = ref("");
const pageSize = ref(10);

// Add/Edit Page modal state
const showPageModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);

// Available menus for select dropdown
const availableMenus = ref([]);

// Import modal state
const showImportModal = ref(false);
const migrationFiles = ref([]);
const selectedFiles = ref([]);
const importLoading = ref(false);
const importSearchKeyword = ref("");

// Page form data
const pageForm = ref({
  pageTitle: "",
  menu: "",
  status: "ACTIVE",
});

// Filtered data
const filteredPageList = ref([...pageList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...pageList.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    
    filtered = filtered.filter((item) => {
      const pageId = item.pageId?.toString().toLowerCase() || "";
      const pageTitle = (item.pageTitle || "").toLowerCase();
      const menu = (item.menu || "").toLowerCase();
      const status = (item.status || "").toLowerCase();

      return (
        pageId.includes(keyword) ||
        pageTitle.includes(keyword) ||
        menu.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }

  // Update the filtered list
  filteredPageList.value = [];
  nextTick(() => {
    filteredPageList.value = [...filtered];
  });
};

// Total records count
const totalRecords = computed(() => filteredPageList.value.length);

// Menu options for dropdown - include current menu value in view mode
const menuOptions = computed(() => {
  const options = [
    { label: 'Select Menu', value: '' },
    ...availableMenus.value
  ];
  
  // In view mode, ensure the current menu value is in the options
  if (isViewMode.value && pageForm.value.menu && pageForm.value.menu.trim() !== '') {
    const currentMenu = pageForm.value.menu;
    const exists = options.some(opt => opt.value === currentMenu);
    if (!exists) {
      options.push({ label: currentMenu, value: currentMenu });
    }
  }
  
  return options;
});

// Watch searchKeyword and apply filters when it changes
watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

// Fetch pages from API
const fetchPages = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/page-editor", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      pageList.value = data.value.data || [];
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch pages",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching pages:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching pages",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Fetch available menus
const fetchAvailableMenus = async (excludePageId = null) => {
  try {
    const query = excludePageId ? `?excludePageId=${excludePageId}` : "";
    const { data } = await useFetch(`/api/page-editor/available-menus${query}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      availableMenus.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching available menus:", error);
  }
};

// Initialize on mount
onMounted(() => {
  fetchPages();
  fetchAvailableMenus();
});

// View function
const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.pageId;
  pageForm.value = {
    pageTitle: item.pageTitle || "",
    menu: item.menu || "",
    status: item.status || "ACTIVE",
  };
  showPageModal.value = true;
};

// Edit function
const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.pageId;
  pageForm.value = {
    pageTitle: item.pageTitle || "",
    menu: item.menu || "",
    status: item.status || "ACTIVE",
  };
  // Refresh available menus (exclude current page ID so its menu is available)
  fetchAvailableMenus(item.pageId);
  showPageModal.value = true;
};

// Navigate to Component Editor (without exposing parameters in URL)
const handleComponentEditor = (item) => {
  // Store pageId in sessionStorage instead of URL query parameter
  if (process.client) {
    sessionStorage.setItem('componentEditorPageId', JSON.stringify({
      pageId: item.pageId,
      timestamp: Date.now(),
    }));
  }
  
  // Navigate to Component Editor without query parameters
  navigateTo("/pageeditor/component-editor");
};

// Add function
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  pageForm.value = {
    pageTitle: "",
    menu: "",
    status: "ACTIVE",
  };
  // Refresh available menus
  fetchAvailableMenus();
  showPageModal.value = true;
};

// Save Page
const handleSavePage = async () => {
  // Validation
  if (!pageForm.value.pageTitle || !pageForm.value.status) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/page-editor/${editingId.value}`, {
        method: "PUT",
        body: pageForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/page-editor", {
        method: "POST",
        body: pageForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Page updated successfully" : "Page created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchPages();
      await fetchAvailableMenus();
      
      // Reset form and close modal
      showPageModal.value = false;
      pageForm.value = {
        pageTitle: "",
        menu: "",
        status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save page",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving page:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving page",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Page form
const handleCancelPage = () => {
  showPageModal.value = false;
  isViewMode.value = false;
  pageForm.value = {
    pageTitle: "",
    menu: "",
    status: "ACTIVE",
  };
};

// Delete function
const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete page "${item.pageTitle}"?`,
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
      const response = await useFetch(`/api/page-editor/${item.pageId}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Page has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchPages();
        await fetchAvailableMenus();
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete page",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting page",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
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

// Fetch migration files
const fetchMigrationFiles = async () => {
  try {
    importLoading.value = true;
    const { data } = await useFetch("/api/page-editor/migration-files", {
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
    const response = await useFetch("/api/page-editor/import", {
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
      await fetchPages();
      await fetchAvailableMenus();
    } else {
      $swal.fire({
        title: "Import Failed",
        text: response.data.value?.message || "Failed to import pages",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error importing pages:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while importing pages",
      icon: "error",
    });
  } finally {
    importLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Page List</div>
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
          <div class="page-list-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`page-list-table-${searchKeyword || 'all'}`"
              :data="filteredPageList"
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
              <template v-slot:pageId="data">
                {{ data.value.pageId }}
              </template>
              <template v-slot:pageTitle="data">
                {{ data.value.pageTitle }}
              </template>
              <template v-slot:menu="data">
                {{ data.value.menu || "-" }}
              </template>
              <template v-slot:status="data">
                <span
                  :class="{
                    'text-green-600 dark:text-green-400': data.value.status === 'ACTIVE',
                    'text-red-600 dark:text-red-400': data.value.status === 'INACTIVE',
                  }"
                >
                  {{ data.value.status }}
                </span>
              </template>
              <template v-slot:action="data">
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
                    @click="handleComponentEditor(data.value)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Component Editor"
                  >
                    <Icon
                      name="tdesign:system-components"
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

    <!-- Add/Edit Page Modal -->
    <rs-modal
      v-model="showPageModal"
      title="Page"
      size="lg"
      dialog-class="page-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg page-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Page' : (isEditMode ? 'Edit Page' : 'Add Page') }}
          </h4>
          <Icon
            @click="handleCancelPage"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSavePage">
          <div class="space-y-2 py-2">
            <!-- Page Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Page Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="pageForm.pageTitle"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Menu (Select Dropdown) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Menu:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="pageForm.menu"
                  type="select"
                  :options="menuOptions"
                  :disabled="isViewMode"
                  placeholder="Select Menu"
                  outer-class="mb-0"
                />
                <button
                  v-if="pageForm.menu && !isViewMode"
                  type="button"
                  @click="pageForm.menu = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Status (Dropdown) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="pageForm.status"
                  type="select"
                  :options="[
                    { label: 'ACTIVE', value: 'ACTIVE' },
                    { label: 'INACTIVE', value: 'INACTIVE' },
                  ]"
                  :disabled="isViewMode"
                  placeholder="Select Status"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="pageForm.status && !isViewMode"
                  type="button"
                  @click="pageForm.status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelPage">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSavePage">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Import Pages Modal -->
    <rs-modal
      v-model="showImportModal"
      title="Import Pages"
      size="lg"
      dialog-class="import-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg import-modal-header">
          <h4 class="text-base font-semibold text-white">Import Pages from Migration</h4>
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
              {{ importSearchKeyword ? 'No files found matching your search' : 'No JSON files found in Migration folder' }}
            </p>
          </div>
          <div v-else class="max-h-96 overflow-y-auto space-y-2">
            <div
              v-for="file in getFilteredFiles()"
              :key="file.name"
              @click="toggleFileSelection(file.name)"
              class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              :class="{
                'bg-primary/10 border-primary': selectedFiles.includes(file.name),
                'border-gray-200 dark:border-gray-700': !selectedFiles.includes(file.name)
              }"
            >
              <input
                type="checkbox"
                :checked="selectedFiles.includes(file.name)"
                @change="toggleFileSelection(file.name)"
                @click.stop
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                  {{ file.name }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatFileSize(file.size) }} • Modified: {{ new Date(file.modified).toLocaleString() }}
                </div>
              </div>
              <Icon
                name="material-symbols:file-present"
                class="text-gray-400"
                size="20"
              />
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
  </div>
</template>

<style scoped>
/* Hide default table header since we're using custom header */
.page-list-table-wrapper :deep(.table-header) {
  display: none;
}
</style>

<style>
/* Custom width for Page modal */
.page-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.page-modal-custom .modal-header > :last-child:not(.page-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.page-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.page-modal-custom .page-modal-header {
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
</style>
