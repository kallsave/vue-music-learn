const types = {
  SET_ROUTER_TRANSITION_NAME: 'SET_ROUTER_TRANSITION_NAME',
}

const routerTransitionName = {
  state: {
    routerTransitionName: '',
  },
  getters: {
    routerTransitionName: (state) => state.routerTransitionName,
  },
  mutations: {
    [types.SET_ROUTER_TRANSITION_NAME](state, routerTransitionName) {
      state.routerTransitionName = routerTransitionName
    },
  },
}

export default routerTransitionName
