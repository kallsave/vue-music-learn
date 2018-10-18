import createAPI from '../../common/helpers/createApi.js'

export default function create(Vue, Component) {
  createAPI(Vue, Component, ['show'], true)
}
