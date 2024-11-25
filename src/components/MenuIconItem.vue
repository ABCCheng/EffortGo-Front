<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import type { Tool } from '@/pages/tools/tools.types';

const props = defineProps<{ tool: Tool }>();
const { tool } = toRefs(props);

const theme = useThemeVars();
</script>

<template>
  <div class="menu-icon-item">
    <div :class="['badge', tool.badge]"></div>

    <n-icon :component="tool.icon" />
    <div v-if="tool.isNew || tool.isUpdate" class="newBadge" />
  </div>
</template>

<style lang="less" scoped>
.menu-icon-item {
  position: relative;

  .newBadge {
    position: absolute;
    background-color: v-bind('theme.primaryColor');
    border-radius: 10px;
    line-height: 1;
    top: 3px;
    right: -5px;
    font-size: 10px;

    height: 6px;
    width: 6px;
  }

  .badge {
    position: absolute;
    border-radius: 10px;
    line-height: 1;
    top: 3px;
    left: -5px;
    font-size: 10px;

    height: 6px;
    width: 6px;
  }
  .badge.free {
    background-color: #28a745;
  }

  .badge.login {
    background-color: #007bff;
  }
}
</style>
