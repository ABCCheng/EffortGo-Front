import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconHaze} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.watermark.title').value,
  path: '/watermark',
  description: translate('tools.watermark.description').value,
  keywords: ['weather', 'global weather', 'weather forecast', '', '天气查询', '全球天气', '未来天气'],
  component: () => import('./watermark.vue'),
  icon: IconHaze,
  createdAt: new Date('2024-12-07'),
  badge: 'default',
});
