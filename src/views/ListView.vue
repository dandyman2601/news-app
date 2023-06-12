<template>
  <div>
    <h1 class="text-center ma-4">Top Headlines</h1>
    <v-container fluid>
      <v-row v-if="headlinesArr.length > 0" class="wrap">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          v-for="(article, index) in headlinesArr"
          :key="article.url"
        >
          <Card :article-data="article" :article-index="index" @edit-title="editTitle" />
        </v-col>
      </v-row>
      <div v-else class="loader-container">
        <v-progress-circular :size="99" :width="10" indeterminate></v-progress-circular>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "@/store/index";

export default {
  data() {
    return {
      headlinesArr: [],
    };
  },
  methods: {
    ...mapActions("newsapi", ["fetchTopHeadlines"]),
    async fetchHeadlines() {
      await this.fetchTopHeadlines();
      this.headlinesArr = store.getters["newsapi/GET_TOP_HEADLINES"].articles;
    },
    editTitle(data) {
      store.commit("newsapi/UPDATE_TITLE", data);
    },
  },
  created() {
    this.fetchHeadlines();
  },
  components: {
    Card: () => import("@/components/Card.vue"),
  },
};
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
