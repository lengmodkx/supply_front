<template>
  <div class="bj-box">
    <div class="img-content left-img">
      <img src="../assets/images/login/left.png" alt="">
    </div>
    <div class="forget-box">
      <div class="login-title">
        <svg-icon name="header-logo"></svg-icon>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="accountName">
          <Input type="text" size="large" placeholder="请输入手机号" v-model="formValidate.accountName" clearable
            class="forget-input" />
        </FormItem>
        <FormItem prop="captcha">
          <Input type="text" size="large" placeholder="请输入验证码" v-model="formValidate.captcha" clearable
            class="captcha-input" />
          <img :src="formValidate.captchaUrl" class="captcha-img" @click="changeImg" />
        </FormItem>
        <FormItem prop="code">
          <Input type="text" size="large" placeholder="请输入短信验证码" v-model="formValidate.code" clearable
            class="captcha-input" />
          <Button type="primary" v-if="isTimes" class="code">{{ timeNum }}秒后重新发送</Button>
          <Button type="primary" v-else class="code" @click="getPhoneCode"
            :disabled="!formValidate.accountName || !formValidate.captcha">获取短信验证码</Button>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable
            class="forget-input" />
        </FormItem>
        <FormItem prop="passwordMore">
          <Input type="password" size="large" placeholder="请再次输入密码" v-model="formValidate.passwordMore" clearable
            class="forget-input" />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="forget('formValidate')">重置密码</Button>
        </FormItem>
      </Form>
      <router-link class="go-login" to="/">去登录</router-link>
    </div>
    <div class="right-img">
      <img src="../assets/images/login/right.png" alt="">
    </div>
  </div>
</template>
<script>
  import {
    getPhone,
    resetPwd
  } from "@/axios/api";
  export default {
    data() {
      return {
        isTimes: false,
        timeNum: 60,
        formValidate: {
          accountName: "",
          captcha: "",
          code: "",
          password: "",
          captchaUrl: " ",
          passwordMore: ""
        },
        ruleValidate: {
          accountName: [{
            required: false,
            validator: validatePhone,
            trigger: "blur"
          }],
          captcha: [{
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }],
          code: [{
            required: true,
            message: "请输入手机验证码",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          passwordMore: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }]
        }
      };
    },
    created: function () {
      this.changeImg();
    },
    methods: {
      changeImg() {
        this.formValidate.captchaUrl = "/api/captcha?d=" + Math.random();
      },
      forget: function (name) {
        console.log(name);
        this.$refs[name].validate(valid => {
          if (valid) {
            console.log(this.formValidate);
            resetPwd(this.formValidate).then(res => {
              if (res.result == 1) {
                this.$Message.success("修改成功!");
                this.$router.push("/");
              } else {
                this.$Message.error("修改失败");
              }
            });
          }
        });
      },
      // 获取短信验证码
      getPhoneCode() {
        this.isTimes = true;
        let time;
        time = setInterval(() => {
          this.timeNum--;
          if (this.timeNum <= 0) {
            this.timeNum = 60;
            this.isTimes = false;
            clearInterval(time);
          }
        }, 1000);
        getPhone(this.formValidate.accountName, this.formValidate.captcha).then(res => {
          if (res.result === 1) {
            this.$Message.success("获取成功");
          } else {
            this.$Message.error("获取失败");
          }
        });
      }
    }
  };

  const validatePhone = (rule, value, callback) => {
    if (!value) {
      return callback(new Error("请输入手机号"));
    } else if (!/^1[345789]\d{9}$/.test(value)) {
      callback("手机号格式不正确");
    } else {
      callback();
    }
  };
</script>
<style scoped lang="less">
  .bj-box {
    width: 100vw;
    height: 100vh;
    position: relative;
    /* background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg2.jpg") no-repeat center/cover; */
    top: -90px;
    background: #ffffff;
  }

  .forget-box {
    width: 380px;
    position: absolute;
    top: 50%;
    right: 20%;
    margin-top: -223px;
    background-color: #fff;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .forget-title {
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
  }

  .forget-input {
    width: 100%;
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
  }

  .code {
    width: 35%;
    height: 36px;
    margin-left: 5%;
    border-radius: 4px;
    line-height: 36px;
    text-align: center;
    padding: 0;
  }

  .code:hover {
    opacity: 0.8;
  }

  .go-login {
    margin: -10px 0 0 auto;
    cursor: pointer;
    color: #3da8f5;
    float: right;
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

  .login-title {
    margin: 28px 0;

    svg {
      width: 218px;
    }
  }
</style>