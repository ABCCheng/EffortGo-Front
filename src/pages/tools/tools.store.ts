import { type MaybeRef, get, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import _ from 'lodash';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { toolsWithCategory } from './index';

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsPath = useStorage('favoriteToolsPath', []) as Ref<string[]>;
  const { t } = useI18n();

  const tools = computed<ToolWithCategory[]>(() => toolsWithCategory.map((tool) => {
    const toolI18nKey = tool.path.replace(/\//g, '');

    return ({
      ...tool,
      name: t(`tools.${toolI18nKey}.title`, tool.name),
      description: t(`tools.${toolI18nKey}.description`, tool.description),
      categoryName: t(`tools.categories.${tool.categoryId}`)
    });
  }));

  const toolsByCategory = computed<ToolCategory[]>(() => {
    return _.chain(tools.value)
      .groupBy('categoryId')
      .map((components, categoryId, categoryName) => ({
        categoryId,
        categoryName,
        components,
      }))
      .value();
  });

  const favoriteTools = computed(() => {
    return favoriteToolsPath.value
      .map(favoritePath => tools.value.find(({ path }) => path === favoritePath))
      .filter(Boolean) as ToolWithCategory[]; // cast because .filter(Boolean) does not remove undefined from type
  });

  const newTools = computed(() => tools.value.filter(({ isNew }) => isNew));
  const updateTools = computed(() => tools.value.filter(({ isUpdate }) => isUpdate));

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools,
    updateTools,

    findToolByPath({ path }: { path: string }) {
      console.log("path:", path);
      return tools.value.find(tool => tool.path === path);
    },

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath) {
        favoriteToolsPath.value.push(toolPath);
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsPath.value = favoriteToolsPath.value.filter(path => get(tool).path !== path);
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsPath.value.includes(get(tool).path)
        || favoriteToolsPath.value.includes(get(tool).path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsPath.value = newOrder.map(tool => tool.path);
    },
  };
});
