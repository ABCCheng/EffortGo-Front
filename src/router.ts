import { createRouter, createWebHistory } from 'vue-router';
import { layouts } from './layouts/index';
import { tools } from './pages/tools';
import { config } from './config';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
}));

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/Home.page.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
    },
    ...toolsRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./pages/404.page.vue') },
  ],
});

export default router;
