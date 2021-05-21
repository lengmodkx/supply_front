<template>
  <Poptip class="task-menuwrapper" placement="bottom" transfer v-model="visible" @on-popper-hide="popHide">
    <Icon class="sanjiao" type="ios-arrow-dropdown" style="color:gray;padding:5px" size="26"></Icon>
    <div slot="content" class="task-menuwrapper-content" v-if="initCom">
      <div class="dropdownTitle">
        <span class="back">
          <span v-if="active != ''" @click="active = '';reset(true);">
            <svg-icon class="backicon" name="back"></svg-icon>
          </span>
        </span>{{ topTitle }}
        <span class="guanbi" @click="reset(false)">
          <svg-icon class="closePop" name="close"></svg-icon>
        </span>
      </div>
      <div class="task-menu-list" v-if="active == ''">
        <div class="menuItem" @click="listItemClick('a', '编辑列表')">
          <Icon type="md-create" size="20" />编辑列表</div>
        <div class="menuItem" @click="listItemClick('b', '添加列表')" style="border-bottom:1px solid #eee;">
          <Icon type="md-add" size="20" />在此后添加新列表</div>
        <div class="menuItem" @click="listItemClick('g', '删除任务')" style="border-bottom:1px solid #eee;">
          <Icon type="ios-trash-outline" size="20" />本列表所有任务删除</div>
        <div class="menuItem" @click="listItemClick('h', '删除列表')">
          <Icon type="ios-trash-outline" size="20" />删除列表</div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con1" v-if="active == 'a'">
          <div>
            <Input v-model="title" :autofocus="true" />
          </div>
          <div>
            <Button type="primary" style="width:100%;margin-top:14px;" @click="saveTitle">保存</Button>
          </div>
        </div>
        <div class="con2" v-if="active == 'b'">
          <div class="con2tip">新列表将被添加在当前列表之后</div>
          <div>
            <Input v-model="newTask" :autofocus="true" placeholder="列表名称" />
          </div>
          <div @click="createNew">
            <Button type="primary" style="width:100%;margin-top:14px;">创建</Button>
          </div>
        </div>
        <div class="con7" v-if="active == 'g'">
          <div class="ask">您确定要把列表下的所有任务删除吗？</div>
          <Button type="error" long @click="removeAllTask">确认</Button>
        </div>
        <div class="con8" v-if="active == 'h'">
          <!-- 如果列表内容不为空，则提示要先清空所有的列表 -->
          <div class="nodelete" v-if="data.taskList.length > 0">
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
    deleteRelaList,
    updateRelaName,
    createNewList,
    deleteRealtionAllTask
  } from '@/axios/template'
  import {
    setAllTaskExecutor,
  } from "@/axios/relation";
  import {
    debuglog
  } from "util";
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
        title: this.data.relationName,
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
    methods: {
      //修改此列表的名称
      saveTitle() {
        this.visible = false;
        //发请求修改标题
        updateRelaName(this.data.relationId, this.title).then(res => {
          this.$emit('success')
        })
      },
      //删除任务
      deleteTask() {
        deleteRelaList(this.data.relationId).then(res => {
          this.visible = false;
          this.$emit('success')
        });
      },
      createNew() {
        this.active = "";
        let data = {
          templateId: this.data.templateId,
          relationName: this.newTask,
          relationOrder: this.data.order
        }
        createNewList(data).then(res => {
          if (res.result === 0) {
            this.$Message.error("添加失败!");
          } else {
            this.$emit('success')
          }
        });
      },
      listItemClick(index, title) {
        this.active = index;
        this.curTopTitle = title;
      },
      reset(flag) {
        this.visible = flag;
        this.active = "";
      },
      popHide() {
        setTimeout(_ => {
          this.reset();
        }, 100);
      },
      //删除菜单下所有任务
      removeAllTask() {
        deleteRealtionAllTask({relationId:this.data.relationId}).then(res => {
          if (res.result == 1) {
            this.popHide();
            this.$emit('success')
          }
        });
      }
    }
  };
</script>
<style lang="less">
  @import "../project/pages/index/components/poptipMenu";

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