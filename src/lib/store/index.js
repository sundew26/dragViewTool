import Vue from 'vue'
import Vuex from 'vuex'
import common from './module/common'
const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug
Vue.config.warnExpressionErrors = false

export default new Vuex.Store({
  modules: {
    common
  },
  strict: debug
})
