<script setup>
definePageMeta({
  title: "Budget Closing",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Budget",
      path: "/budget",
    },
    {
      name: "Budget Closing",
      path: "/budget/budget-closing",
    },
  ],
});

const { $swal } = useNuxtApp();

// Form state
const filterForm = ref({
  year: "",
  fundType: "",
  activityGroup: "",
  activitySubgroup: "",
  activity: "",
});

// Fund type options
const fundTypeOptions = ref([]);
const activityGroupOptions = ref([]);
const activitySubgroupOptions = ref([]);
const activityOptions = ref([]);

// Loading states
const loading = ref(false);
const processing = ref(false);
const reversing = ref(false);

// Messages
const startProcessMessage = ref("");
const reverseProcessMessage = ref("");

// Fetch fund types
const fetchFundTypes = async () => {
  try {
    const { data } = await useFetch("/api/budget/budget-closing/fund-types", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      fundTypeOptions.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching fund types:", error);
  }
};

// Handle Start Process
const handleStartProcess = async () => {
  if (!filterForm.value.year) {
    $swal.fire({
      title: "Validation Error",
      text: "Please enter Year",
      icon: "warning",
    });
    return;
  }

  if (!filterForm.value.fundType) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select Fund",
      icon: "warning",
    });
    return;
  }

  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to start the budget closing process?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, start it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      processing.value = true;
      startProcessMessage.value = "";

      const { data } = await useFetch("/api/budget/budget-closing/start-process", {
        method: "POST",
        body: {
          year: filterForm.value.year,
          fundType: filterForm.value.fundType,
          activityGroup: filterForm.value.activityGroup,
          activitySubgroup: filterForm.value.activitySubgroup,
          activity: filterForm.value.activity,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        startProcessMessage.value = data.value.message || "Process started successfully";
        $swal.fire({
          title: "Success",
          text: data.value.message || "Budget closing process started successfully",
          icon: "success",
        });
      } else {
        startProcessMessage.value = data.value?.message || "Failed to start process";
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to start budget closing process",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error starting process:", error);
      startProcessMessage.value = "An error occurred while starting the process";
      $swal.fire({
        title: "Error",
        text: "An error occurred while starting the budget closing process",
        icon: "error",
      });
    } finally {
      processing.value = false;
    }
  }
};

// Handle Reverse Process
const handleReverseProcess = async () => {
  if (!filterForm.value.year) {
    $swal.fire({
      title: "Validation Error",
      text: "Please enter Year",
      icon: "warning",
    });
    return;
  }

  if (!filterForm.value.fundType) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select Fund",
      icon: "warning",
    });
    return;
  }

  const result = await $swal.fire({
    title: "Are you sure?",
    text: "Do you want to reverse the budget closing process?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, reverse it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      reversing.value = true;
      reverseProcessMessage.value = "";

      const { data } = await useFetch("/api/budget/budget-closing/reverse-process", {
        method: "POST",
        body: {
          year: filterForm.value.year,
          fundType: filterForm.value.fundType,
          activityGroup: filterForm.value.activityGroup,
          activitySubgroup: filterForm.value.activitySubgroup,
          activity: filterForm.value.activity,
        },
        initialCache: false,
      });

      if (data.value?.statusCode === 200) {
        reverseProcessMessage.value = data.value.message || "Process reversed successfully";
        $swal.fire({
          title: "Success",
          text: data.value.message || "Budget closing process reversed successfully",
          icon: "success",
        });
      } else {
        reverseProcessMessage.value = data.value?.message || "Failed to reverse process";
        $swal.fire({
          title: "Error",
          text: data.value?.message || "Failed to reverse budget closing process",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error reversing process:", error);
      reverseProcessMessage.value = "An error occurred while reversing the process";
      $swal.fire({
        title: "Error",
        text: "An error occurred while reversing the budget closing process",
        icon: "error",
      });
    } finally {
      reversing.value = false;
    }
  }
};

// Initial fetch
onMounted(() => {
  fetchFundTypes();
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Filter Form -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Filter</div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Year -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Year<span class="text-red-500"> *</span>:
                </label>
                <FormKit
                  v-model="filterForm.year"
                  type="text"
                  placeholder="Enter Year"
                  validation="required"
                  outer-class="mb-0"
                />
              </div>

              <!-- Fund -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Fund<span class="text-red-500"> *</span>:
                </label>
                <FormKit
                  v-model="filterForm.fundType"
                  type="select"
                  :options="fundTypeOptions"
                  placeholder="Select Fund"
                  validation="required"
                  outer-class="mb-0"
                />
              </div>

              <!-- Activity Group -->
              <div>
                <label class="block text-sm font-medium mb-2">Activity Group:</label>
                <FormKit
                  v-model="filterForm.activityGroup"
                  type="select"
                  :options="activityGroupOptions"
                  placeholder="Select Activity Group"
                  outer-class="mb-0"
                />
              </div>

              <!-- Activity Subgroup -->
              <div>
                <label class="block text-sm font-medium mb-2">Activity Subgroup:</label>
                <FormKit
                  v-model="filterForm.activitySubgroup"
                  type="select"
                  :options="activitySubgroupOptions"
                  placeholder="Select Activity Subgroup"
                  outer-class="mb-0"
                />
              </div>

              <!-- Activity -->
              <div>
                <label class="block text-sm font-medium mb-2">Activity:</label>
                <FormKit
                  v-model="filterForm.activity"
                  type="select"
                  :options="activityOptions"
                  placeholder="Select Activity"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center gap-4 pt-4">
              <div class="flex flex-col items-center gap-2">
                <rs-button
                  variant="primary"
                  @click="handleStartProcess"
                  :disabled="processing || reversing"
                >
                  <Icon
                    name="material-symbols:play-arrow"
                    class="mr-1"
                    size="1rem"
                  />
                  Start Process
                </rs-button>
                <input
                  v-model="startProcessMessage"
                  type="text"
                  class="form-control mt-2 w-full max-w-xs"
                  disabled
                  placeholder="Process message will appear here"
                />
              </div>
              <div class="flex flex-col items-center gap-2">
                <rs-button
                  variant="primary"
                  @click="handleReverseProcess"
                  :disabled="processing || reversing"
                >
                  <Icon
                    name="material-symbols:undo"
                    class="mr-1"
                    size="1rem"
                  />
                  Reverse Process
                </rs-button>
                <input
                  v-model="reverseProcessMessage"
                  type="text"
                  class="form-control mt-2 w-full max-w-xs"
                  disabled
                  placeholder="Process message will appear here"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

