import Vue from 'vue';
import Vuex from 'vuex';
import newsapi from './news';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    baseUrl: 'https://newsapi.org/v2',
  },
  getters: {
    getbaseUrl: (state) => state.baseUrl,
  },
  mutations: {},
  actions: {},
  modules: {
    newsapi,
  },
});

export default store;
