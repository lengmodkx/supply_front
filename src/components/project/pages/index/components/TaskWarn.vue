<template>
  <div>
    <div class="remind-rule">
      <span>提醒规则</span>
      <div class="add-remind"><Icon type="md-add-circle" />添加新提醒</div>
    </div>
    <div v-if="remindData.length===0" style="margin-top: 15px">不提醒</div>
    <div class="remind" v-if="remindData.length">
      <Select class="select" v-model="remindType" style="width:200px">
        <Option v-for="item in remindTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <Select class="select" v-model="remind" style="width:100px">
        <Option value="11">111</Option>
      </Select>
      <Select class="select" v-model="remind" style="width:100px">
        <Option value="11">111</Option>
      </Select>
      <Icon class="rublish" type="ios-trash-outline" />
    </div>
    <div style="margin-top: 15px">添加提醒对象</div>
    <div class="participator">
      <div class="involve-list clearfix">
        <div class="member-avatar fl" v-for="(item,index) in remindPeople" :key="index">
          <Tooltip :content="item.userName" placement="top" transfer>
            <div class="ava">
              <!-- 删除需要加在关闭按钮上 -->
              <img v-if="item.image" :src="prefix + item.image" alt="">
              <svg-icon v-else style="width:24px;height:24px;display:block;" name="allMember"></svg-icon>
              <span class="close" @click="deleteInvolve(item.userId)">×</span>
            </div>
          </Tooltip>
        </div>
        <div class="addButton fl">
          <InvolveMember ref="involveMember" :checkedList="remindPeople" :projectId="projectId" @save="saveInvolveMember"></InvolveMember>
        </div>
      </div>
    </div>
    <div class="save-wrap"><Button type="info">保存</Button></div>

  </div>
</template>
<script>
  import {getRemind} from '@/axios/api2'
  export default {
    props: ['taskId'],
    data () {
      return {
        remindData: [],
        remindPeople: [],
        projectId: this.$route.params.id,
        remindType: '',
        remindNum: '',
        remindTypeList: [
          {
            value: '任务开始时',
            label: '任务开始时'
          },
          {
            value: '任务开始前',
            label: '任务开始前'
          },
          {
            value: '任务开始后',
            label: '任务开始后'
          },
          {
            value: '任务截止时',
            label: '任务截止时'
          },
          {
            value: '任务截止前',
            label: '任务截止前'
          },
          {
            value: '任务截止后',
            label: '任务截止后'
          },
          {
            value: '自定义时间',
            label: '自定义时间'
          }
        ]
       }
    },
    mounted () {
      getRemind(this.taskId).then(res => {
        if (res.result) {
          this.remindData=res.data
          console.log(res)
        }
      })
    },
    methods: {
      // 添加提醒人
      saveInvolveMember(detailList) {
        console.log(detailList)
      },
      // 删除提醒人
      deleteInvolve(id) {
        console.log(id)
      },
    }

  }
</script>
<style scoped lang="less">
.remind-rule{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .add-remind{
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #3da8f5;
    i{
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
.remind{
  width: 100%;
  display: flex;
  position: relative;
  margin-top: 15px;
  &:hover{
    .rublish{
      display: block;
    }
  }
  .select{
    margin-right: 15px;
  }
  .rublish{
    cursor: pointer;
    font-size: 20px;
    color: grey;
    position: absolute;
    right: 0;
    line-height: 30px;
    display: none;
    &:hover{
      color: #3da8f5;
    }
  }
}
.save-wrap{
  margin-top: 15px;
  display: flex;
  flex-direction: row-reverse;
}
.participator{
  border-bottom:1px solid #eee;
  .involve-list {
    margin-top: 12px;
    .member-avatar{
      .ava{
        margin-right: 5px;
        cursor: pointer;
        border:2px solid transparent;
        img {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .close{
          display: none;
        }
      }
    }
    .member-avatar:not(:nth-child(1)) {
      .ava {
        margin-right: 5px;
        cursor: pointer;
        border:2px solid transparent;
        border-radius: 50%;
        &:hover{
          border:2px solid #a6a6a6;
          .close{
            display: block;
          }
        }
        img {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .close{
          position: absolute;
          font-size: 14px;
          top: -3px;
          right: 1px;
          width: 12px;
          height: 12px;
          line-height: 12px;
          border-radius: 50%;
          color: #fff;
          text-align: center;
          background-color: #a6a6a6;
          display: none;
          &:hover{
            background-color: #3da8f5;

          }
        }
      }
    }
  }

}
</style>
