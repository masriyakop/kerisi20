<script setup>
definePageMeta({
  title: "Kitchen Sink",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Kitchen Sink", path: "/kitchen-sink" },
  ],
});

const { $swal } = useNuxtApp();

// Form state
const formData = ref({
  text: "",
  textarea: "",
  datePicker: "",
  checkBox: [],
  radioButton: "",
  dropDown: "",
  fileUpload: "",
  rmDisplay: "",
  pillBox: "",
  dropZone: "",
});

const dropdownOptions = ref([
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
]);

// Modal
const showModal = ref(false);

// Smart Filter
const showSmartFilter = ref(false);
const smartFilterKeyword = ref("");
const smartFilter = ref({ level: "", code: "", description: "", status: "" });
const smartFilterDatatableRef = ref(null);
const smartFilterExportConfigRef = ref(null);
const smartFilterPageSize = ref(10);

// Top Filter
const topFilter = ref({ year: "", fund: "", ptj: "", costCentre: "", activity: "" });
const topFilterKeyword = ref("");
const topFilterDatatableRef = ref(null);
const topFilterExportConfigRef = ref(null);
const topFilterPageSize = ref(10);

// Sample data for datatables
const smartFilterSampleData = ref([
  { no: 1, Level: "1", "Budget Code": "BC001", Description: "Operating Expenditure", Status: "ACTIVE" },
  { no: 2, Level: "2", "Budget Code": "BC002", Description: "Capital Expenditure", Status: "ACTIVE" },
  { no: 3, Level: "1", "Budget Code": "BC003", Description: "Personnel Cost", Status: "INACTIVE" },
  { no: 4, Level: "3", "Budget Code": "BC004", Description: "Maintenance", Status: "ACTIVE" },
  { no: 5, Level: "2", "Budget Code": "BC005", Description: "Utilities", Status: "ACTIVE" },
]);

const topFilterSampleData = ref([
  { no: 1, Fund: "F001", PTJ: "PTJ-A", "Cost Centre": "CC01", Activity: "ACT-1", "Budget Code": "BC001", Status: "ACTIVE", Year: "2025" },
  { no: 2, Fund: "F002", PTJ: "PTJ-B", "Cost Centre": "CC02", Activity: "ACT-2", "Budget Code": "BC002", Status: "ACTIVE", Year: "2025" },
  { no: 3, Fund: "F001", PTJ: "PTJ-A", "Cost Centre": "CC03", Activity: "ACT-3", "Budget Code": "BC003", Status: "INACTIVE", Year: "2025" },
]);

const filteredSmartFilterData = computed(() => {
  let data = [...smartFilterSampleData.value];
  if (smartFilterKeyword.value?.trim()) {
    const kw = smartFilterKeyword.value.toLowerCase();
    data = data.filter(
      (r) =>
        (r.Level || "").toLowerCase().includes(kw) ||
        (r["Budget Code"] || "").toLowerCase().includes(kw) ||
        (r.Description || "").toLowerCase().includes(kw) ||
        (r.Status || "").toLowerCase().includes(kw)
    );
  }
  return data;
});

const filteredTopFilterData = computed(() => {
  let data = [...topFilterSampleData.value];
  if (topFilterKeyword.value?.trim()) {
    const kw = topFilterKeyword.value.toLowerCase();
    data = data.filter(
      (r) =>
        (r.Fund || "").toLowerCase().includes(kw) ||
        (r.PTJ || "").toLowerCase().includes(kw) ||
        (r["Cost Centre"] || "").toLowerCase().includes(kw) ||
        (r.Activity || "").toLowerCase().includes(kw) ||
        (r["Budget Code"] || "").toLowerCase().includes(kw) ||
        (r.Status || "").toLowerCase().includes(kw)
    );
  }
  return data;
});

// useDatatableFeatures for Smart Filter
const {
  templateFileInputRef: smartFilterTemplateInputRef,
  isGrouped: smartFilterIsGrouped,
  handleSaveTemplate: handleSmartFilterSaveTemplate,
  handleLoadTemplate: handleSmartFilterLoadTemplate,
  onTemplateFileChange: onSmartFilterTemplateChange,
  handleGenerateApi: handleSmartFilterGenerateApi,
  handleUngroupList: handleSmartFilterUngroup,
  handleGroupList: handleSmartFilterGroup,
  handleDownloadPDF: handleSmartFilterDownloadPDF,
  handleDownloadCSV: handleSmartFilterDownloadCSV,
} = useDatatableFeatures({
  pageName: "Kitchen Sink Smart Filter",
  apiDataPath: "/kitchen-sink",
  defaultExportColumns: ["Level", "Budget Code", "Description", "Status"],
  getFilteredList: () => filteredSmartFilterData.value,
  datatableRef: smartFilterDatatableRef,
  searchKeyword: smartFilterKeyword,
  smartFilter,
  applyFilters: () => {},
});

// useDatatableFeatures for Top Filter
const {
  templateFileInputRef: topFilterTemplateInputRef,
  isGrouped: topFilterIsGrouped,
  handleSaveTemplate: handleTopFilterSaveTemplate,
  handleLoadTemplate: handleTopFilterLoadTemplate,
  onTemplateFileChange: onTopFilterTemplateChange,
  handleGenerateApi: handleTopFilterGenerateApi,
  handleUngroupList: handleTopFilterUngroup,
  handleGroupList: handleTopFilterGroup,
  handleDownloadPDF: handleTopFilterDownloadPDF,
  handleDownloadCSV: handleTopFilterDownloadCSV,
} = useDatatableFeatures({
  pageName: "Kitchen Sink Top Filter",
  apiDataPath: "/kitchen-sink",
  defaultExportColumns: ["Fund", "PTJ", "Cost Centre", "Activity", "Budget Code", "Status", "Year"],
  getFilteredList: () => filteredTopFilterData.value,
  datatableRef: topFilterDatatableRef,
  searchKeyword: topFilterKeyword,
  smartFilter: topFilter,
  applyFilters: () => {},
});

const handleSmartFilterOk = () => {
  showSmartFilter.value = false;
};

const handleSmartFilterReset = () => {
  smartFilter.value = { level: "", code: "", description: "", status: "" };
};

const handleFormSave = () => {
  console.log("Form data:", formData.value);
  $swal.fire({ title: "Saved", text: "Form data logged to console", icon: "success", timer: 2000, showConfirmButton: false });
};

const handleExportExcel = async (type) => {
  try {
    const ExcelJS = await import("exceljs");
    const data = type === "smart" ? filteredSmartFilterData.value : filteredTopFilterData.value;
    const cols = type === "smart" ? ["Level", "Budget Code", "Description", "Status"] : ["Fund", "PTJ", "Cost Centre", "Activity", "Budget Code", "Status", "Year"];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Export");
    sheet.addRow(["No.", ...cols]);
    data.forEach((item, i) => {
      const row = [i + 1];
      cols.forEach((c) => row.push(item[c] || ""));
      sheet.addRow(row);
    });
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Kitchen_Sink_${type}_${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
    $swal.fire({ title: "Success", text: "Excel downloaded", icon: "success", timer: 2000, showConfirmButton: false });
  } catch (e) {
    $swal.fire({ title: "Error", text: e?.message || "Failed to export Excel", icon: "error" });
  }
};

// Miller Columns (hierarchical drilldown) – demo data
const millerColumns = ref([
  { key: 'category', title: 'CATEGORY', level: 0 },
  { key: 'subcategory', title: 'SUBCATEGORY', level: 1 },
  { key: 'item', title: 'ITEM', level: 2 },
]);
const millerData = ref({
  category: [
    { id: 'c1', label: 'Electronics', desc: 'Electronic devices', status: 'ACTIVE' },
    { id: 'c2', label: 'Office', desc: 'Office supplies', status: 'ACTIVE' },
  ],
  subcategory: {
    c1: [
      { id: 's1', label: 'Phones', desc: 'Mobile phones', status: 'ACTIVE' },
      { id: 's2', label: 'Laptops', desc: 'Laptop computers', status: 'ACTIVE' },
    ],
    c2: [
      { id: 's3', label: 'Stationery', desc: 'Pens, paper', status: 'ACTIVE' },
      { id: 's4', label: 'Furniture', desc: 'Desks, chairs', status: 'ACTIVE' },
    ],
  },
  item: {
    s1: [
      { id: 'i1', label: 'iPhone 15', desc: 'Apple smartphone', status: 'ACTIVE' },
      { id: 'i2', label: 'Galaxy S24', desc: 'Samsung smartphone', status: 'ACTIVE' },
    ],
    s2: [
      { id: 'i3', label: 'MacBook Pro', desc: 'Apple laptop', status: 'ACTIVE' },
      { id: 'i4', label: 'ThinkPad X1', desc: 'Lenovo laptop', status: 'INACTIVE' },
    ],
    s3: [
      { id: 'i5', label: 'Ballpoint Pen', desc: 'Blue ink', status: 'ACTIVE' },
    ],
    s4: [
      { id: 'i6', label: 'Office Chair', desc: 'Ergonomic', status: 'ACTIVE' },
    ],
  },
});
const millerSelected = ref({ category: null, subcategory: null, item: null });
const millerSearchKeywords = ref({ category: '', subcategory: '', item: '' });
const millerActionMenu = ref({ show: false, x: 0, y: 0, colKey: '', item: null });
const millerDownloadMenu = ref({ show: false, x: 0, y: 0, colKey: '' });
const millerModal = ref(false);
const millerModalMode = ref('add'); // 'add' | 'edit' | 'view'
const millerModalColKey = ref('');
const millerForm = ref({ label: '', desc: '', status: 'ACTIVE' });

const millerVisibleColumns = computed(() => {
  const v = ['category'];
  if (millerSelected.value.category) v.push('subcategory');
  if (millerSelected.value.subcategory) v.push('item');
  return v;
});
const millerColumnWidths = { category: 180, subcategory: 180, item: 180 };

const handleMillerItemClick = (colKey, item) => {
  millerSelected.value[colKey] = item;
  if (colKey === 'category') {
    millerSelected.value.subcategory = null;
    millerSelected.value.item = null;
  } else if (colKey === 'subcategory') {
    millerSelected.value.item = null;
  }
};

const getMillerList = (colKey) => {
  if (colKey === 'category') return millerData.value.category;
  if (colKey === 'subcategory') {
    const cat = millerSelected.value.category;
    return cat ? (millerData.value.subcategory[cat.id] || []) : [];
  }
  if (colKey === 'item') {
    const sub = millerSelected.value.subcategory;
    return sub ? (millerData.value.item[sub.id] || []) : [];
  }
  return [];
};

const getMillerFilteredList = (colKey) => {
  const list = getMillerList(colKey);
  const kw = (millerSearchKeywords.value[colKey] || '').toLowerCase().trim();
  if (!kw) return list;
  return list.filter(
    (i) =>
      (i.label || '').toLowerCase().includes(kw) ||
      (i.desc || '').toLowerCase().includes(kw)
  );
};

const millerSelectionPath = computed(() => {
  const p = [];
  if (millerSelected.value.category) p.push({ key: 'category', label: millerSelected.value.category.label });
  if (millerSelected.value.subcategory) p.push({ key: 'subcategory', label: millerSelected.value.subcategory.label });
  if (millerSelected.value.item) p.push({ key: 'item', label: millerSelected.value.item.label });
  return p;
});

const toggleMillerActionMenu = (e, colKey, item) => {
  e.stopPropagation();
  if (millerActionMenu.value.show && millerActionMenu.value.item === item) {
    millerActionMenu.value.show = false;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  millerActionMenu.value = { show: true, x: rect.right + 4, y: rect.top, colKey, item };
};

const toggleMillerDownloadMenu = (e, colKey) => {
  e.stopPropagation();
  if (millerDownloadMenu.value.show && millerDownloadMenu.value.colKey === colKey) {
    millerDownloadMenu.value.show = false;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  millerDownloadMenu.value = { show: true, x: rect.left, y: rect.bottom + 4, colKey };
};

const closeMillerActionMenu = () => { millerActionMenu.value.show = false; };
const closeMillerDownloadMenu = () => { millerDownloadMenu.value.show = false; };

const handleMillerAdd = (colKey) => {
  millerModalMode.value = 'add';
  millerModalColKey.value = colKey;
  millerForm.value = { label: '', desc: '', status: 'ACTIVE' };
  millerModal.value = true;
};

const handleMillerView = (colKey, item) => {
  millerModalMode.value = 'view';
  millerModalColKey.value = colKey;
  millerForm.value = { label: item.label, desc: item.desc || '', status: item.status || 'ACTIVE' };
  millerModal.value = true;
};

const handleMillerEdit = (colKey, item) => {
  millerModalMode.value = 'edit';
  millerModalColKey.value = colKey;
  millerForm.value = { label: item.label, desc: item.desc || '', status: item.status || 'ACTIVE', _item: item };
  millerModal.value = true;
};

const handleMillerDelete = (colKey, item) => {
  $swal.fire({
    title: 'Are you sure?',
    text: `Delete "${item.label}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      if (colKey === 'category') {
        millerData.value.category = millerData.value.category.filter((i) => i.id !== item.id);
        if (millerSelected.value.category?.id === item.id) {
          millerSelected.value.category = null;
          millerSelected.value.subcategory = null;
          millerSelected.value.item = null;
        }
      } else if (colKey === 'subcategory') {
        const catId = millerSelected.value.category?.id;
        if (catId && millerData.value.subcategory[catId]) {
          millerData.value.subcategory[catId] = millerData.value.subcategory[catId].filter((i) => i.id !== item.id);
          if (millerSelected.value.subcategory?.id === item.id) {
            millerSelected.value.subcategory = null;
            millerSelected.value.item = null;
          }
        }
      } else if (colKey === 'item') {
        const subId = millerSelected.value.subcategory?.id;
        if (subId && millerData.value.item[subId]) {
          millerData.value.item[subId] = millerData.value.item[subId].filter((i) => i.id !== item.id);
          if (millerSelected.value.item?.id === item.id) millerSelected.value.item = null;
        }
      }
      $swal.fire({ title: 'Deleted!', text: 'Item has been deleted.', icon: 'success', timer: 2000, showConfirmButton: false });
    }
  });
};

const handleMillerSave = () => {
  if (!millerForm.value.label?.trim()) {
    $swal.fire({ title: 'Validation Error', text: 'Label is required', icon: 'warning' });
    return;
  }
  const colKey = millerModalColKey.value;
  if (millerModalMode.value === 'add') {
    const newId = 'new_' + Date.now();
    const newItem = { id: newId, label: millerForm.value.label.trim(), desc: millerForm.value.desc || '', status: millerForm.value.status || 'ACTIVE' };
    if (colKey === 'category') {
      millerData.value.category.push(newItem);
    } else if (colKey === 'subcategory') {
      const catId = millerSelected.value.category?.id;
      if (catId) {
        if (!millerData.value.subcategory[catId]) millerData.value.subcategory[catId] = [];
        millerData.value.subcategory[catId].push(newItem);
      }
    } else if (colKey === 'item') {
      const subId = millerSelected.value.subcategory?.id;
      if (subId) {
        if (!millerData.value.item[subId]) millerData.value.item[subId] = [];
        millerData.value.item[subId].push(newItem);
      }
    }
    $swal.fire({ title: 'Added!', text: 'Item has been added.', icon: 'success', timer: 2000, showConfirmButton: false });
  } else if (millerModalMode.value === 'edit') {
    const orig = millerForm.value._item;
    if (orig) {
      orig.label = millerForm.value.label.trim();
      orig.desc = millerForm.value.desc || '';
      orig.status = millerForm.value.status || 'ACTIVE';
    }
    $swal.fire({ title: 'Updated!', text: 'Item has been updated.', icon: 'success', timer: 2000, showConfirmButton: false });
  }
  millerModal.value = false;
};

const getMillerExportData = (colKey) => {
  const list = getMillerFilteredList(colKey);
  return list.map((item, idx) => ({
    no: idx + 1,
    Code: item.label,
    'Description (Malay)': item.desc || '',
    Status: item.status || 'ACTIVE',
  }));
};

const getMillerColumnTitle = (colKey) => millerColumns.value.find((c) => c.key === colKey)?.title || colKey;

const handleMillerDownloadPDF = async (colKey) => {
  try {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const data = getMillerExportData(colKey);
    if (data.length === 0) {
      $swal.fire({ title: 'No Data', text: 'There is no data to export', icon: 'warning' });
      return;
    }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const title = getMillerColumnTitle(colKey);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, 105, 15, { align: 'center' });
    autoTable(doc, {
      head: [['No.', 'Code', 'Description (Malay)', 'Status']],
      body: data.map((r) => [r.no, r.Code, r['Description (Malay)'], r.Status]),
      startY: 22,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
    });
    doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    $swal.fire({ title: 'Success', text: 'PDF downloaded', icon: 'success', timer: 2000, showConfirmButton: false });
  } catch (e) {
    $swal.fire({ title: 'Error', text: e?.message || 'Failed to export PDF', icon: 'error' });
  }
};

const handleMillerDownloadCSV = (colKey) => {
  try {
    const data = getMillerExportData(colKey);
    if (data.length === 0) {
      $swal.fire({ title: 'No Data', text: 'There is no data to export', icon: 'warning' });
      return;
    }
    const escape = (f) => (f == null ? '' : String(f).includes(',') || String(f).includes('"') ? `"${String(f).replace(/"/g, '""')}"` : String(f));
    const headers = ['No.', 'Code', 'Description (Malay)', 'Status'];
    let csv = headers.map(escape).join(',') + '\n';
    data.forEach((r) => { csv += [r.no, r.Code, r['Description (Malay)'], r.Status].map(escape).join(',') + '\n'; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${getMillerColumnTitle(colKey).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    $swal.fire({ title: 'Success', text: 'CSV downloaded', icon: 'success', timer: 2000, showConfirmButton: false });
  } catch (e) {
    $swal.fire({ title: 'Error', text: e?.message || 'Failed to export CSV', icon: 'error' });
  }
};

const handleMillerDownloadExcel = async (colKey) => {
  try {
    const ExcelJS = await import('exceljs');
    const data = getMillerExportData(colKey);
    if (data.length === 0) {
      $swal.fire({ title: 'No Data', text: 'There is no data to export', icon: 'warning' });
      return;
    }
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(getMillerColumnTitle(colKey));
    ws.addRow(['No.', 'Code', 'Description (Malay)', 'Status']);
    data.forEach((r) => ws.addRow([r.no, r.Code, r['Description (Malay)'], r.Status]));
    const buf = await wb.xlsx.writeBuffer();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    a.download = `${getMillerColumnTitle(colKey).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
    $swal.fire({ title: 'Success', text: 'Excel downloaded', icon: 'success', timer: 2000, showConfirmButton: false });
  } catch (e) {
    $swal.fire({ title: 'Error', text: e?.message || 'Failed to export Excel', icon: 'error' });
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', closeMillerActionMenu);
    window.addEventListener('click', closeMillerDownloadMenu);
  }
});
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', closeMillerActionMenu);
    window.removeEventListener('click', closeMillerDownloadMenu);
  }
});

// Side Panel (master-detail) – demo data
const sidePanelItems = ref([
  { id: 1, title: 'Dashboard', menu: 'Home', status: 'ACTIVE' },
  { id: 2, title: 'Budget Code', menu: 'Budget / Setup', status: 'ACTIVE' },
  { id: 3, title: 'Page Creator', menu: 'Workbence Editor', status: 'ACTIVE' },
]);
const sidePanelSelected = ref(null);
const sidePanelSearch = ref('');
const sidePanelFilteredItems = computed(() => {
  if (!sidePanelSearch.value?.trim()) return sidePanelItems.value;
  const kw = sidePanelSearch.value.toLowerCase();
  return sidePanelItems.value.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(kw) ||
      (p.menu || '').toLowerCase().includes(kw)
  );
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <!-- Form Controls -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Form Controls</div>
        <p class="text-sm text-muted-foreground mt-1">Reference: Setup / Sample Form</p>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleFormSave">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">Text:</label>
              <div class="flex-1">
                <FormKit v-model="formData.text" type="text" placeholder="Enter text" outer-class="mb-0" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">Date:</label>
              <div class="flex-1">
                <FormKit v-model="formData.datePicker" type="date" outer-class="mb-0">
                  <template #suffix>
                    <div class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer">
                      <Icon name="material-symbols:calendar-today" class="!w-5 !h-5 text-gray-500" />
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>
            <div class="flex items-start gap-4 md:col-span-2">
              <label class="w-32 text-sm font-medium pt-2 shrink-0">Textarea:</label>
              <div class="flex-1">
                <FormKit v-model="formData.textarea" type="textarea" rows="3" outer-class="mb-0" />
              </div>
            </div>
            <!-- Checkbox: native inputs to match Edit Component style -->
            <div class="flex items-center gap-2">
              <label class="w-28 text-xs font-medium shrink-0">Checkbox:</label>
              <div class="flex gap-4 flex-1 flex-wrap">
                <div class="flex items-center gap-2">
                  <label class="w-12 text-xs font-medium">Yes:</label>
                  <input
                    type="checkbox"
                    :checked="formData.checkBox.includes('yes')"
                    @change="(e) => { formData.checkBox = e.target.checked ? [...formData.checkBox, 'yes'] : formData.checkBox.filter(v => v !== 'yes'); }"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <label class="w-12 text-xs font-medium">No:</label>
                  <input
                    type="checkbox"
                    :checked="formData.checkBox.includes('no')"
                    @change="(e) => { formData.checkBox = e.target.checked ? [...formData.checkBox, 'no'] : formData.checkBox.filter(v => v !== 'no'); }"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <!-- Radio: native inputs to match Edit Component style -->
            <div class="flex items-center gap-2">
              <label class="w-28 text-xs font-medium shrink-0">Radio:</label>
              <div class="flex gap-4 flex-1 flex-wrap">
                <div class="flex items-center gap-2">
                  <label class="w-12 text-xs font-medium">Yes:</label>
                  <input
                    type="radio"
                    name="radio-demo"
                    value="yes"
                    :checked="formData.radioButton === 'yes'"
                    @change="formData.radioButton = 'yes'"
                    class="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <label class="w-12 text-xs font-medium">No:</label>
                  <input
                    type="radio"
                    name="radio-demo"
                    value="no"
                    :checked="formData.radioButton === 'no'"
                    @change="formData.radioButton = 'no'"
                    class="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">Select:</label>
              <div class="flex-1">
                <FormKit v-model="formData.dropDown" type="select" :options="dropdownOptions" placeholder="Select..." outer-class="mb-0">
                  <template #suffix>
                    <button v-if="formData.dropDown" type="button" @click="formData.dropDown = ''" class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                    </button>
                  </template>
                </FormKit>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">File:</label>
              <div class="flex-1">
                <FormKit v-model="formData.fileUpload" type="text" placeholder="Select file" outer-class="mb-0">
                  <template #suffix>
                    <div class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer">
                      <Icon name="material-symbols:attach-file" class="!w-5 !h-5 text-gray-500" />
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">MYR:</label>
              <div class="flex-1">
                <FormKit v-model="formData.rmDisplay" type="text" outer-class="mb-0">
                  <template #prefix>
                    <div class="bg-gray-100 dark:bg-gray-700 h-full rounded-l-md px-3 flex items-center border-r border-gray-300 dark:border-gray-600">
                      <span class="text-sm font-medium">MYR</span>
                    </div>
                  </template>
                </FormKit>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">Pill box:</label>
              <div class="flex-1">
                <FormKit v-model="formData.pillBox" type="text" outer-class="mb-0">
                  <template #suffix>
                    <button v-if="formData.pillBox" type="button" @click="formData.pillBox = ''" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                    </button>
                  </template>
                </FormKit>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <label class="w-32 text-sm font-medium shrink-0">Drop zone:</label>
              <div class="flex-1">
                <FormKit v-model="formData.dropZone" type="text" placeholder="Drag & drop" outer-class="mb-0" />
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <rs-button variant="primary" type="submit">
              <Icon name="material-symbols:save" class="mr-2" size="1rem" />
              Save
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Buttons -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Buttons</div>
      </template>
      <template #body>
        <div class="flex flex-wrap gap-2">
          <rs-button variant="primary">Primary</rs-button>
          <rs-button variant="secondary">Secondary</rs-button>
          <rs-button variant="danger">Danger</rs-button>
          <rs-button variant="secondary-outline">Outline</rs-button>
          <rs-button variant="secondary-text">Text</rs-button>
          <rs-button variant="primary" size="sm">Small</rs-button>
          <rs-button variant="primary" size="lg">Large</rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Cards -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Cards</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-card>
            <template #header>Basic Card</template>
            <template #body>
              <p class="text-sm text-muted-foreground">Header + body only.</p>
            </template>
          </rs-card>
          <rs-card>
            <template #header>Card with Footer</template>
            <template #body>
              <p class="text-sm text-muted-foreground">Body content here.</p>
            </template>
            <template #footer>
              <rs-button variant="primary" size="sm">Action</rs-button>
            </template>
          </rs-card>
          <rs-card>
            <template #header>
              <div class="flex items-center justify-between">
                <span>Card with Header Actions</span>
                <div class="flex gap-2">
                  <Icon name="material-symbols:tag" class="cursor-pointer text-gray-500 hover:text-primary" size="18" />
                  <Icon name="material-symbols:content-copy" class="cursor-pointer text-gray-500 hover:text-primary" size="18" />
                  <Icon name="material-symbols:edit" class="cursor-pointer text-gray-500 hover:text-primary" size="18" />
                </div>
              </div>
            </template>
            <template #body>
              <p class="text-sm text-muted-foreground">Icons in header.</p>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Alerts -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Alerts</div>
      </template>
      <template #body>
        <div class="space-y-2">
          <rs-alert variant="primary">Primary alert</rs-alert>
          <rs-alert variant="success">Success alert</rs-alert>
          <rs-alert variant="warning">Warning alert</rs-alert>
          <rs-alert variant="danger">Danger alert</rs-alert>
          <rs-alert variant="info">Dismissible alert (click X to close)</rs-alert>
        </div>
      </template>
    </rs-card>

    <!-- Modal & Dropdown -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Modal & Dropdown</div>
      </template>
      <template #body>
        <div class="flex gap-2">
          <rs-button variant="primary" @click="showModal = true">Open Modal</rs-button>
          <rs-dropdown variant="secondary-text" size="sm" position="bottom" textAlign="right">
            <template #title>
              <rs-button variant="secondary">Dropdown <Icon name="mdi:chevron-down" class="ml-1" size="1rem" /></rs-button>
            </template>
            <rs-dropdown-item @click="$swal.fire({ title: 'Action 1', icon: 'info' })">Action 1</rs-dropdown-item>
            <rs-dropdown-item @click="$swal.fire({ title: 'Action 2', icon: 'info' })">Action 2</rs-dropdown-item>
            <rs-dropdown-item @click="$swal.fire({ title: 'Action 3', icon: 'info' })">Action 3</rs-dropdown-item>
          </rs-dropdown>
        </div>
      </template>
    </rs-card>

    <!-- Datatable Smart Filter -->
    <input ref="smartFilterTemplateInputRef" type="file" accept=".json,application/json" class="hidden" @change="onSmartFilterTemplateChange" />
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-lg font-semibold">Datatable – Smart Filter Pattern</div>
            <p class="text-sm text-muted-foreground">Reference: Budget / Setup / Budget Code</p>
          </div>
          <rs-dropdown variant="secondary-text" size="sm" :hideChevron="true" position="bottom" textAlign="right" itemSize="11rem" class="[&_.button]:!h-8 [&_.button]:!min-h-8 [&_.button]:!p-1 [&_.button]:!border-0 [&_.button]:!min-w-0">
            <template #title>
              <Icon name="mdi:dots-vertical" size="1rem" />
            </template>
            <rs-dropdown-item @click="handleSmartFilterSaveTemplate">Save Template</rs-dropdown-item>
            <rs-dropdown-item @click="handleSmartFilterLoadTemplate">Load Template</rs-dropdown-item>
            <rs-dropdown-item v-if="smartFilterIsGrouped" @click="handleSmartFilterUngroup">Ungroup List</rs-dropdown-item>
            <rs-dropdown-item v-else @click="handleSmartFilterGroup">Group List</rs-dropdown-item>
            <rs-dropdown-item @click="handleSmartFilterGenerateApi">Generate API</rs-dropdown-item>
          </rs-dropdown>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-between items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">Display:</label>
              <FormKit v-model="smartFilterPageSize" type="select" :options="[5, 10, 25, 50].map((v) => ({ label: String(v), value: v }))" outer-class="mb-0" />
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">Search:</label>
              <FormKit v-model="smartFilterKeyword" type="text" placeholder="Search..." outer-class="mb-0">
                <template #suffix>
                  <button v-if="smartFilterKeyword" type="button" @click="smartFilterKeyword = ''" class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                  </button>
                </template>
              </FormKit>
              <rs-button variant="secondary" @click="showSmartFilter = true">
                <Icon name="ic:outline-filter-alt" size="1rem" />
              </rs-button>
            </div>
          </div>
          <div class="kitchen-sink-table-wrapper">
            <rs-table
              ref="smartFilterDatatableRef"
              :exportConfigRef="smartFilterExportConfigRef"
              :data="filteredSmartFilterData"
              :field="['no', 'Level', 'Budget Code', 'Description', 'Status']"
              :options="{ variant: 'primary', striped: false, bordered: false, borderless: true }"
              :optionsAdvanced="{ sortable: true, filterable: false, responsive: false, outsideBorder: false }"
              advanced
              :pageSize="smartFilterPageSize"
              :hideTableSearch="true"
              :hideTablePageSize="true"
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="smartFilterIsGrouped"
            >
              <template v-slot:no="data">{{ data.value.no }}</template>
              <template v-slot:Level="data">{{ data.value.Level }}</template>
              <template v-slot:BudgetCode="data">{{ data.value['Budget Code'] }}</template>
              <template v-slot:Description="data">{{ data.value.Description }}</template>
              <template v-slot:Status="data">
                <span :class="{ 'text-green-600': data.value.Status === 'ACTIVE', 'text-red-600': data.value.Status === 'INACTIVE' }">{{ data.value.Status }}</span>
              </template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="text-sm text-muted-foreground">{{ filteredSmartFilterData.length }} records</span>
            <div class="flex gap-2">
              <rs-button variant="secondary" @click="handleSmartFilterDownloadPDF">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleSmartFilterDownloadCSV">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                CSV
              </rs-button>
              <rs-button variant="secondary" @click="handleExportExcel('smart')">
                <Icon name="material-symbols:table-chart" class="mr-2" size="1rem" />
                Excel
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Datatable Top Filter -->
    <input ref="topFilterTemplateInputRef" type="file" accept=".json,application/json" class="hidden" @change="onTopFilterTemplateChange" />
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-lg font-semibold">Datatable – Top Filter Pattern</div>
            <p class="text-sm text-muted-foreground">Reference: Budget / Setup / Budget Structure List</p>
          </div>
          <rs-dropdown variant="secondary-text" size="sm" :hideChevron="true" position="bottom" textAlign="right" itemSize="11rem" class="[&_.button]:!h-8 [&_.button]:!min-h-8 [&_.button]:!p-1 [&_.button]:!border-0 [&_.button]:!min-w-0">
            <template #title>
              <Icon name="mdi:dots-vertical" size="1rem" />
            </template>
            <rs-dropdown-item @click="handleTopFilterSaveTemplate">Save Template</rs-dropdown-item>
            <rs-dropdown-item @click="handleTopFilterLoadTemplate">Load Template</rs-dropdown-item>
            <rs-dropdown-item v-if="topFilterIsGrouped" @click="handleTopFilterUngroup">Ungroup List</rs-dropdown-item>
            <rs-dropdown-item v-else @click="handleTopFilterGroup">Group List</rs-dropdown-item>
            <rs-dropdown-item @click="handleTopFilterGenerateApi">Generate API</rs-dropdown-item>
          </rs-dropdown>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              <div>
                <label class="block text-sm font-medium mb-2">Year</label>
                <FormKit v-model="topFilter.year" type="text" placeholder="Year" outer-class="mb-0" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Fund</label>
                <FormKit v-model="topFilter.fund" type="text" placeholder="Fund" outer-class="mb-0" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">PTJ</label>
                <FormKit v-model="topFilter.ptj" type="text" placeholder="PTJ" outer-class="mb-0" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Cost Centre</label>
                <FormKit v-model="topFilter.costCentre" type="text" placeholder="Cost Centre" outer-class="mb-0" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Activity</label>
                <FormKit v-model="topFilter.activity" type="text" placeholder="Activity" outer-class="mb-0" />
              </div>
            </div>
            <rs-button @click="() => {}">
              <Icon name="material-symbols:search" class="mr-1" size="1rem" />
              Search
            </rs-button>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">Display:</label>
              <FormKit v-model="topFilterPageSize" type="select" :options="[5, 10, 25, 50].map((v) => ({ label: String(v), value: v }))" outer-class="mb-0" />
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium">Search:</label>
              <FormKit v-model="topFilterKeyword" type="text" placeholder="Search..." outer-class="mb-0">
                <template #suffix>
                  <button v-if="topFilterKeyword" type="button" @click="topFilterKeyword = ''" class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                  </button>
                </template>
              </FormKit>
            </div>
          </div>
          <div class="kitchen-sink-table-wrapper">
            <rs-table
              ref="topFilterDatatableRef"
              :exportConfigRef="topFilterExportConfigRef"
              :data="filteredTopFilterData"
              :field="['no', 'Fund', 'PTJ', 'Cost Centre', 'Activity', 'Budget Code', 'Status', 'Year']"
              :options="{ variant: 'primary', striped: false, bordered: false, borderless: true }"
              :optionsAdvanced="{ sortable: true, filterable: false, responsive: false, outsideBorder: false }"
              advanced
              :pageSize="topFilterPageSize"
              :hideTableSearch="true"
              :hideTablePageSize="true"
              :columnMovable="true"
              :columnHideShow="true"
              :columnGroupingList="topFilterIsGrouped"
            >
              <template v-slot:no="data">{{ data.value.no }}</template>
              <template v-slot:Fund="data">{{ data.value.Fund }}</template>
              <template v-slot:PTJ="data">{{ data.value.PTJ }}</template>
              <template v-slot:CostCentre="data">{{ data.value['Cost Centre'] }}</template>
              <template v-slot:Activity="data">{{ data.value.Activity }}</template>
              <template v-slot:BudgetCode="data">{{ data.value['Budget Code'] }}</template>
              <template v-slot:Status="data">
                <span :class="{ 'text-green-600': data.value.Status === 'ACTIVE', 'text-red-600': data.value.Status === 'INACTIVE' }">{{ data.value.Status }}</span>
              </template>
              <template v-slot:Year="data">{{ data.value.Year }}</template>
            </rs-table>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="text-sm text-muted-foreground">{{ filteredTopFilterData.length }} records</span>
            <div class="flex gap-2">
              <rs-button variant="secondary" @click="handleTopFilterDownloadPDF">
                <Icon name="material-symbols:picture-as-pdf" class="mr-2" size="1rem" />
                PDF
              </rs-button>
              <rs-button variant="secondary" @click="handleTopFilterDownloadCSV">
                <Icon name="material-symbols:file-download" class="mr-2" size="1rem" />
                CSV
              </rs-button>
              <rs-button variant="secondary" @click="handleExportExcel('top')">
                <Icon name="material-symbols:table-chart" class="mr-2" size="1rem" />
                Excel
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Miller Columns (hierarchical drilldown) -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-semibold">Miller Columns – Hierarchical Drilldown</div>
            <p class="text-sm text-muted-foreground">Reference: Setup / GL Structure / Account Code v2</p>
          </div>
          <span class="text-sm text-gray-500">{{ millerVisibleColumns.length }} of {{ millerColumns.length }} levels</span>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="flex items-center gap-1 text-sm min-h-[28px] flex-wrap">
            <span class="text-gray-500 dark:text-gray-400 font-medium">Path:</span>
            <template v-if="millerSelectionPath.length === 0">
              <span class="text-gray-400 dark:text-gray-500 italic">Select an item to begin browsing...</span>
            </template>
            <template v-for="(part, idx) in millerSelectionPath" :key="part.key">
              <span v-if="idx > 0" class="text-gray-400 dark:text-gray-500 mx-1">
                <Icon name="material-symbols:chevron-right" size="16" />
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                {{ part.label }}
              </span>
            </template>
          </div>
          <div class="flex overflow-x-auto border rounded-lg">
            <template v-for="colKey in millerVisibleColumns" :key="colKey">
              <div
                class="flex-shrink-0 flex flex-col border-r last:border-r-0 border-gray-200 dark:border-gray-700"
                :style="{ width: millerColumnWidths[colKey] + 'px' }"
              >
                <div class="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide truncate">
                    {{ millerColumns.find((c) => c.key === colKey)?.title }}
                  </span>
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                      {{ getMillerFilteredList(colKey).length }}
                    </span>
                    <button
                      @click.stop="handleMillerAdd(colKey)"
                      class="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Add new"
                    >
                      <Icon name="material-symbols:add" size="16" class="text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      @click.stop="toggleMillerDownloadMenu($event, colKey)"
                      class="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Download"
                    >
                      <Icon name="mdi:dots-vertical" size="16" class="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div class="px-2 py-1.5 border-b border-gray-100 dark:border-gray-700">
                  <div class="relative">
                    <Icon name="material-symbols:search" size="14" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      v-model="millerSearchKeywords[colKey]"
                      type="text"
                      placeholder="Search..."
                      class="w-full pl-7 pr-7 py-1 text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <button
                      v-if="millerSearchKeywords[colKey]"
                      @click="millerSearchKeywords[colKey] = ''"
                      class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Icon name="material-symbols:close" size="12" class="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto max-h-[200px] py-0.5">
                  <div
                    v-for="(item, idx) in getMillerFilteredList(colKey)"
                    :key="item.id || idx"
                    @click="handleMillerItemClick(colKey, item)"
                    @contextmenu.prevent="toggleMillerActionMenu($event, colKey, item)"
                    class="group flex items-center gap-2 px-3 py-1.5 mx-0.5 rounded cursor-pointer transition-all"
                    :class="{
                      'bg-primary text-white': millerSelected[colKey]?.id === item.id,
                      'hover:bg-gray-100 dark:hover:bg-gray-700/50': millerSelected[colKey]?.id !== item.id,
                    }"
                  >
                    <span
                      class="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                      :class="{
                        'bg-green-400': (item.status || 'ACTIVE') === 'ACTIVE',
                        'bg-red-400': (item.status || '') === 'INACTIVE',
                        'bg-gray-300': !item.status,
                      }"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-semibold truncate" :class="{ 'text-white': millerSelected[colKey]?.id === item.id }">
                        {{ item.label }}
                      </div>
                      <div
                        class="text-[10px] truncate leading-tight"
                        :class="{
                          'text-white/70': millerSelected[colKey]?.id === item.id,
                          'text-gray-500 dark:text-gray-400': millerSelected[colKey]?.id !== item.id,
                        }"
                      >
                        {{ item.desc || '' }}
                      </div>
                    </div>
                    <button
                      @click.stop="toggleMillerActionMenu($event, colKey, item)"
                      class="flex-shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
                      :class="{
                        'opacity-100': millerSelected[colKey]?.id === item.id,
                        'opacity-0 group-hover:opacity-100': millerSelected[colKey]?.id !== item.id,
                      }"
                      title="Actions"
                    >
                      <Icon name="mdi:dots-vertical" size="16" :class="millerSelected[colKey]?.id === item.id ? 'text-white/80' : 'text-gray-400'" />
                    </button>
                  </div>
                  <div v-if="getMillerFilteredList(colKey).length === 0" class="flex justify-center py-6 px-3">
                    <span class="text-xs text-gray-400 italic">No items found</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Miller Action Menu (View, Edit, Delete) -->
    <Teleport to="body">
      <div
        v-if="millerActionMenu.show"
        class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[150px]"
        :style="{ left: millerActionMenu.x + 'px', top: millerActionMenu.y + 'px' }"
        @click.stop
      >
        <button
          @click="handleMillerView(millerActionMenu.colKey, millerActionMenu.item); closeMillerActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="material-symbols:visibility" size="15" class="text-gray-500" /> View
        </button>
        <button
          @click="handleMillerEdit(millerActionMenu.colKey, millerActionMenu.item); closeMillerActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="material-symbols:edit" size="15" class="text-gray-500" /> Edit
        </button>
        <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
        <button
          @click="handleMillerDelete(millerActionMenu.colKey, millerActionMenu.item); closeMillerActionMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <Icon name="material-symbols:delete" size="15" /> Delete
        </button>
      </div>
    </Teleport>

    <!-- Miller Download Menu (PDF, CSV, Excel) -->
    <Teleport to="body">
      <div
        v-if="millerDownloadMenu.show"
        class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[170px]"
        :style="{ left: millerDownloadMenu.x + 'px', top: millerDownloadMenu.y + 'px' }"
        @click.stop
      >
        <button
          @click="handleMillerDownloadPDF(millerDownloadMenu.colKey); closeMillerDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="material-symbols:picture-as-pdf" size="15" class="text-red-500" /> Download PDF
        </button>
        <button
          @click="handleMillerDownloadCSV(millerDownloadMenu.colKey); closeMillerDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="material-symbols:file-download" size="15" class="text-green-500" /> Download CSV
        </button>
        <button
          @click="handleMillerDownloadExcel(millerDownloadMenu.colKey); closeMillerDownloadMenu();"
          class="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon name="material-symbols:table-chart" size="15" class="text-blue-500" /> Download Excel
        </button>
      </div>
    </Teleport>

    <!-- Miller Add/Edit/View Modal -->
    <rs-modal v-model="millerModal" :title="millerModalMode === 'view' ? 'View Item' : millerModalMode === 'edit' ? 'Edit Item' : 'Add Item'" size="md">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Label</label>
            <FormKit
              v-model="millerForm.label"
              type="text"
              :disabled="millerModalMode === 'view'"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <FormKit
              v-model="millerForm.desc"
              type="textarea"
              rows="3"
              :disabled="millerModalMode === 'view'"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <FormKit
              v-model="millerForm.status"
              type="select"
              :options="[{ label: 'ACTIVE', value: 'ACTIVE' }, { label: 'INACTIVE', value: 'INACTIVE' }]"
              :disabled="millerModalMode === 'view'"
              outer-class="mb-0"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="millerModal = false">{{ millerModalMode === 'view' ? 'Close' : 'Cancel' }}</rs-button>
          <rs-button v-if="millerModalMode !== 'view'" variant="primary" @click="handleMillerSave">Save</rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Side Panel (master-detail) -->
    <rs-card>
      <template #header>
        <div>
          <div class="text-lg font-semibold">Side Panel – Multilevel Master-Detail</div>
          <p class="text-sm text-muted-foreground">Reference: Workbence Editor / Page Editor / Page Creator</p>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="col-span-1 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <FormKit v-model="sidePanelSearch" type="text" placeholder="Search..." outer-class="mb-0 flex-1">
                <template #suffix>
                  <button v-if="sidePanelSearch" type="button" @click="sidePanelSearch = ''" class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                  </button>
                </template>
              </FormKit>
            </div>
            <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <div class="px-4 py-2 text-xs font-semibold uppercase text-gray-500 border-b dark:border-gray-700">Items</div>
              <div class="max-h-[240px] overflow-y-auto">
                <button
                  v-for="item in sidePanelFilteredItems"
                  :key="item.id"
                  @click="sidePanelSelected = item"
                  class="w-full text-left px-4 py-3 border-b last:border-b-0 dark:border-gray-700 hover:bg-primary/10 transition"
                  :class="{ 'bg-primary/10 border-primary text-primary': sidePanelSelected?.id === item.id }"
                >
                  <div class="text-sm font-semibold">{{ item.title }}</div>
                  <div class="text-xs text-gray-500">{{ item.menu || 'No menu' }}</div>
                  <span
                    class="inline-block mt-1 px-2 py-0.5 rounded text-[11px]"
                    :class="{
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.status === 'ACTIVE',
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': item.status !== 'ACTIVE',
                    }"
                  >
                    {{ item.status || 'UNKNOWN' }}
                  </span>
                </button>
                <div v-if="sidePanelFilteredItems.length === 0" class="p-4 text-center text-sm text-gray-500">No items found</div>
              </div>
            </div>
          </div>
          <div class="col-span-2 border rounded-lg bg-white dark:bg-gray-900 shadow-sm flex flex-col">
            <div class="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
              <div class="text-sm font-semibold">Detail</div>
            </div>
            <div class="p-4 flex-1 flex flex-col gap-4">
              <div v-if="!sidePanelSelected" class="flex items-center justify-center h-32 text-sm text-gray-500">
                Select an item to view details
              </div>
              <div v-else class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500">Title</label>
                  <div class="text-sm font-semibold">{{ sidePanelSelected.title }}</div>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">Menu</label>
                  <div class="text-sm">{{ sidePanelSelected.menu }}</div>
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-500">Status</label>
                  <div class="text-sm">
                    <span
                      class="inline-block px-2 py-0.5 rounded text-xs"
                      :class="{
                        'bg-green-100 text-green-700': sidePanelSelected.status === 'ACTIVE',
                        'bg-red-100 text-red-700': sidePanelSelected.status !== 'ACTIVE',
                      }"
                    >
                      {{ sidePanelSelected.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Smart Filter Modal -->
    <rs-modal v-model="showSmartFilter" title="Smart Filter" @update:modelValue="(v) => (showSmartFilter = v)">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Level</label>
            <FormKit v-model="smartFilter.level" type="text" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Budget Code</label>
            <FormKit v-model="smartFilter.code" type="text" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <FormKit v-model="smartFilter.description" type="text" outer-class="mb-0" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Status</label>
            <FormKit v-model="smartFilter.status" type="select" :options="[{ label: 'ACTIVE', value: 'ACTIVE' }, { label: 'INACTIVE', value: 'INACTIVE' }]" outer-class="mb-0" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="handleSmartFilterReset">Reset</rs-button>
          <rs-button variant="primary" @click="handleSmartFilterOk">OK</rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Demo Modal -->
    <rs-modal v-model="showModal" title="Demo Modal" size="md">
      <template #body>
        <p class="text-muted-foreground">This is a demo modal. Use rs-modal with v-model, title, and optional size (sm, md, lg, xl).</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showModal = false">Cancel</rs-button>
          <rs-button variant="primary" @click="showModal = false">OK</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>
