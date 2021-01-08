import Vue from "vue";
import Router from "vue-router";
import store from '../store/index'
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Forget from "../views/Forget.vue";
import Home from "../views/Home2.vue";
import mine from '../components/public/Mine'
import message from '../components/public/message'
import calendar from '../components/public/calendar'
import members from "../components/company/members"
import personal from '../components/public/personal'
import down from '../components/public/down'
import Material from '../components/public/sucai'
import Bind from '../views/bindPhone.vue'
import orgEmpty from '../views/orgEmpty.vue'
import delOrg from '../views/delOrg.vue'
import Detail from '../views/detail.vue'
import loginCompany from '../components/public/companyIn' //企业登陆
import prolist from '../views/projectList.vue' //项目管理
import messageAlert from '../views/messageAlert.vue' //内容管理

import systemSettings from '../views/systemSettings.vue' //系统设置
import enterprisesList from '../views/enterprisesList.vue' //切换企业
import creatEnter from '../views/creatEnter.vue' //创建企业
import postArticles from '../views/postArticles.vue' //发布文章
import articleDetails from '../views/articleDetails.vue' //文章详情
import articleCenter from '../views/articleCenter.vue' //个人中心
import contentManagement from '../views/contentManagement.vue' //内容管理


//后台管理的路由建的单独的js: management.js
//import management from "./management";

//路由懒加载
const _import = file => () => import("@/components/" + file + ".vue");
const _importc = file => () => import("../company/components/" + file + ".vue");
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{
      path: "/material", // 素材裤
      component: Material,
      meta: {
        keepAlive: false,
        name:'网盘'
      }
    },
   
    {
      path: "/detail", //
      component: Detail,
      name:'Detail',
      meta: {
        keepAlive: false
      }
    },
    {
      path: "/loginCompany", // 企业登陆
      component: loginCompany,
      meta: {
        keepAlive: false
      }
    },
    {
      path: "/personal", // 成员
      component: personal,
      meta: {
        keepAlive: false
      }
    },
    {
      path: "/members", // 成员
      name: 'members',
      component: members,
      meta: {
        keepAlive: false,
        name:"团队"
      }
    },
    {
      path: "/project/:id",
      name: "project",
      meta: {
        requiresAuth: true,
        keepAlive: false,
        title: "阿拉丁BIM5D云平台"
      },
      component: _import("project/project"),
      children: [{
          path: "tasks/group/:groupId",
          name: "tasks",
          component: _import("project/pages/index/index"),
          meta: {
            requiresAuth: true,
            keepAlive: false,
            title: "阿拉丁BIM5D云平台",
            active: '/tasks'
          }
        },
        {
          path: "shares",
          name: "shares",
          component: _import("project/share/share"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false,
            active: '/shares'
          }
        },
        {
          path: "share_detail/:shareId",
          name: "share_detail",
          component: _import("project/share/bindShareDetail"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false
          }
        },
        {
          path: "schedules",
          name: "schedules",
          component: _import("project/schedule/schedule"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false,
            active: "/schedules"
          }
        },
        {
          path: "groupchat",
          name: "groupchat",
          component: _import("project/pages/groupChat"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false,
            active: "/groupChat"
          }
        },
        {
          path: "files/:fileId",
          name: "files",
          component: _import("project/file/file"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false,
            active: '/files'
          }
        },
        {
          path: "statistics",
          name: "statistics",
          component: _import("project/pages/statistics"),
          meta: {
            requiresAuth: true,
            title: "阿拉丁BIM5D云平台",
            keepAlive: false,
            active: '/statistics'
          }
        }
      ]
    },
    {
      path: "/org/:orgid",
      name: "organization",
      component: Home,
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
        name:'首页'
      }
    },
    {
      path: "/organization-is-empty",
      component: orgEmpty,
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
      }
    },
    {
      path: "/mine",
      name: "Mine",
      component: mine,
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      children: [{
          path: "nearThing",
          name: "nearThing",
          component: _import("public/mine/nearThing"),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        {
          path: "file",
          name: "mineFile",
          component: _import("public/mine/mineFile"),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        {
          path: "task",
          name: "mineTask",
          component: _import("public/mine/mineTask"),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        {
          path: "schedule",
          name: "mineSchedule",
          component: _import("public/mine/mineSchedule"),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        {
          path: "collect",
          name: "mineCollect",
          component: _import("public/mine/mineCollect"),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        }

      ]
    },
    {
      path: "/statisticsDetail",
      name: "statisticsDetail",
      component: _import("project/pages/statisticsDetail"),
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      }
    },
    {
      path: "/message",
      name: "message",
      component: message,
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      }
    },
    {
      path: "/down",
      name: "down",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: down
    },
    {
      path: "/calendar",
      name: "calendar",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
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
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: Bind
    },
    {
      path: "/delOrg/", // 删除企业权限
      component: delOrg,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/organization-admin/:orgId',
      name: 'organizationAdmin',
      component: _importc('index'),
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      children: [{
          path: '/',
          redirect: 'information'
        },
        { // 企业信息
          path: 'information',
          name: "information",
          component: _importc('enterpriseInformation'),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        { // 企业权限
          path: 'company-jurisdiction',
          name: "company-jurisdiction",
          component: _importc('company-jurisdiction'),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        { // 项目权限
          path: 'project-jurisdiction',
          name: "project-jurisdiction",
          component: _importc('project-jurisdiction'),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        },
        { // 项目模板
          path: 'project-template',
          name: "project-template",
          component: _importc('project-template'),
          meta: {
            title: "阿拉丁BIM5D云平台",
            requireAuth: true,
            keepAlive: false
          }
        }
      ]
    },
    {
      path: "/prolist/:orgId",
      name: "prolist",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
        name:'项目管理'
      },
      component: prolist
    },
    {
      path: "/systemSettings",
      name: "systemSettings",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
        name:'设置'
      },
      component: systemSettings
    },
    {
      path: "/enterprisesList",
      name: "enterprisesList",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: enterprisesList
    },
    {
      path: "/creatEnter",
      name: "creatEnter",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: creatEnter
    },
    {
      path: "/postArticles",
      name: "postArticles",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: postArticles
    },
    {
      path: "/articleDetails",
      name: "articleDetails",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false
      },
      component: articleDetails
    },
    {
      path: "/articleCenter",
      name: "articleCenter",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
        name:''
      },
      component: articleCenter
    },
    {
      path: "/contentMan",
      name: "contentMan",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
        name:"内容管理"
      },
      component: contentManagement
    },
    {
      path: "/messageAlert",
      name: "messageAlert",
      meta: {
        title: "阿拉丁BIM5D云平台",
        requireAuth: true,
        keepAlive: false,
      },
      component: messageAlert
    },
    
    
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
// router.beforeEach((to, from, next) => {
//   var token = localStorage.getItem('token'); //获取本地存储的token
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if (token !== "" && token !== null) { // 通过vuex state获取当前的token是否存在
//       //判断是否需要缓存
//       if (to.name != 'organization') {
//         next({
//           redirect: '/orgnanization/' + localStorage.companyId
//         });
//       }
//     } else {
//       next({
//         path: '/',
//         query: {
//           redirect: from.fullPath
//         } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }

//   } else {
//     next();
//   }
// })

export default router