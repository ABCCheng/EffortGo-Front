import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconScribble} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.drawfree.title').value,
  path: '/drawfree',
  description: translate('tools.drawfree.description').value,
  keywords: ['whiteboard', 'mind mapping', 'flowchart', '白板工具', '思维导图', '流程图'],
  component: () => import('./drawfree.vue'),
  icon: IconScribble,
  createdAt: new Date('2024-12-01'),
  badge: 'default',
});
