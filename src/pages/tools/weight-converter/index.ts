import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconWeight} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.weight-converter.title').value,
  path: '/weight-converter',
  description: translate('tools.weight-converter.description').value,
  keywords: ['weight unit convert', '重量单位转换'],
  component: () => import('./weight-converter.vue'),
  icon: IconWeight,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
