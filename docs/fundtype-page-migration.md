# Setup / GL Structure Setup — migration reference

This document covers **every menu item** under **Setup → GL Structure Setup** (`navigation/index.js`), the shared UI/backend patterns those pages use, and a **full specification** for **Fund Type**. Use it to migrate screens into another stack (e.g. **Laravel** + SPA).

---

## 0. Menu inventory

Navigation group: **GL Structure Setup** (`path`: `/glstructure`). Child menu routes:

| Menu title | Route | Page file | UI pattern | Primary API base | Save/load template | Group list | Generate API | PDF | CSV | Excel | `kerisi-export` route in repo |
|------------|-------|-----------|------------|------------------|--------------------|------------|--------------|-----|-----|-------|-------------------------------|
| *(parent shell)* | `/glstructure` | `pages/glstructure/index.vue` | Placeholder card | — | No | No | No | No | No | No | — |
| Fund Type | `/setup/glstructure/fundtype` | `pages/setup/glstructure/fundtype/index.vue` | Single `rs-table` + modal CRUD | `/api/setup/glstructure/fund-type` | Yes | Yes | Yes | Yes | Yes | Yes | **Yes** — `server/api/kerisi-export/setup/glstructure/fund-type.get.js` |
| Activity Code | `/setup/glstructure/activity` | `pages/setup/glstructure/activity/index.vue` | 4-column cascade boards | `/api/setup/activity-code` | No | No | No | Per-column menu | Yes | Yes | No |
| PTJ Code | `/setup/glstructure/ptj-code` | `pages/setup/glstructure/ptj-code/index.vue` | 4-column cascade boards | `/api/setup/ptj-code` | No | No | No | Per-column menu | Yes | Yes | No |
| Cost Centre | `/setup/glstructure/cost-centre` | `pages/setup/glstructure/cost-centre/index.vue` | `rs-table` + modal CRUD + `useDatatableFeatures` | `/api/setup/cost-centre` | Yes | Yes | Yes* | Yes | Yes | No** | **No** — add handler for `setup/cost-centre` if you use Generate API |
| Cascade Structure | `/setup/glstructure/cascade-structure` | `pages/setup/glstructure/cascade-structure/index.vue` | `rs-table` + modal CRUD + `useDatatableFeatures` | `/api/setup/cascade-structure` | Yes | Yes | Yes* | Yes | Yes | No** | **No** — add handler for `setup/cascade-structure` if you use Generate API |
| Account Code | `/setup/account-code` | `pages/setup/account-code/index.vue` | 6-level cascade + multiple `rs-table` | `/api/setup/account-code` | No | No | No | Per-level buttons (PDF/CSV on subset of levels) | Yes | Partial*** | No |
| Account Code v2 | `/setup/glstructure/account-code-v2` | `pages/setup/glstructure/account-code-v2/index.vue` | 6-column cascade boards | `/api/setup/account-code` | No | No | No | Per-column menu | Yes | Yes | No |

\* **Generate API** calls `POST /api/api-gen-template` and builds URLs under `/api/kerisi-export/{slug}`. Only **Fund Type** has a matching `kerisi-export` implementation in this repository; Cost Centre and Cascade will return URLs that **404** here until you add parallel export endpoints.

\*\* `useDatatableFeatures` implements **PDF + CSV** only (no Excel). The Generate API modal text still mentions Excel for parity with Fund Type.

\*\*\* Account Code (v1): Excel not used on the same levels as v2 cascade; several levels expose PDF + CSV only.

**Extra route:** `pages/setup/glstructure/fundtype/fundtype/index.vue` → `/setup/glstructure/fundtype/fundtype` (nested duplicate path; not required for menu migration).

---

## 1. Shared building blocks

| Piece | Location | Role |
|-------|----------|------|
| **`RsTable`** | `components/RsTable.vue` | Sorting, client pagination, optional column move/hide/group; `getTemplateState`, `applyTemplateState`, `getExportConfig`. |
| **`useDatatableFeatures`** | `composables/useDatatableFeatures.js` | Save/load JSON template, Group/Ungroup, Generate API, **PDF + CSV** exports (shared by Cost Centre & Cascade Structure). |
| **`useMessageLog`** | `composables/useMessageLog.js` | Audit prompts / success messages (used on all GL Structure pages below). |
| **`POST /api/api-gen-template`** | `server/api/api-gen-template/index.post.js` | Creates `api_gen_template` row + random `api_key`; returns `full_url` with `kerisiApiKey`. |
| **Prisma models** | `prisma/schema.prisma` | `fund_type`, `activity_group`, `activity_subgroup`, `activity_subsiri`, `activity_type`, `organization_unit`, `costcentre`, `org_unit_costcentre`, `account_main`, `lookup_detail` / account hierarchy tables as used by account-code APIs. |

**Auth:** All pages use `definePageMeta({ middleware: ["auth"], requiresAuth: true, breadcrumb: [...] })` (Fund Type’s breadcrumb differs slightly; others use Dashboard → Setup → GL Structure Setup → …).

---

## 2. Fund Type — full specification

**Paths:** `pages/setup/glstructure/fundtype/index.vue`, APIs under `server/api/setup/glstructure/fund-type/`, export `server/api/kerisi-export/setup/glstructure/fund-type.get.js`.

The numbered subsections **1–18** below apply **only** to Fund Type.

### 1. Purpose

**Setup → GL Structure → Fund Type**: maintain `fund_type` rows in a searchable, filterable, reorderable grid with **client-side** paging, **modal CRUD**, **exports** (PDF / CSV / Excel), **Save/Load UI template** (JSON file), **Group List** (merge consecutive equal cells), and **Generate API** (signed URL with stored “template details” for filter/sort/columns).

---

### 2. Authentication and layout

- **Nuxt**: `definePageMeta({ middleware: ["auth"], requiresAuth: true, title: "Fund Type", breadcrumb: [...] })`.
- **Laravel**: protect equivalent routes with your auth middleware; return 401 for API if unauthenticated (this app’s Generate API uses **only** `kerisiApiKey` on the export URL, not session — see Fund Type subsection **13**).

---

### 3. Database entity (`fund_type`)

Relevant columns used by this page and APIs:

| DB column | Role |
|-----------|------|
| `fty_fund_id` | Primary key (Int, **not** auto-increment in app logic — POST generates `max+1` if missing) |
| `fty_fund_type` | Unique business code (`String`, max 20) |
| `fty_fund_desc` | Description |
| `fty_basis` | Type basis |
| `fty_remark` | Remark |
| `fty_status` | Status (UI uses lookup: value `"1"` → label ACTIVE, `"0"` → INACTIVE; raw DB may also store text like `ACTIVE`) |
| `createddate` | Entry date (maps to “Entry Date” in UI) |

Other columns exist on the table but are **not** on this generated form.

---

### 4. Field aliases (API ↔ UI)

The GET handler returns **both** raw Prisma fields and **aliases** for forms and columns.

| Display / form key | DB column |
|--------------------|-----------|
| `id` | `fty_fund_id` |
| `Fund Type`, `Fund_Type`, `fund_type` | `fty_fund_type` |
| `Description`, `description` | `fty_fund_desc` |
| `Type Basis`, `Type_Basis`, `type_basis` | `fty_basis` |
| `Remark`, `remark` | `fty_remark` |
| `Status`, `status` | `fty_status` |
| `Entry Date`, `Entry_Date`, `EntryDate`, `entryDate`, … | `createddate` |

POST/PUT accept **any** of the alias names above and map them back to DB columns. PUT processes **aliases first**, then raw `fty_*` fields so user edits win.

---

### 5. REST API contracts (for a Laravel port)

Base path in Nuxt: `/api/setup/glstructure/fund-type`.

### 5.1 `GET` — list (no server pagination)

- **Query**: optional `search` (OR `contains` across several fields); optional filters per column (e.g. `fty_fund_type`, `Description`, `Status`, …) — all use **contains** semantics in Prisma.
- **Response** (success):

```json
{
  "statusCode": 200,
  "message": "Data fetched successfully",
  "data": [ { "...": "mapped rows" } ]
}
```

- **Ordering**: `fty_fund_id` descending.
- **Laravel**: one `index` method: `FundType::query()->when($search, ...)->orderByDesc('fty_fund_id')->get()`, map to same JSON shape if you want drop-in frontend compatibility.

### 5.2 `POST` — create

- **Body**: mixed keys (aliases or `fty_*`).
- If `fty_fund_id` missing or 0: set to `max(fty_fund_id)+1` (or 1 if empty).
- Date strings `YYYY-MM-DD` for `createddate` / `updateddate` are converted to `DateTime`.
- **Response**: `statusCode` 200, `data` = created model. Errors: 409 unique, 400 FK, 500.

### 5.3 `PUT /{id}` — update

- **id**: `fty_fund_id` as integer string.
- **Body**: partial updates with same alias rules.
- If no mapped fields: 400 “No fields to update”.
- **Response**: 200 with updated row; 404 if missing.

### 5.4 `DELETE /{id}`

- **Response**: 200 on success; 404; 400 if FK prevents delete.

---

### 6. Page data flow (frontend)

1. **`fetchData()`** — `GET` with optional `topFilter` query keys (this page has **no** top filters; object is empty).
2. Each row from API is merged into a table row with:
   - `no`: row index (1-based) after fetch (recomputed only on fetch, not on filter — see note below).
   - `Action`: empty placeholder for action column.
   - Copies of all API keys plus **display names** from `fieldAliasMap` (`fty_fund_type` → `"Fund Type"`, etc.).
3. **`applyFilters()`** builds `filteredFundtypeList` from `fundtypeList`:
   - **Global search** (`searchKeyword`): case-insensitive substring match across **all** keys except `no` and `Action`.
   - **Smart filter**: see Fund Type subsection **8** (Smart filter).
4. **`rs-table`** receives `:data="filteredFundtypeList"` and handles **sorting**, **pagination** (`pageSize`), **column UI**, and **export config** via ref methods.

**Note:** After client-side filtering, the `no` field on each row is **not** renumbered in the mapped list; the table/export use **export row index** where needed. For a clean Laravel/Vue rewrite you may want to recompute `no` after filter.

---

### 7. Global search (toolbar)

- **State**: `searchKeyword` (bound to FormKit text + clear button).
- **Behavior**: filters `filteredFundtypeList`; **independent** of `rs-table`’s internal search (that internal search is **hidden** via `hideTableSearch: true`).
- **Filter button styling**: `hasActiveFilters` turns the smart-filter button red when any smart filter value is non-empty.

---

### 8. Smart filter

### 8.1 State

- `smartFilter` — reactive object.
- `originalFilter` — snapshot when opening the modal (for Cancel restore).

### 8.2 Field keys (must stay consistent with `applyFilters`)

| UI label | `v-model` key | Filter logic |
|----------|---------------|--------------|
| Fund Type | `smartFilter.Fund_Type_filter` | **Substring** (after stripping `_filter`: field name `Fund_Type` — compared to `item.Fund_Type` or `item[key]`) |
| Description | `smartFilter.Description_filter` | Substring |
| Status | `smartFilter.Status_filter` | **Exact match** (string compare) — listed in `dropdownFilterFields = ["Status"]` |

**Note:** The GET API maps both `"Fund Type"` and `Fund_Type` to `fty_fund_type`, so filtered rows typically expose `Fund_Type` for substring matching after stripping `_filter`. When porting, keep alias names aligned with `applyFilters` / `smartFilter` keys.

### 8.3 Labels for export metadata

- `smartFilterLabels`: `{ "Fund_Type_filter": "Fund Type", "Description_filter": "Description", "Status_filter": "Status" }`
- `smartFilterOptionsMap`: `{ "Status_filter": "StatusOptions" }` (for documentation/export label resolution; CSV/Excel use `StatusOptions` for human-readable filter lines).

### 8.4 Modal actions

- **Reset**: `smartFilter = {}`, `originalFilter = {}`.
- **Ok**: close modal (filters already live-bound via `watch`).
- **Cancel / overlay close**: restore `smartFilter` from `originalFilter`.

---

### 9. Pagination and page size

- **State**: `pageSize` — select options 5, 10, 25, 50, 100.
- **Implementation**: handled inside **`rs-table`** (`:pageSize="pageSize"`), not the GET API.
- Table’s own page-size control is hidden (`hideTablePageSize: true`); the page uses a **custom** “Display” select above the grid.

---

### 10. `rs-table` behavior (column reorder / hide / sort / group)

Props used on this page:

| Prop | Value | Meaning |
|------|-------|---------|
| `:field` | `["no","Fund Type","Description","Type Basis","Remark","Status","Entry Date","Action"]` | Canonical field list; used to map display titles ↔ slot names / export field names |
| `:data` | `filteredFundtypeList` | Row source |
| `advanced` | `true` | Advanced table mode |
| `:optionsAdvanced.sortable` | `true` | Column sort |
| `:columnMovable` | `true` | Drag reorder columns |
| `:columnHideShow` | `true` | Context menu / filter UI to hide columns (No/Action cannot be hidden) |
| `:columnGroupingList` | `isGrouped` | **Group List** mode |
| `:hideTableSearch` | `true` | Hide built-in table search |
| `:hideTablePageSize` | `true` | Hide built-in page size |
| `ref="datatableRef"` | — | Parent calls exposed methods |

### 10.1 Group List (`isGrouped`)

- Toggled from the **⋮** menu: “Group List” / “Ungroup List”.
- When **on**, `RsTable`:
  - Sorts rows by **all data columns left-to-right** except `no` / `action` (case-insensitive title check).
  - Computes `groupedCellInfo`: merged cells for consecutive equal values respecting “parent” columns to the left (hierarchical grouping).
- **Export**: `getExportConfig()` returns `groupedInfo` + `columnTitleIndices` so PDF (jspdf-autotable rowspan), CSV (empty cells for spanned rows), and Excel (merged cells) match the grid.

### 10.2 Exposed methods (`defineExpose` on `RsTable`)

- **`getTemplateState()`** → `{ columnOrder, hiddenColumns, sortColumn, sortDirection }`
  - `hiddenColumns`: from internal `filter` state (hide actions).
- **`applyTemplateState(state)`** — requires `state.columnOrder` array; reapplies hidden columns and sort.
- **`getExportConfig()`** → `{ columns, data, groupedInfo, columnGroupingList, columnTitleIndices }`
  - `columns`: visible export headers in order (maps titles back to `:field` entries where camelCase matches).
  - `data`: full **current** dataset for export (after table’s internal keyword filter — with `hideTableSearch` usually empty — sorted like the grid).

---

### 11. Save Template / Load Template

### 11.1 Save

1. Calls `datatableRef.getTemplateState()`.
2. Builds JSON:

```json
{
  "version": 1,
  "pageName": "Fund Type",
  "columnOrder": ["no", "Fund Type", "..."],
  "hiddenColumns": ["Remark"],
  "sortColumn": "Fund Type",
  "sortDirection": "asc",
  "isGrouped": false,
  "searchKeyword": "",
  "smartFilter": { "Status_filter": "1" }
}
```

3. Download: prefers **`window.showSaveFilePicker`**; fallback `<a download>`.

### 11.2 Load

1. Hidden `<input type="file" accept=".json">`.
2. `JSON.parse`; **requires** `columnOrder` array.
3. `datatableRef.applyTemplateState(template)` then restores `searchKeyword`, `smartFilter`, `isGrouped`; calls `applyFilters()`.

### 11.3 Laravel / other frontends

Persist the same JSON in DB or disk if you want server-side templates; the **semantic** contract is the object above.

---

### 12. Download PDF / CSV / Excel

All three:

1. Prefer `datatableRef.getExportConfig()`; fallback default columns  
   `["Fund Type","Description","Type Basis","Remark","Status","Entry Date"]`  
   and `filteredFundtypeList`.
2. Abort with SweetAlert if no rows.

### 12.1 PDF

- **Libraries**: dynamic `import('jspdf')`, `import('jspdf-autotable')`.
- **Header block**: optional logo `/img/logo/organization_logo.png`, date/time top-right, centered title **“Fund Type”**.
- **Table**: head `['No.', ...exportColumns]`; body uses `formatCell` — **Status** resolved via `StatusOptions`; **Entry Date** via `formatDate` (DD/MM/YYYY).
- **Grouping**: uses `groupedInfo` / `columnTitleIndices` with jspdf-autotable **rowSpan** objects.
- **File name**: `Fund_Type_YYYY-MM-DD.pdf`.

### 12.2 CSV

- Preamble lines: date/time line, title line `"Fund Type"`, optional `Search: ...`, optional top filters (none on this page), optional smart filter lines with **labels** from `smartFilterLabels` and value labels from options lookup.
- Header row: `No.` + export columns.
- **Grouping**: for `rowspan === 0` cells, output empty field (PDF omits cell entirely).
- **File name**: `Fund_Type_YYYY-MM-DD.csv`.

### 12.3 Excel

- **Library**: dynamic `import('exceljs')`.
- Rows mirror CSV preamble structure; header row styled grey + bold; column widths (No. narrow, others ~20).
- **Merged cells** for grouped columns via `worksheet.mergeCells` when `groupedInfo` present.
- **File name**: `Fund_Type_YYYY-MM-DD.xlsx`.

---

### 13. Generate API (⋮ menu)

### 13.1 User flow

1. Modal: choose **Output type** — `JSON`, `PDF`, `CSV`, `EXCEL`.
2. **POST** `/api/api-gen-template` with body:

```json
{
  "api_base_url": "https://host/api/kerisi-export/setup/glstructure/fund-type?",
  "api_data_path": "/api/setup/glstructure/fund-type",
  "api_output_type": "JSON",
  "api_gen_template_details": {
    "columnOrder": [...],
    "hiddenColumns": [...],
    "sortColumn": "...",
    "sortDirection": "asc",
    "isGrouped": false,
    "searchKeyword": "",
    "smartFilter": {},
    "exportColumns": ["Fund Type", "..."]
  }
}
```

- `api_base_url` is built as  
  `origin + "/api/kerisi-export/" + slug`  
  where `slug` = `api_data_path` without `/api/` prefix → `setup/glstructure/fund-type`.
- Server stores `api_base_url` with trailing `?` if missing.

3. Response `data.full_url` = `api_base_url + "kerisiApiKey=" + api_key` (key is 32 chars from crypto-safe alphabet).

4. Success UI: SweetAlert with **copy** button; notes that JSON/PDF open inline, CSV/Excel download.

### 13.2 Persistence (`api_gen_template` table)

- `api_key` (unique), `api_base_url`, `api_data_path`, `api_output_type`, `api_gen_template_details` (JSON), audit fields.

### 13.3 Consumption — `GET /api/kerisi-export/setup/glstructure/fund-type`

- **Query**: `kerisiApiKey` (required).
- Loads template row; logs to **`api_gen_log`** (IP, browser from UA, session hash from `accessToken` cookie, `createdby` from context user).
- Fetches **all** fund types from DB, maps to a **flat** display shape (`Fund Type`, `Description`, …, `Status` as ACTIVE/INACTIVE string, `Entry Date` formatted).
- **`applyTemplateFilters`**: applies `searchKeyword`, `smartFilter` (substring / equality hybrid), `sortColumn` / `sortDirection`, derives `exportColumns` from `hiddenColumns` + `columnOrder` + `exportColumns` in template.
- **Response** by `api_output_type`:
  - **JSON**: array of rows (with `no` renumbered).
  - **CSV**: attachment.
  - **EXCEL**: ExcelJS workbook, attachment.
  - **PDF**: jsPDF + autotable (Node requires `jspdf.node` + `jspdf-autotable`), **inline** PDF.

### 13.4 `kerisiApiKey` redirect on the page

On mount, if `route.query.kerisiApiKey` is set, the page **redirects** the browser to:

`/api/kerisi-export/${lastPathSegment}?kerisiApiKey=...`

For this route, `lastPathSegment` is **`fundtype`**, but the actual handler file is under **`setup/glstructure/fund-type`**. When migrating, **align** the redirect slug with the real export route (e.g. use the same slug as `kerisi-export` path).

---

### 14. CRUD modals

- **View**: all fields read-only except navigation; shows labels via FormKit.
- **Add**: `EntryDate` defaulted to today (`YYYY-MM-DD`); Status select; POST body is `fundtypeForm`.
- **Edit**: only copies **whitelist** keys to form to avoid stale DB keys overwriting aliases:  
  `id`, `Fund_Type`, `Description`, `Type_Basis`, `Remark`, `Status`, `Entry_Date`, `fund_type`, `EntryDate`.
- **Save**: PUT `.../fund-type/{id}` or POST `.../fund-type`; then `fetchData()` and close modal.
- **Delete**: confirm SweetAlert → DELETE `.../{id}` → refresh.
- **Entry Date** in form is **disabled** (read-only; still sent on create/update from mapped body).

---

### 15. Message log

Uses `useMessageLog` composable for delete confirmation audit and create/update success lines (`pageName`, `moduleName`, breadcrumb text). Port if you need the same audit trail in Laravel (events/listeners or activity log).

---

### 16. Dependencies (npm) touched by this page

- **jspdf**, **jspdf-autotable** — PDF in browser.
- **exceljs** — Excel download.
- **@formkit/vue** (FormKit) — inputs.
- **sweetalert2** via `$swal` — toasts and dialogs.
- Project UI: `rs-card`, `rs-table`, `rs-button`, `rs-modal`, `rs-dropdown`, `LayoutsBreadcrumb`, `Icon`.

---

### 17. Laravel migration checklist (Fund Type)

1. **Routes**: `GET/POST /api/.../fund-type`, `PUT/DELETE /api/.../fund-type/{id}` with same JSON conventions **or** document breaking changes for a new SPA.
2. **Model**: `FundType` → table `fund_type`, PK `fty_fund_id`, unique `fty_fund_type`.
3. **List**: no pagination; optional query filters mirroring GET handler.
4. **Create**: replicate `max(id)+1` if you keep non-auto-increment PK; map request aliases to columns; parse dates.
5. **Export endpoint**: clone `applyTemplateFilters` + four output formats; store templates in `api_gen_templates` + logs table.
6. **Template issuance**: POST creates random key, stores JSON details, returns full URL.
7. **Frontend**: either keep Vue and point `useFetch` to Laravel, or rebuild grid with:
   - column reorder + hide persistence,
   - grouping with rowspan/merge in exports,
   - same JSON template file format if users share templates.

---

### 18. Related navigation entry

Menu path is configured in `navigation/index.js` as `/setup/glstructure/fundtype` (see repo).

---

## 3. Parent page: GL Structure (`/glstructure`)

- **File:** `pages/glstructure/index.vue`
- **Behavior:** Auth shell + breadcrumb + `rs-card` with static text (“Content for GL Structure”). **No APIs**, no CRUD.
- **Migration:** Optional landing/dashboard tile in Laravel that links to the child routes below.

---

## 4. Activity Code (`/setup/glstructure/activity`)

### 4.1 Purpose

Maintain **activity_group → activity_subgroup → activity_subsiri → activity_type** in a **horizontal cascade**: four columns of lists; selecting a row loads children; each column has search, Add/Edit/View/Delete, and a **download menu** (PDF / CSV / Excel) for **that column’s current list**.

### 4.2 Frontend

- **File:** `pages/setup/glstructure/activity/index.vue`
- **State:** `listData.group | subgroup | subsiri | activityType`, `selected.*`, per-column `searchKeywords`, resizable column widths, modals per entity (`groupForm`, `subgroupForm`, `subsiriForm`, `activityTypeForm`).
- **Not used:** `rs-table`, `useDatatableFeatures`, Save/Load column template, Group List, Generate API.

### 4.3 APIs (`/api/setup/activity-code`)

| Operation | Method | Path pattern | Notes |
|-----------|--------|--------------|-------|
| List | GET | `/api/setup/activity-code` | Query `level` (0=group, 1=subgroup, 2=subsiri, 3=activity type); parent keys `activity_group_code`, `activity_subgroup_code`, etc. as required by level; optional `search`. |
| Create group | POST | `/api/setup/activity-code/group` | Body: group fields |
| Update group | PUT | `/api/setup/activity-code/group/{code}` | |
| Delete group | DELETE | `/api/setup/activity-code/group/{code}` | |
| Create subgroup | POST | `/api/setup/activity-code/subgroup` | Requires parent `activity_group_code` |
| Update subgroup | PUT | `/api/setup/activity-code/subgroup/{code}` | Query may scope parent |
| Delete subgroup | DELETE | `/api/setup/activity-code/subgroup/{code}` | |
| Create subsiri | POST | `/api/setup/activity-code/subsiri` | |
| Update subsiri | PUT | `/api/setup/activity-code/subsiri/{code}` | |
| Delete subsiri | DELETE | `/api/setup/activity-code/subsiri/{code}` | |
| Create activity type | POST | `/api/setup/activity-code/activity-type` | |
| Update activity type | PUT | `/api/setup/activity-code/activity-type/{id}` | Numeric `at_activity_id` |
| Delete activity type | DELETE | `/api/setup/activity-code/activity-type/{id}` | |

**Server files:** under `server/api/setup/activity-code/` (see `index.get.js` + nested `group/`, `subgroup/`, `subsiri/`, `activity-type/`).

### 4.4 Laravel hints

- One **controller per level** or a single controller with `level` + `action` routing.
- Enforce **parent existence** before insert/update on child levels (mirrors Prisma relations).
- Reproduce **client-side PDF/CSV/Excel** (same libraries as Fund Type) or move exports to queued jobs on the server.

---

## 5. PTJ Code (`/setup/glstructure/ptj-code`)

### 5.1 Purpose

**Organization unit (PTJ)** hierarchy **4 levels** in `organization_unit` (`oun_level` 1–4), same cascade UX as Activity Code: columns `level1`–`level4`, selection drives children, per-column search and CRUD modals, downloads (PDF / CSV / Excel) per column.

### 5.2 Frontend

- **File:** `pages/setup/glstructure/ptj-code/index.vue`
- **Form:** `ptjForm` with `oun_code`, `oun_desc`, `org_code`, `oun_status`, parent `oun_code_parent`, addresses, staff heads, country, etc.

### 5.3 APIs (`/api/setup/ptj-code`)

| Operation | Method | Path | Notes |
|-----------|--------|------|-------|
| List | GET | `/api/setup/ptj-code` | Query `level` (1–4), `oun_code_parent` for deeper levels, optional `search`, optional `smartFilter_oun_status` (maps ACTIVE↔`oun_status` `1`). Joins `country` for descriptions. |
| Create | POST | `/api/setup/ptj-code` | Query/body `oun_level` 1–4; validates parent for levels 2–4 |
| Update | PUT | `/api/setup/ptj-code/{code}` | `{code}` = `oun_code` |
| Delete | DELETE | `/api/setup/ptj-code/{code}` | |

**Server files:** `server/api/setup/ptj-code/index.get.js`, `index.post.js`, `[code].put.js`, `[code].delete.js`.

### 5.4 Laravel hints

- Recursive or level-parameterized queries on `organization_unit` with `oun_code_parent` + `oun_level`.
- Status encoding may be `'1'` / non-`1` in DB vs `ACTIVE`/`INACTIVE` in UI — mirror the GET mapper.

---

## 6. Cost Centre (`/setup/glstructure/cost-centre`)

### 6.1 Purpose

Single-grid **cost centre** maintenance (`costcentre` + PTJ `organization_unit` join for labels). Same **datatable power features** as Fund Type except exports are **PDF + CSV only** via `useDatatableFeatures`.

### 6.2 Frontend

- **File:** `pages/setup/glstructure/cost-centre/index.vue`
- **`rs-table`:** `columnMovable`, `columnHideShow`, `columnGroupingList`, hidden built-in search/page size; custom toolbar search + smart filter modal.
- **`useDatatableFeatures`:** `pageName: "Cost Centre"`, `apiDataPath: "/api/setup/cost-centre"`, `defaultExportColumns`: `Code`, `Description (Malay)`, `PTJ`, `PTJ Description`, `Address`, `Status`; `smartFilter` keys `ccr_costcentre`, `PTJCodesm`, `OUcodesm`, `statussm` with labels/options for CSV preamble.
- **Modals:** Add/Edit/View; PTJ picked via autosuggest-style fetches.

### 6.3 APIs (`/api/setup/cost-centre`)

| Method | Path | Role |
|--------|------|------|
| GET | `/api/setup/cost-centre` | List; optional `search`; smart filters `smartFilter_ccr_costcentre`, `smartFilter_PTJCodesm`, `smartFilter_OUcodesm`, `smartFilter_statussm` (ACTIVE→`ccr_status` `1`) |
| GET | `/api/setup/cost-centre/autosuggest-ptj` | PTJ dropdown search |
| GET | `/api/setup/cost-centre/autosuggest-code` | Cost centre code suggestions |
| GET | `/api/setup/cost-centre/{id}` | Single row (`ccr_costcentre_id`) |
| POST | `/api/setup/cost-centre` | Create |
| PUT | `/api/setup/cost-centre/{id}` | Update |
| DELETE | `/api/setup/cost-centre/{id}` | Delete |

**Response row shape (GET list):** includes display keys `Code`, `Description (Malay)`, `PTJ`, `PTJ Description`, `Address`, `Status` (ACTIVE/INACTIVE), plus raw ids/codes for forms.

### 6.4 Generate API / `kerisi-export`

UI can create keys pointing to `/api/kerisi-export/setup/cost-centre` — **no matching file** in this repo. For Laravel, either implement the same contract as `fund-type.get.js` (read template, filter, JSON/PDF/CSV/EXCEL) or hide Generate API on this page.

---

## 7. Cascade Structure (`/setup/glstructure/cascade-structure`)

### 7.1 Purpose

CRUD on **`org_unit_costcentre`**: unique combinations of **fund type**, **activity**, **PTJ (organization_unit)**, **cost centre**, with status. Used for GL/cascade validation elsewhere.

### 7.2 Frontend

- **File:** `pages/setup/glstructure/cascade-structure/index.vue`
- **`rs-table` + `useDatatableFeatures`** like Cost Centre (`apiDataPath: "/api/setup/cascade-structure"`).
- **Smart filter** fields: `fty_fund_type_sm`, `activity_smptj`, `activity_smou`, `oun_codePTJ`, `costcenter_sm`, `ouc_status` (with dropdown option lists loaded from autosuggest endpoints).
- **Duplicate** action: clone row into add modal with cleared PK.
- **Exports:** PDF + CSV only (composable).

### 7.3 APIs (`/api/setup/cascade-structure`)

| Method | Path | Role |
|--------|------|------|
| GET | `/api/setup/cascade-structure` | List with `include`: `fund_type`, `activity_type`, `organization_unit`, `costcentre`; smart filter query keys `smartFilter_fty_fund_type_sm`, `smartFilter_activity_smptj`, `smartFilter_activity_smou`, `smartFilter_oun_codePTJ`, `smartFilter_costcenter_sm`, `smartFilter_ouc_status` |
| GET | `/api/setup/cascade-structure/{id}` | Single `ouc_ounit_costcentre_id` |
| POST | `/api/setup/cascade-structure` | Create |
| PUT | `/api/setup/cascade-structure/{id}` | Update |
| DELETE | `/api/setup/cascade-structure/{id}` | Delete |
| GET | `/api/setup/cascade-structure/autosuggest-fund` | Fund dropdown |
| GET | `/api/setup/cascade-structure/autosuggest-activity` | Activity dropdown |
| GET | `/api/setup/cascade-structure/autosuggest-ptj` | PTJ dropdown |
| GET | `/api/setup/cascade-structure/autosuggest-costcentre` | Cost centre dropdown |

**Display columns (typical):** `Fund`, `Fund Desc`, `Activity`, `Activity Description`, `PTJ`, `Cost Center`, descriptions, `Status`, etc.

### 7.4 Generate API / `kerisi-export`

Same situation as Cost Centre: URL slug `setup/cascade-structure` — **add export handler** in Laravel if you rely on Generate API.

---

## 8. Account Code (`/setup/account-code`)

### 8.1 Purpose

Six-level **account chart** cascade: **Activity** (lookup) → **Class** → **Sub-class** → **Siri** → **Sub-siri** → **Account code** (`account_main` with hierarchical codes). Each level is an `rs-table` with its own search, page size, smart filter (status), Add/Edit/View/Delete. **Exports:** PDF + CSV on specific levels (see template — not all six have both).

### 8.2 Frontend

- **File:** `pages/setup/account-code/index.vue`
- **Lists:** `activityList`, `classList`, `subClassList`, `siriList`, `subSiriList`, `accountCodeList` with independent `loading`, `searchKeywords`, `pageSizes`, `smartFilters`, modals.
- **Selection:** `selectedActivity` … `selectedSubSiri` drive which columns are active / which query params are sent.
- **No** Save Template / Group List / Generate API.

### 8.3 APIs (`/api/setup/account-code`)

| Method | Path | Role |
|--------|------|------|
| GET | `/api/setup/account-code` | **Level** via `level` (0–5) or `dt_accountactvty` / `level_1` / `level2` … `level5`; level 0 = `lookup_details` (`lma_code_name: ACCOUNT_ACTIVITY`); levels 1–5 = `account_main` filtered by `acm_acct_level` and parent code fields |
| POST | `/api/setup/account-code` | Create `account_main` row (account / class level — body determines level) |
| PUT | `/api/setup/account-code/{code}` | Update by `acm_acct_code` |
| DELETE | `/api/setup/account-code/{code}` | Delete account main |
| GET | `/api/setup/account-code/activity` | Activity list (used in flows) |
| POST | `/api/setup/account-code/activity` | Create lookup activity row |
| PUT | `/api/setup/account-code/activity/{id}` | Update by `lde_id` |
| DELETE | `/api/setup/account-code/activity/{id}` | Delete activity |

**Server files:** `server/api/setup/account-code/index.get.js`, `index.post.js`, `[code].put.js`, `[code].delete.js`, `activity/index.get.js`, `activity/index.post.js`, `activity/[id].put.js`, `activity/[id].delete.js`.

### 8.4 Laravel hints

- **Two “domains”:** `lookup_details` (activities) vs `account_main` (tree levels 1–5).
- Parent keys in GET queries chain `acm_acct_code_parent` (and similar) — mirror the Prisma `where` in `index.get.js`.
- Large page (~2400+ lines) — split Blade/Livewire/Vue components per level when porting.

---

## 9. Account Code v2 (`/setup/glstructure/account-code-v2`)

### 9.1 Purpose

Same **six-level** data model as v1, but UX aligned with **Activity Code / PTJ Code**: horizontal **column browser** (activity → … → account code), per-column downloads (PDF / CSV / Excel), no `useDatatableFeatures` / Generate API.

### 9.2 Frontend

- **File:** `pages/setup/glstructure/account-code-v2/index.vue`
- **Columns:** `activity`, `class`, `subClass`, `siri`, `subSiri`, `accountCode` with `queryKey` mapping to GET params (`dt_accountactvty`, `level_1`, `level2`, …).
- **Forms:** `activityForm`, `accountForm` (and level-specific state) — POST/PUT to same `/api/setup/account-code` endpoints as v1.

### 9.3 APIs

**Identical backend** to **§8 Account Code** in this document (`/api/setup/account-code` and `/api/setup/account-code/activity/...`). Only the **UI** differs.

### 9.4 Laravel hints

One API module; two frontends (grid vs cascade). Choose one pattern for your app unless you need both.

---

## 10. Cross-cutting Laravel migration notes

1. **Response envelope:** Nuxt handlers often return `{ statusCode, message, data }`. Laravel can use `Resource` + `JsonResponse` — document mapping for your SPA.
2. **Status fields:** Many tables use `'1'` / `'0'` or variants; UI shows ACTIVE/INACTIVE — centralize mapping in API resources.
3. **Generate API + export:** Reuse the `api_gen_template` / `api_gen_log` schema (see Fund Type §13) for any page that calls `api-gen-template`; implement **one export controller per slug** you issue (Fund Type is the only ready example in this repo).
4. **IDs:** `fund_type.fty_fund_id` and similar integers may use **manual max+1** on create — decide on auto-increment vs explicit sequences in Laravel.
5. **Auth:** Session/JWT for normal CRUD; **public** export URLs rely on **opaque `kerisiApiKey`** only (treat as secret URLs).

---

*Document evolved from the Fund Type migration spec to cover the full GL Structure Setup menu. Adjust route prefixes and JSON envelopes for your Laravel API.*

