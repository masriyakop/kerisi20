<script setup>
definePageMeta({
  title: "Vendor Profile",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Purchasing", path: "/purchasing" },
    { name: "Vendor", path: "/purchasing/vendor" },
    { name: "Vendor Profile", path: "/purchasing/vendor/profile" },
  ],
});

const { $swal } = useNuxtApp();

const vendorList = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const pageSize = ref(10);
const showSmartFilter = ref(false);

const smartFilter = ref({
  Status: "",
});

const originalFilter = ref({
  Status: "",
});

const filteredVendorList = ref([...vendorList.value]);

const applyFilters = () => {
  let filtered = [...vendorList.value];

  if (searchKeyword.value && searchKeyword.value.trim() !== "") {
    const keyword = searchKeyword.value.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const vendorId = (item["Vendor Id"] || "").toString().toLowerCase();
      const vendorCode = (item["Vendor Code"] || "").toString().toLowerCase();
      const vendorName = (item["Vendor Name"] || "").toString().toLowerCase();
      const address = (item.Address || "").toString().toLowerCase();
      const regNo = (item["Registration No (SSM)"] || "").toString().toLowerCase();

      return (
        vendorId.includes(keyword) ||
        vendorCode.includes(keyword) ||
        vendorName.includes(keyword) ||
        address.includes(keyword) ||
        regNo.includes(keyword)
      );
    });
  }

  if (smartFilter.value.Status) {
    filtered = filtered.filter((item) => item.Status === smartFilter.value.Status);
  }

  filteredVendorList.value = [];
  nextTick(() => {
    filteredVendorList.value = [...filtered];
  });
};

const totalRecords = computed(() => filteredVendorList.value.length);

watch(searchKeyword, () => {
  applyFilters();
}, { immediate: false });

watch(smartFilter, () => {
  applyFilters();
}, { deep: true });

const fetchVendors = async () => {
  try {
    loading.value = true;
    const queryParams = {
      search: searchKeyword.value || undefined,
      smartFilter_Status: smartFilter.value.Status || undefined,
    };

    const { data } = await useFetch("/api/purchasing/vendor/profile", {
      method: "GET",
      query: queryParams,
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      console.log('API Response:', data.value);
      console.log('Data array length:', data.value.data?.length || 0);
      
      if (data.value.data && data.value.data.length > 0) {
        console.log('First item from API:', data.value.data[0]);
      }
      
      vendorList.value = (data.value.data || []).map((item, index) => ({
        no: index + 1,
        "Vendor Id": item.vcs_id || '',
        "Vendor Code": item.vcs_vendor_code || '',
        "Vendor Name": item.vcs_vendor_name || '',
        Address: item.vcs_address || '',
        "Registration No (SSM)": item.vcs_registration_no || '',
        "Registration Date (SSM)": item.vcs_reg_date || '',
        "Registration Expiry Date (SSM)": item.vcs_reg_exp_date || '',
        "Registration No (MOF)": item.vcs_kk_regno || '',
        "Registration Expiry Date (MOF)": item.vcs_kk_expired_date || '',
        "Registration Date": item.vcs_unv_reg_date || '',
        "Registration Expiry Date": item.vcs_unv_req_exp_date || '',
        "Vendor Status": item.vcs_bumi_status || '',
        "Company Category": item.vcs_company_category || '',
        "Authorized Capital (RM)": item.vcs_authorize_capital ? item.vcs_authorize_capital.toFixed(2) : '',
        "Paid Up Capital (RM)": item.vcs_paid_up_capital ? item.vcs_paid_up_capital.toFixed(2) : '',
        "Contact No": item.vcs_tel_no || '',
        "Fax No": item.vcs_fax_no || '',
        "Contact Person": item.vcs_contact_person || '',
        Creditor: item.vcs_iscreditor || '',
        Debtor: item.vcs_isdebtor || '',
        "Bank Account Status": item.vsa_status || '',
        Status: item.vcs_vendor_status || '',
        Action: "",
        vcs_id: item.vcs_id,
        vcs_vendor_code: item.vcs_vendor_code,
        urlEdit: item.urlEdit,
        urlView: item.urlView,
      }));
      
      console.log('Vendor list mapped:', vendorList.value.length);
      if (vendorList.value.length > 0) {
        console.log('First mapped item:', vendorList.value[0]);
      }
      
      applyFilters();
    } else {
      console.error('API Error Response:', JSON.stringify(data.value, null, 2));
      console.error('API Error Message:', data.value?.message);
      console.error('API Error Details:', data.value?.error);
      $swal.fire({
        title: "Error",
        text: data.value?.message || data.value?.error || "Failed to fetch vendor profile list",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching vendor profile list:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching vendor profile list",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVendors();
});

const handleFilter = () => {
  originalFilter.value = {
    Status: smartFilter.value.Status,
  };
  showSmartFilter.value = true;
};

const handleFilterReset = () => {
  smartFilter.value = {
    Status: "",
  };
  originalFilter.value = {
    Status: "",
  };
  fetchVendors();
};

const handleFilterOk = () => {
  showSmartFilter.value = false;
  fetchVendors();
};

const handleFilterClose = () => {
  smartFilter.value = {
    Status: originalFilter.value.Status,
  };
  showSmartFilter.value = false;
};

const handleView = (item) => {
  if (item.urlEdit) {
    navigateTo(item.urlEdit);
  }
};

const handleEdit = (item) => {
  if (item.urlEdit) {
    navigateTo(item.urlEdit);
  }
};

const handleDelete = async (item) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete "${item["Vendor Code"]}"?`,
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
      // TODO: Implement delete API
      $swal.fire({
        title: "Deleted!",
        text: "Record has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchVendors();
    } catch (error) {
      console.error("Error deleting record:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting record",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

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

const handleAdd = () => {
  $swal.fire({
    title: "Info",
    text: "Add functionality will be implemented",
    icon: "info",
  });
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Vendor Profile</div>
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
              <div class="flex gap-2">
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
                <rs-button
                  class="!px-3"
                  style="height: 40px; min-height: 40px;"
                  @click="handleFilter"
                >
                  <Icon
                    name="ic:outline-filter-alt"
                    size="1rem"
                  />
                </rs-button>
              </div>
            </div>
          </div>

          <div class="vendor-profile-table-wrapper">
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
            <rs-table
              v-else
              :key="`vendor-profile-table-${searchKeyword || 'all'}-${pageSize}`"
              :data="filteredVendorList"
              :field="['no', 'Vendor Id', 'Vendor Code', 'Vendor Name', 'Address', 'Registration No (SSM)', 'Registration Date (SSM)', 'Registration Expiry Date (SSM)', 'Registration No (MOF)', 'Registration Expiry Date (MOF)', 'Registration Date', 'Registration Expiry Date', 'Vendor Status', 'Company Category', 'Authorized Capital (RM)', 'Paid Up Capital (RM)', 'Contact No', 'Fax No', 'Contact Person', 'Creditor', 'Debtor', 'Bank Account Status', 'Status', 'Action']"
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
              <template v-slot:VendorId="data">
                {{ data.value['Vendor Id'] }}
              </template>
              <template v-slot:VendorCode="data">
                {{ data.value['Vendor Code'] }}
              </template>
              <template v-slot:VendorName="data">
                {{ data.value['Vendor Name'] }}
              </template>
              <template v-slot:Address="data">
                {{ data.value.Address }}
              </template>
              <template v-slot:RegistrationNoSSM="data">
                {{ data.value['Registration No (SSM)'] }}
              </template>
              <template v-slot:RegistrationDateSSM="data">
                {{ data.value['Registration Date (SSM)'] }}
              </template>
              <template v-slot:RegistrationExpiryDateSSM="data">
                {{ data.value['Registration Expiry Date (SSM)'] }}
              </template>
              <template v-slot:RegistrationNoMOF="data">
                {{ data.value['Registration No (MOF)'] }}
              </template>
              <template v-slot:RegistrationExpiryDateMOF="data">
                {{ data.value['Registration Expiry Date (MOF)'] }}
              </template>
              <template v-slot:RegistrationDate="data">
                {{ data.value['Registration Date'] }}
              </template>
              <template v-slot:RegistrationExpiryDate="data">
                {{ data.value['Registration Expiry Date'] }}
              </template>
              <template v-slot:VendorStatus="data">
                {{ data.value['Vendor Status'] }}
              </template>
              <template v-slot:CompanyCategory="data">
                {{ data.value['Company Category'] }}
              </template>
              <template v-slot:AuthorizedCapitalRM="data">
                {{ data.value['Authorized Capital (RM)'] }}
              </template>
              <template v-slot:PaidUpCapitalRM="data">
                {{ data.value['Paid Up Capital (RM)'] }}
              </template>
              <template v-slot:ContactNo="data">
                {{ data.value['Contact No'] }}
              </template>
              <template v-slot:FaxNo="data">
                {{ data.value['Fax No'] }}
              </template>
              <template v-slot:ContactPerson="data">
                {{ data.value['Contact Person'] }}
              </template>
              <template v-slot:Creditor="data">
                {{ data.value.Creditor }}
              </template>
              <template v-slot:Debtor="data">
                {{ data.value.Debtor }}
              </template>
              <template v-slot:BankAccountStatus="data">
                {{ data.value['Bank Account Status'] }}
              </template>
              <template v-slot:Status="data">
                {{ data.value.Status }}
              </template>
              <template v-slot:Action="data">
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
              <rs-button variant="primary" @click="handleAdd">
                <Icon name="material-symbols:add" class="mr-2" size="1rem" />
                Add
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <rs-modal
      v-model="showSmartFilter"
      title="Smart Filter"
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
            @click="handleFilterClose"
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
                  v-model="smartFilter.Status"
                  type="select"
                  :options="[]"
                  placeholder="Select Status"
                  outer-class="mb-0"
                />
                <button
                  v-if="smartFilter.Status"
                  type="button"
                  @click="smartFilter.Status = ''"
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
          <rs-button variant="danger" @click="handleFilterReset">
            Reset
          </rs-button>
          <rs-button variant="primary" @click="handleFilterOk">
            Ok
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.vendor-profile-table-wrapper :deep(.table-header) {
  display: none;
}

.vendor-profile-table-wrapper :deep(.rs-table thead th) {
  background-color: #3b82f6 !important;
  color: white !important;
}
</style>
