// 路由过渡动画

const types = {
  SET_ROUTER_TRANSITION: 'SET_ROUTER_TRANSITION',
}

const routerTransition = {
  state: {
    routerTransition: {
      name: '',
      mode: ''
    },
  },
  getters: {
    routerTransition: (state) => state.routerTransition,
  },
  mutations: {
    [types.SET_ROUTER_TRANSITION](state, routerTransition) {
      state.routerTransition.name = routerTransition.name || ''
      state.routerTransition.mode = routerTransition.mode || ''
    },
  },
}

export default routerTransition
