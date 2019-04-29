<template>
  <div class="bj-box">
    <div class="forget-box">
      <div class="forget-title">阿拉丁BIM云平台</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="accountName">
          <Input type="text" size="large" placeholder="请输入手机号或者邮箱" v-model="formValidate.accountName" clearable class="forget-input" />
        </FormItem>
        <FormItem prop="captcha">
          <Input type="text" size="large" placeholder="请输入验证码" v-model="formValidate.captcha" clearable class="captcha-input" />
          <img src="/api/captcha.html" class="captcha-img">
        </FormItem>
        <FormItem prop="code">
          <Input type="text" size="large" placeholder="请输入短信验证码" v-model="formValidate.code" clearable class="captcha-input" />
          <span class="code">获取短信验证码</span>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable class="forget-input" />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="forget('formValidate')">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formValidate: {
        accountName: "",
        captcha: "",
        code: "",
        password: ""
      },
      ruleValidate: {
        accountName: [
          {
            required: true,
            message: "请输入手机号或者邮箱",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入手机验证码",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    forget: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  }
};
</script>
<style scoped>
  .bj-box{
    width: 100vw;
    height: 100vh;
    position: relative;
    background: url("../assets/images/login-bg.jpg");
  }
.forget-box {
  width: 340px;
  padding: 20px;
  position: absolute;
  top: 50%;
  right: 200px;
  transform: translateY(-50%);
  background-color: white;
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
  background-color: #2d8cf0;
  color: #ffffff;
  border-radius: 4px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  position: absolute;
  right: 0;
}
.code:hover {
  opacity: 0.8;
}
</style>