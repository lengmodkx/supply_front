<template>
    <div class="down-contant">

          <h2>下载列表</h2>
            <div class="down">
                <ul>
                    <li>
                        <div class="down-img">
                            <img data-v-51a1b09a="" src="http://ald.art1001.com/favicon.ico" alt="">
                        </div>
                        <div class="down-titel">
                                <span>
                                    阿拉丁BIM云平台客户端 
                                </span>
                                 <!-- <Icon @click="getDown()" type="md-arrow-down" class="mr0" />  -->
                        </div>
                    </li>
                    <li>
                        <div class="down-img">
                            <img data-v-51a1b09a="" src="http://ald.art1001.com/favicon.ico" alt="">
                        </div>
                        <div class="down-titel">
                                <span>
                                   阿拉丁BIM-CAD专业版
                                </span>
                                 <Icon @click="getDown(2)" type="md-arrow-down" class="mr0" /> 
                        </div>
                    </li>
                    <li>
                        <div class="down-img">
                            <img data-v-51a1b09a="" src="http://ald.art1001.com/favicon.ico" alt="">
                        </div>
                        <div class="down-titel">
                                <span>
                                    阿拉丁BIM-CAD建筑版
                                </span>
                                 <!-- <Icon @click="getDown()" type="md-arrow-down" class="mr0" />  -->
                        </div>
                    </li>
                    <li>
                        <div class="down-img">
                            <img data-v-51a1b09a="" src="http://ald.art1001.com/favicon.ico" alt="">
                        </div>
                        <div class="down-titel">
                                <span>
                                   阿拉丁BIM-CAD装饰版
                                </span>
                                 <!-- <Icon @click="getDown()" type="md-arrow-down" class="mr0" />  -->
                        </div>
                    </li>
                </ul>
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
            getDown(type){
                if(type==2){
                  window.location.href ="https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/aldbim2019.msi"
                }

            }
           
        },
        computed:{
           
        },
        created(){

            
        }
    }
</script>
<style socped lang="less">
    .down-contant{
        width:100%;
        height: 100vh;
        padding-top: 60px;
        // background:#ececec;
         h2{  
             width: 1000px;
              margin:0px auto;
               display: block;
               height: 60px;
               line-height: 50px;
               border-bottom:1px solid #e7e6e3;
               padding-left:20px;
            }
        .down{
            width: 1000px;
            height: calc(100vh - 60px - 78px);
            background:#ffffff;
            margin:0px auto;
            ul li{
                height: 72px;
                display: flex;
                cursor: pointer;
                border-bottom: 1px solid #e7e6e3;
                display: flex;
            }
            ul li:hover{
                 background-color: #f5f5f5;
            }
            .down-img{
                flex:0 1  40px;
                
                img{
                     margin:15px;
                     width: 40px;
                     height: 40px;
                }
            }
            .down-titel{
                flex:1 1 auto;
                height: 72px;
                overflow:hidden;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                line-height: 72px;
                font-size: 16px;  
               
                i{
                     font-size: 22px;
                    padding:25px 10px;
                }
            }

        }

    }
   


</style>