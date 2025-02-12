<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted } from 'vue';
import { useThemeVars } from 'naive-ui';
import { useStyleStore } from '@/stores/style.store';
import { IconHome, IconCircleArrowUp } from '@tabler/icons-vue';
import { useRouter, useRoute } from 'vue-router';

const theme = useThemeVars();

const router = useRouter();
const route = useRoute();
const isHomePage = route.path === '/';
const goToHome = () => {
  router.push('/');
};

const styleStore = useStyleStore();
const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);


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
      <n-layout>
        <n-button v-show="!isHomePage" size="small" class="back-to-home" data-track-label="Button_BackToHome" @click="goToHome" circle variant="text" :style="{ top: isSmallScreen ? '12px' : '20px' }">
          <n-icon size="20" :component="IconHome" :color='theme.primaryColor' />
        </n-button>
      </n-layout>

      <n-layout v-if="isButtonVisible" class="header-title" :style="{ height: isSmallScreen ? '45px' : '60px' }">
        <HeaderTitle/>
      </n-layout>
      <n-layout v-else class="header-navbar" :style="{ height: isSmallScreen ? '85px' : '100px' }">
        <Navbar />
      </n-layout>
      <n-layout-content class="content-wrapper" :style="{ marginTop: isSmallScreen ? '95px' : '110px', minHeight: isSmallScreen ? 'calc(var(--vheight) - 105px)' : 'calc(var(--vheight) - 120px)' }">
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

.header-title {
  position: fixed;
  width: 100%;
  max-width: var(--max-width);
  padding: 0px 20px;
  z-index: 10;
  overflow: hidden;
}

.header-navbar {
  position: fixed;
  width: 100%;
  max-width: var(--max-width);
  padding: 0px 20px;
  z-index: 10;
  overflow: hidden;
}

.content-wrapper {
  position:relative;
  margin-bottom: 10px;
  padding: 0px 20px;
  width: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  overflow-y: auto
}

.back-to-home {
  position: fixed;
  left: calc(var(--bodyleft) + 23px);
  z-index: 20;
}

.back-to-top {
  position: fixed;
  bottom: 40px;
  right: calc(var(--bodyright) + 40px);
  z-index: 50;
  background: rgb(111, 76, 62); 
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
  }
}


</style>
