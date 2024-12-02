import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import {IconDeviceImacMinus} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.webvm.title').value,
  path: '/webvm',
  description: translate('tools.webvm.description').value,
  keywords: ['webvm', 'virtual machine', 'linux', 'web虚拟机', '虚拟机'],
  component: () => import('./webvm.vue'),
  icon: IconDeviceImacMinus,
  createdAt: new Date('2024-11-30'),
  badge: 'default',
});
