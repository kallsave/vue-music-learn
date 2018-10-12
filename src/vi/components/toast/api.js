import createAPI from '@/common/helpers/createApi'

export default function create(Vue, Component) {
  createAPI(Vue, Component, ['show'], true)
}
