import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'

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
    getLoginSuccess(context) {
      const api = `${process.env.SERVER_API_PATH}/api/user/check`;

      context.commit('cartModules/LOADING', true)

      axios.post(api).then(response => {
        // console.log('main.js-requiresAuth-success', response.data.success);
        context.commit('LOGINSUCCESS', response.data.success)
        context.commit('cartModules/LOADING', false)
      });
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
