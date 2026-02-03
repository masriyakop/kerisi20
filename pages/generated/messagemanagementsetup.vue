<script setup>
definePageMeta({
  title: "Message Type",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();

// Table data
const tableData = ref([]);
const loading = ref(false);
const pageSize = ref(10);
const searchKeyword = ref("");

// Filtered data
const filteredData = ref([]);

// Smart Filter state
const showSmartFilter = ref(false);
const smartFilter = ref({});
const originalFilter = ref({});

// Top Filter state
const topFilter = ref({});

// Form modal state
const showFormModal = ref(false);
const isEditMode = ref(false);
const isViewMode = ref(false);
const editingId = ref(null);
const formData = ref({});

// Fetch data function
const fetchData = async () => {
  try {
    loading.value = true;
    const query = {
      ...topFilter.value,
      page: 1,
      pageSize: pageSize.value,
    };

    // Remove empty values
    Object.keys(query).forEach((key) => {
      if (query[key] === "" || query[key] === null) {
        delete query[key];
      }
    });


    const { data: data0 } = await useFetch("api/page-generated/2979/9649", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data0.value?.statusCode === 200) {
      tableData.value = data0.value.data || [];
      applyFilters();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to fetch data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Apply filters
const applyFilters = () => {
  let filtered = [...tableData.value];

  // Apply search filter
  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return Object.values(item).some((val) =>
        String(val || "").toLowerCase().includes(keyword)
      );
    });
  }

  // Apply smart filter
  Object.keys(smartFilter.value).forEach((key) => {
    if (smartFilter.value[key]) {
      filtered = filtered.filter((item) => {
        const itemValue = String(item[key] || "").toLowerCase();
        return itemValue.includes(String(smartFilter.value[key]).toLowerCase());
      });
    }
  });

  filteredData.value = filtered;
};

// Watch searchKeyword
watch(searchKeyword, () => {
  applyFilters();
});

// Smart Filter handlers
const handleFilter = () => {
  originalFilter.value = { ...smartFilter.value };
  showSmartFilter.value = true;
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  applyFilters();
};

const handleFilterClose = () => {
  smartFilter.value = { ...originalFilter.value };
  showSmartFilter.value = false;
};

const handleFilterReset = () => {
  smartFilter.value = {};
  originalFilter.value = {};
};

// Form handlers
const handleAdd = () => {
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  formData.value = {};
  showFormModal.value = true;
};

const handleEdit = (item) => {
  isEditMode.value = true;
  isViewMode.value = false;
  editingId.value = item.id;
  formData.value = { ...item };
  showFormModal.value = true;
};

const handleView = (item) => {
  isViewMode.value = true;
  isEditMode.value = false;
  editingId.value = item.id;
  formData.value = { ...item };
  showFormModal.value = true;
};

const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const apiPath = "api/page-generated/2979/9649";
      await useFetch(`${apiPath}/${item.id}`, {
        method: "DELETE",
        initialCache: false,
      });
      await fetchData();
      $swal.fire({
        title: "Success",
        text: "Record deleted successfully",
        icon: "success",
        timer: 2000,
      });
    } catch (error) {
      $swal.fire({
        title: "Error",
        text: "Failed to delete record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

const handleSave = async () => {
  try {
    loading.value = true;
    const apiPath = "api/page-generated/2979/9649";
    
    if (isEditMode.value) {
      await useFetch(`${apiPath}/${editingId.value}`, {
        method: "PUT",
        body: formData.value,
        initialCache: false,
      });
    } else {
      await useFetch(apiPath, {
        method: "POST",
        body: formData.value,
        initialCache: false,
      });
    }
    
    await fetchData();
    showFormModal.value = false;
    $swal.fire({
      title: "Success",
      text: isEditMode.value ? "Record updated successfully" : "Record created successfully",
      icon: "success",
      timer: 2000,
    });
  } catch (error) {
    $swal.fire({
      title: "Error",
      text: "Failed to save record",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />
    <!-- Datatable -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">List of Message</div>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" size="sm" @click="handleAdd">
              <Icon name="material-symbols:add" class="mr-1" size="1rem" />
              Add
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- Search -->
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <FormKit
                v-model="searchKeyword"
                type="text"
                placeholder="Search..."
                outer-class="mb-0"
              />
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 dark:border-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">No</th>
                  <th class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">Code</th>
                  <th class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">Description</th>
                  <th class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">Status</th>
                  <th class="px-4 py-2 border border-gray-200 dark:border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td :colspan="5" class="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
                <tr v-else-if="filteredData.length === 0">
                  <td :colspan="5" class="px-4 py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
                <tr v-else v-for="(row, rowIndex) in filteredData" :key="rowIndex">
                  <td class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">{{ row.No || rowIndex + 1 }}</td>
                  <td class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">{{ row.Code || rowIndex + 1 }}</td>
                  <td class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">{{ row.Description || rowIndex + 1 }}</td>
                  <td class="px-4 py-2 border border-gray-200 dark:border-gray-700 ">{{ row.Status || rowIndex + 1 }}</td>
                  <td class="px-4 py-2 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-2">
                      <rs-button variant="secondary" size="xs" @click="handleView(row)">
                        <Icon name="material-symbols:visibility" size="1rem" />
                      </rs-button>
                      <rs-button variant="primary" size="xs" @click="handleEdit(row)">
                        <Icon name="material-symbols:edit" size="1rem" />
                      </rs-button>
                      <rs-button variant="danger" size="xs" @click="handleDelete(row)">
                        <Icon name="material-symbols:delete" size="1rem" />
                      </rs-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Form Modal -->
    <rs-modal
      v-model="showFormModal"
      :title="isViewMode ? 'View' : (isEditMode ? 'Edit' : 'Add')"
      size="md"
      :overlay-close="true"
    >
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">No:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.No"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.Code"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Description:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.Description"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Status:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.Status"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="showFormModal = false">Cancel</rs-button>
          <rs-button v-if="!isViewMode" variant="primary" @click="handleSave">Save</rs-button>
        </div>
      </template>
    </rs-modal>

  </div>
</template>