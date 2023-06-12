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
            <v-btn icon @click="clickEdit">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn @click="navigateToDetail(articleData)" icon>
              <v-icon>mdi-arrow-right-thick</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </v-card>
    </v-hover>
    <v-dialog v-model="dialogVisible" persistent max-width="400">
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
            color="green"
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
    clickEdit() {
      this.editedTitle = this.articleData.title;
      this.dialogVisible = true;
    },
    cancelEdit() {
      this.dialogVisible = false;
    },
    saveEdit() {
      // Emit the event with the edited title and index
      this.$emit("edit-title", { title: this.editedTitle, index: this.articleIndex });
      // Close the dialog
      this.dialogVisible = false;
    },
    navigateToDetail(article) {
      console.log(article, "ARTICLE DATA");
      this.$router.push({ name: "detail", params: { id: this.articleIndex, data: article } });
      this.showDetailPage = true;
    },
  },
  components: {
    // DetailView: () => import("@/views/DetailView.vue"),
  },
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
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
