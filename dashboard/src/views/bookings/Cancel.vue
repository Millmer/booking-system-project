<template>
  <v-card :loading="loading">
    <v-card-title class="headline">Are you sure?</v-card-title>
    <v-card-text>
      Are you sure you wish to cancel this booking?
      <v-form class="mt-5" v-model="valid" ref="form">
        <v-textarea
          label="Cancellation Reason"
          v-model="reason"
          :rules="[v => !!v || 'Cancellation Reason is required']"
          solo
          required/>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="cancel">Cancel</v-btn>
      <v-btn :loading="loading" color="error" text @click="cancelBooking" :disabled="!valid">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CancellationDialog',
  props: {
    booking: { type: Object, required: true },
    after: { type: Function, default: null },
    cancel: { type: Function, default: null }
  },
  data() {
    return {
      loading: false,
      valid: false,
      reason: ""
    };
  },
  methods: {
    async cancelBooking() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          const body = {
            token: this.booking.cancellation_token,
            reason: this.reason
          }
          await this.$http.post('/bookings/cancel', body);
          if (this.after) await this.after();
        } catch (e) {
          console.error(e);
          const status = e.response
          ? e.response.status
            ? e.response.status
            : 500
          : 500;
          this.$router.push({ path: `/${status}` });
        }
        this.loading = false;
        this.reason = "";
      }
    },
  },
};
</script>