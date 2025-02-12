import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import { IconList } from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.todo-list.title').value,
  path: '/todo-list',
  description: translate('tools.todo-list.description').value,
  keywords: ['todo list', '待办列表'],
  component: () => import('./todo-list.vue'),
  icon: IconList,
  createdAt: new Date('2025-02-02'),
  updatedAt: new Date('2025-02-10'),
  badge: 'default',
});
