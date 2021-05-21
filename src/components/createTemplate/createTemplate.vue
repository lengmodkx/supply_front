<template>
  <div>
    <div class="modal-header">
      <div class="top-nav df jsb ac">
        <div class="template-properties df">
          <div class="template-property template-name">
            <span class="key">模板名称：</span>
            <span class="value">{{templateInfo.templateName}}</span>
          </div>
          <div class="template-property template-description">
            <span class="key">描述：</span>
            <span class="value">{{templateInfo.templateDes}} </span>
          </div>
          <div class="template-property template-cover">
            <span class="key">封面：</span>
            <span class="value">已添加</span>
          </div>
          <a class="edit-template" @click="editTemplate">
            <Icon type="md-create" />
            <span>编辑</span>
          </a>
        </div>
        <div class="df ac">
          <Button type="primary" class="saveBtn" @click="sureModal=true">保存模板</Button>
          <Icon type="md-close" size="24" style="margin-right:15px;cursor: pointer;" @click="close" />
        </div>
      </div>
    </div>
    <div class="task">
      <draggable class="column-main dragscroll" v-model="allTask">
        <div class="column" :key="k" v-for="(i, k) in allTask">
          <div style="max-height: calc(100vh - 145px); position: relative" :data-index="k">
            <div class="add-Box" v-if="addBtns">
              <Button type="info" long icon="md-add"
                @click.stop="addCurTask(i.parentId, i.relationId, i.taskList, k)"></Button>
            </div>
            <div class="title">
              <span>{{ i.relationName }} · {{ i.taskList ? i.taskList.length : "0" }}</span>
              <TaskMenu class="fr" :data="i" @success="getTemRela"></TaskMenu><!-- 点击三角形出来的任务列表菜单组件 -->
            </div>
            <div class="scrum-stage-tasks" :ref="`scrollbox${i.relationId}`"
              :style="i.taskList.length * 60 + 42 > wHeight ? 'overflow-y: scroll' : ''">
              <draggable :list="i.taskList" class="ul">
                <div class="li" v-for="(a, b) in i.taskList" v-if="!a.taskStatus" :key="b" :data-id="a.taskId"
                  @click.stop="initTask(a.taskId,i.relationId)">
                  <div class="task-mod" :class="renderTaskStatu(a.priority)">
                    <div class="teskCheck" @click.stop="changeStatus(!a.taskStatus, k, b, a.taskId)"></div>
                    <div class="check">
                      <div @click.stop class="checkbox-wrap">
                        <Checkbox size="small" v-model="a.taskStatus"></Checkbox>
                      </div>
                      <div class="cont">{{ a.taskName }}</div>
                    </div>
                    <!-- 小图标 -->
                    <div class="task-info-wrapper">
                      <div class="task-infos">
                        <span class="label repeat-label" v-if="a.repeat !== '不重复'">{{ a.repeat }}</span>
                        <!--<span class="label">-->
                        <!--<Icon class="icon" type="ios-alarm-outline" size="16">11111</Icon>-->
                        <!--</span>-->
                        <span class="label" v-if="a.remarks" style="margin-top: -5px">
                          <Icon type="ios-create-outline" size="18" />
                        </span>
                        <div class="tag-box" v-if="a.tagList" style="margin-bottom: 5px">
                          <div class="tag-list" v-for="tag in a.tagList" :key="tag.tagId">
                            <i :style="{ backgroundColor: tag.bgColor }"></i><span>{{ tag.tagName }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="show-sub-task" @click.stop="showSubTask(a.taskId, a)" v-if="a.childCount > 0">
                        <Icon type="ios-arrow-down" size="18" v-if="!a.visible" />
                        <Icon type="ios-arrow-up" size="18" v-else />
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
            <span>
              <Icon type="md-add"></Icon>新建任务列表...
            </span>
            <span></span>
          </div>
          <div class="newTask" v-if="!showAdd">
            <Input v-model="newProTitle" placeholder="新建任务列表..." style="width: 268px" />
            <div style="margin-top: 12px; text-align: right">
              <Button @click="
                  showAdd = true;
                  newProTitle = '';
                ">取消</Button>
              <Button style="margin-left: 10px" :loading="isCreateTask" type="primary" @click="saveNewPro"
                :disabled="newProTitle == ''">保存</Button>
            </div>
          </div>
        </draggable>
      </draggable>
    </div>
    <Modal v-model="shwoCreate" :width="440" :mask-closable="false" footer-hide>
      <div slot="header" style="color: #262626">
        <span>创建任务</span>
      </div>
      <creat-list v-if="shwoCreate" :taskMenuId="taskMenuId" :taskGroupId="taskGroupId" @close="shwoCreate = false" @success="getTemRela">
      </creat-list>
    </Modal>
    <Modal v-model="sureModal" width="360">
      <p slot="header" style="color:#111111;text-align:center">
        <span>确定编辑模板</span>
      </p>
      <div style="text-align:center">
        <p>确定将当前内容保存为项目模板？</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="saveContent">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal" width="570" title="模板基本信息" class-name="modal-second">
      <div slot="header" style="text-align: center; font-size: 16px; color: #262626">
        <span>模板基本信息</span>
      </div>
      <div>
        <div class="div1-box">
          <div class="div1-title">模板封面</div>
          <div class="df">
            <div class="cover">
              <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+templateInfo.templateCover" alt
                v-if="pic_show" />
              <img :src="imageUrl" alt v-if="pic_hide" accept="image/*" />
            </div>
            <div class="upload">
              <div>
                <Upload :show-upload-list="false" :max-size="2048" :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload" :action="host" :data="uploadData" :on-success="handleSuccess">
                  <Button type="primary" ghost>上传新封面</Button>
                </Upload>
              </div>
            </div>
          </div>
          <div class="project-setting-section-horizontal">
            <div class="project-setting-section edit-name">
              <div class="section-grid" data-fields="name">
                <label for="name"> 模板名称 </label>
                <Input v-model="templateName" placeholder="空白项目" maxlength="30" minlength="1" autofocus="autofocus"
                  class="template-name" />
              </div>
            </div>
            <!-- <div class="project-setting-section">
              <div class="section-grid" data-fields="name">
                <label for="name"> 模板权限设置 </label>
                <div id="project-template-permission-setting"></div>
              </div>
            </div> -->
          </div>
          <div class="project-setting-section edit-description">
            <div class="section-grid" data-fields="description">
              <label for="description"> 模板简介 </label>
              <Input v-model="introduction" type="textarea" :rows="3" placeholder="介绍一下这个项目"
                class="template-description" name="description" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="save">保存更改</Button>
      </div>
    </Modal>
    <Modal v-model="showModal" class="myModal" :mask-closable="false" :closable="false" footer-hide width="860" :styles="{top: '20px'}">
      <my-modal v-if="showModal" @close="showModal = false" :taskId="taskId" :relationId="relationId" :templateId='templateId' @success="getTemRela"></my-modal>
    </Modal>
  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import TaskMenu from "./TaskMenu.vue";
  import creatList from "./creatList.vue";
  import myModal from "./taskdetail.vue";
  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex";

  import {
    getRelation,
    templateInfo,
    getTemplateTaskList,
    createNewList,
    saveTemplate
  } from "../../axios/template.js";
  export default {
    components: {
      draggable,
      TaskMenu,
      creatList,
      myModal
    },
    props: ["templateId"],
    data() {
      return {
        navList: ["任务", "知识库"],
        projectName: "空白项目",
        introduction: "",
        modal: false,
        modal2: false,
        project: [],
        ordinary: false,
        allTask: [],
        currentEditId: "",
        taskMenuId: null,
        shwoCreate: false,
        addBtns: true,
        showAdd: true,
        newProTitle: "",
        isCreateTask: false,
        wHeight: window.outerHeight - 261,
        checkCommentIndex: 0,
        taskGroupId: null,
        sureModal: false,
        uploadData: {},
        host: "",
        dirName: "upload/project/",
        pic_show: true,
        pic_hide: false,
        imageUrl: "",
        introduction: "",
        templateName: "",
        name: "upload/project/bj.png",
        templateInfo: {},
        showModal: false,
        taskId: '',
        relationId:''
      };
    },
    mounted() {
      this.getTemRela()
      this.getTemInfo()
    },
    methods: {
      ...mapMutations("task", ["setTaskId"]),
      getTemInfo() {
        templateInfo({
          templateId: this.templateId
        }).then(res => {
          this.templateInfo = res.data
        })
      },
      getTemRela() {
        getRelation({
          templateId: this.templateId
        }).then(res => {
          this.allTask = res.data;
        })
      },
      addCurTask(groupId, id, taskList, index) {
        this.currentEditId = id;
        this.taskMenuId = id;
        this.shwoCreate = true;
        this.groupIndex = index
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
      saveNewPro() {
        this.isCreateTask = true;
        //这里发请求，字段有：项目id,任务分组的id,新建任务的title
        createNewList({
          templateId: this.templateId,
          relationName: this.newProTitle
        }).then((res) => {
          if (res.result == 1) {
            this.getTemRela()
            this.newProTitle = "";
            this.showAdd = true;
            this.isCreateTask = false;
          }
        });
      },
      clickNavItem(index) {
        this.checkCommentIndex = index;
      },
      close() {
        this.$Modal.confirm({
          title: "离开模板编辑？",
          content: "模板内容不会被保存",
          onOk: () => {
            this.$emit("close")
          },
          onCancel: () => {

          },
        });
      },
      saveContent() {
          this.$router.push({
                        path: "/prolist/" + localStorage.companyId,
                        query: {
                            'checkTagName': '2,0',
                        }
                    });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "超过文件大小限制",
          desc: "文件  " + file.name + " 过大, 超过2M.",
        });
      },
      handleBeforeUpload(file) {
        let dir = this.dirName + this.$moment().format("YYYY-MM-DD") + "/";
        return oss(dir, file.name).then((res) => {
          this.host = res.host;
          this.uploadData = res;
          this.imageUrl = res.host + "/" + res.key;
          this.name = res.key;
        });
      },
      handleSuccess() {
        this.pic_show = false;
        this.pic_hide = true;
      },
      save() {
        var data = {
          templateName: this.templateName,
          templateDes: this.introduction,
          templateCover: this.name,
          orgId: localStorage.companyId,
          templateId: this.templateId ? this.templateId : ''
        };
        saveTemplate(data).then((res) => {
          if (res.result == 1) {
            this.$Message.success("保存成功");
            this.getTemInfo()
            this.modal = false;
          }
        });
      },
      editTemplate() {
        this.modal = true
        this.introduction = this.templateInfo.templateDes
        this.templateName = this.templateInfo.templateName

      },
      //打开任务详情
      initTask(taskId,relationId) {
        this.showModal = true;
        this.taskId = taskId;
        this.relationId=relationId
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "../project/pages/index/index.less";

  a {
    color: #595959;
    cursor: pointer;
  }

  .df {
    display: flex;
  }

  .jsb {
    justify-content: space-between;
  }

  .ac {
    align-items: center;
  }

  .modal-header {
    height: 60px;
    width: 100%;
    position: fixed;
    z-index: 1;

    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #383838;
    }

    .template-property {
      margin-right: 28px;
    }
  }

  .header60 {
    line-height: 60px;
    padding-left: 16px;
  }

  .header-box-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }

  .top-nav {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    line-height: 60px;
    padding-left: 16px;

    .saveBtn {
      margin-right: 35px;
    }
  }

  .nav-header {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #e5e5e5;
    padding-left: 16px;
    position: relative;
    z-index: 51;

    .app-tab {
      margin: 0 16px;
      height: 100%;
      cursor: pointer;

      .hinted {
        color: #8c8c8c;
      }

      &:hover {
        border-bottom: 2px solid #1b9aee;

        .hinted {
          color: #262626;
        }
      }
    }

    .active {
      border-bottom: 2px solid #1b9aee;

      .hinted {
        color: #262626;
      }
    }
  }

  /deep/.ivu-modal-fullscreen .ivu-modal-body {
    top: 112px;
  }

  .modal-content {
    width: 881px;
    margin: 0 auto;

    .template-tit {
      font-size: 28px;
      font-weight: 500;
      margin: 0 0 4px;
      line-height: 40px;
      color: #262626;
    }

    .template-tip {
      font-size: 18px;
      color: grey;
      line-height: 25px;
      margin-bottom: 48px;
    }

    .class-content {
      .class-item {
        width: 283px;
        height: 223px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        transition: box-shadow 0.3s;
        padding: 18px 20px;
        cursor: pointer;

        .img-content {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 126px;
          margin-bottom: 12px;

          img {
            width: 83px;
          }
        }

        .text-content {
          color: grey;

          .template-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 0 4px;
            font-size: 16px;
            color: #383838;
            line-height: 22px;
            font-weight: 500;
          }
        }

        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .div1-box {
    color: #262626;

    .div1-title {
      margin-bottom: 12px;
    }

    .inputContent {
      width: 49%;

      .ivu-date-picker {
        width: 100%;
      }
    }

    .saveid-btn {
      margin-left: 8px;
    }
  }

  .cover {
    border-radius: 4px;
    width: 200px;
    height: 100px;

    img {
      display: block;
      border-radius: 4px;
      width: 200px;
      height: 100px;
    }
  }

  .upload {
    position: relative;
    margin-left: 49px;

    input {
      display: block;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .upLoadButton {
      width: 150px;
      height: 40px;
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #ffffff;
      background: #2db7f5;
    }

    .tips {
      font-size: 12px;
      color: #999999;
      margin-top: 3px;
    }
  }

  .project-setting-section-horizontal {
    line-height: 20px;
    color: #262626;
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .project-setting-section {
      flex: 1;
      margin-top: 24px;
      flex-direction: column;

      .section-grid {
        flex: 1 1 auto;
        position: relative;

        label {
          display: inline-block;
          max-width: 100%;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }

  .project-setting-section {
    display: flex;
    margin-top: 24px;
    flex-direction: column;

    .section-grid {
      flex: 1 1 auto;
      position: relative;

      label {
        display: inline-block;
        max-width: 100%;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

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

  .show-sub-task {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
  }

  .task {
    position: absolute;
    margin-top: 0px;
    padding-top: 60px;

    .column-main {
      top: 60px;
    }
  }
</style>