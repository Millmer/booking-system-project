<template>
<v-app>
    <!-- Navigation Drawer -->
    <app-drawer class="app--drawer" :showDrawer="showDrawer" @draw-auto-closed="handleDrawerVisable"></app-drawer>
    <!-- Toolbar -->
    <app-toolbar class="app-toolbar" @side-icon-click="handleDrawerVisable"></app-toolbar>

    <v-content>
        <!-- Breadcrumbs -->
        <app-breadcrumbs></app-breadcrumbs>
        <!-- Main Router view -->
        <div class="page-wrapper">
            <router-view/>
        </div>
    </v-content>

    <!-- Footer -->
    <v-footer height="auto" class="white pa-3 app--footer">
      <span class="caption">Developyn &copy; {{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
      <span class="caption mr-1"> {{quote}} - <i>{{author}}</i></span>
      <v-icon color="pink" small>mdi-heart</v-icon>
    </v-footer>
  </v-app>
</template>

<script>
import AppDrawer from "@/components/AppDrawer"
import AppToolbar from "@/components/AppToolbar"
import AppBreadcrumbs from "@/components/AppBreadcrumbs"
import axios from 'axios';

export default {
    name: 'DefaultLayout',
    components: {
        AppDrawer,
        AppToolbar,
        AppBreadcrumbs
    },
    data() {
        return {
            showDrawer: false,
            quote: "It Takes Two To Lie; One To Lie, And One To Listen.",
            author: 'Homer Simpson'
        }
    },
    async mounted () {
        try {
            const response = await axios.get('https://quotes.rest/qod.json');
            this.quote = response.data.contents.quotes[0].quote;
            this.author = response.data.contents.quotes[0].author;
        } catch (error) { console.error(error) }
    },
    methods: {
        handleDrawerVisable(val) {
            if (val) this.showDrawer = val;
            else this.showDrawer = !this.showDrawer;
        }
    }
}
</script>

<style scoped>
.page-wrapper {
  min-height: calc(100vh - 64px - 50px - 81px);
}
</style>