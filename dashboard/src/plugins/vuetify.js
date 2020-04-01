import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#add8e6',
                secondary: '#add8e6',
                accent: '#79a180',
                error: '#af4740',
                info: '#afb9e6',
                success: '#ade6b7',
                warning: '#FCA351'
            },
            dark: {
                primary: '#7a260f',
                secondary: '#13192b',
                accent: '#2b2d5b',
                error: '#82172c',
                info: '#3f2b5d',
                success: '#10363b',
                warning: '#7a260f'
            },
        },
    },
    icons: {
        iconfont: 'mdi',
    }
});
