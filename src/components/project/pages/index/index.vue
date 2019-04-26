<template>
  <div class="task" :class="{show:show}" @click="hideAddTask">
    <!-- 任务伸缩框 -->
    <div class="side" :class="showTaskDetailInfo?'active':''">
      <!-- <div class="nav" @click="showTaskDetailInfo=!showTaskDetailInfo">
      
      </div> -->
      <!--<left-task-info class="leftTaskInfo"></left-task-info>-->
      <div class="tab_container">
        <div class="task-group">
          <p>任务分组</p>
          <Icon type="md-add" color="#2db7f5" size="20" />
        </div>
        <ul>
          <li v-for="(g,index) in groups" :key="index">
            <div>{{g.relationName}}</div>
          </li>
        </ul>
      </div>

      <div class="board-left-panel-indicator">
        <div class="root__3UYM" @click="getGroup" :class="show?'left':'right'">
          <i class="left__1DdF"></i>
          <i class="indicator__1TO8"></i>
        </div>
      </div>
    </div>
    <!-- 右边可拖拽盒子 -->
    <draggable class="column-main dragscroll" v-model="allTask" :options="{
                  handle:'.handle',
                  chosenClass: 'boxChosenClass',
                  dragClass: 'boxDragClass',
                  fallbackClass: 'boxFallbackClass',
                  forceFallback: true,
                  preventDragY: true// 修改Sortable.js源码  _onTouchMove dy =  options.preventDragY?0:...
                   }" @end="dragBox">

      <div class="column" :key="k" v-for="(i, k) in allTask">
        <div style="max-height: 100%;position:relative;" :data-index="k">
          <div class="title handle">
            {{i.relationName}} · {{i.taskList ? i.taskList.length : '0'}}
            <!-- 点击三角形出来的任务列表菜单组件 -->
            <TaskMenu class="fr" :data=i></TaskMenu>
          </div>
          <div class="scrum-stage-tasks" :ref="`scrollbox${i.relationId}`" :style="(i.taskList.length*60+42)>wHeight?'overflow-y: scroll':''">
            <draggable :list="i.taskList" :options="{group:'uncheckedTask',
                        forceFallback: true,
                        chosenClass: 'chosenClass',
                        dragClass: 'dragClass',
                        fallbackClass: 'fallbackClass'}" class="ul" @end="dragList">
              <div class="li" v-for="(a, b) in i.taskList" v-if="!a.taskStatus" :key="b" :data-id="a.taskId" @click="initTask(a.taskId)">

                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="check">
                    <div @click.stop class="checkbox-wrap">
                      <Checkbox size="small" v-model="a.taskStatus" @on-change="changeStatus($event,k,b,a.taskId)"></Checkbox>
                    </div>
                    <div class="cont">{{a.taskName}}</div>
                    <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${a.executorImg}`" class="ava" v-if="a.executorImg" alt="">
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">
                      <span class="label time-label">9月12日 截止</span>
                      <span class="label repeat-label">每周重复</span>
                      <span class="label">
                        <Icon class="icon" type="ios-alarm-outline" size="16"></Icon>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="document" size="16"></Icon>
                      </span>
                      <span class="label" style="margin-bottom: 5px">
                        <Icon class="icon" type="ios-list-outline" size="16"></Icon><span class="sonTask">{{a.completeCount}}/{{a.childCount}}</span>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="link" size="16"></Icon>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="android-attach" size="16"></Icon>
                      </span>
                      <!-- <div class="tag-box" v-if="a.tagList">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId"><i :style="{backgroundColor:tag.bgColor}"></i><span>{{tag.tagName}}</span></div>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </draggable>

            <div @click.stop class="add-task-box" v-show="currentEditId==i.relationId" ref="currentadd">
              <textarea placeholder="任务内容" v-model="textarea"></textarea>
              <div class="add-task-btn">
                <Button @click="createTask()" type="primary">创建</Button>
              </div>
            </div>

            <!--已完成任务区域 分成上下两段循环，让已经勾选的不能拖拽上去，只能拖到下面的位置并一直在下面 -->
            <draggable :list="i.taskList" :options="{group:'checkedTask'}" class="ul" @end="dragList">
              <div class="li done" v-if="a.taskStatus" v-for="(a, b) in i.taskList" :key="b" :data-id="a.taskId" @click="initTask(a.taskId)">

                <div class="task-mod" :class="renderTaskStatu(a.priority)">
                  <div class="check">
                    <div class="checkbox-wrap" @click.stop>
                      <Checkbox size="small" v-model="a.taskStatus" @on-change="changeStatus($event,k,b,a.taskId)"></Checkbox>
                    </div>
                    <div class="cont">{{a.taskName}}</div>
                    <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${a.executorImg}`" class="ava" v-if="a.executorImg!=null" alt="">
                  </div>
                  <!-- 小图标 -->
                  <div class="task-info-wrapper">
                    <div class="task-infos">

                      <span class="label time-label">9月12日 截止</span>
                      <span class="label repeat-label">每周重复</span>
                      <span class="label">
                        <Icon class="icon" type="ios-alarm-outline" size="16"></Icon>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="document" size="16"></Icon>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="ios-list-outline" size="16"></Icon><span class="sonTask">{{a.completeCount}}/{{a.childCount}}</span>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="link" size="16"></Icon>
                      </span>
                      <span class="label">
                        <Icon class="icon" type="android-attach" size="16"></Icon>
                      </span>
                      <!-- <div class="tag-box" v-if="a.tagList">
                        <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId"><i :style="{backgroundColor:tag.bgColor}"></i><span>{{tag.tagName}}</span></div>
                      </div> -->
                    </div>
                  </div>

                </div>
              </div>

            </draggable>

            <span class="add" @click.stop="addCurTask(i.parentId,i.relationId,i.taskList, k)" v-if="currentEditId!=i.relationId">
              <Icon type="android-add-circle"></Icon>
              <Button type="info" long>添加任务</Button>
            </span>
          </div>

        </div>
      </div>

      <!-- 新建任务列表 -->
      <draggable class="column addList" :options="{sort:false}">
        <div class="title" v-if="showAdd" @click="showAdd=false">
          <Icon type="plus-round"></Icon>
          新建任务列表...
        </div>
        <div class="newTask" v-if="!showAdd">
          <Input v-model="newProTitle" placeholder="新建任务列表..." style="width:268px" />
          <div style="margin-top:12px;text-align:right;">
            <Button @click="showAdd=true;newProTitle='';">取消</Button>
            <Button style="margin-left: 10px" type="primary" @click="saveNewPro" :disabled="newProTitle==''">保存</Button>
          </div>
        </div>

      </draggable>

    </draggable>
    <!-- 点击列表出来的弹框。编辑列表 -->
    <Modal v-model="showModal" class="myModal">
      <my-modal v-if="showModal"></my-modal>
    </Modal>
    <!--加载中-->
    <div class="demo-spin-container" v-if="!allTask.length">
      <Loading></Loading>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FilterBox from "./components/FilterBox";
import SortBox from "./components/SortBox";
import TaskMenu from "./components/TaskMenu";
import myModal from "./components/EditList";
import LeftTaskInfo from "./components/LeftTaskInfo";
import CurrentAdd from "./components/CurrentAdd";
import { scrollTo, dragscroll } from "@/utils";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  enterTask,
  sortTaskMenu,
  addnewTask,
  completeTask,
  cancelcompleteTask,
  dragTask,
  addTask,
  group
} from "@/axios/api";
export default {
  name: "",
  components: {
    draggable,
    FilterBox,
    SortBox,
    TaskMenu,
    myModal,
    LeftTaskInfo,
    CurrentAdd
  },
  computed: {
    ...mapGetters("task", ["curTaskGroup", "abc"]),
    ...mapState("task", ["allTask", "sort"])
  },
  data() {
    return {
      show: false,
      showmodal: false,
      showAdd: true,
      beforeClick: true,
      currentEditId: "",
      newProTitle: "",
      taskMenuId: null,
      taskGroupId: null,
      menuGroupId: null,
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
      groups: []
    };
  },
  mounted() {
    this.init(this.projectId);
    this.taskGroupId = this.$route.params.groupId;
    window.onscroll = () => {
      this.wHeight = window.outerHeight - 261;
    };
    dragscroll(["column-main", "scrum-stage-tasks"]);
  },
  methods: {
    ...mapActions("task", ["init", "initEditTask"]),
    ...mapMutations("task", ["changeTask", "setTaskId"]),
    hideAddTask() {
      this.currentEditId = "";
    },
    getGroup() {
      this.show = !this.show;
      group(this.projectId).then(res => {
        if (res.result === 1) {
          this.groups = res.data;
        }
      });
    },
    //打开任务详情
    initTask(taskId) {
      this.showModal = true;
      this.setTaskId(taskId);
    },

    addCurTask(groupId, id, taskList, index) {
      this.currentEditId = id;
      this.taskMenuId = id;
    },
    // 创建任务
    createTask() {
      let data = {
        taskName: this.textarea,
        projectId: this.projectId,
        taskMenuId: this.taskMenuId,
        taskGroupId: this.taskGroupId
      };
      addTask(data).then(res => {});
    },
    dragBox(evt) {
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
        completeTask(taskId).then(res => {
          // console.log(res,"完成任务了")
        });
      } else {
        //取消完成任务 请求
        cancelcompleteTask(taskId).then(res => {
          // console.log(res,"取消完成任务")
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
      //这里发请求，字段有：项目id,任务分组的id,新建任务的title
      // console.log(this.projectId,this.menuGroupId,this.newProTitle)
      addnewTask(this.projectId, this.menuGroupId, this.newProTitle).then(
        res => {
          if (res.result == 1) {
            this.newProTitle = "";
            this.showAdd = true;
          }
        }
      );
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

<style lang="less">
@import "./index";
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
</style>
