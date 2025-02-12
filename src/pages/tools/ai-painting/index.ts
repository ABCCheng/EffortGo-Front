import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconBrush} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.ai-painting.title').value,
  path: '/ai-painting',
  description: translate('tools.ai-painting.description').value,
  keywords: ['ai painting', 'Image generator', 'text to image', '文生图', 'AI绘画'],
  component: () => import('./ai-painting.vue'),
  icon: IconBrush,
  createdAt: new Date('2024-11-26'),
  updatedAt: new Date('2025-01-26'),
  badge: 'default',
});
