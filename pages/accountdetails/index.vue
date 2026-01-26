<script setup>
definePageMeta({
  title: "Account Details",
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
      name: "Account Details",
      path: "/accountdetails",
    },
  ],
});

// Form state
const formData = ref({
  accountActivity: "ASET",
  parentAccountCode: "A0111100",
  accountCode: "A0111101",
  accountCodeDescriptionMalay: "BIMB - OPERASI",
  accountCodeDescriptionEnglish: "",
  statementItem: "BALANCE SHEET",
  status: "ACTIVE",
  budgetFlag: "NO",
  flagPettyCash: "NO",
  flagProcurement: "NO",
  flagSubsidiary: "NO",
  flagErasmi: "NO",
  flagCashbook: "YES",
  flagDonation: "",
  flagEvent: "NO",
  flagResearch: "NO",
  flagProject: "NO",
  flagStudentActivity: "NO",
  flagAdvance: "NO",
  flagDeposit: "",
});

// Dropdown options
const yesNoOptions = ref([
  { label: "YES", value: "YES" },
  { label: "NO", value: "NO" },
]);

const statementItemOptions = ref([
  { label: "BALANCE SHEET", value: "BALANCE SHEET" },
  { label: "INCOME STATEMENT", value: "INCOME STATEMENT" },
  { label: "CASH FLOW", value: "CASH FLOW" },
]);

const statusOptions = ref([
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "INACTIVE", value: "INACTIVE" },
]);

// Save function
const handleSave = () => {
  console.log("Saving account details:", formData.value);
  // Implement save logic here
};

// Cancel function
const handleCancel = () => {
  // Reset form or navigate back
  navigateTo("/accountcode");
};
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Setup / Account Details</div>
          <Icon
            @click="handleCancel"
            class="hover:text-gray-800 cursor-pointer"
            name="ic:round-close"
            size="24"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSave">
          <div class="space-y-4">
            <!-- Account Activity -->
            <div class="flex items-center gap-4">
              <label class="w-64 text-sm font-medium">Account Activity<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.accountActivity"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Parent Account Code -->
            <div class="flex items-center gap-4">
              <label class="w-64 text-sm font-medium">Parent Account Code:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.parentAccountCode"
                  type="text"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Account Code -->
            <div class="flex items-center gap-4">
              <label class="w-64 text-sm font-medium">Account Code<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.accountCode"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Account Code Description (Malay) -->
            <div class="flex items-start gap-4">
              <label class="w-64 text-sm font-medium pt-2"
                >Account Code Description (Malay)<span class="text-red-500">*</span>:</label
              >
              <div class="flex-1">
                <FormKit
                  v-model="formData.accountCodeDescriptionMalay"
                  type="textarea"
                  rows="3"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Account Code Description (English) -->
            <div class="flex items-start gap-4">
              <label class="w-64 text-sm font-medium pt-2"
                >Account Code Description (English):</label
              >
              <div class="flex-1">
                <FormKit
                  v-model="formData.accountCodeDescriptionEnglish"
                  type="textarea"
                  rows="3"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Statement Item -->
            <div class="flex items-center gap-4">
              <label class="w-64 text-sm font-medium"
                >Statement Item (jika perlu):</label
              >
              <div class="flex-1">
                <FormKit
                  v-model="formData.statementItem"
                  type="select"
                  :options="statementItemOptions"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-4">
              <label class="w-64 text-sm font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="formData.status"
                  type="select"
                  :options="statusOptions"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Flag Fields - Two Column Layout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <!-- Left Column -->
              <div class="space-y-4">
                <!-- Budget Flag -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Budget Flag<span class="text-red-500">*</span>:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.budgetFlag"
                      type="select"
                      :options="yesNoOptions"
                      validation="required"
                      validation-visibility="dirty"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Petty Cash -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Petty Cash:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagPettyCash"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Procurement -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Procurement:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagProcurement"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Subsidiary -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Subsidiary:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagSubsidiary"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Erasmi -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Erasmi:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagErasmi"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Cashbook -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Cashbook:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagCashbook"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Donation -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Donation:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagDonation"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <!-- Flag Event -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Event:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagEvent"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Research -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Research:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagResearch"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Project -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Project:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagProject"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Student Activity -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Student Activity:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagStudentActivity"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Advance -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Advance:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagAdvance"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>

                <!-- Flag Deposit -->
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <label class="text-sm font-medium">Flag Deposit:</label>
                    <Icon
                      name="material-symbols:info"
                      class="text-gray-500 cursor-help"
                      size="16"
                    />
                  </div>
                  <div class="w-32">
                    <FormKit
                      v-model="formData.flagDeposit"
                      type="select"
                      :options="yesNoOptions"
                      outer-class="mb-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-6">
              <rs-button
                variant="danger"
                @click="handleCancel"
              >
                Cancel
              </rs-button>
              <rs-button
                variant="primary"
                type="submit"
                @click="handleSave"
              >
                Save
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>



