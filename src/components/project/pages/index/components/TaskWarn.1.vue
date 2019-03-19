<template>
  <div class="wrap">
    <div class="warn-title">任务提醒设置</div>
    <div class="con">
        <div class="reminder-head clearfix">
          <div class="reminder-group-title fl">提醒规则</div>
          <div class="addReminder fr" @click="addNewreminder">
            <Icon type="plus-circled" style="margin-right:8px;"></Icon>添加新提醒
            </div>
        </div>
        <div class="reminder-list clearfix">
          <div class="no-reminders" v-if="noWarn">不提醒</div>
          <div class="reminder-item">
            <div class="selector fl clearfix">
              <div class="select1 fl">
                <Select v-model="select1" style="width:200px" placeholder="任务截止时">
                  <Option v-for="item in chooseList" :value="item" :key="item"></Option>
                </Select>
              </div>
              <div class="select2 fl" v-show="select1!='任务开始时'&&select1!='任务截止时'&&select1!='自定义时间'">
                <Select v-model="select2" style="width:140px" placeholder="5">
                  <Option v-for="item in chooseNum" :value="item" :key="item"></Option>
                </Select>
              </div>
              <div class="select3 fl" v-show="select1!='任务开始时'&&select1!='任务截止时'&&select1!='自定义时间'">
                 <Select v-model="select3" style="width:140px" @on-change="changeSelect3(select3)" placeholder="分钟">
                  <Option v-for="item in chooseDay" :value="item" :key="item"></Option>
                </Select>
              </div>
            
              <!-- 自定义时间 日期选择 -->
              <div class="icon fr"><Icon type="ios-trash-outline" :size="24"></Icon></div>
            </div>
            <div class="delete fr"></div>
          </div>
        </div>
        <div class="addMember">
          <div class="reminder-group-title">添加提醒对象</div>
          <div class="reminded-members-wrap">
            <ul class="popover-members-selector">
              <li class="add-member-btn-wrap clearfix">
                <div class="avator">
                  <span class="close">&times;</span>
                </div>
                <MemberList></MemberList>
                <!-- <span class="add-icon"><Icon type="plus-circled" :size="28"></Icon></span> -->
              </li>
            </ul>
            <div class="no-members-tips">请先添加需要提醒的成员</div></div>
        </div>
    </div>
    <div class="save">
      <Button type="primary" :disabled="save" size="large">保存</Button>
    </div>
  </div>
</template>
<script>
import MemberList from './MemberList'
  export default{
    components:{
      MemberList
    },
    data () {
      return{
        save:true,
        noWarn:true,
        select1:'任务截止时',
        select2:'5',
        select3:'分钟',
        chooseList:['任务开始时','任务开始前','任务开始后','任务截止时','任务截止前','任务截止后','自定义时间'],
        chooseNum:[5,10,15,20,25,30,35,40,45,50,55,60],
        chooseDay:['分钟','小时','天']
      }
    },
    methods:{
      addNewreminder () {
          this.noWarn =false
      },
      changeSelect3 (val){
        if(val=='小时'){
          this.chooseNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
        }else if(val=='天'){
          this.chooseNum = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
        }else{
          this.chooseNum  = [5,10,15,20,25,30,35,40,45,50,55,60];
        }
      }
    },
    mounted () {
      document.getElementById('warnModal').children[1].style.zIndex = '1009';
    }
  }
</script>
<style scoped lang="less">

.wrap{
  min-height:100px;
}
.warn-title{
  text-align: center;
  line-height:30px;
  font-size:16px;
  color:#383838;
  border-bottom:1px solid #eee;
  padding-bottom:5px;
}
.con{
  .reminder-head{
    font-size:14px;
    margin-top:15px;
    .addReminder{
      cursor: pointer;
      color:#2d8cf0;
      &:hover{
        color:#2a75ab;
      }
    }
  }
  .selector{
    width:100%;
  }
  .reminder-item{
    &:hover .icon{
      display: block;
    }
    .icon{
      margin-top:4px;
      margin-left:10px;
      cursor: pointer;
      display: none;
      &:hover{
        color:#2d8cf0;
      }
    }
  }
  .addMember{
    .popover-members-selector {
      margin: 4px -4px 0;
      height: 32px;
    }
    
    .add-member-btn-wrap {
      // display: -webkit-inline-flex;
      // display: -ms-inline-flexbox;
      // display: inline-flex;
      margin: 8px 4px 0;
      vertical-align: top;
      .avator{
        width: 25px;
        height: 25px;
        float:left;
        border-radius: 50%;
        background: yellowgreen;
        margin-right:4px;
        cursor:pointer;
        position: relative;
        &:hover{
          border:2px solid #a6a6a6;
        }
         &:hover .close{
           display: block;
         }
        .close{
          position: absolute;
          font-size:14px;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          line-height: 12px;
          text-align: center;
          border-radius: 50%;
          color: #fff;
          text-align: center;
          background-color: #a6a6a6;
          display: none;
        }
      }
      
    }
    .reminder-group-title{
        margin:12px 0;
    }
    .no-members-tips{
      font-size: 12px;
      color: #ff4f3e;
      margin-top: 12px;
    }
  }
}
.save{
  text-align: right;
  margin-top:15px;
  border-top:1px solid #eee;
  padding-top:10px;
}
</style>

