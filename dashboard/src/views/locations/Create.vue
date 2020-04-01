<template>
  <v-container fluid>
    <Create :endpoint="endpoint" :fields="fields" :redirectToList="true"/>
  </v-container>
</template>

<script>
import Create from '@/components/crud/Create';
import defaultOpeningHours from '@/components/inputs/openingHoursData/defaultOpeningHours'; 

export default {
  name: 'LocationsCreate',
  components: {
    Create
  },
  data: () => ({
    endpoint: `/locations`,
    fields: {
      city_id: {
        title: 'City',
        type: 'autocomplete',
        rules: [v => !!v || 'City is required'],
        autocompleteOptions: {
          endpoint: '/cities',
          valueKey: 'id',
          textKey: 'city',
          multiple: false
        }
      },
      host_id: {
        title: 'Hosts',
        type: 'autocomplete',
        rules: [v => !!v || 'Host is required'],
        autocompleteOptions: {
          endpoint: '/users',
          valueKey: 'id',
          textKey: 'email',
          multiple: false,
          mapping: (users) => {
            return users.filter(user => user.role === 'HOST');
          }
        }
      },
      name: {
        title: 'Location Name',
        rules: [v => !!v || 'Location name is required']
      },
      address: {
        title: 'Address',
        rules: [v => !!v || 'Address is required']
      },
      image_url: {
        title: 'Image',
        type: 'image-upload',
        bucketKey: 'locations',
        rules: [v => !!v || 'Image is required']
      },
      kayak_number: {
        title: 'Number of Kayaks',
        rules: [v => !!v || 'Number of kayaks is required', v => /(?<=\s|^)\d+(?=\s|$)/.test(v) || 'Must be a number']
      },
      default_booking_length: {
        title: 'Booking Length',
        type: 'time',
        rules: [v => !!v || 'Default booking length is required']
      },
      opening_hours: {
        title: 'Opening Hours',
        type: 'opening-hours',
        prefill: defaultOpeningHours,
        rules: [v => !!v || 'Opening hours are required']
      },
      blocked_days: {
        title: 'Blocked Days',
        type: 'multi-date-range-select',
        prefill: [{ key: 'range', range: [] }],
        singularName: "Range"
      },
      description: {
        title: 'Description',
        type: 'rich-text'
      },
      maps_url: {
        title: 'Google Maps Share URL',
        rules: [v => !!v || 'Google Maps url is required']
      },
      maps_iframe: {
        title: 'Google Maps Embed Link',
        rules: [v => !!v || 'Google Maps iFrame is required', v => /^<iframe.*iframe>$/.test(v) || 'Must be an iFrame link']
      },
      email_description: {
        title: 'Further Email Information',
        type: 'rich-text'
      },
      trash_collected_kg: {
        title: 'Number of Kilograms collected',
        prefill: "0.0",
        rules: [v => /^\d+(\.\d{1,2})$/.test(v) || 'Trash must be a decimal (ie 1.5)']
      }
    }
  })
};
</script>