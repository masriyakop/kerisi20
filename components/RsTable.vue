<script setup>
import { useLayoutStore } from "~/stores/layout";
import { useWindowSize } from "vue-window-size";

const layoutStore = useLayoutStore();
const mobileWidth = layoutStore.mobileWidth;

const { width } = useWindowSize();
const windowWidth = ref(width);

const props = defineProps({
  field: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  basic: {
    type: Boolean,
    default: true,
  },
  advanced: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({
      variant: "default",
      striped: false,
      bordered: false,
      borderless: false,
      hover: false,
    }),
  },
  optionsAdvanced: {
    type: Object,
    default: () => ({
      sortable: true,
      filterable: true,
      responsive: false,
      outsideBorder: false,
    }),
  },
  grid: {
    type: Boolean,
    default: false,
  },
  pageSize: {
    type: Number,
    default: 5,
  },
  sort: {
    type: Object,
    default: () => ({
      column: "",
      direction: "asc",
    }),
  },
  hideTableSearch: {
    type: Boolean,
    default: false,
  },
  hideTablePageSize: {
    type: Boolean,
    default: false,
  },
  hideTableFooter: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: null,
  },
  freezeLeft: {
    type: Number,
    default: 0,
  },
  freezeRight: {
    type: Number,
    default: 0,
  },
  columnMovable: {
    type: Boolean,
    default: false,
  },
  columnHideShow: {
    type: Boolean,
    default: false,
  },
  columnGroupingList: {
    type: Boolean,
    default: false,
  },
  exportConfigRef: {
    type: Object,
    default: null,
  },
});

// Default varaiable
const columnTitle = ref([]);
const dataTable = ref([]);
const dataTitle = ref([]);
const dataLength = ref(0);

// Advanced Option Variable
const currentSort = ref(0);
const currentSortDir = ref("asc");
const currentPage = ref(1);
const pageSize = ref(props.pageSize);
const maxPageShown = ref(3);

// Searching Variable
const keyword = ref("");

// Filtering Variable
const filter = ref([]);
const openFilter = ref(false);

const hideTable = ref(false);

// Other Variable
const sortColumnFirstTime = ref(false);
const savedSortColumnName = ref("");
const columnContextMenu = ref({ show: false, x: 0, y: 0, column: "" });

const isDesktop = computed(() => {
  return windowWidth.value >= mobileWidth ? true : false;
});

if (props.optionsAdvanced.responsive) {
  if (isDesktop.value) {
    hideTable.value = false;
  } else {
    hideTable.value = true;
  }
}

// Freeze column helpers — measure actual th widths after render
const headerCells = ref([]); // template ref array for <th> elements
const colWidths = ref([]); // measured widths

const measureColumnWidths = () => {
  if (!headerCells.value || headerCells.value.length === 0) return;
  colWidths.value = headerCells.value.map((th) => th ? th.offsetWidth : 0);
};

// Compute cumulative left offsets from measured widths
const leftOffsets = computed(() => {
  const offsets = [0];
  for (let i = 1; i < colWidths.value.length; i++) {
    offsets[i] = offsets[i - 1] + colWidths.value[i - 1];
  }
  return offsets;
});

// Compute cumulative right offsets from measured widths
const rightOffsets = computed(() => {
  const total = colWidths.value.length;
  const offsets = new Array(total).fill(0);
  for (let i = total - 2; i >= 0; i--) {
    offsets[i] = offsets[i + 1] + colWidths.value[i + 1];
  }
  return offsets;
});

const hasFreezeColumns = computed(() => props.freezeLeft > 0 || props.freezeRight > 0);

// Returns inline style for frozen header (th) cells
const getFreezeHeaderStyle = (colIndex, totalCols) => {
  if (!hasFreezeColumns.value) return {};
  const style = {};
  if (props.freezeLeft > 0 && colIndex < props.freezeLeft) {
    style.position = "sticky";
    style.left = `${leftOffsets.value[colIndex] || 0}px`;
    style.zIndex = 12;
    style.backgroundColor = "rgb(var(--bg-2))";
    if (colIndex === props.freezeLeft - 1) {
      style.boxShadow = "4px 0 6px -2px rgba(0,0,0,0.15)";
      style.clipPath = "inset(0 -6px 0 0)";
    }
  }
  if (props.freezeRight > 0 && colIndex >= totalCols - props.freezeRight) {
    style.position = "sticky";
    style.right = `${rightOffsets.value[colIndex] || 0}px`;
    style.zIndex = 12;
    style.backgroundColor = "rgb(var(--bg-2))";
    if (colIndex === totalCols - props.freezeRight) {
      style.boxShadow = "-4px 0 6px -2px rgba(0,0,0,0.15)";
      style.clipPath = "inset(0 0 0 -6px)";
    }
  }
  return style;
};

// Returns inline style for frozen body (td) cells
const getFreezeStyle = (colIndex, totalCols) => {
  if (!hasFreezeColumns.value) return {};
  const style = {};
  if (props.freezeLeft > 0 && colIndex < props.freezeLeft) {
    style.position = "sticky";
    style.left = `${leftOffsets.value[colIndex] || 0}px`;
    style.zIndex = 2;
    style.backgroundColor = "rgb(var(--bg-2))";
    if (colIndex === props.freezeLeft - 1) {
      style.boxShadow = "4px 0 6px -2px rgba(0,0,0,0.15)";
      style.clipPath = "inset(0 -6px 0 0)";
    }
  }
  if (props.freezeRight > 0 && colIndex >= totalCols - props.freezeRight) {
    style.position = "sticky";
    style.right = `${rightOffsets.value[colIndex] || 0}px`;
    style.zIndex = 2;
    style.backgroundColor = "rgb(var(--bg-2))";
    if (colIndex === totalCols - props.freezeRight) {
      style.boxShadow = "-4px 0 6px -2px rgba(0,0,0,0.15)";
      style.clipPath = "inset(0 0 0 -6px)";
    }
  }
  return style;
};

const camelCasetoTitle = (str, exclusions = []) => {
  if (exclusions.includes(str)) {
    return str.replace(/([A-Z])/g, " $1").trim();
  } else if (/\(.*\)/.test(str)) {
    return str; // if the string contains parentheses, return the original string
  } else {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (str) => {
      return str.toUpperCase();
    });
  }
};

const spacingCharactertoCamelCase = (array) => {
  // Loop array string and convert to camel case

  let result = [];

  array.forEach((element) => {
    if (element.charAt(0) == element.charAt(0).toUpperCase()) {
      // Camelcase the string and remove spacing
      // and if there is () in the string, do Uppercase inside the () and dont spacing it

      let camelCase = element
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => {
          return str.toUpperCase();
        })
        .replace(/\s/g, "");

      let resultCamelCase = camelCase.replace(/\(([^)]+)\)/, (str) => {
        return str.toUpperCase();
      });

      result.push(resultCamelCase);
    } else {
      result.push(element);
    }
  });

  // console.log(result);
  return result;
};

// watch props.data change and redo all the data
watch(
  () => [props.data, props.field],
  () => {
    if (props.data && props.data.length > 0) {
      dataTable.value = props.data;
      dataLength.value = props.data.length;
      const newOrder = props.field && props.field.length > 0
        ? spacingCharactertoCamelCase(props.field)
        : Object.keys(dataTable.value[0]);
      dataTitle.value = newOrder;
      // When columnMovable, columnHideShow, or columnGroupingList: preserve user's column order/visibility on search/filter (don't reset)
      if ((!props.columnMovable && !props.columnHideShow && !props.columnGroupingList) || columnTitle.value.length === 0) {
        columnTitle.value = newOrder;
      }
    } else {
      dataTable.value = [];
      dataLength.value = 0;
      // When columnMovable, columnHideShow, or columnGroupingList: preserve column order/visibility even when data is empty
      if (!props.columnMovable && !props.columnHideShow && !props.columnGroupingList) {
        columnTitle.value = [];
        dataTitle.value = [];
      }
    }
  },
  { immediate: true }
);

// watch props.pageSize change and update internal pageSize
watch(
  () => props.pageSize,
  (newValue) => {
    if (newValue !== undefined && newValue !== null) {
      pageSize.value = newValue;
      currentPage.value = 1; // Reset to first page when page size changes
    }
  },
  { immediate: true }
);

const setColumnTitle = (data) => {
  try {
    if (props.field && props.field.length == 0) {
      columnTitle.value = Object.keys(data);
    } else {
      columnTitle.value = spacingCharactertoCamelCase(props.field);
    }
  } catch (error) {
    console.log(error);
  }
};

const filteredDatabyTitle = (data, title) => {
  let result = "";
  try {
    if (props.field && props.field.length == 0) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === title) {
          result = value;
          return;
        }
      });
    } else {
      const index = columnTitle.value.indexOf(title);
      // Prefer camelCase match - when columns are hidden, index no longer aligns with props.field
      let fieldName = props.field?.find((f) => spacingCharactertoCamelCase([f])[0] === title);
      if (!fieldName && index >= 0 && props.field && props.field[index] !== undefined) {
        fieldName = props.field[index];
      }
      if (fieldName !== undefined && fieldName !== null) {
        result = data[fieldName];
      } else {
        const arr = Object.values(data);
        result = arr[index];
      }
    }
    if (result === "" || result === null) result = "-";
    return result;
  } catch (error) {
    console.log(error);
    return "-";
  }
};


// Re-measure column widths when data or columns change
watch(
  () => [props.data, props.field, columnTitle.value],
  () => {
    if (hasFreezeColumns.value) {
      nextTick(() => measureColumnWidths());
    }
  },
);

// Computed data
const computedData = computed(() => {
  let result = [];
  let totalData = 0;
  result = dataTable.value
    .slice()
    .sort((a, b) => {
      let modifier = 1;

      columnTitle.value.forEach((title, index) => {
        // console.log(title, props.sort.column);
        // First sort by column title
        if (title === props.sort.column && !sortColumnFirstTime.value) {
          currentSort.value = index;
          currentSortDir.value = props.sort.direction;
          sortColumnFirstTime.value = true;
        }
      });

      // Check if column title is number or string and convert spacing to camelcase
      let a1 = filteredDatabyTitle(a, columnTitle.value[currentSort.value]);
      let b1 = filteredDatabyTitle(b, columnTitle.value[currentSort.value]);

      if (typeof a1 === "string") a1 = a1.toLowerCase();
      if (typeof b1 === "string") b1 = b1.toLowerCase();

      // Convert string to number if possible
      if (isNumeric(a1)) a1 = parseFloat(a1);
      if (isNumeric(b1)) b1 = parseFloat(b1);

      if (currentSortDir.value === "desc") modifier = -1;
      if (a1 < b1) return -1 * modifier;
      if (a1 > b1) return 1 * modifier;
      return 0;
    })
    .filter((row) => {
      // Search all json object if keyword not equal null
      if (keyword.value === "") return true;
      let result = false;
      Object.entries(row).forEach(([key, value]) => {
        try {
          if (
            value.toString().toLowerCase().includes(keyword.value.toLowerCase())
          ) {
            result = true;
            currentPage.value = 1;
          }
        } catch (error) {
          result = false;
        }
      });
      return result;
    })
    .filter((_, index) => {
      let start = (currentPage.value - 1) * pageSize.value;
      let end = currentPage.value * pageSize.value;
      totalData++;
      if (index >= start && index < end) return true;
    });
  dataLength.value = totalData;
  return result;
});

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const totalEntries = computed(() => {
  return dataLength.value;
});

const sort = (index) => {
  // Skip sorting for "No" and "Action" columns
  const columnName = columnTitle.value[index];
  if (columnName === "No" || columnName === "Action") {
    return;
  }
  
  if (index === currentSort.value) {
    currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
  } else if (index !== currentSort.value && currentSortDir.value == "desc") {
    currentSortDir.value = "asc";
  }
  currentSort.value = index;
};

const pages = computed(() => {
  let totalPG = Math.ceil(dataLength.value / pageSize.value);
  const numShown = Math.min(maxPageShown.value, totalPG);
  let first = currentPage.value - Math.floor(numShown / 2);
  first = Math.max(first, 1);
  first = Math.min(first, totalPG - numShown + 1);
  return [...Array(numShown)].map((k, i) => i + first);
});

const totalPage = computed(() => {
  return Math.ceil(dataLength.value / pageSize.value);
});

const pageChange = (page) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value * pageSize.value < dataLength.value)
    currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const firstPage = () => {
  currentPage.value = 1;
};

const lastPage = () => {
  currentPage.value = totalPage.value;
};

const hideColumn = (key) => {
  if (!getFilter(key)) {
    // insert into filter variable to tell there is a change in filter
    setFilter(key, "hide", true);
  } else {
    // update filter variable to tell there is a change in filter
    setFilter(key, "hide", false);
  }
};

const setFilter = (key, action, condition) => {
  // Check if key exist inside filter
  let index = filter.value.findIndex((item) => item.key === key);

  if (index == -1) {
    // If key not exist, insert new filter
    filter.value.push({
      key: key,
      action: {
        [action]: condition,
      },
    });
  } else {
    // If key exist, update filter
    filter.value[index].action[action] = condition;
    // console.log(filter.value);
  }
};

const getFilter = (key) => {
  let result = false;
  filter.value.forEach((item) => {
    if (item.key === key) {
      result = item.action.hide;
    }
  });
  return result;
};

const onColumnReorderStart = () => {
  savedSortColumnName.value = columnTitle.value[currentSort.value] || "";
};
const onColumnReorderEnd = () => {
  if (savedSortColumnName.value) {
    const newIndex = columnTitle.value.indexOf(savedSortColumnName.value);
    if (newIndex !== -1) currentSort.value = newIndex;
    savedSortColumnName.value = "";
  }
  if (hasFreezeColumns.value) {
    nextTick(() => measureColumnWidths());
  }
};

const showColumnContextMenu = (e, columnName) => {
  if (!props.columnHideShow) return;
  if (columnName === "No" || columnName === "Action") return;
  e.preventDefault();
  columnContextMenu.value = { show: true, x: e.clientX, y: e.clientY, column: columnName };
  nextTick(() => document.addEventListener("click", hideColumnContextMenu, { once: true }));
};

const hideColumnContextMenu = () => {
  columnContextMenu.value = { show: false, x: 0, y: 0, column: "" };
};

const onContextMenuHide = () => {
  if (columnContextMenu.value.column) {
    hideColumn(columnContextMenu.value.column);
  }
  hideColumnContextMenu();
};

onMounted(() => {
  if (dataTable.value.length > 0) {
    setColumnTitle(dataTable.value[0]);
  }
  if (hasFreezeColumns.value) {
    nextTick(() => measureColumnWidths());
  }
  if (props.exportConfigRef && typeof props.exportConfigRef === 'object' && 'value' in props.exportConfigRef) {
    props.exportConfigRef.value = getExportConfig;
  }
});

onUnmounted(() => {
  if (props.exportConfigRef && typeof props.exportConfigRef === 'object' && 'value' in props.exportConfigRef) {
    props.exportConfigRef.value = null;
  }
});

// Watch filter.value
watch(
  () => filter.value,
  () => {
    // console.log(filter.value);
    // Loop json object filter.value
    filter.value.forEach((item) => {
      // Hide Column
      if (item.action.hide) {
        // Get index title from columnTitle
        let index = columnTitle.value.indexOf(item.key);

        if (index !== -1) {
          // Remove column from columnTitle
          columnTitle.value.splice(index, 1);
        }
      } else if (!item.action.hide) {
        // Get index title from dataTitle
        let indexData = dataTitle.value.indexOf(item.key);

        if (!columnTitle.value.includes(item.key)) {
          // Add Column back to its original position
          columnTitle.value.splice(indexData, 0, item.key);

          // Sort the columnTitle like dataTitle
          columnTitle.value.sort((a, b) => {
            let indexA = dataTitle.value.indexOf(a);
            let indexB = dataTitle.value.indexOf(b);
            return indexA - indexB;
          });
        }
      }
    });
  },
  { deep: true }
);

const filterComputed = computed(() => {
  let result = [];
  let i = 0;
  filter.value.forEach((item) => {
    if (item.action.hide) {
      result.push({
        title: item.key,
        hide: item.action.hide,
      });
    }
    i++;
  });
  // console.log(result);
  return result;
});

// Grouped cell info for columnGroupingList: { rowIndex: { colIndex: { rowspan, value } } }
// When rowspan > 0: render cell with rowspan. When rowspan === 0: skip (spanned by above cell)
// Data is sorted by groupable columns (left to right) so consecutive rows can be merged
const groupedCellInfo = computed(() => {
  if (!props.columnGroupingList) return null;
  const columns = columnTitle.value;
  const groupableIndices = columns
    .map((name, i) => ({ name, i }))
    .filter(({ name }) => (name || "").toLowerCase() !== "no" && (name || "").toLowerCase() !== "action")
    .map(({ i }) => i);

  // Sort data by groupable columns (left to right) for proper grouping
  const data = [...computedData.value].sort((a, b) => {
    for (const colIdx of groupableIndices) {
      const aVal = String(filteredDatabyTitle(a, columns[colIdx]));
      const bVal = String(filteredDatabyTitle(b, columns[colIdx]));
      if (aVal !== bVal) return aVal.localeCompare(bVal);
    }
    return 0;
  });

  const info = {};
  for (let ri = 0; ri < data.length; ri++) info[ri] = {};

  for (let c = 0; c < groupableIndices.length; c++) {
    const colIdx = groupableIndices[c];
    const prevGroupableIndices = groupableIndices.slice(0, c);
    let row = 0;
    while (row < data.length) {
      const rowData = data[row];
      const value = filteredDatabyTitle(rowData, columns[colIdx]);
      let span = 1;
      while (row + span < data.length) {
        const nextRowData = data[row + span];
        const nextValue = filteredDatabyTitle(nextRowData, columns[colIdx]);
        if (String(nextValue) !== String(value)) break;
        let sameParent = true;
        for (const prevIdx of prevGroupableIndices) {
          const prevVal = filteredDatabyTitle(rowData, columns[prevIdx]);
          const nextPrevVal = filteredDatabyTitle(nextRowData, columns[prevIdx]);
          if (String(prevVal) !== String(nextPrevVal)) {
            sameParent = false;
            break;
          }
        }
        if (!sameParent) break;
        span++;
      }
      info[row][colIdx] = { rowspan: span, value };
      for (let i = 1; i < span; i++) info[row + i][colIdx] = { rowspan: 0 };
      row += span;
    }
  }
  return { info, sortedData: data };
});

const displayData = computed(() => {
  if (props.columnGroupingList && groupedCellInfo.value) {
    return groupedCellInfo.value.sortedData;
  }
  return computedData.value;
});

// Full data for export (no pagination): respects keyword filter, sort, and grouping order
const exportData = computed(() => {
  let data = dataTable.value
    .slice()
    .filter((row) => {
      if (keyword.value === "") return true;
      return Object.entries(row).some(([key, value]) => {
        try {
          return value != null && value.toString().toLowerCase().includes(keyword.value.toLowerCase());
        } catch {
          return false;
        }
      });
    });
  if (props.columnGroupingList) {
    const columns = columnTitle.value;
    const groupableIndices = columns
      .map((name, i) => ({ name, i }))
      .filter(({ name }) => (name || "").toLowerCase() !== "no" && (name || "").toLowerCase() !== "action")
      .map(({ i }) => i);
    data = data.sort((a, b) => {
      for (const colIdx of groupableIndices) {
        const aVal = String(filteredDatabyTitle(a, columns[colIdx]));
        const bVal = String(filteredDatabyTitle(b, columns[colIdx]));
        if (aVal !== bVal) return aVal.localeCompare(bVal);
      }
      return 0;
    });
  } else {
    data = data.sort((a, b) => {
      let modifier = currentSortDir.value === "desc" ? -1 : 1;
      const a1 = filteredDatabyTitle(a, columnTitle.value[currentSort.value]);
      const b1 = filteredDatabyTitle(b, columnTitle.value[currentSort.value]);
      let va = typeof a1 === "string" ? a1.toLowerCase() : a1;
      let vb = typeof b1 === "string" ? b1.toLowerCase() : b1;
      if (isNumeric(va)) va = parseFloat(va);
      if (isNumeric(vb)) vb = parseFloat(vb);
      if (va < vb) return -1 * modifier;
      if (va > vb) return 1 * modifier;
      return 0;
    });
  }
  return data;
});

// Compute grouped cell info for export data (full data, no pagination) - for PDF/Excel merged cells
const computeExportGroupedInfo = (data, columns, groupableIndices) => {
  const info = {};
  for (let ri = 0; ri < data.length; ri++) info[ri] = {};
  for (const c of groupableIndices) {
    const prevGroupableIndices = groupableIndices.filter((i) => i < c);
    let row = 0;
    while (row < data.length) {
      const rowData = data[row];
      const value = filteredDatabyTitle(rowData, columns[c]);
      let span = 1;
      while (row + span < data.length) {
        const nextRowData = data[row + span];
        const nextValue = filteredDatabyTitle(nextRowData, columns[c]);
        if (String(nextValue) !== String(value)) break;
        let sameParent = true;
        for (const prevIdx of prevGroupableIndices) {
          const prevVal = filteredDatabyTitle(rowData, columns[prevIdx]);
          const nextPrevVal = filteredDatabyTitle(nextRowData, columns[prevIdx]);
          if (String(prevVal) !== String(nextPrevVal)) {
            sameParent = false;
            break;
          }
        }
        if (!sameParent) break;
        span++;
      }
      info[row] = info[row] || {};
      info[row][c] = { rowspan: span, value };
      for (let i = 1; i < span; i++) {
        info[row + i] = info[row + i] || {};
        info[row + i][c] = { rowspan: 0 };
      }
      row += span;
    }
  }
  return info;
};

// Get export config: visible columns in display order, field names for data lookup, and export data
const getExportConfig = () => {
  const visibleTitles = columnTitle.value.filter(
    (name) => (name || "").toLowerCase() !== "no" && (name || "").toLowerCase() !== "action"
  );
  // Map by column title (camelCase) to field name, not by index - index is wrong when columns are reordered
  const fieldNames = visibleTitles.map((title) => {
    const found = props.field?.find((f) => spacingCharactertoCamelCase([f])[0] === title);
    return found ?? title;
  });
  const data = exportData.value;
  let groupedInfo = null;
  if (props.columnGroupingList && data.length > 0) {
    const columns = columnTitle.value;
    const groupableIndices = columns
      .map((name, i) => ({ name, i }))
      .filter(({ name }) => (name || "").toLowerCase() !== "no" && (name || "").toLowerCase() !== "action")
      .map(({ i }) => i);
    groupedInfo = computeExportGroupedInfo(data, columns, groupableIndices);
  }
  // Map export column index -> columnTitle index (for groupedInfo lookup)
  const columnTitleIndices = visibleTitles.map((t) => columnTitle.value.indexOf(t));
  return {
    columns: fieldNames,
    data,
    groupedInfo,
    columnGroupingList: props.columnGroupingList,
    columnTitleIndices,
  };
};

// Template state for Save/Load Template
const getTemplateState = () => {
  const hiddenColumns = filter.value.filter((item) => item.action?.hide).map((item) => item.key);
  const sortColumn = columnTitle.value[currentSort.value];
  return {
    columnOrder: [...columnTitle.value],
    hiddenColumns,
    sortColumn: sortColumn || null,
    sortDirection: currentSortDir.value || "asc",
  };
};

const applyTemplateState = (state) => {
  if (!state || !Array.isArray(state.columnOrder)) return;
  const validColumns = new Set(dataTitle.value);
  const hiddenColumns = (state.hiddenColumns || []).filter((col) => validColumns.has(col));
  const visibleOrder = state.columnOrder.filter((col) => validColumns.has(col) && !hiddenColumns.includes(col));
  filter.value = hiddenColumns.map((key) => ({ key, action: { hide: true } }));
  nextTick(() => {
    columnTitle.value = visibleOrder.length > 0 ? visibleOrder : [...dataTitle.value];
    if (state.sortColumn && columnTitle.value.includes(state.sortColumn)) {
      currentSort.value = columnTitle.value.indexOf(state.sortColumn);
      currentSortDir.value = state.sortDirection === "desc" ? "desc" : "asc";
    }
  });
};

// Expose sort state and data for parent components to access
defineExpose({
  currentSort,
  currentSortDir,
  columnTitle,
  computedData,
  dataTable,
  getExportConfig,
  getTemplateState,
  applyTemplateState,
});

// watch pinia getter windowWidth
watch(
  () => windowWidth.value,
  () => {
    if (props.optionsAdvanced.responsive) {
      if (windowWidth.value <= mobileWidth) {
        hideTable.value = true;
      } else {
        hideTable.value = false;
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <div
    v-if="dataTable && dataTable.length > 0"
    class="table-wrapper"
    :class="{
      '!border': advanced && !hideTable && optionsAdvanced.outsideBorder,
    }"
  >
    <div
      class="table-header"
      :class="{
        open: openFilter,
        '!max-h-full': !optionsAdvanced.filterable && !columnHideShow,
      }"
      v-if="advanced"
    >
      <div
        class="table-header-filter"
        :class="{
          '!items-center !gap-3': !optionsAdvanced.filterable && !columnHideShow,
        }"
      >
        <div v-if="!hideTableSearch">
          <div class="flex gap-x-2">
            <FormKit
              v-model="keyword"
              type="search"
              placeholder="Search..."
              outer-class="mb-0"
            />
            <rs-button
              v-if="optionsAdvanced.filterable || columnHideShow"
              class="!px-3 sm:!px-6"
              @click="openFilter ? (openFilter = false) : (openFilter = true)"
            >
              <Icon
                name="ic:outline-filter-alt"
                class="mr-0 md:mr-1"
                size="1rem"
              />
              <span class="hidden sm:block">{{ columnHideShow && !optionsAdvanced.filterable ? 'Columns' : 'Filter' }}</span>
            </rs-button>
          </div>
        </div>
        <div v-if="!hideTablePageSize" class="flex justify-center items-center gap-x-2">
          <span class="text-[rgb(var(--text-color))]">Result per page:</span>
          <FormKit
            type="select"
            v-model="pageSize"
            :options="[5, 10, 25, 100]"
            outer-class="mb-0"
          />
        </div>
      </div>
      <div
        class="flex flex-wrap items-center justify-start gap-x-3"
        v-if="optionsAdvanced.filterable || (columnHideShow && openFilter)"
      >
        <rs-dropdown
          :title="camelCasetoTitle(val)"
          size="sm"
          class="mt-3"
          v-for="(val, index) in (columnHideShow ? dataTitle.filter((v) => v !== 'No' && v !== 'Action') : dataTitle)"
          :key="val"
        >
          <rs-dropdown-item @click="hideColumn(val)">
            {{ getFilter(val) ? "Show Column" : "Hide Column" }}
            <Icon
              :name="getFilter(val) ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
              size="1rem"
              class="ml-auto"
            ></Icon>
          </rs-dropdown-item>
        </rs-dropdown>
      </div>
    </div>
    <div
      v-if="filterComputed.length > 0"
      class="table-header-filter-list w-full m-4"
    >
      <div class="flex flex-wrap items-center justify-start gap-x-2">
        <div
          class="flex items-center justify-center gap-x-2 border border-primary text-primary rounded-lg py-1 px-2"
          v-for="(val, index) in filterComputed"
          :key="index"
        >
          {{ val ? camelCasetoTitle(val.title) : "" }}
          <Icon
            name="ic:round-close"
            class="mr-0 md:mr-1 hover:text-red-500 cursor-pointer"
            size="1rem"
            @click="hideColumn(val.title)"
          ></Icon>
        </div>
      </div>
    </div>
    <div 
      class="w-full overflow-x-auto"
      :class="{ 'overflow-y-auto': maxHeight }"
      :style="maxHeight ? { maxHeight: maxHeight } : {}"
    >
      <client-only>
        <table
          v-if="!hideTable"
          class="table-content"
          :class="{
            '!border-y !border-0 border-[rgb(var(--bg-1))]': advanced,
            'table-fixed': options.fixed,
            'table-auto': !options.fixed,
          }"
        >
          <thead
            class="text-left border-[rgb(var(--border-color))]"
            :class="{
              'border-y': !options.borderless,
              'border-[rgb(var(--border-color))] bg-[rgb(var(--bg-2))]':
                options.variant === 'default',
              'border-primary/50 bg-primary text-white':
                options.variant === 'primary',
              'border-secondary/50 bg-secondary text-white':
                options.variant === 'secondary',
              'border-info/50 bg-info text-white ': options.variant === 'info',
              'border-success/50 bg-success text-white':
                options.variant === 'success',
              'border-warning/50 bg-warning text-white':
                options.variant === 'warning',
              'border-danger/50 bg-danger text-white':
                options.variant === 'danger',
              'sticky top-0 z-10': maxHeight,
            }"
          >
            <draggable
              v-if="columnMovable"
              v-model="columnTitle"
              tag="tr"
              :item-key="(el) => el"
              :move="(evt) => evt.draggedContext.element !== 'Action' && evt.draggedContext.element !== 'No'"
              ghost-class="opacity-50"
              chosen-class="bg-primary/20"
              drag-class="cursor-grabbing"
              class=""
              @start="onColumnReorderStart"
              @end="onColumnReorderEnd"
            >
              <template #item="{ element, index }">
                <th
                  :ref="(el) => { if (el) headerCells[index] = el; }"
                  class="relative py-3 pl-5 pr-8 whitespace-nowrap"
                  :class="{
                    'border-r last:border-l last:border-r-0':
                      options.bordered && !options.borderless,
                    'border-[rgb(var(--border-color))]':
                      options.variant === 'default',
                    'border-primary/80 text-white': options.variant === 'primary',
                    'border-secondary/80 text-white': options.variant === 'secondary',
                    'border-info/80 text-white': options.variant === 'info',
                    'border-success/80 text-white': options.variant === 'success',
                    'border-warning/80 text-white': options.variant === 'warning',
                    'border-danger/80 text-white': options.variant === 'danger',
                    'w-36': options.fixed,
                    'cursor-grab': columnMovable && element !== 'No' && element !== 'Action',
                    'cursor-pointer': !columnMovable && optionsAdvanced.sortable && advanced && element !== 'No' && element !== 'Action',
                    'cursor-default': element === 'No' || element === 'Action',
                  }"
                  :style="{ 'min-width': '100px', ...getFreezeHeaderStyle(index, columnTitle.length) }"
                  :title="columnMovable && element !== 'No' && element !== 'Action' ? 'Drag to reorder column' : (columnHideShow && element !== 'No' && element !== 'Action' ? 'Right-click to hide column' : '')"
                  @click="
                    optionsAdvanced.sortable && advanced && element !== 'No' && element !== 'Action' ? sort(index) : null
                  "
                  @contextmenu="showColumnContextMenu($event, element)"
                >
                  {{ camelCasetoTitle(element) }}
                  <div
                    v-if="optionsAdvanced.sortable && advanced && element !== 'No' && element !== 'Action'"
                    class="sortable"
                  >
                    <Icon
                      class="absolute top-3 right-2 opacity-20"
                      size="1.25rem"
                      name="carbon:chevron-sort"
                    />
                    <Icon
                      v-if="currentSort == index && currentSortDir == 'asc'"
                      class="absolute top-3 right-2 opacity-50"
                      size="1.25rem"
                      name="carbon:chevron-sort-up"
                    />
                    <Icon
                      v-else-if="currentSort == index && currentSortDir == 'desc'"
                      class="absolute top-3 right-2 opacity-50"
                      size="1.25rem"
                      name="carbon:chevron-sort-down"
                    />
                  </div>
                </th>
              </template>
            </draggable>
            <tr v-else>
              <th
                :ref="(el) => { if (el) headerCells[index] = el; }"
                class="relative py-3 pl-5 pr-8 whitespace-nowrap"
                :class="{
                  'border-r last:border-l last:border-r-0':
                    options.bordered && !options.borderless,
                    'border-[rgb(var(--border-color))]':
                      options.variant === 'default',
                    'border-primary/80 text-white': options.variant === 'primary',
                    'border-secondary/80 text-white': options.variant === 'secondary',
                    'border-info/80 text-white': options.variant === 'info',
                    'border-success/80 text-white': options.variant === 'success',
                    'border-warning/80 text-white': options.variant === 'warning',
                    'border-danger/80 text-white': options.variant === 'danger',
                    'w-36': options.fixed,
                    'cursor-pointer': optionsAdvanced.sortable && advanced && val !== 'No' && val !== 'Action',
                    'cursor-default': optionsAdvanced.sortable && advanced && (val === 'No' || val === 'Action'),
                }"
                :style="{ 'min-width': '100px', ...getFreezeHeaderStyle(index, columnTitle.length) }"
                @click="
                  optionsAdvanced.sortable && advanced && val !== 'No' && val !== 'Action' ? sort(index) : null
                "
                @contextmenu="showColumnContextMenu($event, val)"
                v-for="(val, index) in columnTitle"
                :key="index"
              >
                {{ camelCasetoTitle(val) }}
                <div
                  v-if="optionsAdvanced.sortable && advanced && val !== 'No' && val !== 'Action'"
                  class="sortable"
                >
                  <Icon
                    class="absolute top-3 right-2 opacity-20"
                    size="1.25rem"
                    name="carbon:chevron-sort"
                  />
                  <Icon
                    v-if="currentSort == index && currentSortDir == 'asc'"
                    class="absolute top-3 right-2 opacity-50"
                    size="1.25rem"
                    name="carbon:chevron-sort-up"
                  />
                  <Icon
                    v-else-if="currentSort == index && currentSortDir == 'desc'"
                    class="absolute top-3 right-2 opacity-50"
                    size="1.25rem"
                    name="carbon:chevron-sort-down"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              :class="{
                'border-y border-[rgb(var(--border-color))]':
                  !options.bordered && !options.borderless,
                'border-b': options.bordered && !options.borderless,
                'border-b-0': options.borderless,
                'border-[rgb(var(--border-color))] odd:bg-[rgb(var(--bg-1))] even:bg-[rgb(var(--bg-2))]':
                  options.variant === 'default' && options.striped,
                'border-primary/20 odd:bg-white even:bg-primary/5':
                  options.variant === 'primary' && options.striped,
                'border-secondary/20 odd:bg-white even:bg-secondary/5':
                  options.variant === 'secondary' && options.striped,
                'border-info/20 odd:bg-white even:bg-info/5':
                  options.variant === 'info' && options.striped,
                'border-success/20 odd:bg-white even:bg-success/5':
                  options.variant === 'success' && options.striped,
                'border-warning/20 odd:bg-white even:bg-warning/5':
                  options.variant === 'warning' && options.striped,
                'border-danger/20 odd:bg-white even:bg-danger/5':
                  options.variant === 'danger' && options.striped,
                'cursor-pointer hover:bg-slate-300':
                  options.hover && options.variant === 'default',
                'cursor-pointer hover:bg-primary/5':
                  options.hover && options.variant === 'primary',
                'cursor-pointer hover:bg-secondary/5':
                  options.hover && options.variant === 'secondary',
                'cursor-pointer hover:bg-info/5':
                  options.hover && options.variant === 'info',
                'cursor-pointer hover:bg-success/5':
                  options.hover && options.variant === 'success',
                'cursor-pointer hover:bg-warning/5':
                  options.hover && options.variant === 'warning',
                'cursor-pointer hover:bg-danger/5':
                  options.hover && options.variant === 'danger',
              }"
              v-for="(val1, index1) in displayData"
              :key="index1"
            >
              <template v-for="(val2, index2) in columnTitle" :key="index2">
                <td
                  v-if="!columnGroupingList || ['no','action'].includes((val2 || '').toLowerCase()) || (groupedCellInfo && groupedCellInfo.info && groupedCellInfo.info[index1] && groupedCellInfo.info[index1][index2] && groupedCellInfo.info[index1][index2].rowspan > 0)"
                  class="p-4 pl-5 break-words"
                  :class="{
                    'border-r last:border-l last:border-r-0':
                      options.bordered && !options.borderless,
                    'border-[rgb(var(--border-color))]':
                      options.variant === 'default',
                    'border-primary/20': options.variant === 'primary',
                    'border-secondary/20': options.variant === 'secondary',
                    'border-info/20': options.variant === 'info',
                    'border-success/20': options.variant === 'success',
                    'border-warning/20': options.variant === 'warning',
                    'border-danger/20': options.variant === 'danger',
                  }"
                  :style="{
                    ...getFreezeStyle(index2, columnTitle.length),
                    ...(columnGroupingList && !['no','action'].includes((val2 || '').toLowerCase()) && groupedCellInfo?.info?.[index1]?.[index2]?.rowspan > 1 ? { verticalAlign: 'top' } : {}),
                  }"
                  :rowspan="columnGroupingList && !['no','action'].includes((val2 || '').toLowerCase()) && groupedCellInfo?.info?.[index1]?.[index2]?.rowspan || undefined"
                >
                  <slot
                    :name="val2"
                    :text="columnGroupingList && !['no','action'].includes((val2 || '').toLowerCase()) && groupedCellInfo?.info?.[index1]?.[index2] ? groupedCellInfo.info[index1][index2].value : filteredDatabyTitle(val1, val2)"
                    :value="val1"
                  >
                    {{ columnGroupingList && !['no','action'].includes((val2 || '').toLowerCase()) && groupedCellInfo?.info?.[index1]?.[index2] ? groupedCellInfo.info[index1][index2].value : filteredDatabyTitle(val1, val2) }}
                  </slot>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <rs-collapse v-if="computedData.length > 0" accordion>
            <rs-collapse-item v-for="(val, index) in computedData" :key="index">
              <template #title>
                <div class="grid grid-cols-2">
                  <div class="flex flex-col col-span-1">
                    <span class="font-semibold leading-tight">
                      {{ Object.values(val)[0] }}
                    </span>
                    <span class="text-sm"> {{ Object.values(val)[1] }} </span>
                  </div>
                  <div class="flex justify-end items-center col-span-1">
                    <div class="mr-4">
                      {{ Object.values(val)[computedData.length] }}
                    </div>
                  </div>
                </div>
              </template>
              <template #default>
                <div
                  class="flex justify-between items-center even:bg-inherit odd:bg-[rgb(var(--bg-1))] rounded-lg p-3"
                  v-for="(val1, index1) in Object.entries(val).slice(
                    2,
                    Object.entries(val).length
                  )"
                  :key="index1"
                >
                  <span>
                    {{ camelCasetoTitle(val1[0]) }}
                  </span>
                  <span>
                    {{ val1[1] }}
                  </span>
                </div>
              </template>
            </rs-collapse-item>
          </rs-collapse>
        </div>
      </client-only>
    </div>
    <div v-if="advanced && !hideTableFooter" class="table-footer">
      <div class="flex justify-center items-center gap-x-2">
        <span class="text-sm text-[rgb(var(--text-color))] hidden md:block"
          >Showing {{ pageSize * currentPage - pageSize + 1 }} to
          {{ pageSize * currentPage }} of {{ totalEntries }} entries</span
        >
      </div>
      <div class="table-footer-page">
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="firstPage"
          :disabled="currentPage == 1"
        >
          <Icon name="ic:round-keyboard-double-arrow-left" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="prevPage"
          :disabled="currentPage == 1"
        >
          <Icon name="ic:round-keyboard-arrow-left" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            currentPage == val && options.variant != 'default'
              ? options.variant
              : currentPage == val && options.variant == 'default'
              ? 'primary'
              : options.variant == 'default'
              ? 'primary-outline'
              : options.variant + '-outline'
          }`"
          class="!rounded-full !p-1 !w-8 !h-8"
          v-for="(val, index) in pages"
          :key="index"
          @click="pageChange(val)"
        >
          {{ val }}
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="nextPage"
          :disabled="currentPage == totalPage"
        >
          <Icon name="ic:round-keyboard-arrow-right" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="lastPage"
          :disabled="currentPage == totalPage"
        >
          <Icon name="ic:round-keyboard-double-arrow-right" size="1rem"></Icon>
        </rs-button>
      </div>
    </div>
    <!-- Column context menu (Hide) -->
    <Teleport to="body">
      <div
        v-if="columnContextMenu.show"
        class="fixed z-[9999] min-w-[120px] rounded-lg border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-2))] py-1 shadow-lg"
        :style="{ left: columnContextMenu.x + 'px', top: columnContextMenu.y + 'px' }"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-[rgb(var(--bg-1))]"
          @click="onContextMenuHide"
        >
          <Icon name="mdi:eye-off-outline" size="1rem" />
          Hide
        </button>
      </div>
    </Teleport>
  </div>
  <div v-else class="table-wrapper p-4">
    <div
      class="border border-[rgb(var(--border-color))] rounded-lg overflow-hidden"
    >
      <div
        class="bg-[rgb(var(--bg-2))] p-4 border-b border-[rgb(var(--border-color))]"
      >
        <h3 class="text-lg font-semibold text-[rgb(var(--text-color))]"></h3>
      </div>
      <div class="p-8 text-center">
        <Icon name="mdi:table-off" class="text-gray-300 mb-4" size="48px" />
        <p class="text-[rgb(var(--text-color))] text-lg font-medium">
          No Data
        </p>
        <p class="text-gray-500 mt-2">
          There are currently no entries to display.
        </p>
      </div>
    </div>
  </div>
</template>
