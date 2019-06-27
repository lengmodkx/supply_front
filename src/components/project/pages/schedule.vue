<template>
  <div class="schedule">
    <div class="main">
      <div class="handler" @click="addSchedule=true">
        <a class="link-add">
          <Icon type="plus-circled"></Icon> 添加日程
        </a>
      </div>
      <div class="loading" v-if='loading'>
        <Spin size="large" fix></Spin>
      </div>
      <loading v-if="load"></loading>
      <div class="handler" v-for="(i, k) in schedules" :key="k">
        <div class="title">{{new Date(i.startTime).Format('MM月dd日')}}</div>
        <div class="item" @click="showEditRC(i)">
          <div class="leftTime">
            <p>{{new Date(i.startTime).Format('yyyy-MM-dd')}}</p>
            <p>-</p>
            <p>{{new Date(i.endTime).Format('yyyy-MM-dd')}}</p>
          </div>
          <div class="offside">
            <p class="headline">{{i.scheduleName}}</p>
            <div class="participant" v-if="i.joinInfo">
              <p class="cyu">参与者 · {{i.joinInfo.length}}</p>
              <p class="user">
                <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+m.defaultImage" v-for="(m,n) in i.joinInfo" :key="n" alt="">
                <Icon type="plus-circled"></Icon>
                <!--<userList :id='parameter.projectId'></userList>-->
              </p>
            </div>
          </div>
          <div @click.stop="openZoom" class="zoom">
            <Icon type="md-videocam" size="32" color="#3da8f5" />
          </div>
        </div>
      </div>
      <div class="handler calendar">
        <!-- <p class="center">
          <Icon type="calendar"></Icon>
        </p> -->
        添加新日程，安排会议或其他活动，添加参与者即可通知其他成员参加。
      </div>
    </div>
    <AddSchedule @input="addSchedule=false" v-model="addSchedule" :id="parameter.projectId" :projectTypes="richengData">
      <span slot="projectName">{{projectName?projectName:'添加日程'}}</span>
    </AddSchedule>
    <Modal class-name="vertical-center-modal" v-model="editrc" :footer-hide='true' transfer>
      <editRicheng @close="closeModal"></editRicheng>
    </Modal>

  </div>
</template>

<script>
import AddSchedule from "../../public/AddSchedule.vue";
import loading from "../../public/common/Loading";
import editRicheng from "../../public/common/EditRicheng";
import { schedules } from "@/axios/api";
import userList from "@/components/resource/userList.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "",
  components: { AddSchedule, userList, editRicheng, loading },
  data() {
    return {
      addSchedule: false,
      editrc: false,
      load: false,
      richengData: null,
      parameter: {
        projectId: this.$route.params.id
      }
    };
  },
  computed: {
    ...mapState("schedule", ["loading", "schedules"]),
    ...mapState("project", ["projectName"])
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
      //   console.log(res.data)
      //   this.oneSchedule(res.data);
      //   // this.load=false
      // })
    },
    closeModal() {
      this.editrc = false;
    },
    openZoom() {
      window.open("https://zoom.us/signin");
    }
  },
  mounted() {
    console.log(this.$route);
    this.init(this.parameter);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.ivu-modal-body {
  padding: 0 !important;
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
