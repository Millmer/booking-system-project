<template>
  <v-container fluid>
    <v-row justify="space-around">
      <v-col cols="12">
        <p>Opening Hours</p>
      </v-col>
      <v-col v-if="value" cols="12">
        <business-hours
          :days="days"
          :time-increment="15"
          color="#40af49"
          :hourFormat24="true"
          @updated-hours="updatedHours"></business-hours>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import uniqid from 'uniqid';
import BusinessHours from 'vue-business-hours';
import openingHoursTemplate from './openingHoursData/openingHoursTemplate';

export default {
  name: 'OpeningHours',
  components: {
    BusinessHours
  },
  props: ['value'],
  data() {
    return {
      days: openingHoursTemplate,
      modifiedDays: openingHoursTemplate,
      parsedOnce: false
    }
  },
  mounted() {
    if (!this.value) this.$emit('update:error', 'Opening times required');
  },
  methods: {
    updatedHours(val) {
      Object.keys(val).forEach(key => this.modifiedDays[key] = val[key]);
      this.formatOutputAndEmit();
    },
    formatOutputAndEmit() {
      const output = {};
      Object.keys(this.modifiedDays).forEach(key => {
        const day = this.modifiedDays[key];
        const isClosed = day.filter(time => !time.isOpen).length >= 1;
        const timesArray = isClosed ? [] : day.map(time => {
          const startTime = (time.open.length) ? moment(time.open, 'HHmm').format('HH:mm:ss') : "";
          const endTime = (time.close.length) ? moment(time.close, 'HHmm').format('HH:mm:ss') : "";
          return `${startTime}~${endTime}`;
        })
        output[key] = timesArray;
      });
      this.$emit('input', output);
    },
    parseInput(input) {
      const sortedWeekdays = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
      Object.keys(input).sort((a, b) => sortedWeekdays[a] - sortedWeekdays[b]).forEach(key => {
        const day = input[key];
        const isClosed = (day.length === 0);
        let timesObject = isClosed ? [{ open: '', close: '', id: uniqid(), isOpen: false}] : day.map(time => {
          const [start, end] = time.split('~');
          return {
            open: (start.length) ? moment(start, 'HH:mm:ss').format('HHmm') : "",
            close: (end.length) ? moment(end, 'HH:mm:ss').format('HHmm') : "",
            id: uniqid(),
            isOpen: true
          }
        });
        openingHoursTemplate[key] = timesObject;
      });
      return openingHoursTemplate;
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        if (!this.parsedOnce) {
          this.days = this.parseInput(this.value);
          this.$emit('update:error', '');
          this.parsedOnce = true;
        }
      } else {
        this.$emit('update:error', 'Opening times required');
      }
    }
  }
}
</script>