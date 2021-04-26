<template>
  <div class="login-form-box">
    <div class="img-content left-img">
      <img src="../assets/images/login/left.png" alt="" />
    </div>
    <Form ref="formValidate" @keyup.native.enter="login('formValidate')" :model="formValidate" :rules="ruleValidate" class="login-box">
      <div class="login-title">
        <svg-icon name="header-logo"></svg-icon>
      </div>
      <div class="qrcode" @mouseover="showQrcode = true" @mouseout="showQrcode = false">
        <img src="../assets/images/login/qrcode.png" alt="" />
      </div>
      <div class="content" v-if="!showQrcode">
        <FormItem prop="accountName">
          <Input type="text" size="large" placeholder="请输入手机号" v-model="formValidate.accountName" clearable />
        </FormItem>
        <FormItem prop="password">
          <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" class="login" @click="login('formValidate')" :loading="loading">登录</Button>
        </FormItem>
        <FormItem>
          <span class="no-register"
            >还没有注册？
            <router-link to="/register">立即注册</router-link>
          </span>
          <router-link to="/forget" class="forget-pwd">忘记密码？</router-link>
        </FormItem>
      </div>
      <div class="weChat" id="wx_qrcode" v-else>
        <wxlogin :appid="'wxb7b91f87460a9d90'" :response_type="'code'" :scope="'snsapi_login'" :redirect_uri="'https://work.aldbim.com'" href="data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxle2Rpc3BsYXk6bm9uZTt9"></wxlogin>
      </div>

      <!-- <div class="weixin" @click="weChatLogin()"><i class="iconfont iconweixin"></i>微信登录</div> -->
    </Form>
    <div class="right-img">
      <img src="../assets/images/login/right.png" alt="" />
    </div>
  </div>
</template>
<script>
import { userlogin, getEncrypStr, weChatLogin, getWeChatToken } from "../axios/api";
import { mapState, mapActions } from "vuex";
import wxlogin from "vue-wxlogin";
import Cookies from "js-cookie";
export default {
  components: {
    wxlogin,
  },
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
        accountName: [
          {
            validator: validatePhone,
            trigger: "blur",
          },
        ],
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
      showQrcode: false,
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
              localStorage.orgName = res.data.orgName;
              localStorage.accountName = res.data.accountName;
              this.$Message.success("登录成功!");
              Cookies.set("token", res.data.accessToken, {
                expires: 365,
                path: "/",
                domain: "aldbim.com",
              });
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
    next((vm) => {
      if (code) {
        getWeChatToken(code).then((res) => {
          if (res.result === 1) {
            if (res.data.bindPhone) {
              vm.$router.push({
                name: "bind",
                query: {
                  name: res.data.userName,
                  userId: res.data.userId,
                },
              });
            } else {
              vm.updateUserId(res.data); //存储、更新用户信息
              vm.initSrc(res.data.image);
              localStorage.userId = res.data.userId;
              localStorage.userImg = res.data.image;
              localStorage.userName = res.data.userName;
              localStorage.token = res.data.accessToken;
              localStorage.companyId = res.data.orgId;
              localStorage.orgName = res.data.orgName;
              Cookies.set("token", res.data.accessToken, {
                expires: 365,
                path: "/",
                domain: "aldbim.com",
              });
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
  display: flex;
  justify-content: center;
  /deep/iframe {
    height: 360px;
  }
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
  background-color: #0077ff;
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
  // background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg2.jpg") no-repeat center/cover;
  position: relative;
  margin-top: -90px;
  background: #ffffff;
}

.login-box {
  width: 380px;
  position: absolute;
  top: 50%;
  right: 20%;
  margin-top: -223px;
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  // opacity: 0.6;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  /deep/.ivu-btn-primary {
    background: #0077ff;
  }
  /deep/.ivu-input {
    color: #333333;
  }
}

.login-title {
  margin: 28px 0;
  svg {
    width: 218px;
  }
}

.no-register {
  float: left;
  color: #333333;

  a {
    color: #0077ff;
  }
}

.forget-pwd {
  float: right;
  color: #333333;
}

.left-img {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 95%;

  img {
    height: 100%;
  }
}

.right-img {
  position: absolute;
  right: 0;
  top: 0;
  width: 114px;

  img {
    width: 100%;
  }
}
.qrcode {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
