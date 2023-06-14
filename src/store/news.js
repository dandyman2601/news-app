const API_KEY = process.env.VUE_APP_API_KEY;

export const newsapi = {
  namespaced: true,
  state: {
    topHeadlines: null,
    searchResults: null,
    newsSources: [],
    error: {},
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
    SET_NEWS_SOURCES(state, results) {
      state.newsSources = results;
    },
    SET_TOP_HEADLINES_ERROR(state, results) {
      state.error = results;
    },
  },
  getters: {
    GET_TOP_HEADLINES: (state) => state.topHeadlines,
    GET_SEARCH_RESULTS: (state) => state.searchResults,
    GET_NEWS_SOURCES: (state) => state.newsSources,
    GET_TOP_HEADLINES_ERROR: (state) => state.error,
  },
  actions: {
    async fetchTopHeadlines({ commit, rootGetters }, data) {
      try {
        const baseUrl = rootGetters.getbaseUrl;
        const headers = new Headers();
        const params = new URLSearchParams();

        if (data) {
          const { category, source } = data;

          if (category && category.id !== "all") {
            params.append("category", category);
          }
          if (source) {
            params.append("sources", source);
          }
        } else {
          params.append("country", "us");
        }

        const queryParams = params.toString();
        const url = queryParams
          ? `${baseUrl}/top-headlines?${queryParams}`
          : `${baseUrl}/top-headlines?country=us`;

        headers.append("Authorization", API_KEY);
        const requestOptions = {
          method: "GET",
          headers,
        };

        const response = await fetch(url, requestOptions);
        const headlines = await response.json();

        if (headlines.status === "error") {
          const error = {
            status: headlines.status,
            code: headlines.code,
            message: headlines.message,
          };
          throw error;
        }

        await commit("SET_TOP_HEADLINES", headlines);
      } catch (error) {
        commit("SET_TOP_HEADLINES_ERROR", error);
      }
    },
    async fetchNewsSources({ commit, rootGetters }) {
      try {
        const baseUrl = rootGetters.getbaseUrl;
        const headers = new Headers();

        headers.append("Authorization", API_KEY);
        const requestOptions = {
          method: "GET",
          headers,
        };
        const response = await fetch(`${baseUrl}/sources`, requestOptions);
        const sources = await response.json();
        await commit("SET_NEWS_SOURCES", sources.sources);
      } catch (error) {
        //  commmit error to store
        //  grab this error state in component
        commit("SET_TOP_HEADLINES_ERROR", error);
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
        // console.log("Error searching news:", error);
        // need error
      }
    },
    async fetchErrorHeadlines({ commit }) {
      try {
        const headers = new Headers();
        headers.append("Authorization", API_KEY);
        const requestOptions = {
          method: "GET",
          headers,
        };
        //  Set the url to something not supported by NewsApi
        const url = "https://newsapi.org/v2/top-headlines?sources=abc-news-au&country=us";
        const response = await fetch(url, requestOptions);
        const headlines = await response.json();
        if (headlines.status === "error") {
          const error = {
            status: headlines.status,
            code: headlines.code,
            message: headlines.message,
          };
          throw error;
        }
        //  Handle the successful response as needed
        //  No Success scenarios though
      } catch (error) {
        commit("SET_TOP_HEADLINES_ERROR", error); // Commit the error mutation
      }
    },
  },
};

export default newsapi;
