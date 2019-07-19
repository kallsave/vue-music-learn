import createAPI from '../../common/helpers/create-api.js'

export default function create(Vue, Component) {
  createAPI(Vue, Component, [], true)
}
