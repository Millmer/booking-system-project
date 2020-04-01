<template>
  <v-card>
    <v-card-title>Edit {{ displayName | capitalise }}</v-card-title>
    <v-divider />
    <v-container>
      <v-form v-if="entity" v-model="valid" ref="form" lazy-validation>
        <div v-for="(field, key) in fields" :key="key">
          <field :name="key" :options="field" v-model="entity[key]" @forceUpdate="updateComponents" :finishedLoading="() => fieldsLoadedCount += 1"/>
        </div>
        <v-btn
          color="primary"
          class="ma-4"
          @click="submitForm"
          :loading="loading"
          :disabled="!valid"
        >Update</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import Field from "./Field";

export default {
  name: 'Edit',
  components: {
    Field
  },
  props: {
    routeName: {
      type: String,
      default: ''
    },
    endpoint: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      default() { return {}; },
    },
    redirectToList: {
      type: Boolean,
      default: false
    },
    before: {
      type: Function,
      default: null
    },
    after: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    loading: true,
    valid: false,
    entity: {},
    fieldsLoadedCount: 0
  }),
  mounted () {
    for (const key in this.fields) {
      this.entity[key] = '' // Preload entity keys to empty strings so form renders
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await this.$http.get(this.endpoint);
        this.entity = response.data;
        await this.applyMappings();
      } catch (e) {
        console.error(e);
        const status = e.response
          ? e.response.status
            ? e.response.status
            : 500
          : 500;
        this.$router.push({ path: `/${status}` });
      }
      this.loading = false;
    },
    async submitForm() {
      if (this.before) await this.before(this.entity);
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          const response = await this.$http.put(this.endpoint, this.entity);
          const item = response.item;
          if (this.after) this.after(item);
          if (this.redirectToList) this.$router.push({ name: `${this.resourceName}.list` });
          else this.$router.push({ name: `${this.resourceName}.detail`, params: { id: item.id } });
        } catch (e) {
          console.error(e);
          const status = e.response
            ? e.response.status
              ? e.response.status
              : 500
            : 500;
          this.$router.push({ path: `/${status}` });
        }
        this.loading = false;
      }
    },
    updateComponents() {
      this.$forceUpdate();
    },
    applyMappings() {
      for (let key in this.fields) {
        let field = this.fields[key];
        if (field.mapping && typeof field.mapping === 'function') field.mapping(this.entity);
      }
    }
  },
  computed: {
    displayName() {
      if (this.routeName === '') {
        if (this.$route.meta.title) return this.$route.meta.title.replace(/\./g, ' ');
        else {
          const splitPath = this.$route.fullPath.split('/');
          return splitPath[splitPath.length - 1];
        }
      } else {
        return this.routeName.replace(/\./g, ' ');
      }
    },
    resourceName() {
      if (this.routeName === '') {
        if (this.$route.meta.title) return this.$route.meta.title.replace(' ', '');
        else {
          const splitPath = this.$route.fullPath.split('/');
          return splitPath[splitPath.length - 1];
        }
      } else {
        return this.routeName;
      }
    }
  },
  watch: {
    // Need to load after all fields have loaded to get the correct mappings
    async fieldsLoadedCount(val) {
      if (val === Object.keys(this.fields).length) await this.fetchData();
    }
  }
};
</script>