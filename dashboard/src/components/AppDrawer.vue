<template>
  <v-navigation-drawer class="app--drawer" v-model="doShowDrawer" :width="drawWidth" app>
    <v-toolbar color="primary darken-1" dark>
      <img :src="require('@/assets/logo.png')" height="36" alt="Navigation" />
      <v-toolbar-title class="ml-0 pl-3">
        <span>Navigation</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-list dense expand>
      <template v-for="item in menus">
        <!-- If items in section, render Group with subitems -->
        <v-list-group
          v-if="item.items"
          :key="item.title"
          :group="item.group"
          :prepend-icon="item.icon"
          no-action="no-action">
          <v-list-item slot="activator" ripple="ripple">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- Render sub groups/items -->
          <template v-for="subItem in item.items">
            <!-- If subgroups, render them -->
            <v-list-group v-if="subItem.items" :key="subItem.name" :group="subItem.group" sub-group="sub-group">
              <v-list-item slot="activator" ripple="ripple">
                <v-list-item-content>
                  <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="grand in subItem.children"
                :key="grand.name"
                :to="genChildTarget(item, grand)"
                :href="grand.href"
                ripple="ripple">
                <v-list-item-content>
                  <v-list-item-title>{{ grand.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <!-- Otherwise render the child items -->
            <v-list-item
              v-else
              :key="subItem.name"
              :to="genChildTarget(item, subItem)"
              :href="subItem.href"
              :disabled="subItem.disabled"
              :target="subItem.target"
              ripple="ripple">
              <v-list-item-action v-if="subItem.icon">
                <v-icon :class="[subItem.actionClass || 'success--text']">{{ subItem.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span>{{ subItem.title }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-group>
        <!-- If not, check if it's a header item -->
        <v-subheader v-else-if="item.header" :key="item.name">{{ item.header }}</v-subheader>
        <!-- Or render a divider -->
        <v-divider v-else-if="item.divider" :key="item.name"></v-divider>
        <!-- Otherwise Just render a normal top-level item -->
        <v-list-item
          v-else
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          :key="item.name">
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="item.subAction">
            <v-icon class="success--text">{{ item.subAction }}</v-icon>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import menu from "@/utils/menu"
export default {
  name: "AppDrawer",
  props: {
    drawWidth: {
      type: [Number, String],
      default: "300"
    },
    showDrawer: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.$store.getters.userRole === 'HOST') this.menus = menu.filter(item => !item.adminOnly);
    if (this.$store.getters.userRole === 'ADMIN') this.menus = menu;
  },
  data() {
    return {
      menus: [],
      doShowDrawer: this.showDrawer
    }
  },
  methods: {
    genChildTarget(item, subItem) {
      if (subItem.href) return
      if (subItem.component) {
        return {
          name: subItem.component
        }
      }
      return { name: `${item.group}/${subItem.name}` }
    }
  },
  watch: {
    showDrawer(newVal) {
      this.doShowDrawer = newVal;
      // When user doesn't click the button but clicks the side
      // We need to notify other componenets or things become out of sync
      this.$emit('draw-auto-closed', newVal);
    }
  }
}
</script>

<style scoped>
.app--drawer {
  overflow: hidden;
}
</style>