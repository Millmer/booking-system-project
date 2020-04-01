<template>
  <v-container fluid>
    <Edit :endpoint="endpoint" :fields="fields" :redirectToList="true" :before="before"/>
  </v-container>
</template>

<script>
import Edit from '@/components/crud/Edit';

export default {
  name: 'UsersEdit',
  components: {
    Edit
  },
  data: () => ({
    fields: {
      email: {
        title: 'Email',
        rules: [v => !!v || 'Name is required'],
      },
      role: {
        title: 'Role',
        type: 'autocomplete',
        rules: [v => !!v || 'Role is required'],
        autocompleteOptions: {
          data: [
            { role: 'ADMIN', name: 'Admin'},
            { role: 'HOST', name: 'Host'}
          ],
          valueKey: 'role',
          textKey: 'name',
          multiple: false
        }
      },
      first_name: {
        title: 'First Name'
      },
      last_name: {
        title: 'Last Name'
      },
      country_id: {
        title: 'Country',
        type: 'autocomplete',
        rules: [],
        autocompleteOptions: {
          endpoint: '/countries',
          valueKey: 'id',
          textKey: 'name',
          multiple: false
        }
      },
      do_send_daily_booking_email: {
        title: 'Receive Daily Booking Emails',
        type: 'switch'
      }
    },
    async before(entity) {
      if (entity.role === 'ADMIN') {
        entity.country_id = null;
        this.fields.country_id.rules = [];
      } else if (entity.role === 'HOST' && !entity.country_id) {
        this.fields.country_id.rules = [v => !!v || 'Country is required for hosts'];
      }
    }
  }),
  computed: {
    endpoint() {
      return `/users/${this.$route.params.id}`;
    }
  }
};
</script>