<template>
  <div>
    <!-- OpeningHours -->
    <opening-hours v-if="options && options.type === 'opening-hours'" v-model="internal"/>

    <!-- Multi Date Range Select -->
    <multi-date-range-selector v-else-if="options && options.type === 'multi-date-range-select'" v-model="internal" :options="options"/>

    <!-- ImageUpload -->
    <v-input :label="title" class="mb-5" v-else-if="options && options.type === 'image-upload'" :error="!!error.length" :error-messages="error">
      <S3SignedImageUpload :name="title" :bucketKey="options.bucketKey" v-model="internal" @update:error="($event) => error = $event"/>
    </v-input>

    <!-- Rich Text (quill) Editor -->
    <div class="mb-5" v-else-if="options && options.type === 'rich-text'">
      <p class="text--primary">{{ title }}</p>
      <quill-editor v-model="internal" :options="options.quillEditorOptions ? options.quillEditorOptions : {}"/>
    </div>

    <!-- Date -->
    <v-menu
      v-else-if="options && options.type === 'date'"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="internal"
          :label="title"
          prepend-icon="mdi-calendar"
          :rules="options.rules"
          readonly
          v-on="on"
        />
      </template>
      <v-date-picker no-title scrollable v-model="internal" @input="menu = false"></v-date-picker>
    </v-menu>

    <!-- Time -->
    <v-menu
      v-else-if="options && options.type === 'time'"
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="internal"
          :label="title"
          prepend-icon="mdi-clock-outline"
          :rules="options.rules"
          readonly
          v-on="on"
        />
      </template>
      <v-time-picker
        v-model="internal"
        :allowed-hours="m => m !== 0"
        :allowed-minutes="m => m % 5 === 0"
        class="mt-4"
        format="24hr"
        @click:minute="menu = false"
      />
    </v-menu>

    <!-- Autocomplete -->
    <v-autocomplete v-else-if="options && options.type === 'autocomplete'"
      v-model="internal"
      :label="title"
      placeholder="Start typing to Search"
      :chips="!!options.autocompleteOptions.multiple"
      :deletable-chips="!!options.autocompleteOptions.multiple"
      :readonly="!!options.readonly"
      :loading="loading"
      :rules="options.rules"
      :item-text="options.autocompleteOptions.textKey ? options.autocompleteOptions.textKey : 'id'"
      :item-value="options.autocompleteOptions.valueKey ? options.autocompleteOptions.valueKey : 'id'"
      :items="autocompleteItems"
      :multiple="options.autocompleteOptions.multiple ? options.autocompleteOptions.multiple : false"
    />

    <!-- Switch -->
    <v-switch v-else-if="options && options.type === 'switch'"
      v-model="internal"
      :label="title"
      :readonly="!!options.readonly"
      :rules="options.rules"/>

    <!-- Textfield -->
    <v-text-field v-else
      v-model="internal"
      :label="title"
      :readonly="!!options.readonly"
      :placeholder="placeholder"
      :rules="options.rules"/>
  </div>
</template>

<script>
import S3SignedImageUpload from "./../inputs/S3SignedImageUpload";
import OpeningHours from './../inputs/OpeningHours';
import MultiDateRangeSelector from './../inputs/MultiDateRangeSelector';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
  name: 'Field',
  components: {
    S3SignedImageUpload,
    OpeningHours,
    MultiDateRangeSelector,
    quillEditor
  },
  props: ['name', 'options', 'value', 'finishedLoading'],
  async created() {
    if (this.options.type === 'autocomplete') {
      if (this.options.autocompleteOptions && this.options.autocompleteOptions.data) {
        this.autocompleteItems = this.options.autocompleteOptions.data;
        this.loading = false;
        this.finishedLoading();
      } else {
        await this.getAutocompleteItems();
      }
    } else {
      this.finishedLoading();
    }
  },
  data() {
    return {
      error: '',
      menu: false,
      loading: true,
      autocompleteItems: []
    };
  },
  methods: {
    clear() {
      this.$emit('input', null);
    },
    async getAutocompleteItems() {
      if (this.options.autocompleteOptions && this.options.autocompleteOptions.endpoint) {
        this.loading = true;
        const path = this.options.autocompleteOptions.endpoint;
        try {
          const response = await this.$http.get(path);
          this.autocompleteItems = response.data;
          if (this.options.autocompleteOptions.mapping) this.autocompleteItems = this.options.autocompleteOptions.mapping(this.autocompleteItems);
          this.finishedLoading();
        } catch (e) {
          console.error(e);
        }
        this.loading = false;
      }
    },
    parseDate(dateString) {
      return new Date(Date.parse(dateString)).toISOString().substr(0, 10);
    }
  },
  computed: {
    internal: {
      get() {
        if (this.options && this.options.type === 'date') {
          return this.value ? this.parseDate(this.value) : "";
        }
        return this.value;
      },
      set(newValue) {
        // When the internal value changes, we $emit an event. Because this event is
        // named 'input', v-model will automatically update the parent value
        // If it's a stubborn component, emmit forceUpdate to reset cache of computed property
        const stubbornComponents = ['date', 'time', 'image-upload'];
        if (this.options && stubbornComponents.includes(this.options.type)) this.$emit('forceUpdate');
        this.$emit('input', newValue);
      }
    },
    title () {
      return this.options.title ? this.options.title : this.name;
    },
    placeholder() {
      return `Enter a ${this.title}`;
    }
  }
};
</script>
