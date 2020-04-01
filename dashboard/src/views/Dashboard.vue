<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-card class="mx-auto" flat outlined>
          <v-card-title class="text-centre">Welcome</v-card-title>
          <v-img
            class="white--text"
            contain
            position="center"
            src="https://dummyimage.com/1000x500/cccccc/000000&text=Bookings%20Dashboard">
          </v-img>
          <v-card-text>Click around!</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({ }),
  async mounted() { },
  methods: { }
};
</script>
