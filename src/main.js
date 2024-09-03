import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { plugin, defaultConfig } from "@formkit/vue" // formkit (v317)
import config from '../formkit.config' // import del objeto de configuracion definido en formkit.config.js (v319)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(plugin, defaultConfig(config)) // formkit (v317) | a defaultConfig() le pasamos el objeto de configuracion definido en formkit.config.js (v319)
app.use(createPinia())
app.use(router)

app.mount('#app')
