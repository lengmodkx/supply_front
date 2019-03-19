<template>
  <div class="insertTask">
    <Input v-model="textarea1"
           type="textarea"
           placeholder="任务内容"
           ref="input" />
    <div class="ownner">
      <!-- 设置认领者 -->
      <SetExecutor ref="executor"
                   v-model="executor">
        <template slot-scope="scope">
          <div class="executor">
            <svg-icon name="people"
                      v-if="!scope.executor"></svg-icon>
            <span class="conText">
              <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${scope.executor?scope.executor.image:''}`"
                   alt="">
              {{scope.executor?scope.executor.userName:'待认领'}}
              <!-- {{scope.executor?scope.executor.userId:''}} -->

            </span>
            <Tooltip content="执行者是任务的负责人，每个任务对应唯一执行者"
                     placement="left"
                     transfer>
              <Icon type="ios-help"></Icon>
            </Tooltip>
          </div>
        </template>
      </SetExecutor>
    </div>

    <div class="startHide"
         v-if="!startShow">
      <div class="sTime">
        <Icon type="android-calendar"></Icon>
        <DateTimePicker type="start"
                        ref="datetimepicker1"
                        :max="endDate"
                        @confirm="confirm1">
          <div class="init"
               v-if="!startDate">设置开始时间</div>
          <div class="setTime"
               v-if="startDate">
            {{$moment(startDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
            <span @click.stop="deleteStart">&times;</span>
          </div>
        </DateTimePicker>
      </div>
      <div class="eTime">
        <Icon type="android-calendar"></Icon>
        <DateTimePicker type="end"
                        ref="datetimepicker2"
                        :min="startDate"
                        @confirm="confirm2">
          <div class="init"
               v-if="!endDate">设置截止时间</div>
          <div class="setTime"
               v-if="endDate">
            {{$moment(endDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
            <!-- {{data.endDate}} -->
            <span @click.stop="deleteEnd">&times;</span>
          </div>
        </DateTimePicker>
      </div>
      <div class="repeat">
        <SetRepeat ref="repeat"
                   :repeat.sync="repeat">
          <template slot-scope="scope">
            <Icon type="ios-color-filter-outline"
                  size="20"></Icon>
            <span>{{scope.repeat.name}}</span>
          </template>
        </SetRepeat>
      </div>
      <div class="remind"
           @click="modal1=true">
        <Icon type="android-alarm-clock"></Icon>
        <span class="init"
              v-if="warnList.length==0">不提醒</span>
        <span v-if="warnList.length>0"
              style="color:#555;width:calc(100% - 26px);vertical-align:middle;"
              class="text-nowrap">
          <span>{{warnList[0].remindType}}</span>
          <span>{{warnList[0].num}}</span>
          <span>{{warnList[0].timeType}}</span>
          <span>提醒</span>
          <span v-for="(item,index) in memberList"
                :key="index">
            {{item.userName}}
            <span v-if="index!=memberList.length-1">、</span>
          </span>
        </span>
        <Modal v-model="modal1"
               class="taskwarn"
               @on-visible-change="modalVisibleChange">
          <TaskWarn @save="warnListSave"
                    ref="taskRemind"></TaskWarn>
        </Modal>
      </div>
      <div class="urgency clearfix">
        <Icon type="ios-circle-outline"
              class="urgentIcon fl"></Icon>
        <div class="urgentButton fl">
          <UrgentDropdown @priority="choosePriority($event)"></UrgentDropdown>
        </div>
      </div>
      <div class="tag clearfix">
        <Icon type="ios-pricetags-outline"
              class="fl"></Icon>
        <!-- 取到data.tag了再添加孙子辈组件 -->
        <Tags :taglist="tag"
              v-if="tag"
              @choosedTaglist="getTaglist($event)"
              :projectId="projectId"
              ref="tagref"></Tags>
      </div>
    </div>
    <div class="startShow"
         v-if="startShow"
         @click="startShow=false">
      <Icon type="android-more-horizontal"></Icon>
      更多
    </div>
    <div class="task-member">
      <h5>
        参与者 · {{involveDataList.length}}
        <Tooltip content="参与者将会收到评论和任务更新通知"
                 placement="right"
                 transfer>
          <Icon type="ios-help"></Icon>
        </Tooltip>
      </h5>
      <div class="involve-list clearfix">
        <div class="member-avatar fl"
             v-for="(item,index) in involveDataList"
             :key="index">
          <Tooltip :content="item.userName"
                   placement="top"
                   transfer>
            <div class="ava">
              <!-- 删除需要加在关闭按钮上 -->
              <img v-if="item.image"
                   :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.image}`"
                   alt="">
              <svg-icon v-else
                        style="width:24px;height:24px;display:block;"
                        name="allMember"></svg-icon>
              <span class="close"
                    @click="deleteInvolve(item.userId)">×</span>
            </div>
          </Tooltip>

        </div>
        <div class="addButton fl">
          <InvolveMember ref="involveMember"
                         :checkedList="involveList"
                         :projectId="projectId"
                         @save="saveInvolveMember"></InvolveMember>
        </div>
      </div>

    </div>
    <div class="privacy clearfix">
      <div class="p_left fl clearfix"
           @click="unlock=!unlock;">
        <div v-if="unlock">
          <Icon type="unlocked"
                class="fl"></Icon>
          <div class="p_title fl">
            <h5>隐私模式</h5>
            <p>所有成员可见</p>
          </div>
        </div>

        <div v-if="!unlock">
          <Icon type="locked"
                class="fl"></Icon>
          <div class="p_title fl">
            <h5>隐私模式</h5>
            <p>仅参与者可见</p>
          </div>
        </div>
      </div>
      <div class="p_right fr">
        <Button type="primary"
                :disabled="textarea1==''"
                size="large"
                @click="createTask">创建</Button>
      </div>
    </div>
  </div>
</template>
<script>
import TaskWarn from './TaskWarn'
import SetRepeat from './SetRepeat'
import SetExecutor from './SetExecutor'
import Tags from '@/components/public/common/Tags'
import { addTask } from '@/axios/api'
import { mapState } from 'vuex'
export default {
  props: ['projectId', 'taskGroupId', 'taskMenuId'],
  components: {
    TaskWarn,
    SetRepeat,
    SetExecutor,
    Tags
  },
  computed: {
    ...mapState('user', ['user']),
    focus () {
      let datetimepicker1 = this.$refs.datetimepicker1 ? this.$refs.datetimepicker1.visible : false
      let datetimepicker2 = this.$refs.datetimepicker2 ? this.$refs.datetimepicker2.visible : false
      let repeat = this.$refs.repeat ? this.$refs.repeat.visible : false
      let involveMember = this.$refs.involveMember ? this.$refs.involveMember.visible : false
      let executor = this.$refs.executor ? this.$refs.executor.visible : false
      let tagref = this.$refs.tagref ? this.$refs.tagref.Popvisible : false
      return datetimepicker1 || datetimepicker2 || repeat || this.modalVisible || this.textarea1 || involveMember || executor || tagref
    }
  },
  data () {
    return {
      idList: null,
      startShow: true,
      textarea1: '',
      unlock: true,
      modal1: false,
      modalVisible: false,//用于focus
      startDate: '',
      endDate: '',
      warnList: [
        // {timeType:'',time:'',unit:''}
      ],
      tag: [],
      taglist:null,
      repeat: '不重复',
      executor: -1,
      memberList: [],
      involveList: [], //参与者列表
      involveDataList: [],
      setPriority:''
    }
  },
  methods: {
    confirm1 (date) {
      this.startDate = date
    },
    confirm2 (date) {
      this.endDate = date
    },
    deleteStart () {
      this.startDate = ''
    },
    deleteEnd () {
      this.endDate = ''
    },
    warnListSave (warnList, memberList) {
      //得到的是一个数组
      this.warnList = warnList
      this.memberList = memberList
      // console.log(this.warnList)
      // console.log(this.memberList)

      this.$nextTick(_ => {
        this.modal1 = false;
      })
    },
    choosePriority (name){
        this.setPriority = name
    },
    getTaglist(taglist){
        this.taglist = taglist.join(',')
    },
    modalVisibleChange (visible) {
      this.$nextTick(_ => {
        this.modalVisible = visible
      })
    },
    /* fliterType (val) {
      switch (val) {
        case 1:
          return "任务开始时"
          break;
        case 2:
          return "任务开始前"
          break;
        case 3:
          return "任务开始后"
          break;
        case 4:
          return "任务截止时"
          break;
        case 5:
          return "任务截止前"
          break;
        case 6:
          return "任务截止后"
          break;
      }
    },
    fliterUnit (val) {
      switch (val) {
        case 1:
          return "分钟"
          break;
        case 2:
          return "小时"
          break;
        case 3:
          return "天"
          break;

      }
    }, */
    saveInvolveMember (ids, list) {
      this.involveList = ids
      this.involveDataList = list
      //要发给后台的选择的参与者的id列表，逗号隔开
      this.idList = this.involveList.join(',')
    },
    deleteInvolve (id) {
      if (id == this.user.userId) return//需获取当前登录用户id判断
      let index = this.involveList.indexOf(id)
      this.involveList.splice(index, 1)
      this.involveDataList.splice(index, 1)
    },

    createTask () { //添加任务
      let data = {
        taskName: this.textarea1, //必传
        projectId: this.projectId, //必传
        privacyPattern: this.unlock == true ? 1 : 0, //必传
        startTime: this.startDate,
        endTime: this.endDate,
        repeat: this.repeat,
        priority: this.setPriority,
        tagIds: this.taglist,  //标签id(多个逗号隔开)
        taskMenuId: this.taskMenuId, //必传
        taskGroupId: this.taskGroupId,  //必传
        memberIds: this.idList,  //任务参与者(多个逗号隔开) 必传
        executor: this.executor,
        taskRemindRules: JSON.stringify(this.warnList.map(v => {
          return Object.assign({}, v, {
            users: this.memberList.map(u => u.userId).join(',')
          })
        }))
      }
      // return    //最后要删掉这里
      addTask(data).then(res => {
         console.log(res)
        if (res.result == 1) {
          //请求成功后，给当前的taskList放进一条数据
          this.$emit('createComplete', data)
        }

      })
    }
  },
  mounted () {
    this.$refs.input.focus()
    this.involveList.push(this.user.userId)
    this.involveDataList.push(this.user)
    // console.log(this.user.userId)
    //
  }
}
</script>
<style scoped lang="less">
.insertTask {
  background-color: #fff;
  margin: 0 8px 8px;
  padding: 10px;
  color: gray;
  font-size: 14px;
  /deep/.ivu-input:hover {
    border-color: #dddee1;
  }
  /deep/.ivu-input:focus {
    border-color: #dddee1;
    outline: 0;
    box-shadow: 0 0 0 0;
  }
  .ownner {
    height: 40px;
    margin-top: 4px;
    padding-top: 10px;
    margin-bottom: 8px;
    .conText {
      cursor: pointer;
      line-height: 40px;
      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      &:hover {
        color: #2d8cf0;
      }
    }
    svg {
      width: 28px;
      height: 26px;
      vertical-align: middle;
    }
  }
  .startShow {
    cursor: pointer;
    line-height: 36px;
    i {
      font-size: 18px;
      margin-right: 8px;
    }
    &:hover {
      color: #2d8cf0;
    }
  }
  .startHide {
    .repeat {
      line-height: 36px;
    }
    .sTime,
    .eTime {
      line-height: 36px;
      i {
        font-size: 18px;
        margin-right: 8px;
      }
      .init {
        &:hover {
          color: #2d8cf0;
        }
      }
      .setTime {
        padding: 0 5px;
        position: relative;
        line-height: 36px;
        &:hover {
          border-radius: 20px;
          background-color: #eee;
          color: #2d8cf0;
          span {
            display: block;
          }
        }
        span {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          color: #fff;
          line-height: 16px;
          font-size: 20px;
          top: -5px;
          right: 0;
          background-color: gray;
          text-align: center;
          display: none;
        }
      }
    }

    .remind {
      line-height: 36px;
      white-space: normal;
      i {
        font-size: 18px;
        margin-right: 5px;
      }
    }
    .urgency {
      line-height: 36px;
      .urgentIcon {
        font-size: 18px;
        margin-right: 8px;
        margin-top: 8px;
      }
    }
    .tag {
      line-height: 36px;
      i {
        font-size: 18px;
        margin-right: 8px;
        margin-top: 8px;
      }
    }
  }
  .task-member {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 12px 0;
    margin: 10px 0;
    h5 {
      font-size: 14px;
    }
    .involve-list {
      margin-top: 8px;
      .member-avatar {
        .ava {
          margin-right: 5px;
          cursor: pointer;
          border: 2px solid transparent;
          img {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
          .close {
            display: none;
          }
        }
      }
      .member-avatar:not(:nth-child(1)) {
        .ava {
          margin-right: 5px;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 50%;
          &:hover {
            border: 2px solid #a6a6a6;
            .close {
              display: block;
            }
          }
          img {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
          .close {
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
          }
        }
      }
    }
  }
  .privacy {
    padding: 5px 0;
    .p_left {
      cursor: pointer;
      padding-left: 10px;
      i {
        color: #a6a6a6;
        font-size: 18px;
        margin-right: 10px;
      }
      h5 {
        margin-bottom: 4px;
        font-size: 14px;
        line-height: 22px;
        color: gray;
        font-weight: normal;
        &:hover {
          color: #2d8cf0;
        }
      }
      p {
        font-size: 12px;
        line-height: 14px;
        color: #a6a6a6;
      }
    }
  }
}
</style>

