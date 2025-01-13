<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { ref, toRefs } from 'vue';
import type { Tool } from '@/pages/tools/tools.types'; // 导入 Tool 类型

const trackLabel = ref('Button_CardFavorite');

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <router-link data-track-label="ToolCard_Card" :to="tool.path" class="decoration-none">
    <c-card class="tool-card h-full transition transition-duration-0.5s !border-2px !hover:border-primary" >
      <div :class="['badge', tool.badge]" style="user-select: none;"></div>
      <div flex items-center gap-1>
        <n-icon size="30" :component="tool.icon" :color='theme.primaryColor' />

        <n-h2 class="truncat my-5px text-lg text-black dark:text-white" style="user-select: none;">
          {{ tool.name }}
        </n-h2>

        <div class="newBaldge" flex items-center gap-8px>
          <div v-if="tool.isNew" class="rounded-full px-8px py-3px text-xs text-white"
            :style="{'background-color': theme.primaryColor, 'user-select': 'none'}"
          >New</div>

          <div v-else-if="tool.isUpdate" class="rounded-full px-8px py-3px text-xs text-white"
            :style="{'background-color': theme.primaryColor, 'user-select': 'none'}"
          >Update</div>

          <FavoriteButton :data-track-label="trackLabel" :tool="tool"/>
        </div>
      </div>

      <div class="line-clamp-3 text-neutral-500 dark:text-neutral-400" style="user-select: none;">
        {{ tool.description }}
      </div>
    </c-card>
  </router-link>
</template>

<style lang="less" scoped>
.tool-card {
  position: relative;
  padding: 5px 10px;
  border-radius: 5px;
}
.newBaldge {
  position: absolute;
  right: 5px;
}

.badge {
  position: absolute;
  border-radius: 20px;
  top: -2px;
  left: -2px;
  height: 15px;
  width: 15px;
}
.badge.free {
  background-color: #28a745;
}
.badge.login {
  background-color: #007bff;
}

</style>
