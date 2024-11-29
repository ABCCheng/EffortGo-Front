<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useStyleStore } from '@/stores/style.store';
import {Home, Menu2, Coffee} from '@vicons/tabler';
import { ref } from 'vue';

const router = useRouter();
const styleStore = useStyleStore();

const { t } = useI18n();

const goToHome = () => {
  router.push('/');
};

const supportMeVisible = ref(false);  // 控制弹出框的显示
const openSupportMeDialog = () => {
  supportMeVisible.value = true;  // 打开对话框
};


</script>

<template>
  <div class="navbar">
    <div class="header flex items-center justify-center">
      <n-h1 class="top-title" @click="goToHome" style="user-select: none;" font-bold>
        <span data-track-label="Link_LogoHome">EffortGo</span>
      </n-h1>
    </div>
    <div flex items-center justify-center gap-2>
      <n-button data-track-label="Button_HomeMenu" circle variant="text"
        @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed" class="theme-button" :bordered="false">
        <n-icon size="25" :component="Menu2" />
      </n-button>

      <c-tooltip :tooltip="$t('home.home')" position="top">
        <n-button data-track-label="Button_Home" @click="goToHome" circle variant="text" class="theme-button"
          :bordered="false">
          <n-icon size="25" :component="Home" />
        </n-button>
      </c-tooltip>

      <command-palette />

      <c-tooltip position="top" :tooltip="$t('home.support.supportTip')">
        <n-button data-track-label="Button_SupportMe" round class="support-button" :bordered="false" @click="openSupportMeDialog">
          {{ $t('home.support.supportMe') }}
          <n-icon :component="Coffee" ml-2 size="25" />
        </n-button>
      </c-tooltip>
    </div>
    <!-- SupportMeComponent -->
    <n-modal v-model:show="supportMeVisible" preset="dialog" :title="$t('home.support.dialogTitle')">
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;" gap-6>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;" gap-1>
          <n-image src="/bmc_qr.png" alt="buy me a coffee" width="120" height="120" />
          <a data-track-label="Link_BuyMeACoffee" href="https://buymeacoffee.com/effortgo" target="_blank" rel="noopener noreferrer">Buy me a coffee</a>
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


.theme-button {
  background: rgb(111, 76, 62); /* 深咖啡色 */
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
  }
}

.support-button {
  background: rgb(111, 76, 62); /* 深咖啡色 */
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
  box-sizing: border-box;

  .header {
    margin-bottom: -20px;
    margin-top: 10px;
    cursor: pointer;
    .top-title {
      font-family: 'Marcellus', sans-serif; 
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
    }
  }
}

a {
  color: #FF7F50;
}
a:hover {
  color: var(--n-primary-color-hover);
}
</style>
