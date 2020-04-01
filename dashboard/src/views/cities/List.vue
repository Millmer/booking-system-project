<template>
  <v-container fluid>
    <List :headers="headers" :endpoint="endpoint" :viewable="false">
      <template v-slot:list.country_id="{ row }">
        <v-btn icon @click="goToCountry(row.country_id)" :class="render_flag(row.code.toLowerCase())"/>
      </template>
      <template v-slot:list.image_url="{ row }">
        <v-img max-height="200px" max-width="200px" contain :src="calculateImageUrl(row.image_url)"></v-img>
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
  name: 'CitiesList',
  components: {
    List
  },
  data: () => ({
    endpoint: `/cities`,
    routeName: "Countries.Cities",
    headers: [
      { text: "ID", value: "id" },
      { text: "Name", value: "city" },
      { text: "Country", value: "country_id", adminOnly: true },
      { text: "Image", value: "image_url" },
      { text: "Created At", value: "created_at" },
      { text: "Updated At", value: "updated_at" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    calculateImageUrl(image) {
      const dev_envs = ['localhost', 'dev', '127.0.0.1'];
      const env = (dev_envs.find(a => window.location.host.includes(a))) ? 'dev': 'production';
      return image.includes('http') ? image : `https://bookings-images-data-${env}.s3.eu-central-1.amazonaws.com/public/${image}`;
    },
    render_flag: function(country_code) {
      return { [`flag-icon flag-icon-${country_code}`]: true }
    },
    goToCountry(id) {
      this.$router.push({ name: 'Countries.edit', params: { id } });
    }
  }
};
</script>