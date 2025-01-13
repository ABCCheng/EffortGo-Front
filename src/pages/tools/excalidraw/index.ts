import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconPencilBolt} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.excalidraw.title').value,
  path: '/excalidraw',
  description: translate('tools.excalidraw.description').value,
  keywords: ['whiteboard', 'excalidraw', 'hand-drawn', '白板工具', '手绘工具'],
  component: () => import('./excalidraw.vue'),
  icon: IconPencilBolt,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
