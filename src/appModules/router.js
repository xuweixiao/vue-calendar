import Vue from 'vue'
import Router from 'vue-router'
import printe from '@/appModules/views/printe.vue'
import list from '@/appModules/views/list.vue'
// const list = () => import(/* webpackChunkName:"app" */'@/appModules/views/list.vue')

Vue.use(Router)
console.log(process.env.BASE_URL)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'printe',
      component: printe
    },
    {
      path: '/list',
      name: 'list',
      component: list
    }
  ]
})
