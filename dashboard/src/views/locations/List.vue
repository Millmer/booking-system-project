<template>
  <v-container fluid>
    <List :headers="headers" :endpoint="endpoint" :viewable="false">
      <template v-slot:list.city_id="{ row }">
        <v-btn text @click="goTo('Cities.edit', row.city_id)">{{ row.city }}</v-btn>
      </template>
      <template v-slot:list.default_booking_length="{ row }">
        {{ row.default_booking_length | formatTime }}
      </template>
      <template v-slot:list.host_id="{ row }">
        <v-btn text @click="goTo('Users.edit', row.host_id)">{{ row.email }}</v-btn>
      </template>
      <template v-slot:list.code="{ row }">
        <v-btn icon @click="goTo('Countries.edit', row.country_id)" :class="render_flag(row.code.toLowerCase())"/>
      </template>
      <template v-slot:list.image_url="{ row }">
        <v-img max-height="200px" max-width="200px" contain :src="calculateImageUrl(row.image_url)"></v-img>
      </template>
      <template v-slot:list.maps_url="{ row }">
        <a :href="row.maps_url">{{ row.maps_url }}</a>
      </template>
      <template v-slot:list.trash_collected_kg="{ row }">
        {{ row.trash_collected_kg }} kg
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
  name: 'LocationsList',
  components: {
    List
  },
  data: () => ({
    endpoint: `/locations`,
    headers: [
      { text: "ID", value: "id" },
      { text: "City", value: "city_id", adminOnly: true },
      { text: "Host", value: "host_id", adminOnly: true },
      { text: "Country", value: "code", adminOnly: true },
      { text: "Name", value: "name" },
      { text: "Address", value: "address"},
      { text: "Image", value: "image_url" },
      { text: "No. of Kayaks", value: "kayak_number" },
      { text: "Booking Length", value: "default_booking_length" },
      { text: "Maps Link", value: "maps_url"},
      { text: "Trash Collected (kg)", value: "trash_collected_kg"},
      { text: "Created At", value: "created_at"},
      { text: "Updated At", value: "updated_at"},
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    calculateImageUrl(image) {
      const dev_envs = ['localhost', 'dev', '127.0.0.1'];
      const env = (dev_envs.find(a => window.location.host.includes(a))) ? 'dev': 'production';
      return image.includes('http') ? image : `https://bookings-images-${env}.s3.eu-central-1.amazonaws.com/public/${image}`;
    },
    render_flag: function(country_code) {
      return { [`flag-icon flag-icon-${country_code}`]: true }
    },
    goTo(route, id) {
      this.$router.push({ name: route, params: { id } });
    }
  }
};
</script>