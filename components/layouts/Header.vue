<script setup>
const isVertical = ref(true);
const isDesktop = ref(true);

const emit = defineEmits(["toggleMenu"]);

// Use site settings composable
const { siteSettings, setTheme, getCurrentTheme } = useSiteSettings();

// const { locale } = useI18n();
// const colorMode = useColorMode();
const langList = languageList();

const locale = ref("en");

const themes = themeList();
const themes2 = themeList2();

function setThemeLocal(theme) {
  setTheme(theme); // Use the site settings setTheme function
}

function rgbToHex(rgbString) {
  // Split the input string into an array of components
  const rgbArray = rgbString.split(",");

  // Convert each component to its numeric value
  const r = parseInt(rgbArray[0].trim(), 10);
  const g = parseInt(rgbArray[1].trim(), 10);
  const b = parseInt(rgbArray[2].trim(), 10);

  // Convert the numeric RGB values to hexadecimal
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  // Concatenate the components and return the final hexadecimal color code
  return `#${rHex}${gHex}${bHex}`;
}

// Toggle Open/Close menu
const toggleMenu = (event) => {
  emit("toggleMenu", event);
};

// Focus on search input
function toggleSearch() {
  document.getElementById("header-search").value = "";
  document.getElementById("header-search").focus();
}

// Change language
const changeLanguage = (lang) => {
  locale.value = lang;
};

const languageNow = computed(() => {
  return langList.find((lang) => lang.value == locale.value);
});

// Get current theme icon
const currentThemeIcon = computed(() => {
  const theme = getCurrentTheme();
  return theme === 'dark' ? 'ic:outline-dark-mode' : 'ic:outline-light-mode';
});

onMounted(() => {
  // If mobile toggleMenu
  if (window.innerWidth < 768) {
    emit("toggleMenu", true);
  }
  
  // Load site settings on mount and ensure they're properly populated
  const { loadSiteSettings } = useSiteSettings();
  loadSiteSettings().then(() => {
    nextTick(() => {
      console.log('[Header.vue] Site settings loaded. Name:', siteSettings.value?.siteName, 'ShowInHeader:', siteSettings.value?.showSiteNameInHeader, 'Logo:', siteSettings.value?.siteLogo);
    });
  });
});

// AI Chat popup
const { toggle: toggleAIChat } = useAIChat();

// Add computed to ensure logo reactivity
const currentLogo = computed(() => {
  const logoUrl = siteSettings.value?.siteLogo;
  if (logoUrl && logoUrl.trim() !== '') {
    return logoUrl; // Use logo from settings if available and not empty
  }
  return '/img/logo/corradAF-logo.svg'; // Ultimate fallback
});
</script>

<template>
  <div class="wp-admin-bar">
    <div class="wp-bar-content">
      <!-- Left side - Menu toggle and site name -->
      <div class="wp-bar-left">
        <button class="wp-bar-item" @click="toggleMenu">
          <Icon name="dashicons:menu" size="20" />
        </button>
        <nuxt-link to="/" class="wp-bar-item wp-site-name">
          <Icon name="dashicons:wordpress" size="20" />
          <span>{{ siteSettings?.value?.siteName || 'Kerisi' }}</span>
        </nuxt-link>
      </div>

      <!-- Right side - Actions -->
      <div class="wp-bar-right">
        <!-- AI Assistant -->
        <button class="wp-bar-item wp-ai-icon" title="AI Assistant" @click="toggleAIChat">
          <img src="/img/kerina-mascot-header.png" alt="KERINA" class="wp-ai-mascot" />
          <span class="wp-ai-active-dot" aria-hidden="true"></span>
        </button>

        <VoiceReader class="wp-bar-item" />

        <!-- Theme dropdown -->
        <VDropdown placement="bottom-end" distance="4" name="theme">
          <button class="wp-bar-item">
            <Icon size="20" name="dashicons:admin-appearance" />
          </button>
          <template #popper>
            <ul class="wp-dropdown">
              <li v-for="(val, index) in themes" :key="index">
                <a @click="setThemeLocal(val.theme)" class="wp-dropdown-item">
                  <span class="capitalize">{{ val.theme }}</span>
                  <div class="flex items-center gap-x-0.5">
                    <div
                      v-for="(color, colorIndex) in val.colors"
                      :key="colorIndex"
                      class="h-4 w-2 rounded-sm"
                      :style="{ backgroundColor: rgbToHex(color.value) }"
                    ></div>
                  </div>
                </a>
              </li>
            </ul>
          </template>
        </VDropdown>

        <!-- Notifications -->
        <VDropdown placement="bottom-end" distance="4" name="notification">
          <button class="wp-bar-item wp-has-badge">
            <Icon name="dashicons:bell" size="20" />
            <span class="wp-badge">2</span>
          </button>
          <template #popper>
            <ul class="wp-dropdown wp-dropdown-wide">
              <li class="wp-dropdown-header">
                <span>Notifications</span>
                <a class="wp-link">View All</a>
              </li>
              <li>
                <a class="wp-dropdown-item">
                  <span class="wp-notification-dot"></span>
                  <span>New update available</span>
                </a>
              </li>
              <li>
                <a class="wp-dropdown-item">
                  <span class="wp-notification-dot"></span>
                  <span>1 plugin needs update</span>
                </a>
              </li>
            </ul>
          </template>
        </VDropdown>

        <!-- User Profile -->
        <VDropdown placement="bottom-end" distance="4" name="profile">
          <button class="wp-bar-item wp-user-item">
            <span class="wp-avatar">
              <img src="@/assets/img/user/default.svg" alt="User" />
            </span>
            <span v-if="isDesktop" class="wp-user-name">Howdy, Admin</span>
          </button>
          <template #popper>
            <ul class="wp-dropdown">
              <li class="wp-dropdown-header wp-user-header">
                <img src="@/assets/img/user/default.svg" alt="User" class="wp-user-avatar-large" />
                <div>
                  <strong>Admin</strong>
                  <a class="wp-link">Edit Profile</a>
                </div>
              </li>
              <li><a href="/logout" class="wp-dropdown-item">Log Out</a></li>
            </ul>
          </template>
        </VDropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Light Compact Header */
.wp-admin-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 20;
  font-size: 12px;
  transition: left 0.2s;
}

.wp-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 8px;
}

.wp-bar-left,
.wp-bar-right {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 2px;
}

/* Bar Item */
.wp-bar-item {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 8px;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  transition: background 0.1s, color 0.1s;
}

.wp-bar-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.wp-site-name {
  font-weight: 500;
  color: #374151;
}

.wp-site-name span {
  display: none;
}

@media (min-width: 768px) {
  .wp-site-name span {
    display: inline;
  }
}

/* User Item */
.wp-user-item {
  padding-right: 10px;
}

.wp-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.wp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wp-user-name {
  font-size: 12px;
  color: #374151;
}

/* Badge */
/* AI Icon with active indicator */
.wp-ai-icon {
  position: relative;
}

.wp-ai-mascot {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: inline-block;
  animation: wp-ai-wiggle 5s ease-in-out infinite;
}

@keyframes wp-ai-wiggle {
  0%, 3%, 6%, 100% { transform: translate(0, 0) rotate(0deg); }
  1.5% { transform: translate(2px, -2px) rotate(-5deg); }
  4.5% { transform: translate(-2px, 2px) rotate(5deg); }
}

.wp-ai-active-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  border: 1px solid #fff;
  animation: wp-ai-pulse 2s ease-in-out infinite;
}

@keyframes wp-ai-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.wp-has-badge {
  position: relative;
}

.wp-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  background: #ef4444;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  line-height: 14px;
  text-align: center;
  border-radius: 7px;
}

/* Dropdown Styles */
.wp-dropdown {
  min-width: 160px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  margin: 0;
  padding: 4px;
  list-style: none;
}

.wp-dropdown-wide {
  min-width: 260px;
}

.wp-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
  font-size: 11px;
  color: #374151;
  margin-bottom: 4px;
}

.wp-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
}

.wp-dropdown-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.wp-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 11px;
}

.wp-link:hover {
  text-decoration: underline;
}

.wp-notification-dot {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  flex-shrink: 0;
}

/* User header in dropdown */
.wp-user-header {
  display: flex;
  gap: 10px;
  padding: 8px;
}

.wp-user-avatar-large {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .wp-admin-bar {
    left: 0;
  }
}

/* Popper override */
:deep(.v-popper__popper) {
  z-index: 100000;
}

:deep(.v-popper__inner) {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
</style>
