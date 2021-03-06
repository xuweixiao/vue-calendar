import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/modules/Home.vue'
import searchCondition from '@/components/searchCondition.vue'
import line from '@/modules/echarts/line.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {
      path: '/test',
      name: 'test',
      component: searchCondition
    },
    {
      path: '/line',
      name: 'line',
      component: line
    }
  ]
})
