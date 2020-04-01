<template>
  <v-content class="split-bg">
    <v-container fluid>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4>
          <v-card class="elevation-1 pa-3">
            <v-card-title>
              <div class="layout column align-center">
                <img :src="require('@/assets/logo.png')" alt="Booking Admin" width="120" height="120" />
              </div>
            </v-card-title>
            <v-card-text>
              <div v-if="success" class="layout column align-center">
                <h1 class="flex my-4 primary--text">
                  Success!
                </h1>
                <p>
                  Your password has successfully been reset. Please head back to the login page to continue.
                </p>
              </div>
              <div v-else>
                <h1 class="flex my-4 primary--text">
                  Reset Password
                </h1>
                <v-form v-model="valid" @submit.prevent="submitForm" ref="form" lazy-validation>                
                  <v-text-field
                    v-model="form.password"
                    :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[passwordRules.required, passwordRules.min]"
                    :type="passwordVisible ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    hint="Minimum 8 characters"
                    counter
                    @click:append="passwordVisible = !passwordVisible"
                    @input="error = null"
                    required
                  />
                  <p v-if="error" class="error--text">{{error}}</p>
                </v-form>
              </div>
            </v-card-text>
            <v-btn v-if="!success" block color="primary" @click="submitForm" :loading="loading" :disabled="!valid">Submit</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import AuthEventBus from '@/utils/AuthEventBus';
import { completeNewPassword } from '@/utils/auth.js';

export default {
  name: "ResetPassword",
  data() {
    return {
      loading: false,
      valid: false,
      username: null,
      passwordVisible: false,
      form: {
        password: '',  
      },
      token: null,
      error: null,
      success: false
    }
  },
  created() {
    this.username = this.$route.query.email;
    this.token = this.$route.query.token;
    AuthEventBus.$on('authError', (error) => {
      this.error = error;
    });
    AuthEventBus.$on('authState', (event) => {
      if (event === 'passwordResetSuccess') this.success = true;
      this.error = null;
    });
  },
  computed: {
    passwordRules() {
      return this.$store.state.passwordRules;
    }
  },
  methods: {
    async submitForm() {
      if (await this.$refs.form.validate()) {
        if (!this.username || !this.token) {
          this.error = 'Password reset failed, please try the flow again.';
          this.valid = false;
        } else {
          this.loading = true;
          try {
            await completeNewPassword(this.username, this.token, this.form.password);
          } catch (e) {
            console.error(e);
            this.error = e.message || 'Password reset failed, please try the flow again.';
            this.form.password = '';
            this.token = '';
            this.valid = false;
          }
          this.loading = false;
        }
      }
    }
  },
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