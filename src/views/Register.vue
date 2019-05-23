<template>
  <div class="bj-box">
    <div class="register-box">
      <div class="register-title">欢迎注册阿拉丁BIM云平台</div>
      <Form ref="formValidate" @keyup.native.enter="register('formValidate')" :model="formValidate" :rules="rules">
        <FormItem prop="accountName">
          <Input type="text" size="large" placeholder="请输入手机号或者邮箱" v-model="formValidate.accountName" clearable />
        </FormItem>
        <FormItem prop="password">
          <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable />
        </FormItem>
        <FormItem prop="captcha">
          <Input type="text" size="large" placeholder="请输入验证码" v-model="formValidate.captcha" clearable class="captcha-input" />
          <img :src="formValidate.captchaUrl" class="captcha-img" @click="changeImg">
          <span class="changeCaptcha">看不清，点击图片换一张</span>
        </FormItem>
        <FormItem prop="userName">
          <Input type="text" size="large" placeholder="请输入您的昵称" v-model="formValidate.userName" clearable />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="register('formValidate')" :loading="loading">注册</Button>
        </FormItem>
      </Form>
      <router-link class="go-login" to="/">已有账号，去登陆</router-link>
    </div>
  </div>

</template>
<script>
import { userRegister, getCaptcha } from "@/axios/api";
import { mapState } from "vuex";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
          value
        ) &&
        !/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)
      ) {
        return callback(new Error("请输入正确的手机号码或邮箱"));
      } else {
        callback();
      }
    };

    return {
      formValidate: {
        accountName: "",
        password: "",
        captcha: "",
        userName: "",
        captchaUrl: "/api/captcha"
      },
      rules: {
        accountName: [{ validator: validatePhone, trigger: "blur" }],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("app", ["loading"])
  },
  methods: {
    register: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          userRegister(this.formValidate).then(msg => {
            if (msg.result == 0) {
              this.$Message.error("验证码填写错误!");
            } else {
              this.$Message.success("注册成功!");
              this.$router.push("/");
            }
          });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    changeImg() {
      this.formValidate.captchaUrl = "/api/captcha?d=" + Math.random();
    }
  }
};
</script>
<style scoped lang="less">
.bj-box {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg.jpg") no-repeat center/cover;
}
.register-box {
  width: 340px;
  padding: 20px;
  position: absolute;
  top: 50%;
  right: 200px;
  transform: translateY(-50%);
  background-color: white;
  opacity: 0.8;
}
.register-title {
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
}
.captcha-input {
  width: 60%;
}
.captcha-img {
  width: 35%;
  border-radius: 4px;
  margin-left: 5%;
  position: absolute;
  right: 0;
  cursor: pointer;
}
.changeCaptcha {
  // color:#2d8cf0;
  color: #bbb;
  cursor: pointer;
  font-size: 12px;
  position: absolute;
  bottom: -30px;
  right: 0;
}
  .go-login{
    margin: -10px 0 0 auto;
    cursor: pointer;
    color: #3da8f5;
    float: right;
  }
</style>
