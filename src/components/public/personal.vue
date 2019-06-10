<template>
    <div class="personal-box">
        <div class="loading" v-if="loading"><Loading ></Loading></div>
        
       <div class="personal">
            <div class="personal-left">
                <div class="titel">
                    <img src="" alt=""> 
                    <span>名子</span>    
                </div>
                <ul>
                    <li class="hover">个人信息</li>
                    <!-- <li>帐号密码</li> -->
                </ul>
            </div>
            <div class="personal-right">
                <div class="title">个人信息</div>
                <div class="information">
                    <div class="head">
                        <h4>头像</h4>
                        <img src="" alt="">
                        <div  class="chang-head" >更换头像</div>
                    </div>
                    <ul>
                         <li>
                            <h4>姓名</h4>
                            <Input v-model="message.name" style="width: 300px" />
                        </li>
                        <li>
                            <h4>职位</h4>
                            <Input  v-model="message.job" style="width: 300px" />
                        </li>
                        <li>
                            <h4>联系电话</h4>
                            <Input  v-model="message.phone"  style="width: 300px" />
                        </li>
                        <li>
                            <h4>生日</h4>
                             <Select v-model="message.year"   style="width:90px;margin-right:15px;">
                                <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                             <Select v-model="message.month"   style="width:90px;margin-right:15px;">
                                <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                             <Select v-model="message.day"  style="width:90px">
                                <Option v-for="item in dayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>

                        </li>
                        <li>
                            <h4>所在地</h4>
                            <Input v-model="message.address"  style="width: 300px" />
                        </li>
                        <li>
                            <h4>网址</h4>
                            <Input v-model="message.path" style="width: 300px" />
                        </li>
                        <li>
                            <h4> </h4>
                            <Button type="primary" style="width: 300px" long>保存</Button>
                        </li>

                    </ul>
                   

                </div>
                
            </div>
       </div>
    </div>
</template>
<script>
   import {findUserInfo} from '@/axios/api'
    export default {
        data: function () {
            return {
                loading: false,
                message:{
                        name:'名子',
                        job:'职位',
                        phone:'13345689455',
                        year:'',
                        month:'',
                        day:'',
                        address:'地址',
                        path:'www',

                },
                yearList:[],
                monthList:[],
                dayList:[],

            }
        },
        components: {},
        methods: {

        },
        computed:{
          
        },
        created(){
            console.log(localStorage.userId)
            findUserInfo(localStorage.userId).then(res=>{
                    console.log(res)
            })
        }
    }
</script>
<style socped lang="less">
    .personal-box{
        width: 100%;
        min-height: 100vh;
        padding-top: 50px;
        background-color: #F0EFEC;
        .personal{
            width: 980px;
            padding:20px;
            height: auto;
            margin:0px auto;
            display: flex;
            justify-content: space-between;
        }
        .personal-left{
            width:300px;
            .titel{
                width: 100%;
                height: 100px;
                background: #ffffff;
                display: flex;
                padding:20px;
                margin-bottom: 20px;
                img{
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border:1px solid #F0EFEC;
                }
                span{
                    padding:10px;
                    font-size: 16px;
                    font-weight: bold;
                }
               
            }
             ul{
                    li{
                        cursor: pointer;
                        padding:20px;
                        background: #ffffff;
                        border-bottom: 1px solid #F0EFEC;
                        font-size:14px;
                    }
                    :hover{
                        background: #fdfdfd;
                        
                    }
                    .hover{
                        font-weight: bold
                    }
                }
            
         }
        .personal-right{
            width:620px;
            min-height: 120px;
            background: #ffffff;
            padding:20px;
            .title{
                font-size: 16px;
                font-weight: bold;
            }
            .information{
                padding: 20px 0;
                h4{  
                        display: block;
                        width: 125px;
                        padding:8px 0 0 0;
                        color: gray;
                        font-size: 14px;
                        font-weight: bold;
                    }

                .head{
                    display: flex;
                    margin-bottom: 40px;   
                    h4{
                        padding-top:20px;
                    }             
                     img{
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        border: 1px solid gray;
                    }
                    .chang-head{
                        width: 88px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        color: #3DA8F5;
                        border: none;
                        border:1px solid #3DA8F5;
                        border-radius: 4px;
                        background: #ffffff;
                        margin:30px;
                        cursor: pointer;                   
                         }
                }
                ul li{
                     display: flex;
                     margin-bottom: 20px;    
                }
                .ivu-input{
                    border:1px solid #d9d9d9 !important;
                }
            }
            
        }
    }


    
</style>