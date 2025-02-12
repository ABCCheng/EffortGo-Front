<script lang="ts" setup>
import { toRefs } from 'vue';
import { useThemeVars } from 'naive-ui';
import { IconCirclePlus, IconCircleX } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { useStyleStore } from '@/stores/style.store';
import { useParamStore } from '@/stores/param.store';
import { useToolStore } from '@/pages/tools/tools.store';

import BaseLayout from './base.layout.vue';
import { ref, computed } from 'vue';

const theme = useThemeVars();
const route = useRoute();

const { t } = useI18n();

const paramStore = useParamStore();
const styleStore = useStyleStore();
const toolStore = useToolStore();

const { isSmallScreen } = toRefs(styleStore);

const i18nKey = computed<string>(() => route.path.trim().replace('/', ''));
const toolTitle = computed<string>(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
const toolDescription = computed<string>(() => t(`tools.${i18nKey.description}.title`, String(route.meta.description)));
const toolInnerDescription = computed<string>(() => {
  const innerDesc = t(`tools.${i18nKey.value}.innerDescription`);
  return innerDesc !== `tools.${i18nKey.value}.innerDescription` ? innerDesc : t(`tools.${i18nKey.value}.description`);
});

const currentTool = toolStore.findToolByPath(route.path);

const head = computed<HeadObject>(() => ({
  title: `EffortGo - ${toolTitle.value}`,
  meta: [
    {
      name: 'description',
      content: toolDescription.value,
    },
    {
      name: 'keywords',
      content: ((route.meta.keywords ?? []) as string[]).join(','),
    },
    {
      itemprop: 'name',
      content: t('home.prop-title'),
    },
    {
      itemprop: 'description',
      content: t('home.effortgo-description'),
    },
    {
      property: 'og:title',
      content: t('home.prop-title'),
    },
    {
      property: 'og:description',
      content: t('home.effortgo-description'),
    },
  ],
}));
useHead(head);
paramStore.setPageTitle(toolTitle.value);

const toolDetailVisible = ref(false);
const openToolDetailDialog = () => {
  toolDetailVisible.value = !toolDetailVisible.value;
};

</script>

<template>
  <BaseLayout>
    <n-button size="small" class="tool-operate" data-track-label="Button_ToolDetailFloat" @click="openToolDetailDialog" circle
      variant="text" :style="{ top: isSmallScreen ? '12px' : '20px' }">
      <n-icon size="20" :component="toolDetailVisible ? IconCircleX : IconCirclePlus" :color='theme.primaryColor' />
    </n-button>

    <div v-show="!toolDetailVisible" class="tool-content">
      <slot />
    </div>

    <div v-if="toolDetailVisible" class="tool-detail" style="width: 100%; max-width: 600px; margin: 0 auto;">
      <ToolDetail v-model:visible="toolDetailVisible" :tool="{ icon: currentTool?.icon, name: toolTitle, innerDescription: toolInnerDescription, path: route.path}" />
    </div>

  </BaseLayout>
</template>

<style lang="less" scoped>
.tool-content {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.tool-operate {
  position: fixed;
  right: calc(var(--bodyright) + 23px);
  z-index: 10;
}

</style>
