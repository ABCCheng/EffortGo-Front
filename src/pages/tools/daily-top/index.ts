import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconNews} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.daily-top.title').value,
  path: '/daily-top',
  description: translate('tools.daily-top.description').value,
  keywords: ['daily news', '今日热榜', '今日热搜'],
  component: () => import('./daily-top.vue'),
  icon: IconNews,
  createdAt: new Date('2025-02-02'),
  updatedAt: new Date('2025-02-10'),
  badge: 'default',
});
