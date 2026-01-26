<script setup>
import { useUserStore } from "~/stores/user";

definePageMeta({
  title: "Page Creator",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Page Editor", path: "/pageeditor" },
    { name: "Page Creator", path: "/page-creator" },
  ],
});

const { $swal } = useNuxtApp();

const userStore = useUserStore();
const pageBreadcrumbText = "Dashboard > Page Editor > Page Creator";
const moduleName = "Workbence Editor";

const pages = ref([]);
const loading = ref(false);
const searchKeyword = ref("");
const selectedPage = ref(null);

// Page sorting state
const pageSortOrder = ref("asc"); // 'asc' or 'desc'
const pageSortBy = ref("title"); // 'title', 'status', 'menu'

// Add/Edit Page modal state
const showPageModal = ref(false);
const isPageEditMode = ref(false);
const isPageViewMode = ref(false);
const editingPageId = ref(null);

// Available menus for select dropdown
const availableMenus = ref([]);

// Page form data
const pageForm = ref({
  pageTitle: "",
  menu: "",
  status: "ACTIVE",
});
const components = ref([]);
const componentsLoading = ref(false);
const collapsedAll = ref(false);
const collapsedIds = ref(new Set());
const componentItemsByComponentId = ref({});
const componentItemsLoading = ref(false);
const componentListFull = ref([]); // Store full component data for dropdown

// Context menu state for page actions
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuPageId = ref(null);
const contextMenuRef = ref(null);

// Component Item modal state
const showComponentItemModal = ref(false);
const isComponentItemViewMode = ref(false);
const isComponentItemEditMode = ref(false);
const editingComponentItemId = ref(null);

// Component Item form data
const componentItemForm = ref({
  name: "",
  title: "",
  component: "",
  componentId: null,
  type: "",
  cssClass: "",
  additionalAttribute: "",
  defaultValue: "",
  lookup_queryMapping: "",
  visible: true,
  active: true,
  order: 1,
});

// Component Item Type options from lookup.json
const componentItemTypeOptions = ref([]);

// Component Type options from lookup.json
const componentTypeOptions = ref([]);

// Component modal state
const showComponentModal = ref(false);
const isViewMode = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

// Component form data
const componentForm = ref({
  title: "",
  name: "",
  cssClass: "",
  type: "custom",
  collapseEnable: false,
  collapseByDefault: false,
  visible: true,
  active: true,
  order: 1,
  queryMapping: "",
});

const filteredPages = computed(() => {
  let result = pages.value;
  
  // Apply search filter
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim();
    result = result.filter((p) => {
      return (
        p.title?.toLowerCase().includes(keyword) ||
        p.menu?.toLowerCase().includes(keyword) ||
        p.status?.toLowerCase().includes(keyword)
      );
    });
  }
  
  // Apply sorting
  result = [...result].sort((a, b) => {
    let aVal, bVal;
    
    switch (pageSortBy.value) {
      case "title":
        aVal = (a.title || "").toLowerCase();
        bVal = (b.title || "").toLowerCase();
        break;
      case "status":
        aVal = (a.status || "").toLowerCase();
        bVal = (b.status || "").toLowerCase();
        break;
      case "menu":
        aVal = (a.menu || "").toLowerCase();
        bVal = (b.menu || "").toLowerCase();
        break;
      default:
        aVal = (a.title || "").toLowerCase();
        bVal = (b.title || "").toLowerCase();
    }
    
    if (aVal < bVal) return pageSortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return pageSortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
  
  return result;
});

// Sorted components by order (ascending)
const sortedComponents = computed({
  get: () => {
    return [...components.value].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });
  },
  set: (newValue) => {
    // When components are reordered, immediately update their order values in the components array
    newValue.forEach((comp, index) => {
      const newOrder = index + 1;
      // Find the component in the original array and update its order
      const originalComp = components.value.find(c => c.id === comp.id);
      if (originalComp) {
        originalComp.order = newOrder;
      }
      // Also update the comp object itself
      comp.order = newOrder;
    });
    // Update the components array - maintain the new order
    components.value = newValue.map(comp => {
      const original = components.value.find(c => c.id === comp.id);
      return original ? { ...original, order: comp.order } : comp;
    });
  }
});

// Handle drag end to update order and save
const handleComponentDragEnd = async () => {
  if (!selectedPage.value) return;
  
  // Store the new order mapping before saving
  const newOrderMap = new Map();
  sortedComponents.value.forEach((comp, index) => {
    newOrderMap.set(comp.id, index + 1);
  });
  
  try {
    // Save all components with updated orders
    const updatePromises = sortedComponents.value.map((comp, index) => {
      const newOrder = index + 1;
      const originalComp = components.value.find(c => c.id === comp.id);
      if (!originalComp) return Promise.resolve();
      
      return useFetch(`/api/component-editor/${comp.id}`, {
        method: "PUT",
        body: {
          title: originalComp.title || "",
          name: originalComp.name || "",
          cssClass: originalComp.cssClass || "",
          type: originalComp.type || "custom",
          collapseEnable: originalComp.collapseEnable === 1 || originalComp.collapseEnable === true ? 1 : 0,
          collapseByDefault: originalComp.collapseByDefault === 1 || originalComp.collapseByDefault === true ? 1 : 0,
          visible: originalComp.visible === 1 || originalComp.visible === true ? 1 : 0,
          active: originalComp.active === 1 || originalComp.active === true ? 1 : 0,
          order: newOrder,
          queryMapping: originalComp.queryMapping || "",
          pageId: selectedPage.value.id,
          componentData: originalComp.componentData || "",
        },
        initialCache: false,
      });
    });
    
    await Promise.all(updatePromises);
    
    // Refresh components to get updated data from server
    await fetchComponents(selectedPage.value.id);
    
    // After refresh, update order values to match the new order we just saved
    // This ensures the UI reflects the correct order even if server response is delayed
    nextTick(() => {
      components.value.forEach((comp) => {
        if (newOrderMap.has(comp.id)) {
          comp.order = newOrderMap.get(comp.id);
        }
      });
    });
    
    $swal.fire({
      title: "Success",
      text: "Component order updated successfully",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error updating component orders:", error);
    $swal.fire({
      title: "Error",
      text: "Failed to update component order",
      icon: "error",
    });
    // Refresh to restore original order
    await fetchComponents(selectedPage.value.id);
  }
};

// Toggle page sort
const handlePageSort = () => {
  pageSortOrder.value = pageSortOrder.value === "asc" ? "desc" : "asc";
};

const fetchPages = async () => {
  try {
    loading.value = true;
    const { data } = await useFetch("/api/page-editor", {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      pages.value = (data.value.data || []).map((item) => ({
        id: item.pageId,
        title: item.pageTitle,
        menu: item.menu,
        status: item.status,
      }));
      if (!selectedPage.value && pages.value.length > 0) {
        selectedPage.value = pages.value[0];
        fetchComponents(pages.value[0].id);
      }
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch pages",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching pages:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching pages",
      icon: "error",
    });
    pages.value = [];
    components.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch available menus
const fetchAvailableMenus = async (excludePageId = null) => {
  try {
    const query = excludePageId ? `?excludePageId=${excludePageId}` : "";
    const { data } = await useFetch(`/api/page-editor/available-menus${query}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      availableMenus.value = data.value.data || [];
    }
  } catch (error) {
    console.error("Error fetching available menus:", error);
  }
};

// Menu options for dropdown - include current menu value in view mode
const menuOptions = computed(() => {
  const options = [
    { label: 'Select Menu', value: '' },
    ...availableMenus.value
  ];
  
  // In view mode, ensure the current menu value is in the options
  if (isPageViewMode.value && pageForm.value.menu && pageForm.value.menu.trim() !== '') {
    const currentMenu = pageForm.value.menu;
    const exists = options.some(opt => opt.value === currentMenu);
    if (!exists) {
      options.push({ label: currentMenu, value: currentMenu });
    }
  }
  
  return options;
});

// Fetch component items (by page) and group by componentId
const fetchComponentItems = async (pageId) => {
  componentItemsLoading.value = true;
  try {
    const { data } = await useFetch("/api/component-item-editor", {
      method: "GET",
      query: { pageId },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const items = data.value.data || [];
      const grouped = {};
      items.forEach((item) => {
        const compId = item.componentId;
        if (!grouped[compId]) grouped[compId] = [];
        grouped[compId].push(item);
      });
      componentItemsByComponentId.value = grouped;
    } else {
      componentItemsByComponentId.value = {};
    }
  } catch (error) {
    console.error("Error fetching component items:", error);
    componentItemsByComponentId.value = {};
  } finally {
    componentItemsLoading.value = false;
  }
};

const fetchComponents = async (pageId) => {
  if (!pageId) {
    components.value = [];
    componentItemsByComponentId.value = {};
    componentListFull.value = [];
    return;
  }
  try {
    componentsLoading.value = true;
    const { data } = await useFetch("/api/component-editor", {
      method: "GET",
      query: { pageId, raw: true },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      components.value = data.value.data || [];
      componentListFull.value = data.value.data || [];
    } else {
      components.value = [];
      componentListFull.value = [];
      console.error("Failed to fetch components", data.value);
    }
    // Load component items separately; errors are handled inside fetchComponentItems
    await fetchComponentItems(pageId);
  } catch (error) {
    console.error("Error fetching components:", error);
    components.value = [];
    componentListFull.value = [];
  } finally {
    componentsLoading.value = false;
  }
};

const handleSelectPage = (page) => {
  selectedPage.value = page;
  fetchComponents(page?.id);
};

// Shared function to show context menu
const showPageContextMenu = (event, page) => {
  event.preventDefault();
  event.stopPropagation();
  
  contextMenuPageId.value = page.id;
  
  // Position menu near cursor/icon, but adjust if it would go off-screen
  const menuWidth = 120; // Approximate menu width
  const menuHeight = 120; // Approximate menu height
  let x = event.clientX;
  let y = event.clientY;
  
  // Adjust horizontal position if menu would overflow right edge
  if (x + menuWidth > window.innerWidth) {
    x = window.innerWidth - menuWidth - 10;
  }
  
  // Adjust vertical position if menu would overflow bottom edge
  if (y + menuHeight > window.innerHeight) {
    y = window.innerHeight - menuHeight - 10;
  }
  
  // Ensure menu doesn't go off left or top edges
  x = Math.max(10, x);
  y = Math.max(10, y);
  
  contextMenuPosition.value = { x, y };
  contextMenuVisible.value = true;
};

// Context menu handler for right-click
const handlePageContextMenu = (event, page) => {
  showPageContextMenu(event, page);
};

// Click handler for left-click
const handlePageMenuClick = (event, page) => {
  showPageContextMenu(event, page);
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
  contextMenuPageId.value = null;
};

// View function - opens page modal in view mode
const handlePageView = (pageId) => {
  closeContextMenu();
  
  const page = pages.value.find((p) => p.id === pageId);
  if (!page) {
    $swal.fire({
      title: "Error",
      text: "Page not found",
      icon: "error",
    });
    return;
  }
  
  isPageViewMode.value = true;
  isPageEditMode.value = false;
  editingPageId.value = page.id;
  pageForm.value = {
    pageTitle: page.title || "",
    menu: page.menu || "",
    status: page.status || "ACTIVE",
  };
  showPageModal.value = true;
};

// Edit function - opens page modal in edit mode
const handlePageEdit = (pageId) => {
  closeContextMenu();
  
  const page = pages.value.find((p) => p.id === pageId);
  if (!page) {
    $swal.fire({
      title: "Error",
      text: "Page not found",
      icon: "error",
    });
    return;
  }
  
  isPageEditMode.value = true;
  isPageViewMode.value = false;
  editingPageId.value = page.id;
  pageForm.value = {
    pageTitle: page.title || "",
    menu: page.menu || "",
    status: page.status || "ACTIVE",
  };
  // Refresh available menus (exclude current page ID so its menu is available)
  fetchAvailableMenus(page.id);
  showPageModal.value = true;
};

// Delete function - shows confirmation and deletes the page
const handlePageDelete = async (pageId) => {
  closeContextMenu();
  
  const page = pages.value.find((p) => p.id === pageId);
  if (!page) {
    $swal.fire({
      title: "Error",
      text: "Page not found",
      icon: "error",
    });
    return;
  }
  
  // Check if page has components before allowing deletion
  try {
    const { data } = await useFetch("/api/component-editor", {
      method: "GET",
      query: { pageId, raw: true },
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const pageComponents = data.value.data || [];
      
      if (pageComponents.length > 0) {
        $swal.fire({
          title: "Cannot Delete",
          text: `Cannot delete page "${page.title}" because it has ${pageComponents.length} component(s) under it. Please delete all components first.`,
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  } catch (error) {
    console.error("Error checking components:", error);
    // Continue with deletion if check fails (to avoid blocking deletion due to API errors)
  }
  
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete page "${page.title}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;
      const response = await useFetch(`/api/page-editor/${pageId}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Page has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchPages();
        await fetchAvailableMenus();
        
        // Clear selected page if it was deleted
        if (selectedPage.value?.id === pageId) {
          selectedPage.value = null;
          components.value = [];
          componentItemsByComponentId.value = {};
        }
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete page",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting page",
        icon: "error",
      });
    } finally {
      loading.value = false;
    }
  }
};

const handleOpenComponentEditor = () => {
  if (!selectedPage.value) return;
  if (process.client) {
    sessionStorage.setItem(
      "componentEditorPageId",
      JSON.stringify({
        pageId: selectedPage.value.id,
        timestamp: Date.now(),
      })
    );
  }
  navigateTo("/pageeditor/component-editor");
};

// Page Generator handler - functionality to be implemented later
const handlePageGenerator = () => {
  if (!selectedPage.value) return;
  // TODO: Implement Page Generator functionality
  console.log("Page Generator clicked for page:", selectedPage.value.id);
  $swal.fire({
    title: "Page Generator",
    text: "Page Generator functionality will be implemented",
    icon: "info",
  });
};

const handleViewPage = () => {
  if (!selectedPage.value) return;
  $swal.fire({
    title: selectedPage.value.title,
    text: selectedPage.value.menu || "No menu assigned",
    icon: "info",
  });
};

// View Component - fetch and display in read-only mode
const handleViewComponent = async (component) => {
  try {
    // Ensure componentTypeOptions is loaded
    if (componentTypeOptions.value.length === 0) {
      await loadComponentTypes();
    }
    
    isViewMode.value = true;
    isEditMode.value = false;
    editingId.value = component.id;
    
    // Fetch full component data including queryMapping and componentData
    const { data } = await useFetch(`/api/component-editor?id=${component.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponent = data.value.data;
      componentForm.value = {
        title: fullComponent.title || "",
        name: fullComponent.name || "",
        cssClass: fullComponent.cssClass || "",
        type: fullComponent.type || "custom",
        collapseEnable: fullComponent.collapseEnable === 1 || fullComponent.collapseEnable === true,
        collapseByDefault: fullComponent.collapseByDefault === 1 || fullComponent.collapseByDefault === true,
        visible: fullComponent.visible === 1 || fullComponent.visible === true,
        active: fullComponent.active === 1 || fullComponent.active === true,
        order: fullComponent.order || 1,
        queryMapping: fullComponent.queryMapping || "",
      };
      showComponentModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component for viewing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component data",
      icon: "error",
    });
  }
};

// Edit Component - fetch and display in edit mode
const handleEditComponent = async (component) => {
  try {
    // If component is datatable, navigate to datatable editor page without exposing params in URL
    if (component?.type === "datatable") {
      if (!selectedPage.value) {
        $swal.fire({
          title: "Warning",
          text: "Please select a page first",
          icon: "warning",
        });
        return;
      }
      if (process.client) {
        sessionStorage.setItem(
          "datatableEditorComponent",
          JSON.stringify({
            componentId: component.id,
            pageId: selectedPage.value.id,
            timestamp: Date.now(),
          })
        );
      }
      await navigateTo("/pageeditor/datatable-editor");
      return;
    }

    // Ensure componentTypeOptions is loaded
    if (componentTypeOptions.value.length === 0) {
      await loadComponentTypes();
    }
    
    isEditMode.value = true;
    isViewMode.value = false;
    editingId.value = component.id;
    
    // Fetch full component data including queryMapping and componentData
    const { data } = await useFetch(`/api/component-editor?id=${component.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponent = data.value.data;
      componentForm.value = {
        title: fullComponent.title || "",
        name: fullComponent.name || "",
        cssClass: fullComponent.cssClass || "",
        type: fullComponent.type || "custom",
        collapseEnable: fullComponent.collapseEnable === 1 || fullComponent.collapseEnable === true,
        collapseByDefault: fullComponent.collapseByDefault === 1 || fullComponent.collapseByDefault === true,
        visible: fullComponent.visible === 1 || fullComponent.visible === true,
        active: fullComponent.active === 1 || fullComponent.active === true,
        order: fullComponent.order || 1,
        queryMapping: fullComponent.queryMapping || "",
      };
      showComponentModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component for editing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component data",
      icon: "error",
    });
  }
};

// Save Component
const handleSaveComponent = async () => {
  // Validation
  if (!componentForm.value.title || !componentForm.value.name || componentForm.value.active === null || componentForm.value.active === undefined) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Title, Name, and Active)",
      icon: "warning",
    });
    return;
  }

  if (!selectedPage.value) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }

  try {
    componentsLoading.value = true;
    let response;

    const formData = {
      ...componentForm.value,
      pageId: selectedPage.value.id,
      collapseEnable: componentForm.value.collapseEnable ? 1 : 0,
      collapseByDefault: componentForm.value.collapseByDefault ? 1 : 0,
      visible: componentForm.value.visible ? 1 : 0,
      active: componentForm.value.active ? 1 : 0,
      queryMapping: componentForm.value.queryMapping || "",
    };

    if (isEditMode.value && editingId.value) {
      // Update existing record
      response = await useFetch(`/api/component-editor/${editingId.value}`, {
        method: "PUT",
        body: formData,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/component-editor", {
        method: "POST",
        body: formData,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isEditMode.value ? "Component updated successfully" : "Component created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchComponents(selectedPage.value.id);
      
      // Reset form and close modal
      showComponentModal.value = false;
      componentForm.value = {
        title: "",
        name: "",
        cssClass: "",
        type: "custom",
        collapseEnable: false,
        collapseByDefault: false,
        visible: true,
        active: true,
        order: 1,
        queryMapping: "",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save component",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving component:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving component",
      icon: "error",
    });
  } finally {
    componentsLoading.value = false;
  }
};

// Cancel Component form
const handleCancelComponent = () => {
  showComponentModal.value = false;
  isViewMode.value = false;
  isEditMode.value = false;
  componentForm.value = {
    title: "",
    name: "",
    cssClass: "",
    type: "custom",
    collapseEnable: false,
    collapseByDefault: false,
    visible: true,
    active: true,
    order: 1,
    queryMapping: "",
  };
};

// Get available components for selected page (for component item dropdown)
const getAvailableComponents = computed(() => {
  if (!selectedPage.value) return [];
  return componentListFull.value
    .filter((c) => parseInt(c.pageId) === parseInt(selectedPage.value.id))
    .map((c) => ({
      label: c.name,
      value: parseInt(c.id) || c.id,
    }));
});

// Load component item types from lookup.json
const loadComponentItemTypes = async () => {
  try {
    const lookupData = await import("~/assets/json/lookup.json");
    const data = lookupData.default || lookupData;
    if (data?.ComponentItemType) {
      componentItemTypeOptions.value = data.ComponentItemType.map((item) => ({
        label: item.name,
        value: item.name,
      }));
    }
  } catch (error) {
    console.error("Error loading component item types:", error);
    // Fallback: hardcode the types
    componentItemTypeOptions.value = [
      { label: "textfield", value: "textfield" },
      { label: "radiobutton", value: "radiobutton" },
      { label: "checkbox", value: "checkbox" },
      { label: "datepicker", value: "datepicker" },
      { label: "dropdown", value: "dropdown" },
      { label: "textarea", value: "textarea" },
      { label: "fileupload", value: "fileupload" },
      { label: "html", value: "html" },
      { label: "iframe", value: "iframe" },
      { label: "button", value: "button" },
      { label: "link", value: "link" },
      { label: "image", value: "image" },
      { label: "video", value: "video" },
      { label: "audio", value: "audio" },
      { label: "map", value: "map" },
    ];
  }
};

// Load component types from lookup.json
const loadComponentTypes = async () => {
  try {
    const lookupData = await import("~/assets/json/lookup.json");
    const data = lookupData.default || lookupData;
    if (data?.ComponentType) {
      componentTypeOptions.value = data.ComponentType.map((item) => ({
        label: item.name,
        value: item.name,
      }));
    }
  } catch (error) {
    console.error("Error loading component types:", error);
    // Fallback: try $fetch
    try {
      const lookupData = await $fetch("/assets/json/lookup.json");
      if (lookupData?.ComponentType) {
        componentTypeOptions.value = lookupData.ComponentType.map((item) => ({
          label: item.name,
          value: item.name,
        }));
      }
    } catch (fallbackError) {
      console.error("Error loading component types (fallback):", fallbackError);
      // Last resort: hardcode the types from lookup.json
      componentTypeOptions.value = [
        { label: "form_1_col", value: "form_1_col" },
        { label: "form_TopFilter", value: "form_TopFilter" },
        { label: "form_SmartFilter", value: "form_SmartFilter" },
        { label: "form_PopupModal", value: "form_PopupModal" },
        { label: "datatable", value: "datatable" },
      ];
    }
  }
};

// View Component Item - fetch and display in read-only mode
const handleViewComponentItem = async (item) => {
  try {
    isComponentItemViewMode.value = true;
    isComponentItemEditMode.value = false;
    editingComponentItemId.value = item.id;
    
    // Fetch full component item data
    const { data } = await useFetch(`/api/component-item-editor?id=${item.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponentItem = data.value.data;
      componentItemForm.value = {
        name: fullComponentItem.name || "",
        title: fullComponentItem.title || "",
        component: fullComponentItem.component || "",
        componentId: fullComponentItem.componentId || null,
        type: fullComponentItem.type || "",
        cssClass: fullComponentItem.cssClass || "",
        additionalAttribute: fullComponentItem.additionalAttribute || "",
        defaultValue: fullComponentItem.defaultValue || "",
        lookup_queryMapping: fullComponentItem.lookup_queryMapping || "",
        visible: fullComponentItem.visible === 1 || fullComponentItem.visible === true,
        active: fullComponentItem.active === 1 || fullComponentItem.active === true,
        order: fullComponentItem.order || 1,
      };
      showComponentItemModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component item data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component item for viewing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component item data",
      icon: "error",
    });
  }
};

// Edit Component Item - fetch and display in edit mode
const handleEditComponentItem = async (item) => {
  try {
    isComponentItemEditMode.value = true;
    isComponentItemViewMode.value = false;
    editingComponentItemId.value = item.id;
    
    // Ensure componentListFull is populated
    if (componentListFull.value.length === 0 && selectedPage.value) {
      const { data: rawData } = await useFetch(`/api/component-editor?pageId=${selectedPage.value.id}&raw=true`, {
        method: "GET",
        initialCache: false,
      });
      if (rawData.value?.statusCode === 200) {
        componentListFull.value = rawData.value.data || [];
      }
    }
    
    // Ensure componentItemTypeOptions is loaded
    if (componentItemTypeOptions.value.length === 0) {
      await loadComponentItemTypes();
    }
    
    // Fetch full component item data
    const { data } = await useFetch(`/api/component-item-editor?id=${item.id}`, {
      method: "GET",
      initialCache: false,
    });

    if (data.value?.statusCode === 200) {
      const fullComponentItem = data.value.data;
      componentItemForm.value = {
        name: fullComponentItem.name || "",
        title: fullComponentItem.title || "",
        component: fullComponentItem.component || "",
        componentId: fullComponentItem.componentId || null,
        type: fullComponentItem.type || "",
        cssClass: fullComponentItem.cssClass || "",
        additionalAttribute: fullComponentItem.additionalAttribute || "",
        defaultValue: fullComponentItem.defaultValue || "",
        lookup_queryMapping: fullComponentItem.lookup_queryMapping || "",
        visible: fullComponentItem.visible === 1 || fullComponentItem.visible === true,
        active: fullComponentItem.active === 1 || fullComponentItem.active === true,
        order: fullComponentItem.order || 1,
      };
      showComponentItemModal.value = true;
    } else {
      $swal.fire({
        title: "Error",
        text: data.value?.message || "Failed to fetch component item data",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error fetching component item for editing:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while fetching component item data",
      icon: "error",
    });
  }
};

// Save Component Item
const handleSaveComponentItem = async () => {
  // Validation
  if (!componentItemForm.value.title || !componentItemForm.value.name || componentItemForm.value.active === null || componentItemForm.value.active === undefined) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields (Title, Name, and Active)",
      icon: "warning",
    });
    return;
  }

  if (!selectedPage.value) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }

  // Validation - componentId should be set directly from dropdown
  // Wait for next tick to ensure v-model has updated
  await nextTick();
  
  // Debug: Check available components
  const availableComponents = getAvailableComponents.value;
  if (availableComponents.length === 0) {
    $swal.fire({
      title: "Error",
      text: "No components available for the selected page. Please ensure components exist for this page.",
      icon: "error",
    });
    return;
  }
  
  // Normalize componentId to integer (FormKit might return string)
  if (componentItemForm.value.componentId) {
    componentItemForm.value.componentId = parseInt(componentItemForm.value.componentId) || componentItemForm.value.componentId;
  }
  
  // Check if componentId is set (could be 0, so check for null/undefined/empty string specifically)
  if (!componentItemForm.value.componentId && componentItemForm.value.componentId !== 0) {
    $swal.fire({
      title: "Validation Error",
      text: "Please select a component from the dropdown",
      icon: "warning",
    });
    return;
  }
  
  // Ensure component name is set if componentId is set
  if (componentItemForm.value.componentId && !componentItemForm.value.component) {
    const selectedComponent = componentListFull.value.find((c) => parseInt(c.id) === parseInt(componentItemForm.value.componentId));
    if (selectedComponent) {
      componentItemForm.value.component = selectedComponent.name;
    }
  }

  try {
    componentItemsLoading.value = true;
    let response;

    const formData = {
      name: componentItemForm.value.name,
      title: componentItemForm.value.title,
      component: componentItemForm.value.component || "",
      componentId: componentItemForm.value.componentId,
      type: componentItemForm.value.type || "",
      cssClass: componentItemForm.value.cssClass || "",
      additionalAttribute: componentItemForm.value.additionalAttribute || "",
      defaultValue: componentItemForm.value.defaultValue || "",
      lookup_queryMapping: componentItemForm.value.lookup_queryMapping || "",
      visible: componentItemForm.value.visible ? 1 : 0,
      active: componentItemForm.value.active ? 1 : 0,
      order: componentItemForm.value.order || 1,
      pageId: selectedPage.value.id,
    };

    if (isComponentItemEditMode.value && editingComponentItemId.value) {
      // Update existing record
      response = await useFetch(`/api/component-item-editor/${editingComponentItemId.value}`, {
        method: "PUT",
        body: formData,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/component-item-editor", {
        method: "POST",
        body: formData,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isComponentItemEditMode.value ? "Component Item updated successfully" : "Component Item created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchComponentItems(selectedPage.value.id);
      
      // Reset form and close modal
      showComponentItemModal.value = false;
      componentItemForm.value = {
        name: "",
        title: "",
        component: "",
        componentId: null,
        type: "",
        cssClass: "",
        additionalAttribute: "",
        defaultValue: "",
        lookup_queryMapping: "",
        visible: true,
        active: true,
        order: 1,
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save component item",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving component item:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving component item",
      icon: "error",
    });
  } finally {
    componentItemsLoading.value = false;
  }
};

// Cancel Component Item form
const handleCancelComponentItem = () => {
  showComponentItemModal.value = false;
  isComponentItemViewMode.value = false;
  isComponentItemEditMode.value = false;
  componentItemForm.value = {
    name: "",
    title: "",
    component: "",
    componentId: null,
    type: "",
    cssClass: "",
    additionalAttribute: "",
    defaultValue: "",
    lookup_queryMapping: "",
    visible: true,
    active: true,
    order: 1,
  };
};

// Add Page function
const handleAddPage = () => {
  isPageEditMode.value = false;
  isPageViewMode.value = false;
  editingPageId.value = null;
  pageForm.value = {
    pageTitle: "",
    menu: "",
    status: "ACTIVE",
  };
  // Refresh available menus
  fetchAvailableMenus();
  showPageModal.value = true;
};

// Save Page
const handleSavePage = async () => {
  // Validation
  if (!pageForm.value.pageTitle || !pageForm.value.status) {
    $swal.fire({
      title: "Validation Error",
      text: "Please fill in all required fields",
      icon: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    let response;

    if (isPageEditMode.value && editingPageId.value) {
      // Update existing record
      response = await useFetch(`/api/page-editor/${editingPageId.value}`, {
        method: "PUT",
        body: pageForm.value,
        initialCache: false,
      });
    } else {
      // Add new record
      response = await useFetch("/api/page-editor", {
        method: "POST",
        body: pageForm.value,
        initialCache: false,
      });
    }

    if (response.data.value?.statusCode === 200) {
      $swal.fire({
        title: "Success",
        text: isPageEditMode.value ? "Page updated successfully" : "Page created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh data from API
      await fetchPages();
      await fetchAvailableMenus();
      
      // Reset form and close modal
      showPageModal.value = false;
      pageForm.value = {
        pageTitle: "",
        menu: "",
        status: "ACTIVE",
      };
    } else {
      $swal.fire({
        title: "Error",
        text: response.data.value?.message || "Failed to save page",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error saving page:", error);
    $swal.fire({
      title: "Error",
      text: "An error occurred while saving page",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Cancel Page form
const handleCancelPage = () => {
  showPageModal.value = false;
  isPageViewMode.value = false;
  isPageEditMode.value = false;
  pageForm.value = {
    pageTitle: "",
    menu: "",
    status: "ACTIVE",
  };
};

// Add Component function - same as Component Editor
const handleAddComponent = async () => {
  if (!selectedPage.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }
  
  // Ensure componentTypeOptions is loaded
  if (componentTypeOptions.value.length === 0) {
    await loadComponentTypes();
  }
  
  isEditMode.value = false;
  isViewMode.value = false;
  editingId.value = null;
  componentForm.value = {
    title: "",
    name: "",
    cssClass: "",
    type: "custom",
    collapseEnable: false,
    collapseByDefault: false,
    visible: true,
    active: true,
    order: sortedComponents.value.length > 0 
      ? Math.max(...sortedComponents.value.map(c => c.order || 0)) + 1 
      : 1,
    queryMapping: "",
  };
  showComponentModal.value = true;
};

// Add Component Item function - same as Component Editor
const handleAddComponentItem = async (component) => {
  if (!selectedPage.value) {
    $swal.fire({
      title: "Warning",
      text: "Please select a page first",
      icon: "warning",
    });
    return;
  }
  
  // Ensure componentListFull is populated - always fetch to ensure fresh data
  try {
    const { data: rawData } = await useFetch(`/api/component-editor?pageId=${selectedPage.value.id}&raw=true`, {
      method: "GET",
      initialCache: false,
    });
    if (rawData.value?.statusCode === 200) {
      componentListFull.value = rawData.value.data || [];
    } else {
      componentListFull.value = [];
    }
  } catch (error) {
    console.error("Error fetching components for dropdown:", error);
    componentListFull.value = [];
  }
  
  // Ensure componentItemTypeOptions is loaded
  if (componentItemTypeOptions.value.length === 0) {
    await loadComponentItemTypes();
  }
  
  // Get existing component items for this component to calculate order
  const existingItems = componentItemsByComponentId.value[component.id] || [];
  
  isComponentItemEditMode.value = false;
  isComponentItemViewMode.value = false;
  editingComponentItemId.value = null;
  componentItemForm.value = {
    name: "",
    title: "",
    component: component.name || "",
    componentId: component.id || null,
    type: "",
    cssClass: "",
    additionalAttribute: "",
    defaultValue: "",
    lookup_queryMapping: "",
    visible: true,
    active: true,
    order: existingItems.length > 0 
      ? Math.max(...existingItems.map(c => c.order || 0)) + 1 
      : 1,
  };
  showComponentItemModal.value = true;
};

// Delete Component Item
// Get datatable items from componentData for datatable type components
const getDatatableItems = (component) => {
  if (!component || component.type !== "datatable") return [];
  
  try {
    const componentData = component.componentData;
    if (!componentData) return [];
    
    const parsed = typeof componentData === "string" ? JSON.parse(componentData) : componentData;
    return parsed.dt_bm || [];
  } catch (error) {
    console.error("Error parsing componentData for datatable:", error);
    return [];
  }
};

const logDeleteConfirmationPrompt = async () => {
  try {
    const userId = userStore.username || "unknown";
    const userRole = Array.isArray(userStore.roles) ? userStore.roles.join(",") : userStore.roles || "";

    await $fetch("/api/message-log", {
      method: "POST",
      body: {
        mm_mesg_code: "TRX-CNF-002",
        mm_mesg_type: "CONFIRM",
        mm_mesg_category: "TRANSACTION",
        ml_user_id: userId,
        ml_user_role: userRole,
        ml_page_name: "Page Creator",
        ml_module_name: moduleName,
        ml_page_breadcrumb: pageBreadcrumbText,
      },
    });
  } catch (error) {
    console.error("Failed to log delete confirmation prompt:", error);
  }
};

const handleDeleteComponentItem = async (item) => {
  await logDeleteConfirmationPrompt();
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete component item "${item.name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      componentItemsLoading.value = true;
      const response = await useFetch(`/api/component-item-editor/${item.id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Component Item has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchComponentItems(selectedPage.value.id);
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete component item",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting component item:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting component item",
        icon: "error",
      });
    } finally {
      componentItemsLoading.value = false;
    }
  }
};

// Delete Component - only allowed if there are no component items under it
const handleDeleteComponent = async (component) => {
  // Check if there are component items under this component
  const componentItems = componentItemsByComponentId.value[component.id] || [];
  
  if (componentItems.length > 0) {
    $swal.fire({
      title: "Cannot Delete",
      text: `Cannot delete component "${component.name || component.title}" because it has ${componentItems.length} component item(s) under it. Please delete all component items first.`,
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  const result = await $swal.fire({
    title: "Are you sure?",
    text: `Do you want to delete component "${component.name || component.title}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      componentsLoading.value = true;
      const response = await useFetch(`/api/component-editor/${component.id}`, {
        method: "DELETE",
        initialCache: false,
      });

      if (response.data.value?.statusCode === 200) {
        $swal.fire({
          title: "Deleted!",
          text: "Component has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh data from API
        await fetchComponents(selectedPage.value.id);
      } else {
        $swal.fire({
          title: "Error",
          text: response.data.value?.message || "Failed to delete component",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting component:", error);
      $swal.fire({
        title: "Error",
        text: "An error occurred while deleting component",
        icon: "error",
      });
    } finally {
      componentsLoading.value = false;
    }
  }
};

// Close context menu when clicking outside
onMounted(() => {
  fetchPages();
  fetchAvailableMenus();
  loadComponentItemTypes();
  loadComponentTypes();
  
  // Close context menu on outside click
  if (process.client) {
    document.addEventListener("click", closeContextMenu);
    document.addEventListener("contextmenu", (e) => {
      if (!contextMenuRef.value?.contains(e.target)) {
        closeContextMenu();
      }
    });
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", closeContextMenu);
    document.removeEventListener("contextmenu", closeContextMenu);
  }
});
</script>

<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Page Creator</div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Sidebar (Page List) -->
          <div class="col-span-1 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Page</label>
              <FormKit
                v-model="searchKeyword"
                type="text"
                placeholder="Search page title or menu..."
                outer-class="mb-0 flex-1"
              >
                <template #suffix>
                  <button
                    v-if="searchKeyword"
                    type="button"
                    @click="searchKeyword = ''"
                    class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Icon name="material-symbols:close" class="!w-4 !h-4 text-gray-500" />
                  </button>
                </template>
              </FormKit>
            </div>

            <div class="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <div class="px-4 py-2 text-xs font-semibold uppercase text-gray-500 border-b dark:border-gray-700 flex items-center justify-between">
                <span>Pages</span>
                <button
                  @click="handlePageSort"
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title="Sort pages"
                >
                  <Icon
                    v-if="pageSortOrder === 'asc'"
                    name="carbon:chevron-sort-up"
                    size="1.25rem"
                    class="opacity-50"
                  />
                  <Icon
                    v-else
                    name="carbon:chevron-sort-down"
                    size="1.25rem"
                    class="opacity-50"
                  />
                </button>
              </div>

              <div v-if="loading" class="p-4 text-center text-sm text-gray-500">Loading pages...</div>
              <div v-else-if="filteredPages.length === 0" class="p-4 text-center text-sm text-gray-500">
                No pages found
              </div>
              <div v-else class="max-h-[540px] overflow-y-auto relative">
                <div
                  v-for="page in filteredPages"
                  :key="page.id"
                  class="relative group"
                >
                  <button
                    @click="handleSelectPage(page)"
                    class="w-full text-left px-4 py-3 border-b last:border-b-0 dark:border-gray-700 hover:bg-primary/10 transition pr-10"
                    :class="{
                      'bg-primary/10 border-primary text-primary': selectedPage?.id === page.id,
                    }"
                  >
                    <div class="text-sm font-semibold">{{ page.title }}</div>
                    <div class="text-xs text-gray-500">{{ page.menu || 'No menu assigned' }}</div>
                    <div class="mt-1 flex items-center justify-between">
                      <span
                        class="inline-block px-2 py-0.5 rounded text-[11px]"
                        :class="{
                          'bg-green-100 text-green-700': page.status === 'ACTIVE',
                          'bg-red-100 text-red-700': page.status !== 'ACTIVE',
                        }"
                      >
                        {{ page.status || 'UNKNOWN' }}
                      </span>
                    </div>
                  </button>
                  <button
                    @click.stop="handlePageMenuClick($event, page)"
                    @contextmenu.prevent="handlePageContextMenu($event, page)"
                    class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                    title="Page options"
                  >
                    <Icon
                      name="material-symbols:more-vert"
                      class="text-gray-600 dark:text-gray-400"
                      size="18"
                    />
                  </button>
                </div>
                
                <!-- Context Menu -->
                <div
                  v-if="contextMenuVisible"
                  ref="contextMenuRef"
                  class="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]"
                  :style="{
                    left: contextMenuPosition.x + 'px',
                    top: contextMenuPosition.y + 'px',
                  }"
                  @click.stop
                >
                  <button
                    @click="handlePageView(contextMenuPageId)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Icon name="material-symbols:visibility" size="16" />
                    View
                  </button>
                  <button
                    @click="handlePageEdit(contextMenuPageId)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Icon name="material-symbols:edit" size="16" />
                    Edit
                  </button>
                  <button
                    @click="handlePageDelete(contextMenuPageId)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Icon name="material-symbols:delete" size="16" />
                    Delete
                  </button>
                </div>
              </div>
              <div class="flex justify-end p-2 border-t dark:border-gray-700">
                <rs-button
                  size="sm"
                  variant="primary"
                  @click="handleAddPage"
                >
                  <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                  Add
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Detail Panel -->
          <div class="col-span-1 lg:col-span-2">
            <div class="border rounded-lg bg-white dark:bg-gray-900 shadow-sm h-full flex flex-col">
              <div class="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
                <div>
                  <div class="text-lg font-semibold">
                    {{ selectedPage?.title || 'Select a page' }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ selectedPage?.menu || 'No menu assigned' }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <rs-button variant="secondary" size="sm" :disabled="!selectedPage" @click="handleViewPage">
                    <Icon name="material-symbols:visibility" class="mr-1" size="1rem" />
                    View
                  </rs-button>
                  <rs-button variant="primary" size="sm" :disabled="!selectedPage" @click="handleOpenComponentEditor">
                    <Icon name="tdesign:system-components" class="mr-1" size="1rem" />
                    Component Editor
                  </rs-button>
                  <rs-button variant="info" size="sm" :disabled="!selectedPage" @click="handlePageGenerator">
                    <Icon name="material-symbols:auto-awesome" class="mr-1" size="1rem" />
                    Page Generator
                  </rs-button>
                </div>
              </div>

              <div class="p-4 flex-1 flex flex-col gap-4">
                <div class="border rounded-lg p-3 h-full bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-semibold">Component</div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">Detail view switches by selection</span>
                      <rs-button
                        size="xs"
                        variant="secondary"
                        class="!px-2"
                        @click="
                          collapsedAll = !collapsedAll;
                          collapsedIds = new Set(collapsedAll ? sortedComponents.map((c) => c.id) : []);
                        "
                      >
                        <Icon
                          :name="collapsedAll ? 'material-symbols:unfold-more-rounded' : 'material-symbols:unfold-less-rounded'"
                          size="1rem"
                          class="mr-1"
                        />
                        {{ collapsedAll ? 'Expand all' : 'Collapse all' }}
                      </rs-button>
                    </div>
                  </div>

                  <div v-if="!selectedPage" class="flex items-center justify-center h-32 text-sm text-gray-500">
                    Select a page to view its components
                  </div>

                  <div v-else>
                    <div v-if="componentsLoading" class="flex items-center justify-center h-32 text-sm text-gray-500">
                      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span class="ml-2">Loading components...</span>
                    </div>

                    <div v-else-if="sortedComponents.length === 0" class="flex flex-col items-center justify-center h-32 text-sm text-gray-500 gap-2">
                      <span>No components found for this page.</span>
                      <rs-button variant="primary" size="sm" @click="handleAddComponent" :disabled="!selectedPage">
                        <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                        Add Component
                      </rs-button>
                    </div>

                    <div v-else class="space-y-3">
                      <draggable
                        v-model="sortedComponents"
                        item-key="id"
                        handle=".drag-handle"
                        @end="handleComponentDragEnd"
                        class="space-y-3"
                      >
                        <template #item="{ element: comp, index: idx }">
                          <div
                            :key="comp.id || idx"
                            class="border rounded-lg bg-white dark:bg-gray-900"
                          >
                        <div
                          class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <div class="drag-handle cursor-move flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click.stop>
                            <Icon name="material-symbols:drag-handle" size="20" />
                          </div>
                          <div 
                            class="flex-1 cursor-pointer"
                            @click="
                              collapsedIds = new Set(
                                collapsedIds.has(comp.id)
                                  ? [...collapsedIds].filter((x) => x !== comp.id)
                                  : [...collapsedIds, comp.id]
                              )
                            "
                          >
                            <div class="flex items-center gap-2">
                              <div class="font-semibold text-sm">{{ comp.title || comp.name || 'Untitled component' }}</div>
                              <span class="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                {{ comp.type || 'custom' }}
                              </span>
                              <span
                                class="text-[11px] px-2 py-0.5 rounded"
                                :class="{
                                  'bg-green-100 text-green-700': comp.active !== 0,
                                  'bg-gray-200 text-gray-600': comp.active === 0,
                                }"
                              >
                                {{ comp.active === 0 ? 'Inactive' : 'Active' }}
                              </span>
                              <span
                                class="text-[11px] px-2 py-0.5 rounded"
                                :class="{
                                  'bg-green-50 text-green-700': comp.visible !== 0,
                                  'bg-gray-100 text-gray-600': comp.visible === 0,
                                }"
                              >
                                {{ comp.visible === 0 ? 'Hidden' : 'Visible' }}
                              </span>
                              <span class="text-[11px] px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold">
                                Order: {{ comp.order || 0 }}
                              </span>
                              <Icon
                                :name="collapsedIds.has(comp.id) ? 'material-symbols:unfold-more-rounded' : 'material-symbols:unfold-less-rounded'"
                                size="1rem"
                                class="text-gray-500 ml-1"
                              />
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <rs-button variant="secondary" size="sm" @click.stop="handleViewComponent(comp)">
                              <Icon name="material-symbols:visibility" class="mr-1" size="1rem" />
                              View
                            </rs-button>
                            <rs-button variant="secondary" size="sm" @click.stop="handleEditComponent(comp)">
                              <Icon name="material-symbols:edit" class="mr-1" size="1rem" />
                              Edit
                            </rs-button>
                            <rs-button variant="danger" size="sm" @click.stop="handleDeleteComponent(comp)">
                              <Icon name="material-symbols:delete" class="mr-1" size="1rem" />
                              Delete
                            </rs-button>
                          </div>
                        </div>

                        <div v-if="!collapsedIds.has(comp.id)" class="px-3 pb-3 text-xs text-gray-600 dark:text-gray-300">
                          <div class="mt-1 font-semibold">Component Items</div>
                          <div v-if="componentItemsLoading" class="text-gray-500 italic mt-1">Loading items...</div>
                          
                          <!-- Datatable type: show dt_bm items without icons -->
                          <template v-else-if="comp.type === 'datatable'">
                            <ul
                              v-if="getDatatableItems(comp).length > 0"
                              class="mt-1 space-y-1"
                            >
                              <li
                                v-for="(item, itemIdx) in getDatatableItems(comp)"
                                :key="itemIdx"
                                class="p-2 rounded border bg-white dark:bg-gray-800"
                              >
                                <div class="flex items-center gap-2">
                                  <div class="flex-1">
                                    <div class="text-sm font-medium">
                                      <span v-html="item"></span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                            <div v-else class="mt-1 text-gray-500 italic">No datatable items found</div>
                          </template>
                          
                          <!-- Regular component items: show with icons -->
                          <template v-else>
                            <ul
                              v-if="componentItemsByComponentId[comp.id] && componentItemsByComponentId[comp.id].length"
                              class="mt-1 space-y-1"
                            >
                              <li
                                v-for="(item, itemIdx) in componentItemsByComponentId[comp.id]"
                                :key="item.id || itemIdx"
                                class="p-2 rounded border bg-white dark:bg-gray-800"
                              >
                                <div class="flex items-center justify-between gap-2">
                                  <div class="flex-1">
                                    <div class="flex items-center gap-2 text-sm font-medium">
                                      <span>{{ item.title || item.name || `Item ${itemIdx + 1}` }}</span>
                                      <span v-if="item.type" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px]">
                                        {{ item.type }}
                                      </span>
                                    </div>
                                    <div v-if="item.name" class="text-[11px] text-gray-500">Name: {{ item.name }}</div>
                                    <div v-if="item.order" class="text-[11px] text-gray-500">Order: {{ item.order }}</div>
                                    <div v-if="item.cssClass" class="text-[11px] text-gray-500">Class: {{ item.cssClass }}</div>
                                  </div>
                                  <div class="flex items-center gap-1">
                                    <button
                                      @click.stop="handleViewComponentItem(item)"
                                      class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                      title="View"
                                    >
                                      <Icon
                                        name="material-symbols:visibility"
                                        class="text-gray-600 dark:text-gray-400"
                                        size="18"
                                      />
                                    </button>
                                    <button
                                      @click.stop="handleEditComponentItem(item)"
                                      class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                      title="Edit"
                                    >
                                      <Icon
                                        name="material-symbols:edit"
                                        class="text-gray-600 dark:text-gray-400"
                                        size="18"
                                      />
                                    </button>
                                    <button
                                      @click.stop="handleDeleteComponentItem(item)"
                                      class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                                      title="Delete"
                                    >
                                      <Icon
                                        name="material-symbols:delete"
                                        class="text-red-600 dark:text-red-400"
                                        size="18"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            </ul>
                            <div v-else class="mt-1 text-gray-500 italic">No component items found</div>
                            <div class="flex justify-end mt-2">
                              <rs-button
                                size="xs"
                                variant="primary"
                                @click.stop="handleAddComponentItem(comp)"
                                class="!px-2"
                              >
                                <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                                Add
                              </rs-button>
                            </div>
                          </template>
                        </div>
                          </div>
                        </template>
                      </draggable>
                      <div class="flex justify-end mt-2">
                        <rs-button
                          size="sm"
                          variant="primary"
                          @click="handleAddComponent"
                          :disabled="!selectedPage"
                        >
                          <Icon name="material-symbols:add" class="mr-1" size="1rem" />
                          Add Component
                        </rs-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Add/Edit/View Component Modal -->
    <rs-modal
      v-model="showComponentModal"
      title="Component"
      size="lg"
      dialog-class="component-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
      :draggable="true"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg component-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isViewMode ? 'View Component' : (isEditMode ? 'Edit Component' : 'Add Component') }}
          </h4>
          <Icon
            @click="handleCancelComponent"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveComponent">
          <div class="space-y-2 py-2">
            <!-- Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.title"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Name -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Name<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.name"
                  type="text"
                  :disabled="isViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- CSS Class -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">CSS Class:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.cssClass"
                  type="text"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Type -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Type:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.type"
                  type="select"
                  :options="componentTypeOptions"
                  :disabled="isViewMode"
                  placeholder="Select a type"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Collapse Enable & Collapse By Default (side by side) -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Collapse Enable:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.collapseEnable"
                    :disabled="isViewMode"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Collapse By Default:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.collapseByDefault"
                    :disabled="isViewMode"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Visible & Active (side by side) -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Visible:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.visible"
                    :disabled="isViewMode"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 flex-1">
                <label class="w-32 text-xs font-medium">Active<span class="text-red-500">*</span>:</label>
                <div class="flex-1">
                  <input
                    type="checkbox"
                    v-model="componentForm.active"
                    :disabled="isViewMode"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Order -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Order:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.order"
                  type="number"
                  :disabled="isViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Query Mapping (only in edit/view mode) -->
            <div v-if="isEditMode || isViewMode" class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2">Query Mapping:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentForm.queryMapping"
                  type="textarea"
                  :disabled="isViewMode"
                  rows="5"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelComponent">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isViewMode" variant="primary" size="sm" @click="handleSaveComponent">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit/View Component Item Modal -->
    <rs-modal
      v-model="showComponentItemModal"
      title="Component Item"
      size="lg"
      dialog-class="component-item-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
      :draggable="true"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg component-item-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isComponentItemViewMode ? 'View Component Item' : (isComponentItemEditMode ? 'Edit Component Item' : 'Add Component Item') }}
          </h4>
          <Icon
            @click="handleCancelComponentItem"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSaveComponentItem">
          <div class="space-y-2 py-2">
            <!-- Name -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Name<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.name"
                  type="text"
                  :disabled="isComponentItemViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.title"
                  type="text"
                  :disabled="isComponentItemViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Component -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Component<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.componentId"
                  type="select"
                  :options="getAvailableComponents"
                  :disabled="isComponentItemViewMode"
                  placeholder="Select a component"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Type -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Type:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.type"
                  type="select"
                  :options="componentItemTypeOptions"
                  :disabled="isComponentItemViewMode"
                  placeholder="Select a type"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- CSS Class -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">CSS Class:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.cssClass"
                  type="text"
                  :disabled="isComponentItemViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Additional Attribute -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Additional Attribute:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.additionalAttribute"
                  type="text"
                  :disabled="isComponentItemViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Default Value -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Default Value:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.defaultValue"
                  type="text"
                  :disabled="isComponentItemViewMode"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Lookup Query Mapping -->
            <div class="flex items-start gap-2">
              <label class="w-32 text-xs font-medium pt-2">Lookup Query Mapping:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.lookup_queryMapping"
                  type="textarea"
                  :disabled="isComponentItemViewMode"
                  rows="5"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Visible -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Visible:</label>
              <div class="flex-1">
                <input
                  type="checkbox"
                  v-model="componentItemForm.visible"
                  :disabled="isComponentItemViewMode"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <!-- Active -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Active<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <input
                  type="checkbox"
                  v-model="componentItemForm.active"
                  :disabled="isComponentItemViewMode"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>

            <!-- Order -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Order:</label>
              <div class="flex-1">
                <FormKit
                  v-model="componentItemForm.order"
                  type="number"
                  :disabled="isComponentItemViewMode"
                  min="1"
                  outer-class="mb-0"
                />
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelComponentItem">
            {{ isComponentItemViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isComponentItemViewMode" variant="primary" size="sm" @click="handleSaveComponentItem">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Add/Edit Page Modal -->
    <rs-modal
      v-model="showPageModal"
      title="Page"
      size="lg"
      dialog-class="page-modal-custom"
      :overlay-close="true"
      :hide-footer="false"
      position="center"
      :draggable="true"
    >
      <template #header>
        <div class="flex items-center justify-between w-full bg-primary text-white px-3 py-2 rounded-t-lg page-modal-header">
          <h4 class="text-base font-semibold text-white">
            {{ isPageViewMode ? 'View Page' : (isPageEditMode ? 'Edit Page' : 'Add Page') }}
          </h4>
          <Icon
            @click="handleCancelPage"
            class="hover:text-gray-200 cursor-pointer text-white"
            name="ic:round-close"
            size="18"
          />
        </div>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSavePage">
          <div class="space-y-2 py-2">
            <!-- Page Title -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Page Title<span class="text-red-500">*</span>:</label>
              <div class="flex-1">
                <FormKit
                  v-model="pageForm.pageTitle"
                  type="text"
                  :disabled="isPageViewMode"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
              </div>
            </div>

            <!-- Menu (Select Dropdown) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Menu:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="pageForm.menu"
                  type="select"
                  :options="menuOptions"
                  :disabled="isPageViewMode"
                  placeholder="Select Menu"
                  outer-class="mb-0"
                />
                <button
                  v-if="pageForm.menu && !isPageViewMode"
                  type="button"
                  @click="pageForm.menu = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>

            <!-- Status (Dropdown) -->
            <div class="flex items-center gap-2">
              <label class="w-32 text-xs font-medium">Status<span class="text-red-500">*</span>:</label>
              <div class="flex-1 relative">
                <FormKit
                  v-model="pageForm.status"
                  type="select"
                  :options="[
                    { label: 'ACTIVE', value: 'ACTIVE' },
                    { label: 'INACTIVE', value: 'INACTIVE' },
                  ]"
                  :disabled="isPageViewMode"
                  placeholder="Select Status"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="mb-0"
                />
                <button
                  v-if="pageForm.status && !isPageViewMode"
                  type="button"
                  @click="pageForm.status = ''"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Icon
                    name="material-symbols:close"
                    class="!w-3 !h-3 text-gray-500"
                  />
                </button>
              </div>
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 py-2">
          <rs-button variant="danger" size="sm" @click="handleCancelPage">
            {{ isPageViewMode ? 'Close' : 'Cancel' }}
          </rs-button>
          <rs-button v-if="!isPageViewMode" variant="primary" size="sm" @click="handleSavePage">
            Save
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<style scoped>
.max-h-\[540px\] {
  max-height: 540px;
}
</style>

<style>
/* Custom width for Component modal */
.component-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.component-modal-custom .modal-header > :last-child:not(.component-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.component-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.component-modal-custom .component-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Custom width for Component Item modal */
.component-item-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.component-item-modal-custom .modal-header > :last-child:not(.component-item-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.component-item-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.component-item-modal-custom .component-item-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}

/* Custom width for Page modal */
.page-modal-custom {
  width: 600px !important;
}

/* Hide default close icon when custom header is used */
.page-modal-custom .modal-header > :last-child:not(.page-modal-header) {
  display: none !important;
}

/* Ensure custom header matches modal content width exactly */
.page-modal-custom .modal-header {
  padding: 0 !important;
  position: relative;
  overflow: hidden;
}

.page-modal-custom .page-modal-header {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
}
</style>