<script setup lang="ts">
import { IconDragDrop, IconHeart, IconStar, IconNewSection, IconRefresh, IconSelectAll} from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/pages/tools/tools.store';
import { config } from '@/config';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);


const toolStore = useToolStore();

const favoriteTools = computed(() => toolStore.favoriteTools);

const { t } = useI18n();

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

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-15px">
    <div class="grid-wrapper">
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
       
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconStar">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/ABCCheng/EffortGo-Front"
            rel="noopener"
            target="_blank"
          >Github</a>
          {{ $t('home.follow.p2') }}
          <a
            href="https://x.com/EffortGo2024"
            rel="noopener"
            target="_blank"
          >X</a>, 
          <a
            href="https://www.xiaohongshu.com/user/profile/5fa36065000000000101ffa5"
            rel="noopener"
            target="_blank"
          >{{$t('home.follow.xiaohongshu')}}</a>
          {{ $t('home.follow.thankYou') }}
          <br v-show="isSmallScreen" />
          <router-link to="/about">
            <a>{{$t('home.follow.learnMore')}}</a>
          </router-link>
        </ColoredCard>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
            <n-icon :component="IconHeart" size="20"/>
            <h3 m-0px class="font-500">
              {{ $t('home.categories.favoriteTools') }}
            </h3>
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon py-0px :component="IconDragDrop" size="20"/>
            </c-tooltip>
          </div>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
          <n-icon :component="IconNewSection" size="20"/>
          <h3 m-0px class="font-500">
            {{ t('home.categories.newestTools') }}
          </h3>
        </div>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <div v-if="toolStore.updateTools.length > 0">
        <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
          <n-icon :component="IconRefresh" size="20"/>
          <h3 m-0px class="font-500">
            {{ t('home.categories.updateTools') }}
          </h3>
        </div>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.updateTools" :key="tool.name" :tool="tool" />
        </div>
      </div>
      
      <div flex flex-coloumn items-center content-center gap-1 mt-25px mb-0px>
          <n-icon :component="IconSelectAll" size="20"/>
          <h3 m-0px class="font-500">
            {{ $t('home.categories.allTools') }}
          </h3>
      </div>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
a {
  color: #FF7F50 !important;
}
a:hover {
  color: var(--n-primary-color-hover) !important;
}

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
