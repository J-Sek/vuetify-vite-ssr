/**
 * main.ts
 *
 * Shared app factory for client and server
 */

import { createSSRApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'

export function createApp () {
  const app = createSSRApp(App)
  registerPlugins(app)
  return app
}
