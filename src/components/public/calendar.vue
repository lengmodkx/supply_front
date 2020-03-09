<template>
  <div class="calendar-wrap">
    <!-- <header class="calendar-header">
            <Icon @click="close" class="close" type="md-close" />
        </header> -->
    <div class="calendar-con">
      <div class="left-filter">
        <p>要查看的人员</p>
        <div class="member-list">
          <img :src="img" alt="" />
          <span>{{ name }}</span>
          <Icon type="md-checkmark" size="20" />
        </div>
      </div>
      <full-calendar :config="config" :events="fcEvents" @event-render="eventRender" @day-click="clickDay" @event-selected="eventClick"> </full-calendar>
    </div>
    <ul class="create" v-show="showCreate" :style="{ left: left, top: top }">
      <Loading v-if="loading"></Loading>
      <li @click="showCreateTask"><Icon type="md-checkbox-outline" size="20" />创建任务</li>
      <li @click="showCreateRc"><Icon type="ios-calendar-outline" size="20" />创建日程</li>
    </ul>
    <!--创建任务-->
    <Modal v-model="creatTask" :footer-hide="true" title="创建任务" width="360">
      <div class="what-task">
        <span>请选择项目：</span>
        <Select v-model="project" style="width:300px">
          <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <textarea class="taskInput" v-model="taskTitle" type="text" placeholder="任务标题"></textarea>
      <Button type="info" :loading="btnLoading" long @click="createTask">创建</Button>
    </Modal>
    <!--创建日程-->
    <AddSchedule :projectTypes="projectTypes" :value="createRc" :date="clickTime" @rcok="rcok"></AddSchedule>
    <!-- 编辑任务框 -->
    <Modal v-model="showditTask" class="myModal">
      <my-modal v-if="showditTask"></my-modal>
    </Modal>
    <!--编辑日程框-->
    <Modal v-model="editrc" :footer-hide="true">
      <editRicheng v-if="editrc"></editRicheng>
    </Modal>
  </div>
</template>

<script>
import "fullcalendar/dist/fullcalendar.css";
import AddSchedule from "./calendar/AddSchedule";
import myModal from "@/components/project/pages/index/components/EditList";
import editRicheng from "@/components/project/schedule/EditRicheng";
import { getCalendar } from "@/axios/api2";
import { getProjectList, addTask } from "@/axios/api";
import { mapMutations, mapActions } from "vuex";
import SockJS from "sockjs-client";
export default {
  name: "calendar",
  components: { AddSchedule, myModal, editRicheng },
  data() {
    return {
      showCreate: false,
      img: localStorage.userImg,
      name: localStorage.userName,
      left: 0,
      top: 0,
      creatTask: false,
      createRc: false,
      clickTime: "",
      projectId: "",
      project: "",
      taskTitle: "",
      projectTypes: [],
      loading: false,
      projectList: [],
      fcEvents: [],
      btnLoading: false,
      showditTask: false,
      editrc: false,
      morenImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg==",
      config: {
        locale: "zh-cn",
        firstDay: "1",
        defaultView: "month",
        height: "auto",
        header: {
          left: "prev, next, today",
          center: "title",
          right: "custom"
        }
      }
    };
  },
  mounted() {
    this.initSocket(localStorage.userId);
    getCalendar(localStorage.userId).then(res => {
      if (res.result) {
        let schedulesData = res.data.schedules;
        let tasksData = res.data.tasks;
        schedulesData.forEach((i, n) => {
          var executorImg = "";
          if (i.img) {
            executorImg = '<img class="img20" src="' + i.img + '" />' + i.scheduleName;
          } else {
            executorImg = executorImg = '<img class="img20" src="' + this.morenImg + '" />' + i.scheduleName;
          }
          this.fcEvents.push({
            title: executorImg,
            start: this.getTime(i.startTime),
            end: this.getTime(i.endTime),
            id: i.scheduleId,
            type: "日程"
          });
        });
        tasksData.forEach(i => {
          var executorImg = "";
          if (i.executorImg) {
            executorImg = '<img class="img20" src="' + i.executorImg + '" />' + i.taskName;
          } else {
            executorImg = '<img class="img20" src="' + this.morenImg + '" />' + i.taskName;
          }
          this.fcEvents.push({
            title: executorImg,
            start: this.getTime(i.startTime),
            end: this.getTime(i.endTime),
            id: i.taskId,
            type: "任务"
          });
        });
      }
    });
    //console.log(localStorage)
  },
  methods: {
    ...mapMutations("task", ["setTaskId"]),
    ...mapActions("schedule", ["getScheduleById"]),
    eventRender(event, element) {
      element.html(event.title);
    },
    getTime(time) {
      if (time) {
        let year = new Date(time).getFullYear();
        let month = new Date(time).getMonth() + 1;
        let day = new Date(time).getDate();
        if (month < 10) {
          month = "0" + month;
        }
        return year + "-" + month + "-" + day;
      } else {
        return "";
      }
    },
    clickDay(day, jsEvent) {
      this.showCreate = !this.showCreate;
      this.left = jsEvent.clientX + "px";
      this.top = jsEvent.clientY + "px";
      this.clickTime = day._i;
      console.log("day:", day._i);
      console.log("jsEvent:", jsEvent);
    },
    // 显示创建任务框
    showCreateTask() {
      this.creatTask = true;
      getProjectList().then(res => {
        if (res.result) {
          res.data.forEach(i => {
            this.projectList.push({
              value: i.projectId,
              label: i.projectName
            });
          });
        }
      });
    },
    // 点击创建任务
    createTask() {
      if (!this.taskTitle || !this.project) {
        this.$Message.error("请选择项目并填写任务名称");
      } else {
        this.btnLoading = true;
        let data = {
          taskName: this.taskTitle,
          projectId: this.project,
          startTime: this.clickTime,
          endTime: this.clickTime
        };
        addTask(data).then(res => {
          this.btnLoading = false;
          this.$Message.success("创建成功");
          this.creatTask = false;
          this.showCreate = false;
        });
      }
    },
    // 显示创建日程框
    showCreateRc() {
      this.loading = true;
      getProjectList().then(res => {
        res.data.forEach((i, n) => {
          this.projectTypes.push({ projectId: i.projectId, projectName: i.projectName });
        });
        this.createRc = true;
        this.loading = false;
      });
    },
    // 创建日程完毕
    rcok() {
      this.showCreate = false;
      this.createRc = false;
    },
    // event的点击事件
    eventClick(event) {
      if (event.type === "任务") {
        this.showditTask = true;
        this.setTaskId(event.id);
      } else if (event.type === "日程") {
        this.getScheduleById(event.id);
        this.editrc = true;
      }
    },
    close() {
      this.$router.push(localStorage.projectRouter);
    },
    initSocket(id) {
      // 建立连接对象
      var url = process.env.NODE_ENV === "development" ? process.env.VUE_APP_SOCKET : process.env.VUE_APP_SOCKET;
      var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      //this.stompClient.debug = function(str) {};
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/topi1c/${id}`, msg => {
            var result = JSON.parse(msg.body);
            console.log(result.type);
            switch (result.type) {
              case "A1": //创建任务
                this.$store.dispatch("task/init", result.object);
                break;
              case "A2":
                this.$store.dispatch("task/deleteTask", result.object);
                break;
              case "A3":
                this.$store.dispatch("task/updateStatus", result.object);
                break;
              case "A4":
                this.$store.dispatch("task/updateStatus", result.object);
                break;
              case "A5":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A6":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A7":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A8":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A9":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A11":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A12":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A13":
                this.$store.dispatch("task/editTask", result.object.taskId);
                this.$store.dispatch("task/init", result.object.projectId);
                break;
              case "A14":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A15":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A16":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A17":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A18":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A20":
                this.$store.dispatch("task/changeTask", result.object);
              case "A27":
                this.$store.dispatch("task/init", result.object);
                break;
              // 关联
              case "A28":
                if (result.object.fromType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.fromType === "文件") {
                  this.$store.commit("file/relevance", result.object);
                } else if (result.object.fromType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.fromType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 取消关联
              case "A29":
                if (result.object.fromType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.fromType === "文件") {
                  this.$store.commit("file/cancelRelevance", result.object);
                } else if (result.object.fromType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.fromType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              case "A30":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              // 添加分享
              case "B1":
                this.$store.dispatch("share/init", result.object);
                break;
              // 编辑分享
              case "B2":
                this.$store.dispatch("share/init", result.object.projectId);
                this.$store.dispatch("share/changeShares", result.object.id);
                break;
              // 移动分享
              case "B5":
                this.$store.dispatch("share/removeShare", result.object);
                // this.$store.commit("share/removeShare",'' );
                break;
              // 隐私模式
              case "B8":
                this.$store.dispatch("share/changeShares", result.object);
                break;
              // 分享移到回收站
              case "B6":
                this.$store.dispatch("share/init", result.object);
                // this.$store.dispatch("share/deleteSahre", result.object);
                break;
              // 添加参与者
              case "B10":
                this.$store.dispatch("share/changeShares", result.object);
                break;
              case "B3":
              case "B4":
              case "B7":
                this.$store.dispatch("share/init", result.object);
                break;
              // 创建文件夹
              case "C1":
                this.$store.commit("file/createWjj", result.object);
                break;
              // 上传文件
              case "C2":
                this.$store.dispatch("file/upFiles", result.object);
                break;
              // 修改文件名称
              case "C11":
                this.$store.commit("file/changeFileName", result.object);
                break;
              // 复制文件
              case "C10":
                this.$store.commit("file/copyFile", result.object);
                break;
              // 移动文件
              case "C12":
                this.$store.commit("file/removeFile", result.object);
                break;
              // 文件移到回收站
              case "C13":
                this.$store.commit("file/putRecycle", result.object);
                break;
              // 更改 文件隐私模式
              case "C8":
                this.$store.dispatch("file/putMimi", result.object);
                break;
              // 改变文件参与者
              case "C9":
                this.$store.commit("file/player", result.object);
                break;
              case "C3":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                break;
              case "C4":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                this.$store.dispatch("file/putOneFile", result.object.fileId);
                break;
              //新建日程
              case "D9":
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              //修改日程名称
              case "D1":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //修改日程的开始时间
              case "D2":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //修改日程的结束时间
              case "D3":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程地点
              case "D4":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程备注
              case "D5":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程参与者
              case "D6":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程重复性
              case "D7":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //复制日程
              case "D10":
              case "D11":
              case "D12":
              case "D13":
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              // 添加标签
              case "D14":
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              case "E1":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.commit("file/bindingTag", {
                    tag: result.object.tag,
                    fileId: result.object.publicId
                  });
                } else if (result.object.publicType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 移除标签
              case "E2":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.commit("file/removeTag", {
                    tagId: result.object.tagId,
                    fileId: result.object.publicId
                  });
                } else if (result.object.publicType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 添加新标签并绑定
              case "E3":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.dispatch("file/putOneFile", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 发消息
              case "F1":
                if (result.object.type === "任务") {
                  this.$store.dispatch("task/publish", result.object.log);
                } else if (result.object.type === "schedule") {
                  this.$store.commit("schedule/msg", result.object.log);
                } else if (result.object.type === "文件") {
                  this.$store.commit("file/getMsg", result.object.log);
                } else if (result.object.type === "分享") {
                  this.$store.commit("share/sendMsg", result.object.log);
                } else if (result.object.type === "日程") {
                  this.$store.commit("schedule/msg", result.object.log);
                }
                break;
              case "G1":
                this.$store.commit("chat/pushMsg", {
                  chat: result.object,
                  userId: localStorage.userId
                });
                break;
              case "G2":
                this.$store.commit("chat/revoke", result.object);
                break;
              case "H1":
              case "H2":
              case "H3":
              case "H4":
              case "H5":
              case "H6":
              case "H7":
              case "H8":
                this.$store.dispatch("task/init", result.object);
                break;
              case "I1":
                this.$Notice.warning({
                  title: "这个项目已被移入回收站!",
                  duration: 0,
                  name: "project_del",
                  render: h => {
                    return h("div", [
                      h(
                        "Button",
                        {
                          style: {
                            color: "red",
                            fontSize: "14px"
                          },
                          on: {
                            click: this.clickHandler
                          }
                        },
                        "我知道啦!"
                      )
                    ]);
                  }
                });
                break;
            }
          });
        },
        err => {}
      );
    }
  }
};
</script>

<style scoped lang="less">
/deep/.fc-view {
  max-height: 80vh;
  overflow: auto;
}
.calendar-wrap {
  height: calc(100vh - 80px);
  overflow: hidden;
  width: 100%;
}
.calendar-header {
  width: 100%;
  height: 50px;
  position: relative;
  background-color: #eee;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 20px;
  .close {
    position: absolute;
    top: 12px;
    right: 20px;
    cursor: pointer;
    font-size: 22px;
    color: gray;
    z-index: 99;
    &:hover {
      color: #3da8f5;
    }
  }
}
.calendar-con {
  width: 1220px;
  position: absolute;
  top: 50px;
  left: 50%;
  margin-left: -610px;
  display: flex;
  .left-filter {
    width: 250px;
    flex: none;

    padding: 60px 10px 10px 10px;
    p {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .member-list {
      width: 100%;
      height: 34px;
      display: flex;
      align-items: center;
      cursor: pointer;
      background-color: #f5f5f5;
      padding: 0 15px;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        flex: none;
      }
      span {
        width: 100%;
        font-size: 14px;
        color: gray;
        &:hover {
          color: #3da8f5;
        }
      }
    }
  }
  .comp-full-calendar {
    width: 100%;
    background-color: transparent;
    padding-top: 0;
    /deep/ .full-calendar-header {
      height: 50px;
      font-size: 16px;
    }
    /deep/ .header-center {
      margin-left: -250px;
    }
  }
}
.create {
  position: fixed;
  background-color: white;
  padding: 5px 0;
  width: 200px;
  border-radius: 4px;
  box-shadow: 0 7px 21px rgba(0, 0, 0, 0.1);
  z-index: 10;
  li {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 14px;
    cursor: pointer;
    color: gray;
    &:hover {
      background-color: #f7f7f7;
    }
    i {
      margin-right: 10px;
    }
  }
}
.what-task {
  display: flex;
  align-items: center;
  width: 100%;
  span {
    flex: none;
  }
}
.taskInput {
  width: 100%;
  height: 60px;
  padding: 5px 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 16px 0;
}
.calendar-con {
  /deep/ .fc-header-toolbar {
    width: 1220px;
    margin-left: -250px;
    height: 50px !important;
    padding: 12px 0;
    .fc-center {
      margin-left: -130px;
    }
  }
}
</style>
