# Kitchen Sink UI patterns — migration reference

This document describes three patterns implemented on the Kitchen Sink page (`pages/kitchen-sink/index.vue`) so you can port or refactor them into another project. It covers **data shapes**, **UI structure**, **composables**, **`rs-table` integration**, **npm dependencies**, and **backend hooks** where applicable.

If your new stack uses **PHP Laravel** for business logic and APIs, see **[Laravel backend mapping](#laravel-backend-mapping)** for how each pattern maps to routes, controllers, and typical request/response shapes.

**Canonical source file:** `pages/kitchen-sink/index.vue`  
**Production references (richer behaviour):**

| Pattern | Example production page |
|--------|-------------------------|
| Datatable + Smart Filter | `pages/budget/setup/budget-code/index.vue` |
| Miller columns | `pages/setup/glstructure/account-code/` (Account Code v2) |
| Side panel master-detail | Workbench / Page Creator flows (see Kitchen Sink header note) |

---

## Shared stack (this repo)

These patterns assume:

- **Vue 3** with `<script setup>` and Composition API
- **Nuxt 3** (e.g. `useNuxtApp`, auto-imported `ref` / `computed` / `onMounted`, `Icon` from Nuxt Icon)
- **FormKit** for form fields
- **Project UI:** `rs-card`, `rs-button`, `rs-modal`, `rs-dropdown`, `rs-dropdown-item`, `rs-table`, `LayoutsBreadcrumb`
- **Alerts:** SweetAlert2 via `const { $swal } = useNuxtApp()` (optional for Miller exports; composable PDF/CSV uses it)

If you migrate to a plain Vite Vue app, replace Nuxt-specific calls and register or swap components.

---

## 1. Datatable — Smart Filter Pattern

### Purpose

A **list page** with:

1. **Quick search** (single keyword across row fields)
2. **Smart Filter** — a **modal** with structured criteria (level, codes, status, etc.)
3. **`rs-table`** with **column reorder**, **show/hide**, optional **row grouping**, and **export** (PDF/CSV via composable; Excel is custom in Kitchen Sink)

### State model (Kitchen Sink)

| Ref / computed | Role |
|----------------|------|
| `smartFilterSampleData` | Raw rows (objects with keys matching column names, including spaces e.g. `"Budget Code"`) |
| `smartFilterKeyword` | String; drives **client-side** filtering in `filteredSmartFilterData` |
| `smartFilter` | Object `{ level, code, description, status }` — bound to the modal; **in Kitchen Sink only**, filtering is **not** applied from this object (`applyFilters` is a no-op). In production pages, wire a computed filter that reads `smartFilter` fields. |
| `showSmartFilter` | Boolean; modal open/close |
| `smartFilterPageSize` | Page size for `rs-table` (5, 10, 25, 50) |
| `smartFilterDatatableRef` | Template ref on `rs-table` — required for template save/load and export config |
| `smartFilterExportConfigRef` | Ref passed to `rs-table` as `exportConfigRef`; table assigns `getExportConfig` into `.value` on mount |

### Data row shape (example)

Each row should include stable keys that match `:field` entries (including spaces):

```js
{ no: 1, Level: "1", "Budget Code": "BC001", Description: "...", Status: "ACTIVE" }
```

### Filtering logic (Kitchen Sink)

`filteredSmartFilterData` copies `smartFilterSampleData` and, if `smartFilterKeyword` is non-empty, keeps rows where any of `Level`, `Budget Code`, `Description`, `Status` contains the keyword (case-insensitive).

**Migration note:** Add similar conditions for each key in `smartFilter` when you need the modal to affect the grid.

### Composable: `useDatatableFeatures`

**File:** `composables/useDatatableFeatures.js`

**Kitchen Sink invocation:**

```js
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
```

#### Options reference

| Option | Required | Description |
|--------|----------|-------------|
| `pageName` | Yes | Used in PDF/CSV filenames and template JSON |
| `apiDataPath` | Yes for Generate API | Path segment for export API slug (see below) |
| `defaultExportColumns` | Yes | Fallback column list if `getExportConfig` is unavailable |
| `getFilteredList` | Yes | Returns array of rows to export when not using table’s export config |
| `datatableRef` | Yes | Ref to `rs-table` instance |
| `searchKeyword` | Yes | Ref; saved in template JSON and CSV header |
| `smartFilter` | Optional | Ref; saved in template and included in CSV metadata when non-empty |
| `applyFilters` | Optional | Called after **Load Template** — reload data or recompute filtered list |
| `smartFilterLabels`, `smartFilterOptionsLookup`, `getLookupLabel`, `formatDate`, `formatDateTime`, `columnOptionsLookup`, `columnDateTypeMap` | Optional | Richer CSV metadata and cell formatting (see full composable) |

#### Returned handlers

- **Save Template** — reads `datatableRef.getTemplateState()`, builds JSON with `columnOrder`, `hiddenColumns`, `sortColumn`, `sortDirection`, `isGrouped`, `searchKeyword`, `smartFilter`; download or File System Access API save.
- **Load Template** — triggers hidden file input; parses JSON; calls `datatableRef.applyTemplateState(template)`; restores `searchKeyword`, `smartFilter`, `isGrouped`; calls `applyFilters()`.
- **Group / Ungroup** — toggles `isGrouped` (bound to `rs-table` `:columnGroupingList`).
- **Generate API** — sets internal modal state; actual POST is `handleGenerateApiProceed` (not wired in Kitchen Sink template; production pages add a modal). POST body to `/api/api-gen-template` includes `api_data_path`, `api_base_url` derived from `apiDataPath` → `/api/kerisi-export/{slug}`, and template details.
- **Download PDF** — dynamic `import('jspdf')` + `import('jspdf-autotable')`; uses `getExportConfig()` from table when possible (respects visible columns, order, grouping).
- **Download CSV** — same export source; prepends date/time, page name, optional search and smart-filter lines.

**Nuxt coupling:** uses `useNuxtApp().$swal` and `useFetch('/api/api-gen-template', ...)`. Port with your HTTP client and toast/modal.

### `rs-table` props (Smart Filter block)

Important props used in Kitchen Sink:

| Prop | Value / notes |
|------|----------------|
| `ref` | `smartFilterDatatableRef` |
| `exportConfigRef` | `smartFilterExportConfigRef` |
| `:data` | `filteredSmartFilterData` (computed array) |
| `:field` | `['no', 'Level', 'Budget Code', 'Description', 'Status']` — **must align** with row keys |
| `:options` | `{ variant: 'primary', striped: false, bordered: false, borderless: true }` |
| `:optionsAdvanced` | `{ sortable: true, filterable: false, responsive: false, outsideBorder: false }` |
| `advanced` | Boolean true — enables advanced table mode |
| `:pageSize` | `smartFilterPageSize` |
| `:hideTableSearch` | `true` (toolbar search is outside the table) |
| `:hideTablePageSize` | `true` |
| `:columnMovable` | `true` |
| `:columnHideShow` | `true` |
| `:columnGroupingList` | `smartFilterIsGrouped` |

### Column slots (`rs-table`)

Slot names are **camelCased** from display titles with spaces removed:

- `no`, `Level`, `BudgetCode` → binds `data.value['Budget Code']`, `Description`, `Status`

**Implementation detail:** `components/RsTable.vue` maps titles to original `field` names for export via `spacingCharactertoCamelCase`.

### Toolbar UI pieces

1. Hidden `<input type="file" accept=".json">` with `ref="smartFilterTemplateInputRef"` and `@change="onSmartFilterTemplateChange"`.
2. Header **overflow menu** (`rs-dropdown`): Save Template, Load Template, Ungroup/Group, Generate API.
3. Row: **Display** (page size `FormKit` select), **Search** (`FormKit` text + clear), **Filter** button opening `showSmartFilter`.
4. Footer: record count, PDF / CSV buttons (composable), Excel (Kitchen Sink uses `exceljs` in `handleExportExcel('smart')`).

### Smart Filter modal

- `rs-modal` `v-model="showSmartFilter"` `title="Smart Filter"`.
- Fields bound to `smartFilter.level`, `.code`, `.description`, `.status` (status as select ACTIVE/INACTIVE).
- Footer: **Reset** (`handleSmartFilterReset` clears object), **OK** (`handleSmartFilterOk` closes modal only in demo).

### NPM packages (Smart Filter + exports)

- `jspdf`, `jspdf-autotable` — PDF via composable
- `exceljs` — Excel only in Kitchen Sink’s local `handleExportExcel` (not inside composable)

### Backend (optional)

- **`POST /api/api-gen-template`** — Generate API flow
- **`/api/kerisi-export/...`** — export endpoint slug derived from `apiDataPath`

---

## 2. Miller Columns — Hierarchical Drilldown

### Purpose

**Miller column** UI: multiple vertical panes; selecting an item in column *N* reveals column *N+1* children. Includes per-column search, breadcrumb path, add/view/edit/delete, floating action and download menus, and PDF/CSV/Excel export **per visible column**.

**This is not a separate component** — it is **inline template + script** in `pages/kitchen-sink/index.vue`.

### Data model

#### Column definitions

```js
millerColumns = [
  { key: 'category', title: 'CATEGORY', level: 0 },
  { key: 'subcategory', title: 'SUBCATEGORY', level: 1 },
  { key: 'item', title: 'ITEM', level: 2 },
];
```

#### Tree storage (nested maps + root array)

```js
millerData = {
  category: [ { id, label, desc, status }, ... ],
  subcategory: {
    [parentCategoryId]: [ { id, label, desc, status }, ... ],
  },
  item: {
    [parentSubcategoryId]: [ { id, label, desc, status }, ... ],
  },
};
```

Each **item** uses at minimum: `id` (string), `label`, optional `desc`, optional `status` (`ACTIVE` | `INACTIVE`).

#### Selection state

```js
millerSelected = { category: null | item, subcategory: null | item, item: null | item };
```

Rules on click (`handleMillerItemClick`):

- Selecting **category** clears `subcategory` and `item`.
- Selecting **subcategory** clears `item`.
- Selecting **item** only sets `item`.

#### Visibility

`millerVisibleColumns` computed: always `['category']`; append `'subcategory'` if `category` selected; append `'item'` if `subcategory` selected.

#### Per-column search

`millerSearchKeywords = { category: '', subcategory: '', item: '' }` — filters current column’s list by `label` and `desc` (case-insensitive).

### List resolution (`getMillerList` / `getMillerFilteredList`)

- **category:** `millerData.category`
- **subcategory:** `millerData.subcategory[millerSelected.category.id]` or `[]`
- **item:** `millerData.item[millerSelected.subcategory.id]` or `[]`

`getMillerFilteredList(colKey)` applies the search keyword for that column.

### Breadcrumb

`millerSelectionPath` — array of `{ key, label }` for each non-null selected level; template renders chevrons between chips.

### Column chrome (per column)

- Header: title, **count** badge, **Add** (`handleMillerAdd(colKey)`), **Download menu** toggle (`toggleMillerDownloadMenu`).
- Search row: native `<input v-model="millerSearchKeywords[colKey]">` with icon and clear.
- List: `max-h-[200px] overflow-y-auto`; each row is clickable; **context menu** and **⋮** open the same action menu.

### Floating menus (`Teleport` to `body`)

1. **Action menu** (`millerActionMenu`): `{ show, x, y, colKey, item }` — positioned with `getBoundingClientRect`; **View**, **Edit**, **Delete**.
2. **Download menu** (`millerDownloadMenu`): `{ show, x, y, colKey }` — **PDF**, **CSV**, **Excel**.

**Dismiss:** `window` `click` listeners in `onMounted` / `onUnmounted` call `closeMillerActionMenu` / `closeMillerDownloadMenu`. Menus use `@click.stop` on the panel to avoid immediate close.

### Modal (add / edit / view)

- `rs-modal` bound to `millerModal`; title from `millerModalMode` (`add` | `edit` | `view`).
- Form: `millerForm` — `label`, `desc`, `status` (select); disabled in `view`.
- **Save** (`handleMillerSave`): validates label; **add** generates `id` like `'new_' + Date.now()` and pushes into the correct array/map using current selection context; **edit** mutates `millerForm._item` reference.
- **Delete** (`handleMillerDelete`): SweetAlert confirm; removes from the correct collection and clears selection if the deleted row was selected.

### Export shape (`getMillerExportData`)

Maps current column’s filtered list to:

```js
{ no, Code: item.label, 'Description (Malay)': item.desc, Status: item.status }
```

Used by PDF (jsPDF + autoTable), CSV (manual escaping), Excel (ExcelJS).

### Styling / layout

- Horizontal strip: `flex overflow-x-auto border rounded-lg`
- Each column: fixed width from `millerColumnWidths` map (e.g. 180px), `flex-shrink-0`, borders between columns
- Selected row: `bg-primary text-white`; status dot green/red/gray

### NPM packages (Miller)

- `jspdf`, `jspdf-autotable`
- `exceljs`
- SweetAlert2 (`$swal`) for delete confirmation and toasts

### Migration checklist (Miller)

1. Copy **data structures** (`millerColumns`, `millerData`, `millerSelected`, keywords, menu state, modal state, form).
2. Copy **functions**: `getMillerList`, `getMillerFilteredList`, `handleMillerItemClick`, menus, CRUD, exports, lifecycle listeners.
3. Copy **template** blocks: card body, two `Teleport` menus, `rs-modal`.
4. Replace `FormKit` / `rs-*` / `Icon` with your design system.
5. For **server-backed** trees: replace `getMillerList` with `async` fetch keyed by parent id; keep the same selection/visibility rules.

---

## 3. Side Panel — Multilevel Master-Detail

### Purpose

A **two-pane** layout: **narrow master list** (searchable) + **wide detail** area. The Kitchen Sink demo is **one-level master** (list of items → one detail object). The title “Multilevel” refers to the **pattern** used in Page Creator–style UIs (nested sections in the detail pane); the sample detail is flat fields only.

### State model

| Ref / computed | Role |
|----------------|------|
| `sidePanelItems` | Array of master rows: `{ id, title, menu, status }` |
| `sidePanelSelected` | `null` or the selected item object (same reference as in list) |
| `sidePanelSearch` | Filter string |
| `sidePanelFilteredItems` | Computed: filter `title` and `menu` by keyword |

### Layout (template)

- **Grid:** `grid grid-cols-1 lg:grid-cols-3 gap-4`
- **Master (`col-span-1`):** search row (`FormKit` + clear), bordered card with header “Items”, `max-h-[240px] overflow-y-auto`, list of `<button>` rows keyed by `item.id`.
- **Detail (`col-span-2`):** bordered card; empty state when `!sidePanelSelected`; else read-only blocks for Title, Menu, Status with badge styling.

### Master row interaction

`@click="sidePanelSelected = item"` — highlight when `sidePanelSelected?.id === item.id` (`bg-primary/10`, `border-primary`, `text-primary`).

### Migration — extending to “multilevel” detail

The demo uses a **single** selected entity. For true multilevel master-detail:

1. Keep **master** as now (or a tree on the left).
2. In the **detail** pane, use **nested** `rs-card` sections, tabs, or accordions bound to `sidePanelSelected.children`, related API results, or a second selected id (sub-master).
3. Optionally split detail into **sub-routes** or **wizard steps** while keeping `sidePanelSelected` as the root context.

### Dependencies

- Only **layout + FormKit + Icon + rs-card**; no composable, no export.

---

## Quick dependency matrix

| Feature | Components / APIs | NPM |
|---------|---------------------|-----|
| Smart Filter datatable | `rs-table`, `useDatatableFeatures`, hidden file input, `rs-modal` | `jspdf`, `jspdf-autotable`, `exceljs` (Excel in Kitchen Sink only) |
| Miller columns | `rs-modal`, `FormKit`, `Teleport`, `Icon`, `$swal` | `jspdf`, `jspdf-autotable`, `exceljs` |
| Side panel | `rs-card`, `FormKit`, `Icon` | — |

---

## Laravel backend mapping

The Kerisi app uses **Nuxt server routes** for things like **Generate API** (`/api/api-gen-template`) and **kerisi-export** URLs. In a **Laravel + Vue** (or Inertia) project you replace those with **Laravel routes**, **controllers**, **Eloquent models**, and optionally **API Resources** so the JSON matches what your ported frontend expects.

### Authentication and the SPA

- **Laravel Sanctum** (cookie-based SPA authentication) is the usual fit when the Vue app is on another origin or subdomain: configure `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, and CORS (`config/cors.php`) so `axios`/`fetch` sends cookies and receives `XSRF-TOKEN`.
- **Session + Blade** or **Inertia** is simpler if the UI is served from the same Laravel app (fewer CORS concerns).
- Protect API routes with `auth:sanctum` or `auth:web` depending on your setup.

The frontend patterns below only need **JSON in / JSON out** (or file downloads for server-side export).

---

### 1. Datatable — Smart Filter → Laravel

**Responsibility split**

| Concern | Laravel | Frontend |
|---------|---------|----------|
| Source of truth for rows | Eloquent + queries | Display, sort UI, column templates |
| Keyword search | `WHERE ... LIKE` or **Laravel Scout** | `searchKeyword` query param |
| Smart Filter fields | Apply filters on query builder | Modal fields → query params or POST body |
| Pagination | `paginate()` or cursor | Map `page`, `per_page` to your table page size |
| Export PDF/CSV/Excel | Optional: **barryvdh/laravel-dompdf**, **Laravel Excel (Maatwebsite)**, streamed CSV | Either keep **client-side** export (current composable) or call `GET .../export?format=pdf` |

**Example API design**

```http
GET /api/budget-codes?search=operating&level=1&code=BC&status=ACTIVE&page=1&per_page=10
```

Return a **consistent JSON envelope**, for example:

```json
{
  "data": [
    {
      "no": 1,
      "Level": "1",
      "Budget Code": "BC001",
      "Description": "Operating Expenditure",
      "Status": "ACTIVE"
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 10, "total": 25 }
}
```

Use **`JsonResource`** or **`Resource::collection`** if you prefer snake_case in PHP and map to the **exact keys** your table columns use (including spaced keys like `"Budget Code"` if you do not rename them on the client).

**`useDatatableFeatures` in Laravel projects**

- **Save / Load template** — stays **client-only** (JSON file); no Laravel requirement unless you want to persist templates per user (`templates` table + `POST/GET /api/user/table-templates`).
- **Generate API** — Kerisi-specific. In Laravel you might omit it or reimplement as: issue a **personal access token** or **signed URL** that hits a read-only `GET` route with the same filters encoded in the signature or stored server-side.
- **PDF/CSV from composable** — still works on **current page data**; for **full-database** exports, add Laravel endpoints that run the same filters as the index query and stream a file.

---

### 2. Miller columns → Laravel

**Typical pattern:** **adjacency list** or **nested set** in MySQL/PostgreSQL; expose **children by parent**.

**Option A — dedicated endpoints per level**

```http
GET /api/miller/categories
GET /api/miller/subcategories?category_id={id}
GET /api/miller/items?subcategory_id={id}
```

**Option B — generic tree endpoint**

```http
GET /api/miller/children?parent_type=category&parent_id={id|null}
```

Return arrays of `{ id, label, desc, status }` (or your domain fields).

**Mutations**

```http
POST   /api/miller/categories
PUT    /api/miller/categories/{id}
DELETE /api/miller/categories/{id}
```

Use **nested route prefixes** or a **single polymorphic** controller with `type` + `id` validated against allowed types.

**Client changes:** replace in-memory `millerData` with `async` loaders: on `handleMillerItemClick`, after updating selection, `await fetch` the next column’s children. Keep **per-column search** client-side on the loaded slice, or pass `?search=` to the API for large lists.

**Exports:** can remain **client-side** (current jsPDF/ExcelJS) on the loaded list, or delegate to Laravel for large datasets.

---

### 3. Side panel — master-detail → Laravel

**Light list for the master pane**

```http
GET /api/pages?search=dashboard&fields=id,title,menu,status
```

**Full detail when a row is selected**

```http
GET /api/pages/{id}
```

Return nested relations only on the **show** route to avoid heavy list payloads. The Vue side sets `sidePanelSelected` from the list for instant highlight, then optionally **replaces** it with the `show` response so the detail pane has complete data.

**Multilevel detail:** additional nested resources, e.g. `GET /api/pages/{id}/sections`, or embed `sections` in the `PageResource` when loading detail.

---

### Laravel building blocks (checklist)

| Piece | Use when |
|-------|----------|
| `routes/api.php` + `Route::apiResource` | CRUD JSON APIs |
| `FormRequest` | Validate filter params and body on write |
| `API Resources` | Stable JSON shapes for Vue |
| Eloquent `scopeFilter($query, $request)` | Reuse same filters for **index** and **export** |
| `Storage` + policies | Authorize who can read generated export files |
| Queues | Heavy PDF/Excel generation |

---

### What you do not need from Kerisi

- **`/api/api-gen-template`** — replace with your own design (signed export URLs, API tokens, or nothing).
- **`/api/kerisi-export/...`** — replace with Laravel routes that apply authorization and return filtered data or files.

---

## File index (this repository)

| Path | Contents |
|------|----------|
| `pages/kitchen-sink/index.vue` | All three patterns (source of truth for this doc) |
| `composables/useDatatableFeatures.js` | Template, group/ungroup, PDF/CSV, Generate API helpers |
| `components/RsTable.vue` | `getExportConfig`, `getTemplateState`, `applyTemplateState`, `exportConfigRef` wiring |

---

## Licence / attribution

When copying into another project, preserve any existing licence headers from the original files and verify third-party licences (`jspdf`, `exceljs`, FormKit, etc.) for your target application.
