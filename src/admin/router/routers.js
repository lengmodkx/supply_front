import Main from '../components/main'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
    path: '/admin/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('../view/login/login.vue')
  },
  {
    path: '/admin',
    name: '_home',
    redirect: '/admin/home',
    component: Main,
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [{
      path: '/admin/home',
      name: 'home',
      meta: {
        hideInMenu: false,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('../view/single-page/home')
    }]
  },
  {
    path: '/admin/demand',
    name: 'demand',
    meta: {
      icon: 'md-cloud-upload',
      title: '需求管理',
      showAlways:true
    },
    component: Main,
    children: [{
        path: 'examine',
        name: 'examine',
        meta: {
          icon: 'ios-document',
          title: '需求审核'
        },
        component: () => import('../view/demand/requirementAudit.vue')
      },
      {
        path: 'update_paste_page',
        name: 'update_paste_page',
        meta: {
          icon: 'md-clipboard',
          title: '粘贴表格数据',
        hideInMenu: true,

        },
        component: () => import('../view/demand/requirementAudit.vue')
      }
    ]
  },
  {
    path: '/admin/content',
    name: 'content',
    meta: {
      icon: 'md-cloud-upload',
      title: '内容管理'
    },
    component: Main,
    children: [{
        path: 'audit',
        name: 'audit',
        meta: {
          icon: 'ios-document',
          title: '内容审核'
        },
        component: () => import('../view/content/contentAudit.vue')
      },
      {
        path: 'evaluation ',
        name: 'evaluation',
        meta: {
          icon: 'md-clipboard',
          title: '评价审核',
        },
        component: () => import('../view/content/evaluationAudit.vue')
      }
    ]
  },
  {
    path: '/admin/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('../view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/admin/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('../view/error-page/401.vue')
  },
  {
    path: '/admin/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('../view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('../view/error-page/404.vue')
  }
]
