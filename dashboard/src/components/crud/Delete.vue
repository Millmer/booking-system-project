<template>
    <v-card :loading="loading">
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-text>{{ warningMessage }}</v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="cancel">Cancel</v-btn>
            <v-btn :loading="loading" color="error" text @click="deleteItem">Confirm</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        endpoint: String,
        warningMessage: { type: String, default: 'Are you sure you wish to delete this entry?' },
        after: { type: Function, default: null },
        cancel: { type: Function, default: null }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        async deleteItem() {
            this.loading = true;
            try {
                await this.$http.delete(this.endpoint);
                if (this.after) await this.after();
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
    },
};
</script>