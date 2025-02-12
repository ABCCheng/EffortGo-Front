<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAllDailyTop } from '@/api/dailyTopApi';
import type { DailyTop } from './daily-top.types';
import { IconRefresh } from '@tabler/icons-vue';
import { useThemeVars } from 'naive-ui';

const { locale } = useI18n();
const theme = useThemeVars();

const SESSION_CACHE_KEY = 'daily_top_cache';
const CACHE_DURATION = 5 * 60 * 1000;

const listDailyTop = ref<DailyTop[]>([]);
const loading = ref(false);

const fetchDailyTop = async (init: boolean = false) => {
  if (loading.value) return;

  if (init) {
    const cache = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (cache) {
      const parsedCache = JSON.parse(cache);
      if (parsedCache.timestamp + CACHE_DURATION > Date.now()) {
        listDailyTop.value = parsedCache.data;
        return;
      }
    }
  }

  loading.value = true;
  try {
    const response = await getAllDailyTop(locale.value);
    if (response.code === 200 && response.data) {
      listDailyTop.value = response.data || [];
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: listDailyTop.value
      }));
    }
  } catch (error) {
    console.error('Failed to fetch daily top:', error);
  }
  loading.value = false;
};

onMounted(() => {
  fetchDailyTop(true);
});
</script>

<template>
  <n-spin size="large" v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
  <div class="mx-auto w-full max-w-1000px flex justify-center">
    <div class="fixed flex justify-center">
      <n-button size="small" :disable="loading" data-track-label="Button_DailyTopRefresh" @click="fetchDailyTop()" circle variant="text">
        <n-icon size="20" :component="IconRefresh" :color="theme.primaryColor" />
      </n-button>
    </div>
    <daily-top-grid :listDailyTop="listDailyTop" />
  </div>
</template>
