<template>
  <v-dialog v-model="dialogValue" persistent max-width="75vw">
    <v-card>
      <v-toolbar flat>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <h2 v-if="dialogMode === 'filter'">FILTER HEADLINES</h2>
          <h2 v-if="dialogMode === 'history'">RECENTLY VISITED ARTICLES</h2>
          <h2 v-if="dialogMode === 'search'">SEARCH HEADLINES</h2>
        </v-toolbar-title>
        <v-spacer></v-spacer>
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
          <div v-if="dialogMode === 'history' || dialogMode === 'search'">
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
          </div>
          <div v-if="dialogMode === 'filter'">
            <v-form @submit.prevent>
              <v-select
                v-model="selectedFilter"
                :items="filterOptions"
                label="Select Filter"
                @change="loadOptions"
              ></v-select>
              <v-select
                v-if="selectedFilter === 'CATEGORY'"
                v-model="selectedCategory"
                :items="categories"
                item-text="name"
                item-value="id"
                label="Select Category"
                clearable
              ></v-select>
              <v-select
                v-else-if="selectedFilter === 'SOURCE'"
                v-model="selectedSource"
                :items="GET_NEWS_SOURCES"
                item-text="name"
                item-value="id"
                label="Select Source"
                clearable
              ></v-select>
              <div class="mt-2 d-flex justify-end">
                <v-btn type="submit" @click="fetchFilteredNews()" dark>Submit</v-btn>
              </div>
            </v-form>
          </div>
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
import EventBus from "@/eventBus";

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
      selectedFilter: null,
      selectedCategory: null,
      selectedSource: null,
      filterOptions: ["CATEGORY", "SOURCE"],
      categories: [
        { id: "all", name: "ALL", icon: "mdi-filter-variant" },
        { id: "business", name: "BUSINESS", icon: "mdi-briefcase" },
        { id: "entertainment", name: "ENTERTAINMENT", icon: "mdi-movie" },
        { id: "general", name: "GENERAL", icon: "mdi-newspaper" },
        { id: "health", name: "HEALTH", icon: "mdi-heart-pulse" },
        { id: "science", name: "SCIENCE", icon: "mdi-flask" },
        { id: "sports", name: "SPORTS", icon: "mdi-basketball" },
        { id: "technology", name: "TECHNOLOGY", icon: "mdi-laptop" },
      ],
    };
  },
  computed: {
    ...mapGetters("newsapi", ["GET_SEARCH_RESULTS", "GET_NEWS_SOURCES"]),
    ...mapGetters("history", ["GET_VISITED_ARTICLES", "GET_SINGLE_ARTICLE"]),

    displayedItems() {
      switch (this.dialogMode) {
        case "history":
          return this.visitedArticles;
        case "filter":
          return this.GET_NEWS_SOURCES;
        case "trigger":
          return this.searchResults;
        case "search":
          return this.searchResults;
        default:
          return this.searchResults;
      }
    },
    searchResults() {
      return this.GET_SEARCH_RESULTS ? this.GET_SEARCH_RESULTS.articles : [];
    },
    visitedArticles() {
      return this.GET_VISITED_ARTICLES;
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
    loadOptions() {
      if (this.selectedFilter === "CATEGORY") {
        this.selectedSource = null; // Reset the selected source
      } else if (this.selectedFilter === "SOURCE") {
        this.selectedCategory = null; // Reset the selected category
      }
    },
    navigateToDetail(article) {
      const slug = this.slugify(article.title);
      this.dialogValue = false;
      this.$emit("close-dialog");
      this.$router.push({ name: "detail", params: { id: slug, data: article } }).catch(() => {});
      //  this.$router.push({ name: "detail", params: { id: slug } })
      // this.addSingleArticle(article);
      // Uncomment above along with getters related to singleArticle to use vuex method
    },
    async fetchFilteredNews() {
      const category = this.selectedFilter === "CATEGORY"
        && this.selectedCategory
        && this.selectedCategory !== "all"
        ? this.selectedCategory
        : null;
      const source = this.selectedFilter === "SOURCE" && this.selectedSource ? this.selectedSource : null;
      this.dialogValue = false;

      EventBus.$emit("fetchFilteredHeadlines", { category, source });
      this.$emit("close-dialog");
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
          .catch(() => {
            // console.log("Error fetching search results:", error);
            this.loading = false;
            this.searchError = true;
          });
      }
    },
  },
  mounted() {
    // Set the default value for selectedCategory after component mount
    this.selectedCategory = this.categories.find((category) => category.id === "all");
  },
  mixins: [mixin],
};
</script>
