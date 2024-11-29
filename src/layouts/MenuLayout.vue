<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isMenuCollapsed } = toRefs(styleStore);
const siderPosition = computed(() => ('absolute'));

</script>

<template>
  <n-layout has-sider>
    <n-layout-sider class="siderBody" collapse-mode="width" :collapsed-width="0" :width="240"
      :collapsed="isMenuCollapsed" :show-trigger="false" :position="siderPosition">
      <SiderMenu />
    </n-layout-sider>

    <div v-show="!isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />

    <n-layout class="test">
      <n-layout class="header">
        <Navbar />
      </n-layout>

      <n-layout class="content-wrapper">
        <slot name="content" />
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.siderBody {
  position: fixed;
  z-index: 30;
  left: 0px;
  height: var(--vheight);
}
.overlay {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000070;
  cursor: pointer;
}

.header {
  position: fixed;
  width: 100%;
  max-width: var(--max-width);
  height: 100px;
  padding: 0px 20px;
  z-index: 10;
  overflow: hidden;
}

.content-wrapper {
  margin-top: 110px;
  margin-bottom: 10px;
  padding: 0px 20px;
  width: 100%;
  min-height: calc(var(--vheight) - 120px);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  overflow-y: auto
}
</style>
