<script setup>
definePageMeta({
  title: "Pemilihan Bantuan",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();
const router = useRouter();

const selectedProgramBantuan = ref(null);
const showTambahBantuanModal = ref(false);

const bantuanForm = reactive({
  aid: "",
  aidProduct: "",
  productPackage: "",
  entitlementProduct: "",
});

const aidOptions = [
  { value: "B136_SAGUHATI_MUALLAF", label: "B136 - (HQ) SAGUHATI HARI RAYA (MUALLAF)" },
  { value: "B136_RAMADHAN_FAKIR", label: "B136 - BANTUAN RAMADHAN & HARI RAYA (FAKIR)" },
  { value: "B136_RAMADHAN_MISKIN", label: "B136 - BANTUAN RAMADHAN & HARI RAYA (MISKIN)" },
];

const aidProductMap = {
  B136_SAGUHATI_MUALLAF: [{ value: "SAGUHATI_INDIVIDUAL", label: "SAGUHATI HARI RAYA (INDIVIDUAL)" }],
  B136_RAMADHAN_FAKIR: [{ value: "RAMADHAN_RAYA_FAKIR", label: "RAMADHAN & HARI RAYA (FAKIR)" }],
  B136_RAMADHAN_MISKIN: [{ value: "RAMADHAN_RAYA_MISKIN", label: "RAMADHAN & HARI RAYA (MISKIN)" }],
};

const packageMap = {
  SAGUHATI_INDIVIDUAL: [{ value: "SAGUHATI_RAYA_DYMM", label: "SAGUHATI HARI RAYA - SAGUHATI RAYA DYMM" }],
  RAMADHAN_RAYA_FAKIR: [{ value: "PROGRAM_DYMM_FAKIR_T1", label: "PROGRAM DYMM (FAKIR) - T1" }],
  RAMADHAN_RAYA_MISKIN: [{ value: "PROGRAM_DYMM_MISKIN_T1", label: "PROGRAM DYMM (MISKIN) - T1" }],
};

const entitlementMap = {
  SAGUHATI_RAYA_DYMM: [{ value: "ENT_SAGUHATI", label: "SAGUHATI HARI RAYA - SAGUHATI RAYA DYMM" }],
  PROGRAM_DYMM_FAKIR_T1: [{ value: "ENT_FAKIR_T1", label: "PROGRAM DYMM - PEMBERIAN SULTAN (FAKIR) - T1" }],
  PROGRAM_DYMM_MISKIN_T1: [{ value: "ENT_MISKIN_T1", label: "PROGRAM DYMM - PEMBERIAN SULTAN (MISKIN) - T1" }],
};

const aidProductOptions = computed(() => aidProductMap[bantuanForm.aid] || []);
const packageOptions = computed(() => packageMap[bantuanForm.aidProduct] || []);
const entitlementOptions = computed(() => entitlementMap[bantuanForm.productPackage] || []);

const bantuanLines = ref([]);

watch(
  () => bantuanForm.aid,
  () => {
    bantuanForm.aidProduct = "";
    bantuanForm.productPackage = "";
    bantuanForm.entitlementProduct = "";
  },
);

watch(
  () => bantuanForm.aidProduct,
  () => {
    bantuanForm.productPackage = "";
    bantuanForm.entitlementProduct = "";
  },
);

watch(
  () => bantuanForm.productPackage,
  () => {
    bantuanForm.entitlementProduct = "";
  },
);

const makeProgramFallback = () => ({
  code: "PG-2025-0005",
  name: "Program Bantuan Hari Raya",
  location: "Sepang",
  date: "2025-05-01",
  count: 300,
  status: "Aktif",
});

onMounted(() => {
  const fromState = history.state?.program;
  if (fromState) {
    selectedProgramBantuan.value = fromState;
    sessionStorage.setItem("selectedProgramBantuan", JSON.stringify(fromState));
    return;
  }

  const stored = sessionStorage.getItem("selectedProgramBantuan");
  if (stored) {
    selectedProgramBantuan.value = JSON.parse(stored);
    return;
  }

  selectedProgramBantuan.value = makeProgramFallback();
});

const getLabel = (list, value) => list.find((item) => item.value === value)?.label || "-";

const resetModalForm = () => {
  bantuanForm.aid = "";
  bantuanForm.aidProduct = "";
  bantuanForm.productPackage = "";
  bantuanForm.entitlementProduct = "";
};

const addBantuan = async () => {
  if (!bantuanForm.aid || !bantuanForm.aidProduct || !bantuanForm.productPackage || !bantuanForm.entitlementProduct) {
    await $swal.fire({ icon: "warning", title: "Maklumat Tidak Lengkap", text: "Sila lengkapkan semua pilihan bantuan." });
    return;
  }

  bantuanLines.value.push({
    id: Date.now(),
    aid: getLabel(aidOptions, bantuanForm.aid),
    aidProduct: getLabel(aidProductOptions.value, bantuanForm.aidProduct),
    productPackage: getLabel(packageOptions.value, bantuanForm.productPackage),
    entitlementProduct: getLabel(entitlementOptions.value, bantuanForm.entitlementProduct),
    kadarBantuan: 0,
    tempohKekerapan: 1,
    tarikhMula: "",
    tarikhTamat: "",
    kategoriPenerima: "",
    kaedahPembayaran: "",
    namaPenerima: "",
    noKadPengenalan: "",
    namaPemegangAkaun: "",
    bank: "",
    noAkaunBank: "",
  });

  showTambahBantuanModal.value = false;
  resetModalForm();
};

const removeBantuan = (id) => {
  bantuanLines.value = bantuanLines.value.filter((item) => item.id !== id);
};

const getTotal = (line) => Number(line.kadarBantuan || 0) * Number(line.tempohKekerapan || 0);

const simpanLine = async (line) => {
  if (Number(line.kadarBantuan) <= 0 || !line.kategoriPenerima || !line.kaedahPembayaran) {
    await $swal.fire({
      icon: "warning",
      title: "Maklumat Tidak Lengkap",
      text: "Sila lengkapkan kadar bantuan, kategori penerima dan kaedah pembayaran.",
    });
    return;
  }

  await $swal.fire({
    icon: "success",
    title: "Simpan Berjaya",
    html: `
      <div style="text-align:left">
        <p><b>Kadar Bantuan:</b> RM ${Number(line.kadarBantuan).toLocaleString()}</p>
        <p><b>Tempoh/Kekerapan:</b> ${line.tempohKekerapan}</p>
        <p><b>Jumlah:</b> RM ${getTotal(line).toLocaleString()}</p>
      </div>
    `,
  });
};
</script>

<template>
  <div class="relative">
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="font-semibold">Pemilihan Bantuan</div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid gap-3 rounded border bg-gray-50 p-3 md:grid-cols-3">
            <div><b>Kod Program:</b> {{ selectedProgramBantuan?.code }}</div>
            <div><b>Nama Program:</b> {{ selectedProgramBantuan?.name }}</div>
            <div><b>Lokasi:</b> {{ selectedProgramBantuan?.location }}</div>
            <div><b>Tarikh:</b> {{ selectedProgramBantuan?.date }}</div>
            <div><b>Bilangan Peserta:</b> {{ selectedProgramBantuan?.count }}</div>
            <div><b>Status:</b> {{ selectedProgramBantuan?.status || "Aktif" }}</div>
          </div>

          <div class="flex justify-end">
            <rs-button @click="showTambahBantuanModal = true">Tambah Bantuan</rs-button>
          </div>

          <div v-if="bantuanLines.length === 0" class="rounded border border-dashed p-6 text-center text-gray-500">
            Tiada bantuan ditambah lagi.
          </div>

          <div v-for="line in bantuanLines" :key="line.id" class="space-y-3 rounded border p-4">
            <div class="flex items-center justify-between">
              <div class="font-medium">Butiran Bantuan</div>
              <rs-button size="sm" variant="danger-outline" @click="removeBantuan(line.id)">Padam</rs-button>
            </div>
            <div class="grid gap-2 text-sm md:grid-cols-2">
              <div><b>Aid:</b> {{ line.aid }}</div>
              <div><b>Aid Product:</b> {{ line.aidProduct }}</div>
              <div><b>Product Package:</b> {{ line.productPackage }}</div>
              <div><b>Entitlement Product:</b> {{ line.entitlementProduct }}</div>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <input v-model.number="line.kadarBantuan" type="number" class="rounded border p-2 text-sm" placeholder="Kadar Bantuan (RM)" />
              <input v-model.number="line.tempohKekerapan" type="number" min="1" class="rounded border p-2 text-sm" placeholder="Tempoh / Kekerapan" />
              <input v-model="line.tarikhMula" type="date" class="rounded border p-2 text-sm" />
              <input v-model="line.tarikhTamat" type="date" class="rounded border p-2 text-sm" />
              <select v-model="line.kategoriPenerima" class="rounded border p-2 text-sm">
                <option value="">Kategori Penerima</option>
                <option value="penerima">Penerima</option>
                <option value="waris">Waris</option>
              </select>
              <select v-model="line.kaedahPembayaran" class="rounded border p-2 text-sm">
                <option value="">Kaedah Pembayaran</option>
                <option value="eft">EFT</option>
                <option value="tunai">Tunai</option>
              </select>
              <input v-model="line.namaPenerima" type="text" class="rounded border p-2 text-sm" placeholder="Nama Penerima" />
              <input v-model="line.noKadPengenalan" type="text" class="rounded border p-2 text-sm" placeholder="No Kad Pengenalan" />
              <input v-model="line.namaPemegangAkaun" type="text" class="rounded border p-2 text-sm" placeholder="Nama Pemegang Akaun" />
              <input v-model="line.bank" type="text" class="rounded border p-2 text-sm" placeholder="Bank" />
              <input v-model="line.noAkaunBank" type="text" class="rounded border p-2 text-sm" placeholder="No Akaun Bank" />
            </div>

            <div class="flex items-center justify-between text-sm">
              <div><b>Jumlah Keseluruhan Bantuan:</b> RM {{ getTotal(line).toLocaleString() }}</div>
              <rs-button size="sm" @click="simpanLine(line)">Simpan</rs-button>
            </div>
          </div>

          <div class="flex justify-end">
            <rs-button variant="primary-outline" @click="router.back()">Kembali</rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <div
      v-if="showTambahBantuanModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showTambahBantuanModal = false"
    >
      <div class="w-full max-w-xl rounded bg-white p-4">
        <h3 class="mb-3 text-lg font-semibold">Pilih Bantuan</h3>
        <div class="grid gap-3">
          <select v-model="bantuanForm.aid" class="rounded border p-2 text-sm">
            <option value="">Aid</option>
            <option v-for="opt in aidOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <select v-model="bantuanForm.aidProduct" class="rounded border p-2 text-sm" :disabled="!bantuanForm.aid">
            <option value="">Aid Product</option>
            <option v-for="opt in aidProductOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <select v-model="bantuanForm.productPackage" class="rounded border p-2 text-sm" :disabled="!bantuanForm.aidProduct">
            <option value="">Product Package</option>
            <option v-for="opt in packageOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <select v-model="bantuanForm.entitlementProduct" class="rounded border p-2 text-sm" :disabled="!bantuanForm.productPackage">
            <option value="">Entitlement Product</option>
            <option v-for="opt in entitlementOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <rs-button variant="primary-outline" @click="resetModalForm">Reset</rs-button>
          <rs-button @click="addBantuan">Pilih</rs-button>
        </div>
      </div>
    </div>
  </div>
</template>
