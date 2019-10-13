import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
// Helpers
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
    iconfont: 'md',
    theme: {
        primary: '#d1881c',
        secondary: colors.red.lighten4,
        accent: colors.indigo.base,
    },
});