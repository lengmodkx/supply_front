import Vue from "vue";
import Router from "vue-router";
const _import = file => () => import("../components/" + file + ".vue");
Vue.use(Router);
const router = new Router({
    routes: [
        {
            path: '/',
            component: _import('index'),
            children: [
                {
                    path: '/',
                    redirect: 'information'
                },
                {// 企业信息
                    path: 'information',
                    component: _import('enterpriseInformation')
                },
                {// 企业权限
                    path: 'company-jurisdiction',
                    component: _import('company-jurisdiction')
                },
                {// 项目权限
                    path: 'project-jurisdiction',
                    component: _import('project-jurisdiction')
                }
            ]
        },
    ]
})

export default router