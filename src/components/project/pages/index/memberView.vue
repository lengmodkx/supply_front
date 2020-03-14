<template>
  <div>
    <!-- 右边可拖拽盒子 -->
    <!--成员视图-->
    <draggable
      class="column-main dragscroll"
      v-model="allTask"
      :options="{
        handle: '.handle',
        dragClass: 'boxDragClass',
        fallbackClass: 'boxFallbackClass',
        forceFallback: true,
        delay: 1,
        touchStartThreshold:10,
        preventDragY: true // 修改Sortable.js源码  _onTouchMove dy =  options.preventDragY?0:...
      }"
      @end="dragBox"
    >
      <div class="column" :key="k" v-for="(i, k) in allTask">
        <div style="max-height: 85vh;position:relative;" :data-index="k" v-if="i.taskList">
          <div class="title handle">
            {{ i.userName }} · {{ i.taskList ? i.taskList.length : "0" }}
          </div>
          <div class="scrum-stage-tasks" :ref="`scrollbox${i.relationId}`" :style="i.taskList.length * 60 + 42 > wHeight ? 'overflow-y: scroll' : ''">
            <draggable :list="i.taskList" :options="{ group: 'uncheckedTask', forceFallback: true, delay: 0.5, dragClass: 'dragClass', fallbackClass: 'fallbackClass' }" class="ul" @end="dragList">
              <div class="li" v-for="(a, b) in i.taskList" v-if="!a.taskStatus" :key="b" :data-id="a.taskId" @click="initTask(a.taskId)">
                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="teskCheck" @click.stop @click="changeStatus(!a.taskStatus, k, b, a.taskId)"></div>
                  <div class="check">
                    <div @click.stop class="checkbox-wrap">
                      <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ a.taskName }}</div>
                     <Tooltip :content="a.executorName"  placement="top">
                        <img :src="a.executorImg" class="ava" v-if="a.executorImg" alt="" />
                     </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label" v-if="a.endTime"
                        >{{ $moment(a.endTime).calendar(null, { sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "[下]dddLT", lastDay: "[昨天]LT", lastWeek: "[上]dddLT", sameElse: "Y年M月D日LT" }) }} 截止</span
                      >
                      <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="a.remarks" style="margin-top:-5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="a.taskList">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height:10px;padding-left:5px;">{{ a.completeCount }}/{{ a.taskList.length }}</span>
                      </span>

                      <span class="label" v-if="a.bindId" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="a.fileId" style="margin-bottom:2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="a.tagList" style="margin-bottom:5px">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>

            <!--已完成任务区域 分成上下两段循环，让已经勾选的不能拖拽上去，只能拖到下面的位置并一直在下面 -->
            <draggable :list="i.taskList" :options="{ group: 'checkedTask', delay: 0.5 }" class="ul" @end="dragList">
              <div class="li done" v-if="a.taskStatus" v-for="(a, b) in i.taskList" :key="b" :data-id="a.taskId" @click="initTask(a.taskId)">
                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="teskCheck" @click.stop @click="changeStatus(!a.taskStatus, k, b, a.taskId)"></div>
                  <div class="check">
                    <div class="checkbox-wrap" @click.stop>
                      <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                    </div>
                    <div class="cont">{{ a.taskName }}</div>
                     <Tooltip :content="a.executorName"  placement="top">
                    <img :src="a.executorImg" class="ava" v-if="a.executorImg != null" alt="" />
                     </Tooltip>
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper" v-if="a.taskList">
                    <div class="task-infos">
                      <span class="label time-label" v-if="a.endTime"
                        >{{ $moment(a.endTime).calendar(null, { sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "[下]dddLT", lastDay: "[昨天]LT", lastWeek: "[上]dddLT", sameElse: "Y年M月D日LT" }) }}截止</span
                      >
                      <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                      <!--<span class="label">-->
                      <!--<Icon class="icon" type="ios-alarm-outline" size="16"></Icon>-->
                      <!--</span>-->
                      <span class="label" v-if="a.remarks" style="margin-top:-5px">
                        <Icon type="ios-create-outline" size="18" />
                      </span>
                      <span class="label" style="margin-bottom: 3px" v-if="a.taskList">
                        <Icon type="ios-list" size="22" />
                        <span class="sonTask" style="line-height:10px;padding-left:5px;">{{ a.completeCount }}/{{ a.taskList.length }}</span>
                      </span>

                      <span class="label" v-if="a.bindId" style="margin-bottom: 3px">
                        <Icon type="ios-link" size="14" />
                      </span>
                      <span class="label" v-if="a.fileId" style="margin-bottom:2px">
                        <Icon type="md-paper" size="16" />
                      </span>
                      <div class="tag-box" v-if="a.tagList">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                          <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
            
          </div>
        </div>
      </div>
    </draggable>
    <!--加载中-->
    <div class="demo-spin-container" v-if="loading">
      <Loading></Loading>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FilterBox from "./components/FilterBox";
import SortBox from "./components/SortBox";
import TaskMenu from "./components/TaskMenu.vue";
import myModal from "./components/EditList.vue";
import LeftTaskInfo from "./components/LeftTaskInfo";
import CurrentAdd from "./components/CurrentAdd";
import memberView from "./memberView";
import { scrollTo, dragscroll } from "@/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { mView,enterTask, sortTaskMenu, addnewTask, completeTask, cancelcompleteTask, dragTask, addTask, group, getIsGroupPower } from "../../../../axios/api.js";
export default {
  name: "",
  components: {
    draggable,
    memberView,
    // FilterBox,
    // SortBox,
    TaskMenu,
    myModal
    // LeftTaskInfo,
    // CurrentAdd
  },
  computed: {
    ...mapGetters("task", ["curTaskGroup", "abc"]),
    ...mapState("task", ["sort", "groups"]),
  },
  data() {
    return {
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
      groupName: "",
      loading: true,
      allTask: [],
      showGroupPower: "",
      taskId: ""
    };
  },
  mounted() {
    this.taskGroupId = this.$route.params.groupId;
    mView(this.projectId).then(res => {
        console.log(res.data)
      this.loading = false;
      this.allTask = res.data;
    });
    window.onscroll = () => {
      this.wHeight = window.outerHeight - 261;
    };
    dragscroll(["column-main", "scrum-stage-tasks"]);
  },

  methods: {
    ...mapActions("task", ["init", "editTask"]),
    ...mapMutations("task", ["changeTask", "setTaskId"]),
    hideAddTask() {
      this.currentEditId = "";
    },
    changeGroup(groupId) {
      this.taskGroupId = groupId;
      this.loading = true;
      changeGroup(groupId, this.projectId).then(res => {
        if (res.result == 1) {
          this.$router.replace(`/project/${this.projectId}/tasks/group/${groupId}`);
          this.init(this.projectId).then(res => {
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
    handleSave() {
      this.loading = true;
      this.showAddGroup = false;
      addGroup(this.projectId, this.groupName).then(res => {
        if (res.result === 1) {
          this.taskGroupId = res.groupId;
          this.$router.replace(`/project/${this.projectId}/tasks/group/${res.groupId}`);
          this.init(this.projectId).then(res => {
            this.loading = false;
          });
        }
      });
    },
    getGroup() {
      this.show = !this.show;
    },

    //打开任务详情
    initTask(taskId) {
      this.taskId = taskId;
      this.setTaskId(taskId);
      this.showModal = true;
    },

    addCurTask(groupId, id, taskList, index) {
      this.currentEditId = id;
      this.taskMenuId = id;
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
        taskGroupId: this.taskGroupId
      };
      addTask(data).then(res => {
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
      let newArr = this.allTask.map(v => v.relationId).join(",");
      sortTaskMenu(newArr).then(res => {});
    },
    dragList(evt) {
      //拖拽小的任务列表项 排序
      let targetIndex = evt.to.parentNode.parentNode.getAttribute("data-index");
      let obj = this.allTask[targetIndex];
      let listId = obj.taskList
        .map(v => {
          return v.taskId;
        })
        .join(",");
      let taskId = evt.clone.getAttribute("data-id");
      let finalObj = {
        //发给后台的数据
        newMenu: obj.relationId, //当前菜单id
        taskId: taskId, //当前拖动的任务的id
        taskIds: listId, //逗号隔开的id
        projectId: this.projectId //项目id
      };
      dragTask(finalObj).then(res => {
        console.log(res);
      });
    },
    changeStatus(flag, i, j, taskId) {
      //i是外层循环的索引，j是嵌套循环的索引
      if (flag) {
        //第一种方法 先处理好了再发请求
        // let savedCheck = true;
        // if (this.simpleTasks[i].taskList[j + 1]) {
        //   savedCheck = this.simpleTasks[i].taskList[j + 1].taskStatus;
        // }
        // let tmp = this.simpleTasks[i].taskList.splice(j, 1);
        // this.simpleTasks[i].taskList.push(tmp[0]);
        // this.$set(this.simpleTasks[i].taskList[j], "taskStatus", true);
        // this.$nextTick(_ => {
        //   this.$set(this.simpleTasks[i].taskList[j], "taskStatus", savedCheck);
        // });

        //完成任务  请求
        completeTask(this.projectId, taskId, 0).then(res => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      } else {
        //取消完成任务 请求
        cancelcompleteTask(this.projectId, taskId, 0).then(res => {
          if (res.result == 0) {
            this.$Message.error(res.msg);
          }
        });
      }

      /*  let arr = JSON.parse(JSON.stringify(this.data)); 第二种方法：先请求再处理渲染
      this.$nextTick(_ => {
        this.$set(this.data[i].arr[j], "checkbox", !flag);
      });
      if (flag) {
        let tmp = arr[i].arr.splice(j, 1);
        arr[i].arr.push(tmp[0]);
        console.log({
          menuId: arr[i].id,
          curTaskid: arr[i].arr[arr[i].arr.length - 1].id,
          taskid: arr[i].arr.map(v => v.id)
        });这里发勾选之后的请求
      } else {
        console.log({ 这里发取消勾选的请求
          menuId: arr[i].id,
          curTaskid: arr[i].arr[j].id
        });
      } */
    },
    saveNewPro() {
      this.isCreateTask = true;
      //这里发请求，字段有：项目id,任务分组的id,新建任务的title
      // console.log(this.projectId,this.menuGroupId,this.newProTitle)
      addnewTask(this.projectId, this.taskGroupId, this.newProTitle).then(res => {
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
    }
  }
};
</script>