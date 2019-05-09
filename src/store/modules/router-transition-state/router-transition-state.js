// 路由过渡动画的执行状态

import { ROUTER_TRANSITION_STATE_LIST } from './config.js'

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
      if (ROUTER_TRANSITION_STATE_LIST.indexOf(routerTransitionState) === -1) {
        throw new Error('argument is unavailable')
      }
      state.routerTransitionState = routerTransitionState
    },
  },
}

export default routerTransitionState
