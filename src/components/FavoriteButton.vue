<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useToolStore } from '@/pages/tools/tools.store';
import type { Tool } from '@/pages/tools/tools.types';
import {IconHeart, IconHeartFilled} from '@tabler/icons-vue';
import { useI18n } from 'vue-i18n';
import { PropType, toRefs, computed } from 'vue';

const message = useMessage()

// const props = defineProps<{ tool: Tool}>();
const props = defineProps({
  tool: {
    type: Object as PropType<Tool>,
    required: true
  },
  dataTrackLabel: {
    type: String,
    default: 'Button_Favorite'
  }
});

const toolStore = useToolStore();

const { tool } = toRefs(props);

const { t } = useI18n();

const isFavorite = computed(() => toolStore.isToolFavorite({ tool }));
const buttonType = computed(() => (isFavorite.value ? 'primary' : 'default'));

function toggleFavorite(event: MouseEvent) {
  event.preventDefault();

  if (toolStore.isToolFavorite({ tool })) {
    toolStore.removeToolFromFavorites({ tool });
    message.success(t('favoriteButton.removeSuccess'));
    return;
  }

  toolStore.addToolToFavorites({ tool });
  message.success(t('favoriteButton.addSuccess'));
}
</script>

<template>
  <c-tooltip position="bottom" :tooltip="isFavorite ? $t('favoriteButton.remove') : $t('favoriteButton.add')">
    <n-button :data-track-label="dataTrackLabel" variant="text" text :bordered="false" :type="buttonType" :style="{ opacity: isFavorite ? 1 : 0.5 }"
      @click="toggleFavorite">
      <n-icon size="25" :component="isFavorite ? IconHeartFilled : IconHeart" py-5px />
    </n-button>
  </c-tooltip>
</template>
