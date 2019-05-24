import Vue from "vue";
import Router from "vue-router";
const _import = file => () => import("../components/" + file + ".vue");
Vue.use(Router);
const router = new Router({
    routes: [
        {path: '/', redirect: 'information'},
        {
            path: '/information',
            component: _import('enterpriseInformation')
        },
        {
            path: '/company-jurisdiction',
            component: _import('project-jurisdiction')
        },
        {
            path: '/project-jurisdiction',
            component: _import('project-jurisdiction')
        }
    ]
})

export default router