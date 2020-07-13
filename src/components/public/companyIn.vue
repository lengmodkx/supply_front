<template>
  <div class="companyWarp">
    <div class="company-box">
      <div class="company" :class="this.showLogin? '': 'company-bottom'" v-if="!showRes">
        <div class="logo">
          <img src="../../assets/images/logo.png" alt />
        </div>
        <span
          class="field"
          v-if="!showLogin"
        >登录并接受 {{inviteesInfo.userName}} 邀请，加入{{showText}} {{fromType=='project'?inviteesInfo.projectName:inviteesInfo.organizationName}}</span>
        <span
          class="field"
          v-else
        >通过链接邀请加入{{showText}} {{fromType=='project'?inviteesInfo.projectName:inviteesInfo.organizationName}}</span>

        <div class="youself" v-if="!showLogin">
          <img alt :src="inviteesInfo.image" />
          <div class="name">
            <div class="userName">{{inviteesInfo.userName}}</div>
            <p>{{inviteesInfo.phone}}</p>
          </div>
        </div>
        <!-- 使用其他账号登录 -->
        <div v-else class="inputContent">
          <Icon type="md-arrow-round-back" size="30" color="#2d8cf0" class="backIcon" @click='showLogin=false'/>
          <Input v-model="iphone" placeholder="你的手机号或工作邮箱" size="large" />
          <div class="df tipsContent" v-if="illegalPhone">
            <Icon type="md-alert" color="#F74555" size="15" />
            <div class="tips">请输入正确的手机号码</div>
          </div>
          <Input
            v-model="passLogin"
            placeholder="密码"
            size="large"
            type="password"
            password
            v-if="haveUser"
            style="margin-top:20px;"
          />
        </div>
        <Button
          type="primary"
          style="height:48px;margin-top:25px;"
          @click="join"
          v-if="!haveUser"
        >加入{{showText}}</Button>
        <Button type="primary" style="height:48px;margin-top:25px;" @click="login" v-else>登录</Button>
      </div>
      <div class="company company-bottom" v-else>
        <div class="logo">
          <img src="../../assets/images/logo.png" alt />
        </div>
        <!-- 注册 -->
        <div class="resContent" v-if="showRes">
          <div class="resTit">直接注册并加入{{showText}}</div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <FormItem prop="accountName">
              <Input
                type="text"
                placeholder="请输入手机号"
                v-model="formValidate.accountName"
                clearable
                disabled
                class="forget-input"
              />
            </FormItem>
            <FormItem prop="userName">
              <Input
                type="text"
                placeholder="请输入姓名"
                v-model="formValidate.userName"
                clearable
                class="forget-input"
              />
            </FormItem>
            <FormItem prop="captcha">
              <Input
                type="text"
                placeholder="请输入验证码"
                v-model="formValidate.captcha"
                clearable
                class="captcha-input"
              />
              <img :src="formValidate.captchaUrl" class="captcha-img" @click="changeImg" />
            </FormItem>
            <!-- <FormItem prop="code">
              <Input
                type="text"
                placeholder="请输入短信验证码"
                v-model="formValidate.code"
                clearable
                class="captcha-input"
              />
              <Button type="primary" v-if="isTimes" class="code">{{ timeNum }}秒后重新发送</Button>
              <Button
                type="primary"
                v-else
                class="code"
                @click="getPhoneCode"
                :disabled="!formValidate.accountName || !formValidate.captcha"
              >获取短信验证码</Button>
            </FormItem>-->
            <FormItem prop="password">
              <Input
                type="password"
                placeholder="请输入密码"
                v-model="formValidate.password"
                clearable
                class="forget-input"
                password
              />
            </FormItem>
            <FormItem prop="passwordMore">
              <Input
                type="password"
                placeholder="请再次输入密码"
                v-model="formValidate.passwordMore"
                clearable
                class="forget-input"
                password
              />
            </FormItem>
            <!-- <FormItem> -->
            <Button
              type="primary"
              long
              @click="forget('formValidate')"
              size="large"
            >注册并加入{{showText}}</Button>
            <!-- </FormItem> -->
          </Form>
        </div>
      </div>
      <Button
        type="primary"
        ghost
        class="register"
        size="large"
        v-if="!showLogin || showRes"
        @click="others"
      >使用其它账号注册</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { linkaddPeople } from "@/axios/companyApi";

import {
  userExist,
  getInvitees,
  proInviteMen,
  getPhone,
  registerJoin,
  registerJoinEnter,
  userlogin
} from "@/axios/api";
export default {
  data: function() {
    return {
      orgid: this.$route.params.orgid,
      iphone: "",
      showLogin: false,
      fromType: "", //从哪个页面跳转过来
      showText: "",
      illegalPhone: false, //手机号不正确
      projectId: "",
      memberId: "", //邀请人id
      showRes: false,
      inviteesInfo: {},
      isTimes: false,
      timeNum: 60,
      formValidate: {
        accountName: "",
        userName: "",
        captcha: "",
        // code: "",
        password: "",
        captchaUrl: " ",
        passwordMore: ""
      },
      ruleValidate: {
        accountName: [
          {
            required: false,
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "请输入姓名",
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
        // code: [
        //   {
        //     required: true,
        //     message: "请输入手机验证码",
        //     trigger: "blur"
        //   }
        // ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        passwordMore: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      passLogin: "", //直接登录时的密码
      haveUser: false
    };
  },
  methods: {
    ...mapActions("user", ["updateUserInfo", "updateUserId", "initSrc"]),
    //加入项目
    joinProject() {
      proInviteMen(this.projectId, localStorage.userId).then(res => {
        if (res.result == 1) {
          this.$router.push(
            `/project/${this.projectId}/tasks/group/${this.inviteesInfo.groupId}`
          );
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    //加入企业
    joinEnterprise() {
      let data = {
        orgId: this.orgid,
        memberId: localStorage.userId
      };
      linkaddPeople(data).then(res => {
        if (res.result == 1) {
          this.$Message.success("添加成功");
          this.$router.push("/prolist/" + this.orgid);
        } else {
          this.$Message.info(res.msg);
        }
      });
    },
    join() {
      if (!this.showLogin) {
        //有token，直接加入
        if (this.fromType == "project") {
          this.joinProject();
        } else {
          this.joinEnterprise();
        }
      } else {
        if (this.evaluatePhoneNumber(this.iphone)) {
          this.illegalPhone = false;
          userExist(this.iphone).then(res => {
            if (res.data == false) {
              //未注册，需注册
              this.showRes = true;
              this.formValidate.accountName = this.iphone;
              this.changeImg();
            } else {
              //注册完了，填密码
              this.haveUser = true;
            }
          });
        } else {
          this.illegalPhone = true;
        }
      }
    },
    evaluatePhoneNumber(phone) {
      let tempReg = /^1[0-9]{10}$/;
      return tempReg.test(phone);
    },
    getInviteesInfo() {
      getInvitees(this.orgid, this.memberId, this.projectId).then(res => {
        if (res.result == 1) {
          this.inviteesInfo = res.data;
        }
      });
    },
    changeImg() {
      this.formValidate.captchaUrl = "/api/captcha?d=" + Math.random();
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
          if (res.result === 1) {
            this.$Message.success("获取成功");
          } else {
            this.$Message.error("获取失败");
          }
        }
      );
    },
    forget(name) {
      console.log(name);
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate);
          if (this.formValidate.password !== this.formValidate.passwordMore) {
            this.$Message.error("两次密码输入不一致，请修改！");
            return;
          }
          //注册并加入项目
          if (this.fromType == "project") {
            registerJoin(this.formValidate).then(res => {
              if (res.result == 1) {
                this.$Message.success("注册并加入成功!");
                this.$router.push(
                  `/project/${this.projectId}/tasks/group/${this.inviteesInfo.groupId}`
                );
              } else {
                this.$Message.error("修改失败");
              }
            });
          } else {
            //注册并加入企业
            registerJoinEnter(this.formValidate).then(res => {
              if (res.result == 1) {
                this.$Message.success("注册并加入成功!");
                this.$router.push("/prolist/" + this.formValidate.orgId);
              } else {
                this.$Message.error("修改失败");
              }
            });
          }
        }
      });
    },
    //点击用其他账号注册
    others() {
      if (this.showRes) {
        this.iphone = "";
        this.showRes = !this.showRes;
        this.showLogin = true;
      } else {
        this.showLogin = true;
      }
    },
    login() {
      let data = {
        accountName: this.iphone,
        password: this.passLogin
      };
      userlogin(data).then(res => {
        if (res.result == 0) {
          this.$Message.error(res.msg);
        } else {
          this.updateUserId(res.data); //存储、更新用户信息
          this.initSrc(res.data.image);
          localStorage.userId = res.data.userId;
          localStorage.userImg = res.data.image;
          localStorage.userName = res.data.userName;
          localStorage.token = res.data.accessToken;
          // localStorage.companyId = res.data.orgId;
          console.log(res.data.orgId);
          this.$Message.success("登录成功!");
          if (this.fromType == "project") {
            this.joinProject();
          } else {
            this.joinEnterprise();
          }
        }
      });
    }
  },
  mounted() {
    //如果没有token，需手动填写手机号
    if (!localStorage.token) {
      this.showLogin = true;
    }
    this.fromType = this.$route.query.from;
    this.memberId = this.$route.query.memberId;
    localStorage.companyId = this.$route.query.companyId;
    if (this.fromType == "project") {
      this.showText = "项目";
      this.projectId = this.$route.query.id;
      this.formValidate.projectId = this.$route.query.id;
    } else {
      this.showText = "企业";
      this.formValidate.orgId = this.$route.query.companyId;
    }
    this.getInviteesInfo();
  }
};
</script>
<style scoped lang="less">
.df {
  display: flex;
}
.companyWarp {
  width: 100%;
  min-height: 100vh;
  padding-top: 50px;
  display: flex;
  // align-items:center;
  justify-content: center;
  padding-top: 100px;
  .company-box {
    text-align: center;
  }
  button {
    font-size: 16px;
  }

  .register {
    border: 1px solid #3da8f5;
    color: #3da8f5;
    background: #fff;
    border-radius: 5px;
    width: 340px;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  .company-bottom {
    border-bottom: 1px solid #a2a2a2;
  }
  .inputContent {
    width: 340px;
  }

  .company {
    display: flex;
    flex-flow: column nowrap;
    padding-bottom: 40px;
    // position: relative;
    .backIcon {
      position: absolute;
      left: 30px;
      top: 30px;
      cursor: pointer;
    }
    .logo {
      width: 70%;
      margin: 0px auto 20px;
      img {
        width: 200px;
      }
    }
    .field {
      font-size: 18px;
      font-weight: 400;
      margin: 0 0 25px;
      line-height: inherit;
      color: grey;
      text-align: center;
    }
    .youself {
      max-width: 360px;
      width: 100%;
      // margin-bottom: 25px;
      background-color: #f5f6f7;
      padding: 20px 20px 20px 20px;
      border-radius: 4px;
      display: flex;
      text-align: left;
      img {
        margin-right: 20px;
        background: #3da8f5;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
      }
      .userName {
        font-size: 18px;
        color: #383838;
        margin-top: 10px;
        // margin-bottom: 10px;
      }
      p {
        color: #a0a0a0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .tipsContent {
    align-items: center;
    color: #f74555;
    margin-top: 20px;
    i {
      margin-right: 5px;
    }
  }
  .resContent {
    width: 360px;
    padding: 0 10px;
    text-align: left;
    .resTit {
      font-size: 18px;
      font-weight: 400;
      margin: 0 0 25px;
      line-height: inherit;
      color: grey;
      text-align: center;
    }
    .forget-input {
      width: 100%;
      text-align: center;
    }
    /deep/ .ivu-input {
      margin-bottom: 0;
    }
    .captcha-input {
      width: 60%;
    }
    .captcha-img {
      width: 35%;
      border-radius: 4px;
      margin-left: 5%;
      height: 32px;
      vertical-align: middle;
    }

    .code {
      width: 35%;
      height: 32px;
      margin-left: 5%;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      padding: 0;
      font-size: 14px;
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
  }
}
</style>