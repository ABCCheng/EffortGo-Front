import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconPalette} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.chinese-color-picker.title').value,
  path: '/chinese-color-picker',
  description: translate('tools.chinese-color-picker.description').value,
  keywords: ['chinese culture', 'chinese traditional colors', '中国文化', '中国传统', '中国色'],
  component: () => import('./chinese-color-picker.vue'),
  icon: IconPalette,
  createdAt: new Date('2024-11-25'),
  badge: 'default',
});
