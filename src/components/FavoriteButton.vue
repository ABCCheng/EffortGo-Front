<script setup lang="ts">
import { useToolStore } from '@/pages/tools/tools.store';
import type { Tool } from '@/pages/tools/tools.types';
import {IconHeart, IconHeartFilled} from '@tabler/icons-vue';

const props = defineProps<{ tool: Tool}>();

const toolStore = useToolStore();

const { tool } = toRefs(props);

const isFavorite = computed(() => toolStore.isToolFavorite({ tool }));
const buttonType = computed(() => (isFavorite.value ? 'primary' : 'default'));

function toggleFavorite(event: MouseEvent) {
  event.preventDefault();

  if (toolStore.isToolFavorite({ tool })) {
    toolStore.removeToolFromFavorites({ tool });
    return;
  }

  toolStore.addToolToFavorites({ tool });
}
</script>

<template>
  <c-tooltip position="bottom" :tooltip="isFavorite ? $t('favoriteButton.remove') : $t('favoriteButton.add') ">
    <n-button
      variant="text"
      text
      :bordered="false"
      :type="buttonType"
      :style="{ opacity: isFavorite ? 1 : 0.5 }"
      @click="toggleFavorite"
    >
    <n-icon size="25" :component="isFavorite ? IconHeartFilled : IconHeart" py-5px/>
    </n-button>
  </c-tooltip>
</template>
