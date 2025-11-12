import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('Playground', Playground)
  },
}
