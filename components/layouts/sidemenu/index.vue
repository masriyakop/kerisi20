<script setup>
import Menu from "~/navigation/index.js";
import RSItem from "~/components/layouts/sidemenu/Item.vue";
import { useUserStore } from "~/stores/user";

// Use site settings composable
const { siteSettings } = useSiteSettings();
const userStore = useUserStore();

// Add computed to ensure logo reactivity
const logoToShow = computed(() => {
  if (siteSettings.value?.siteLogo && siteSettings.value.siteLogo.trim() !== '') {
    return siteSettings.value.siteLogo;
  }
  return '/img/logo/corradAF-logo.svg'; 
});

const siteNameToShow = computed(() => {
  return siteSettings.value.siteName || 'Kerisi';
});

// User info
const userName = computed(() => {
  return userStore.username || 'Admin';
});

const userInitials = computed(() => {
  if (userName.value) {
    const names = userName.value.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return userName.value.substring(0, 2).toUpperCase();
  }
  return 'AD';
});

const props = defineProps({
  menuItem: {
    type: Array,
    default: () => Menu,
    required: false,
  },
  sidebarToggle: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  try {
    const el = document.querySelector(".active-menu")?.closest(".wp-submenu");
    if (el) {
      const elParent = el.parentElement;
      if (elParent) {
        elParent.classList.add("wp-menu-open");
      }
    }
  } catch (e) {
    return;
  }
});
</script>

<template>
  <div class="wp-admin-menu">
    <!-- Navigation Menu -->
    <div class="wp-menu-scroll">
      <RSItem :items="menuItem"></RSItem>
    </div>
    
    <!-- Collapse Button - WordPress style -->
    <div class="wp-collapse-menu">
      <button class="wp-collapse-btn">
        <Icon name="dashicons:arrow-left-alt2" size="20" />
        <span>Collapse menu</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Light Compact Sidebar */
.wp-admin-menu {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}

.wp-menu-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
  margin: 0;
}

/* Custom scrollbar */
.wp-menu-scroll::-webkit-scrollbar {
  width: 4px;
}

.wp-menu-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.wp-menu-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.wp-menu-scroll::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Collapse Button */
.wp-collapse-menu {
  border-top: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.wp-collapse-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 10px;
  color: #6b7280;
  font-size: 11px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.1s;
}

.wp-collapse-btn:hover {
  color: #2563eb;
}

.wp-collapse-btn span {
  font-size: 11px;
}
</style>
