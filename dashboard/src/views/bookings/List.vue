<template>
  <v-container fluid>
    <List ref="BookingList" :headers="headers" :endpoint="endpoint" :createable="false" :editable="false" :viewable="false" :deleteable="false">
      <template v-slot:list.name="{ row }">
        <v-btn tile class="text-center pa-2" :color="row.colour" @click="goTo('Locations.edit', row.location_id)">
          <p :style="{ color: invertColor(row.colour, true) }">{{ row.name }}</p>
        </v-btn>
      </template>
      <template v-slot:list.host_email="{ row }">
        <v-btn text @click="goTo('Users.edit', row.host_id)">{{ row.host_email }}</v-btn>
      </template>
      <template v-slot:list.code="{ row }">
        <v-btn icon @click="goTo('Countries.edit', row.country_id)" :class="render_flag(row.code.toLowerCase())"/>
      </template>
      <template v-slot:list.start="{ row }">
        {{ row.start | formatDate }}
      </template>
      <template v-slot:list.end="{ row }">
        {{ row.end | formatDate }}
      </template>
      <template v-slot:list.action=" { row }">
        <v-icon v-if="row.status !== 'CANCELLED'" small color='error' @click.stop="cancelBooking(row)">mdi-cancel</v-icon>
      </template>
    </List>
    <v-dialog v-model="showCancelDialog" class="mx-8" max-width="320px">
      <Cancel :booking="cancelRow" :after="closeAndRefreshList" :cancel="closeDialog"/>
    </v-dialog>
  </v-container>
</template>

<script>
import List from "@/components/crud/List";
import Cancel from "./Cancel";

export default {
  name: 'BookingsList',
  components: {
    List,
    Cancel
  },
  data: () => ({
    endpoint: '/bookings',
    headers: [
      { text: "ID", value: "id" },
      { text: "Location", value: "name", adminOnly: true },
      { text: "Volunteer Name", value: "customer_name" },
      { text: "Volunteer Phone", value: "customer_number" },
      { text: "Volunteer Email", value: "customer_email" },
      { text: "No. of People", value: "number_of_people" },
      { text: "Host", value: "host_email", adminOnly: true },
      { text: "Country", value: "code", adminOnly: true },
      { text: "Status", value: "status" },
      { text: "Start", value: "start"},
      { text: "End", value: "end"},
      { text: "Actions", value: "action", sortable: false }
    ],
    cancelRow: {},
    showCancelDialog: false
  }),
  methods: {
    render_flag: function(country_code) {
      return { [`flag-icon flag-icon-${country_code}`]: true }
    },
    goTo(route, id) {
      this.$router.push({ name: route, params: { id } });
    },
    cancelBooking(row) {
      this.cancelRow = row;
      this.showCancelDialog = true;
    },
    async closeAndRefreshList() {
      this.showCancelDialog = false;
      this.cancelRow = {};
      await this.$refs.BookingList.refresh();
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
};
</script>