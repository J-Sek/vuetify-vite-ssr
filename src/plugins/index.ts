/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { VueHeadClient } from '@unhead/vue'
import type { App } from 'vue'

// Plugins
import vuetify from './vuetify'

export function registerPlugins (app: App, head: VueHeadClient) {
  // vuetify's theme looks for the head plugin on install
  app.use(head)
  app.use(vuetify())
}
