import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

const getBrowserLocale = () => {
  const lang = navigator.language;
  return lang.startsWith('zh') ? 'zh' : 'en';
};

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(), // 设置默认语言
  fallbackLocale: 'en', // 兜底语言
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = (localeKey: string) => {
  return computed(() => {
    const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
    return hasKey ? i18n.global.t(localeKey) : localeKey;
  });
};
