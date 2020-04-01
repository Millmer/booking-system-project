<template>
  <v-card>
    <v-data-table
      :search="search"
      :headers="filteredHeaders"
      :items="data"
      :loading="loading"
      :item-key="primaryKey"
      expand-icon="mdi-plus"
      class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ listName | capitalise }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" label="Search" class="mx-4" single-line hide-details></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn v-if="createable" color="primary" dark class="mb-2" @click="setAction('create')">Create</v-btn>
        </v-toolbar>
      </template>
      <template v-for="header in filteredHeaders" v-slot:[`item.${header.value}`]="{ item }">
        <div :key="header.value" v-if="header.value === 'action'">
          <slot :name="`list.${header.value}`" :row="item"/>
          <v-icon v-if="viewable" small class="mr-2" color='success' @click="setAction('detail', item)">mdi-eye</v-icon>
          <v-icon v-if="editable" small class="mr-2" color='warning' @click="setAction('edit', item)">mdi-pencil</v-icon>
          <v-icon v-if="deleteable" small color='error' @click.stop="setAction('delete', item)">mdi-delete</v-icon>
        </div>
        <slot v-else :name="`list.${header.value}`" :row="item">
          {{ item[header.value] }}
        </slot>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteAlert" class="mx-8" max-width="320px">
      <Delete
      :endpoint="getDeleteEndpoint()"
      :warningMessage="deleteOptions.warningMessage"
      :after="closeAndRefreshList"
      :cancel="closeDialog"/>
    </v-dialog>
  </v-card>
</template>

<script>
import Delete from "./Delete";

export default {
  name: 'List',
  components: {
    Delete
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
    primaryKey: {
      type: String,
      default: 'id'
    },
    routePrimaryKey: {
      type: String,
      default: 'id'
    },
    headers: {
      type: Array,
      required: true
    },
    viewable: {
      type: Boolean,
      default: true,
    },
    createable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    deleteable: {
      type: Boolean,
      default: true
    },
    deleteOptions: {
      type: Object,
      default() { return { key: 'id' }; },
    },
    after: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    loading: false,
    search: "",
    data: [],
    action: '',
    actionItem: {},
    deleteAlert: false
  }),
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await this.$http.get(this.endpoint);
        this.data = response.data;
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
    async refresh() {
      await this.fetchData();
    },
    setAction(action, item = {}) {
      this.action = action;
      this.actionItem = item;
      if (action === 'delete') this.deleteAlert = true;
      if (action !== 'delete' && action !== '') this.$router.push({ name: `${this.resourceName}.${action}`, params: { [this.routePrimaryKey]: item[this.primaryKey] } });
    },
    getDeleteEndpoint() {
      if (this.action === 'delete') return `${this.endpoint}/${this.actionItem[this.deleteOptions.key]}`;
      else return '';
    },
    closeAndRefreshList() {
      this.deleteAlert = false;
      this.data.splice(this.data.indexOf(this.actionItem), 1);
      this.setAction('', null);
      // Perform callback upon action
      if (this.after) this.after();
    },
    closeDialog() {
      this.setAction('', null);
      this.deleteAlert = false;
    }
  },
  computed: {
    filteredHeaders() {
      if (this.$store.getters.userRole === 'HOST') return this.headers.filter(header => !header.adminOnly);
      return this.headers;
    },
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
    },
    listName() {
      return `${this.displayName} List`;
    }
  }
};
</script>