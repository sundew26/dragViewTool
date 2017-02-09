import {
  GET_INFO,
  SAVE_INFO,
  DELETE_INFO
} from '../type'

const state = {
  getInformation: {},
  saveInformation: {},
  deleteInformation: {}
}

const mutations = {
  [GET_INFO] (state, action) {
    state.getInformation = {...action.result}
  },
  [SAVE_INFO] (state, action) {
    state.saveInformation = {...action.result}
  },
  [DELETE_INFO] (state, action) {
    state.deleteInformation = {...action.result}
  }
}
export default {
  state,
  mutations
}
