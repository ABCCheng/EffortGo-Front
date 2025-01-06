import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import { IconPhotoEdit} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.tui-editor.title').value,
  path: '/tui-editor',
  description: translate('tools.tui-editor.description').value,
  keywords: ['image editor', '图片编辑', '修改图片'],
  component: () => import('./tui-editor.vue'),
  icon: IconPhotoEdit,
  createdAt: new Date('2024-12-23'),
  badge: 'default',
});
