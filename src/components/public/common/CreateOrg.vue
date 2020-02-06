<template>
  <div>
    <div class="contentPro">
      <div class="title">创建企业</div>
      <div class="pic"></div>
      <p class="myindex">输入企业名称，解锁企业独有功能</p>
      <Input class="inputbox" v-model.trim="proName" placeholder="企业名称" />
      <Input class="inputbox" v-model.trim="phone" placeholder="手机号" />
      <Select class="selectBox" v-model="selectmodel1" placeholder="企业规模">
          <Option v-for="item in sizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button :loading="btnLoading" class="submitBtn" type="primary" size="large" :disabled="proName==''||selectmodel1==''||phone==''" @click="createOrg">开始创建</Button>
    </div>
  </div>
</template>
<script>
  import {createCompany} from '@/axios/companyApi'
  import {mapActions} from 'vuex'
  export default{
    data(){
      return{
        selectmodel1:'',
        disabled:true,
        btnLoading: false,
        proName:'',
        phone:'',
        sizeList: [
          {
              value: '1-10人',
              label: '1-10人'
          },
          {
              value: '10-50人',
              label: '10-50人'
          },
          {
              value: '50-100人',
              label: '50-100人'
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
    methods:{
        ...mapActions("company", ["initCompany"]),
      ...mapActions("project",["orgProjectInit"]),
      // 创建企业
      createOrg(){
        if(!(/^1[3456789]\d{9}$/.test(this.phone))){
          this.$Message.error("手机号码有误，请重填");
        }else {
          this.btnLoading=true
          let data={
            'organizationName': this.proName,
            'organizationDes': this.selectmodel1,
            'contact': localStorage.userName,
            'contactPhone': this.phone
          }
          createCompany(data).then(res => {
            this.btnLoading=false
            if (res.result==1){
              this.$emit('closeCreateOrg')
              localStorage.orgId = res.data;
              this.$router.replace('/org/'+res.data)
            }
          })
        }
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

