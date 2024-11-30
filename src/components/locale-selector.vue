<script setup lang="ts">
const { availableLocales, locale } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  zh: '中文'
};

const localeOptions = computed(() =>
  availableLocales.map(locale => ({
    label: localesLong[locale] ?? locale,
    value: locale,
  })),
);
</script>

<template>
  <!-- data-track-label not valid -->
  <n-select
    data-track-label="DropSelect_LocaleItem"
    v-model:value="locale"
    :options="localeOptions"
    w-100px
  />
</template>
