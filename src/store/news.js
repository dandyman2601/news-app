const API_KEY = process.env.VUE_APP_API_KEY;

export default {
  namespaced: true,
  state: {
    topHeadlines: null,
  },
  mutations: {
    SET_TOP_HEADLINES(state, headlines) {
      state.topHeadlines = headlines;
    },
    UPDATE_TITLE(state, { title, index }) {
      state.topHeadlines.articles[index].title = title;
    },
  },
  getters: {
    GET_TOP_HEADLINES: (state) => state.topHeadlines,
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
        // Handle error as needed (e.g., show error message)
      }
    },
  },
};
