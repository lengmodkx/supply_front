<template>
  <div>
    <div v-if="!schedule" style="background-color:white;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center">
      <Loading></Loading>
    </div>
    <div v-else class="task-detail" style="height:100%;position: relative">
      <div class="headerTool" slot="header">
        <div class="toolLeft">
          <span class="proname">{{ projectName ? projectName : "日程" }}</span>
        </div>
        <div class="toolRight">
          <span class="down">
            <SingleRiChengMenu @closeMenu="$emit('close')" :data="schedule" :name="publicType"></SingleRiChengMenu>
          </span>
        </div>
      </div>
      <div class="Conbox" ref="scrollbox">
        <div class="task_info clearfix">
          <div class="content">
            <input id="editCon" type="text" @blur="upRCname" v-model="schedule.scheduleName" />
          </div>
        </div>
        <div class="task_attr clearfix">
          <div class="timer fl">
            <div class="starttime fl">
              <p class="timeTitle">开始时间</p>
              <div>
                <DateTimePicker type="start" :max="schedule.endTime" @confirm="confirm1">
                  <div class="init" v-if="!schedule.startTime">设置开始时间</div>
                  <div class="setTime" v-if="schedule.startTime">
                    {{ $moment(schedule.startTime).calendar(null, { sameDay: "[今天]", nextDay: "[明天]", nextWeek: "ddd", lastDay: "[昨天]", lastWeek: "[上]ddd", sameElse: "Y年M月D日" }) }}
                  </div>
                </DateTimePicker>
              </div>
            </div>

            <div class="endtime fl">
              <p class="timeTitle">结束时间</p>
              <div>
                <DateTimePicker type="end" :min="schedule.startTime" @confirm="confirm2">
                  <div class="init" v-if="!schedule.endTime">设置截止时间</div>
                  <div class="setTime" v-if="schedule.endTime">
                    {{ $moment(schedule.endTime).calendar(null, { sameDay: "[今天]", nextDay: "[明天]", nextWeek: "ddd", lastDay: "[昨天]", lastWeek: "[上]ddd", sameElse: "Y年M月D日" }) }}
                  </div>
                </DateTimePicker>
              </div>
            </div>
            <div class="wholeDay fl">
              <p class="timeTitle">全天</p>
              <div class="checkWholeday">
                <Checkbox v-model="wholeday" class="checkbox" size="large" @on-change="allDay"></Checkbox>
              </div>
            </div>
          </div>

          <div class="repeatBox clearfix">
            <div class="repeat fl">
              <SetRepeat :repeat="schedule.repeat" @updateRepeat="changeRepeats"></SetRepeat>
            </div>
          </div>
        </div>
        <div class="remark clearfix">
          <span class="name"> <Icon type="ios-pin-outline"></Icon>地点</span>
          <div class="address fl">
            <div v-if="editAddress">
              <Input v-model.trim="schedule.address" placeholder="" autofocus />
              <Alert show-icon v-show="!schedule.address" show-icon style="margin-top: 5px">请添加地点</Alert>
              <div class="btn-box">
                <Button type="primary" @click="saveAddress" style="margin-top:10px;">确定</Button>
                <Button @click="editAddress = false" style="margin:10px 5px 0 20px;">取消</Button>
              </div>
            </div>

            <Tooltip v-else content="点击即可编辑" placement="top" style="width:100%;">
              <div
                class="noLocation"
                @click="
                  editAddress = true;
                  address = addressValue;
                "
              >
                {{ schedule.address ? schedule.address : "待添加" }}
              </div>
            </Tooltip>
          </div>
        </div>

        <div class="remark" style="display: flex">
          <span class="name" style="flex: none;"> <Icon type="ios-copy-outline" />备注</span>
          <div class="editor" @click="showEditor = true" v-if="!showEditor" v-html="schedule.remarks ? schedule.remarks : '待添加'"></div>
          <div v-if="showEditor" class="editor-wrap">
            <editor ref="editor" :contents="schedule.remarks" class="editBox"></editor>
            <button type="button" class="fr ivu-btn ivu-btn-info ivu-btn-large" @click="addBeizhu" :loading="loading">
              <span v-if="!loading">立即发布</span>
              <span v-else>Loading...</span>
            </button>
          </div>
        </div>

        <div class="tags clearfix">
          <span class="name"> <Icon type="ios-pricetags-outline"></Icon>标签</span>

          <!-- <Tags class="fl" :taglist="schedule.tagList" :projectId="schedule.projectId" :publicType="publicType" :publicId="schedule.scheduleId"
                                    v-if="schedule.tagList"></Tags> -->

          <!-- 取到data.tag了再添加孙子辈组件 -->
          <Tags v-if="schedule.tagList" class="fl" :taglist="schedule.tagList" :publicId="schedule.scheduleId" :publicType="publicType" :projectId="schedule.projectId"></Tags>
        </div>

        <!-- 添加关联 -->
        <div class="relevance">
          <p class="name" style="float: none;"><Icon type="ios-link-outline"></Icon>关联内容</p>
          <div class="addLink" @click="relationModal = true"><Icon type="ios-add-circle-outline" />添加关联</div>
          <Modal v-model="relationModal" footer-hide :closable="false" class-name="relationModal" class="add-relation" id="relationModal" width="800" >
            <AddRelation :publicId="schedule.scheduleId" :fromType="publicType" @close="relationModal = false" v-if="relationModal"></AddRelation>
          </Modal>
        </div>

        <div style="margin-bottom: 15px" class="has-relevance" v-if="schedule.scheduleId">
          <ul v-if="schedule.bindTasks.length">
            <div class="what-title">关联的任务</div>
            <li class="gl-task-list" v-for="(b, i) in schedule.bindTasks" :key="i">
              <div class="gl-task-list-con">
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
          <ul v-if="schedule.bindFiles.length">
            <div class="what-title">关联的文件</div>
            <li class="gl-task-list" v-for="(b, i) in schedule.bindFiles" :key="i">
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
                  <div class="glpop-list" @click.stop="clone(b.fileId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                  <div class="glpop-list" @click.stop="cancle(b.fileId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                </div>
              </Poptip>
            </li>
          </ul>
          <ul v-if="schedule.bindSchedules.length">
            <div class="what-title">关联的日程</div>
            <li class="gl-task-list" v-for="(b, i) in schedule.bindSchedules" :key="i">
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
                  <div class="glpop-list" @click.stop="cancle(b.taskId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                </div>
              </Poptip>
            </li>
          </ul>
          <ul v-if="schedule.bindShares.length">
            <div class="what-title">关联的分享</div>
            <li class="gl-task-list" v-for="(b, i) in schedule.bindShares" :key="i">
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
                  <div class="glpop-list" @click.stop="clone(b.shareId)"><Icon type="ios-link" size="20" /><span>复制链接</span></div>
                  <div class="glpop-list" @click.stop="cancle(b.shareId)"><Icon type="md-link" size="20" /><span>取消关联</span></div>
                </div>
              </Poptip>
            </li>
          </ul>
        </div>

        <!-- 设置参与者 -->
        <div class="participator">
          <h5>
            参与者 · {{ schedule.joinInfo ? schedule.joinInfo.length : 0 }}
            <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
              <Icon type="ios-help"></Icon>
            </Tooltip>
          </h5>
          <div class="involve-list clearfix">
            <div class="member-avatar fl" v-for="(item, index) in schedule.joinInfo" :key="index">
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
              <InvolveMember ref="involveMember" :checkedList="schedule.memberIds ? schedule.memberIds.split(',') : []" :projectId="schedule.projectId" @save="saveInvolveMember"></InvolveMember>
            </div>
          </div>
          <log :logs="schedule.logs" :unReadMsg="schedule.unReadMsg" :publicId="schedule.scheduleId"></log>
        </div>
      </div>
      <footer>
        <publick :publicId="schedule.scheduleId" :projectId="schedule.projectId" :publicType="publicType"></publick>
      </footer>
      <Modal v-model="showFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
        <fileDetail v-if="showFileDetail" :file="file"></fileDetail>
      </Modal>
    </div>
  </div>
</template>
<script>
import SetRepeat from "@/components/project/pages/index/components/SetRepeat";
import SetRCWarn from "@/components/project/pages/index/components/SetRiChengWarn";
 import AddRelation from "@/components/Relation";
//import Tags from '@/components/project/share/Tags'
import Tags from "@/components/public/Tags.vue";
import Emoji from "@/components/public/common/emoji/Emoji";
import SingleRiChengMenu from "./SingleRiChengMenu.vue";
import SetExecutor from "@/components/project/pages/index/components/SetExecutor";
import editor from "@/components/resource/Simditor";
import log from "@/components/public/log";
import publick from "@/components/public/Publish";
import { mapState, mapMutations, mapActions } from "vuex";
import { sendMsg, cancle } from "@/axios/api";
import { setSysClip } from "@/axios/api2.js";
import { upRichengName, beginDate, endDate, changeRepeat, changeRemind, changeAddress, changeRemarks, playPeople } from "@/axios/scheduleApi";
import { getFileDetails } from "@/axios/fileApi";
import fileDetail from "@/components/project/pages/index/components/fileDetail";


export default {
  components: {
    SetRepeat,
    log,
    SetRCWarn,
    Tags,
    Emoji,
    SingleRiChengMenu,
    editor,
    SetExecutor,
    AddRelation,
    publick,
    fileDetail
  },
  data() {
    return {
      wholeday: false,
      zan: false,
      loading: false,
      address: "",
      involveList: [],
      addressValue: "石景山",
      editAddress: false,
      editorValue: "123",
      showEditor: false,
      publicType: "日程",
      typeFont: "schedule",
      relationModal: false,
      beizhuContent: "",
      talkvalue: "",
      isEdit: true,
      projectName: localStorage.projectName,
      newCon: "",
      ept: "",
      involveDataList: [],
      showFileDetail:false,
      file: {},

    };
  },
  computed: {
    ...mapState("schedule", ["schedule"])
  },

  methods: {
    ...mapMutations("schedule", ["updateScheduleName", "startDate", "endDate", "allDay", "repeat", "vxaddress", "vxremarks", "changePeople"]),
    // ...mapActions('schedule',['startDate', 'endDate']),
    // 设置日程名字
    upRCname() {
      upRichengName(this.schedule.scheduleId, this.schedule.scheduleName).then(res => {
        if (res.result == 1) {
          this.updateScheduleName(this.schedule);
        }
      });
    },
    // 点击全选
    allDay() {
      if (this.wholeday) {
        console.log(this.schedule.startTime);
        endDate(this.schedule.scheduleId, this.schedule.startTime).then(res => {
          if (res.result == 1) {
            this.endDate(this.schedule.startTime);
          }
        });
      }
    },
    // 改变重复规则
    changeRepeats(data) {
      changeRepeat(this.schedule.scheduleId, data).then(res => {
        if (res.result == 1) {
          this.$Message.success("更改成功");
        }
      });
    },
    // 改变提醒规则
    changeRemind(data) {
      changeRemind(this.schedule.scheduleId, data).then(res => {
        console.log(res, data);
        if (res.result == 1) {
          console.log(6668);
        }
      });
    },
    // 改变地点
    saveAddress() {
      if (this.schedule.address) {
        changeAddress(this.schedule.scheduleId, this.schedule.address).then(res => {
          if (res.result == 1) {
            this.editAddress = false;
            this.vxaddress(this.schedule.address);
          }
        });
      }
    },
    // 开始时间
    confirm1(date) {
      beginDate(this.schedule.scheduleId, new Date(date).getTime()).then(res => {
        if (res.result == 1) {
          this.startDate(new Date(date).getTime());
        }
      });
    },
    // 结束时间
    confirm2(date) {
      endDate(this.schedule.scheduleId, new Date(date).getTime()).then(res => {
        if (res.result == 1) {
          this.endDate(new Date(date).getTime());
        }
      });
    },
    // 改备注
    addBeizhu() {
      console.log(this.$refs.editor.content);
      if (this.$refs.editor.content == undefined) {
        this.$Message.error("请输入备注内容");
        return;
      }
      this.beizhuContent = this.$refs.editor.content;
      this.loading = true;
      changeRemarks(this.schedule.scheduleId, this.beizhuContent).then(res => {
        if (res.result) {
          this.vxremarks(this.beizhuContent);
          this.loading = false;
          this.showEditor = false;
        } else {
          this.$Message.error("系统异常");
        }
      });
    },
    // 改变日程参与者
    saveInvolveMember(detailList, list) {
      playPeople(this.schedule.scheduleId, detailList).then(res => {
        if (res.result) {
          this.changePeople(list);
        }
      });
    },
    // 取消关联
    cancle(id) {
      cancle(id, this.schedule.projectId, this.publicType, this.schedule.scheduleId).then(res => {
        if (res.result === 1) {
          this.$Message.success("已取消");
        }
      });
    },
    //复制关联
    clone(id) {
      let url = "http://" + process.env.NODE_ENV == "development" ? "/schedules/" + id : process.env.VUE_APP_URL + "/schedules/" + id;
      setSysClip(url).then(res => {
        if (res.result === 1) {
          this.$Message.success(res.msg);
        }
      });
    },

    deleteStart() {
      this.schedule.startTime = "";
    },
    deleteEnd() {
      this.schedule.endTime = "";
    },
    dianZan() {
      this.zan = !this.zan;
      if (this.zan) {
        //发请求点赞
      } else {
        //发请求取消点赞
      }
    },
    deleteExecutor() {},
    // 删除日程参与者
    deleteInvolve(id) {
      if (id == 3) return; //需获取当前登录用户id判断
      console.log(this.schedule.joinInfo);
      let newList = this.schedule.joinInfo;
      newList.forEach((item, index) => {
        if (item.userId == id) {
          newList.splice(index, 1);
        }
      });
      let idStr = newList.map(item => {
        return item.userId;
      });

      playPeople(this.schedule.scheduleId, idStr.join(",")).then(res => {
        if (res.result) {
          console.log(newList, idStr);
          this.changePeople(newList);
        }
      });

      // let index = this.schedule.involveList.indexOf(id)
      // this.schedule.involveList.splice(index, 1)
      // this.involveDataList.splice(index, 1)
    },
    editorSave(val) {
      this.editorValue = val;
      this.showEditor = false;
    },
    showwaitAdd() {
      this.showEditor = true;
    },
    getFileDetail(fileId) {
      getFileDetails(fileId).then((res) => {
        if (res.result == 1) {
          this.showFileDetail = true;
          this.file = res.data;
        }
      });
    },
  },
  mounted() {
    // document.getElementById("editCon").parentNode.style.width = '100%';
  }
};
</script>
<style scoped lang="less">
@import "./EditRicheng.less";

.btn-box {
  display: flex;
  flex-direction: row-reverse;
}
.relationModal{
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal{
    top: 0;
  }
}
.add-relation{
  /deep/.ivu-modal-body{
    padding: 0px;
    overflow: hidden;
  }
}
</style>
