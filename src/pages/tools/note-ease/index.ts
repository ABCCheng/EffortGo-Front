import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import { IconNote } from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.note-ease.title').value,
  path: '/note-ease',
  description: translate('tools.note-ease.description').value,
  keywords: ['note', '便签', '笔记'],
  component: () => import('./note-ease.vue'),
  icon: IconNote,
  createdAt: new Date('2025-02-09'),
  badge: 'default',
});
