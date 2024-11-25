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
    to: tool.path,
    toolCategory: tool.category,
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
      name: translate('tools.random-tool.title'),
      description: translate('tools.random-tool.description'),
      action: () => {
        const { path } = _.sample(toolStore.tools)!;
        router.push(path);
      },
      icon: DiceIcon,
      category: 'Tools',
      keywords: ['random', 'tool', 'pick', 'choose', 'select'],
      closeOnSelect: true,
    },
    {
      name: translate('tools.google.title'),
      description: translate('tools.google.description'),
      href: 'https://www.google.com/search?q=' + searchPrompt.value,
      category: 'Search Engines',
      keywords: ['google', 'search', 'more'],
      icon: IconBrandGoogle,
    },
    {
      name: translate('tools.bing.title'),
      description: translate('tools.bing.description'),
      href: 'https://www.bing.com/search?q=' + searchPrompt.value,
      category: 'Search Engines',
      keywords: ['bing', 'search', 'more'],
      icon: IconBrandBing,
    },
    {
      name: translate('tools.baidu.title'),
      description: translate('tools.baidu.description'),
      href: 'https://www.baidu.com/s?wd=' + searchPrompt.value,
      category: 'Search Engines',
      keywords: ['baidu', 'search', 'more'],
      icon: IconBrandBaidu,
    },
    {
      name: translate('tools.dark-mode.title'),
      description: translate('tools.dark-mode.description'),
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: 'Actions',
      keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
    },
    {
      name: translate('tools.github.title'),
      href: 'https://github.com/ABCCheng/Effortgo-Front',
      category: 'External',
      description: translate('tools.github.description'),
      keywords: ['github', 'repo', 'repository', 'source', 'code'],
      icon: GithubIcon,
    },
    {
      name: translate('tools.about.title'),
      description: translate('tools.about.description'),
      to: '/about',
      category: 'Pages',
      keywords: ['about', 'learn', 'more', 'info', 'information'],
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
