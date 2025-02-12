import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import { IconRouter } from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.ip-location.title').value,
  path: '/ip-location',
  description: translate('tools.ip-location.description').value,
  keywords: ['ip location', 'ipinfo', 'ip 归属地'],
  component: () => import('./ip-location.vue'),
  icon: IconRouter,
  createdAt: new Date('2025-01-19'),
  badge: 'default',
});
