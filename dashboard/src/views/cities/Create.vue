<template>
  <v-container fluid>
    <Create :endpoint="endpoint" :fields="fields" :redirectToList="true"/>
  </v-container>
</template>

<script>
import Create from '@/components/crud/Create';

export default {
  name: 'CitiesCreate',
  components: {
    Create
  },
  data: () => ({
    endpoint: `/cities`,
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
  })
};
</script>