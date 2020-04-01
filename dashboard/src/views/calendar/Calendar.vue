<template>
  <v-container fluid>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Today</v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" class="mr-4" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined color="grey darken-2" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColour"
            :event-text-color="invertColor"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <Detail :event="selectedEvent" @cancelled="() => { this.selectedOpen = false; this.refresh() }" @closed="selectedOpen = false"/>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Detail from './Detail';
export default {
  name: 'BookingsCalender',
  components: {
    Detail
  },
  data: () => ({
    focus: new Date().toISOString().substring(0, 10),
    today: new Date().toISOString().substring(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: []
  }),
  async mounted () {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColour (event) {
      return event.colour;
    },
    setToday () {
      this.focus = this.today;
    },
    prev () {
      this.$refs.calendar.prev();
    },
    next () {
      this.$refs.calendar.next();
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => this.selectedOpen = true, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    async updateRange ({ start, end }) {
      try {
        const response = await this.$http.get(`/bookings?start=${start.date}&end=${end.date}`);
        this.start = start;
        this.end = end;
        this.events = response.data.filter(booking => booking.status !== 'CANCELLED').map(booking => {
          if (this.$store.getters.userRole === 'HOST') {
            const no_kayaks = Math.floor((booking.number_of_people/2) + (booking.number_of_people % 2));
            booking.name = `${booking.customer_name} - ${no_kayaks}`;
          }
          return booking;
        });
      } catch (error) {
        console.error(error);
      }
    },
    async refresh() {
      await this.updateRange({ start: this.start, end: this.end });
    },
    nth (d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
    invertColor(event) {
      let hex = event.colour;
      const bw = true;
      if (hex.indexOf('#') === 0) hex = hex.slice(1);

      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

      if (hex.length !== 6) throw new Error('Invalid HEX color.');

      let r = parseInt(hex.slice(0, 2), 16),
          g = parseInt(hex.slice(2, 4), 16),
          b = parseInt(hex.slice(4, 6), 16);

      // http://stackoverflow.com/a/3943023/112731
      if (bw) return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';

      // invert color components
      r = (255 - r).toString(16);
      g = (255 - g).toString(16);
      b = (255 - b).toString(16);

      const padZero = function(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
      }

      // pad each with zeros and return
      return "#" + padZero(r) + padZero(g) + padZero(b);
    }
  },
  computed: {
    title () {
      const { start, end } = this;
      if (!start || !end) return '';

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return '';
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    }
  }
}
</script>