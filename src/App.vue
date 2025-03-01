<script setup lang="ts">
import { ref, onMounted, watch, computed, toRefs, onUnmounted } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme, lightTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';
import { useI18n } from 'vue-i18n';
import { syncRef, useStorage } from '@vueuse/core';


const route = useRoute();
const router = useRouter();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : lightTheme));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { isDarkTheme } = toRefs(styleStore);

const { locale } = useI18n();

syncRef(
  locale,
  useStorage('locale', locale),
);

const isLoading = ref(false);
router.beforeEach((to, from, next) => {
  isLoading.value = true;
  next();
});
router.afterEach(() => {
  isLoading.value = false;
});

onMounted(() => {
  const handleResize = () => {
    // adapt to dvh vh 
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vheight', `calc(var(--vh) * 100)`);

     // scrollbar width
     const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // bodyleft
    const bodyleft = document.body.getBoundingClientRect().left;

    // bodyright
    const bodyright = window.innerWidth - document.body.getBoundingClientRect().right - scrollbarWidth;

    // set css variable
    document.documentElement.style.setProperty('--bodyleft', `${bodyleft}px`);
    document.documentElement.style.setProperty('--bodyright', `${bodyright}px`);
  }
  // max-width
  document.documentElement.style.setProperty('--max-width', `1200px`);
  
  window.addEventListener('resize', handleResize);
  
  // observer scrollbar width
  const observer = new MutationObserver(handleResize);
  observer.observe(document.documentElement, { attributes: true, subtree: true, 
    childList: true, 
    attributeFilter: ['style', 'class'],
  });

  handleResize();

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
  });
});

// update the statusbar
const updateStatusBarStyle = () => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isDarkTheme.value ? '#1C1C1CFF' : '#FAF4F0FF');
  }

  const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleStatusBarMeta) {
    appleStatusBarMeta.setAttribute('content', isDarkTheme.value ? 'black' : 'default');
  }

  const statusBarMeta = document.querySelector('meta[name="mobile-web-app-status-bar-style"]');
  if (statusBarMeta) {
    statusBarMeta.setAttribute('content', isDarkTheme.value ? 'black' : 'default');
  }
};

// listen the theme set
watch(isDarkTheme, updateStatusBarStyle, { immediate: true });

</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="top">
      <NNotificationProvider placement="bottom-right">
        <n-spin size="large" v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50"/>
        <component v-else :is="layout">
          <RouterView />
          <PWAInstallPrompt />
        </component>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style lang="less">
body {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0;
  overflow-x: hidden;
}

html {
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

* {
  box-sizing: border-box;
}
</style>
