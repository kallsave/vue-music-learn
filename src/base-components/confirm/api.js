import createAPI from '@/common/helpers/createApi.js'
import { EVENT_CANCEL, EVENT_CONFIRM } from './confirm.vue'

export default function create(Vue, Component) {
  createAPI(Vue, Component, [
    EVENT_CANCEL,
    EVENT_CONFIRM
  ], true)
}
