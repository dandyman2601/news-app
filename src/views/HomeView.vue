<template>
  <div>
    <h3
      class="text-center ma-4 outline"
      @click="fetchHeadlines"
      @keydown.enter="fetchHeadlines"
      tabindex="0"
      role="button"
    >
      Fetch Top Headlines
    </h3>
    <div v-if="headlinesArr.length > 0">
      <Card v-for="article in headlinesArr" :key="article.url" :article-data="article"> </Card>
    </div>
    <div v-else class="d-flex justify-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
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
      //  await the store commit within call since large datasets can be sometimes slow
      await this.fetchTopHeadlines();
      this.headlinesArr = store.getters["newsapi/GET_TOP_HEADLINES"].articles;
      console.log(this.headlinesArr);
    },
  },
  components: {
    Card: () => import("@/components/Card.vue"),
  },
};
</script>
