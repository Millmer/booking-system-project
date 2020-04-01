<template>
    <v-app-bar app>
        <v-app-bar-nav-icon @click.stop="handleDrawerToggle"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
            <span>Bookings </span>
            <span class="font-weight-light">Dashboard</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <span class="mr-2" v-if="user">Hello {{(user.first_name) ? user.first_name : user.email}}</span>
        <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
            <template v-slot:activator="{ on }">
                <v-btn icon large text v-on="on">
                    <v-avatar size="40px">
                        <img :src="require('@/assets/logo.png')" alt="Bookings"/>
                    </v-avatar>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :to="!item.href ? { name: item.name } : null"
                    :href="item.href"
                    @click="item.click(index)"
                    ripple="ripple"
                    :disabled="item.disabled"
                    :target="item.target"
                    rel="noopener"
                    :loading="item.loading"
                    :key="index">
                    <v-list-item-action v-if="item.icon">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppToolbar',
    data() {
        return {
            items: [
                {
                    icon: "mdi-account-circle",
                    href: "#",
                    title: "Profile",
                    click: this.handleProfile,
                    loading: false
                },
                {
                    icon: "mdi-exit-to-app",
                    href: "#",
                    title: "Logout",
                    click: this.handleLogout,
                    loading: false
                }
            ]
        }
    },
    methods: {
        handleDrawerToggle() {
            this.$emit("side-icon-click");
        },
        handleLogout(index) {
            this.items[index].loading = true;
            this.$store.commit("signOut");
            this.items[index].loading = false;
            this.$router.push({path: '/auth'});
        },
        handleProfile() {
            this.$router.push({ name: 'Users.edit', params: { id: this.user.id } });
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    }
}
</script>