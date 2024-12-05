import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconHaze} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.global-weather.title').value,
  path: '/global-weather',
  description: translate('tools.global-weather.description').value,
  keywords: ['weather', 'global weather', 'weather forecast', '', '天气查询', '全球天气', '未来天气'],
  component: () => import('./global-weather.vue'),
  icon: IconHaze,
  createdAt: new Date('2024-12-07'),
  badge: 'default',
});
