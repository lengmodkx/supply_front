<template>
  <div ref="div">
    <div v-if="task == null" style="width: 100%;height: 100%;display:flex;justify-content: center;align-items: center">
      <loading></loading>
    </div>
    <div v-if="task != null">
      <div class="task-header">
        <div class="df task-header-left">
          <div class="details-scenario-config">
            <span class="task-header-flag">任务</span>
          </div>
          <div class="task-header-back">
            <span class="backEdit" @click="back" v-show="backButton">
              <Icon type="ios-arrow-back" />返回上一级</span>
          </div>
        </div>

        <div class="task-header-handle">
          <Icon type="ios-close" size="31" @click.native="closeModal" />
        </div>
      </div>
      <div class="task-content">
        <div class="task-content-left">
          <Tooltip content="点击即可编辑" placement="top">
            <div class="task-title">
              <div class="task-title-input" @blur="updateTaskName()" ref="taskName" spellcheck="false"
                contenteditable="true">{{task.taskName}}</div>
            </div>
          </Tooltip>
          <div class="scenario-infos-view detail-infos-wrapper">
            <section class="detail-infos-note-view flex-horiz no-border-wrapper">
              <div class="note-aside detail-infos-aside">
                <Icon type="ios-document-outline" />
                <span class="note-title">备注</span>
              </div>
              <div class="note-section detail-infos-content flex-space">
                <div class="note-adder-set">
                  <div class="add-note-handler" @click="showEditor = true" v-if="!showEditor"
                    v-html="task.remarks ? task.remarks : '待添加'"></div>
                  <div class="editor-wrap" v-if="showEditor">
                    <Simditor :contents="task.remarks" ref="editor" class="fl editBox"></Simditor>
                    <div style="margin-top: 5px">
                      <Button @click="showEditor = false" style="margin-right: 15px;cursor: pointer">取消</Button>
                      <Button style="cursor: pointer" type="info" @click="addBeizhu">保存</Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="detail-infos-priority-view no-border-wrapper">
              <div class="priority-container flex flex-vcenter">
                <div class="priority-aside detail-infos-aside">
                  <Icon type="ios-pricetags-outline" />
                  <span class="priority-title">标签</span>
                </div>
                <div class="priority-wrap detail-infos-content">
                  <Tags class="fl" :templateId='templateId' v-if="task.tagList" ref="tags" :taglist="task.tagList"
                    @bidingTag="bidingTag"></Tags>
                </div>
              </div>
            </section>
          </div>
          <div class="detail-infos-subtask-view detail-infos-wrapper">
            <div class="subtask-card">
              <div class="detail-subitem-common-header subtask-header">
                <Icon type="ios-options-outline" />
                <span class="flex">子任务</span>
              </div>
              <div class="subtask-card-main">
                <ul v-if="task.taskList" class="subtasks-list ui-sortable">
                  <li class="sontask_list" v-for="(i, index) in task.taskList" :key="index">
                    <!-- 点击之前 -->
                    <div class="clearfix subtask-wrap" v-show="isEdit">
                      <div class="addicon fl"
                        @click.stop.prevent="updateTaskStatus(i.taskId, i.taskStatus, true, index)">
                        <!-- @on-change="updateTaskStatus(i.taskId, i.taskStatus, true)" -->
                        <Checkbox v-model="i.taskStatus"></Checkbox>
                      </div>
                      <div class="sonInput fl" @click.stop="showaa(i.taskId)">
                        <Tooltip content="进入详情" placement="top">
                          <div class="sonCon" ref="sonCon" style>
                            {{ i.taskName }}
                          </div>
                        </Tooltip>
                      </div>
                      <div class="enterDetail fl">
                        <Icon type="ios-arrow-right"></Icon>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="addChildTask" @click="showSontask = false" v-if="showSontask">
                  <Icon type="md-add" />添加子任务</div>
                <!-- 添加子任务 -->
                <div class="sonBox clearfix" v-if="!showSontask">
                  <div class="newSon clearfix">
                    <div class="sonInput fl">
                      <Input v-model="son" placeholder="输入子任务内容..." autofocus @keyup.enter.native="submitSontask" />
                    </div>
                  </div>
                  <div class="btnss">
                    <Button type="text" @click="
                        showSontask = true;
                        son = '';
                      ">取消</Button>
                    <Button type="primary" @click="submitSontask" style="padding:6px 20px;">保存</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="detail-infos-subtask-view detail-infos-wrapper">
            <div class="subtask-card">
              <div class="detail-subitem-common-header subtask-header">
                <Icon type="ios-link-outline" />
                <span class="flex">关联内容</span>
              </div>
            </div>
          </div>
          <div class="has-relevance">
            <div class="has-relevance-content">
              <ul v-if="task.bindTasks.length != 0">
                <div class="what-title">关联的任务</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindTasks" :key="i">
                  <div class="gl-task-list-con" @click.stop="showaa(b.taskId)">
                    <Icon type="md-checkbox-outline" size="22" />
                    <img v-if="b.userImage" :src="b.userImage" alt="执行者" />
                    <Icon type="md-contact" v-else size="26" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.taskName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                    </div>
                  </div>
                  <Poptip @click.stop>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list" @click.stop="cancle(b.taskId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindFiles.length != 0">
                <div class="what-title">关联的文件</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindFiles" :key="i">
                  <div class="gl-task-list-con" @click="getFileDetail(b.fileId)">
                    <Icon type="ios-document-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.fileName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list" @click.stop="cancle(b.fileId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindSchedules.length != 0">
                <div class="what-title">关联的日程</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindSchedules" :key="i">
                  <div class="gl-task-list-con" @click="editSchedule(b.scheduleId)">
                    <Icon type="ios-calendar-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.scheduleName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list" @click.stop="cancle(b.scheduleId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <ul v-if="task.bindShares.length != 0">
                <div class="what-title">关联的分享</div>
                <li class="gl-task-list" v-for="(b, i) in task.bindShares" :key="i">
                  <div class="gl-task-list-con" @click="goShareDetail(b.shareId)">
                    <Icon type="ios-open-outline" size="22" />
                    <div class="gl-con">
                      <div class="gl-con-top">
                        <span>{{ b.shareName }}</span>
                        <span>{{ b.projectName }}</span>
                      </div>
                    </div>
                  </div>
                  <Poptip>
                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                    <div slot="content">
                      <div class="glpop-list" @click.stop="cancle(b.shareId)">
                        <Icon type="md-link" size="20" />
                        <span>取消关联</span>
                      </div>
                    </div>
                  </Poptip>
                </li>
              </ul>
              <div class="subtask-card-main">
                <div class="addLink" @click="relationModal = true">
                  <Icon type="md-add" />添加关联</div>
                <Modal v-model="relationModal" footer-hide :closable="false" class-name="relationModal" class="add-relation" id="relationModal" width="800">
                  <AddRelation :publicId="task.taskId" :fromType="publicType" @close="relationModal = false" v-if="relationModal">
                  </AddRelation>
                </Modal>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <Modal v-model="showFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
        <fileDetail v-if="showFileDetail" :file="file"></fileDetail>
      </Modal>
      <!-- 编辑日程模态框 -->
      <Modal v-model="showRCModal" class="myModal myRcModal">
        <rc-modal></rc-modal>
      </Modal>
      <Modal v-model="showShare" fullscreen :footer-hide="true" class-name="model-detail">
        <shareModal v-if="showShare" :shareId='shareId'></shareModal>
      </Modal>
    </div>
  </div>
</template>
<script>
  import rcModal from "@/components/project/schedule/EditRicheng";
  import AddRelation from "@/components/Relation";
  import Tags from "./Tags";
  import insertText from "@/utils/insertText";
  import Simditor from "@/components/resource/Simditor";
  import fileDetail from "@/components/project/pages/index/components/fileDetail";
  import shareModal from "@/components/project/share/shareModal";

  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex";
  import {
    updatePriority,
    cancelcompleteTask,
    completeTask,
    updateTaskJoin,
    fabulous,
    cancelFabulous,
    taskExecutor,
    cancle,
    upStartTime,
    upEndTime,
  } from "@/axios/api";
  import {
    getTemplateTaskList,
    updateTaskName,
    insertChildTask
  } from '@/axios/template'
  import {
    setSysClip,
    bind_files
  } from "@/axios/api2.js";
  import {
    getFileDetails,
    deleteFile
  } from "@/axios/fileApi";
  import {
    oss
  } from "@/axios/ossweb";
  import Loading from '../public/common/Loading.vue';
  export default {
    components: {
      fileDetail,
      Tags,
      Simditor,
      AddRelation,
      commonFile: (resolve) => require(["../project/pages/index/components/commonfile"], resolve),
      Loading,
      rcModal,
      Loading,
      shareModal
    },
    props: ['taskId', 'relationId', 'templateId'],
    data() {
      return {
        selectValue: "未完成",
        showSchedule: false,
        options1: {},
        options2: {},
        glPop: false,
        zan: false,
        showRemind: false,
        showRCModal: false,
        childTaskData: null,
        complete: false,
        hoverExecutor: false,
        editorValue: "123",
        showFileDetail: false,
        fileId: "",
        showEditor: false,
        maxFileSize: 1024 * 1024 * 100,
        isShowFileList: true,
        type: "task",
        modal1: false,
        relationModal: false,
        talkvalue: "",
        son: "",
        showSontask: true,
        sonComplete: false,
        isEdit: true,
        newCon: "",
        ept: "",
        publicType: "任务",
        involveDataList: [],
        showCommon: false,
        beizhuContent: "",
        backButton: false, //是否显示返回按钮
        file: {},
        projectId: this.$route.params.id,
        uploadList: [],
        host: '',
        uploadData: {},
        uploadFiles: [],
        showShare: false, // 关联的分享弹窗
        shareId: "",
        task: {},
        taskIds: ''
      };
    },
    mounted() {
      this.getTaskInfo(this.taskId)
    },
    methods: {
      getTaskInfo(taskId) {
        getTemplateTaskList({
          taskId: taskId
        }).then((res) => {
          this.task = res.data
        });
      },
      //修改任务名称
      updateTaskName() {
        let data = {
          taskId: this.taskId,
          taskName: this.$refs.taskName.innerHTML,
          relationId: this.relationId
        }
        updateTaskName(data).then((data) => {});
      },
      // 添加备注
      addBeizhu() {
        if (this.$refs.editor.content == null || this.$refs.editor.content == "") {
          this.$Message.error("请输入内容");
          return;
        }
        console.log(this.taskId)
        this.beizhuContent = this.$refs.editor.content;
        let data = {
          taskId: this.taskId,
          relationId: this.relationId,
          remarks: this.beizhuContent
        }
        updateTaskName(data).then((res) => {
          if (res.result === 1) {
            this.task.remarks = this.$refs.editor.content
            this.showEditor = false;
          }
        });
      },
      bidingTag(tagId) {
        let data = {
          taskId: this.taskId,
          relationId: this.relationId,
          tagId: tagId
        }
        updateTaskName(data).then((data) => {
          this.getTaskInfo(this.taskId)
        });
      },

      startDate(date) {
        this.startTime = date;
        this.options2 = {
          disabledDate(date1) {
            return date1.valueOf() < new Date(date).getTime();
          },
        };
      },
      endDate(date) {
        this.endTime = date;
        this.options1 = {
          disabledDate(date1) {
            return date1.valueOf() > new Date(date).getTime() - 86400000;
          },
        };
      },
      //返回
      back() {
        this.taskIds = this.task.parentId
        this.backButton = false;
        this.getTaskInfo(this.taskIds)

      },

      getFileDetail(fileId) {
        getFileDetails(fileId).then((res) => {
          if (res.result == 1) {
            this.showFileDetail = true;
            this.file = res.data;
          }
        });
      },
      //弹出日程详情框
      editSchedule(id) {
        this.$store.dispatch("schedule/getScheduleById", id);
        this.showRCModal = true;
      },
      //取消关联
      cancle(id) {
        cancle(id, this.projectId, this.publicType, this.task.taskId).then((res) => {
          if (res.result === 1) {
            this.$Message.success("已取消");
          }
        });
      },
      //复制关联
      clone(id) {
        let url = "http://" + process.env.NODE_ENV == "development" ? "/tasks/" + id : process.env.VUE_APP_URL +
          "/tasks/" + id;
        setSysClip(url).then((res) => {
          if (res.result === 1) {
            this.$Message.success(res.msg);
          }
        });
      },
      showaa(taskId) {
        this.taskIds = taskId
        this.backButton = true;
        this.getTaskInfo(this.taskIds)

        // this.$store.dispatch("task/editTask", taskId);
      },

      //更改任务的状态
      updateTaskStatus(taskId, taskStatus, isChild, index) {
        var label = 0;
        if (isChild) {
          label = 1;
        }
        if (!taskStatus) {
          completeTask(this.projectId, taskId, label).then((res) => {
            if (res.result !== 1) {
              this.$Message.error(res.msg);
            }
          });
        } else {
          cancelcompleteTask(this.projectId, taskId, label).then((res) => {
            if (res.result !== 1) {
              this.$Message.error(res.msg);
            }
          });
        }
      },
      // 添加子任务
      submitSontask() {
        if (this.son == "") {
          this.$Message.error("请输入子任务内容");
          return;
        }
        let params = {
          parentTaskId: this.task.taskId,
          taskName: this.son,
          relationId: this.relationId
        }
        insertChildTask(params);
        this.showSontask = false;
        this.son = "";
        this.getTaskInfo(this.taskId)
        this.$Message.success("添加成功");
      },
      confirmSonDate(date) {
        this.task.sontaskDate = date;
      },
      clearSonDate() {
        this.task.sontaskDate = "";
      },
      confirm1(date) {
        upStartTime(this.task.taskId, new Date(date).getTime(), this.projectId);
      },
      // 清空时间
      clearTime(type) {
        if (type === "截止") {
          upEndTime(this.task.taskId, "0", this.projectId);
        } else if (type === "开始") {
          upStartTime(this.task.taskId, "0", this.projectId);
        }
      },
      confirm2(date) {
        upEndTime(this.task.taskId, new Date(date).getTime(), this.projectId);
      },
      deleteStart() {
        this.task.startDate = "";
      },
      deleteEnd() {
        this.task.endDate = "";
      },

      showwaitAdd() {
        this.showEditor = true;
      },

      editson() {
        this.isEdit = false;
      },
      saveSon() {
        this.isEdit = true;
        //然后发请求
      },
      confirmWarnList(warn, user) {
        this.$nextTick((_) => {
          this.modal1 = false;
        });
      },

      // 去分享详情
      goShareDetail(shareId) {
        this.showShare = true
        this.shareId = shareId
        // this.$router.push(`/project/${this.$route.params.id}/share_detail/${shareId}`);
      },
      closeModal() {
        this.$emit("close");
      },
    },
  };
</script>
<style lang="less" scoped>
  @import "../project/pages/index/components/taskdetail";

  .task-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e8eaec;
    height: 60px;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;

    .details-scenario-config {
      background: #f2fbff;
      border-radius: 4px;
      padding: 4px 8px 4px 4px;
      cursor: not-allowed;
      width: 64px;
      height: 28px;
      text-align: center;

      .task-header-flag {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #1b9aee;
        font-weight: 500;
      }
    }

    .task-header-back {
      display: flex;
      align-items: center;
      margin-left: 10px;

      &:hover {
        color: #1b9aee;
      }

      .backEdit {
        cursor: pointer;
      }
    }

    .task-header-handle {
      i {
        color: "#999";

        &:hover {
          background-color: #ecf6fe;
          color: #1b9aee;
          border-radius: 4px;
        }
      }
    }
  }

  .task-content {
    display: flex;

    .task-content-left {
      height: calc(100vh - 130px);
      flex: 6;
      overflow-y: auto;
      overflow-x: hidden;
      padding-left: 20px;
      padding-top: 20px;

      .task-title {
        width: 670px;

        .task-title-input {
          white-space: normal;
          word-wrap: break-word;
          word-break: break-all;
          width: 670px;
          padding-top: 8px;
          padding-bottom: 8px;
          padding-left: 8px;
          color: #262626;
          position: relative;
          word-break: break-word;
          font-size: 20px;
          border: 0 none;
          outline-style: none;

          &:not(.readonly):not(.disabled):focus {
            background-color: #f7f7f7;
            width: 670px;
          }

          &:not(.readonly):not(.disabled):hover {
            background-color: #f7f7f7;
            width: 670px;
          }
        }
      }
    }
  }

  .demo-upload-list {
    display: flex;
    width: 118px;
    height: 118px;
    justify-content: center;
    align-items: center;
  }

  .relationModal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }

  .add-relation {
    /deep/.ivu-modal-body {
      padding: 0px;
      overflow: hidden;
    }
  }
</style>