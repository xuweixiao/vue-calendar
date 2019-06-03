import Vue from 'vue'
import App from '@/appModules/App.vue'
import router from '@/appModules/router'
import store from '@/appModules/store'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#page')
