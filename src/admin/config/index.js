var url = "";
if (process.env.NODE_ENV == "test") {
  url = 'http://test.art1001.com';
} else if (process.env.NODE_ENV == "production") {
  url = "https://supply.aldbim.com";
} else {
  url = "/";
}
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'iView-admin',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://localhost:8091/api/',
    pro: url
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    
  }
}
