<template>
  <Poptip class="task-menuwrapper" placement="bottom" transfer v-model="visible" @on-popper-hide="popHide">
    <Icon class="sanjiao" type="ios-arrow-dropdown" style="color:gray;" size="20"></Icon>
    <div slot="content" class="task-menuwrapper-content" v-if="initCom">
      <div class="dropdownTitle">
        <span class="back">
          <span v-if="active!=''" @click="active='';reset(true)">
            <svg-icon class="backicon" name="back"></svg-icon>
          </span>
        </span>
        {{topTitle}}
        <span class="guanbi" @click="visible=false">
          <svg-icon class="closePop" name="close"></svg-icon>
        </span>
      </div>
      <div class="task-menu-list" v-if="active==''">
        <div class="menuItem" @click="listItemClick('a','编辑列表')">
          <Icon type="md-create" size="20" />编辑列表</div>
        <div class="menuItem" @click="listItemClick('b','添加列表')" style="border-bottom:1px solid #eee;">
          <Icon type="md-add" size="20" />在此后添加新列表</div>
        <div class="menuItem" @click="listItemClick('c','选择执行者')">
          <Icon type="ios-contact-outline" size="20" />设置本列表所有任务执行者</div>
        <div class="menuItem" @click="listItemClick('d','选择截止时间')">
          <Icon type="ios-time-outline" size="20" />设置本列表所有任务截止时间</div>
        <div class="menuItem" @click="listItemClick('e','移动本列表所有任务')">
          <Icon type="ios-exit-outline" size="20" />移动本列表所有任务</div>
        <div class="menuItem" @click="listItemClick('f','复制本列表所有任务')">
          <Icon type="md-copy" size="20" />复制本列表所有任务</div>
        <div class="menuItem" @click="listItemClick('g','移到回收站')" style="border-bottom:1px solid #eee;">
          <Icon type="ios-trash-outline" size="20" />本列表所有任务移到回收站</div>
        <div class="menuItem" @click="listItemClick('h','删除列表')">
          <Icon type="ios-trash-outline" size="20" />删除列表</div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con1" v-if="active=='a'">
          <div>
            <Input v-model="title" :autofocus="true" />
          </div>
          <div>
            <Button type="primary" style="width:100%;margin-top:14px;" @click="saveTitle">保存</Button>
          </div>
        </div>
        <div class="con2" v-if="active=='b'">
          <div class="con2tip">新列表将被添加在当前列表之后</div>
          <div>
            <Input v-model="newTask" :autofocus="true" placeholder="列表名称" />
          </div>
          <div @click="createNew">
            <Button type="primary" style="width:100%;margin-top:14px;">创建</Button>
          </div>
        </div>
        <div class="con3" v-if="active=='c'">
          <!-- <Input class="findInput"
                 v-model="findMember"
                 :autofocus="true"
                 placeholder="查找成员" />
          <ul class="memberList">
            <li v-for="item in computedMemberList" :key="item.id" @click="chooseExecutor(item.userId)">
              <svg-icon name="people" style="vertical-align:middle;margin-right:6px;"></svg-icon>
              {{item.name}}
              <svg-icon name="right"
               style="float:right;vertical-align:middle;margin-right:6px;margin-top:2px;"
               v-if="curId==item.id"></svg-icon>
            </li>
           
          </ul>
          <Button type="primary"
                  long
                  :disabled="curId==-1">确定</Button> -->

          <Input class="findInput" v-model="findMember" :autofocus="true" placeholder="查找成员" />
          <ul class="memberList">
            <li v-for='item  in memberList' :key="item.userId" @click="chooseExecutor(item.userId)">
              <img :src="item.image">
              {{item.userName}}
              <div class="memberListIcon" v-if="curId==item.userId">
                <Icon style="margin-top: 5px" class="right" type="md-checkmark" size="20" />
              </div>
            </li>
          </ul>
          <Button type="primary" long :disabled="curId==-1" @click='setAllMember'>确定</Button>

        </div>

        <div class="con4" v-if="active=='d'">
          <!-- <DatePicker :open="active=='d'"
                        type="datetime"
                        placeholder="Select date"
                        :confirm="true"
                        @on-clear="clearAll">
            </DatePicker> -->
          <DateTimeInline @confirm="setAllTaskEndTime"></DateTimeInline>
        </div>

        <div class="con5" v-if="active=='e'">
          <div class="con5item1">
            <span>项目</span>
            <Select v-model="model1" style="width:150px" placeholder="当前项目" @on-open-change="getProjectList" @on-change="getGroupList">
              <OptionGroup label="星标项目">
                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
              </OptionGroup>
              <OptionGroup label="非星标项目">
                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
              </OptionGroup>
            </Select>

          </div>
          <div class="con5item2">
            <span>分组</span>
            <template>
              <Select v-model="model9" style="width:150px" placeholder="当前分组" @on-change="getMenuLists">
                <Option v-for="item in groupList" :value="item.relationId" :key="item.relationId">{{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <div class="con5item3">
            <span>列表</span>
            <template>
              <Select v-model="model3" style="width:150px" placeholder="当前列表" @on-change="getMenuId">
                <Option v-for="item in menuList" :value="item.relationId" :key="item.relationName">{{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
          <Button type="primary" long style="margin-top:8px;" @click="moveAllTask">确定</Button>
        </div>

        <div class="con6" v-if="active=='f'">
          <div class="con5item1">
            <span>项目</span>
            <Select v-model="model7" style="width:150px" placeholder="当前项目" @on-open-change="getProjectList" @on-change="getGroupList">
              <OptionGroup label="星标项目">
                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
              </OptionGroup>
              <OptionGroup label="非星标项目">
                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
              </OptionGroup>
            </Select>
            <!--<Poptip placement="bottom-end"-->
            <!--class="innerRight">-->
            <!--<div class="inTitle">-->
            <!--<span>当前项目-->
            <!--<Icon type="ios-arrow-down"-->
            <!--size="18"-->
            <!--style="margin-left:4px;"></Icon>-->
            <!--</span>-->
            <!--</div>-->
            <!--<div slot="content"-->
            <!--class="content">-->
            <!--<Input class="findInput"-->
            <!--v-model="findPro"-->
            <!--:autofocus="true"-->
            <!--placeholder="查找项目" />-->
            <!--<div class="star">-->
            <!--<h5>星标项目</h5>-->
            <!--<div class="item">项目1-->
            <!--<svg-icon class="right"-->
            <!--name="right"></svg-icon>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div class="nostar">-->
            <!--<h5>非星标项目</h5>-->
            <!--<div class="item">项目1-->
            <!--<svg-icon class="right"-->
            <!--name="right"></svg-icon>-->
            <!--</div>-->
            <!--</div>-->

            <!--</div>-->
            <!--</Poptip>-->

          </div>
          <div class="con5item2">
            <span>分组</span>
            <template>
              <Select v-model="model9" style="width:150px" placeholder="当前分组" @on-change="getMenuLists">
                <Option v-for="item in groupList" :value="item.relationId" :key="item.relationId">{{ item.relationName }}</Option>
              </Select>
            </template>
            <!--<Poptip placement="bottom-end"-->
            <!--class="innerRight">-->
            <!--<div class="inTitle">-->
            <!--<span>当前任务-->
            <!--<Icon type="ios-arrow-down"-->
            <!--size="18"-->
            <!--style="margin-left:4px;"></Icon>-->
            <!--</span>-->
            <!--</div>-->
            <!--<div slot="content"-->
            <!--class="content2">-->
            <!--<div class="item">任务1-->
            <!--<svg-icon class="right"-->
            <!--name="right"></svg-icon>-->
            <!--</div>-->
            <!--<div class="item">任务2-->
            <!--<svg-icon class="right"-->
            <!--name="right"></svg-icon>-->
            <!--</div>-->
            <!--</div>-->
            <!--</Poptip>-->
          </div>
          <div class="con5item3">
            <span>列表</span>
            <template>
              <Select v-model="model10" style="width:150px" placeholder="当前列表" @on-change="getMenuId">
                <Option v-for="item in menuList" :value="item.relationId" :key="item.relationName">{{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <CheckboxGroup v-model="notice" style="margin-top:5px;">
            <Checkbox class="checkbox" label="原任务接收新任务的更新提醒"></Checkbox>
            <Checkbox class="checkbox" label="新任务接收原任务的更新提醒"></Checkbox>
          </CheckboxGroup>
          <div class="con5tip">标题、子任务、备注将被复制</div>
          <Button type="primary" long @click="copyAllTask">确定</Button>
        </div>

        <div class="con7" v-if="active=='g'">
          <div class="ask">您确定要把列表下的所有任务移到回收站吗？</div>
          <Button type="error" long @click="removeAllTask">移到回收站</Button>
        </div>
        <div class="con8" v-if="active=='h'">
          <!-- 如果列表内容不为空，则提示要先清空所有的列表 -->
          <div class="nodelete" v-if="data.taskList.length>0">
            <div>请先清空此列表上的任务，然后再删除这个列表.</div>
          </div>
          <!-- 如果列表为空，则可以删除该任务 -->
          <div class="candelete" v-else>
            <h5>您确定要永远删除这个列表吗？</h5>
            <Button type="error" long @click="deleteTask">删除</Button>
          </div>
        </div>
      </div>

    </div>

  </Poptip>

</template>
<script>
import {
  editMenuName,
  addMenu,
  setAllTaskEndTime,
  moveAllTask,
  copyAllTask
} from "@/axios/relation";
import {
  collectTask,
  updateTaskPrivacy,
  cancelCollect,
  taskToRecycle,
  getStarProjectList,
  getGroupList,
  getMenuList,
  copyTask,
  getmemberList,
  moveTask,
  taskAllToRecycle
} from "@/axios/api";

import { setAllTaskExecutor, deleteList } from "@/axios/relation";
import { debuglog } from "util";
export default {
  props: ["data"],
  data() {
    return {
      initCom: true,
      visible: false,
      active: "",
      newTask: "",
      model7: "",
      model9: "",
      model10: "",
      model1: "",
      model2: "",
      groupList: [],
      menuList: [],
      currProjectId: "",
      currMenuId: "",
      currGroupId: "",
      model3: "",
      starProject: [],
      notStarProject: [],
      curTopTitle: "列表菜单",
      title: this.data.title,
      findMember: "",
      findPro: "",
      notice: [],
      curId: -1,
      memberList: []
    };
  },
  computed: {
    topTitle() {
      return this.active ? this.curTopTitle : "列表菜单";
    }

    //  computedMemberList () {
    //   return this.memberList.filter(v => this.$containStr(this.findMember, v.id > 0?v.name:''))
    // }
  },
  watch: {
    data: {
      handler: function(newValue, oldValue) {},
      deep: true
    },

    findMember(newValue, oldValue) {
      if (newValue != "") {
        this.memberList = this.memberList.filter((item, index, self) => {
          return item.userName.includes(newValue);
        });
      } else {
        this.createMemberList();
      }
    }
  },
  mounted() {},
  methods: {
    //获取执行者ID
    chooseExecutor(id) {
      this.curId = id;
    },
    //修改此列表的名称
    saveTitle() {
      this.visible = false;
      //发请求修改标题
      editMenuName(this.data.relationId, this.title).then(res => {
        if (res.result === 0) {
          this.$Message.error("修改失败!");
        }
      });
    },
    //设置此列表下所有任务的截止时间
    setAllTaskEndTime(endTime) {
      setAllTaskEndTime(this.data.relationId, endTime).then(res => {
        if (res.result === 0) {
          this.$Message.error(res.msg);
        } else {
          this.popHide();
        }
      });
    },
    //获取项目数据
    getProjectList() {
      getStarProjectList().then(res => {
        if (res.result === 1) {
          this.notStarProject = res.notStarProject;
          this.starProject = res.starProject;
        }
      });
    },
    //获取分组数据
    getGroupList(projectId) {
      this.currProjectId = projectId;
      getGroupList(projectId).then(res => {
        if (res.result === 1) {
          this.groupList = res.data;
        }
      });
    },
    //获取菜单数据
    getMenuLists(groupId) {
      this.currGroupId = groupId;
      getMenuList(groupId).then(res => {
        if (res.result === 1) {
          this.menuList = res.data;
        }
      });
    },
    //获取选中菜单id
    getMenuId(menuId) {
      this.currMenuId = menuId;
    },
    //移动所有任务
    moveAllTask() {
      moveAllTask(
        this.data.relationId,
        this.currProjectId,
        this.currGroupId,
        this.currMenuId
      ).then(res => {
        if (res.result === 0) {
          this.$Message.error("移动失败!");
        }
      });
    },
    //复制列表的所有任务
    copyAllTask() {
      copyAllTask(
        this.data.relationId,
        this.currProjectId,
        this.currGroupId,
        this.currMenuId
      ).then(res => {
        if (res.result === 0) {
          this.$Message.error("复制失败!");
        }
      });
    },
    listItemClick(index, title) {
      this.active = index;
      this.curTopTitle = title;
      if (index == "c") {
        this.createMemberList();
      }
    },
    //获取执行者
    createMemberList() {
      this.currProjectId = this.$route.params.id;
      getmemberList(this.currProjectId).then(res => {
        if (res.result === 1) {
          this.memberList = res.data;
        }
      });
    },
    //设置执行者
    setAllMember() {
      console.log(this.data.relationId, this.curId);
      setAllTaskExecutor(this.data.relationId, this.curId).then(res => {});
    },
    //删除任务
    deleteTask() {
      deleteList(this.data.relationId).then(res => {});
    },

    clearAll() {},
    createNew() {
      this.active = "";
      addMenu(
        this.data.projectId,
        this.newTask,
        this.data.parentId,
        this.data.order
      ).then(res => {
        if (res.result === 0) {
          this.$Message.error("添加失败!");
        }
      });
    },
    reset(flag) {
      Object.assign(this.$data, this.$options.data());
      this.visible = flag;
      this.title = this.data.title;
    },
    popHide() {
      setTimeout(_ => {
        this.reset();
      }, 100);
    },
    //删除菜单下所有任务
    removeAllTask() {
      taskAllToRecycle(this.data.relationId).then(res => {
        if (res.result == 1) {
          this.popHide();
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "./poptipMenu";
.menuItem {
  i {
    color: grey;
    margin-right: 8px;
  }
}
.task-menu-detail {
  .memberList {
    li {
      position: relative;
      cursor: pointer;
      display: flex;
      vertical-align: text-bottom;
      line-height: 50px !important;
    }
    img {
      width: 42px;
      height: 42px;
      padding: 10px 10px 0 0;
    }
    .memberListIcon {
      position: absolute;
      top: 10px;
      right: 5px;
    }
  }
}
</style>

