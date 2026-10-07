/**
 * main.ts
 *
 * Shared app factory for client and server
 */

import type { VueHeadClient } from '@unhead/vue'
import { createSSRApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'

export function createApp (head: VueHeadClient) {
  const app = createSSRApp(App)
  registerPlugins(app, head)
  return app
}
