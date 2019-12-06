<template>
   <div class="bind-box">
      <div class="account-return-btn" @click="show=!show" v-show="!show">
         <Icon type="ios-arrow-back" size='28'/>
         <span>返回</span>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="rules2" class="bind-box-form" v-if="show">
        <FormItem>
          <div>
             <img src="../assets/images/logo2.png" width="100px" height="60px">
             <p class="account-title">欢迎加入，<br>请为自己填写一个称呼</p>
          </div>
        </FormItem>
        <FormItem prop="nickName">
          <Input type="text" size="large" v-model="formValidate.nickName" class="bind-input" />
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="show=!show,showTxt=true" :disabled="formValidate.nickName.length<2||formValidate.nickName.length>20">确定</Button>
          <span class="divide"></span>
          <Button type="default" long size="large" @click="show=false,showTxt=false">绑定已有 阿拉丁云平台 帐号</Button>
        </FormItem>
      </Form>

       <Form ref="formValidate" :model="formValidate" :rules="rules" class="bind-box-form" v-else>
          <FormItem>
             <p class="account-title" v-if="!showTxt">绑定已有 阿拉丁云平台 帐号</p>
             <p class="account-title" v-else>由于相关法规要求，<br>请绑定手机号码</p>
          </FormItem>
        <FormItem prop="phone">
          <Input type="text" size="large" placeholder="请输入手机号" v-model="formValidate.phone" clearable class="bind-input" />
        </FormItem>
      
        <FormItem prop="code">
          <Input type="text" size="large" placeholder="请输入短信验证码" v-model="formValidate.code" clearable class="captcha-input" />
          <Button v-if="isTimes" class="captcha-img" style="background-color: #e5e5e5">{{timeNum}}秒后重新发送</Button>
          <Button v-else type="primary" class="captcha-img" @click="getPhoneCode" :disabled="!formValidate.phone">获取短信验证码</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" long size="large" @click="bind('formValidate')">绑定</Button>
        </FormItem>
      </Form>
   </div>
</template>
<script>
import { bindPhone, getPhoneCode } from "@/axios/api";
import { mapState, mapActions } from "vuex";
export default {
    data() {
       const validatePhone = (rule, value, callback) => {
          if(!(/^1[3456789]\d{9}$/.test(value))){
             return callback(new Error("请输入正确的手机号码"));
          }else{
             callback();
          }
       }
       const validateName = (rule , value, callback)=>{
          if(value.length<2||value.length>20){
             return callback(new Error("用户名请保持在2-20位标准字符串之间"));
          }else{
             callback();
          }
       }
       return {
          show:true,
          showTxt:true,
          isTimes:false,
          timeNum:60,
          formValidate:{
             phone: "",
             code: "",
             nickName:this.$route.query.name,
             userId:this.$route.query.userId
          },
          rules:{
             phone: [{ validator: validatePhone, trigger: "blur" }],
             code: [{ required: true, message: "请输入手机验证码", trigger: "blur" }],
          },
          rules2:{
            nickName:[{validator: validateName,trigger: "change"}]
          }
       }
    },
    methods:{
       ...mapActions("user", ["updateUserInfo", "updateUserId"]),
       bind: function(name) {
          this.$refs[name].validate(valid => {
            if (valid) {
               bindPhone(this.formValidate).then(res => {
                  if (res.result == 0) {
                     this.$Message.error('绑定失败');
                  } else {
                     localStorage.token = res.accessToken;
                     this.updateUserId(res.userInfo); //存储、更新用户信息
                     localStorage.userId = res.userInfo.userId;
                     localStorage.userImg = res.userInfo.image;
                     localStorage.userName = res.userInfo.userName;
                     this.$router.push("/home");
                  }
               });
            } else {
               this.$Message.error("Fail!");
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
         getPhoneCode(this.formValidate.phone,this.formValidate.userId).then(res => {console.log(res);});
      },
      showPage(){
         this.show = false;
         this.showTxt = false
      }
    }
}
</script>
<style scoped lang="less">
.bind-box{
   width: 100%;
   height: 100vh;
   position: relative;
   background: white;
//    background: url("../assets/images/login-bg2.jpg") no-repeat center/cover;
}
.bind-box-form{
   width: 360px;
   height: 300px;
   position: absolute;
   left: 50%;
   margin-left: -170px;
   margin-top: 140px;
   background-color: #fff;
   border-radius: 5px;
}
.bind-input{
   width: 100%;
}
.captcha-input {
  width: 55%;
  margin-right: 10%;
}
.captcha-img {
  height: 36px;
  border-radius: 4px;
  
  position: absolute;
  right: 0;
}
.account-title{
   font-size: 24px;
   color: #262626;
   font-weight: 500;
}
.account-return-btn{
   position: fixed;
    top: 40px;
    left: 40px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 32px;
    width: 72px;
    background-color: #e5e5e5;
    border-radius: 18px;
    color: #595959;
    cursor: pointer;
    transition: background-color .3s ease,color .3s ease;
}
.divide{
   display: inline-block;
    width: 100%;
    height: 1px;
    background: #f5f5f5;
    margin: 20px 0 10px;
}
</style>