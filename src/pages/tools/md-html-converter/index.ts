import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import { IconMarkdown } from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.md-html-converter.title').value,
  path: '/md-html-converter',
  description: translate('tools.md-html-converter.description').value,
  keywords: ['markdown', 'html', 'convert', '转换'],
  component: () => import('./md-html-converter.vue'),
  icon: IconMarkdown,
  createdAt: new Date('2025-01-26'),
  badge: 'default',
});
