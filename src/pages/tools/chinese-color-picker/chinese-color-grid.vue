<script setup lang="ts">
import type { ColorInfo } from './chinese-color.types';

const props = withDefaults(defineProps<{ colorInfos?: ColorInfo[] }>(), { colorInfos: () => [] });
const { colorInfos } = toRefs(props);
</script>

<template>
  <div grid grid-cols-1 gap-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4>
    <chinese-color-card v-for="colorInfo in colorInfos" :key="colorInfo.name" :color-info="colorInfo" flex items-center gap-3 />
  </div>
</template>
