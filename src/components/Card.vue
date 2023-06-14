<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card class="mx-auto my-3 card" max-width="344" outlined :elevation="hover ? 6 : 2">
        <div v-if="articleData.urlToImage">
          <v-img :src="articleData.urlToImage" height="200px" cover></v-img>
        </div>
        <div v-else class="d-flex align-center col justify-center">
          <div class="d-flex flex-column align-center">
            <v-icon size="125">mdi-image-off-outline</v-icon>
            <p class="overline">No Image Found</p>
          </div>
        </div>
        <v-card-title>
          <h3 lines="three" class="card-title">{{ articleData.title }}</h3>
        </v-card-title>

        <div class="text-right">
          <v-card-text>
            {{ articleData.source.name }}
          </v-card-text>
          <v-toolbar dense flat floating>
            <v-btn v-if="hover" icon @click="clickEdit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn @click="navigateToDetail(articleData)" icon>
              <v-icon>mdi-arrow-right-thick</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </v-card>
    </v-hover>
    <v-dialog v-model="dialogVisible" persistent width="40vw">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Title</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="editedTitle"
            label="Title"
            :rules="titleValidationRules"
            class="text-truncate"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cancelEdit">Cancel</v-btn>
          <v-btn
            :disabled="titleValidationRules[0](editedTitle) !== true"
            color="blue"
            text
            @click="saveEdit"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import mixin from "@/mixins/mixins";

export default {
  props: ["articleData", "articleIndex"],
  name: "CardComponent",
  data() {
    return {
      dialogVisible: false,
      showDetailPage: false,
      editedTitle: "",
      titleValidationRules: [
        (value) => {
          if (!value) return "Title is required.";
          if (value && value.length >= 255) return "Title must be 255 characters or less.";
          return true;
        },
      ],
    };
  },
  methods: {
    ...mapActions("history", ["addSingleArticle"]),
    clickEdit() {
      this.editedTitle = this.articleData.title;
      this.dialogVisible = true;
    },
    cancelEdit() {
      this.dialogVisible = false;
    },
    saveEdit() {
      this.$emit("edit-title", { title: this.editedTitle, index: this.articleIndex });
      this.dialogVisible = false;
    },
    navigateToDetail(article) {
      const slug = this.slugify(article.title);
      this.$router.push({ name: "detail", params: { id: slug, data: article } });
      this.showDetailPage = true;
      //  this.$router.push({ name: "detail", params: { id: slug } })
      // this.addSingleArticle(article);
      // Uncomment above along with getters related to singleArticle to use vuex method
    },
  },
  mixins: [mixin],
};
</script>

<style lang="scss" scoped>
.card {
  transition: box-shadow 0.3s ease;
  overflow: hidden;
  // height: 400px;
}
.card-title {
  display: -webkit-box;
  height: 4rem;
  white-space: normal; /* Allow line breaks within words */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limit the text to 3 lines */
  text-overflow: ellipsis; /* Add ellipsis for overflowed text */
  word-break: break-word; /* Break words and letters to the next line */
  overflow: hidden;
}
</style>
