import Index from './index.vue';
import Main from './main.vue';

export default [
    {
        path: '/', component: Index, children: [
            { path: '', component: Main },
        ],
    },
];
