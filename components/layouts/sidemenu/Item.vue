<script setup>
import { useLayoutStore } from "~/stores/layout";
import { useWindowSize } from "vue-window-size";
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

function userExist(item) {
  if (item.meta?.auth?.user) {
    return item.meta.auth.user.some((e) => e === username);
  }
  return true;
}

function roleExist(item) {
  if (item.meta?.auth?.role) {
    return item.meta.auth.role.some((e) => roles?.includes(e));
  }
  return true;
}

// Toggle submenu - WordPress style
function toggleSubmenu(event, className) {
  const menuItem = event.currentTarget.closest(className);
  if (menuItem) {
    menuItem.classList.toggle('wp-menu-open');
  }
}

// Check if menu item or any child is active
function isMenuActive(item) {
  if (!item) return false;
  const currentPath = route.path;
  
  if (item.path && (currentPath === item.path || currentPath.startsWith(item.path + '/'))) {
    return true;
  }
  
  if (item.child && item.child.length > 0) {
    return item.child.some(child => isMenuActive(child));
  }
  
  return false;
}

// Check if exact path matches
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

function hasChildren(item) {
  return item.child && item.child.length > 0;
}
</script>

<template>
  <ul class="wp-menu">
    <template v-for="(item, index) in menuItem" :key="index">
      <!-- Section Header -->
      <li v-if="item.header" class="wp-menu-header">
        <span>{{ item.header }}</span>
      </li>
      
      <!-- Menu Items in Section -->
      <template v-for="(menuItem2, index2) in item.child" :key="index2">
        <li 
          v-if="!menuItem2.meta || !menuItem2.meta?.auth || (userExist(menuItem2) && roleExist(menuItem2))"
          class="wp-menu-item"
          :class="{ 
            'wp-menu-open': isMenuActive(menuItem2),
            'wp-has-submenu': hasChildren(menuItem2),
            'current': isExactActive(menuItem2.path)
          }"
        >
          <!-- Parent Menu Item -->
          <a 
            class="wp-menu-link"
            @click="hasChildren(menuItem2) ? toggleSubmenu($event, '.wp-menu-item') : navigationPage(menuItem2.path, menuItem2.external)"
          >
            <div class="wp-menu-icon">
              <Icon v-if="menuItem2.icon" :name="menuItem2.icon" size="20" />
              <Icon v-else name="dashicons:admin-generic" size="20" />
            </div>
            <div class="wp-menu-name">{{ menuItem2.title }}</div>
            <span v-if="hasChildren(menuItem2)" class="wp-menu-arrow">
              <Icon name="dashicons:arrow-down-alt2" size="14" />
            </span>
          </a>
          
          <!-- Level 2 Submenu -->
          <ul v-if="hasChildren(menuItem2)" class="wp-submenu">
            <template v-for="(subItem, subIndex) in menuItem2.child" :key="subIndex">
              <li 
                v-if="!subItem.meta || !subItem.meta?.auth || (userExist(subItem) && roleExist(subItem))"
                class="wp-submenu-item"
                :class="{ 
                  'current': isExactActive(subItem.path),
                  'wp-has-children': hasChildren(subItem),
                  'wp-menu-open': isMenuActive(subItem)
                }"
              >
                <a 
                  class="wp-submenu-link"
                  @click="hasChildren(subItem) ? toggleSubmenu($event, '.wp-submenu-item') : navigationPage(subItem.path, subItem.external)"
                >
                  {{ subItem.title }}
                  <Icon v-if="hasChildren(subItem)" name="dashicons:arrow-right-alt2" size="12" class="wp-sub-arrow" />
                </a>
                
                <!-- Level 3 Submenu -->
                <ul v-if="hasChildren(subItem)" class="wp-submenu-nested">
                  <template v-for="(subItem2, subIndex2) in subItem.child" :key="subIndex2">
                    <li 
                      v-if="!subItem2.meta || !subItem2.meta?.auth || (userExist(subItem2) && roleExist(subItem2))"
                      class="wp-nested-item"
                      :class="{ 
                        'current': isExactActive(subItem2.path),
                        'wp-has-children': hasChildren(subItem2),
                        'wp-menu-open': isMenuActive(subItem2)
                      }"
                    >
                      <a 
                        class="wp-nested-link"
                        @click="hasChildren(subItem2) ? toggleSubmenu($event, '.wp-nested-item') : navigationPage(subItem2.path, subItem2.external)"
                      >
                        {{ subItem2.title }}
                        <Icon v-if="hasChildren(subItem2)" name="dashicons:arrow-right-alt2" size="12" class="wp-sub-arrow" />
                      </a>
                      
                      <!-- Level 4 Submenu -->
                      <ul v-if="hasChildren(subItem2)" class="wp-submenu-deep">
                        <template v-for="(subItem3, subIndex3) in subItem2.child" :key="subIndex3">
                          <li 
                            v-if="!subItem3.meta || !subItem3.meta?.auth || (userExist(subItem3) && roleExist(subItem3))"
                            class="wp-deep-item"
                            :class="{ 'current': isExactActive(subItem3.path) }"
                          >
                            <a 
                              class="wp-deep-link"
                              @click="navigationPage(subItem3.path, subItem3.external)"
                            >
                              {{ subItem3.title }}
                            </a>
                          </li>
                        </template>
                      </ul>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </li>
      </template>
    </template>
  </ul>
</template>

<style scoped>
/* Light Compact Menu */
.wp-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Section Header */
.wp-menu-header {
  padding: 6px 10px 2px;
  margin-top: 4px;
}

.wp-menu-header:first-child {
  margin-top: 0;
}

.wp-menu-header span {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Menu Item */
.wp-menu-item {
  position: relative;
  margin: 0;
  padding: 0;
}

/* Menu Link */
.wp-menu-link {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
  color: #374151;
  text-decoration: none;
  font-size: 12px;
  line-height: 28px;
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}

.wp-menu-link:hover {
  background: #e5e7eb;
  color: #111827;
}

/* Active/Current Menu Item */
.wp-menu-item.current > .wp-menu-link,
.wp-menu-item.wp-menu-open > .wp-menu-link {
  background: #e5e7eb;
  color: #111827;
  font-weight: 500;
}

/* Left border indicator for active item */
.wp-menu-item.current > .wp-menu-link::before,
.wp-menu-item.wp-menu-open > .wp-menu-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: #2563eb;
  border-radius: 0 2px 2px 0;
}

/* Menu Icon */
.wp-menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 28px;
  margin-right: 4px;
  flex-shrink: 0;
  color: #6b7280;
}

.wp-menu-item.wp-menu-open .wp-menu-icon,
.wp-menu-item.current .wp-menu-icon {
  color: #2563eb;
}

/* Menu Name */
.wp-menu-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 2px;
}

/* Menu Arrow */
.wp-menu-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 28px;
  margin-left: auto;
  transition: transform 0.15s;
  color: #9ca3af;
}

.wp-menu-item.wp-menu-open > .wp-menu-link .wp-menu-arrow {
  transform: rotate(180deg);
}

/* Level 2 Submenu */
.wp-submenu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 2px 0;
  background: #f3f4f6;
}

.wp-menu-item.wp-menu-open > .wp-submenu {
  display: block;
}

/* Submenu Item */
.wp-submenu-item {
  margin: 0;
  padding: 0;
}

/* Submenu Link */
.wp-submenu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px 4px 36px;
  color: #4b5563;
  font-size: 11px;
  line-height: 1.3;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
}

.wp-submenu-link:hover {
  background: #e5e7eb;
  color: #111827;
}

.wp-submenu-item.current > .wp-submenu-link {
  color: #2563eb;
  font-weight: 600;
}

.wp-sub-arrow {
  margin-left: 4px;
  transition: transform 0.15s;
  flex-shrink: 0;
  color: #9ca3af;
}

.wp-submenu-item.wp-menu-open > .wp-submenu-link .wp-sub-arrow {
  transform: rotate(90deg);
}

/* Level 3 Nested Submenu */
.wp-submenu-nested {
  display: none;
  list-style: none;
  margin: 0;
  padding: 2px 0;
  background: #eef0f2;
}

.wp-submenu-item.wp-menu-open > .wp-submenu-nested {
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
  padding: 3px 8px 3px 44px;
  color: #6b7280;
  font-size: 11px;
  line-height: 1.3;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
}

.wp-nested-link:hover {
  background: #e5e7eb;
  color: #111827;
}

.wp-nested-item.current > .wp-nested-link {
  color: #2563eb;
  font-weight: 600;
}

.wp-nested-item.wp-menu-open > .wp-nested-link .wp-sub-arrow {
  transform: rotate(90deg);
}

/* Level 4 Deep Submenu */
.wp-submenu-deep {
  display: none;
  list-style: none;
  margin: 0;
  padding: 2px 0;
  background: #e8eaed;
}

.wp-nested-item.wp-menu-open > .wp-submenu-deep {
  display: block;
}

.wp-deep-item {
  margin: 0;
  padding: 0;
}

.wp-deep-link {
  display: block;
  padding: 3px 8px 3px 52px;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.3;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
}

.wp-deep-link:hover {
  background: #e5e7eb;
  color: #111827;
}

.wp-deep-item.current .wp-deep-link {
  color: #2563eb;
  font-weight: 600;
}
</style>
