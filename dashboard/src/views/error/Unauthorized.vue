<template>
  <v-app>
    <v-container>
      <v-layout row text-center>
        <v-flex xs12 class="mr-3 hidden-sm-and-down">
          <img src="https://http.cat/401" alt />
        </v-flex>
        <v-flex xs12 class="mr-3 hidden-md-and-up">
          <h1>401</h1>
          <h2 class="mr-3 headline">Sorry, unauthorized access</h2>
        </v-flex>
        <v-flex xs12>
          <v-btn color="error" @click="goHome">Go Home</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ path: "/" })
    }
  }
}
</script>
<style scoped lang="css">
h1 {
  font-size: 150px;
  line-height: 150px;
  font-weight: 700;
  color: #252932;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>
