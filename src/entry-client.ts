import { createHead } from '@unhead/vue/client'
import { createApp } from './main'

const app = createApp(createHead())
app.mount('#app')
