const types = {
  SET_ROUTER_TRANSITION_STATE: 'SET_ROUTER_TRANSITION_STATE',
}

const routerTransitionState = {
  state: {
    routerTransitionState: '',
  },
  getters: {
    routerTransitionState: (state) => state.routerTransitionState,
  },
  mutations: {
    [types.SET_ROUTER_TRANSITION_STATE](state, routerTransitionState) {
      state.routerTransitionState = routerTransitionState
    },
  },
}

export default routerTransitionState
