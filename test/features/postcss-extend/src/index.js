import './case-simple.css';
import './case-simple-import.css';
import './case-mixed.css';
import './case-mixed-import.css';
import './case-complex.css';
import './case-complex-import.css';

import Vue from 'vue';
import ExtendedButton from './u-extended-button.vue';
import AutoButton from './u-auto-button.vue';
// import AutoButton2 from './u-auto-button-2.vue';

Vue.component('u-extended-button', ExtendedButton);
Vue.component('u-auto-button', AutoButton);
// Vue.component('u-auto-button-2', AutoButton2);

new Vue(ExtendedButton);
