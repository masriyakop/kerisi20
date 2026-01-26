<script setup>
import Menu from "~/navigation/index.js";
import RSItem from "~/components/layouts/sidemenu/Item.vue";
import { useUserStore } from "~/stores/user";

// Use site settings composable
const { siteSettings } = useSiteSettings();
const userStore = useUserStore();

// Add computed to ensure logo reactivity
const logoToShow = computed(() => {
  // Always try to use the siteLogo from settings first
  if (siteSettings.value?.siteLogo && siteSettings.value.siteLogo.trim() !== '') {
    return siteSettings.value.siteLogo;
  }
  // Fallback to default logo if siteLogo is not set
  return '/img/logo/corradAF-logo.svg'; 
});

const siteNameToShow = computed(() => {
  return siteSettings.value.siteName || 'Kerisi Lite';
});

// User info
const userName = computed(() => {
  return userStore.username || 'John Doe';
});

const userEmail = computed(() => {
  // Try to get email from user store or use username as fallback
  return userStore.email || (userStore.username ? `${userStore.username}@example.com` : 'user@example.com');
});

const userInitials = computed(() => {
  if (userName.value) {
    const names = userName.value.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return userName.value.substring(0, 2).toUpperCase();
  }
  return 'JD';
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
    const el = document.querySelector(".active-menu")?.closest(".menu-content");
    if (el) {
      const elParent = el.parentElement.parentElement;
      if (elParent) {
        elParent.classList.remove("hide");
        elParent.querySelector("a")?.classList.add("nav-open");
      }
      el.classList.remove("hide");
    }
  } catch (e) {
    // console.log(e);
    return;
  }
});
</script>

<template>
  <div class="vertical-menu flex flex-col h-screen" style="background-color: rgb(var(--bg-1));">
    <!-- Logo Header -->
    <div class="px-4 py-3 border-b" style="border-color: rgb(var(--border-color));">
      <nuxt-link to="/" class="block">
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <div class="w-9 h-9 bg-gray-900 rounded flex items-center justify-center">
              <img
                v-if="logoToShow && logoToShow !== '/img/logo/corradAF-logo.svg'"
                :src="logoToShow"
                class="logo h-6 w-6 object-contain"
                alt="logo"
                @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
              />
              <span v-else class="text-white font-bold text-lg">K</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="title-text app-title font-bold text-base leading-tight" style="color: rgb(var(--text-color));">
              {{ siteNameToShow }}
            </div>
            <div class="text-xs leading-tight" style="color: rgb(var(--text-color)); opacity: 0.7;">Financial Management</div>
          </div>
        </div>
      </nuxt-link>
    </div>
    
    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto">
      <div class="py-1">
        <RSItem :items="menuItem"></RSItem>
      </div>
    </div>
    
    <!-- User Profile Section -->
    <div class="px-3 py-2.5 border-t" style="border-color: rgb(var(--border-color)); background-color: rgb(var(--bg-1));">
      <div class="flex items-center gap-2.5">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-xs">
            {{ userInitials }}
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-xs truncate leading-tight" style="color: rgb(var(--text-color));">{{ userName }}</div>
          <div class="text-[10px] truncate leading-tight" style="color: rgb(var(--text-color)); opacity: 0.7;">{{ userEmail }}</div>
        </div>
        <button class="flex-shrink-0 p-1.5 rounded transition-colors hover:opacity-100" style="color: rgb(var(--text-color)); opacity: 0.7; --hover-bg: rgba(var(--text-color), 0.1);" @mouseenter="$event.target.style.backgroundColor = 'rgba(var(--text-color), 0.1)'" @mouseleave="$event.target.style.backgroundColor = 'transparent'">
          <Icon name="material-symbols:open-in-new" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
