import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import { IconDatabaseEdit } from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.drawdb.title').value,
  path: '/drawdb',
  description: translate('tools.drawdb.description').value,
  keywords: ['drawdb', '数据库设计', 'DB design'],
  component: () => import('./drawdb.vue'),
  icon: IconDatabaseEdit,
  createdAt: new Date('2025-02-10'),
  badge: 'default',
});
