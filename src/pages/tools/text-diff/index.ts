import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconFileDiff} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.text-diff.title'),
  path: '/text-diff',
  description: translate('tools.text-diff.description'),
  keywords: ['text', 'diff', 'compare', 'string', 'text diff', 'code'],
  component: () => import('./text-diff.vue'),
  icon: IconFileDiff,
  createdAt: new Date('2024-11-08'),
  updatedAt: new Date('2024-11-23'),
  badge: 'default',
});
