<template>
  <div  class="addCompanyWrap">
    <div class="banner">
         <img src="../../assets/images/addCompany.png" alt="" />
    </div>

    <Tabs active-key="key1">
        <Tab-pane label="分享链接/申请码邀请" key="key1">
           <div  class="share">
                <h5>邀请链接</h5>
                <div class="small">
                    访问链接的用户可以
                </div>
                <Radio :checked.sync="single">自动加入企业</Radio>
                <div class="next-input">
                  https://tburl.in/G3AKUVlX
                  
                 <div class="icon-warp">
                     <Icon type="ios-refresh" size='22'/>
                      <Icon type="ios-copy-outline" size='20'/>
                 </div>
                

                </div>
                <div class="small">
                  链接有效期至：2020-05-28 16:29
                </div>
           </div>
           <Button class="shareButton" type="primary" >复制邀请信息</Button>
        </Tab-pane>
        <Tab-pane label="手机/邮箱邀请" key="key2">
            <div class="iphone">
                <Input v-model="iphoneModel" placeholder="请输入手机号和邮箱" />
                <Input v-model="iphoneModel" placeholder="请输入手机号和邮箱" style="margin-top:15px"/>
            </div>
             <Button class="shareButton" type="primary" >邀请成员</Button>
          
        </Tab-pane>
    </Tabs>
   
  </div>
</template>

<script>

export default {
 
  name: "addPeople",
  data() {
    return {
        single: true,
        iphoneModel:''
    };
  },
  mounted() {
    
  },
  methods: {
   
  }
};
</script>

<style scoped lang="less">
.addCompanyWrap{
  .banner{
    width: 90%;
    margin: 10px auto 20px;
      img{
            width: 100%;
        }
  }
  .share{
    border-bottom: 1px solid #d9d9d9;
    color: #595959;
    font-size: 14px;
    padding-bottom: 10px;
    h5{
      font-size: 16px;
      color: #262626;
    }
    .small{
      font-size: 12px;
      margin: 10px 0 0;
      color: #8c8c8c;
    }
    label{
      margin: 10px 0 0;
    }
    .next-input{
      margin: 10px 0 0;
      width: 300px;
      height: 36px;
      line-height: 36px;
      text-indent: 10px;
      border-radius: 3px;
      transition: border-color .3s ease-out;
      border: 1px solid #d9d9d9;
      background-color: #fff;
      .icon-warp{
        float: right;
        margin-right: 10px;
        i{
          cursor: pointer;
        }
      }
    }
  }
  .shareButton{
      float:right;
      margin-top:20px;
    }

  .iphone{
    .ivu-input{
       height: 36px;
       border-radius: 4px
    }
   
  }
   
}

</style>
