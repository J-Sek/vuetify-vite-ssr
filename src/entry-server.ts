import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render () {
  const app = createApp()
  return await renderToString(app)
}
