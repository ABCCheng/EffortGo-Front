import { defineStore } from 'pinia';
import _ from 'lodash';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/pages/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';
import { translate } from '@/plugins/i18n.plugin';
import {IconBrandGoogle, IconBrandBing, IconBrandBaidu} from '@tabler/icons-vue';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref('');

  const toolsOptions = toolStore.tools.map(tool => ({
    ...tool,
    name: translate(`tools.${tool.path.replace(/\//g, '')}.title`),
    description:  translate(`tools.${tool.path.replace(/\//g, '')}.description`),
    to: tool.path,
    toolCategory: tool.categoryId,
    category: 'Tools',
  }));

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: toolsOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const persistentOptions = computed((): PaletteOption[] => [
    {
      name: translate('tools.random-tool.title').value,
      description: translate('tools.random-tool.description').value,
      action: () => {
        const { path } = _.sample(toolStore.tools)!;
        router.push(path);
      },
      icon: DiceIcon,
      category: translate('tools.categories.tools').value,
      keywords: ['random', 'tool', 'pick', 'choose', 'select', '随机', '选择'],
      closeOnSelect: true,
    },
    {
      name: translate('tools.google.title').value,
      description: translate('tools.google.description').value,
      href: 'https://www.google.com/search?q=' + searchPrompt.value,
      category: translate('tools.categories.search-engines').value,
      keywords: ['google', 'search', 'more', '谷歌', '搜索', '更多'],
      icon: IconBrandGoogle,
    },
    {
      name: translate('tools.bing.title').value,
      description: translate('tools.bing.description').value,
      href: 'https://www.bing.com/search?q=' + searchPrompt.value,
      category: translate('tools.categories.search-engines').value,
      keywords: ['bing', 'search', 'more', '搜索', '更多'],
      icon: IconBrandBing,
    },
    {
      name: translate('tools.baidu.title').value,
      description: translate('tools.baidu.description').value,
      href: 'https://www.baidu.com/s?wd=' + searchPrompt.value,
      category: translate('tools.categories.search-engines').value,
      keywords: ['baidu', 'search', 'more', '百度', '搜索', '更多'],
      icon: IconBrandBaidu,
    },
    {
      name: translate('tools.dark-mode.title').value,
      description: translate('tools.dark-mode.description').value,
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: translate('tools.categories.settings').value,
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system', '系统', '设置', '深色', '主题'],
    },
    {
      name: translate('tools.github.title').value,
      href: 'https://github.com/ABCCheng/Effortgo-Front',
      category: translate('tools.categories.external').value,
      description: translate('tools.github.description').value,
      keywords: ['github', 'repo', 'repository', 'source', 'code', '源码', '仓库'],
      icon: GithubIcon,
    },
    {
      name: translate('tools.about.title').value,
      description: translate('tools.about.description').value,
      to: '/about',
      category: translate('tools.categories.pages').value,
      keywords: ['about', 'learn', 'more', 'info', 'information', '了解', '信息', '关于', '更多', 'effort'],
      icon: InfoIcon,
    },
    
  ]);

  const filteredSearchResult = computed(() => {
    const groupedSearchResult = _.chain(searchResult.value).groupBy('category').mapValues(categoryOptions => _.take(categoryOptions, 5)).value();

    const groupedPersistentOptions = _.groupBy(persistentOptions.value, 'category');
    for (const [category, options] of Object.entries(groupedPersistentOptions)) {
      groupedSearchResult[category] = groupedSearchResult[category]
        ? [...groupedSearchResult[category], ...options]
        : options;
    }

    return groupedSearchResult;
    
  });

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
