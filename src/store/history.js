export const history = {
  namespaced: true,
  state: {
    visitedArticles: [],
    singleArticle: {},
  },
  mutations: {
    ADD_VISITED_ARTICLE(state, article) {
      state.visitedArticles.unshift(article);
    },
    ADD_SINGLE_ARTICLE(state, article) {
      state.singleArticle = article;
    },
  },
  getters: {
    // Getter to retrieve the list of visited articles
    GET_VISITED_ARTICLES(state) {
      return state.visitedArticles;
    },
    GET_SINGLE_ARTICLE(state) {
      return state.singleArticle;
    },
  },
  actions: {
    // Action to add a visited article
    addVisitedArticle({ commit }, article) {
      commit("ADD_VISITED_ARTICLE", article);
    },
    addSingleArticle({ commit }, article) {
      commit("ADD_SINGLE_ARTICLE", article);
    },
  },
};

export default history;
