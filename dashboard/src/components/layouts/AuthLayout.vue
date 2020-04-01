<template>
  <v-app>
    <v-content class="primary split-bg">
      <v-container fluid fill-height>
        <v-row align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <router-view :key="$route.path"></router-view>
          </v-flex>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({}),

  methods: {}
}
</script>
<style scoped lang="css">
.split-bg {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>