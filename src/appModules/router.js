import Vue from 'vue'
import Router from 'vue-router'
import printe from '@/appModules/views/printe.vue'
import list from '@/appModules/views/list.vue'
// const list = () => import(/* webpackChunkName:"app" */'@/appModules/views/list.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: printe
    },
    {
      path: '/list',
      name: 'list',
      component: list
    }
  ]
})
