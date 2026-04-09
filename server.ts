import fs from 'node:fs/promises'
import { createServer as createHttpServer } from 'node:http'
import { Hono } from 'hono'
import { getRequestListener, serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3000)

const app = new Hono()

type ViteDevServer = Awaited<ReturnType<typeof import('vite')['createServer']>>
let vite: ViteDevServer | undefined
let template: string
let ssrRender: () => Promise<string>

if (isProduction) {
  app.use('/assets/*', serveStatic({ root: './dist/client' }))
  template = await fs.readFile('./dist/client/index.html', 'utf-8')
  // @ts-expect-error no declarations for build output
  const mod = await import('./dist/server/entry-server.js')
  ssrRender = mod.render
} else {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })
}

app.get('*', async c => {
  try {
    let html: string
    if (isProduction) {
      const appHtml = await ssrRender()
      html = template.replace('<!--app-html-->', appHtml)
    } else {
      const rawHtml = await fs.readFile('./index.html', 'utf-8')
      html = await vite!.transformIndexHtml(c.req.url, rawHtml)
      const { render } = await vite!.ssrLoadModule('/src/entry-server.ts')
      const appHtml = await render()
      html = html.replace('<!--app-html-->', appHtml)
    }
    return c.html(html)
  } catch (e: any) {
    vite?.ssrFixStacktrace(e)
    console.error(e)
    return c.text(e.message, 500)
  }
})

if (isProduction) {
  serve({ fetch: app.fetch, port })
  console.log(`Server running at http://localhost:${port}`)
} else {
  const httpServer = createHttpServer((req, res) => {
    vite!.middlewares(req, res, () => {
      getRequestListener(app.fetch)(req, res)
    })
  })
  httpServer.listen(port, () => {
    console.log(`Dev server running at http://localhost:${port}`)
  })
}
