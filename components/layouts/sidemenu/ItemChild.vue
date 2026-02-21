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
  level: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(["openMenu"]);

const menuItem = props.items ? props.items : [];

const username = user.username;
const roles = user.roles;

function userExist(item) {
  if (item.meta?.auth?.user) {
    return item.meta.auth.user.includes(username);
  }
  return true;
}

function roleExist(item) {
  if (item.meta?.auth?.role) {
    return item.meta.auth.role.some((r) => roles?.includes(r));
  }
  return true;
}

function toggleSubmenu(event) {
  const menuItem = event.currentTarget.closest('.wp-nested-item');
  if (menuItem) {
    menuItem.classList.toggle('wp-menu-open');
  }
}

function isExactActive(path) {
  if (!path) return false;
  return route.path === path || route.path.startsWith(path + '/');
}

function toggleMenu() {
  document.querySelector(".v-layout")?.classList.toggle("menu-hide");
  document.getElementsByClassName("menu-overlay")[0]?.classList.toggle("hide");
}

function navigationPage(path, external) {
  if (width.value <= mobileWidth) toggleMenu();
  navigateTo(path, { external: external });
}
</script>

<template>
  <ul class="wp-nested-submenu">
    <template v-for="(item, index) in menuItem" :key="index">
      <li 
        v-if="!item.meta || !item.meta?.auth || (userExist(item) && roleExist(item))"
        class="wp-nested-item"
        :class="{ 
          'wp-menu-open': isExactActive(item.path),
          'wp-has-children': item.child && item.child.length > 0,
          'current': isExactActive(item.path)
        }"
      >
        <a 
          class="wp-nested-link"
          :class="{ 'active-menu': isExactActive(item.path) }"
          @click="item.child && item.child.length > 0 ? toggleSubmenu($event) : navigationPage(item.path, item.external)"
        >
          {{ item.title }}
          <Icon 
            v-if="item.child && item.child.length > 0" 
            name="dashicons:arrow-right-alt2" 
            size="12" 
            class="wp-nested-arrow"
          />
        </a>
        <RSChildItem
          v-if="item.child && item.child.length > 0"
          :items="item.child"
          :level="level + 1"
        />
      </li>
    </template>
  </ul>
</template>

<style scoped>
/* WordPress Nested Submenu */
.wp-nested-submenu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
  background: #32373c;
}

.wp-nested-item.wp-menu-open > .wp-nested-submenu,
.wp-menu-open > .wp-nested-submenu {
  display: block;
}

.wp-nested-item {
  margin: 0;
  padding: 0;
}

.wp-nested-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px 4px 48px;
  color: #c3c4c7;
  font-size: 13px;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
}

.wp-nested-link:hover {
  color: #72aee6;
}

.wp-nested-item.current > .wp-nested-link {
  color: #fff;
  font-weight: 600;
}

.wp-nested-arrow {
  margin-left: auto;
  transition: transform 0.15s;
}

.wp-nested-item.wp-menu-open > .wp-nested-link .wp-nested-arrow {
  transform: rotate(90deg);
}
</style>
