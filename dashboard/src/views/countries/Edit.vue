<template>
  <v-container fluid>
    <Edit :endpoint="endpoint" :fields="fields" :redirectToList="true" :before="before"/>
  </v-container>
</template>

<script>
import Edit from '@/components/crud/Edit';
import lookup from 'country-code-lookup';

export default {
  name: 'CountriesEdit',
  components: {
    Edit
  },
  data: () => ({
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
  }),
  computed: {
    endpoint() {
      return `/countries/${this.$route.params.id}`;
    }
  }
};
</script>