<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useStyleStore } from '@/stores/style.store';
import { useParamStore } from '@/stores/param.store';
import {IconHome, IconMenu2, IconCoffee} from '@tabler/icons-vue';
import { ref, toRefs } from 'vue';


const router = useRouter();
const route = useRoute();
const styleStore = useStyleStore();
const paramStore = useParamStore();

const { t } = useI18n();
const { isSmallScreen } = toRefs(styleStore);

const isHomePage = route.path === '/';

const goToHome = () => {
  router.push('/');
};

const supportMeVisible = ref(false);
const openSupportMeDialog = () => {
  supportMeVisible.value = true;
};
</script>

<template>
  <div class="navbar">
    <n-h1 class="header-title flex items-center justify-center" :style="{ userSelect: 'none', fontSize: isSmallScreen ? '22px' : '28px' }">
      <span class="title-text" @click="goToHome">{{ paramStore.pageTitle }}</span>
    </n-h1>

    <div class="header-operation flex items-center justify-center gap-2">
      <n-button data-track-label="Button_HomeMenu" circle variant="text"
        @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed" class="theme-button" :bordered="false">
        <n-icon size="25" :component="IconMenu2" />
      </n-button>

      <command-palette />

      <n-button data-track-label="Button_SupportMeFloat" @click="openSupportMeDialog" circle variant="text"
        class="mobile theme-button" :bordered="false">
        <n-icon size="25" :component="IconCoffee" />
      </n-button>

      <n-button data-track-label="Button_SupportMe" round class="desktop support-button" :bordered="false"
        @click="openSupportMeDialog">
        {{ $t('home.support.supportMe') }}
        <n-icon :component="IconCoffee" ml-2 size="25" />
      </n-button>

    </div>

    <!-- SupportMeComponent -->
    <n-modal v-model:show="supportMeVisible" preset="dialog" :title="$t('home.support.dialogTitle')">
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;" gap-6>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;" gap-1>
          <n-image src="/bmc_qr.png" alt="buy me a coffee" width="120" height="120" />
          <a data-track-label="Link_BuyMeACoffee" href="https://buymeacoffee.com/effortgo" target="_blank"
            rel="noopener noreferrer">Buy me a coffee</a>
        </div>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;" gap-1>
          <n-image src="/wx_qr.jpg" alt="wechat" width="120" height="120" />
          <a>WeChat 微信</a>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<style lang="less">
@font-face {
  font-family: 'Marcellus';
  src: url('../assets/fonts/Marcellus-Regular.ttf') format('truetype');
}

.desktop {
  display: flex;
}

.mobile {
  display: none;
}

@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }
}

.theme-button {
  background: rgb(111, 76, 62); 
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
  }
}

.support-button {
  background: rgb(111, 76, 62); 
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
  }
}

.navbar {
  .header-title {
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

  .header-operation {
    margin-top: 10px;
  }
}

a {
  color: #FF7F50;
}
a:hover {
  color: var(--n-primary-color-hover);
}
</style>
