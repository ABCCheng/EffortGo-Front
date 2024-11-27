<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { IconMoon, IconSun} from '@tabler/icons-vue';
import { storeToRefs } from 'pinia';
import HeroGradient from '../assets/hero-gradient.svg?component';
import FooterButtons from '../components/FooterButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory } from '@/pages/tools/tools.types';
import { useToolStore } from '@/pages/tools/tools.store';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;

const { t } = useI18n();

const toolStore = useToolStore();
const { isDarkTheme } = toRefs(styleStore);
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const siderMenuToolsByCategoty = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ categoryId: 'favorite-tools', components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <n-layout class="sider-menu">
    <RouterLink data-track-label="Link_SiderMenuLogoHome" to="/" class="sider-menu-head">
      <HeroGradient class="head-gradient" />
      <div class="head-text">
        <div class="title">
          EffortGo
        </div>
        <div class="subtitle">
          {{ $t('home.subtitle') }}
        </div>
      </div>
    </RouterLink>

    <div class="sider-menu-setting">
      <locale-selector data-track-label="DropSelect_LocaleSelector" w="70%" />
      <c-tooltip :tooltip="isDarkTheme ? $t('home.nav.lightMode') : $t('home.nav.darkMode')" position="bottom">
        <!-- data-track-label not valid -->
        <n-button data-track-label="Button_ToggleDarkTheme" circle variant="text" @click="() => styleStore.toggleDark()"
          class="theme-button" :bordered="false">
          <n-icon v-if="isDarkTheme" size="25" :component="IconSun" />
          <n-icon v-else size="25" :component="IconMoon" />
        </n-button>
      </c-tooltip>
    </div>

    <n-layout class="sider-menu-content" :native-scrollbar="false">
      <CollapsibleToolMenu :sider-menu-tools-by-category="siderMenuToolsByCategoty" />
    </n-layout>

    <div class="sider-menu-footer">
      <div flex justify-center mt-2.5>
        <FooterButtons />
      </div>
      <div>EffortGo v{{ version }}</div>
      <div>Since 2024 ABCCheng</div>
    </div>
  </n-layout>
</template>

<style lang="less" scoped>
.sider-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.sider-menu-head {
  display: block;
  .head-gradient {
    margin-top: -120px;
  }

  .head-text {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 15px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }
    .subtitle {
      font-size: 16px;
      margin-top: 0px;
    }
  }
}

.sider-menu-setting {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}

.sider-menu-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 260px);
  margin-top: 10px;
  padding-bottom: 10px;
}

.sider-menu-footer {
  position: absolute;
  text-align: center;
  color: #FFFFFF;
  padding-top: 5px;
  padding-bottom: 15px;
  bottom: 0px;
  width: 100%;
  z-index: 10;
  background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
}
</style>
