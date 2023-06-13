<template>
  <v-dialog v-model="dialogValue" persistent max-width="75vw">
    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <h5 class="text-center" v-if="dialogMode === 'history'">RECENTLY VISITED ARTICLES</h5>
        <v-btn v-if="dialogMode === 'search'" text @click="performSearchClick">Search</v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- Search field -->
        <v-text-field
          v-if="dialogMode === 'search'"
          v-model="searchText"
          label="Search"
          clearable
        ></v-text-field>
        <v-list v-if="loading">
          <!-- Progress spinner on loading -->
          <v-list-item>
            <v-list-item-content>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list v-else>
          <!-- List items after loading is done -->
          <v-list-item v-for="(result, index) in displayedItems" :key="index">
            <v-list-item-content>
              <div class="d-flex">
                <div>
                  <v-img
                    v-if="result.urlToImage"
                    :src="result.urlToImage"
                    height="50"
                    width="50"
                  ></v-img>
                  <v-icon v-else size="50">mdi-image-off-outline</v-icon>
                </div>
                <div>
                  <v-btn plain @click="navigateToDetail(result)">{{ result.title }} </v-btn>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-if="displayedItems.length === 0 && dialogMode === 'history'">
          <p class="text-center overline">Nothing is here yet. Check out some articles.</p>
        </div>
        <div v-if="displayedItems.length === 0 && dialogMode === 'search' && searchError">
          <p class="text-center overline">Nothing was found. Try searching something different.</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins/mixins";

export default {
  name: "DialogComponent",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    dialogMode: {
      type: String,
      default: "search",
    },
  },
  data() {
    return {
      searchText: "",
      loading: false,
      searchError: false,
    };
  },
  computed: {
    ...mapGetters("newsapi", ["GET_SEARCH_RESULTS"]),
    ...mapGetters("history", ["getVisitedArticles"]),
    ...mapGetters("history", ["getSingleArticle"]),

    displayedItems() {
      if (this.dialogMode === "history") {
        return this.visitedArticles;
      }
      return this.searchResults;
    },
    searchResults() {
      return this.GET_SEARCH_RESULTS ? this.GET_SEARCH_RESULTS.articles : [];
    },
    visitedArticles() {
      return this.getVisitedArticles;
    },
    dialogValue: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit("update:dialog", value);
      },
    },
  },
  watch: {
    searchText(newSearchText) {
      if (newSearchText && newSearchText.length >= 4) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.performSearch();
        }, 1500);
      }
    },
  },
  methods: {
    ...mapActions("newsapi", ["searchNews"]),
    ...mapActions("history", ["addSingleArticle"]),
    closeDialog() {
      this.dialogValue = false;
      this.$emit("close-dialog");
    },
    navigateToDetail(article) {
      const slug = this.slugify(article.title);
      this.dialogValue = false;
      this.$emit("close-dialog");
      this.$router.push({ name: "detail", params: { id: slug, data: article } }).catch((err) => {
        console.warn(err);
        //  Duplicate Navigation fix
        //  Suggested by one of vue-router contributers
      });

      //  this.$router.push({ name: "detail", params: { id: slug } })
      // this.addSingleArticle(article);
      // Uncomment above along with getters related to singleArticle to use vuex method
    },
    performSearchClick() {
      this.performSearch();
    },
    performSearch() {
      if (this.searchText.length >= 4) {
        this.loading = true;
        this.searchNews(this.searchText)
          .then((data) => {
            if (!data.articles.length) throw new Error();
            this.loading = false;
            this.searchError = false;
          })
          .catch((error) => {
            console.log("Error fetching search results:", error);
            this.loading = false;
            this.searchError = true;
          });
      }
    },
  },
  mounted() {},
  mixins: [mixin],
};
</script>
