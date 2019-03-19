<template>
  <div class="taskDetail">
    <div>
      <Input v-model="filterName"
             size="large"
             placeholder="搜索分组" />
      <div>
        <RadioGroup v-model="taskName"
                    size="large"
                    vertical
                    @on-change="radioChange">
          <Radio :label="item.id"
                 v-for="(item) in getTaskByName(filterName)"
                 :key="item.id">
            <div>
              <p>
                <span>{{item.name}}
                  <span class="num">· {{item.done}}/{{item.total}}</span>
                </span>
                <DetailMenu class="fr"
                            :data="item"></DetailMenu>
              </p>
              <p class="desc">{{item.desc}}</p>
              <p class="task-num-info"
                 v-if="item.urgency1 || item.urgency2 ||item.urgency3||item.urgency4">
                  <Tooltip :content="`已完成 ${item.urgency4}`"
                         placement="top">
                  <span class="probar bar4"
                        :style="`width:${item.urgency4/(item.urgency1+item.urgency2+item.urgency3+item.urgency4)*240}px`"></span>
                </Tooltip>
                <Tooltip :content="`近期任务 ${item.urgency1}`"
                         placement="top">
                  <span class="probar bar1"
                        :style="`width:${item.urgency1/(item.urgency1+item.urgency2+item.urgency3+item.urgency4)*240}px`"></span>
                </Tooltip>
                <Tooltip :content="`将到期 ${item.urgency2}`"
                         placement="top">
                  <span class="probar bar2"
                        :style="`width:${item.urgency2/(item.urgency1+item.urgency2+item.urgency3+item.urgency4)*240}px`"></span>
                </Tooltip>
                <Tooltip :content="`已逾期 ${item.urgency3}`"
                         placement="top">
                  <span class="probar bar3"
                        :style="`width:${item.urgency3/(item.urgency1+item.urgency2+item.urgency3+item.urgency4)*240}px`"></span>
                </Tooltip>

              </p>
            </div>
          </Radio>
        </RadioGroup>
        <br>
        <br>
        <AddItem @click="addTaskGroup">添加任务分组</AddItem>
      </div>
    </div>
    <Modal v-model="addTaskGroupShow"
           class="newTaskGroup">
      <h5 class="modalTitle">新建</h5>
      <p>任务分组名称</p>
      <Input v-model="taskVal"
             placeholder="请输入"
             style="padding:0 16px;" />
      <p>任务分组描述</p>
      <Input v-model="taskDesc"
             class="taskDescri"
             type="textarea"
             placeholder="请输入"
             :rows="5" />
      <div class="foot">
        <Button type="primary"
                :disabled="taskVal==''&& taskDesc==''"
                size="large">创建</Button>
      </div>
    </Modal>

    <!-- 查看各种状态的任务 -->
    <div class="checkTask">
      <ul>
        <li v-for="item in taskTypeList"
            :key="item.id"
            @click="getCurTypeTaskList(item)">
          <span>
            <Icon :type="item.icon"></Icon>
          </span>
          <span>{{item.name}}</span>
        </li>
        <!-- 先选择成员 -->
        <li>
          <CheckMemberTask @showmodal="memberModal"></CheckMemberTask>
        </li>
      </ul>
    </div>
    <Modal v-model="taskTypeModalShow"
           :title="currentTaskType.name"
           class-name="mytaskModal vertical-center-modal header-center typeTaskModal">
      <div v-if="curTypeTaskList.length<=0"
           class="placeholder">
        <p style="margin-bottom:20px;">
          <Icon type="android-checkbox-outline"
                size="50"></Icon>
        </p>
        <p>目前还没有任务</p>
      </div>
      <div v-for="item in curTypeTaskList"
           :key="item.id" class="listItem"
           @click="nextModal=true;nextData=item;">
        <div class="task-mod left-color"
             :class="item.type">
          <div class="check"
               :class="item.checkbox?'done':''">
            <Checkbox v-model="item.checkbox" @on-change="finishTask"></Checkbox>
            <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
                 class="ava"
                 alt="">
            <div class="cont">
              {{item.title}}
              <span class="taskgroup">{{item.taskGroupName}}</span>
              <div class="grade"
                   v-if="item.parentTitle">属于任务：{{item.parentTitle}}</div>
            </div>
            <div class="time grade"
                 v-if="item.checkbox">{{$moment(item.completeTime).calendar(null,{sameDay: '[今天]', nextDay: '[明天]', nextWeek: 'ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}} 完成</div>
          </div>
        </div>


      </div>

    </Modal>

    <!-- 下一个编辑弹框 -->
        <Modal v-model="nextModal"
                 class="myModal">
            <EditList :data="nextData"></EditList>
        </Modal>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import DetailMenu from './_TaskDetailMenu.vue'
import EditList from './EditList.vue'
import CheckMemberTask from './CheckMemberTask.vue'
export default {
  data () {
    return {
      filterName: '',
      taskName: '',
      addTaskGroupShow: false,
      taskVal: '',
      nextModal:false,
      taskDesc: '',
      createTask: true,
      taskTypeModalShow: false,
      currentTaskTypeId: null,
      nextData:{},
      taskTypeList: [
        { id: 1, name: '今天的任务', icon: 'ios-calendar-outline' },
        { id: 2, name: '未完成的任务', icon: 'android-checkbox-outline-blank' },
        { id: 3, name: '已完成的任务', icon: 'android-checkbox-outline' },
        { id: 4, name: '待认领的任务', icon: 'ios-person-outline' },
        { id: 5, name: '已截止的任务', icon: 'ios-stopwatch-outline' }
        // { id: 6, name: '成员的任务', icon: 'ios-people-outline' }
      ],
      curTypeTaskList: []
    }
  },
  components: { DetailMenu,EditList,CheckMemberTask },
  computed: {
    ...mapGetters('task', ['getTaskByName']),
    ...mapState('task', ['taskGroup', 'curTaskGroupId']),
    currentTaskType () {
      return this.taskTypeList.find(v => v.id == this.currentTaskTypeId) || {}
    }
  },
  methods: {
    ...mapMutations('task', ['updateCurTaskGroupId']),
    radioChange (id) {
      this.updateCurTaskGroupId(id)
    },
    addTaskGroup () {
      this.addTaskGroupShow = true
    },
    finishTask () {
      this.nextModal = false
    },
    getCurTypeTaskList (item) {
      this.currentTaskTypeId = item.id;
      this.taskTypeModalShow = true
      // return
      this.curTypeTaskList = [{
        checkbox: false,
        title: "产品列表",
        id: "2-1",
        taskGroupName: '任务1',
        parentId: 2,
        parentTitle: "如果字数超多也没有问题的的，正常显示的啊，床前明月光。",
        tag: [2],
        startDate: '',
        endDate: '',
        executor: -1,
        sonTask: [{
                  id: '14',
                  title: '任务任务任务',
                  complete: false
                }],
        involveList: [3]
      },
      {
        checkbox: false,
        taskGroupName: '任务1',
        title: "如果字数超多也没有问题的的，正常显示的啊，床前明月光。",
        id: "2",
        tag: [2],
        startDate: '',
        endDate: '',
        executor: -1,
        sonTask: [{
                  id: '14',
                  title: '任务任务任务',
                  complete: false
                }],
        involveList: [3]
      },
      {
        checkbox: false,
        taskGroupName: '任务1',
        type: "urgent",
        title: "根据客户给客户结构",
        id: "2-3",
        tag: [2],
        startDate: '',
        endDate: '',
        executor: -1,
        sonTask: [{
                  id: '14',
                  title: '任务任务任务',
                  complete: false
                }],
        involveList: [3]
      },
      {
        checkbox: true,
        completeTime: '2018-08-11 15:32:13',//8月11日
        // completeTime: '2018-09-11 15:32:13',//今天
        // completeTime: '2018-09-05 15:32:13',//上周三
        // completeTime: '2018-09-10 15:32:13',//昨天
        taskGroupName: '任务1',
        type: "warning",
        title: "床前明月光床前明月光床前明月光床前明月光床前明月光床前明月光",
        id: "2-4",
        tag: [2],
        startDate: '',
        endDate: '',
        executor: -1,
        sonTask: [{
                  id: '14',
                  title: '任务任务任务',
                  complete: false
                }],
        involveList: [3]
      }]
    },
    memberModal (id) {//status为modal的状态，id为选择的成员的id
      this.nextModal=true
      // 根据这个id发请求，改变modal里面的数据

    }
  },
  created () {
    this.taskName = this.curTaskGroupId
  }
}
</script>
<style scoped lang="less">
@import './EditList.less';
.taskDetail {
  > div {
    padding: 10px;
  }
  .ivu-radio-group {
    width: 100%;
  }
  .ivu-radio-wrapper {
    height: auto;
    white-space: normal;
    margin-right: 0;
    &:not(:last-child) {
      margin-bottom: 5px;
    }
    > div {
      display: inline-block;
      width: calc(100% - 30px);
      margin-left: 6px;
      margin-right: 0;
      vertical-align: top;
      p {
        font-family: sans-serif;
        .num {
          color: #a6a6a6;
        }
        &.desc {
          line-height: 16px;
          font-size: 12px;
          color: #a6a6a6;
          word-break: break-all;
        }
      }
      p.task-num-info {
        font-size: 0;
        line-height: 1;
        margin-top: 5px;

        span.probar {
          display: inline-block;
          vertical-align: top;
          height: 6px;
          .i-placeholder,
          .ivu-tooltip,
          .ivu-tooltip-rel {
            display: block;
            width: 100%;
            height: 100%;
          }
          &.bar1 {
            background-color: #3da8f5;
          }
          &.bar2 {
            background-color: #ffaf38;
          }
          &.bar3 {
            background-color: #ff4f3e;
          }
           &.bar4 {
            background-color: #75c940;
          }
        }
      }
    }
  }
  .checkTask {
    margin-top: 20px;
    border-top: 1px solid #eee;
    ul {
      li {
        line-height: 34px;
        cursor: pointer;
        font-size: 14px;
        color: #383838;
        &:hover {
          background: #eee;
        }
        i {
          font-size: 22px;
          vertical-align: middle;
          color: #a6a6a6;
          margin-right: 5px;
          padding-bottom:4px;
        }
      }
    }
  }
}
.listItem{
  cursor: pointer;
}
</style>
