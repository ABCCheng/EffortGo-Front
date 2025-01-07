import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import { IconJson} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.json-editor.title').value,
  path: '/json-editor',
  description: translate('tools.json-editor.description').value,
  keywords: ['json editor', 'json编辑', 'json格式化'],
  component: () => import('./json-editor.vue'),
  icon: IconJson,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
