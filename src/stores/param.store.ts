import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllToolStatic } from '@/api/toolStaticsApi';

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

export const useToolStaticsStore = defineStore('toolStatics', () => {
  const toolStatics = ref({});

  const fetchAllToolStatics = async (locale: string) => {
    try {
      const response = await getAllToolStatic(locale);
      if (response.code === 200 && response.data) {
        toolStatics.value = response.data;
      }
    } catch (error) {
      console.error('Error fetching tool statics:', error);
    }
  };

  return {
    toolStatics,
    fetchAllToolStatics
  };
});