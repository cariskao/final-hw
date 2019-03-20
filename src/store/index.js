import Vue from 'vue';
import Vuex from 'vuex';
import productsModules from './products'
import cartModules from './cart'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    productsModules,
    cartModules,
  }
});
