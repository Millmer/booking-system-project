<template>
  <v-container fluid>
    <Create :endpoint="endpoint" :fields="fields" :redirectToList="true" :before="before"/>
  </v-container>
</template>

<script>
import Create from '@/components/crud/Create';
import lookup from 'country-code-lookup';

export default {
  name: 'CountriesCreate',
  components: {
    Create
  },
  data: () => ({
    endpoint: `/countries`,
    fields: {
      code: {
        title: 'Code',
        type: 'autocomplete',
        rules: [v => !!v || 'Code is required'],
        autocompleteOptions: {
          data: lookup.countries,
          valueKey: 'iso2',
          textKey: 'country',
          multiple: false
        }
      }
    },
    before(entity) {
      entity.name = lookup.byIso(entity.code).country;
    }
  })
};
</script>