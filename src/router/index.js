import Vue from "vue";
import Router from "vue-router";
import store from '../store/index'
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Forget from "../views/Forget.vue";
import Home from "../views/Home.vue";
import mine from '../components/public/Mine'
import message from '../components/public/message'
import calendar from '../components/public/calendar'
import members from "../components/company/members"
import personal from  '../components/public/personal'
import down from '../components/public/down'
import sucai from  '../components/public/sucai'
import Bind from '../views/bindPhone.vue'
import orgEmpty from '../views/orgEmpty.vue'
//后台管理的路由建的单独的js: management.js
//import management from "./management";

//路由懒加载
const _import = file => () => import("@/components/" + file + ".vue");
const _importc = file => () => import("../company/components/" + file + ".vue");
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/sucai/:id", // 素材裤
      component: sucai,
    },
    {
      path: "/sucai/", // 素材裤
      component: sucai,
    },
    {
      path: "/personal", // 成员
      component: personal,
    },
    {
      path: "/members", // 成员
      name: 'members',
      component: members,
    },
    {
      path: "/project/:id",
      name: "project",
      component: _import("project/project"),
      children: [{
          path: "tasks/group/:groupId",
          component: _import("project/pages/index/index"),
          meta: {
            requiresAuth: true,
            active: '/tasks'
          }
        },
        {
          path: "shares",
          component: _import("project/share/share"),
          meta: {
            requiresAuth: true,
            active: '/shares'
          }
        },
        {
          path: "share_detail/:shareId",
          component: _import("project/share/bindShareDetail")
        },
        {
          path: "schedules",
          component: _import("project/pages/schedule"),
          meta: {
            requiresAuth: true,
            active: '/schedules'
          }
        },
        {
          path: "groupchat",
          component: _import("project/pages/groupChat"),
          meta: {
            requiresAuth: true,
            active: '/groupChat'
          }
        },
        {
          path: "files/:fileId",
          component: _import("project/file/file"),
          meta: {
            requiresAuth: true,
            active: '/files'
          }
        },
        {
          path: "statistics",
          component: _import("project/pages/statistics"),
          meta: {
            requiresAuth: true,
            active: '/statistics'
          }
        }
      ]
    },
    {
      path: "/org/:orgid",
      component: Home,
      meta: {
        title: "阿拉丁BIM5D云平台"
      }
    },
    {
      path: "/organization-is-empty",
      component: orgEmpty,
      meta: {
        title: "阿拉丁BIM5D云平台"
      }
    },
    {
      path: "/mine",
      name: "Mine",
      component: mine,
      meta: {
        title: "阿拉丁BIM5D云平台"
      },
      children: [{
          path: "nearThing",
          component: _import("public/mine/nearThing")
        },
        {
          path: "file",
          component: _import("public/mine/mineFile")
        },
        {
          path: "task",
          component: _import("public/mine/mineTask")
        },
        {
          path: "schedule",
          component: _import("public/mine/mineSchedule")
        },
        {
          path: "collect",
          component: _import("public/mine/mineCollect")
        }

      ]
    },
    {
      path: "/statisticsDetail",
      meta: {
        title: "统计详情"
      },
      component: _import("project/pages/statisticsDetail")
    },
    {
      path: "/message",
      meta: {
        title: "消息"
      },
      component: message
    },
     {
      path: "/down",
      meta: {
        title: "下载"
      },
      component: down
    },
    {
      path: "/calendar",
      meta: {
        title: "日历"
      },
      component: calendar
    },
    {
      path: "/",
      name: "login",
      meta: {
        title: "登录"
      },
      component: Login
    },
    {
      path: "/register",
      name: "register",
      meta: {
        title: "注册"
      },
      component: Register
    },
    {
      path: "/forget",
      name: "forget",
      meta: {
        title: "忘记密码"
      },
      component: Forget
    },
    {
      path: "/bind",
      name: "bind",
      meta: {
        title: "绑定手机号"
      },
      component: Bind
    },
    {
      path:'/organization-admin/:orgId',
      name:'organizationAdmin',
      component: _importc('index'),
      meta: {
        title: "阿拉丁BIM云平台"
      },
      children: [
        {
            path: '/',
            redirect: 'information'
        },
        {// 企业信息
            path: 'information',
            component: _importc('enterpriseInformation')
        },
        {// 企业权限
            path: 'company-jurisdiction',
            component: _importc('company-jurisdiction')
        },
        {// 项目权限
            path: 'project-jurisdiction',
            component: _importc('project-jurisdiction')
        }
    ]
    }
  ]
});
router.afterEach((to, from) => {
  if (to.fullPath.includes('/calendar')) {
    store.commit('app/changeHeaderTag', 2)
  } else if (to.fullPath.includes('/mine')) {
    store.commit('app/changeHeaderTag', 1)
  } else if (to.fullPath.includes('/message')) {
    store.commit('app/changeHeaderTag', 3)
  } else {
    store.commit('app/changeHeaderTag', -1)
  }
})
export default router