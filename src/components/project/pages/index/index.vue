<template>
  <div class="task" :class="{ show: show }" @click="hideAddTask">
    <!-- 任务伸缩框 -->
    <div class="side" :class="showTaskDetailInfo ? 'active' : ''">
      <!-- <div class="nav" @click="showTaskDetailInfo=!showTaskDetailInfo">
      
      </div> -->
      <!--<left-task-info class="leftTaskInfo"></left-task-info>-->
      <div class="tab_container">
        <div class="task-group">
          <p>任务分组</p>
          <Icon type="md-add" color="#2db7f5" size="20" @click.native="showAddGroup = true" style="cursor: pointer" />
        </div>
        <ul>
          <li v-for="(g, index) in groups" :key="index" :class="{ groupActive: taskGroupId == g.groupId }" class="group-li" @click="changeGroup(g.groupId)">
            <div class="group-name">
              <div>{{ g.groupName }} · {{ g.completeCount }}/{{ g.taskTotal }}</div>
              <div class="group-icon">
                <Icon type="ios-brush-outline" @click.stop="groupEdit(g.groupId)"></Icon>
                <Icon type="ios-trash-outline" @click.stop="groupEditdel(g.groupId)"></Icon>
              </div>
            </div>
            <div class="group-progress">
              <div class="p1" :style="{ width: (g.completePercentage * 278) / 100 + 'px' }">
                <span>已完成 · {{ g.completeCount }}</span>
              </div>
              <div class="p2" :style="{ width: (g.noCompletePercentage * 278) / 100 + 'px' }">
                <span>未完成 · {{ g.notCompleteCount }}</span>
              </div>
              <div class="p3" :style="{ width: (g.beOverduePercentage * 278) / 100 + 'px' }">
                <span>已逾期 · {{ g.beOverdue }}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="separator"><li class="line"></li></div>
        <div class="task-group">
          <p>视图</p>
        </div>
        <ul>
          <li class="custom-view-wrapper" @click="checkView(item.id)" v-for="(item, index) in viewList" :class="{ groupActive: viewId == item.id }">
            <div class="custom-view">
              <Icon :type="item.icon" size="20" color="#595959" class="icon-list" />
              <div>{{ item.viewName }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="board-left-panel-indicator">
        <div class="root__3UYM" @click="getGroup" :class="show ? 'left' : 'right'">
          <i class="left__1DdF"></i>
          <i class="indicator__1TO8"></i>
        </div>
      </div>
    </div>
    <!-- 右边可拖拽盒子 -->
    <!--看板视图-->
    <draggable
      v-if="view === '看板视图'"
      class="column-main dragscroll"
      v-model="allTask"
      :options="{handle: '.handle',dragClass: 'boxDragClass',fallbackClass: 'boxFallbackClass',forceFallback: true,delay: 1,preventDragY: true}"
      @end="dragBox">
      <div class="column" :key="k" v-for="(i, k) in allTask">
        <div style="max-height: calc(100vh - 145px); position: relative" :data-index="k">
          <div class="add-Box" v-if="addBtns">
              <Button type="info" long icon="md-add" @click.stop="addCurTask(i.parentId, i.relationId, i.taskList, k)"></Button>
          </div>
          <div class="title handle">
            <span>{{ i.relationName }} · {{ i.taskList ? i.taskList.length : "0" }}</span>
            <TaskMenu class="fr" :data="i"></TaskMenu><!-- 点击三角形出来的任务列表菜单组件 -->
          </div>
          <div class="scrum-stage-tasks" :ref="`scrollbox${i.relationId}`" :style="i.taskList.length * 60 + 42 > wHeight ? 'overflow-y: scroll' : ''">
            <draggable
              :list="i.taskList"
              :options="{ group: 'uncheckedTask',forceFallback: true,delay: 10,touchStartThreshold: 10,dragClass: 'dragClass',fallbackClass: 'fallbackClass'}"
              class="ul"
              @end="dragList">
              <div class="li" v-for="(a, b) in i.taskList" v-if="!a.taskStatus" :key="b" :data-id="a.taskId" @click.stop="initTask(a.taskId)">
                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="teskCheck" @click.stop="changeStatus(!a.taskStatus, k, b, a.taskId)"></div>
                  <div class="check">
                    <div @click.stop class="checkbox-wrap">
                      <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ a.taskName }}</div>
                    <Tooltip :content="a.executorName" placement="top" transfer>
                      <img :src="a.executorImg" class="ava" v-if="a.executorImg" alt="" />
                    </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label" v-if="a.endTime">
                        {{
                          $moment(a.endTime).calendar(null, {
                            sameDay: "[今天]LT",
                            nextDay: "[明天]LT",
                            lastDay: "[昨天]LT",
                            lastWeek: (now) => {
                              const startDate = $moment()
                                .week($moment().week())
                                .startOf("week")
                                .valueOf();
                              return a.endTime <= startDate ? "[上]dddLT" : "dddLT";
                            },
                            nextWeek: (now) => {
                              const endDate = $moment()
                                .week($moment().week())
                                .endOf("week")
                                .valueOf();
                              return a.endTime >= endDate ? "[下]dddLT" : "dddLT";
                            },
                            sameElse: "Y年M月D日LT",
                          })
                        }}
                      </span>
                      <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="a.remarks" style="margin-top: -5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="a.childCount>0">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ a.completeCount }}/{{ a.childCount }}</span>
                      </span>
                      <span class="label" v-if="a.bindCount>0" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="a.fileCount>0" style="margin-bottom: 2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="a.tagList" style="margin-bottom: 5px">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="show-sub-task" @click.stop="showSubTask(a.taskId,a)" v-if="a.childCount>0">
                      <Icon type="ios-arrow-down" size="18" v-if="!a.visible"/>
                      <Icon type="ios-arrow-up" size="18" v-else/>
                    </div>
                  </div>
                </div>
                
                <div class="liinner" v-for="(task, b) in a.taskList" v-if="a.visible" :key="task.taskId" :data-id="task.taskId" @click.stop="initTask(task.taskId)">
                <div class="task-mod" :class="renderTaskStatu(task.priority)">
                  <div class="teskCheck" @click.stop="changeSubStatus(task)"></div>
                  <div class="check">
                    <div @click.stop class="checkbox-wrap">
                      <Checkbox size="small" v-model="task.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ task.taskName }}</div>
                    <Tooltip :content="task.executorName" placement="top" transfer>
                      <img :src="task.executorImg" class="ava" v-if="task.executorImg" alt="" />
                    </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label" v-if="task.endTime">
                        {{
                          $moment(task.endTime).calendar(null, {
                            sameDay: "[今天]LT",
                            nextDay: "[明天]LT",
                            lastDay: "[昨天]LT",
                            lastWeek: (now) => {
                              const startDate = $moment()
                                .week($moment().week())
                                .startOf("week")
                                .valueOf();
                              return task.endTime <= startDate ? "[上]dddLT" : "dddLT";
                            },
                            nextWeek: (now) => {
                              const endDate = $moment()
                                .week($moment().week())
                                .endOf("week")
                                .valueOf();
                              return task.endTime >= endDate ? "[下]dddLT" : "dddLT";
                            },
                            sameElse: "Y年M月D日LT",
                          })
                        }}
                      </span>
                      <span class="label repeat-label" v-if="task.repeat !== '不重复'">{{ task.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="task.remarks" style="margin-top: -5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="task.childCount>0">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ task.completeCount }}/{{ task.childCount }}</span>
                      </span>
                      <span class="label" v-if="task.bindCount>0" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="task.fileCount>0" style="margin-bottom: 2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="task.tagList" style="margin-bottom: 5px">
                        <div class="tag-list" v-for="tag in task.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </draggable>

            <!--已完成任务区域 分成上下两段循环，让已经勾选的不能拖拽上去，只能拖到下面的位置并一直在下面 -->
            <draggable :list="i.taskList" :options="{ group: 'checkedTask', delay: 10 }" class="ul" @end="dragList">
              <div class="li done" v-if="a.taskStatus" v-for="(a, b) in i.taskList" :key="b" :data-id="a.taskId" @click.stop="initTask(a.taskId)">
                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="teskCheck" @click.stop="changeStatus(!a.taskStatus, k, b, a.taskId)"></div>
                  <div class="check">
                    <div class="checkbox-wrap" @click.stop>
                      <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ a.taskName }}</div>
                    <Tooltip :content="a.executorName" placement="top" transfer>
                      <img :src="a.executorImg" class="ava" v-if="a.executorImg != null" alt="" />
                    </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label" v-if="a.endTime">
                        {{
                          $moment(a.endTime).calendar(null, {
                            sameDay: "[今天]LT",
                            nextDay: "[明天]LT",
                            lastDay: "[昨天]LT",
                            lastWeek: (now) => {
                              const startDate = $moment()
                                .week($moment().week())
                                .startOf("week")
                                .valueOf();
                              return a.endTime <= startDate ? "[上]dddLT" : "dddLT";
                            },
                            nextWeek: (now) => {
                              const endDate = $moment()
                                .week($moment().week())
                                .endOf("week")
                                .valueOf();
                              return a.endTime >= endDate ? "[下]dddLT" : "dddLT";
                            },
                            sameElse: "Y年M月D日LT",
                          })
                        }}截止</span>
                      <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16"></Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="a.remarks" style="margin-top: -5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="a.childCount>0">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ a.completeCount }}/{{ a.childCount }}</span>
                      </span>
                      <span class="label" v-if="a.bindCount>0" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="a.fileCount>0" style="margin-bottom: 2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="a.tagList">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="show-sub-task" @click.stop="showSubTask(a.taskId,a)" v-if="a.childCount>0">
                      <Icon type="ios-arrow-down" size="18" v-if="!a.visible"/>
                      <Icon type="ios-arrow-up" size="18" v-else/>
                    </div>
                  </div>
                </div>
                <div class="liinner" v-for="(task, b) in a.taskList" v-if="a.visible" :key="task.taskId" :data-id="task.taskId" @click.stop="initTask(task.taskId)">
                <div class="task-mod" :class="renderTaskStatu(task.priority)">
                  <div class="teskCheck" @click.stop="changeSubStatus(task)"></div>
                  <div class="check">
                    <div @click.stop class="checkbox-wrap">
                      <Checkbox size="small" v-model="task.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ task.taskName }}</div>
                    <Tooltip :content="task.executorName" placement="top" transfer>
                      <img :src="task.executorImg" class="ava" v-if="task.executorImg" alt="" />
                    </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label" v-if="task.endTime">
                        {{
                          $moment(task.endTime).calendar(null, {
                            sameDay: "[今天]LT",
                            nextDay: "[明天]LT",
                            lastDay: "[昨天]LT",
                            lastWeek: (now) => {
                              const startDate = $moment()
                                .week($moment().week())
                                .startOf("week")
                                .valueOf();
                              return task.endTime <= startDate ? "[上]dddLT" : "dddLT";
                            },
                            nextWeek: (now) => {
                              const endDate = $moment()
                                .week($moment().week())
                                .endOf("week")
                                .valueOf();
                              return task.endTime >= endDate ? "[下]dddLT" : "dddLT";
                            },
                            sameElse: "Y年M月D日LT",
                          })
                        }}
                      </span>
                      <span class="label repeat-label" v-if="task.repeat !== '不重复'">{{ task.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="task.remarks" style="margin-top: -5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="task.childCount>0">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height: 10px; padding-left: 5px">{{ task.completeCount }}/{{ task.childCount }}</span>
                      </span>
                      <span class="label" v-if="task.bindCount>0" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="task.fileCount>0" style="margin-bottom: 2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="task.tagList" style="margin-bottom: 5px">
                        <div class="tag-list" v-for="tag in task.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </draggable>
            <div class="add" style="height: 45px" v-if="addBtns"></div>
          </div>
        </div>
      </div>
      <!-- 新建任务列表 -->
      <draggable class="column addList" :options="{ sort: false }" v-if="addBtns">
        <div class="title" v-if="showAdd" @click="showAdd = false">
          <span><Icon type="md-add"></Icon>新建任务列表...</span>
          <span></span>
        </div>
        <div class="newTask" v-if="!showAdd">
          <Input v-model="newProTitle" placeholder="新建任务列表..." style="width: 268px" />
          <div style="margin-top: 12px; text-align: right">
            <Button @click="showAdd = true; newProTitle = '';">取消</Button>
            <Button style="margin-left: 10px" :loading="isCreateTask" type="primary" @click="saveNewPro" :disabled="newProTitle == ''">保存</Button>
          </div>
        </div>
      </draggable>
    </draggable>
    <!--列表视图-->
    <div v-if="view === '列表视图'" class="column-main" style="padding: 0">
      <listView :viewId="viewId" :taskGroupId="taskGroupId"></listView>
    </div>
    <!--时间视图-->
    <div v-if="view === '时间视图'" class="column-main" style="padding: 0">
      <timeView></timeView>
    </div>
    <div v-if="view === '成员视图'">
      <memberView></memberView>
    </div>
    <!-- 点击列表出来的弹框。编辑列表 :closable="false" fullscreen-->
    <Modal v-model="showModal" class="myModal" :mask-closable="false" :closable="false" footer-hide fullscreen>
      <my-modal v-if="showModal" @close="showModal = false"></my-modal>
      <!-- <div>xxxx</div> -->
    </Modal>
    <Modal v-model="showAddGroup" :footer-hide="true" title="创建分组" :width="350">
      <Input v-model="groupName" placeholder="请输入分组名称" class="group-name-input" ref="input" />
      <div>
        <Button type="info" long @click="handleSave" :disabled="!groupName">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showAddGroupItem" :footer-hide="true" title="修改分组名称" :width="350">
      <Input v-model="groupNameItem" placeholder="请输入修改分组名称" class="group-name-input" ref="input" />
      <div>
        <Button type="info" long @click="handleSaveItem" :disabled="!groupNameItem">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showDelGroupItem" :footer-hide="true" title="删除分组名称" :width="350">
      <span>是否确定删除任务分组?</span>
      <div style="margin-top: 15px">
        <Button type="error" long @click="handleDelItem">确定</Button>
      </div>
    </Modal>

    <!--加载中-->
    <div class="demo-spin-container" v-if="loading">
      <Loading></Loading>
    </div>

    <!--创建 myy 2020-3-20 -->

    <Modal v-model="shwoCreate" title="创建任务" :width="440" :mask-closable="false" footer-hide>
      <creat-list v-if="shwoCreate" :projectId="projectId" :taskMenuId="taskMenuId" :taskGroupId="taskGroupId" @close="shwoCreate = false"></creat-list>
    </Modal>
  </div>
</template>

<script>
import creatList from "./components/creatList.vue"; // <!--创建 myy 2020-3-20 -->
import draggable from "vuedraggable";
import FilterBox from "./components/FilterBox";
import SortBox from "./components/SortBox";
import TaskMenu from "./components/TaskMenu.vue";
import myModal from "./components/taskdetail.vue";
import LeftTaskInfo from "./components/LeftTaskInfo";
import CurrentAdd from "./components/CurrentAdd";
import listView from "./listView";
import timeView from "./timeView";
import memberView from "./memberView";
import { dragscroll } from "@/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { sortTaskMenu, addnewTask, completeTask, cancelcompleteTask, dragTask, addTask, addGroup, changeGroup, changRelationName, delRelationName, selectTaskByExamples,subTasks } from "@/axios/api";
export default {
  name: "",
  components: {
    creatList, // <!--创建 myy 2020-3-20 -->
    draggable,
    timeView,
    listView,
    memberView,
    // FilterBox,
    // SortBox,
    TaskMenu,
    myModal,
    // LeftTaskInfo,
    // CurrentAdd
  },
  computed: {
    ...mapGetters("task", ["curTaskGroup", "abc"]),
    ...mapState("task", ["allTasks", "sort", "groups"]),
    ...mapState("app", ["view"]),
  },
  data() {
    return {
      shwoCreate: false, //打开新建任务 创建 myy 2020-3-20
      show: false,
      showmodal: false,
      showAdd: true,
      isCreateTask: false,
      beforeClick: true,
      currentEditId: "",
      newProTitle: "",
      taskMenuId: null,
      taskGroupId: null,
      projectId: this.$route.params.id,
      active: "a",
      priority: "1",
      showModal: false,
      loadingShow: true,
      taskMenuvisible: false,
      wHeight: window.outerHeight - 261,
      textarea: "",
      arr: [1, 2, 3],
      showTaskDetailInfo: false, //左侧任务三角下拉详情
      activeModalData: {
        //是数据里面的arr里面的每一项
      },
      showAddGroup: false,
      showAddGroupItem: false,
      showDelGroupItem: false,
      curGroupItemId: "",
      groupName: "",
      groupNameItem: "",
      loading: true,
      allTask: [],
      showGroupPower: "",
      taskId: "",
      viewList: [
        { viewName: "所有任务", icon: "md-list", id: "1" },
        { viewName: "我执行的任务", icon: "md-contact", id: "3" },
        { viewName: "今天的任务", icon: "md-calendar", id: "2" },
        { viewName: "未完成的任务", icon: "md-alert", id: "6" },
        { viewName: "待认领的任务", icon: "md-person-add", id: "5" },
        { viewName: "已完成的任务", icon: "md-checkbox", id: "4" },
      ],
      addBtns: true,
      viewId: null,
      subTaskList:[]
    };
  },
  mounted() {
    this.taskGroupId = this.$route.params.groupId;
    this.initTasks();
    this.updateView(null);
  },
  watch: {
    allTasks(newName, oldName) {
      this.allTask = newName;
    },
    deep: true,
    view(val) {
      if (this.viewId == null || val == "时间视图" || val == "成员视图") {
        this.init(this.projectId).then((res) => {
          this.loading = false;
          this.allTask = this.allTasks;
        });
        this.viewId = null;
      } else {
        this.checkView(this.viewId);
      }
    },
  },
  methods: {
    ...mapActions("task", ["init", "editTask"]),
    ...mapMutations("task", ["changeTask", "setTaskId"]),
    ...mapMutations("view", ["updateView"]),
    showSubTask(taskId,a){
        subTasks(taskId).then(res=>{
          if(res.result==1){
            a.taskList = res.data;
            a.visible = !a.visible;
          }
        });
    },
    initTasks() {
      this.init(this.projectId).then((res) => {
        this.loading = false;
        this.allTask = this.allTasks;
        if (localStorage.taskId != "undefined" && localStorage.taskId != undefined) {
          this.initTask(localStorage.taskId);
        }
      });
      window.onscroll = () => {
        this.wHeight = window.outerHeight - 261;
      };
      dragscroll(["column-main", "scrum-stage-tasks"]);
    },
    hideAddTask() {
      this.currentEditId = "";
    },
    //修改企业名
    groupEdit(id) {
      this.showAddGroupItem = true;
      this.curGroupItemId = id;
    },
    //删除任务
    groupEditdel(id) {
      this.showDelGroupItem = true;
      this.curGroupItemId = id;
    },
    changeGroup(groupId) {
      this.taskGroupId = groupId;
      this.loading = true;
      this.addBtns = true;
      this.viewId = null;
      this.updateView(null);
      changeGroup(groupId, this.projectId).then((res) => {
        if (res.result == 1) {
          this.$router.replace(`/project/${this.projectId}/tasks/group/${groupId}`);
          this.init(this.projectId).then((res) => {
            this.loading = false;
          });
        }
      });
      //  getIsGroupPower(groupId).then(res=>{
      //     //检测是否进入分组权限
      //      if(res.data=='0'){
      //      //0是没有权限
      //         this.$Message.error("您没有当前权限");
      //        return
      //     }else{

      //     }
      // })
    },
    //修改分组名称
    handleSaveItem() {
      const data = {
        id: this.curGroupItemId,
        name: this.groupNameItem,
      };
      changRelationName(data).then((res) => {
        if (res.result == 1) {
          this.showAddGroupItem = false;
          this.$store.commit("task/changNameGroup", data);
          this.$Message.success("修改任务分组名称");
        } else {
          this.$Message.error("修改任务分组失败");
        }
      });
    },
    //删除分组名称
    handleDelItem() {
      const data = {
        id: this.curGroupItemId,
        name: this.groupNameItem,
      };
      delRelationName(data.id).then((res) => {
        if (res.result == 1) {
          this.showDelGroupItem = false;
          this.$store.commit("task/changDelGroup", data);
          this.$Message.success("删除任务分组名称");
        } else {
          this.$Message.error("删除任务分组失败");
        }
      });
    },
    handleSave() {
      //this.loading = true;
      this.showAddGroup = false;
      addGroup(this.projectId, this.groupName).then((res) => {
        this.$store.commit("task/addGroup", res.data);
        // if (res.result === 1) {
        //   this.taskGroupId = res.groupId;
        //   this.$router.replace(`/project/${this.projectId}/tasks/group/${res.groupId}`);
        //   this.init(this.projectId).then(res => {
        //     this.loading = false;
        //   });
        //   setTimeout(() => {
        //      this.show= true
        //   }, 3000);

        // }
      });
    },
    getGroup() {
      this.show = !this.show;
    },

    //打开任务详情
    initTask(taskId) {
      console.log(taskId);
      this.showModal = true;
      this.taskId = taskId;
      this.setTaskId(taskId);
    },

    addCurTask(groupId, id, taskList, index) {
      this.currentEditId = id;
      this.taskMenuId = id;
      this.shwoCreate = true;
    },
    // 创建任务
    createTask() {
      if (this.textarea == "") {
        this.$Message.error("请输入任务内容");
        return;
      }
      this.isCreateTask = true; //打开loading
      let data = {
        taskName: this.textarea,
        projectId: this.projectId,
        taskMenuId: this.taskMenuId,
        taskGroupId: this.taskGroupId,
      };
      addTask(data).then((res) => {
        if (res.result === 1) {
          this.textarea = "";
          this.isCreateTask = false;
        }
      });
    },
    dragBox(evt) {
      console.log(this.allTask);
      //拖拽大盒子
      //this.changeTask(this.allTask);
      //获取拖动的大盒子的id排序数组
      let newArr = this.allTask.map((v) => v.relationId).join(",");
      sortTaskMenu(newArr).then((res) => {});
    },
    dragList(evt) {
      //拖拽小的任务列表项 排序
      let targetIndex = evt.to.parentNode.parentNode.getAttribute("data-index");
      let obj = this.allTask[targetIndex];
      let listId = obj.taskList
        .map((v) => {
          return v.taskId;
        })
        .join(",");
      let taskId = evt.clone.getAttribute("data-id");
      let finalObj = {
        //发给后台的数据
        newMenu: obj.relationId, //当前菜单id
        taskId: taskId, //当前拖动的任务的id
        taskIds: listId, //逗号隔开的id
        projectId: this.projectId, //项目id
      };
      dragTask(finalObj).then((res) => {
        console.log(res);
        if (res.result == 2) {
          this.initTasks();
        }
      });
    },
    changeStatus(flag, i, j, taskId) {
      //i是外层循环的索引，j是嵌套循环的索引
      if (flag) {
        //完成任务  请求
        completeTask(this.projectId, taskId, 0).then((res) => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      } else {
        //取消完成任务 请求
        cancelcompleteTask(this.projectId, taskId, 0).then((res) => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    changeSubStatus(task){
      if (!task.taskStatus) {
        //完成任务  请求
        task.taskStatus = !task.taskStatus;
        completeTask(this.projectId, task.taskId, 0).then((res) => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      } else {
        task.taskStatus = !task.taskStatus;
        //取消完成任务 请求
        cancelcompleteTask(this.projectId, task.taskId, 0).then((res) => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    saveNewPro() {
      this.isCreateTask = true;
      //这里发请求，字段有：项目id,任务分组的id,新建任务的title
      // console.log(this.projectId,this.menuGroupId,this.newProTitle)
      addnewTask(this.projectId, this.taskGroupId, this.newProTitle).then((res) => {
        if (res.result == 1) {
          this.newProTitle = "";
          this.showAdd = true;
          this.init(this.projectId);
          this.isCreateTask = false;
        }
      });
    },
    renderTaskStatu(priority) {
      if (priority == "" || priority == "普通") {
        priority = "";
      } else if (priority == "紧急") {
        priority = "warning";
      } else {
        priority = "urgent";
      }
      return priority;
      // return priority=='普通'?'':(priority=='紧急'?'warning':'urgent')
    },
    checkView(id) {
      this.viewId = id;
      this.updateView(id);
      if (this.view == "看板视图") {
        selectTaskByExamples(id, this.taskGroupId, this.projectId).then((res) => {
          this.allTask = [];
          let obj = new Object();
          obj.taskList = res.data;
          obj.relationName = "任务";
          this.allTask.push(obj);
          this.addBtns = false;
        });
      }
    },
  },
};
</script>

<style lang="less">
@import "./index";
.add-Box {
  position: absolute;
  bottom: 0px;
  left: 2.5%;
  width: 93%;
  min-height: 32px;
  padding-bottom: 10px;
  z-index: 999;
  background: #ececec;
}
.add-task-box {
  width: 272px;
  height: 125px;
  background-color: white;
  margin: 8px;
  padding: 8px;
  textarea {
    width: 100%;
    min-height: 60px;
    border: 1px solid #d2d2d2;
    padding: 10px;
    border-radius: 3px;
  }
  .add-task-btn {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
  }
}
.group-progress {
  width: 278px;
  height: 8px;
  border-radius: 8px;
  display: flex;
  margin-left: 10px;
  background-color: #e5e5e5;
  /deep/ .ivu-tooltip-rel {
    display: block;
  }
  span {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    background-color: gray;
    padding: 5px 10px;
    color: white;
    display: none;
    width: 80px;
    &::after {
      content: "";
      border-top: solid 7px gray;
      border-left: solid 7px #00800000;
      border-right: solid 7px #00800000;
      border-bottom: solid 0px #00800000;
      position: absolute;
      left: 40%;
      top: 100%;
    }
  }
  .p1 {
    background-color: #75c940;
    height: 8px;
    position: relative;
    &:hover {
      span {
        display: block;
      }
    }
  }
  .p2 {
    background-color: #3da8f5;
    height: 8px;
    position: relative;
    &:hover {
      span {
        display: block;
      }
    }
  }
  .p3 {
    background-color: #ff4f3e;
    height: 8px;
    position: relative;
    &:hover {
      span {
        display: block;
      }
    }
  }
}
.group-name {
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  .group-icon {
    margin-right: 15px;
    i {
      padding-left: 10px;
    }
  }
}
.groupActive {
  background-color: #f5f5f5;
}
.group-li {
  height: 45px;
  padding-top: 5px;
  cursor: pointer;
}
.group-name-input {
  margin-bottom: 10px;
}
.show-sub-task{
  position: absolute;
  bottom: 5px;
  right: 5px;
  cursor: pointer;
}
</style>
