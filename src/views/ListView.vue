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
          <Card
            :article-data="article"
            :article-index="index"
            :key="article.url"
            @edit-title="editTitle"
          />
        </v-col>
      </v-row>
      <div v-else-if="loading" class="loader-container">
        <v-progress-circular :size="99" :width="10" indeterminate></v-progress-circular>
      </div>
      <div v-else class="text-center ma-5">
        <h2 class="red--text mb-5">Something went wrong.</h2>
        <p class="red--text text--lighten-2">{{ errorMessage }}</p>
        <v-btn class="overline" outlined plain small text @click="refreshCall">Take me back</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "@/store/index"; // declaring store here, just another way to do it
import EventBus from "@/eventBus";

export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      headlinesArr: [],
      errorObj: {},
      loading: false,
      firstTimeLoad: false,
      selectedFilter: {
        category: "",
        source: "",
      },
    };
  },
  watch: {
    error(errorObj) {
      // watch for changes in the error prop
      this.headlinesArr = [];
      this.errorMessage = errorObj.message;
      this.loading = false;
      // console.log("Error changed:", errorObj);
    },
  },
  methods: {
    ...mapActions("newsapi", ["fetchTopHeadlines"]),
    async fetchHeadlines(data) {
      try {
        this.loading = true;
        //  Set loading to true before fetching headlines
        //  Loader will turn off if headlinesArr.length > 0
        await this.fetchTopHeadlines(data);
        this.headlinesArr = store.getters["newsapi/GET_TOP_HEADLINES"].articles;
      } catch (error) {
        this.errorObj = store.getters["newsapi/GET_TOP_HEADLINES_ERROR"];
        if (this.errorObj.status && this.errorObj.status === "error") {
          this.errorMessage = `Error fetching top headlines: ${this.errorObj.message}`;
        } else {
          this.errorMessage = `Error fetching top headlines: ${error.message}`;
        }
        // Set loading to false in case of an error
        this.loading = false;
      }
    },
    refreshCall() {
      this.fetchHeadlines();
    },
    editTitle(data) {
      store.commit("newsapi/UPDATE_TITLE", data);
    },
  },
  created() {
    // console.log(store.getters, "STORE ISSUE");
    EventBus.$on("fetchFilteredHeadlines", (data) => {
      this.$router.replace({ name: "home" }).catch(() => {});
      // Check if the selected filter criteria have changed
      if (
        data.category !== this.selectedFilter.category
        || data.source !== this.selectedFilter.source
      ) {
        // Update the selected filter criteria and call fetchHeadlines
        this.headlinesArr = [];
        this.selectedFilter = { ...data };
        this.fetchHeadlines(data);
      }
    });

    if (!this.firstTimeLoad) {
      this.fetchHeadlines();
      this.firstTimeLoad = true; // firstTimeLoad = true; prevent dupe API call
    }
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
