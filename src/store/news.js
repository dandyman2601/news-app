const API_KEY = process.env.VUE_APP_API_KEY;

export const newsapi = {
  namespaced: true,
  state: {
    topHeadlines: null,
    searchResults: null,
  },
  mutations: {
    SET_TOP_HEADLINES(state, headlines) {
      state.topHeadlines = headlines;
    },
    UPDATE_TITLE(state, { title, index }) {
      state.topHeadlines.articles[index].title = title;
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
  },
  getters: {
    GET_TOP_HEADLINES: (state) => state.topHeadlines,
    GET_SEARCH_RESULTS: (state) => state.searchResults,
  },
  actions: {
    async fetchTopHeadlines({ commit, rootGetters }) {
      try {
        const baseUrl = rootGetters.getbaseUrl;
        const headers = new Headers();
        // const params = new URLSearchParams();
        // params.append("pageSize", 20);
        headers.append("Authorization", API_KEY);
        const requestOptions = {
          method: "GET",
          headers,
        };
        const response = await fetch(`${baseUrl}/top-headlines?country=us`, requestOptions);
        const headlines = await response.json();
        await commit("SET_TOP_HEADLINES", headlines);
      } catch (error) {
        console.log("Error fetching top headlines:", error);
        // need error
      }
    },
    async searchNews({ commit, rootGetters }, searchText) {
      try {
        const baseUrl = rootGetters.getbaseUrl;
        const headers = new Headers();
        headers.append("Authorization", API_KEY);
        const requestOptions = {
          method: "GET",
          headers,
        };
        const response = await fetch(`${baseUrl}/top-headlines?q=${searchText}`, requestOptions);
        const searchResults = await response.json();
        commit("SET_SEARCH_RESULTS", searchResults);
      } catch (error) {
        console.log("Error searching news:", error);
        // need error
      }
    },
  },
};

export default newsapi;
