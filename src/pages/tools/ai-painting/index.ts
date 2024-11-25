import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconBrush} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.ai-painting.title'),
  path: '/ai-painting',
  description: translate('tools.ai-painting.description'),
  keywords: ['ai', 'ai painting', 'generate ai images', 'real time'],
  component: () => import('./ai-painting.vue'),
  icon: IconBrush,
  createdAt: new Date('2024-11-08'),
  updatedAt: new Date('2024-11-24'),
  badge: 'default',
});
