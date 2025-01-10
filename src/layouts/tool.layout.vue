<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';

import BaseLayout from './base.layout.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import type { Tool } from '@/pages/tools/tools.types';
import { ref } from 'vue';

const trackLabel = ref('Button_ToolFavorite');

const route = useRoute();

const { t } = useI18n();

const i18nKey = computed<string>(() => route.path.trim().replace('/', ''));
const toolTitle = computed<string>(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
const toolDescription = computed<string>(() => t(`tools.${i18nKey.description}.title`, String(route.meta.description)));
const toolInnerDescription = computed<string>(() => {
  const innerDesc = t(`tools.${i18nKey.value}.innerDescription`);
  return innerDesc !== `tools.${i18nKey.value}.innerDescription` ? innerDesc : t(`tools.${i18nKey.value}.description`);
});

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

</script>

<template>
  <BaseLayout>
    <div class="tool-layout">
      <div class="tool-header">
        <div flex flex-nowrap items-center gap-5>
          <n-h2>
            {{ toolTitle }}
          </n-h2>
          <div>
            <FavoriteButton :data-track-label="trackLabel" :tool="{ name: route.meta.name, path: route.path } as Tool" />
          </div>
        </div>

        <div class="separator" />

        <div v-html="toolInnerDescription" class="innerdescription" />
      </div>
    </div>

    <div class="tool-content">
      <slot />
    </div>
  </BaseLayout>
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

.tool-layout {
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    width: 100%;

    .n-h2 {
      opacity: 0.8;
      font-size: 24px;
      font-weight: 500;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);
      opacity: 0.2;

      margin: 5px 0;
    }

    .innerdescription {
      margin: 0 0 10px 0;
      opacity: 0.8;
    }
  }
}
</style>
