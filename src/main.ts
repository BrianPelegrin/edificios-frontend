import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'
const { loadFromStorage } = useAuthStore()
const app =createApp(App)

loadFromStorage()

app
.use(router)
.mount('#app')
