<script setup>
definePageMeta({
  title: "Sample Form",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Setup",
      path: "/setup",
    },
    {
      name: "Sample Form",
      path: "/sampleform",
    },
  ],
});

// Form state
const formData = ref({
  staffId: "",
  staffName: "",
  icNo: "",
  phoneNo: "",
  textArea: "",
  datePicker: "",
  checkBox: [],
  fileUpload: null,
  radioButton: "",
  dropDown: "",
  rmDisplay: "",
  pillBox: "",
  dropZone: "",
});

// Dropdown options
const dropdownOptions = ref([
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
]);

// Save function
const handleSave = () => {
  console.log("Saving form data:", formData.value);
  // Implement save logic here
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Sample Form</div>
          <div class="flex items-center gap-2">
            <Icon
              name="material-symbols:tag"
              class="cursor-pointer text-gray-500 hover:text-primary"
              size="20"
            />
            <Icon
              name="material-symbols:content-copy"
              class="cursor-pointer text-gray-500 hover:text-primary"
              size="20"
            />
            <Icon
              name="material-symbols:edit"
              class="cursor-pointer text-gray-500 hover:text-primary"
              size="20"
            />
          </div>
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave">
          <div class="space-y-4">
            <!-- Staff ID -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Staff ID<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.staffId"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Staff Name -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Staff Name<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.staffName"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- I/C No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">I/C No<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.icNo"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Phone No -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">Phone No<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.phoneNo"
                  type="tel"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- TextArea -->
            <div class="flex items-start gap-4">
              <label class="w-32 text-sm font-medium pt-2">TextArea:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.textArea"
                  type="textarea"
                  rows="4"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- DatePicker -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">DatePicker:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.datePicker"
                  type="date"
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <div
                      class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
                    >
                      <Icon
                        name="material-symbols:calendar-today"
                        class="!w-5 !h-5 text-gray-500"
                      />
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>

            <!-- checkBox -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">checkBox:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.checkBox"
                  type="checkbox"
                  :options="[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]"
                  :classes="{
                    fieldset: 'border-0 !p-0',
                    legend: '!hidden',
                    options: '!flex !flex-row gap-4',
                  }"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- fileUpload -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">fileUpload:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.fileUpload"
                  type="text"
                  placeholder="Select file to upload"
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <div
                      class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
                    >
                      <Icon
                        name="material-symbols:attach-file"
                        class="!w-5 !h-5 text-gray-500"
                      />
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>

            <!-- radioButton -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">radioButton:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.radioButton"
                  type="radio"
                  :options="[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]"
                  :classes="{
                    fieldset: 'border-0 !p-0',
                    legend: '!hidden',
                    options: '!flex !flex-row gap-4',
                  }"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- dropDown -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">dropDown:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.dropDown"
                  type="select"
                  :options="dropdownOptions"
                  placeholder="Select an option"
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <button
                      v-if="formData.dropDown"
                      type="button"
                      @click="formData.dropDown = ''"
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

            <!-- RMdisplay -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">RMdisplay:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.rmDisplay"
                  type="text"
                  outer-class="mb-0"
                >
                  <template #prefix>
                    <div
                      class="bg-gray-100 dark:bg-gray-700 h-full rounded-l-md px-3 flex items-center border-r border-gray-300 dark:border-gray-600"
                    >
                      <span class="text-sm font-medium">MYR</span>
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>

            <!-- pillBox -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">pillBox:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.pillBox"
                  type="text"
                  outer-class="mb-0"
                >
                  <template #suffix>
                    <div
                      class="h-full flex items-center pr-2"
                    >
                      <button
                        v-if="formData.pillBox"
                        type="button"
                        @click="formData.pillBox = ''"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Icon
                          name="material-symbols:close"
                          class="!w-4 !h-4 text-gray-500"
                        />
                      </button>
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>

            <!-- dropZone -->
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium">dropZone:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.dropZone"
                  type="text"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-center pt-4">
              <rs-button
                variant="primary"
                type="submit"
                @click="handleSave"
              >
                <Icon
                  name="material-symbols:save"
                  class="mr-2"
                  size="1rem"
                />
                Save Info
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>
