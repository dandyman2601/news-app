<template>
  <div>
    <v-card class="mx-auto my-3" max-width="344" outlined>
      <v-img :src="articleData.urlToImage" height="200px" cover></v-img>

      <v-card-title>
        {{ articleData.title }}
      </v-card-title>

      <v-card-subtitle>
        {{ articleData.description }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn color="orange-lighten-2" variant="text"> Explore </v-btn>

        <v-spacer></v-spacer>

        <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["articleData"],
  name: "CardComponent",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
