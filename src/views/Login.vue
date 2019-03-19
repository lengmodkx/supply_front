<template>
  <div class="login-form-box">
    <Form
      ref="formValidate"
      @keyup.native.enter="login('formValidate')"
      :model="formValidate"
      :rules="ruleValidate"
      class="login-box"
    >
      <div class="login-title">阿拉丁BIM云平台</div>
      <FormItem prop="accountName">
        <Input
          type="text"
          size="large"
          placeholder="请输入手机号或者邮箱"
          v-model="formValidate.accountName"
          clearable
        />
      </FormItem>
      <FormItem prop="password">
        <Input
          type="password"
          size="large"
          placeholder="请输入密码"
          v-model="formValidate.password"
          clearable
        />
      </FormItem>
      <FormItem>
        <span class="no-register">还没有注册？
          <router-link to="/register">立即注册</router-link>
        </span>
        <router-link
          to="/forget"
          class="forget-pwd"
        >忘记密码</router-link>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          long
          size="large"
          class="login"
          @click="login('formValidate')"
          :loading="loading"
        >登录</Button>
      </FormItem>
    </Form>
  </div>

</template>
<script>
import { userlogin } from "@/axios/api";
import { mapState, mapActions } from "vuex";

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
        password: ""
      },
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
      }
    };
  },
  computed: {
    ...mapState("app", ["loading"])
  },
  methods: {
    ...mapActions("user", ["updateUserInfo"]),
    login: function(name) {
      this.userInfo = this.formValidate;

      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateUserInfo(this.userInfo); //存储、更新用户信息
          //发请求的方法
          userlogin(this.formValidate).then(res => {
            if (res.result == 0) {
              this.$Message.error(res.msg);
            } else {
              sessionStorage.token = res.accessToken;
              console.log(res);
              this.$Message.success("登录成功!");
              this.$router.push("/home");
            }
          });
        } else {
          this.$Message.error("用户名或者密码错误");
        }
      });
    }
  }
};
</script>

<style scoped>
.login-form-box {
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/login-bg.jpg");
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
