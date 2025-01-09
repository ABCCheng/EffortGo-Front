import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import { IconQrcode} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.qrcode-generator.title').value,
  path: '/qrcode-generator',
  description: translate('tools.qrcode-generator.description').value,
  keywords: ['qrcode generator', '二维码生成器'],
  component: () => import('./qrcode-generator.vue'),
  icon: IconQrcode,
  createdAt: new Date('2025-01-12'),
  badge: 'default',
});
