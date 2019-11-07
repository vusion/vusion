import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './routes';

new Vue({
    el: '#app',
    router: new VueRouter({
        routes,
    }),
});
