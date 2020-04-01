<template>
  <div>
    <v-input :label="options.title ? options.title : 'Input'">
      <transition-group class="ma-5" name="fade" tag="div">
        <v-row v-for="(object, index) of internal" :key="`key-${index}`">
          <v-col cols="10">
            <v-date-picker no-title range v-model="internal[index].range" @input="date_menu = false"></v-date-picker>
          </v-col>
          <v-col cols="2" sm="2">
            <v-btn fab dark small color="error" @click="removeSelector(object)"><v-icon dark>mdi-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </transition-group>
    </v-input>
    <v-btn style="margin-left: 150px; margin-bottom: 10px;" color="primary" @click="addSelector()">{{ options.singularName ? `Add ${options.singularName}` : 'Add'}}</v-btn>
  </div>
</template>

<script>
export default {
  name: 'MultiDateRangeSelector',
  props: {
    name: String,
    options: Object,
    value: {
      default() { return [{ key: 'range', range: [] }]; }
    }
  },
  computed: {
    internal: {
      get() {
        return this.value;
      },
      set(newValue) {
        // When the internal value changes, we $emit an event. Because this event is
        // named 'input', v-model will automatically update the parent value
        this.$emit('input', newValue);
      }
    }
  },
  methods: {
    addSelector() {
      if (!this.value) {
        this.internal = [{ key: 'range', range: [] }];
      } else {
        this.value.push({ key: 'range', range: [] });
      }
    },
    removeSelector(object) {
      this.value.splice(this.value.indexOf(object), 1);
    },
    formatDateRangeText(index) {
      return this.internal[index].range.join(' ~ ');
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss'>
.fade-enter-active {
  transition: opacity .5s;
}
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.multi-selector-block {
  display: block;
  width: 100%;
}
.multi-selector-selector {
  width: 90%;
  margin: 10px 0;
  float: left;
}
.multi-selector-delete {
  margin: 10px 0 10px 2%;
  width: 5%;
  float: left;
}
</style>
