import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconPalette} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.chinese-color.title'),
  path: '/chinese-color',
  description: translate('tools.chinese-color.description'),
  keywords: ['chinese culture', 'chinese traditional colors'],
  component: () => import('./chinese-color.vue'),
  icon: IconPalette,
  createdAt: new Date('2024-11-08'),
  updatedAt: new Date('2024-11-24'),
  badge: 'default',
});
