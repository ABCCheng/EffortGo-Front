import { resolve } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgLoader from 'vite-svg-loader';
import Sitemap from 'vite-plugin-sitemap';
import { sitemappages } from './src/sitemappages.js';

const hostname = 'https://www.effortgo.com/';
const baseUrl = process.env.BASE_URL ?? '/';
const dynamicRoutes = sitemappages.map(page => `/${page}`);
const exclude = ['/local-webvm', '/local-webvm/alpine', '/local-webvm/login',
   '/baidu_verify_codeva-KH0nUU2Pmr', '/local-drawfree', '/local-drawdb'];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    proxy: {
    },
  },
  plugins: [
    Sitemap({ 
      hostname: `${hostname}`,
      dynamicRoutes,
      exclude,
     }),
    VueI18n({
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
      strictMessage: false,
      include: [
        resolve(__dirname, 'locales/**'),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        globPatterns: [
          '**/*.{js,css,png,ico,jpg,svg,ttf}',  // no html
        ],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'EffortGo',
        short_name: 'EffortGo',
        description: 'Focusing on developing minimal and convenient online tools to ease work and life, combining efficiency with simplicity.',
        display: 'standalone',
        lang: 'en-US',
        start_url: `${baseUrl}`,
        orientation: 'any',
        theme_color: '#FAF4F0',
        background_color: '#FAF4F0',
        icons: [
          {
            src: '/favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Components({
      dirs: ['src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
    }),
    Unocss(),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    'process.env': process.env,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 10000
  },
});
