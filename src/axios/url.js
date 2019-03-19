// 接口代理配置   各个接口地址
export default {
  login: "/login", // 登陆
  register: "/register", // 注册
  captcha: "/captcha", //获取图形验证码
  code: "/code", //获取验证码
  forget: "/forget", //忘记密码
  logout: "/logout", //用户退出
  projects: "/projects",
  tasks: "/tasks",
  tags: "/tags",
  relations: "/relations"
  // projects: function (projectId) { //项目api 具体看api说明
  //   return '/projetcs/' + projectId;
  // },
  // tasks: function (taskId, todo) {
  //   return '/tasks/' + taskId + '/' + todo
  // }
};
