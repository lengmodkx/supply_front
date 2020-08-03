<template>
  <Poptip class="task-menuwrapper" placement="bottom" transfer v-model="visible" @on-popper-hide="popHide">
    <Icon type="ios-arrow-down" size="20" />
    <!-- <Icon type="ios-arrow-down"
          size="20"></Icon> -->
    <div slot="content" class="task-menuwrapper-content" v-if="initCom">
      <div class="dropdownTitle">
        <span class="back">
          <span v-if="active != ''" @click="
              active = '';
              reset(true);
            ">
            <svg-icon class="backicon" name="back"></svg-icon>
          </span>
        </span>
        {{ topTitle }}
        <span class="guanbi" @click="visible = false">
          <svg-icon class="closePop" name="close"></svg-icon>
        </span>
      </div>
      <div class="task-menu-list" v-if="active == ''">
        <div class="menuItem" @click="listItemClick('b', '复制到')">
          <Icon type="ios-copy-outline" />复制任务</div>
        <!--<div class="menuItem tasklink" @click="copylink" :data-clipboard-text="link">-->
        <!--<Icon type="ios-link-outline" />复制任务链接</div>-->
        <div class="menuItem" @click="listItemClick('a', '移动到')">
          <Icon type="ios-log-out" />移动任务</div>
        <div class="menuItem" @click="collectTask">
          <Icon type="md-star" />{{ data.isCollect ? "取消收藏" : "收藏任务" }}</div>

        <div class="menuItem" @click="listItemClick('c', '移到回收站')">
          <Icon type="ios-trash-outline" />移到回收站</div>

        <div class="privacy">
          <div class="p_left fl clearfix" @click="updatePrivate">
            <div v-if="!unlock" style="overflow:hidden;">
              <Icon type="unlocked" class="fl"></Icon>
              <div class="p_title fl">
                <h5>隐私模式</h5>
                <p>所有成员可见</p>
              </div>
            </div>

            <div v-if="unlock" style="overflow:hidden;">
              <Icon type="locked" class="fl"></Icon>
              <div class="p_title fl">
                <h5>隐私模式</h5>
                <p>仅参与者可见</p>
              </div>
            </div>
          </div>
          <div class="p_right fr">
            <span>{{ unlock == false ? "已关闭" : "已开启" }}</span>
          </div>
        </div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con5" v-if="active == 'a'">
          <div class="con5item1">
            <span>项目</span>
            <Select v-model="model1" style="width:150px" placeholder="当前项目" @on-open-change="getProjectList"
              @on-change="getGroupList">
              <OptionGroup label="星标项目">
                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}
                </Option>
              </OptionGroup>
              <OptionGroup label="非星标项目">
                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">
                  {{ item.projectName }}</Option>
              </OptionGroup>
            </Select>
          </div>
          <div class="con5item2">
            <span>分组</span>
            <template>
              <Select v-model="model9" style="width:150px" placeholder="当前分组" @on-change="getMenuLists">
                <Option v-for="item in groupList" :value="item.relationId" :key="item.relationId">
                  {{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <div class="con5item3">
            <span>列表</span>
            <template>
              <Select v-model="model3" style="width:150px" placeholder="当前列表" @on-change="getMenuId">
                <Option v-for="item in menuList" :value="item.relationId" :key="item.relationName">
                  {{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
          <Button type="primary" long style="margin-top:8px;" @click="moveTask">确定</Button>
        </div>
        <div class="con6" v-if="active == 'b'">
          <div class="con5item1">
            <span>项目</span>
            <Select v-model="model7" style="width:150px" placeholder="当前项目" @on-open-change="getProjectList"
              @on-change="getGroupList">
              <OptionGroup label="星标项目">
                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}
                </Option>
              </OptionGroup>
              <OptionGroup label="非星标项目">
                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">
                  {{ item.projectName }}</Option>
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
                <Option v-for="item in groupList" :value="item.relationId" :key="item.relationId">
                  {{ item.relationName }}</Option>
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
                <Option v-for="item in menuList" :value="item.relationId" :key="item.relationName">
                  {{ item.relationName }}</Option>
              </Select>
            </template>
          </div>
          <CheckboxGroup v-model="notice" style="margin-top:5px;">
            <Checkbox class="checkbox" label="原任务接收新任务的更新提醒"></Checkbox>
            <Checkbox class="checkbox" label="新任务接收原任务的更新提醒"></Checkbox>
          </CheckboxGroup>
          <div class="con5tip">标题、子任务、备注将被复制</div>
          <Button type="primary" long @click="copyTask">确定</Button>
        </div>
        <div class="con7" v-if="active == 'c'">
          <div class="ask">您确定要把该任务移到回收站吗？</div>
          <Button type="error" @click="recycle" long>移到回收站</Button>
        </div>
      </div>
    </div>
  </Poptip>
</template>
<script>
  import Clipboard from "clipboard";
  import { collectTask, updateTaskPrivacy, cancelCollect, taskToRecycle, getStarProjectList, getGroupList, getMenuList, copyTask, moveTask } from "@/axios/api";

  export default {
    props: ["data"],
    data() {
      return {
        link: "https://www.baidu.com",
        initCom: true,
        visible: false,
        unlock: true,
        active: "",
        newTask: "",
        curTopTitle: "任务菜单",
        title: this.data.title,
        findMember: "",
        findPro: "",
        notice: [],
        starProject: [],
        notStarProject: [],
        currProjectId: "",
        currGroupId: "",
        currMenuId: "",
        groupList: [],
        menuList: [],
        model7: "",
        model9: "",
        model10: "",
        model1: "",
        model2: "",
        model3: ""
      };
    },
    computed: {
      topTitle() {
        return this.active ? this.curTopTitle : "任务菜单";
      }
    },
    mounted() {
      // if (this.unlock) {
      //   this.data.privacyPattern = 0;
      // } else {
      //   this.data.privacyPattern = 1;
      // }
      if (this.data.privacyPattern == 0) {
        this.unlock = true
      } else {
        this.unlock = false
      }
    },
    methods: {
      copylink() {
        var clipboard = new Clipboard(".tasklink");
        clipboard.on("success", e => {
          alert("复制成功");
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on("error", e => {
          // 不支持复制
          console.log("该浏览器不支持自动复制");
          clipboard.destroy();
        });
      },
      //更改任务的隐私模式
      updatePrivate() {
        this.unlock = !this.unlock;
        var privacy = this.unlock ? 0 : 1;
        updateTaskPrivacy(this.data.taskId, privacy);
      },
      saveTitle() {
        this.visible = false;
        //发请求修改标题
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
      listItemClick(index, title) {
        this.active = index;
        this.curTopTitle = title;
      },
      clearAll() { },
      changeTitle() {
        this.active = "";
      },
      //项目选择框触发时间
      createNew() {
        this.active = "";
      },
      collectTask() {
        if (this.data.isCollect) {
          cancelCollect(this.data.taskId).then(res => {
            if (res.result === 1) {
              this.$Message.success(res.msg);
              this.data.isCollect = false;
            }
          });
        } else {
          collectTask(this.data.projectId, this.data.taskId, "任务").then(res => {
            if (res.result === 1) {
              this.$Message.success(res.msg);
              this.data.isCollect = true;
            }
          });
        }
      },
      //复制任务
      copyTask() {
        copyTask(this.data.taskId, this.currProjectId, this.currGroupId, this.currMenuId).then(res => {
          if (res.result === 1) {
            this.$Message.success(res.msg);
          }
        });
      },
      //移动任务
      moveTask() {
        moveTask(this.data.taskId, this.currProjectId, this.currGroupId, this.currMenuId).then(res => {
          if (res.result === 1) {
            this.$Message.success(res.msg);
          }
        });
      },
      //任务移入回收站
      recycle() {
        this.active = "";
        //taskToRecycle(this.data.taskId);
        var data = {
          publicId: this.data.taskId,
          publicType: 'task',
          projectId: this.data.projectId,
          action: 'move'
        }
        taskToRecycle(data).then(res => { });

        this.$emit("close");
      },
      reset(flag) {
        let result = this.unlock
        Object.assign(this.$data, this.$options.data());
        this.unlock = result
        this.visible = flag;
        this.title = this.data.title;
      },
      popHide() {
        setTimeout(_ => {
          this.reset();
        }, 300);
      }
    },
    watch: {
      'data.privacyPattern': {
        handler: function (val) {
          if (val == 0) {
            this.unlock = true
          } else {
            this.unlock = false
          }
        },
      }
    }
  };
</script>
<style lang="less">
  @import "./poptipMenu";

  .menuItem {
    i {
      font-size: 20px;
      margin-right: 10px;
    }
  }
</style>