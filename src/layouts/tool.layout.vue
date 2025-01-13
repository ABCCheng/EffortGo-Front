<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';
import { IconCirclePlus } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { useParamStore } from '@/stores/param.store';
import { useToolStore } from '@/pages/tools/tools.store';

import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import type { Tool } from '@/pages/tools/tools.types';
import { h, ref } from 'vue';

const theme = useThemeVars();

const trackLabel = ref('Button_ToolFavorite');

const route = useRoute();

const { t } = useI18n();

const paramStore = useParamStore();
const toolStore = useToolStore();

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
  toolDetailVisible.value = true;
};

</script>

<template>
  <BaseLayout>
    <n-button class="tool-operate" data-track-label="Button_ToolDetailFloat" @click="openToolDetailDialog" circle
      variant="text">
      <n-icon size="25" :component="IconCirclePlus" :color='theme.primaryColor' />
    </n-button>

    <div class="tool-content">
      <slot />
    </div>
  </BaseLayout>

  <n-modal v-model:show="toolDetailVisible" preset="dialog" :icon="() => h(currentTool?.icon)" :title="$t('tools.tool-detail.title') + ' - ' + toolTitle">
    <div v-html="toolInnerDescription"/>
    <div style="display: flex; flex-direction: row-reverse; gap: 10px;">
        <FavoriteButton :data-track-label="trackLabel" :tool="{ name: route.meta.name, path: route.path } as Tool" />
    </div>
  </n-modal>
</template>

<style lang="less" scoped>
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.tool-operate {
  position: fixed;
  top: 20px;
  right: calc(var(--bodyright) + 20px);
  z-index: 10;
}
</style>
