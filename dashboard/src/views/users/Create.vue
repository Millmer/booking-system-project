<template>
  <v-container fluid>
    <Create :endpoint="endpoint" :fields="fields" :redirectToList="true" :before="before"/>
  </v-container>
</template>

<script>
import Create from '@/components/crud/Create';

export default {
  name: 'UsersCreate',
  components: {
    Create
  },
  data: () => ({
    endpoint: `/users`,
    fields: {
      email: {
        title: 'Email',
        rules: [v => !!v || 'Name is required'],
      },
      password: {
        title: 'Password',
        rules: [v => !!v || 'Password is required'],
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
  })
};
</script>