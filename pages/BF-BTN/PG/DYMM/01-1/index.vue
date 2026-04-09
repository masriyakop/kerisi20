<script setup>
definePageMeta({
  title: "Senarai Program",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();

const tabs = [
  { key: "draf", label: "Draf" },
  { key: "dalam-tindakan", label: "Dalam Tindakan" },
  { key: "pemilihan-peserta", label: "Pemilihan Peserta" },
  { key: "pemilihan-bantuan", label: "Pemilihan Bantuan" },
  { key: "maklum-balas", label: "Maklum Balas Kehadiran" },
  { key: "hebahan", label: "Hebahan Program" },
  { key: "selesai", label: "Selesai" },
];

const activeTab = ref("draf");
const searchQuery = ref("");
const perPage = ref(10);

const tabData = reactive({
  draf: [
    { code: "PG-2025-0001", name: "Program Agihan Ramadan", location: "Shah Alam", date: "2025-03-15", count: 120, status: "Draf" },
    { code: "PG-2025-0002", name: "Program Santuni Asnaf", location: "Klang", date: "2025-04-03", count: 80, status: "Draf" },
  ],
  "dalam-tindakan": [
    { code: "PG-2025-0003", name: "Program DYMM Fasa 1", location: "Kajang", date: "2025-04-10", count: 200, status: "Dalam Tindakan" },
  ],
  "pemilihan-peserta": [
    { code: "PG-2025-0004", name: "Program Pendidikan Anak Asnaf", location: "Petaling", date: "2025-04-22", count: 150, status: "Pemilihan Peserta" },
  ],
  "pemilihan-bantuan": [
    { code: "PG-2025-0005", name: "Program Bantuan Hari Raya", location: "Sepang", date: "2025-05-01", count: 300, status: "Pemilihan Bantuan" },
  ],
  "maklum-balas": [
    { code: "PG-2025-0006", name: "Program Bimbingan Komuniti", location: "Selayang", date: "2025-05-07", count: 90, status: "Maklum Balas" },
  ],
  hebahan: [
    { code: "PG-2025-0007", name: "Program Hebahan DYMM", location: "Ampang", date: "2025-05-18", count: 220, status: "Lulus" },
  ],
  selesai: [
    { code: "PG-2025-0008", name: "Program Sokongan IPT", location: "Subang", date: "2025-02-10", count: 60, status: "Selesai" },
  ],
});

const currentData = computed(() => tabData[activeTab.value] || []);

const filteredData = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return currentData.value;
  return currentData.value.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(q)),
  );
});

const paginatedData = computed(() => filteredData.value.slice(0, Number(perPage.value)));

const createProgram = async () => {
  await $swal.fire({
    icon: "info",
    title: "Cipta Program",
    text: "Refactor fasa ini guna dummy action. Integrasi workflow/API akan dibuat kemudian.",
  });
};

const deleteDraft = async (code) => {
  const result = await $swal.fire({
    icon: "warning",
    title: "Padam Program?",
    text: `Program ${code} akan dipadam dari data dummy.`,
    showCancelButton: true,
    confirmButtonText: "Padam",
    cancelButtonText: "Batal",
  });
  if (!result.isConfirmed) return;
  tabData.draf = tabData.draf.filter((item) => item.code !== code);
};

const showActionInfo = async (title, code) => {
  await $swal.fire({
    icon: "success",
    title,
    text: `Tindakan untuk ${code} berjaya dipanggil (dummy mode).`,
  });
};

const manageAid = async (program) => {
  sessionStorage.setItem("selectedProgramBantuan", JSON.stringify(program));
  await navigateTo({
    path: "/BF-BTN/PG/DYMM/01-1/pemilihan-bantuan",
    state: { program },
  });
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div class="font-semibold">Senarai Program</div>
          <rs-button variant="primary" @click="createProgram">Cipta Program</rs-button>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="rounded border px-3 py-1 text-sm"
              :class="activeTab === tab.key ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search records..."
              class="w-64 rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <div class="flex items-center gap-2 text-sm">
              <span>Result per page:</span>
              <select v-model="perPage" class="rounded border border-gray-300 px-2 py-1">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border p-2 text-left">#</th>
                  <th class="border p-2 text-left">Kod Program</th>
                  <th class="border p-2 text-left">Nama Program</th>
                  <th class="border p-2 text-left">Lokasi Program</th>
                  <th class="border p-2 text-left">Tarikh Program</th>
                  <th class="border p-2 text-left">Bilangan Peserta</th>
                  <th class="border p-2 text-left">Status</th>
                  <th class="border p-2 text-left">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in paginatedData" :key="item.code">
                  <td class="border p-2">{{ index + 1 }}</td>
                  <td class="border p-2">{{ item.code }}</td>
                  <td class="border p-2">{{ item.name }}</td>
                  <td class="border p-2">{{ item.location }}</td>
                  <td class="border p-2">{{ item.date }}</td>
                  <td class="border p-2">{{ item.count }}</td>
                  <td class="border p-2">{{ item.status }}</td>
                  <td class="border p-2">
                    <div class="flex flex-wrap gap-2">
                      <rs-button
                        v-if="activeTab === 'draf'"
                        size="sm"
                        variant="danger-outline"
                        @click="deleteDraft(item.code)"
                      >
                        Padam
                      </rs-button>
                      <rs-button
                        v-if="activeTab === 'draf'"
                        size="sm"
                        @click="showActionInfo('Edit Program', item.code)"
                      >
                        Edit
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'dalam-tindakan'"
                        size="sm"
                        @click="showActionInfo('Lihat Butiran', item.code)"
                      >
                        Lihat
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'pemilihan-peserta'"
                        size="sm"
                        @click="showActionInfo('Urus Peserta', item.code)"
                      >
                        Urus Peserta
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'pemilihan-bantuan'"
                        size="sm"
                        @click="manageAid(item)"
                      >
                        Urus Bantuan
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'maklum-balas'"
                        size="sm"
                        @click="showActionInfo('Lihat Maklum Balas', item.code)"
                      >
                        Lihat
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'hebahan'"
                        size="sm"
                        @click="showActionInfo('Lihat Hebahan', item.code)"
                      >
                        Lihat
                      </rs-button>

                      <rs-button
                        v-if="activeTab === 'selesai'"
                        size="sm"
                        @click="showActionInfo('Lihat Laporan', item.code)"
                      >
                        Lihat Laporan
                      </rs-button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedData.length === 0">
                  <td colspan="8" class="border p-4 text-center text-gray-500">Tiada rekod.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>
