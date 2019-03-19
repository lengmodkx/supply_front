<template>
  <div class="wrap">
    <div class="warn-title">任务提醒设置</div>
    <div class="con">
      <div class="reminder-head clearfix">
        <div class="reminder-group-title fl">提醒规则</div>
        <div class="addReminder fr"
             @click="addNewreminder">
          <Icon type="plus-circled"
                style="margin-right:8px;"></Icon>添加新提醒
        </div>
      </div>
      <div class="reminder-list clearfix">
        <div class="no-reminders"
             v-if="warnList.length==0">不提醒</div>
        <div class="reminder-item"
             v-for="(item,index) in warnList"
             :key="index">
          <div class="selector fl clearfix">
            <div class="select1 fl">
              <Select style="width:160px;margin-right:5px;"
                      v-model="item.timeType"
                      @on-change="timeTypeChange($event,item)">
                <Option v-for="v in timeTypeList"
                        :value="v.id"
                        :key="v.id">{{v.name}}</Option>
              </Select>
            </div>
            <div class="select2 fl"
                 v-if="item.timeType==2||item.timeType==3||item.timeType==5||item.timeType==6">
              <Select style="width:140px;margin-right:5px;"
                      v-model="item.time">
                <Option v-for="v in times"
                        :value="v"
                        :key="v">{{v}}</Option>
              </Select>
            </div>
            <div class="select3 fl"
                 v-if="item.timeType==2||item.timeType==3||item.timeType==5||item.timeType==6">
              <Select style="width:140px"
                      v-model="item.unit"
                      @on-change="unitChange($event,item)">
                <Option v-for="v in unitList"
                        :value="v.id"
                        :key="v.id">{{v.name}}</Option>
              </Select>
            </div>

            <div class="icon fr">
              <Icon type="ios-trash-outline"
                    :size="24"
                    @click="deleteWarn(index)"></Icon>
            </div>
          </div>
          <div class="delete fr"></div>
        </div>
      </div>
      <div class="addMember">
        <div class="reminder-group-title">添加提醒对象</div>
        <div class="reminded-members-wrap">
          <div class="add-member-btn-wrap clearfix">
            <div class="avator"
                 v-for="(item,index) in targetUserList"
                 :key="index"
                 :style="`background-image:url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.image})`">
              <span class="close"
                    @click="$refs.memberList.del(item.userId)">&times;</span>
            </div>
            <MemberList ref="memberList"
                        @change="checkUserChange"></MemberList>
          </div>
          <div v-if="targetUserList.length<=0"
               class="no-members-tips">请先添加需要提醒的成员</div>
        </div>
      </div>
    </div>
    <div class="save">
      <Button type="primary"
              :disabled="targetUserList.length==0"
              size="large"
              @click="savechange">保存</Button>
    </div>
  </div>
</template>
<script>
import MemberList from './MemberList'
export default {
  components: {
    MemberList
  },
  data () {
    return {
      warnList: [],
      targetUserList: [],
      times: [],
      timeTypeList: [
        {
          id: 1,
          name: '任务开始时'
        },
        {
          id: 2,
          name: '任务开始前'
        },
        {
          id: 3,
          name: '任务开始后'
        },
        {
          id: 4,
          name: '任务截止时'
        },
        {
          id: 5,
          name: '任务截止前'
        },
        {
          id: 6,
          name: '任务截止后'
        }],
      unitList: [
        {
          id: 1,
          name: '分钟'
        }, {
          id: 2,
          name: '小时'
        }, {
          id: 3,
          name: '天'
        }]
    }
  },
  methods: {
    getTimeNumList (unit) {
      let obj = [{ id: 1, list: this.getListByNum(5, 60, 5) }, { id: 2, list: this.getListByNum(1, 24, 1) }, { id: 3, list: this.getListByNum(1, 30, 1) }].find(v => v.id == unit)
      return obj ? obj.list : []
    },
    getListByNum (start, end, step) {
      let arr = []
      for (let i = 0; i <= (end - start) / step; i++) {
        arr.push(i * step + start)
      }
      return arr
    },
    addNewreminder () {
      this.warnList.push({
        timeType: 4
        // time: 5,
        // unit: 1
      })
    },
    timeTypeChange (v, item) {
      if (v == 2 || v == 3 || v == 5 || v == 6) {
        item.time = 5
        item.unit = 1
      } else {
        delete item.time
        delete item.unit
      }
    },
    unitChange (v, item) {
      // v为选择的unit,times为第二个select将要循环的数组
      // let times = this.getTimeNumList(v)
      this.times = this.getTimeNumList(v)
      item.time = this.times.find(t => t >= item.time) || this.times[this.times.length - 1]
    },
    deleteWarn (index) {
      this.warnList.splice(index, 1)
    },
    checkUserChange (list) {
      this.targetUserList = list
    },
    savechange () {
      let warn = []
      this.warnList.forEach(v => {
        let remindType = this.timeTypeList.find(vv => vv.id == v.timeType)
        let timeType = this.unitList.find(vv => vv.id == v.unit)
        remindType = remindType ? remindType.name : undefined
        timeType = timeType ? timeType.name : undefined
        warn.push({
          remindType,
          num: v.time,
          timeType
        })
      })
      this.$emit('save', warn, this.targetUserList)
    }
  },
  mounted () {
    document.getElementById('warnModal').children[1].style.zIndex = '1009';
    document.getElementById('warnModal').children[0].style.zIndex = '1009';
    this.times = this.getTimeNumList(1)
  }
}
</script>
<style scoped lang="less">
.wrap {
  min-height: 100px;
}
.warn-title {
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  color: #383838;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.con {
  padding: 16px;
  .reminder-head {
    font-size: 14px;
    margin-top: 15px;
    .addReminder {
      cursor: pointer;
      color: #2d8cf0;
      &:hover {
        color: #2a75ab;
      }
    }
  }
  .selector {
    width: 100%;
    margin-bottom: 6px;
  }
  .reminder-item {
    &:hover .icon {
      display: block;
    }
    .icon {
      margin-top: 4px;
      margin-left: 10px;
      cursor: pointer;
      display: none;
      &:hover {
        color: #2d8cf0;
      }
    }
  }
  .addMember {
    .popover-members-selector {
      margin: 4px -4px 0;
      height: 32px;
    }

    .add-member-btn-wrap {
      margin: 8px 4px 0;
      vertical-align: top;
      .avator {
        width: 25px;
        height: 25px;
        float: left;
        border-radius: 50%;
        background: #eee center/contain no-repeat;
        margin-right: 4px;
        cursor: pointer;
        position: relative;
        &:hover {
          border: 2px solid #a6a6a6;
        }
        &:hover .close {
          display: block;
        }
        .close {
          position: absolute;
          font-size: 14px;
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
    .reminder-group-title {
      margin: 12px 0;
    }
    .no-members-tips {
      font-size: 12px;
      color: #ff4f3e;
      margin-top: 12px;
    }
  }
}
.save {
  text-align: right;
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding: 16px;
}
</style>

