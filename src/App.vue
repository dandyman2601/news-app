<template>
  <v-app>
    <v-main>
      <v-toolbar>
        <v-btn icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title class="logo">
          <h2>AlvinDaily</h2>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-magnify</v-icon>
      </v-toolbar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
};
</script>
<style lang="scss">
@import "./scss/variables.scss";
v-app {
  font-family: $body-font-family !important;
}
</style>
