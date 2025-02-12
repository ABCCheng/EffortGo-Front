<script setup lang="ts">
import { toRefs } from 'vue';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);
</script>

<template>
  <c-card w-full important:flex-1 important:pa-0 :style="{ height: isSmallScreen ? 'calc(var(--vheight) - 120px)' : 'calc(var(--vheight) - 130px)' }">
    <c-diff-editor/>
  </c-card>
</template>

<style lang="less" scoped>
.c-card {
  border: 2px solid transparent;
  border-color: #FF7F50;
}
</style>
