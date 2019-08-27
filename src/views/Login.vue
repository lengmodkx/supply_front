<template>
  <div class="login-form-box">
    <Form ref="formValidate" @keyup.native.enter="login('formValidate')" :model="formValidate" :rules="ruleValidate" class="login-box">
      <div class="login-title">阿拉丁BIM云平台</div>
      <FormItem prop="accountName">
        <Input type="text" size="large" placeholder="请输入手机号或者邮箱" v-model="formValidate.accountName" clearable />
      </FormItem>
      <FormItem prop="password">
        <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable />
      </FormItem>
      <FormItem>
        <span class="no-register">还没有注册？
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
import { userlogin, getEncrypStr, weChatLogin,getWeChatToken } from "@/axios/api";
import { mapState, mapActions } from "vuex";
import { Encrypt } from "@/utils/cryptoUtils";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        ) &&
        !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value) && value !== 'admin'
      ) {
        return callback(new Error("请输入正确的手机号码或邮箱"));
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        accountName: "",
        password: ""
      },
      code:"",
      userInfo: null,
      ruleValidate: {
        accountName: [{ validator: validatePhone, trigger: "blur" }],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      key: "",
      iv: ""
    };
  },
  computed: {
    ...mapState("app", ["loading"])
  },
  mounted() {
    if (localStorage.token){
      this.$router.push('/home')
    }
  },
  methods: {
    ...mapActions("user", ["updateUserInfo", "updateUserId"]),
    login: function(name) {
      this.userInfo = this.formValidate;

      this.$refs[name].validate(valid => {
        if (valid) {
          //发请求的方法
          userlogin(this.formValidate).then(res => {
            if (res.result == 0) {
              this.$Message.error(res.msg);
            } else {
              sessionStorage.token = res.accessToken;
              this.updateUserId(res.userInfo); //存储、更新用户信息
              localStorage.userId = res.userInfo.userId;
              localStorage.userImg = res.userInfo.image;
              localStorage.userName = res.userInfo.userName;
              localStorage.fileId=res.fileId;
              this.$Message.success("登录成功!");
              if (localStorage.companyId){
                this.$router.push("/org/"+localStorage.companyId);
              } else {
                this.$router.push("/home");
              }
            }
          });
        } else {
          this.$Message.error("用户名或者密码错误");
        }
      });
    },
    weChatLogin(){
      weChatLogin().then(res => {
        if(res.result === 1){
          window.location.href=res.url
        }
      })
      //window.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxb7b91f87460a9d90&redirect_uri=http%3A%2F%2F192.168.1.101%3A8080%2Fwechat_token&response_type=code&scope=snsapi_login&state=1b6ce04096e34958839be9fa6852286f#wechat_redirect'
    }
  },
  beforeRouteEnter (to, from, next) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
    }
    var code = theRequest.code
    next(vm => {
      if(code){
        getWeChatToken(code).then(res => {
          if(res.result === 1){
            localStorage.userId = '';
            localStorage.userImg = '';
            localStorage.userName = '';
            localStorage.userId = res.userInfo.userId;
            localStorage.userImg = res.userInfo.defaultImage;
            localStorage.userName = res.userInfo.userName;
            vm.$router.push('/home')
          }
        })
      }
    })
  },
};
</script>

<style scoped lang="less">
  .weixin{
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
    &:hover{
      opacity: 0.8;
    }
    i{
      font-size: 20px;
      color: #cde6c7;
      margin-right: 5px;
    }
  }
.login-form-box {
  width: 100vw;
  height: 100vh;
  background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg.jpg") no-repeat center/cover;
  position: relative;
}
.login-box {
  width: 340px;
  position: absolute;
  top: 50%;
  right: 200px;
  margin-top: -160px;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  opacity: 0.8;
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
