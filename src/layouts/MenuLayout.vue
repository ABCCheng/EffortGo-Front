<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';
import { useThemeVars } from 'naive-ui';

const styleStore = useStyleStore();
const { isMenuCollapsed } = toRefs(styleStore);
const siderPosition = computed(() => ('absolute'));
const themeVars = useThemeVars();
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider class="siderBody"
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :collapsed="isMenuCollapsed"
      :show-trigger="false"
      :position="siderPosition"
    >
      <SiderMenu />
    </n-layout-sider>

    <n-layout class="body">
      <Navbar class="header"/>

      <n-layout class="content-wrapper" :native-scrollbar="false" content-style="padding-right: 15px;">
        <slot name="content" />
      </n-layout>

      <div v-show="!isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000070;
  cursor: pointer;
}

.body {
  padding: 15px 15px 20px 20px;
  .header {
    padding-top: 10px;
    padding-right: 5px;
  }
  .content-wrapper {
    margin-top: 15px;
    height: calc(100vh - 130px);
  }
}

.n-layout-sider {
  height: 100vh;
}
</style>
