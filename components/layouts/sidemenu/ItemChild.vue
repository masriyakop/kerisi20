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
    required: true,
  },
  indent: {
    type: Number,
    default: 0.5,
  },
});
const emit = defineEmits(["openMenu"]);

const indent = ref(props.indent);

const menuItem = props.items ? props.items : [];

const username = user.username;
const roles = user.roles;

// validate userExist on meta.auth.user
function userExist(item) {
  if (item.meta?.auth?.user) {
    if (item.meta?.auth?.user.includes(username)) {
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
    if (item.meta?.auth?.role.some((r) => roles.includes(r))) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// Toggle Open/Close menu
function openMenu(event) {
  emit("openMenu", event);
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

const indentStyle = computed(() => {
  return { "background-color": `rgba(var(--sidebar-menu), ${indent.value})` };
});
</script>

<template>
  <ul
    class="menu-content hide ml-3 space-y-0.5 transition-all duration-300 ease-in-out border-l-2"
    :style="{ ...indentStyle, borderColor: 'rgb(var(--border-color))' }"
  >
    <li
      v-for="(item, index) in menuItem"
      :key="index"
      @click.stop="
        item.child !== undefined || (item.child && item.child.length !== 0)
          ? openMenu($event)
          : ''
      "
    >
      <div
        v-if="
          !item.meta || !item.meta?.auth || (userExist(item) && roleExist(item))
        "
        class="navigation-item-wrapper rounded-lg overflow-hidden"
      >
        <NuxtLink
          v-if="
            item.child === undefined || (item.child && item.child.length === 0)
          "
          class="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer rounded-lg transition-colors duration-200"
          @click="navigationPage(item.path, item.external)"
          :class="activeMenu(item.path)"
        >
          <Icon 
            v-if="item.icon" 
            :name="item.icon" 
            size="16" 
            :class="['flex-shrink-0', (route.path === item.path || route.path.startsWith(item.path + '/')) ? 'text-white' : '']"
          ></Icon>
          <span class="flex-1 font-normal text-xs leading-tight">{{ item.title }}</span>
        </NuxtLink>
        <a
          v-else
          class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-200"
          :class="activeMenu(item.path)"
        >
          <Icon 
            v-if="item.icon" 
            :name="item.icon" 
            size="16" 
            :class="['flex-shrink-0', (route.path === item.path || route.path.startsWith(item.path + '/')) ? 'text-white' : '']"
          ></Icon>
          <span class="flex-1 font-normal text-xs leading-tight">{{ item.title }}</span>
          <Icon
            v-if="item.child && item.child.length > 0"
            class="ml-auto side-menu-arrow flex-shrink-0 transition-transform duration-200"
            :class="(route.path === item.path || route.path.startsWith(item.path + '/')) ? 'text-white' : ''"
            name="material-symbols:keyboard-arrow-down-rounded"
            size="16"
          ></Icon>
        </a>
        <RSChildItem
          v-if="item.child"
          :items="item.child"
          :indent="indent + 0.1"
          @openMenu="openMenu"
          @activeMenu="activeMenu"
        ></RSChildItem>
      </div>
    </li>
  </ul>
</template>
