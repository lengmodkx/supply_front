<template>
<div>
  <div class="contentPro" v-if="showbox1">
    <div class="title">创建企业</div>
    <div class="pic"></div>
    <p class="myindex">输入企业名称，解锁企业独有功能</p>
    <Input class="inputbox" v-model.trim="proName" placeholder="企业名称" />
    <Select class="selectBox" v-model="selectmodel1" placeholder="企业规模">
        <Option v-for="item in sizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <Button class="submitBtn" type="primary" size="large" :disabled="proName==''||selectmodel1==''" @click="next">下一步</Button>
  </div>
  <!-- 验证手机号模块 -->
  <div class="contentPro" v-if="showbox2">
    <div class="title"><Icon class="back-icon fl" type="ios-arrow-left" size="26" @click="backTo"></Icon>联络方式</div>
    <div class="pic2"></div>
    <p class="myindex">确认联系方式，免费培训团队</p>
    <Input class="inputbox" v-model.trim="people" placeholder="联系人" />
    <Input class="inputbox" v-model.trim="phone" placeholder="联系电话" />
    <div class="yanzheng">
    <Input class="inputbox" v-model.trim="authority" placeholder="请输入短信验证码" />
    <span class="getCode" @click="getCode">{{getcode}}</span>
    </div>
    
   
    <Button class="submitBtn" type="primary" size="large" :disabled="people==''||phone==''||authority==''" @click="next">完成</Button>
  </div>
</div>
  
</template>
<script>
  export default{
    data(){
      return{
        showbox1:true,
        showbox2:false,
        selectmodel1:'',
        disabled:true,
        proName:'',
        proDes:'',
        people:'',
        phone:'',
        authority:'',
        getcode:'获取验证码',
        firsttime:5,
        timer:null,
        sizeList: [
                    {
                        value: '1-30人',
                        label: '1-30人'
                    },
                    {
                        value: '30-100人',
                        label: '30-100人'
                    },
                    {
                        value: '100-300人',
                        label: '100-300人'
                    },
                    {
                        value: '300-1000人',
                        label: '300-1000人'
                    },
                    {
                        value: '1000人以上',
                        label: '1000人以上'
                    }
                ]
      }
    },
    beforeDestroy (){
      clearInterval(this.timer)
    },
    methods:{
      next(){
        this.showbox1 = false
        this.showbox2 = true
       
      },
      backTo (){
         this.showbox1 = true
        this.showbox2 = false
      },
      getCode () {
        if (typeof this.getcode == 'number') return
          this.getcode =`${this.firsttime}s`
            this.timer = setInterval(() => {
            this.firsttime--
            this.getcode = `${this.firsttime}s`
          if (this.firsttime <= 0) {
              this.getcode = '重新获取'
              this.firsttime=5
              clearInterval(this.timer)
            }
        }, 1000)
         
      }
    }
  }
</script>
<style scoped lang="less">
.contentPro{
  overflow: hidden;
  .back-icon{
    cursor: pointer;
    vertical-align: middle;
  }
  .title{
    padding:10px 10px 15px 10px;
    text-align: center;
    font-size:16px;
    font-weight:bold;
    border-bottom:1px solid #e5e5e5;
  }
  .pic{
    width: 72px;
    height: 72px;
    margin: 30px auto;
    background: url('../../../assets/images/enterprise.png');
    background-size: 72px 72px;
  }
  .pic2{
    width: 32px;
    height: 65px;
    margin: 30px auto;
    background: url('../../../assets/images/phone.png');
    background-size: 32px 65px;
  }
  .myindex{
    text-align: center;
    color: gray;
    margin-bottom: 25px;
    font-size:14px;
  }
  /deep/.ivu-input{
    height: 40px !important;
     font-size:14px;
  }
  .inputbox{
    width: 320px;
    display: block;
    margin:15px auto;
  }
  .yanzheng{
    position:relative;
  }
  .getCode{
    position:absolute;
    top:10px;
    right:30px;
    cursor: pointer;
    color:#555;

  }
  .submitBtn{
    display: block;
    width:320px;
    margin:20px auto;
  }
}
.selectBox{
  display:block;
  width:320px;
  
  margin:10px auto;
  /deep/.ivu-select-selection{
    height:40px;
    .ivu-select-placeholder,.ivu-select-selected-value{
      height:40px;
      line-height:40px;
      font-size:14px;
    }
  }
}
</style>

