<script setup lang="ts">
import { IconDragDrop, IconHeart, IconStar, IconNewSection, IconRefresh, IconSelectAll} from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed, onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import Draggable from 'vuedraggable';
import { useToolStore } from '@/pages/tools/tools.store';
import { config } from '@/config';
import { useParamStore, useToolStaticsStore } from '@/stores/param.store';

const paramStore = useParamStore();
const toolStaticsStore = useToolStaticsStore();

const { t, locale } = useI18n();

const toolStore = useToolStore();

const favoriteTools = computed(() => toolStore.favoriteTools);
const allTools = computed(() => {
  return toolStore.tools.slice().sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
});

const head = computed<HeadObject>(() => ({
  title: t('home.browser-title'),
  meta: [
    {
      name: 'description',
      content: t('home.effortgo-description'),
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
paramStore.setPageTitle('EffortGo');

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}

onMounted(() => {
  toolStaticsStore.fetchAllToolStatics(locale.value);
});

onBeforeRouteUpdate(() => {
  toolStaticsStore.fetchAllToolStatics(locale.value);
});
</script>

<template>
  <div class="grid-wrapper">
    <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
      <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconStar">
        {{ $t('home.follow.p1') }}
        <a data-track-label="Link_ShowBarGithub" href="https://github.com/ABCCheng/EffortGo-Front" rel="noopener"
          target="_blank">Github</a>
        {{ $t('home.follow.p2') }}
        <a data-track-label="Link_ShowBarX" href="https://x.com/EffortGo2024" rel="noopener" target="_blank">X</a>
        {{ $t('home.follow.seperator') }}
        <a data-track-label="Link_ShowBarXiaohongshu"
          href="https://www.xiaohongshu.com/user/profile/5fa36065000000000101ffa5" rel="noopener" target="_blank">{{
          $t('home.follow.xiaohongshu') }}</a>
        {{ $t('home.follow.thankYou') }}
        <br/>
        <router-link to="/about">
          <a data-track-label="Link_ShowBarAbout">{{ $t('home.follow.learnMore') }}</a>
        </router-link>
      </ColoredCard>
    </div>

    <transition name="height">
      <div v-if="toolStore.favoriteTools.length > 0">
        <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
          <n-icon :component="IconHeart" size="20" />
          <h3 m-0px class="font-500">
            {{ t('home.categories.favoriteTools') + ` [${toolStore.favoriteTools.length}]` }}
          </h3>
          <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
            <n-icon py-0px :component="IconDragDrop" size="20" />
          </c-tooltip>
        </div>
        <Draggable :list="favoriteTools"
          class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4"
          ghost-class="ghost-favorites-draggable" item-key="path" @end="onUpdateFavoriteTools">
          <template #item="{ element: tool }">
            <ToolCard :key="tool.path" :tool="tool" />
          </template>
        </Draggable>
      </div>
    </transition>

    <div v-if="toolStore.newTools.length > 0">
      <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
        <n-icon :component="IconNewSection" size="20" />
        <h3 m-0px class="font-500">
          {{ t('home.categories.newestTools') + ` [${toolStore.newTools.length}]` }}
        </h3>
      </div>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.newTools" :key="tool.path" :tool="tool"/>
      </div>
    </div>

    <div v-if="toolStore.updateTools.length > 0">
      <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
        <n-icon :component="IconRefresh" size="20" />
        <h3 m-0px class="font-500">
          {{ t('home.categories.updateTools') + ` [${toolStore.updateTools.length}]` }}
        </h3>
      </div>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.updateTools" :key="tool.path" :tool="tool"/>
      </div>
    </div>

    <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
      <n-icon :component="IconSelectAll" size="20" />
      <h3 m-0px class="font-500">
        {{ t('home.categories.allTools') + ` [${allTools.length}]` }}
      </h3>
    </div>
    <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
      <ToolCard v-for="tool in allTools" :key="tool.path" :tool="tool"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
