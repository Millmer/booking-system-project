<template>
  <router-view/>
</template>

<script>
import { getUser } from '@/utils/auth.js';
export default {
  name: 'App',
  async mounted() {
    this.$store.commit('setToken', localStorage.getItem('token'));
    this.$store.commit('setUser', await getUser());
  }
};
</script>