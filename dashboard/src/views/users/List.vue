<template>
  <v-container fluid>
    <List :headers="headers" :endpoint="endpoint" :viewable="false">
      <template v-slot:list.code="{ row }">
        <v-btn v-if="row.code" icon @click="goTo('Countries.edit', row.country_id)" :class="render_flag(row.code.toLowerCase())"/>
        <v-btn text disabled v-else>N/A</v-btn>
      </template>
      <template v-slot:list.do_send_daily_booking_email="{ row }">
        <v-icon>{{ (row.do_send_daily_booking_email) ? "mdi-check" : "mdi-close" }}</v-icon>
      </template>
      <template v-slot:list.created_at="{ row }">
        {{ row.created_at | formatDate }}
      </template>
      <template v-slot:list.updated_at="{ row }">
        {{ row.updated_at | formatDate }}
      </template>
    </List>
  </v-container>
</template>

<script>
import List from "@/components/crud/List";

export default {
  name: 'UsersList',
  components: {
    List
  },
  data: () => ({
    endpoint: `/users`,
    headers: [
      { text: "ID", value: "id" },
      { text: "Email", value: "email" },
      { text: "First Name", value: "first_name" },
      { text: "Last Name", value: "last_name" },
      { text: "Role", value: "role" },
      { text: "Country", value: "code", adminOnly: true },
      { text: "Receive Daily Booking Email", value: "do_send_daily_booking_email" },
      { text: "Created At", value: "created_at" },
      { text: "Updated At", value: "updated_at" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    render_flag: function(country_code) {
      return { [`flag-icon flag-icon-${country_code}`]: true }
    },
    goTo(route, id) {
      this.$router.push({ name: route, params: { id } });
    }
  }
};
</script>