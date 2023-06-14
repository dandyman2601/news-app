<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <!-- Drawer content -->
      <v-list>
        <v-list-item v-for="(item, index) in drawerItems" :key="index">
          <!-- @click="navigateTo(item.route)" -->
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            <v-btn @click="clickDrawerItem(item)" plain :class="item.style" class="overline pa-0">{{
              item.title
            }}</v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <h2 class="logo" @click="goBackHome" @keydown.enter="goBackHome" tabindex="0" role="button">
          The AlvinDaily
        </h2>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="openDialog('search')">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <Dialog :dialog-mode="mode" :dialog="searchDialog" @close-dialog="closeDialog" />
    <v-main>
      <!-- :key helps rerender while on same view -->
      <router-view :key="$route.fullPath" :error="error"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: false,
      searchDialog: false,
      error: null,
      drawerItems: [
        {
          title: "History",
          icon: "mdi-history",
          mode: "history",
          style: "",
        },
        {
          title: "Filter",
          icon: "mdi-filter",
          mode: "filter",
          style: "blue--text",
        },
        {
          title: "Make Error Call",
          icon: "mdi-alert-circle",
          mode: "trigger",
          style: "red--text",
        },
      ],
      mode: "search",
    };
  },
  computed: {
    ...mapGetters("newsapi", ["GET_TOP_HEADLINES_ERROR"]),
  },
  methods: {
    ...mapActions("newsapi", ["fetchNewsSources", "fetchErrorHeadlines"]),
    async fetchSources() {
      await this.fetchNewsSources();
    },
    goBackHome() {
      this.$router.push({ name: "home" }).catch((err) => console.warn(err));
    },
    navigateTo(route) {
      this.$router.push(route);
      this.drawer = false; // Close the drawer after navigation
    },
    async clickDrawerItem(item) {
      this.mode = item.mode;
      if (this.mode !== "trigger") {
        this.openDialog(this.mode);
      } else {
        await this.fetchErrorHeadlines();
        this.error = this.GET_TOP_HEADLINES_ERROR;
        this.drawer = false;
      }
    },
    openDialog(mode) {
      this.mode = mode;
      this.searchDialog = true;
    },
    closeDialog() {
      this.searchDialog = false;
    },
  },
  created() {
    this.fetchSources();
  },
  components: {
    Dialog: () => import("@/components/Dialog.vue"),
  },
};
</script>

<style lang="scss">
@import "./scss/variables.scss";
v-app {
  font-family: $body-font-family !important;
}
.logo {
  font-size: 24px;
  font-weight: bold;
}
</style>
