<template>
  <div class="task-detail" style="height:100%;position: relative" v-if="task">
    <!--<Modal class="myModal" v-model="aa" v-if="data">-->
    <!--<my-model :data="childTaskData"></my-model>-->
  <!--</Modal>-->
    <!--固定顶部-->
    <div class="toolRight">
      <Tooltip content="点个赞" placement="bottom-start">
        <span class="zan" :class="{zan_blue:task.isFabulous}" @click="dianZan">
          <Icon type="md-thumbs-up" size="20" />
          <span class="zanNum" v-if="task.fabulousCount !== 0">{{task.fabulousCount}}</span>
        </span>
      </Tooltip>
      <span class="down">
        <SingleTaskMenu :data="task"></SingleTaskMenu>
      </span>
    </div>
    <div class="headerTool">
      <div class="toolLeft" v-if="task.parentId === '0'">
        <span></span>
        <span>{{task.project.projectName}}·</span>
        <Dropdown trigger="click">
          <span class="proName">任务组名</span>
          <DropdownMenu slot="list">
            <DropdownItem>任务组1
              <svg-icon class="right" name="right"></svg-icon>
            </DropdownItem>
            <DropdownItem>任务组2
              <svg-icon class="right" name="right"></svg-icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <span>·</span>
        <Dropdown trigger="click">
        <span class="proName">{{task.taskName}}</span>
        <DropdownMenu slot="list">
          <DropdownItem>任务1
            <svg-icon class="right" name="right"></svg-icon>
          </DropdownItem>
          <DropdownItem>任务2
            <svg-icon class="right" name="right"></svg-icon>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
      <div class="toolLeft" v-if="task.parentTask">
        <span></span>
        <span>属于任务:{{task.parentTask.taskName}}</span>
      </div>
    </div>

    <div class="Conbox">
      <div class="task_info done clearfix" :class="{done:task.taskStatus}">
        <Checkbox v-model="task.taskStatus" @on-change="updateTaskStatus" class="checkbox"></Checkbox>
        <Tooltip content="点击即可编辑" placement="top" class="content">
          <div id="editCon" style="width:100%;">
            <input v-model="task.taskName" @blur="updateTaskName()" type="text" style="height: 24px;border: 0 none;outline-style: none">
          </div>
        </Tooltip>

      </div>
      <div class="task_attr clearfix">
        <div class="executor fl">
          <!-- 设置认领者 -->
          <SetExecutor @choose="chooseZxz" :id="task.projectId" :taskId="task.taskId"  ref="executor" :task="task" v-model="task.executor" >

          </SetExecutor>
        </div>

        <div class="timer fl">
          <Icon type="ios-calendar-outline" size="18" style="margin-right:5px;"></Icon>
          <DateTimePicker type="start" :max="task.endTime" @confirm="confirm1">
            <div class="init" v-if="!task.startTime">设置开始时间</div>
            <div class="setTime" v-if="task.startTime">
              {{$moment(task.startTime).calendar(null,{sameDay: '[今天]', nextDay: '[明天]', nextWeek: 'ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}
              <span @click.stop="deleteStart">&times;</span>
            </div>
          </DateTimePicker>
          <span>-</span>
          <DateTimePicker type="end" :min="task.startTime" @confirm="confirm2">
            <div class="init" v-if="!task.endTime">设置截止时间</div>
            <div class="setTime" v-if="task.endTime">
              {{$moment(task.endTime).calendar(null,{sameDay: '[今天]', nextDay: '[明天]', nextWeek: 'ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}
              <!-- {{data.endDate}} -->
              <span @click.stop="deleteEnd">&times;</span>
            </div>
          </DateTimePicker>
        </div>

        <div class="repeat fl">
          <SetRepeat :repeat="task.repeat" v-on:updateRepeat="updateRepeat"></SetRepeat>
        </div>

        <div class="alarm fl" >
          <TaskWarn :remind="task.remind" v-on:updateRepeat="updateRepeat"></TaskWarn>

        </div>
        <!-- <p>{{$moment('2018-09-04 12:19:20').format("YYYY-MM-DD HH:mm:ss")}}</p> -->
        <!-- <p>{{$moment('2018-09-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]dddLT', lastDay: '[昨天]', lastWeek: '[上]dddLT', sameElse: 'L'})}}</p> -->
        <!-- <p>{{$moment('2018-11-04 12:19:20').calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]ddd', lastDay: '[昨天]', lastWeek: '[上]ddd', sameElse: 'M月D日'})}}</p> -->
      </div>

      <div class="remark">
        <span class="name">
          <Icon type="ios-document-outline" />备注</span>
        <div class="editor" @click="showEditor=true" v-if="!showEditor" v-html="editorValue!=''?editorValue:'待添加'">
        </div>
        <Simditor v-if="showEditor" :value="editorValue" @save="editorSave" @cancel="showEditor = false" class="fl editBox"></Simditor>

      </div>
      <div class="priority clearfix">
        <span class="name">
          <Icon type="ios-microphone-outline" />优先级</span>
        <div class="urgentButton">
          <UrgentDropdown v-on:priority="changePriority" v-bind:checked-name="task.priority"></UrgentDropdown>
        </div>
      </div>
      <div class="tags clearfix" style="display: flex;align-items: center">
        <span class="name">
          <Icon type="ios-pricetags-outline"></Icon>标签
        </span>
        <!-- 取到data.tag了再添加孙子辈组件 -->
        <Tags class="fl" :taglist="task.tagList" :publicId="task.taskId" :publicType="publicType" :projectId="task.projectId" v-if="task.tagList"></Tags>
      </div>
      <div class="childTask clearfix">
        <p class="name" style="float:none;">
          <Icon type="ios-options-outline" />子任务</p>
        <!-- 已添加的子任务列表 -->
        <ul v-if="task.taskList">
          <li class="sontask_list" v-for="(i,index) in task.taskList" :key="index">
            <!-- 点击之前 -->
            <div class="clearfix" v-show="isEdit" style="display:flex;">
              <div class="addicon fl">
                <Checkbox v-model="sonComplete"></Checkbox>
              </div>
              <div class="sonInput fl" @click.stop="showaa(i.taskId)">
                <Tooltip content="点击即可编辑" placement="top">
                  <div class="sonCon" ref="sonCon" style="" >{{i.taskName}}</div>
                </Tooltip>
              </div>
              <DateTimePicker class="sonDate fl" type="start" :max="i.endTime" @confirm="confirmSonDate" @clear="clearSonDate">
                <div>
                  <Icon class="icon" type="calendar" v-if="!i.sontaskDate" size="20"></Icon>
                  <span v-else class="timeBox">
                    {{$moment(i.sontaskDate).calendar(null,{sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: 'dddLT', lastDay: '[昨天]LT', lastWeek: '[上]dddLT', sameElse: 'M月D日LT'})}}
                  </span>
                </div>
              </DateTimePicker>
              <SetExecutor @choose="chooseZxz" :id="task.projectId" :taskId="i.taskId" :task="task" ref="executor" v-model="i.executor">

              </SetExecutor>
              <div class="enterDetail fl">
                <Icon type="ios-arrow-right"></Icon>
              </div>
            </div>

          </li>
        </ul>
        <div class="addChildTask" @click="showSontask=false;" v-if="showSontask">
          <Icon type="ios-add-circle-outline" />添加子任务</div>
        <!-- 添加子任务 -->
        <div class="sonBox clearfix" v-if="!showSontask">
          <div class="newSon clearfix">
            <div class="sonInput fl"><Input v-model="son" placeholder="输入子任务内容..." autofocus @keyup.enter.native = "submitSontask"/></div>
          </div>
          <div class="btns">
            <Button type="text" @click="showSontask=true;">取消</Button>
            <Button type="primary" @click="submitSontask" style="padding:6px 20px;">保存</Button>
          </div>

        </div>
      </div>
      <!-- 添加关联 -->
      <div class="relevance">
        <p class="name" style="float: none;">
          <Icon type="ios-link-outline" />关联内容</p>
        <div class="addLink" @click="relationModal=true;">
          <Icon type="ios-add-circle-outline" />添加关联</div>
        <Modal v-model="relationModal" class="relationModal" id="relationModal">
          <AddRelation :publicId="task.taskId" :fromType="publicType"></AddRelation>
        </Modal>
      </div>
      <div class="has-relevance">
        <ul v-if="task.bindTasks.length">
          <div class="what-title">关联的任务</div>
          <li class="gl-task-list" v-for="(b,i) in task.bindTasks" :key="i">
            <div class="gl-task-list-con">
              <Icon type="md-checkbox-outline" size="22" />
              <!--<Icon type="ios-list-box-outline" size="22" />-->
              <!--<Icon type="ios-calendar-outline" size="22" />-->
              <!--<Icon type="ios-document-outline" size="22" />-->
              <img v-if="b.userImage" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+ b.userImage" alt="执行者">
              <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg==">
              <div class="gl-con">
                <div class="gl-con-top">
                  <span>{{b.taskName}}</span><span>{{b.projectName}}</span>
                </div>
                <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
              </div>
            </div>
            <Poptip>
              <Icon class="glpop" type="ios-arrow-down" size="20" />
              <div slot="content">
                <div class="glpop-list">
                  <Icon type="ios-link" size="20" /><span>复制链接</span>
                </div>
                <div class="glpop-list" @click="cancle(b.taskId)">
                  <Icon type="md-link" size="20" /><span>取消关联</span>
                </div>
              </div>
            </Poptip>
          </li>
        </ul>
        <ul v-if="task.bindFiles.length">
          <div class="what-title">关联的文件</div>
          <li class="gl-task-list" v-for="(b,i) in task.bindFiles" :key="i">
            <div class="gl-task-list-con">
              <!--<Icon type="md-checkbox-outline" size="22" />-->
              <Icon type="ios-document-outline" size="22" />
              <div class="gl-con">
                <div class="gl-con-top">
                  <span>{{b.fileName}}</span><span>{{b.projectName}}</span>
                </div>
                <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
              </div>
            </div>
            <Poptip>
              <Icon class="glpop" type="ios-arrow-down" size="20" />
              <div slot="content">
                <div class="glpop-list">
                  <Icon type="ios-link" size="20" /><span>复制链接</span>
                </div>
                <div class="glpop-list" @click="cancle(b.fileId)">
                  <Icon type="md-link" size="20" /><span>取消关联</span>
                </div>
              </div>
            </Poptip>
          </li>
        </ul>
        <ul v-if="task.bindSchedules.length">
          <div class="what-title">关联的日程</div>
          <li class="gl-task-list" v-for="(b,i) in task.bindSchedules" :key="i">
            <div class="gl-task-list-con">
              <!--<Icon type="md-checkbox-outline" size="22" />-->
              <Icon type="ios-calendar-outline" size="22" />
              <div class="gl-con">
                <div class="gl-con-top">
                  <span>{{b.scheduleName}}</span><span>{{b.projectName}}</span>
                </div>
                <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
              </div>
            </div>
            <Poptip >
              <Icon class="glpop" type="ios-arrow-down" size="20" />
              <div slot="content">
                <div class="glpop-list">
                  <Icon type="ios-link" size="20" /><span>复制链接</span>
                </div>
                <div class="glpop-list" @click="cancle(b.scheduleId)">
                  <Icon type="md-link" size="20" /><span>取消关联</span>
                </div>
              </div>
            </Poptip>
          </li>
        </ul>
        <ul v-if="task.bindShares.length">
          <div class="what-title">关联的分享</div>
          <li class="gl-task-list" v-for="(b,i) in task.bindShares" :key="i">
            <div class="gl-task-list-con">
              <Icon type="ios-open-outline" size="22" />
              <div class="gl-con">
                <div class="gl-con-top">
                  <span>{{b.shareName}}</span><span>{{b.projectName}}</span>
                </div>
                <!--<div class="gl-con-bottom">2018-12-12 12:00</div>-->
              </div>
            </div>
            <Poptip>
              <Icon class="glpop" type="ios-arrow-down" size="20" />
              <div slot="content">
                <div class="glpop-list">
                  <Icon type="ios-link" size="20" /><span>复制链接</span>
                </div>
                <div class="glpop-list" @click="cancle(b.shareId)">
                  <Icon type="md-link" size="20"/><span>取消关联</span>
                </div>
              </div>
            </Poptip>
          </li>
        </ul>
      </div>
      <!-- 上传附件 -->
      <div class="accessory">
        <!--<p class="name" style="float: none;width: 90px"><Icon type="ios-cloud-upload-outline" size="14" />上传附件</p>-->
        <div class="addfile">
          <div class="file-lsit" v-if="task.fileList" v-for="(f,i) in task.fileList" :key="i">
            <div class="file-img">
              <img v-if="images_suffix.indexOf(f.ext) > -1" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'" alt="">
              <img v-else src="@/icons/img/moren.png" alt="文件">
              <div class="zhezhao">
                <Icon type="md-cloud-download" @click="downLoad(f.fileId)"/>
                <Icon type="md-search" @click="getFileDetail(f.fileId)"/>
              </div>
            </div>
            <Tooltip :content="f.fileName">
              <p class="file-name">{{f.fileName}}</p>
            </Tooltip>

          </div>
          <div style="width: 117px;height:117px;line-height: 117px;border: 1px solid #e5e5e5;display: flex;align-items: center;justify-content: center" @click="showCommon=true">
            <Icon type="md-add" size="40" style="margin-right: 0px"></Icon>
          </div>
        </div>
      </div>
      <!-- 设置参与者 -->
      <div class="participator">
        <h5>
          参与者 · {{task.joinInfo?task.joinInfo.length:0}}
          <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
            <Icon type="ios-help"></Icon>
          </Tooltip>
        </h5>
        <div class="involve-list clearfix">
          <div class="member-avatar fl" v-for="(item,index) in task.joinInfo" :key="index">
            <Tooltip :content="item.userName" placement="top" transfer>
              <div class="ava">
                <!-- 删除需要加在关闭按钮上 -->
                <img v-if="item.image" :src="prefix + item.image" alt="">
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
    <footer>
      <publick :publicId="task.taskId" :projectId="task.projectId" :publicType="publicType"></publick>
    </footer>
    <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
      <common-file @close="showCommon=false" :projectId="task.projectId" :publicId="task.taskId"></common-file>
    </Modal>
    <Modal v-model="showFileDetail" fullscreen :footer-hide="true" class-name="model-detail" :closable="false">
      <fileDetail @close="closeDetail"></fileDetail>
    </Modal>
  </div>
</template>
<script>
import SetRepeat from "./SetRepeat";
import TaskWarn from "./TaskWarn";
import AddRelation from "@/components/public/common/AddRelation";
import Tags from "@/components/project/pages/index/components/task/Tags";
import insertText from "@/utils/insertText";
import Emoji from "@/components/public/common/emoji/Emoji";
import SingleTaskMenu from "./SingleTaskMenu";
import SetExecutor from "./SetExecutor";
import myModel from "./EditList"
import log from '@/components/public/log'
import publick from '@/components/public/Publish'
import fileDetail from "@/components/project/file/fileDetail"
import OSS from "ali-oss";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import commonFile from './commonfile.vue'
import {
  updateTaskName,
  updatePriority,
  cancelcompleteTask,
  completeTask,
  updateRepeat,
  updateTaskJoin,
  fabulous,
  cancelFabulous,
  taskExecutor,
  cancle
} from "@/axios/api";
import  {downloadFile,getFileDetails} from "@/axios/fileApi"
export default {
  name: "myModel",
  components: {
    fileDetail,
    SetRepeat,
    TaskWarn,
    Tags,
    Emoji,
    SingleTaskMenu,
    SetExecutor,
    AddRelation,
    myModel,
    publick,
    log,
    commonFile
  },
  props:["data"],
  data() {
    return {
      prefix: "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/",
      loading: true,
      glPop: false,
      zan: false,
      aa: false,
      childTaskData:null,
      complete: false,
      hoverExecutor: false,
      editorValue: "123",
      showFileDetail:false,
      fileId:'',
      showEditor: false,
      maxFileSize:1024*1024*100,
      isShowFileList:true,
      type:'task',
      modal1: false,
      relationModal: false,
      talkvalue: "",
      son: "",
      showSontask: true,
      sonComplete: false,
      isEdit: true,
      newCon: "",
      ept: "",
      publicType:"任务",
      involveDataList: [
      ],
      showCommon:false
    };
  },
  methods: {
    ...mapActions('task',['initEditTask','updateStartTime','updateEndTime','addChildrenTask']),
    ...mapMutations('file',["putOneFile"]),
    updateTaskName() {
      updateTaskName(this.task.taskId, this.task.taskName).then(
        data => {
          //console.log(data)
        }
      );
    },
    //文件下载
    downLoad(fileId){
      window.location.href= "http://192.168.3.189:8090/files/"+fileId+"/download"
      //downloadFile(fileId)
    },
    getFileDetail(fileId){
      getFileDetails(fileId).then(res => {
        console.log(res)
        this.putOneFile(res)
        this.showFileDetail = true
      })

    },
    closeDetail () {
      this.showFileDetail=false
    },
    // 删除执行者
    deleteExecutor(){
      taskExecutor(this.task.taskId,'').then(res => {})
    },
    // 选择执行者
    chooseZxz(data,taskid){
      taskExecutor(taskid,data).then(res => {
        console.log(res)
      })
    },
    cancle(id){
      cancle(id,this.task.projectId,this.publicType,this.task.taskId).then(res => {
        if(res.result === 1){
          this.$Message.success("已取消")
        }
      })
    },
    showaa (taskId){
        const msg = this.$Message.loading('正在加载中...', 0);
        setTimeout(msg,10000);
      this.$store.dispatch('task/editTask', taskId).then(() => {
        clearTimeout(msg)
      })
      // this.initEditTask(taskId).then(() => {
      //
      //   this.childTaskData=this.getTaskById(taskId);
      //   this.aa=true
      // })

    },
    changePriority(priority) {
      updatePriority(this.task.taskId, priority).then(item => {});
    },
    //更改任务的重复性
    updateRepeat(repeat){
      updateRepeat(this.task.taskId,repeat).then(res => {
          console.log(res)
      })
    },
    //更改任务的状态
    updateTaskStatus() {
      if (this.task.taskStatus) {
        completeTask(this.task.taskId);
      } else {
        cancelcompleteTask(this.task.taskId);
      }
    },
    // 添加子任务
    submitSontask () {
      this.addChildrenTask({"taskId":this.task.taskId, "taskName":this.son})
      this.showSontask=false
    },
    confirmSonDate(date) {
      this.task.sontaskDate = date;
    },
    clearSonDate() {
      this.task.sontaskDate = "";
    },
    confirm1 (date) {
      this.updateStartTime({'taskId':`${this.task.taskId}`, 'date':date})
      // this.task.startTime = date
      // this.$forceUpdate()
    },
    confirm2 (date) {
      this.updateEndTime({'taskId':`${this.task.taskId}`, 'date':date})
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
          if(res.result === 1){
            this.task.isFabulous = true
            this.task.fabulousCount++
          }

        })
      } else {
        //发请求取消点赞
        cancelFabulous(this.task.taskId).then(res => {
          if(res.result === 1){
            this.task.isFabulous = false
            this.task.fabulousCount--
          }
        })
      }
    },
    deleteInvolve(id) {
      // if (id == 3) return; //需获取当前登录用户id判断
      let index = this.joinInfoIds.indexOf(id);
      this.joinInfoIds.splice(index, 1);
      updateTaskJoin(this.task.taskId,this.joinInfoIds.join(',')).then(res => {

      })
    },
    editorSave(val) {
      this.editorValue = val;
      this.showEditor = false;
    },
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
    saveInvolveMember (detailList) {
      updateTaskJoin(this.task.taskId,detailList).then(res => {
        if(res.result === 1){
          // this.task.joinInfo.unshift(res.data)
        }
      })
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
    }
  },
  mounted() {
    this.aa=false
    // document.getElementById("editCon").parentNode.style.width = "100%"
  },
  computed:{
    ...mapState("task",["task",'joinInfoIds','images_suffix']),
    vuexTask(){
      return this.$store.state.task.joinInfo
    }
  },
};
</script>
<style scoped lang="less">
@import "./EditList.less";

.not-allow *{
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
  .rlz{
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-right: 8px;
    &:hover{
      i{
        display: block;
      }
    }
    img{
      width: 24px;
      height: 24px;
      margin-right: 3px;
    }
    i{
      position: absolute;
      top: -5px;
      right: -8px;
      font-size: 22px;
      color: gray;
      display: none;
    }
  }
</style>

