import Vue from 'vue';
import Vuex from 'vuex';

import productsModules from './products'
import cartModules from './cart'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    productsModules,
    cartModules,
  },
  namespaced: true,
  strict: true,
  state: {
    loginSuccess: false
  },
  actions: {
    loginSuccess(context, bool) {
      context.commit('LOGINSUCCESS', bool)
    }
  },
  mutations: {
    LOGINSUCCESS(state, payload) {
      state.loginSuccess = payload
    }
  },
  getters: {
    loginSuccess: state => state.loginSuccess,
  }
});
