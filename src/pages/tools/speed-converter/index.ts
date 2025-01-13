import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconBrandSpeedtest} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.speed-converter.title').value,
  path: '/speed-converter',
  description: translate('tools.speed-converter.description').value,
  keywords: ['speed unit convert', '速度单位转换'],
  component: () => import('./speed-converter.vue'),
  icon: IconBrandSpeedtest,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
