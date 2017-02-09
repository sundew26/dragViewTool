import Vue from 'vue'
import DragAndDrop from 'vue-drag-and-drop'
import DragView from '../page/dragView.vue'
import store from '../lib/store'
Vue.use(DragAndDrop)
/* eslint-disable no-new */
new Vue({
  el: 'body',
  store,
  components: { DragView }
})
