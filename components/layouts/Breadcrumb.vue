<script setup>
const route = useRoute();

// Get breadcrumb from page meta
const breadcrumb = computed(() => {
  let breadcrumb = null;
  const matched = route.matched;

  console.log("matched:", matched);

  if (matched[matched.length - 1].meta?.breadcrumb) {
    breadcrumb = matched[matched.length - 1].meta.breadcrumb;
  } else {
    // if no breadcrumb in page meta, get breadcrumb from route matched
    breadcrumb = matched.map((item) => {
      return {
        name: item.name,
        path: item.path,
      };
    });

    return breadcrumb;
  }

  // if type current overwrite path to its own path
  if (breadcrumb) {
    breadcrumb.forEach((item) => {
      if (item.type == "current") {
        item.path = route.path;
      } else if (item.type == "parent") {
        item.path = route.path.split("/").slice(0, -item.parentNo).join("/");
      }
    });
  }
  return breadcrumb;
});

console.log("breadcrumb", breadcrumb);

// Get title from page meta
const title = computed(() => {
  const matched = route.matched;
  const title = matched[matched.length - 1].name;
  return title;
});

// Check if current page is under System Admin or System Administration
const isSystemAdminPage = computed(() => {
  if (!breadcrumb.value) return false;
  
  // Check if any breadcrumb item has "System Admin" or "System Administration" in name
  const hasSystemAdmin = breadcrumb.value.some(item => 
    item.name === "System Admin" || 
    item.name === "System Administration" ||
    item.name?.toLowerCase().includes("system admin") ||
    item.name?.toLowerCase().includes("system administration")
  );
  
  // Check if route path starts with /devtool or /pageeditor
  const isSystemPath = route.path.startsWith('/devtool') || 
                       route.path.startsWith('/pageeditor') ||
                       route.path.startsWith('/page-editor');
  
  return hasSystemAdmin || isSystemPath;
});

// Menu dropdown state
const showPageMenu = ref(false);
const menuButtonRef = ref(null);

// Toggle menu
const togglePageMenu = () => {
  showPageMenu.value = !showPageMenu.value;
};

// Close menu when clicking outside
const handleClickOutside = (e) => {
  if (menuButtonRef.value && !menuButtonRef.value.contains(e.target)) {
    showPageMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Handle Page Editor click
const handlePageEditor = () => {
  showPageMenu.value = false;
  // Navigate to Page Creator with current route path as menu parameter
  const currentMenu = route.path;
  navigateTo(`/page-creator?menu=${encodeURIComponent(currentMenu)}`);
};

async function navigateMenu(path) {
  try {
    await navigateTo(path);
  } catch (e) {
    return;
  }
}
</script>

<template>
  <div v-if="breadcrumb" class="mb-6">
    <div class="flex items-center justify-between">
      <nav aria-label="Breadcrumb" class="flex-1">
        <ol class="flex items-center text-sm">
          <li class="flex items-center">
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
              <Icon name="mdi:home" size="16" />
            </NuxtLink>
          </li>
          <li v-for="(item, index) in breadcrumb" :key="index" class="flex items-center">
            <Icon
              name="mdi:chevron-right"
              size="16"
              class="mx-2 text-gray-400"
              aria-hidden="true"
            />
            <a
              @click="navigateMenu(item.path)"
              class="cursor-pointer capitalize"
              :class="{
                'text-gray-500 hover:text-gray-700': index !== breadcrumb.length - 1,
                'text-primary font-medium': index === breadcrumb.length - 1,
              }"
              :aria-current="index === breadcrumb.length - 1 ? 'page' : undefined"
            >
              {{ item.name }}
            </a>
          </li>
        </ol>
      </nav>

      <!-- 3-dot vertical menu icon -->
      <div class="relative ml-4" ref="menuButtonRef">
        <button
          @click="togglePageMenu"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Page menu"
        >
          <Icon
            name="material-symbols:more-vert"
            size="20"
            class="text-gray-600 dark:text-gray-400"
          />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showPageMenu"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
        >
          <div class="py-1">
            <button
              @click="handlePageEditor"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Icon name="material-symbols:edit" size="18" />
              Page Editor
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">{{ title }}</h1>
      <slot name="right"></slot>
    </div> -->
  </div>
</template>
