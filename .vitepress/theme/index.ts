import DefaultTheme from 'vitepress/theme'
import Timeline from './components/Timeline.vue'
import './styles/timeline.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Timeline', Timeline)
  },
}
