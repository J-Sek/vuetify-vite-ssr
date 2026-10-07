import { createHead } from '@unhead/vue/server'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render () {
  const head = createHead()
  const app = createApp(head)
  return { html: await renderToString(app), head }
}
