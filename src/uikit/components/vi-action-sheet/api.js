import createAPI from '../../common/helpers/create-api.js'
import { EVENT_SELECT, EVENT_CANCEL } from './vi-action-sheet.vue'

export default function create(Vue, Component) {
  createAPI(Vue, Component, [
    EVENT_SELECT,
    EVENT_CANCEL
  ], true)
}
