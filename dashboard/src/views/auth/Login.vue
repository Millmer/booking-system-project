<template>
  <v-content class="split-bg">
    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4>
          <v-card class="elevation-1 pa-3">
            <v-card-text>
              <div class="layout column align-center">
                <img :src="require('@/assets/logo.png')" alt="Bookings Admin" width="120" height="120" />
                <h1 class="flex my-4 primary--text">
                  Login to Bookings Dashboard
                </h1>
              </div>
              <v-form @keyup.native.enter="login" @submit="login" v-model="valid" ref="form" lazy-validation>
                <v-text-field
                  v-model="form.username"
                  :rules="emailRules"
                  label="Email Address"
                  required
                  append-icon="mdi-account"
                  type="text"
                />
                <v-text-field
                  v-model="form.password"
                  :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[passwordRules.required, passwordRules.min]"
                  :type="passwordVisible ? 'text' : 'password'"
                  name="password"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="passwordVisible = !passwordVisible"
                  required
                />
                <p v-if="error" class="error--text">{{error}}</p>
                <p v-if="success" class="success--text">{{success}}</p>
              </v-form>
            </v-card-text>
            <v-container class="text-center">
              <v-btn block color="primary" type="submit" @click="login" :loading="loading" :disabled="!valid">Login</v-btn>
              <br/>
              <v-btn text small color="info" type="submit" @click="forgotPassword" :loading="loading">Forgot Password?</v-btn>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import AuthEventBus from '@/utils/AuthEventBus';
import { signIn, resetPassword } from '@/utils/auth.js';

export default {
  name: "SignIn",
  data: () => ({
    loading: false,
    valid: false,
    passwordVisible: false,
    error: null,
    success: null,
    form: {
      username: null,
      password: null
    }
  }),
  created () {
    AuthEventBus.$on('authError', (error) => {
        this.error = error;
        this.success = null;
    });
    AuthEventBus.$on('authState', (state) => {
      this.error = null;
      if (state === 'forgetPasswordSent') this.success = "We have sent a reset link to your email";
      else this.success = null;
    });
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        await signIn(this.form.username, this.form.password);
        this.loading = false;
      }
    },
    async forgotPassword() {
      if (this.form.username) {
        let isUsernameValid = false;
        this.emailRules.forEach(rule => {
          if (typeof rule === 'function') isUsernameValid = rule(this.form.username);
        });
        if (isUsernameValid === true) await resetPassword(this.form.username);
        else {
          this.error = isUsernameValid;
          this.success = null;
        }
      } else {
        this.error = "Email required for password reset";
        this.success = null;
      }
    }
  },
  computed: {
    emailRules() {
      return this.$store.state.emailRules;
    },
    passwordRules() {
      return this.$store.state.passwordRules;
    },
  }
}
</script>
<style scoped lang="css">
.split-bg {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 25%;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
