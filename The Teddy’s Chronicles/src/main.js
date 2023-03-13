import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import * as PIXI from 'pixi.js'

const app = createApp(App)
app.config.globalProperties.PIXI = PIXI
app.mount('#app')