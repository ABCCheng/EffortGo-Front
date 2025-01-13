import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import { IconBinary} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.integer-base-converter.title').value,
  path: '/integer-base-converter',
  description: translate('tools.integer-base-converter.description').value,
  keywords: ['base', 'conversion', '进制转换'],
  component: () => import('./integer-base-converter.vue'),
  icon: IconBinary,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});