import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Forget from "../views/Forget.vue";

//后台管理的路由建的单独的js: management.js
//import management from "./management";

//路由懒加载
const _import = file => () => import("@/views/" + file + ".vue");
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/project/:id",
      name: "project",
      component: _import("project/project"),
      children: [
        {
          path: "tasks/group/:groupId",
          component: _import("project/pages/index/index")
        },
        {
          path: "shares",
          component: _import("project/share/share")
        },
        {
          path: "schedules",
          component: _import("project/pages/schedule")
        },
        {
          path: "groupchat",
          component: _import("project/pages/groupChat")
        },
        {
          path: "files/:fileId",
          component: _import("project/file/file")
        }
      ]
    },
    {
      path: "/",
      name: "index",
      component: _import("index/index"),
      meta: {
        title: "阿拉丁BIM5D云平台"
      }
    },
    // {
    //   path: "/member",
    //   name: "member",
    //   component: _import("member/member"),
    //   meta: {
    //     title: "阿拉丁BIM5D云平台"
    //   }
    // },
    // {
    //   path: "/report",
    //   name: "report",
    //   component: _import("report/report"),
    //   meta: {
    //     title: "阿拉丁BIM5D云平台"
    //   }
    // },
    // {
    //   path: "/calc",
    //   name: "calc",
    //   component: _import("calc/calc"),
    //   meta: {
    //     title: "阿拉丁BIM5D云平台"
    //   }
    // },
    // {
    //   path: "/target",
    //   name: "target",
    //   component: _import("target/target"),
    //   meta: {
    //     title: "阿拉丁BIM5D云平台"
    //   }
    // },
    //...management,
    {
      path: "/login",
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
    }
  ]
});
