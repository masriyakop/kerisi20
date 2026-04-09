# Workflow Configuration — migration reference

**URL:** `http://localhost:3000/workflowconfiguration`  
**Source:** `pages/workflowconfiguration/index.vue`  
**APIs:** `server/api/workflow-configuration/**`

This document describes every **page**, **panel**, **tab** (there are none), **create/update** surface (modals), and how **viewing** works (lists and inline read-only data), so you can migrate or refactor into another project.

---

## 1. Pages and routing

| Concept | Implementation |
|--------|----------------|
| **Routes** | **One route only:** `/workflowconfiguration` |
| **File** | `pages/workflowconfiguration/index.vue` |
| **Child routes** | **None** — no `/workflowconfiguration/[id]`, no separate list vs detail URLs |
| **Page meta** | Title: `Workflow Configuration`; middleware: `auth`; `requiresAuth: true` |
| **Breadcrumb** | Dashboard → Workflow Management → Workflow Configuration |
| **App menu** | `navigation/index.js` — under **Workflow Management** → **Workflow Configuration** |

Everything happens on a **single full-page layout**; navigation between “workflow / process / detail” is **in-page selection and expand/collapse**, not route changes.

---

## 2. Tabs

**There is no tab component** (no `UTabs`, no segmented control, no URL hash for tabs).

What exists instead:

- A **two-column master–detail** layout (workflow list | main panel).
- **Per-process accordion**: each process row can be **collapsed** or **expanded**. Expanded rows show two **subsections** stacked vertically: **Process Details** and **Authorized Roles**. These are not tabs; they always appear together when the process is expanded.

---

## 3. Top-level layout (panels)

The page body is wrapped in `LayoutsBreadcrumb` + `rs-card` titled **Workflow Configuration**. Inside the card, a responsive grid:

| Breakpoint | Columns |
|------------|---------|
| Default (`grid-cols-1`) | Single column: workflow block stacked above detail block |
| `lg` and up (`lg:grid-cols-3`) | **1 + 2** split: left ~33%, right ~67% |

### 3.1 Panel A — Workflow (left column)

Purpose: pick which workflow to configure; CRUD workflows.

| UI block | Behavior |
|----------|----------|
| **Label + search** | `FormKit` text, placeholder `Search workflow...`. Filters **client-side** by `wfa_workflow_code` or `wfa_workflow_title` (case-insensitive). Suffix button clears search when non-empty. |
| **Workflows list header** | Uppercase label `Workflows`. |
| **List body** | Loading: `Loading...`. Empty filter result: `No workflows found`. Else scrollable list (`max-h-[540px]`). |
| **Each workflow row** | Primary line: `wfa_workflow_title` or fallback `wfa_workflow_code`. Secondary: `wfa_workflow_code`. Click row → **select workflow** and **fetch processes** for that code. Selected row gets highlight classes. |
| **Row hover actions** | **Edit** (opens workflow modal), **Delete** (SweetAlert confirm). `@click.stop` so they do not change selection. |
| **Footer** | **Add** — opens **Add Workflow** modal. |

### 3.2 Panel B — Workflow detail / processes (right column)

Purpose: show selected workflow identity and manage its processes and nested data.

| UI block | Behavior |
|----------|----------|
| **Header** | Title: selected `wfa_workflow_title` or placeholder `Select a workflow`. Subtitle: `wfa_workflow_code` or empty. |
| **Inner box “Workflow Process”** | Gray nested panel with title `Workflow Process`. May show `Updating sequence...` when reorder API runs. |
| **No workflow selected** | Centered message: `Select a workflow to view processes`. |
| **Workflow selected, processes loading** | Spinner + `Loading processes...`. |
| **No processes** | Message + **Add Process** button. |
| **Has processes** | See §4. |

---

## 4. Process cards (within Panel B)

Each process is a **card** (`orderedProcesses`):

- **Drag-and-drop:** Cards are draggable (disabled while `isReorderingProcesses`). Drop reorders local list and persists `wfp_sequence` via **PUT** `/api/workflow-configuration/process/[id]` for changed rows, then refetches processes.

**Header row (always visible):**

- Clickable area toggles **collapse** (`collapsedIds` Set). Icon: `unfold-more` when collapsed, `unfold-less` when expanded.
- **Badges:** process name, `Seq: wfp_sequence`, `Duration KPI: wfp_duration_kpi ?? "-"`, `By Div/Dept: Yes/No` from `wfp_is_by_ptj`, `Active` / `Inactive` from `wfp_status === '1'`.
- **Edit** / **Delete** (stop propagation): open process modal or confirm delete.

**When expanded (`!collapsedIds.has(wfp_process_id)`):**

- Subheading: `Process Details & Authorized Roles`.
- If this card’s process is **not** `selectedProcess`, show *Click to load details* (data is only loaded for the expanded selected process — expanding sets `selectedProcess` and loads details).
- If **selected** and loading: `Loading...`.
- Else two **inline sub-panels** (not tabs):

### 4.1 Sub-panel — Process Details

- Header `Process Details` + **Add** (opens Add Process Detail modal; refreshes processes, fetches **reroute options**).
- List: each line shows **`wpd_status`** (API-computed display string). **Edit** / **Delete** per row.

### 4.2 Sub-panel — Authorized Roles

- Header `Authorized Roles` + **Add** (opens Add Authorized Role modal).
- List: `war_group_code (war_limit_min - war_limit_max)` with **Edit** / **Delete**.

Below the process list (when not empty): **Add Process** again at the bottom right.

---

## 5. Create, update, and “view”

### 5.1 Dedicated view pages

**None.** There is no read-only route or printable detail page. “View” is:

- Workflow list (title + code).
- Process row badges and name.
- Process detail lines showing `wpd_status`.
- Role lines showing group code and limits.

### 5.2 Dedicated create/edit pages

**None.** All creates and edits use **`rs-modal`** dialogs (four modals). Deletes use **SweetAlert2** (`$swal`) confirmation, then DELETE APIs.

### 5.3 Modal 1 — Workflow (`showWorkflowModal`)

| Mode | Title |
|------|--------|
| Create | `Add Workflow` |
| Update | `Edit Workflow` |

| Field | Notes |
|-------|--------|
| `wfa_workflow_code` | Required. **Disabled in edit mode.** |
| `wfa_workflow_title` | Required. |
| Prevent Self Process | Checkbox → `wfa_prevent_self_process` = `1` or `null`. |

**Not shown in UI but sent on save:** `wfa_involve_posting` defaults to `1` in form state; create sends full `workflowForm`; update PUT sends `wfa_involve_posting` from state. Users **cannot** change involve posting in the modal (no control bound).

**API:** POST `/api/workflow-configuration/workflow` | PUT `/api/workflow-configuration/workflow/[code]` | DELETE with confirm.

### 5.4 Modal 2 — Process (`showProcessModal`)

| Mode | Title |
|------|--------|
| Create | `Add Process` |
| Update | `Edit Process` |

| Field | Notes |
|-------|--------|
| `wfp_process_name` | Required. |
| `wfp_process_desc_bm` | Optional text. |
| `wfp_sequence` | Integer; key/paste guards for integers; normalize on blur. New process: default `max(existing sequences) + 1`. |
| `wfp_duration_kpi` | Optional integer. |
| Status | Checkbox “Active” → `wfp_status` `"1"` / `"0"`. |
| Email / Todo notification | Checkboxes → `wfp_is_email_notification`, `wfp_is_todo_notification` (1/0). |
| Orchestration | “By Div/Dept” → `wfp_is_by_ptj` (1 or null). |

**In `processForm` but not in modal:** `wfp_duration_kpi_withquery`, `wfp_is_by_unit`, `wfp_is_allow_query` — loaded on edit, sent on save with PUT/POST body from `processForm`, but **no inputs** for them. Server also supports `wfp_process_desc_bi` on create; UI does not set it.

**API:** POST `/api/workflow-configuration/process` (body includes `wfp_workflow_code` from selected workflow) | PUT `/api/workflow-configuration/process/[id]` | DELETE.

### 5.5 Modal 3 — Process detail (`showProcessDetailModal`)

| Mode | Title |
|------|--------|
| Create | `Add Process Detail` |
| Update | `Edit Process Detail` |

Opened only when a process is selected; **Add/Edit process detail** calls `fetchRerouteProcessOptions()` first.

| Field | Notes |
|-------|--------|
| `wpd_status_code` | Required. |
| `wpd_status_desc` | Stored in DB JSON `wpd_extended_field.wpd_status_desc` (see process-detail APIs). |
| Reroute Process | `FormKit` **select**; options = `GET /api/workflow-configuration/reroute-process-options` mapped to `{ label: description, value: id }` plus `— None —` → `null`. Values are **`wfp_process_id`** of **active** processes (`wfp_status = '1'`) across workflows; label = `wfa_workflow_title + ' - ' + wfp_process_name`. |
| `wpd_order` | Optional number. |

**API:** POST `/api/workflow-configuration/process-detail` (includes `wpd_process_id` for selected process) | PUT `/api/workflow-configuration/process-detail/[id]` | DELETE.

### 5.6 Modal 4 — Authorized role (`showAuthorizedRoleModal`)

| Mode | Title |
|------|--------|
| Create | `Add Authorized Role` |
| Update | `Edit Authorized Role` |

| Field | Notes |
|-------|--------|
| `war_group_code` | Required. |
| `war_limit_min`, `war_limit_max` | Optional numbers (parsed as float server-side). |

**API:** POST `/api/workflow-configuration/authorized-role` (includes `war_process_id`) | PUT `/api/workflow-configuration/authorized-role/[id]` | DELETE.

---

## 6. Client state and lifecycle (migration hints)

| State | Role |
|-------|------|
| `workflows`, `loading` | All workflows from GET list. |
| `searchKeyword` | Filters `filteredWorkflows`. |
| `selectedWorkflow` | Drives process fetch and panel B header. |
| `processes`, `orderedProcesses`, `processesLoading` | Processes for selected workflow; `orderedProcesses` is reorder working copy. |
| `selectedProcess` | Which process’s details/roles are loaded. |
| `processDetails`, `authorizedRoles`, `detailsLoading` | Loaded when a process is expanded and selected. |
| `collapsedIds` | Which process cards are collapsed (Set of `wfp_process_id`). |
| `rerouteProcessOptions` | Cached list for process-detail reroute dropdown. |

**Initial load:** `onMounted` → `fetchWorkflows()`; if list non-empty, auto-selects first workflow and loads its processes.

**Switch workflow:** Clears `selectedProcess`, details, roles; loads new process list.

---

## 7. HTTP API reference

Base path: **`/api/workflow-configuration`**

Success responses typically include `{ statusCode: 200, message, data? }`. The page treats `statusCode === 200` as success.

| Method | Path | Role |
|--------|------|------|
| GET | `/api/workflow-configuration` | List workflows (`wf_workflow_name`). |
| POST | `/api/workflow-configuration/workflow` | Create workflow. |
| PUT | `/api/workflow-configuration/workflow/[code]` | Update workflow. |
| DELETE | `/api/workflow-configuration/workflow/[code]` | Delete workflow. |
| GET | `/api/workflow-configuration/[code]/processes` | List processes for workflow code. |
| POST | `/api/workflow-configuration/process` | Create process. |
| PUT | `/api/workflow-configuration/process/[id]` | Update process; also used after drag reorder. |
| DELETE | `/api/workflow-configuration/process/[id]` | Delete process. |
| GET | `/api/workflow-configuration/processes/[id]/details` | Process details (+ computed `wpd_status`, etc.). |
| GET | `/api/workflow-configuration/processes/[id]/authorized-roles` | Authorized roles. |
| GET | `/api/workflow-configuration/reroute-process-options` | All active processes with `{ id: wfp_process_id, description }` for reroute select. |
| POST | `/api/workflow-configuration/process-detail` | Create process detail. |
| PUT | `/api/workflow-configuration/process-detail/[id]` | Update process detail. |
| DELETE | `/api/workflow-configuration/process-detail/[id]` | Delete process detail. |
| POST | `/api/workflow-configuration/authorized-role` | Create authorized role. |
| PUT | `/api/workflow-configuration/authorized-role/[id]` | Update authorized role. |
| DELETE | `/api/workflow-configuration/authorized-role/[id]` | Delete authorized role. |

---

## 8. Database (Prisma)

| Model | Purpose |
|-------|---------|
| `wf_workflow_name` | Workflow header (`wfa_*`). |
| `wf_process` | Process steps (`wfp_*`). |
| `wf_process_details` | Status/outcome rows per process (`wpd_*`); `wpd_extended_field` JSON for extra description. |
| `wf_authorized_role` | Group + limits per process (`war_*`). |

Details GET builds a display `wpd_status` string from code + extended description (see `server/api/workflow-configuration/processes/[id]/details.get.js`).

---

## 9. Frontend dependencies

- `LayoutsBreadcrumb`, `rs-card`, `rs-button`, `rs-modal`, `FormKit`, `Icon` (Nuxt Icon), `$swal` (SweetAlert2).
- `useFetch` for all requests.

---

## 10. Migration checklist

1. **Single page / single route** — replicate master–detail + accordion, or split into multiple routes intentionally (not how this app works today).
2. **No tabs** — use sections or your own tab bar if the target UX needs it.
3. **Four modals** map 1:1 to create/update; **no separate view routes**.
4. **Reroute dropdown** depends on **`/reroute-process-options`** (global active processes), not only the current workflow.
5. **Drag reorder** = batch PUT `process/[id]` with recalculated `wfp_sequence`, then refresh.
6. **Hidden fields:** expose `wfa_involve_posting`, `wfp_duration_kpi_withquery`, `wfp_is_by_unit`, `wfp_is_allow_query`, `wfp_process_desc_bi` in the target UI if full parity with the schema is required.
