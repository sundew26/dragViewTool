import * as api from '../../api'
import * as types from '../type'
export const getInfo = ({dispatch}, data) => api.getInfo(data).then(response => {
  dispatch(types.GET_CITY_LIST, {result: response.data.result})
}, response => {
})

export const saveInfo = ({dispatch}, data) => api.saveInfo(data).then(response => {
  dispatch(types.SAVE_INFO, {result: response.data.result})
}, response => {
})

export const deleteInfo = ({dispatch}, data) => api.deleteInfo(data).then(response => {
  dispatch(types.DELETE_INFO, {result: response.data.result})
}, response => {
})
