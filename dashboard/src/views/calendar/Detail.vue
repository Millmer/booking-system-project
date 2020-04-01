<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="event.colour" dark>
      <v-toolbar-title :style="{ color: invertColor(event.colour, true) }">{{event.name}} ({{event.start.split(' ')[1]}} - {{event.end.split(' ')[1]}})</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <h3>Volunteer Number</h3>
      <p class="text--primary">
        {{ event.customer_number }}
      </p>
      <h3>Volunteer Email</h3>
      <p class="text--primary">
        {{ event.customer_email }}
      </p>
      <h3>Number of People</h3>
      <p class="text--primary">
        {{event.number_of_people}} ({{ Math.floor((event.number_of_people/2) + (event.number_of_people % 2)) }} Kayaks)
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn class="ma-2" tile outlined color="error" @click="showCancelDialog = true">
        <v-icon left>mdi-cancel</v-icon> Cancel
      </v-btn>
      <v-btn text color="secondary" @click="$emit('closed')">Close</v-btn>
    </v-card-actions>
    <v-dialog v-model="showCancelDialog" class="mx-8" max-width="320px">
      <Cancel :booking="event" :after="closeAndRefresh" :cancel="closeDialog"/>
    </v-dialog>
  </v-card>
</template>

<script>
import Cancel from "./../bookings/Cancel";
export default {
  name: 'BookingsCalendarDetail',
  components: {
    Cancel
  },
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showCancelDialog: false
    }
  },
  methods: {
    closeAndRefresh() {
      this.showCancelDialog = false;
      this.cancelRow = {};
      this.$emit('cancelled');
    },
    closeDialog() {
      this.showCancelDialog = false;
      this.cancelRow = {};
    },
    invertColor(hex, bw) {
      if (hex.indexOf('#') === 0) hex = hex.slice(1);

      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

      if (hex.length !== 6) throw new Error('Invalid HEX color.');

      let r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          b = parseInt(hex.slice(4, 6), 16);

      // http://stackoverflow.com/a/3943023/112731
      if (bw) return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';

      // invert color components
      r = (255 - r).toString(16);
      g = (255 - g).toString(16);
      b = (255 - b).toString(16);

      const padZero = function(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
      }

      // pad each with zeros and return
      return "#" + padZero(r) + padZero(g) + padZero(b);
    }
  }
}
</script>