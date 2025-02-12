<script setup lang="ts">
import type { DailyTop } from './daily-top.types';
import { watch, ref, toRefs } from 'vue';

const CACHE_KEY = 'daily-top-cache';

const props = withDefaults(defineProps<{ listDailyTop?: DailyTop[] }>(), { listDailyTop: () => [] });
const { listDailyTop } = toRefs(props);
const listDailyTopShow = ref<DailyTop[]>([]);

const setTopOrder = (platform: string) => {
  const platformList = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  const index = platformList.findIndex((item: string) => item === platform);
  if (index !== -1) {
    platformList.splice(index, 1);
  }
  platformList.unshift(platform);
  localStorage.setItem(CACHE_KEY, JSON.stringify(platformList));
  refreshList();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const refreshList = () => {
  const storedPlatformList = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
  if (storedPlatformList.length === 0) {
    listDailyTopShow.value = listDailyTop.value;
    return;
  }
  
  listDailyTopShow.value = listDailyTop.value.sort((a, b) => {
    const indexA = storedPlatformList.indexOf(a.platform);
    const indexB = storedPlatformList.indexOf(b.platform);

    const safeIndexA = indexA === -1 ? storedPlatformList.length : indexA;
    const safeIndexB = indexB === -1 ? storedPlatformList.length : indexB;

    return safeIndexA - safeIndexB;
  });
};

watch(listDailyTop, () => {
  refreshList();
}, { immediate: true });

</script>

<template>
  <div grid grid-cols-1 gap-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2>
      <daily-top-card v-for="(dailyTop, index) in listDailyTopShow" :key="dailyTop.platform" :index="index" :dailyTop="dailyTop" :setTopOrder="setTopOrder"/>
  </div>
</template>
