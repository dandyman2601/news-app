<template>
  <div class="ma-10">
    <div class="mx-10 my-5">
      <v-icon class="mb-5" color="black" size="50" @click="$router.push({ name: 'home' })"
        >mdi-arrow-left</v-icon
      >
      <h1 class="text-center text-xl">{{ detail.title }}</h1>
      <h4 class="text-xl text-center my-5 grey--text caption">
        {{ detail.description }}
      </h4>
      <h5 class="text-right my-3">{{ new Date(detail.publishedAt) }}</h5>
      <div class="d-flex justify-space-between">
        <h5 v-if="detail.author">By {{ detail.author }}</h5>
        <h5 v-if="detail.source.name">{{ detail.source.name }}</h5>
      </div>
    </div>
    <div class="mx-10 my-5">
      <v-img class="my-5" :src="detail.urlToImage" height="100%" cover></v-img>

      <!-- Drop Cap effect -->
      <p v-if="detail.content" class="body first-letter">
        {{ detail.content }} <br /><br />
        {{ detail.content }}
      </p>
      <p class="body text-center text-xl" v-else>
        :( <br />
        No Content Found
      </p>
      <p class="overline text-right" v-if="detail.url">
        <a :href="detail.url" target="_blank">View the full article</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "DetailComponent",
  data() {
    return {
      detail: {},
    };
  },
  computed: {
    ...mapGetters("history", ["getSingleArticle"]),
  },
  methods: {
    ...mapActions("history", ["addVisitedArticle"]),
    setDetailPage(article) {
      // Add the visited article to the store
      this.addVisitedArticle(article);
    },
  },
  created() {
    this.detail = this.$route.params.data;
    // this.detail = this.getSingleArticle;
    // Uncomment above along with getters related to singleArticle to use vuex method
    this.setDetailPage(this.detail);
  },
};
</script>

<style lang="scss" scoped>
// Drop cap effect
.first-letter::first-letter {
  padding: 0 0.3rem;
  margin: 0 0.3rem 0 0;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 900;
  font-style: italic;
  font-size: 4rem;
  float: left;
  line-height: 1;
}
</style>
