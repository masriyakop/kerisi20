<script setup>
definePageMeta({
  title: "PO Closed Reverse",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Purchase Order", path: "/purchasing/purchase-order" },
    { name: "Closing", path: "/purchasing/purchase-order/closing" },
    { name: "PO Closed Reverse", path: "/purchasing/purchase-order/closing/po-closed-reverse" },
  ],
});

const { $swal } = useNuxtApp();

// Table data
const poList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(5);

// Top Filter
const topFilter = ref({
  fund: "",
});

// Fund options
const fundOptions = ref([
  { label: "E01 - MENGURUS", value: "E01" },
  { label: "OTHERS", value: "other" },
]);

// Selected POs for confirmation
const selectedPOs = ref([]);
const checkboxMonitoring = ref([]);

// Filtered data
const filteredPOList = ref([...poList.value]);

// Function to apply filters
const applyFilters = () => {
  let filtered = [...poList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const searchableFields = [
        item["PO No"],
        item["PO Detail Account"],
        item["Fund Type"],
        item.Activity,
        item["Cost Center"],
        item["Account Code"],
        item["Cpa Project No"],
        item["Old Structure Budget"],
        item["New Structure Budget"],
        item.Remark,
      ].map(f => (f || "").toString().toLowerCase());

      return searchableFields.some(field => field.includes(keyword));
    });
  }

  filteredPOList.value = [];
  nextTick(() => {
    filteredPOList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredPOList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(topFilter, () => {
  fetchPOs();
}, { deep: true });

// Currency formatter
const toCurrency = (value) => {
  if (!value) return "0.00";
  const num = parseFloat(value);
  return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Fetch PO data
const fetchPOs = async () => {
  try {
    loading.value = true;
    const query = {
      fund: topFilter.value.fund || undefined,
      search: searchKeyword.value || undefined,
    };

    const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-closed-reverse", {
      method: "GET",
      query,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      poList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        ...item,
      }));
      checkboxMonitoring.value = data.value.checkboxMonitoring || [];
      applyFilters();
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch PO Closed Reverse data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching PO Closed Reverse:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching PO Closed Reverse data",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPOs();
});

// Handle confirm (reverse selected POs)
const handleConfirm = async () => {
  if (selectedPOs.value.length === 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select at least one PO",
      icon: "warning",
    });
    return;
  }

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to reverse ${selectedPOs.value.length} selected PO(s)? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, reverse!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const poData = {};
      selectedPOs.value.forEach(id => {
        poData[id] = true;
      });

      const { data } = await useFetch("/api/purchasing/purchase-order/closing/po-closed-reverse/confirm", {
        method: "POST",
        body: {
          poData,
          tf_fund: topFilter.value.fund,
        },
        initialCache: false,
      });

      if (data.value?.status === 'ok') {
        $swal.fire({
          title: "Success",
          text: data.value.successmessage || "PO reverse completed successfully",
          icon: "success",
        });
        selectedPOs.value = [];
        await fetchPOs();
      } else {
        $swal.fire({
          title: "Error",
          text: data.value?.errorMessage || "Failed to reverse PO",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error reversing PO:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while reversing PO",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

// Handle checkbox change
const handleCheckboxChange = (item, checked) => {
  if (checked) {
    if (!selectedPOs.value.includes(item.ID)) {
      selectedPOs.value.push(item.ID);
    }
  } else {
    selectedPOs.value = selectedPOs.value.filter(id => id !== item.ID);
  }
};

// Handle select all
const handleSelectAll = (checked) => {
  if (checked) {
    selectedPOs.value = filteredPOList.value.map(item => item.ID);
  } else {
    selectedPOs.value = [];
  }
};

// Check if item is selected
const isSelected = (item) => {
  return selectedPOs.value.includes(item.ID);
};

// Download functions
const handleDownloadPDF = () => {
  $swal.fire({
    title: "Info",
    text: "PDF download functionality will be implemented",
    icon: "info",
  });
};

const handleDownloadCSV = () => {
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

    <!-- Top Filter -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Top Filter</div>
      </template>
      <template #body>
        <div class="flex items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2">Fund:</label>
            <FormKit
              v-model="topFilter.fund"
              type="select"
              :options="fundOptions"
              placeholder="Select Fund"
              outer-class="mb-0"
            />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- PO Closing List -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">PO Closing List</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4 mb-4">
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

          <div class="po-closed-reverse-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`po-closed-reverse-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredPOList"
              :field="['no', 'PO No', 'PO Detail Account', 'Activity', 'Cpa Project No', 'Balance', 'Old Structure Budget', 'New Structure Budget', 'Remark', 'Select']"
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
              :hideTableSearch="true"
              :hideTablePageSize="true"
            >
              <template v-slot:no="data">
                {{ data.value.no }}
              </template>
              <template v-slot:PONo="data">
                {{ data.value['PO No'] }}
              </template>
              <template v-slot:PODetailAccount="data">
                {{ data.value['PO Detail Account'] }}
              </template>
              <template v-slot:Activity="data">
                {{ data.value.Activity }}
              </template>
              <template v-slot:CpaProjectNo="data">
                {{ data.value['Cpa Project No'] }}
              </template>
              <template v-slot:Balance="data">
                <div class="text-right">
                  {{ toCurrency(data.value.Balance) }}
                </div>
              </template>
              <template v-slot:OldStructureBudget="data">
                {{ data.value['Old Structure Budget'] }}
              </template>
              <template v-slot:NewStructureBudget="data">
                {{ data.value['New Structure Budget'] }}
              </template>
              <template v-slot:Remark="data">
                {{ data.value.Remark }}
              </template>
              <template v-slot:Select="data">
                <input
                  type="checkbox"
                  :checked="isSelected(data.value)"
                  @change="handleCheckboxChange(data.value, $event.target.checked)"
                  class="form-check-input"
                />
              </template>
            </rs-table>
          </div>

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
              <rs-button variant="danger" @click="handleConfirm" :disabled="selectedPOs.length === 0">
                <Icon name="material-symbols:undo" class="mr-2" size="1rem" />
                Reverse ({{ selectedPOs.length }})
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.po-closed-reverse-table-wrapper :deep(.table-header) {
  display: none;
}

.po-closed-reverse-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
