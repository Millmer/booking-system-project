<template>
    <v-layout row class="align-center layout mx-8 mt-4 app--breadcrumbs">
        <div class="page-header-left">
            <h3 class="pr-3">{{ $route.meta.title || '' }}</h3>
        </div>
        <v-breadcrumbs divider="-" :items="breadcrumbs">
            <template v-slot:item="props">
                <a :href="props.item.href" :class="[props.item.disabled && 'disabled']">{{ props.item.text }}</a>
            </template>
        </v-breadcrumbs>
    </v-layout>
</template>

<script>
export default {
    name: 'AppBreadcrumbs',
    data() {
        return {
            title: "Home",
            breadcrumbs: []
        }
    },
    created() {
        this.computeBreadcrumbs();
    },
    methods: {
        computeBreadcrumbs() {
            let breadcrumbs = [
                {
                    text: "Root",
                    href: "/",
                    disabled: false
                }
            ];
            let appends = [];
            appends = this.$route.matched.map(item => {
                return {
                    text: item.meta.title || "",
                    href: item.meta.breadcrumbPath || item.path || "/",
                    disabled: item.path === this.$route.path
                }
            });
            this.breadcrumbs = breadcrumbs.concat(appends);
        }
    },
    watch: {
        '$route.path': function () {
            this.computeBreadcrumbs();
        }
    }
}
</script>

<style scoped>
.disabled {
    color: grey;
    pointer-events: none;
    text-decoration: blink;
}
</style>