import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import info from './info';
import category from './category';
import record from './record';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  getters: {
    error: s => s.error,
  },
  actions: {
    async fetchCurrency() {
      const key = process.env.VUE_APP_CF;
      const res = await fetch(
        `https://api.currencyfreaks.com/latest?apikey=${key}&symbols=CNY,EUR,USD`
      );
      // console.log(await res.json());
      return await res.json();
    },
  },
  modules: {
    auth,
    info,
    category,
    record,
  },
});
