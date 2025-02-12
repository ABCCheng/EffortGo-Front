<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useToolStore } from '@/pages/tools/tools.store';
import type { Tool } from '@/pages/tools/tools.types';
import {IconHeart, IconHeartFilled} from '@tabler/icons-vue';
import { useI18n } from 'vue-i18n';
import { PropType, ref, toRefs, computed } from 'vue';
import { favorite, unfavorite } from '@/api/toolStaticsApi';

import { useToolStaticsStore } from '@/stores/param.store';
const toolStaticsStore = useToolStaticsStore();

const message = useMessage()

const props = defineProps({
  tool: {
    type: Object as PropType<Tool>,
    required: true
  },
  dataTrackLabel: {
    type: String,
    default: 'Button_Favorite'
  },
  badgeValue: {
    type: Number,
    default: 0
  }
});

const favoriteCount = computed({
  get() {
    return toolStaticsStore.toolStatics[tool.value.path.replace(/^\//, '')]?.favoriteCount || 0;
  },
  set(newValue) {
    const toolPath = tool.value.path.replace(/^\//, '');
    if (toolStaticsStore.toolStatics[toolPath]) {
      toolStaticsStore.toolStatics[toolPath].favoriteCount = newValue;
    }
  }
});

const toolStore = useToolStore();

const { tool } = toRefs(props);
const badgeValue = ref(props.badgeValue || favoriteCount);

const { t, locale } = useI18n();

const loading = ref(false);

const isToolFavorite = computed(() => toolStore.isToolFavorite({ tool }));
const badgeOpacity = computed(() => badgeValue.value > 0 ? 1 : 0);

function toggleFavorite(event: MouseEvent) {
  event.preventDefault();

  if (toolStore.isToolFavorite({ tool })) {
    toolStore.removeToolFromFavorites({ tool });
    handleUpdateFavorite(false);
    message.success(t('favoriteButton.removeSuccess'));
    return;
  }

  toolStore.addToolToFavorites({ tool });
  handleUpdateFavorite(true);
  message.success(t('favoriteButton.addSuccess'));
}

const handleUpdateFavorite = async (isFavorite: boolean) => {
  try { 
    const response = await (isFavorite ? favorite(props.tool.path.replace(/^\//, ''), locale.value) : unfavorite(props.tool.path.replace(/^\//, ''), locale.value));
    if (response.code === 200) {
      badgeValue.value = isFavorite ? badgeValue.value + 1 : badgeValue.value - 1;
      if (badgeValue.value < 0) {
        badgeValue.value = 0;
      }
    }
  } catch (error) {
  }
};
</script>

<template>
  <n-spin size="large" v-if="loading && badgeValue > 0" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
  <c-tooltip position="bottom" :tooltip="isToolFavorite ? $t('favoriteButton.remove') : $t('favoriteButton.add')">
    <n-button :data-track-label="dataTrackLabel" variant="text" text :bordered="false" type="primary" @click="toggleFavorite">
      <div flex flex-col items-center justify-start gap-0>
        <n-badge :value="badgeValue" :max="99" showZero :style="{ opacity: badgeOpacity }"></n-badge>         
        <n-icon size="25" :component="isToolFavorite ? IconHeartFilled : IconHeart" />
      </div>
    </n-button>
  </c-tooltip>
</template>

<style scoped>
::v-deep(.n-badge-sup) {
  background-color: transparent !important;
  color: inherit !important;
  border: none !important;
  box-shadow: none !important;
  margin-bottom: -6px !important;
  font-size: 10px !important;;
}
</style>