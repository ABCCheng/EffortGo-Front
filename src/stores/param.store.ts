import { defineStore } from 'pinia';

export const useParamStore = defineStore('param', {
  state: () => ({
    pageTitle: 'EffortGo',
  }),
  actions: {
    setPageTitle(title: string) {
      this.pageTitle = title;
    },
  },
});
