<template>
  <v-container fluid>
    <List :headers="headers" :endpoint="endpoint" :viewable="false">
      <template v-slot:list.code="{ row }">
        <div :class="render_flag(row.code.toLowerCase())"/>
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
  name: 'CountriesList',
  components: {
    List
  },
  data: () => ({
    endpoint: `/countries`,
    headers: [
      { text: "ID", value: "id" },
      { text: "Name", value: "name" },
      { text: "Flag", value: "code" },
      { text: "Created At", value: "created_at" },
      { text: "Updated At", value: "updated_at" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),
  methods: {
    render_flag: function(country_code) {
      return { [`flag-icon flag-icon-${country_code}`]: true }
    }
  }
};
</script>