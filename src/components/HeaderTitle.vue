<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useStyleStore } from '@/stores/style.store';
import { useParamStore } from '@/stores/param.store';
import { IconHome } from '@tabler/icons-vue';
import { toRefs } from 'vue';


const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);

const router = useRouter();
const route = useRoute();
const paramStore = useParamStore();

const isHomePage = route.path === '/';

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="header-title">
    <n-h1 class="title flex items-center justify-center" :style="{ userSelect: 'none', fontSize: isSmallScreen ? '22px' : '28px' }" font-bold>
      <span class="title-text" @click="goToHome">{{ paramStore.pageTitle }}</span>
    </n-h1>
  </div>
  <div />
</template>

<style lang="less">
@font-face {
  font-family: 'Marcellus';
  src: url('../assets/fonts/Marcellus-Regular.ttf') format('truetype');
}

.header-title {
  .title {
    margin-bottom: -10px;
    margin-top: 10px;
    font-family: 'Marcellus', sans-serif;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);

    .title-icon {
      cursor: pointer;
    }

    .title-text {
      cursor: pointer;
    }
  }
}
</style>
