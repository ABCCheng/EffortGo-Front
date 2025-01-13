import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconRulerMeasure} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.length-converter.title').value,
  path: '/length-converter',
  description: translate('tools.length-converter.description').value,
  keywords: ['length unit convert', '长度单位转换'],
  component: () => import('./length-converter.vue'),
  icon: IconRulerMeasure,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
