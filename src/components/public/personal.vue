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
                    <li>个人信息</li>
                    <li>帐号密码</li>
                </ul>
            </div>
            <div class="personal-right">
                
            </div>
       </div>
    </div>
</template>
<script>
   
    export default {
        data: function () {
            return {
                loading: false
            }
        },
        components: {},
        methods: {

        },
        computed:{
          
        },
        created(){
            
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
            background: #ff0000
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
                        border-bottom: 1px solid #F0EFEC
                    }
                }
            
         }
        .personal-right{
            width:620px;
            min-height: 120px;
            background: #ffffff
        }
    }


    
</style>