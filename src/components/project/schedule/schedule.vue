<template>
  <div class="schedule">
    <div class="main">
      <div class="handler" @click="addSchedule = true">
        <a class="link-add"> <Icon type="md-add-circle" size="20" /> 添加日程 </a>
      </div>
      <div class="loading" v-if="loading">
        <Spin size="large" fix></Spin>
      </div>
      <loading v-if="load"></loading>
      <div class="handler" v-for="(i, k) in schedules" :key="k">
        <div class="title">{{ new Date(i.startTime).Format("MM月dd日") }}</div>
        <div class="item" @click="showEditRC(i)">
          <div class="leftTime">
            <p>{{ new Date(i.startTime).Format("yyyy-MM-dd") }}</p>
            <p>-</p>
            <p>{{ new Date(i.endTime).Format("yyyy-MM-dd") }}</p>
          </div>
          <div class="offside">
            <p class="headline">{{ i.scheduleName }}</p>
            <div class="participant" v-if="i.joinInfo">
              <p class="cyu">参与者 · {{ i.joinInfo.length }}</p>
              <p class="user">
                <img :src="m.defaultImage" v-for="(m, n) in i.joinInfo" :key="n" alt="" />
                <Icon type="plus-circled"></Icon>
              </p>
            </div>
          </div>
          <div class="zoom">
            <Button type="primary" v-if="i.meetingCode" @click.stop="enterZoom(i.meetingCode)">进入会议</Button>
            <Button type="primary" v-else @click.stop="openZoom(i.scheduleId)">开启会议</Button>
          </div>
        </div>
      </div>
      <div class="handler calendar">
        <p class="center">
          <Icon type="md-calendar" size="40" />
        </p>
        添加新日程，安排会议或其他活动，添加参与者即可通知其他成员参加。
      </div>
    </div>
    <AddSchedule @input="addSchedule = false" v-model="addSchedule" class="modalclass">
      <span slot="projectName">{{ projectName ? projectName : "添加日程" }}</span>
    </AddSchedule>
    <Modal class-name="vertical-center-modal" v-model="editrc" :footer-hide="true" transfer class="modalclass">
      <editRicheng v-if="editrc" @close="closeModal"></editRicheng>
    </Modal>
  </div>
</template>
<script>
import AddSchedule from "./AddSchedule.vue";
import editRicheng from "./EditRicheng.vue";
import { schedules, createMeeting, joinMeeting, createUser } from "@/axios/api";
import userList from "@/components/resource/userList.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "",
  components: { AddSchedule, userList, editRicheng },
  data() {
    return {
      addSchedule: false,
      editrc: false,
      load: false,
      richengData: null,
      parameter: {
        projectId: this.$route.params.id,
      },
      meetingCode: "",
    };
  },
  computed: {
    ...mapState("schedule", ["loading", "schedules"]),
    ...mapState("project", ["projectName"]),
  },
  methods: {
    ...mapActions("schedule", ["init", "getScheduleById"]),
    ...mapMutations("schedule", ["oneSchedule"]),
    // 编辑日程
    showEditRC(item) {
      // this.load=true
      this.editrc = true;
      this.getScheduleById(item.scheduleId);
      // getRicheng(item.scheduleId).then(res => {
      //   this.oneSchedule(res.data);
      //   // this.load=false
      // })
    },
    closeModal() {
      this.editrc = false;
    },
    openZoom(scheduleId) {
      //window.open("https://zoom.us/signin");
      createUser(localStorage.userId, localStorage.companyId).then((res) => {
        if (res.result == 1) {
          createMeeting(localStorage.userId, "会议", scheduleId, this.$route.params.id).then((res) => {
            window.open("https://work.aldbim.com/detail?code=" + res.meeting.meetingCode + "&userId=" + localStorage.userId);
          });
        }
      });
    },
    enterZoom(meetingCode) {
      window.open("https://work.aldbim.com/detail?code=" + meetingCode + "&userId=" + localStorage.userId);
    },
  },
  mounted() {
    this.init(this.parameter);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.modalclass {
  .ivu-modal-body {
    padding: 0 !important;
  }
}

.schedule {
  position: absolute;
  overflow-x: hidden;
  overflow-y: scroll;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  background-color: rgb(244, 244, 244);

  .loading {
    height: 300px;
    width: 100%;
    position: relative;
  }
  .main {
    width: 1100px;
    margin: 0 auto;
    padding-bottom: 50px;
    .handler {
      background-color: #fff;
      box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.0470588);
      padding: 13px;
      text-align: center;
      font-size: 16px;
      margin-top: 20px;
      .title {
        text-align: left;
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(244, 244, 244);
        font-size: 18px;
      }
      .item {
        display: flex;
        width: 100%;
        cursor: pointer;
        .leftTime {
          width: 180px;
          flex: none;
          color: #a6a6a6;
          padding-top: 15px;
          p {
            font-size: 14px;
          }
        }
        .offside {
          margin-left: 30px;
          width: 100%;
          text-align: left;
          .headline {
            margin-top: 15px;
            margin-bottom: 15px;
          }
          .participant {
            .cyu {
              font-size: 14px;
              color: grey;
              font-weight: 700;
            }
            .user {
              text-align: left;
              padding-top: 10px;
              img {
                width: 24px;
                height: 24px;
                float: left;
                margin-right: 10px;
                border-radius: 50%;
              }
              .ivu-icon {
                font-size: 24px;
                float: left;
                color: #3da8f5;
              }
            }
          }
        }
      }
      &.calendar {
        color: #a6a6a6;
        font-size: 14px;
        padding: 25px 15px 35px;
        p {
          font-size: 40px;
        }
      }
    }
  }
}
.zoom {
  line-height: 109px;
}
</style>
