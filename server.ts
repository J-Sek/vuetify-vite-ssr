import fs from 'node:fs/promises'
import { createServer as createHttpServer } from 'node:http'
import { Hono } from 'hono'
import { getRequestListener, serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { transformHtmlTemplate } from '@unhead/vue/server'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3000)

const app = new Hono()

type ViteDevServer = Awaited<ReturnType<typeof import('vite')['createServer']>>
let vite: ViteDevServer | undefined
let template: string
let ssrRender: () => Promise<{ html: string, head: Parameters<typeof transformHtmlTemplate>[0] }>

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

// Vite injects CSS from JS in dev, so the server has to inline what the page imported.
// data-vite-dev-id lets the client take over these tags for HMR instead of duplicating them.
async function collectDevStyles (vite: ViteDevServer): Promise<string> {
  const { isCSSRequest } = await import('vite')
  const seen = new Set<unknown>()
  const styles: string[] = []

  async function walk (mod: any) {
    if (!mod || seen.has(mod)) return
    seen.add(mod)

    if (isCSSRequest(mod.url)) {
      // sass partials are file-only watch dependencies without an id
      if (!mod.id) return

      const { default: css } = await vite.ssrLoadModule(mod.url + (mod.url.includes('?') ? '&' : '?') + 'inline')
      styles.push(`<style type="text/css" data-vite-dev-id="${mod.id}">${css}</style>`)
      return
    }

    for (const imported of mod.importedModules) await walk(imported)
  }

  await walk(await vite.environments.ssr.moduleGraph.getModuleByUrl('/src/entry-server.ts'))

  return styles.join('\n')
}

app.get('*', async c => {
  try {
    let html: string
    let head: Parameters<typeof transformHtmlTemplate>[0]
    if (isProduction) {
      const rendered = await ssrRender()
      head = rendered.head
      html = template.replace('<!--app-html-->', rendered.html)
    } else {
      const rawHtml = await fs.readFile('./index.html', 'utf-8')
      html = await vite!.transformIndexHtml(c.req.url, rawHtml)
      const { render } = await vite!.ssrLoadModule('/src/entry-server.ts') as { render: typeof ssrRender }
      const rendered = await render()
      head = rendered.head
      const styles = await collectDevStyles(vite!)
      html = html.replace('<!--app-html-->', rendered.html)
      html = html.replace('</head>', `${styles}\n</head>`)
    }
    return c.html(await transformHtmlTemplate(head, html))
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
