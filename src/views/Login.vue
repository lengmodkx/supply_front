<template>
  <div class="login-form-box">
    <Form ref="formValidate" @keyup.native.enter="login('formValidate')" :model="formValidate" :rules="ruleValidate" class="login-box">
      <div class="login-title">阿拉丁BIM云平台</div>
      <!-- <div class="weChat" id="wx_qrcode">
        <wxlogin  :appid="'wxb7b91f87460a9d90'" :response_type="'code'" :scope="'snsapi_login'"  :redirect_uri="'https://work.aldbim.com'"></wxlogin>
      </div> -->
      <FormItem prop="accountName">
        <Input type="text" size="large" placeholder="请输入手机号" v-model="formValidate.accountName" clearable />
      </FormItem>
      <FormItem prop="password">
        <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable />
      </FormItem>
      <FormItem>
        <span class="no-register"
          >还没有注册？
          <router-link to="/register">立即注册</router-link>
        </span>
        <router-link to="/forget" class="forget-pwd">忘记密码</router-link>
      </FormItem>
      <FormItem>
        <Button type="primary" long size="large" class="login" @click="login('formValidate')" :loading="loading">登录</Button>
      </FormItem>
      <div class="weixin" @click="weChatLogin()"><i class="iconfont iconweixin"></i>微信登录</div>
    </Form>
  </div>
</template>
<script>
import { userlogin, getEncrypStr, weChatLogin, getWeChatToken } from "../axios/api";
import { mapState, mapActions } from "vuex";
import { Encrypt } from "@/utils/cryptoUtils";
import wxlogin from "vue-wxlogin";

export default {
  components: { wxlogin },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value) && value !== "admin") {
        return callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        accountName: "",
        password: "",
      },
      code: "",
      userInfo: null,
      ruleValidate: {
        accountName: [{ validator: validatePhone, trigger: "blur" }],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
      key: "",
      iv: "",
    };
  },
  computed: {
    ...mapState("app", ["loading"]),
    ...mapState("user", ["mineRouter", "defaultImage"]),
  },
  mounted() {
    if (localStorage.token && localStorage.companyId) {
      this.$router.replace("/org/" + localStorage.companyId);
    }
  },
  methods: {
    ...mapActions("user", ["updateUserInfo", "updateUserId", "initSrc"]),
    setCookie(cname, cvalue) {
      var d = new Date();
      d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/;domain=aldbim.com";
    },
    login: function(name) {
      this.userInfo = this.formValidate;

      this.$refs[name].validate((valid) => {
        if (valid) {
          //发请求的方法
          userlogin(this.formValidate).then((res) => {
            if (res.result == 0) {
              this.$Message.error(res.msg);
            } else {
              this.updateUserId(res.data); //存储、更新用户信息
              this.initSrc(res.data.image);
              localStorage.userId = res.data.userId;
              localStorage.userImg = res.data.image;
              localStorage.userName = res.data.userName;
              localStorage.token = res.data.accessToken;
              localStorage.companyId = res.data.orgId;
              console.log(res.data.orgId);
              this.$Message.success("登录成功!");
              this.setCookie("token",res.data.accessToken);
              if (res.data.orgId) {
                this.$router.replace("/org/" + res.data.orgId);
              } else {
                this.$router.replace("/organization-is-empty");
              }
            }
          });
        } else {
          this.$Message.error("用户名或者密码错误");
        }
      });
    },
    weChatLogin() {
      weChatLogin("https://work.aldbim.com").then((res) => {
        if (res.result === 1) {
          window.location.href = res.data;
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    var code = theRequest.code;
    console.log(code);
    next((vm) => {
      if (code) {
        getWeChatToken(code).then((res) => {
          console.log(res);
          if (res.result === 1) {
            if (res.data.bindPhone) {
              vm.$router.push({ name: "bind", query: { name: res.data.userName, userId: res.data.userId } });
            } else {
              vm.updateUserId(res.data); //存储、更新用户信息
              vm.initSrc(res.data.image);
              localStorage.userId = res.data.userId;
              localStorage.userImg = res.data.image;
              localStorage.userName = res.data.userName;
              localStorage.token = res.data.accessToken;
              localStorage.companyId = res.data.orgId;
              this.setCookie("token",res.data.accessToken);
              if (res.data.orgId) {
                vm.$router.replace("/org/" + res.data.orgId);
              } else {
                vm.$router.replace("/organization-is-empty");
              }
            }
          } else {
            vm.$Message.error("登录失败");
          }
        });
      }
    });
  },
};
</script>

<style scoped lang="less">
.weChat {
  width: 300px;
  min-height: 300px;
}
.weixin {
  text-align: center;
  margin: -5px 0;
  width: 300px;
  height: 35px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2d8cf0;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  i {
    font-size: 20px;
    color: #cde6c7;
    margin-right: 5px;
  }
}
.login-form-box {
  width: 100vw;
  height: 100vh;
  background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg2.jpg") no-repeat center/cover;
  position: relative;
}

.login-box {
  width: 340px;
  position: absolute;
  top: 50%;
  right: 200px;
  margin-top: -223px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  opacity: 0.6;
}
.login-title {
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
}
.no-register {
  float: left;
}
.forget-pwd {
  float: right;
}
</style>
