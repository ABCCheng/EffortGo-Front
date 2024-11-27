<script setup lang="ts">
import colorData from './chinese-color';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import useDebouncedRef from '@/composable/debouncedref';

import type { ColorInfo } from './color.types';

const { t } = useI18n();

const colors: ColorInfo[] = colorData;
const searchQuery = useDebouncedRef('', 500);

const { searchResult } = useFuzzySearch({
  search: searchQuery,
  data: colors,
  options: {
    keys: ['name', 'pinyin'],
    threshold: 0.3,
    useExtendedSearch: true,
    isCaseSensitive: false,
  },
});
</script>

<template>
  <div mx-auto max-w-1200px important:flex-1>
    <div flex items-center gap-3  mb-3>
      <c-input-text
        v-model:value="searchQuery"
        :placeholder="$t('tools.chinese-color-picker.searchPlaceHolder')"
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div v-if="searchResult.length === 0" mt-4 text-20px font-bold>
      </div>
      <div v-else>
        <chinese-color-grid :color-infos="searchResult" />
      </div>
    </div>

    <div v-else>
      <chinese-color-grid :color-infos="colors" />
    </div>
  </div>
</template>
