import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: '',
    appName: 'Bookings',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    passwordRules: {
      required: value => !!value || 'Required',
      min: v => v && v.length >= 8 || 'Minimum 8 characters',
      test: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/.test(v) || 'Your password must have 1 capital, 1 lowercase and 1 number.'
    }
  },
  mutations: {
    // Sets token and saves token in local storage
    setToken(state, token) {
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }
    },
    setUser(state, user) {
      state.user = user;
    },
    signOut(state) {
      state.user = null;
      state.token = '';
      localStorage.removeItem("token");
    }
  },
  actions: { },
  getters: {
    isSignedIn(state) {
      return !!state.user && state.user.signInUserSession;
    },
    userRole(state) {
      return state.user ? state.user.role : null;
    }
  }
});