import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {photo-edit} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.tui-editor.title').value,
  path: '/tui-editor',
  description: translate('tools.tui-editor.description').value,
  keywords: ['image editor', '图片编辑'],
  component: () => import('./tui-editor.vue'),
  icon: photo-edit,
  createdAt: new Date('2024-12-08'),
  badge: 'default',
});
