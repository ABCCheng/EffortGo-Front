<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';
import { IconCircleArrowUp } from '@tabler/icons-vue';

const styleStore = useStyleStore();
const { isMenuCollapsed } = toRefs(styleStore);


import { ref, onMounted, onUnmounted } from 'vue';

const isButtonVisible = ref(false);

const handleScroll = () => {
  isButtonVisible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <n-layout has-sider>
    <n-layout-sider class="siderBody" collapse-mode="width" :collapsed-width="0" :width="240"
      :collapsed="isMenuCollapsed" :show-trigger="false">
      <SiderMenu />
    </n-layout-sider>

    <div v-show="!isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />

    <n-layout>
      <n-layout class="header">
        <Navbar />
      </n-layout>
      <n-layout-content class="content-wrapper">
        <n-button class="back-to-top" data-track-label="Button_BackToTop" v-if="isButtonVisible" @click="scrollToTop"
          circle variant="text" :bordered="false">
          <n-icon size="25" :component="IconCircleArrowUp" />
        </n-button>

        <slot name="content" />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.siderBody {
  position: fixed;
  z-index: 30;
  left: var(--bodyleft);
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
  z-index: 10000;
  overflow: hidden;
}

.content-wrapper {
  position:relative;
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

.back-to-top {
  position: fixed;
  bottom: 40px;
  right: calc(var(--bodyright) + 40px);
  z-index: 50;
  background: rgb(111, 76, 62); /* 深咖啡色 */
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
  }
}


</style>
