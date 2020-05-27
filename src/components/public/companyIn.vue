<template>
    <div class="companyWarp">
        <div class="company-box">
            <div  class="company" :class="this.showLogin ? '': 'company-bottom'">
                    <div class="logo">
                     <img src="../../assets/images/logo.png" alt="" />
                    </div>
                    
                        <span class="field" v-if="!showLogin">
                            登录并接受 myy 邀请，加入企业 ar1002
                        </span>
                        <span class="field" v-else>
                            通过链接邀请加入企业 ar1002
                        </span>

                        <div  class="youself" v-if="!showLogin">
                            <img  alt="" />
                            <div class="name">
                                <h4>myy</h4>
                                <p>accounts_5da43af60d45d700125356e2@mail.teambition.com</p>
                            </div>
                        
                        </div>
                         
                         <div v-else>
                              <Input v-model="iphone" placeholder="你的手机号或工作邮箱"  />
                         </div>
                         
                        <Button type="primary" style="height:48px" >加入企业</Button>
                        <span class="link" v-if="showLogin">
                            了解团队协作工具 阿拉丁BIM云平台
                        </span>
            </div>
            <button class="register" v-if="!showLogin"  @click="showLogin=true">使用其它账号注册</button>

        </div>
       
    </div>
</template>
<script>

import { mapState, mapActions, mapMutations } from "vuex";
export default {
    data: function () {
        return {
                iphone:'',
                showLogin:false
        }
    },
    methods: {
    
    },
    created(){
        
    }
}
</script>
<style scoped lang="less">
 
.companyWarp{
    width: 100%;
    min-height: 100vh;
    padding-top: 50px;
     display: flex;
   // align-items:center;
    justify-content:center;
    padding-top:120px;

    button{
        font-size: 16px;;
    }

    .register{
            border: 1px solid #3DA8F5;
            color: #3DA8F5;
            background: #fff;
            border-radius: 5px;
             width: 324px;
            height: 48px;
            margin-top: 40px;
     }
     .link{
        
           margin-top: 40px;
            font-size: 16px;
            line-height: 20px;
            color: #3da8f5;
            width: 100%;
            text-align: center;
     }

    .company-bottom{
          border-bottom: 1px solid  #a2a2a2;
    }

    .company{
        width: 324px;
      
        // background: #ff00ff;
        display: flex;
        flex-flow: column nowrap;
        padding-bottom: 40px;
        /deep/ .ivu-input{
            height: 46px;
            margin-bottom: 20px;;
        }
        
        
        
        .logo{
            width: 70%;
            margin: 0px auto 20px;
            img{
                width: 100%;
            }
          
        }
        .field{
                font-size: 18px;
                font-weight: 400;
                margin: 0 0 25px;
                line-height: inherit;
                color: grey;
                text-align: center;
        }
        .youself{
            margin-bottom: 25px;
            background-color: #f5f6f7;
            width: 100%;
            padding: 20px 20px 20px 100px;
            border-radius: 4px;
            position: relative;
            img{
               position: absolute;
               left: 15px;
               top: 10px;
               background:#3DA8F5;
               width: 60px;
               height: 60px;
               border-radius: 50%;
               overflow: hidden;
            }
            h4{
                font-size: 18px;
            }
            p{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            
        }
    }
    
}

</style>