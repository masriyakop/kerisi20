# Kitchen Sink Page – Implementation Plan

A dedicated `/kitchen-sink` page that showcases all UI components and patterns per `docs/UIUX_GUIDELINE.md`. Use this as the single reference for building new screens.

---

## 1. Page Setup

| Item | Value |
|------|-------|
| **Route** | `/kitchen-sink` |
| **File** | `pages/kitchen-sink/index.vue` |
| **Menu** | Devtool / Kitchen Sink (or Setup / Kitchen Sink) |
| **Auth** | `middleware: ["auth"]`, `requiresAuth: true` |
| **Layout** | Default (with sidebar) |

**Page meta:**
```javascript
definePageMeta({
  title: "Kitchen Sink",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Kitchen Sink", path: "/kitchen-sink" },
  ],
});
```

---

## 2. Page Structure (Sections)

The page is organized into collapsible sections. Each section shows one pattern with a short description and a link to the reference screen (if applicable).

### 2.1 Layout & Navigation

- **Breadcrumb**: `LayoutsBreadcrumb` at top
- **Section headers**: `rs-card` with `#header` for section title and optional description

### 2.2 Form Controls

Reference: `pages/sampleform/index.vue` (Setup / Sample Form)

| Control | FormKit type | Notes |
|---------|--------------|-------|
| Text | `type="text"` | With validation example |
| Textarea | `type="textarea"` | rows="4" |
| Date | `type="date"` | With calendar icon suffix |
| Checkbox | `type="checkbox"` | Options array, horizontal layout |
| Radio | `type="radio"` | Options array, horizontal layout |
| Select/Dropdown | `type="select"` | With clear button suffix |
| File upload | `type="text"` + suffix | With attach icon |
| RM display | `type="text"` + prefix | MYR prefix |
| Pill box | `type="text"` + suffix | With clear button |
| Drop zone | `type="text"` | Placeholder for drag-drop |

**Layout**: Use `flex items-center gap-4` with `label class="w-32 text-sm font-medium"` and `flex-1` for inputs (same as sampleform).

### 2.3 Buttons

Reference: `guidelines/02-Front-End.md` § 2.4

| Variant | Example |
|---------|---------|
| `primary` | Main actions (Save, Submit) |
| `secondary` | Secondary actions (Export PDF/CSV) |
| `danger` | Destructive (Delete) |
| `outline` / `ghost` | Cancel, low emphasis |
| `size="sm"` | Compact actions |
| `size="lg"` | Prominent CTA |
| `loading` | Loading state |
| `disabled` | Disabled state |

### 2.4 Cards

Reference: `guidelines/02-Front-End.md` § 2.4

- **Basic card**: header + body
- **Card with footer**: header + body + footer
- **Card with header actions**: Icons (tag, copy, edit) in header right

### 2.5 Datatable – Smart Filter Pattern

Reference: Budget Code at menu **Budget / Setup / Budget Code**

**Layout:**
1. **Top card**: Search keyword + Smart Filter button (opens modal)
2. **Table card**:
   - Header: Title + `rs-dropdown` (Save Template, Load Template, Ungroup/Group, Generate API)
   - Body: Display (page size) on left, Search on right, then `rs-table`
   - Footer: Record count + PDF | CSV | Excel | Add buttons

**Table options:**
- `advanced`, `columnMovable`, `columnHideShow`, `columnGroupingList`
- `hideTableSearch`, `hideTablePageSize` (custom header used)
- Sample data: 5–10 rows, columns e.g. No, Code, Description, Status

**Smart Filter modal:**
- FormKit inputs for filter fields (Level, Budget Code, Description, Status)
- Reset + Ok buttons
- Uses `rs-modal`

### 2.6 Datatable – Top Filter Pattern

Reference: Budget Structure List at menu **Budget / Setup / Budget Structure List**

**Layout:**
1. **Top Filter card**: Inline filters (Year, Fund, PTJ, Cost Centre, Activity) + Search button
2. **Table card**: Same structure as Smart Filter (dropdown, Display, Search, table, footer buttons)

**Differences from Smart Filter:**
- Filters visible in a card above the table (no modal)
- Grid layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4`

### 2.7 Modal

Reference: `guidelines/02-Front-End.md` § 2.4

- Demo button opens `rs-modal`
- Modal: title, body (simple form or text), footer (Cancel + OK)
- Sizes: `sm`, `md`, `lg`, `xl` (optional demo)

### 2.8 Dropdown

Reference: `guidelines/02-Front-End.md` § 2.4

- `rs-dropdown` with `rs-dropdown-item` children
- Variant: `secondary-text`, `size="sm"`, `position="bottom"`, `textAlign="right"`
- Items: Action 1, Action 2, Action 3

### 2.9 Alerts (if available)

Reference: `guidelines/02-Front-End.md` § 2.4

- `rs-alert` variants: `primary`, `success`, `warning`, `danger`
- Dismissible example

### 2.10 Export Buttons (PDF, CSV, Excel)

Reference: Budget Code datatable

- Buttons in footer: PDF, CSV, Excel
- For kitchen sink: Use mock/sample data; export functions can write a small demo file or show a toast “Export demo – see Budget Code for full implementation”

---

## 3. Data Strategy

- **No real API calls** for kitchen sink
- Use static `ref([...])` sample data for datatables
- Form state: local `ref` objects, no submit to server
- Export: Simplified versions that export the sample data (reuse logic from `useDatatableFeatures` or inline minimal PDF/CSV/Excel generation)

---

## 4. Implementation Phases

### Phase 1 – Core structure
- [ ] Create `pages/kitchen-sink/index.vue`
- [ ] Add page meta, breadcrumb, layout
- [ ] Add section cards (Form Controls, Buttons, Cards, etc.) with placeholders

### Phase 2 – Form controls
- [ ] Copy form control block from `sampleform/index.vue` (simplified)
- [ ] Ensure all control types are present

### Phase 3 – Buttons & cards
- [ ] Button variants row
- [ ] Card examples (basic, with footer, with header actions)

### Phase 4 – Datatable Smart Filter
- [ ] Search + Smart Filter button
- [ ] Smart Filter modal with filter fields
- [ ] `rs-table` with sample data, dropdown, Display, Search
- [ ] Footer: record count + PDF/CSV/Excel/Add (simplified handlers)

### Phase 5 – Datatable Top Filter
- [ ] Top Filter card with inline filters
- [ ] Table card (can share structure with Smart Filter section)
- [ ] Same footer pattern

### Phase 6 – Modal & dropdown
- [ ] Modal demo
- [ ] Dropdown demo

### Phase 7 – Polish
- [ ] Add menu entry (e.g. Devtool or Setup)
- [ ] Update `docs/UIUX_GUIDELINE.md` to reference `/kitchen-sink`
- [ ] Optional: collapsible sections via `rs-card` or accordion

---

## 5. File Structure

```
pages/
  kitchen-sink/
    index.vue          # Single page with all sections
```

Optional future split:
```
pages/
  kitchen-sink/
    index.vue          # Overview + links or embedded sections
components/
  kitchen-sink/
    FormControls.vue
    ButtonsShowcase.vue
    DatatableSmartFilter.vue
    DatatableTopFilter.vue
```

Recommendation: Start with a single `index.vue`; extract components only if the file becomes too large (>500 lines).

---

## 6. Reference Screens Summary

| Pattern | Screen | Menu Path |
|---------|--------|-----------|
| Form controls | Sample Form | Setup / Sample Form |
| Datatable smart filter | Budget Code | Budget / Setup / Budget Code |
| Datatable top filter | Budget Structure List | Budget / Setup / Budget Structure List |
| PDF/CSV/Excel export | Budget Code | Budget / Setup / Budget Code |

---

## 7. Dependencies

- FormKit (already in project)
- rs-card, rs-button, rs-table, rs-modal, rs-dropdown (project components)
- Icon (Nuxt Icon)
- useDatatableFeatures (for export logic – optional; can use simplified inline)
- jsPDF, jspdf-autotable, exceljs (for export – already used in Budget Code)

---

## 8. UIUX_GUIDELINE.md Update

After implementation, add to `docs/UIUX_GUIDELINE.md` Kitchen Sink section:

```markdown
- **Full showcase**: Kitchen Sink at menu: Devtool / Kitchen Sink (`/kitchen-sink`)
```
