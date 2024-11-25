<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme, lightTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';

const route = useRoute();
const router = useRouter();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : lightTheme));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

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

</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="top">
      <NNotificationProvider placement="bottom-right">
        <n-spin size="large" v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50"/>
        <component v-else :is="layout">
          <RouterView />
        </component>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style lang="less">
body {
  height: 100%;
  width: 1200px;
  margin: 0 auto;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

* {
  box-sizing: border-box;
}
</style>
