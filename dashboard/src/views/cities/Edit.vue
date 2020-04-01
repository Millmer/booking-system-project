<template>
  <v-container fluid>
    <Edit :endpoint="endpoint" :fields="fields" :redirectToList="true"/>
  </v-container>
</template>

<script>
import Edit from '@/components/crud/Edit';

export default {
  name: 'CitiesEdit',
  components: {
    Edit
  },
  data: () => ({
    fields: {
      country_id: {
        title: 'Country',
        type: 'autocomplete',
        rules: [v => !!v || 'Country is required'],
        autocompleteOptions: {
          endpoint: '/countries',
          valueKey: 'id',
          textKey: 'name',
          multiple: false
        }
      },
      city: {
        title: 'City Name',
        rules: [v => !!v || 'City name is required']
      },
      image_url: {
        title: 'Image',
        type: 'image-upload',
        bucketKey: 'cities',
        rules: [v => !!v || 'Image is required']
      }
    }
  }),
  computed: {
    endpoint() {
      return `/cities/${this.$route.params.id}`;
    }
  }
};
</script>