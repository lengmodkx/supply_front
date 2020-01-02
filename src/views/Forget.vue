<template>
  <div class="bj-box">
    <div class="forget-box">
      <div class="forget-title">阿拉丁BIM云平台</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="accountName">
          <Input type="text" size="large" placeholder="请输入手机号" v-model="formValidate.accountName" clearable class="forget-input" />
        </FormItem>
        <FormItem prop="captcha">
          <Input type="text" size="large" placeholder="请输入验证码" v-model="formValidate.captcha" clearable class="captcha-input" />
          <img :src="formValidate.captchaUrl" class="captcha-img"  @click="changeImg">
        </FormItem>
        <FormItem prop="code">
          <Input type="text" size="large" placeholder="请输入短信验证码" v-model="formValidate.code" clearable class="captcha-input" />
          <span v-if="isTimes" class="code" style="background-color: #e5e5e5">{{timeNum}}秒后重新发送</span>
          <Button type="primary" v-else class="code" @click="getPhoneCode" :disabled="!formValidate.accountName||!formValidate.captcha">获取短信验证码</Button>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" size="large" placeholder="请输入密码" v-model="formValidate.password" clearable class="forget-input" />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="forget('formValidate')">重置密码</Button>
        </FormItem>
      </Form>
      <router-link class="go-login" to="/">去登录</router-link>
    </div>
  </div>
</template>
<script>
import { getPhone, resetPwd } from "@/axios/api";
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
        captchaUrl:" ",
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
  created:function(){
         this.changeImg();
  },
  methods: {

   changeImg() {
      this.formValidate.captchaUrl = "/api/captcha?d=" + Math.random();
    },
    forget: function(name) {
      console.log(name);
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate);
          resetPwd(this.formValidate).then(res => {
            if(res.result==1){
              this.$Message.success("修改成功!");
              this.$router.push("/");
            }else{
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
      getPhone(this.formValidate.accountName, this.formValidate.captcha).then(
        res => {
          console.log(res);
        }
      );
    }
  }
};
</script>
<style scoped>
.bj-box {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url("https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/login-bg.jpg") no-repeat center/cover;
}
.forget-box {
  width: 340px;
  padding: 20px;
  position: absolute;
  top: 50%;
  right: 200px;
  transform: translateY(-50%);
  background-color: white;
  opacity: 0.8;
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
.go-login{
    margin: -10px 0 0 auto;
    cursor: pointer;
    color: #3da8f5;
    float: right;
  }
</style>