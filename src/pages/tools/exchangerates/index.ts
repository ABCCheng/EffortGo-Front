import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconCoin} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.exchangerates.title').value,
  path: '/exchangerates',
  description: translate('tools.exchangerates.description').value,
  keywords: ['exchange rate', 'currency', '实时汇率', '汇率'],
  component: () => import('./exchangerates.vue'),
  icon: IconCoin,
  createdAt: new Date('2024-12-05'),
  badge: 'default',
});
