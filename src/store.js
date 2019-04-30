import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    timeFilterShow: false
  },
  mutations: {
    'SET_TIME_FILTER' (state, value) {
      state.timeFilterShow = value
    }
  },
  actions: {

  }
})
