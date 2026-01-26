<script setup>
import { useLayoutStore } from "~/stores/layout";
import { useWindowSize } from "vue-window-size";
import RSChildItem from "~/components/layouts/sidemenu/ItemChild.vue";
import { useUserStore } from "~/stores/user";

const layoutStore = useLayoutStore();
const mobileWidth = layoutStore.mobileWidth;
const { width } = useWindowSize();

const user = useUserStore();
const route = useRoute();
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const username = user.username;
const roles = user.roles;

const menuItem = props.items ? props.items : [];

// validate userExist on meta.auth.user
function userExist(item) {
  if (item.meta?.auth?.user) {
    if (item.meta?.auth?.user.some((e) => e === username)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// validate roleExist on meta.auth.role
function roleExist(item) {
  if (item.meta?.auth?.role) {
    if (item.meta?.auth?.role.some((e) => roles?.includes(e))) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// Toggle show and hide menu content
function openMenu(event) {
  const target = event.currentTarget;
  try {
    target.querySelector("a").classList.toggle("nav-open");
    target.querySelector("ul").classList.toggle("hide");
  } catch (e) {
    // console.log(e);
    return;
  }
}

// Active menu
function activeMenu(routePath) {
  if (!routePath) return '';
  // Exact match or starts with the path (for nested routes)
  const isActive = route.path === routePath || 
                   (routePath !== '/' && route.path.startsWith(routePath + '/')) ||
                   route.path.startsWith(routePath);
  return isActive
    ? `bg-gray-300 text-black active-menu`
    : `bg-white text-black hover:bg-white/90 transition-colors duration-200`;
}

function toggleMenu() {
  document.querySelector(".v-layout").classList.toggle("menu-hide");
  document.getElementsByClassName("menu-overlay")[0].classList.toggle("hide");
}

function navigationPage(path, external) {
  if (width.value <= mobileWidth) toggleMenu();
  navigateTo(path, {
    external: external,
  });
}
</script>

<template>
  <div v-for="(item, index) in menuItem" :key="index">
    <div
      v-if="
        !item.meta || !item.meta?.auth || (userExist(item) && roleExist(item))
      "
      class="navigation-wrapper"
    >
      <!-- Section Header -->
      <div
        v-if="item.header"
        class="px-3 py-2"
      >
        <div class="text-[10px] font-semibold uppercase tracking-wider leading-tight" style="color: rgb(var(--text-color)); opacity: 0.7;">
          {{ item.header ? item.header : "" }}
        </div>
        <p v-if="item.description" class="text-[10px] mt-0.5 leading-tight" style="color: rgb(var(--text-color)); opacity: 0.7;">
          {{ item.description }}
        </p>
      </div>
      
      <!-- Horizontal Separator (if not first section) -->
      <div v-if="index > 0" class="h-px mx-3 my-1" style="background-color: rgb(var(--border-color));"></div>
      
      <!-- Menu Items -->
      <ul class="navigation-menu space-y-0.5 px-3">
        <li
          class="navigation-item"
          v-for="(item2, index2) in item.child"
          :key="index2"
          @click.stop="
            item2.child !== undefined ||
            (item2.child && item2.child.length !== 0)
              ? openMenu($event)
              : ''
          "
        >
          <div
            v-if="
              !item2.meta ||
              !item2.meta?.auth ||
              (userExist(item2) && roleExist(item2))
            "
            class="navigation-item-wrapper rounded-lg overflow-hidden"
          >
            <NuxtLink
              v-if="
                item2.child === undefined ||
                (item2.child && item2.child.length === 0)
              "
              class="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg transition-colors duration-200"
              @click="navigationPage(item2.path, item2.external)"
              :class="activeMenu(item2.path)"
            >
              <Icon 
                v-if="item2.icon" 
                :name="item2.icon" 
                size="18" 
                :class="['flex-shrink-0', (route.path === item2.path || route.path.startsWith(item2.path + '/')) ? 'text-white' : '']"
              ></Icon>
              <Icon 
                v-else 
                name="mdi:circle-slice-8" 
                size="16" 
                :class="['flex-shrink-0', (route.path === item2.path || route.path.startsWith(item2.path + '/')) ? 'text-white' : '']"
              ></Icon>
              <span class="flex-1 font-normal text-xs leading-tight">{{ item2.title }}</span>
            </NuxtLink>
            <a
              v-else
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200"
              :class="activeMenu(item2.path)"
            >
              <Icon 
                v-if="item2.icon" 
                :name="item2.icon" 
                size="18" 
                :class="['flex-shrink-0', (route.path === item2.path || route.path.startsWith(item2.path + '/')) ? 'text-white' : '']"
              ></Icon>
              <Icon 
                v-else 
                name="mdi:circle-slice-8" 
                size="16" 
                :class="['flex-shrink-0', (route.path === item2.path || route.path.startsWith(item2.path + '/')) ? 'text-white' : '']"
              ></Icon>
              <span class="flex-1 font-normal text-xs leading-tight">{{ item2.title }}</span>
              <Icon
                v-if="item2.child && item2.child.length > 0"
                class="ml-auto side-menu-arrow flex-shrink-0 transition-transform duration-200"
                :class="(route.path === item2.path || route.path.startsWith(item2.path + '/')) ? 'text-white' : ''"
                name="material-symbols:keyboard-arrow-down-rounded"
                size="18"
              ></Icon>
            </a>
            <RSChildItem
              v-if="item2.child"
              :items="item2.child"
              @openMenu="openMenu"
              @activeMenu="activeMenu"
            ></RSChildItem>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
