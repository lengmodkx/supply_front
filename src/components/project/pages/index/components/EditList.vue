<template>
  <div style="height:100%;position: relative">
    <div v-if="task == null" style="width: 100%;height: 100%;display:flex;justify-content: center;align-items: center">
      <Loading></Loading>
    </div>
    <div class="task-detail" style="height:100%;position: relative" v-if="task != null">
      <!--固定顶部-->
      <div slot="header" style="height:24px;">
        <div class="toolRight">
          <!-- <Tooltip content="点个赞" placement="bottom-start">
            <span class="zan" :class="{zan_blue:task.isFabulous}" @click="dianZan">
              <Icon type="md-thumbs-up" size="20" />
              <span class="zanNum" v-if="task.fabulousCount !== 0">{{task.fabulousCount}}</span>
            </span>
          </Tooltip> -->
          <span class="down">
            <SingleTaskMenu :data="task"></SingleTaskMenu>
          </span>
        </div>
        <div class="headerTool">
          <span class="backEdit" v-show="backButton" @click="back"> <Icon type="ios-arrow-back"/></span>
          <div class="toolLeft" v-if="task.parentId === '0'">
            <span>{{ task.project.projectName }} > </span>
            <span class="proName">{{ task.groupName }}</span>
            <span> > </span>
            <Dropdown trigger="click">
              <span class="proName">{{ task.menuName }}</span>
            </Dropdown>
          </div>
          <div class="toolLeft" v-if="task.parentTask">
            <span></span>
            <span>属于任务:{{ task.parentTask.taskName }}</span>
          </div>
        </div>
      </div>
      <div class="Conbox" ref="scrollbox">
        <div ref="heightbox">
          <div class="task_info done clearfix" :class="{ done: task.taskStatus }">
            <Checkbox v-model="task.taskStatus" :disabled="!task.subIsAllComplete" @on-change="updateTaskStatus(task.taskId, task.taskStatus)" class="checkbox"></Checkbox>
            <Tooltip content="点击即可编辑" placement="top" class="content">
              <div id="editCon" style="width:100%;">
                <input v-model="task.taskName" @blur="updateTaskName()" type="text" style="height: 24px;border: 0 none;outline-style: none" />
              </div>
            </Tooltip>
          </div>
          <div class="task_attr clearfix">
            <div class="executor fl">
              <!-- 设置认领者 -->
              <SetExecutor @choose="chooseZxz" :id="task.projectId" :taskId="task.taskId" ref="executor" :task="task" v-model="task.executor"> </SetExecutor>
            </div>

            <div class="timer fl">
              <Icon type="ios-calendar-outline" size="18" style="margin-right:5px;"></Icon>
              <DateTimePicker type="start" @on-change="startDate" :options="options1" @clear="clearTime('开始')" :max="task.endTime" @confirm="confirm1">
                <div class="init" v-if="!task.startTime">开始时间</div>
                <div class="setTime" v-if="task.startTime">
                  {{ $moment(task.startTime).calendar(null, { sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "dddLT", lastDay: "[昨天]LT", lastWeek: "[上]dddLT", sameElse: "Y年M月D日LT" }) }}
                  <span @click.stop="clearTime('开始')">&times;</span>
                </div>
              </DateTimePicker>
              <span>&nbsp;-&nbsp;</span>
              <DateTimePicker @on-change="endDate" :options="options2" @clear="clearTime('截止')" type="end" :min="task.startTime" @confirm="confirm2">
                <div class="init" v-if="!task.endTime">截止时间</div>
                <div class="setTime" v-if="task.endTime">
                  {{ $moment(task.endTime).calendar(null, { sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "dddLT", lastDay: "[昨天]LT", lastWeek: "[上]dddLT", sameElse: "Y年M月D日LT" }) }}
                  <!-- {{data.endDate}} -->
                  <span @click.stop="clearTime('截止')">&times;</span>
                </div>
              </DateTimePicker>
            </div>

            <div class="repeat fl">
              <SetRepeat :repeat="task.repeat" v-on:updateRepeat="updateRepeat"></SetRepeat>
            </div>
            <!--<div class="alarm fl">-->
            <!--<Tooltip :content="task.remind">-->
            <!--<Icon type="md-alarm" @click="showRemind=true" />-->
            <!--</Tooltip>-->
            <!--</div>-->
          </div>
          <div class="remark">
            <span class="name"> <Icon type="ios-document-outline" />备注</span>
            <div class="editor" @click="showEditor = true" v-if="!showEditor" v-html="task.remarks ? task.remarks : '待添加'"></div>
            <div class="editor-wrap" v-if="showEditor">
              <Simditor :contents="task.remarks" ref="editor" class="fl editBox"></Simditor>
              <div style="margin-top: 5px">
                <Button @click="showEditor = false" style="margin-right: 15px;cursor: pointer">取消</Button>
                <Button style="cursor: pointer" type="info" @click="addBeizhu">保存</Button>
              </div>
            </div>
          </div>
          <div class="priority clearfix">
            <span class="name"> <Icon type="ios-microphone-outline" />优先级</span>
            <div class="urgentButton">
              <UrgentDropdown v-on:priority="changePriority" v-bind:checked-name="task.priority"></UrgentDropdown>
            </div>
          </div>
          <div @click.stop class="tags clearfix" style="display: flex;align-items: center">
            <span class="name"> <Icon type="ios-pricetags-outline"></Icon>标签 </span>
            <!-- 取到data.tag了再添加孙子辈组件 -->
            <Tags class="fl" :taglist="task.tagList" :publicId="task.taskId" :publicType="publicType" :projectId="task.projectId" v-if="task.tagList" ref="tags"></Tags>
          </div>
          <div class="childTask clearfix">
            <p class="name" style="float:none;"><Icon type="ios-options-outline" />子任务</p>
            <!-- 已添加的子任务列表 -->
            <ul v-if="task.taskList">
              <li class="sontask_list" v-for="(i, index) in task.taskList" :key="index">
                <!-- 点击之前 -->
                <div class="clearfix" v-show="isEdit" style="display:flex;">
                  <div class="addicon fl" @click.stop>
                    <Checkbox v-model="i.taskStatus" @on-change="updateTaskStatus(i.taskId, i.taskStatus, true)"></Checkbox>
                  </div>
                  <div class="sonInput fl" @click.stop="showaa(i.taskId)">
                    <Tooltip content="点击即可编辑" placement="top">
                      <div class="sonCon" ref="sonCon" style="">{{ i.taskName }}</div>
                    </Tooltip>
                  </div>
                  <DateTimePicker class="sonDate fl" type="start" :max="i.endTime" @confirm="confirmSonDate" @clear="clearSonDate">
                    <div>
                      <Icon class="icon" type="calendar" v-if="!i.sontaskDate" size="20"></Icon>
                      <span v-else class="timeBox">
                        {{ $moment(i.sontaskDate).calendar(null, { sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "dddLT", lastDay: "[昨天]LT", lastWeek: "[上]dddLT", sameElse: "Y年M月D日LT" }) }}
                      </span>
                    </div>
                  </DateTimePicker>
                  <SetExecutor @choose="ZrwChooseZxz" :id="task.projectId" :taskId="i.taskId" :task="i" ref="executor" v-model="i.executor"> </SetExecutor>
                  <div class="enterDetail fl">
                    <Icon type="ios-arrow-right"></Icon>
                  </div>
                </div>
              </li>
            </ul>
            <div class="addChildTask" @click="showSontask = false" v-if="showSontask"><Icon type="ios-add-circle-outline" />添加子任务</div>
            <!-- 添加子任务 -->
            <div class="sonBox clearfix" v-if="!showSontask">
              <div class="newSon clearfix">
                <div class="sonInput fl"><Input v-model="son" placeholder="输入子任务内容..." autofocus @keyup.enter.native="submitSontask" /></div>
              </div>
              <div class="btns">
                <Button
                  type="text"
                  @click="
                    showSontask = true;
                    son = '';
                  "
                  >取消</Button
                >
                <Button type="primary" @click="submitSontask" style="padding:6px 20px;">保存</Button>
              </div>
            </div>
          </div>
          <!-- 添加关联 -->
          <div class="relevance">
            <p class="name" style="float: none;"><Icon type="ios-link-outline" />关联内容</p>
            <div class="addLink" @click="relationModal = true"><Icon type="ios-add-circle-outline" />添加关联</div>
            <Modal v-model="relationModal" footer-hide class="relationModal" id="relationModal">
              <AddRelation :publicId="task.taskId" :fromType="publicType"></AddRelation>
            </Modal>
          </div>
          <div class="has-relevance">
            <ul v-if="task.bindTasks.length != 0">
              <div class="what-title">关联的任务</div>
              <li class="gl-task-list" v-for="(b, i) in task.bindTasks" :key="i">
                <div class="gl-task-list-con" @click.stop="showaa(b.taskId)">
                  <Icon type="md-checkbox-outline" size="22" />
                  <img v-if="b.userImage" :src="b.userImage" alt="执行者" />
                  <Icon type="md-contact" v-else size="26" />
                  <div class="gl-con">
                    <div class="gl-con-top">
                      <span>{{ b.taskName }}</span
                      ><span>{{ b.projectName }}</span>
                    </div>
                    <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                  </div>
                </div>
                <Poptip @click.stop>
                  <Icon class="glpop" type="ios-arrow-down" size="20" />
                  <div slot="content">
                    <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                    <div class="glpop-list" @click.stop="cancle(b.taskId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                  </div>
                </Poptip>
              </li>
            </ul>
            <ul v-if="task.bindFiles.length != 0">
              <div class="what-title">关联的文件</div>
              <li class="gl-task-list" v-for="(b, i) in task.bindFiles" :key="i">
                <div class="gl-task-list-con" @click="getFileDetail(b.fileId)">
                  <!--<Icon type="md-checkbox-outline" size="22" />-->
                  <Icon type="ios-document-outline" size="22" />
                  <div class="gl-con">
                    <div class="gl-con-top">
                      <span>{{ b.fileName }}</span
                      ><span>{{ b.projectName }}</span>
                    </div>
                    <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                  </div>
                </div>
                <Poptip>
                  <Icon class="glpop" type="ios-arrow-down" size="20" />
                  <div slot="content">
                    <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                    <div class="glpop-list" @click.stop="cancle(b.fileId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                  </div>
                </Poptip>
              </li>
            </ul>
            <ul v-if="task.bindSchedules.length != 0">
              <div class="what-title">关联的日程</div>
              <li class="gl-task-list" v-for="(b, i) in task.bindSchedules" :key="i">
                <div class="gl-task-list-con" @click="editSchedule(b.scheduleId)">
                  <!--<Icon type="md-checkbox-outline" size="22" />-->
                  <Icon type="ios-calendar-outline" size="22" />
                  <div class="gl-con">
                    <div class="gl-con-top">
                      <span>{{ b.scheduleName }}</span
                      ><span>{{ b.projectName }}</span>
                    </div>
                    <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                  </div>
                </div>
                <Poptip>
                  <Icon class="glpop" type="ios-arrow-down" size="20" />
                  <div slot="content">
                    <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                    <div class="glpop-list" @click.stop="cancle(b.scheduleId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
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
                      <span>{{ b.shareName }}</span
                      ><span>{{ b.projectName }}</span>
                    </div>
                    <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
                  </div>
                </div>
                <Poptip>
                  <Icon class="glpop" type="ios-arrow-down" size="20" />
                  <div slot="content">
                    <div class="glpop-list" @click.stop="clone(b.taskId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                    <div class="glpop-list" @click.stop="cancle(b.shareId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                  </div>
                </Poptip>
              </li>
            </ul>
          </div>
          <!-- 上传附件 -->
          <div class="accessory">
            <p class="name" style="float: none;width:100px"><Icon type="ios-folder-outline" />添加附件</p>

            <div class="addfile" v-if="task.fileList">
              <div class="file-lsit" v-for="(f, i) in task.fileList" :key="i">
                <div class="file-img">
                  <img v-if="images_suffix.indexOf(f.ext) > -1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + f.fileUrl" alt="" />
                  <img v-else src="@/icons/img/moren.png" alt="文件" />
                  <div class="zhezhao">
                    <Icon type="md-cloud-download" @click="downLoad(f.fileId)" />
                    <Icon type="md-search" @click="getFileDetail(f.fileId)" />
                  </div>
                </div>
                <Tooltip :content="f.fileName">
                  <p class="file-name">{{ f.fileName }}</p>
                </Tooltip>
              </div>
              <div style="width: 117px;height:117px;line-height: 117px;border: 1px solid #e5e5e5;display: flex;align-items: center;justify-content: center" @click="showCommon = true">
                <Icon type="md-add" size="40" style="margin-right: 0px"></Icon>
              </div>
            </div>
          </div>
          <!-- 设置参与者 -->
          <div class="participator">
            <h5>
              参与者 · {{ task.joinInfo != null ? task.joinInfo.length : 0 }}
              <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
                <Icon type="ios-help"></Icon>
              </Tooltip>
            </h5>
            <div class="involve-list clearfix">
              <div class="member-avatar fl" v-for="(item, index) in task.joinInfo" :key="index">
                <Tooltip :content="item.userName" placement="top" transfer>
                  <div class="ava">
                    <!-- 删除需要加在关闭按钮上 -->
                    <img v-if="item.image" :src="item.image" alt="" />
                    <svg-icon v-else style="width:24px;height:24px;display:block;" name="allMember"></svg-icon>
                    <span class="close" @click="deleteInvolve(item.userId)">×</span>
                  </div>
                </Tooltip>
              </div>
              <div class="addButton fl">
                <InvolveMember ref="involveMember" :checkedList="joinInfoIds" :projectId="task.projectId" @save="saveInvolveMember"></InvolveMember>
              </div>
            </div>
            <log :logs="task.logs" :publicId="task.taskId" :unReadMsg="task.unReadMsg"></log>
          </div>
        </div>
      </div>
      <footer>
        <publick @scroll="scrollToBottom" :publicId="task.taskId" :projectId="task.projectId" :publicType="publicType"></publick>
      </footer>
      <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
        <common-file @close="showCommon = false" :projectId="task.projectId" :publicId="task.taskId"></common-file>
      </Modal>
      <Modal v-model="showFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
        <fileDetail v-if="showFileDetail" :file="file"></fileDetail>
      </Modal>
      <!-- 编辑日程模态框 -->
      <Modal v-model="showRCModal" class="myModal myRcModal">
        <rc-modal></rc-modal>
      </Modal>
      <!--设置提醒-->
      <Modal v-model="showRemind">
        <p slot="header" style="text-align:center">任务提醒设置</p>
        <TaskWarn v-if="showRemind" :taskId="task.taskId"></TaskWarn>
      </Modal>
    </div>
  </div>
</template>
<script>
import SetRepeat from "./SetRepeat";
import TaskWarn from "./TaskWarn";
import rcModal from "@/components/public/common/EditRicheng";
import AddRelation from "@/components/public/common/AddRelation";
import Tags from "@/components/public/Tags";
import insertText from "@/utils/insertText";
import Emoji from "@/components/public/common/emoji/Emoji";
import SingleTaskMenu from "./SingleTaskMenu";
import SetExecutor from "./SetExecutor";
import Simditor from "@/components/resource/Simditor";
import myModel from "./EditList";
import log from "@/components/public/log";
import publick from "@/components/public/Publish";
import fileDetail from "./fileDetail";
import { mapState, mapActions } from "vuex";
import commonFile from "./commonfile.vue";
import Loading from "@/components/public/common/Loading.vue";
import { updateTaskName, updatePriority, cancelcompleteTask, completeTask, updateRepeat, updateTaskJoin, fabulous, cancelFabulous, updateTaskRemarks, taskExecutor, cancle } from "@/axios/api";
import { setSysClip } from "@/axios/api2.js";
import { downloadFile, getFileDetails } from "@/axios/fileApi";
export default {
  components: {
    fileDetail,
    SetRepeat,
    TaskWarn,
    Tags,
    Emoji,
    Simditor,
    SingleTaskMenu,
    SetExecutor,
    AddRelation,
    myModel,
    publick,
    log,
    commonFile: resolve => require(["./commonfile.vue"], resolve),
    Loading,
    rcModal
  },
  data() {
    return {
      options1: {},
      options2: {},
      glPop: false,
      zan: false,
      aa: false,
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
      file: {}
    };
  },
  mounted() {
    this.editTask(this.taskId);
  },
  watch: {
    // task(newValue, oldValue) {
    //   console.log(newValue.subIsAllComplete);
    // }
  },
  computed: {
    ...mapState("task", ["task", "joinInfoIds", "images_suffix", "taskId"]),
    vuexTask() {
      return this.$store.state.task.joinInfo;
    }
  },
  methods: {
    ...mapActions("task", ["editTask", "updateStartTime", "updateEndTime", "addChildrenTask"]),
    // 设置开始时间小于结束时间
    startDate(date) {
      this.startTime = date;
      this.options2 = {
        disabledDate(date1) {
          return date1.valueOf() < new Date(date).getTime();
        }
      };
    },
    endDate(date) {
      this.endTime = date;
      this.options1 = {
        disabledDate(date1) {
          return date1.valueOf() > new Date(date).getTime() - 86400000;
        }
      };
    },
    scrollToBottom() {
      this.$refs.scrollbox.scrollTop = this.$refs.heightbox.clientHeight;
    },
    //返回
    back() {
      this.backButton = false;
      this.editTask(this.task.parentId);
      this.$Message.loading("正在加载中...", 0);
    },
    //修改任务名称
    updateTaskName() {
      updateTaskName(this.task.taskId, this.task.taskName).then(data => {});
    },
    //文件下载
    downLoad(fileId) {
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      window.location.href = url + "/files/" + fileId + "/download";
    },
    getFileDetail(fileId) {
      getFileDetails(fileId).then(res => {
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
    // 添加备注
    addBeizhu() {
      if (this.$refs.editor.content == null || this.$refs.editor.content == "") {
        this.$Message.error("请输入内容");
        return;
      }
      this.beizhuContent = this.$refs.editor.content;
      updateTaskRemarks(this.task.taskId, this.beizhuContent).then(res => {
        if (res.result === 1) {
          this.showEditor = false;
        }
      });
    },
    // 删除执行者
    deleteExecutor() {
      taskExecutor(this.task.taskId, "").then(res => {});
    },
    // 子任务执行者
    ZrwChooseZxz(data, taskid) {
      taskExecutor(taskid, data).then(res => {
        console.log(res);
      });
    },
    // 选择执行者
    chooseZxz(data, taskid) {
      taskExecutor(taskid, data).then(res => {
        console.log(res);
      });
    },
    //取消关联
    cancle(id) {
      cancle(id, this.task.projectId, this.publicType, this.task.taskId).then(res => {
        if (res.result === 1) {
          this.$Message.success("已取消");
        }
      });
    },
    //复制关联
    clone(id) {
      let url = "http://" + process.env.NODE_ENV == "development" ? "/tasks/" + id : process.env.VUE_APP_URL + "/tasks/" + id;
      setSysClip(url).then(res => {
        if (res.result === 1) {
          this.$Message.success(res.msg);
        }
      });
    },
    showaa(taskId) {
      this.backButton = true;
      const msg = this.$Message.loading("正在加载中...", 0);
      setTimeout(msg, 10000);
      this.$store.dispatch("task/editTask", taskId).then(() => {
        clearTimeout(msg);
      });
    },
    changePriority(priority) {
      updatePriority(this.task.taskId, priority).then(item => {});
    },
    //更改任务的重复性
    updateRepeat(repeat) {
      updateRepeat(this.task.taskId, repeat);
    },
    //更改任务的状态
    updateTaskStatus(taskId, taskStatus, isChild) {
      var label = 0;
      if (isChild) {
        label = 1;
      }
      if (taskStatus) {
        completeTask(taskId, label).then(res => {
          if (res.result !== 1) {
            this.$Message.error(res.msg);
          }
        });
      } else {
        cancelcompleteTask(taskId, label).then(res => {
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
      this.addChildrenTask({ taskId: this.task.taskId, taskName: this.son });
      this.showSontask = false;
      this.son = "";
      this.$Message.success("保存成功");
    },
    confirmSonDate(date) {
      this.task.sontaskDate = date;
    },
    clearSonDate() {
      this.task.sontaskDate = "";
    },
    confirm1(date) {
      this.updateStartTime({
        taskId: `${this.task.taskId}`,
        date: new Date(date).getTime()
      });
      // this.task.startTime = date
      // this.$forceUpdate()
    },
    // 清空时间
    clearTime(type) {
      if (type === "截止") {
        this.updateEndTime({
          taskId: `${this.task.taskId}`,
          date: "0"
        });
      } else if (type === "开始") {
        this.updateStartTime({
          taskId: `${this.task.taskId}`,
          date: "0"
        });
      }
    },
    confirm2(date) {
      this.updateEndTime({
        taskId: `${this.task.taskId}`,
        date: new Date(date).getTime()
      });
    },
    deleteStart() {
      this.task.startDate = "";
    },
    deleteEnd() {
      this.task.endDate = "";
    },
    dianZan() {
      if (!this.task.isFabulous) {
        //发请求点赞
        fabulous(this.task.taskId).then(res => {
          if (res.result === 1) {
            this.task.isFabulous = true;
            this.task.fabulousCount++;
          }
        });
      } else {
        //发请求取消点赞
        cancelFabulous(this.task.taskId).then(res => {
          if (res.result === 1) {
            this.task.isFabulous = false;
            this.task.fabulousCount--;
          }
        });
      }
    },
    deleteInvolve(id) {
      // if (id == 3) return; //需获取当前登录用户id判断
      let index = this.joinInfoIds.indexOf(id);
      this.joinInfoIds.splice(index, 1);
      updateTaskJoin(this.task.taskId, this.joinInfoIds.join(",")).then(res => {});
    },
    // editorSave(val) {
    //   this.editorValue = val;
    //   this.showEditor = false;
    // },
    showwaitAdd() {
      this.showEditor = true;
    },
    chooseEmoji(name) {
      insertText(this.$refs.textarea.$el.children[1], name);
    },
    editson() {
      this.isEdit = false;
    },
    saveSon() {
      this.isEdit = true;
      //然后发请求
    },
    confirmWarnList(warn, user) {
      this.$nextTick(_ => {
        this.modal1 = false;
      });
    },
    // 添加参与者
    saveInvolveMember(detailList) {
      updateTaskJoin(this.task.taskId, detailList).then(res => {
        if (res.result === 1) {
          // this.task.joinInfo.unshift(res.data)
        }
      });
    },
    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    get_suffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    // 去分享详情
    goShareDetail(shareId) {
      // alert(shareId);
      this.$router.push(`/project/${this.$route.params.id}/share_detail/${shareId}`);
    }
  }
};
</script>
<style scoped lang="less">
@import "./EditList.less";
.backEdit {
  cursor: pointer;
}
.not-allow * {
  cursor: not-allowed !important;
}
.toolRight {
  display: flex;
  align-items: center;
  position: absolute;
  top: -3px;
  right: 10px;
  margin-right: 30px;
  .zan {
    display: flex;
    margin-right: 10px;
    cursor: pointer;
    color: #aba6a1;
    i:hover {
      transform: scale(1.2);
    }
    .zanNum {
      margin-left: 4px;
      font-size: 14px;
    }
  }
  .zan_blue {
    color: #7fd4fb;
  }
  .down {
    cursor: pointer;
    color: #aba6a1;
  }
}
.rlz {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  margin-right: 8px;
  &:hover {
    i {
      display: block;
    }
  }
  img {
    width: 24px;
    height: 24px;
    margin-right: 3px;
  }
  i {
    position: absolute;
    top: -5px;
    right: -8px;
    font-size: 22px;
    color: gray;
    display: none;
  }
}
</style>
