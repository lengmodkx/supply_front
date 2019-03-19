<template>
  <div class="schedule">
    <div class="main">
      <div class="handler" @click="addSchedule=true">
        <a class="link-add">
          <Icon type="plus-circled"></Icon> 添加日程
        </a>
      </div>
      <!-- <div class="handler">
        <div class="title">今天 · 9月13日</div>
        <div class="item">
          <div class="leftTime">
            <p>（全天）</p>
          </div>
          <div class="offside">
            <p class="headline">标题</p>
            <div class="participant">
              <p class="cyu">参与者 · 1</p>
              <p class="user">
                <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="">
                <Icon type="plus-circled"></Icon>
              </p>
            </div>
          </div>
        </div>
      </div> -->
      <div class="loading" v-if='loading'>
        <Spin size="large" fix></Spin>
      </div>
      <div class="handler" v-for="(i, k) in data" :key="k">
        <div class="title">{{new Date(i.startTime).Format('MM月dd日')}}</div>
        <div class="item">
          <div class="leftTime">
            <p>{{new Date(i.startTime).Format('yyyy-MM-dd hh:mm')}}</p>
            <p>-</p>
            <p>{{new Date(i.endTime).Format('yyyy-MM-dd hh:mm')}}</p>
          </div>
          <div class="offside">
            <p class="headline">{{i.scheduleName}}</p>
            <div class="participant">
              <p class="cyu">参与者 · {{i.memberIds.split(',').length}}</p>
              <p class="user">
                <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+m.defaultImage" v-for="m in i.joinInfo" v-if="i.joinInfo" :key="m" alt="">
                <!-- <Icon type="plus-circled"></Icon> -->
                <userList :id='parameter.projectId'></userList>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="handler calendar">
        <p class="center">
          <Icon type="calendar"></Icon>
        </p>
        添加新日程，安排会议或其他活动，添加参与者即可通知其他成员参加。
      </div>
    </div>
    <AddSchedule v-model="addSchedule" :id="parameter.projectId"></AddSchedule>
  </div>
</template>

<script>
import AddSchedule from '../../public/AddSchedule.vue'
import ajax from '@/axios/fetch'
import api from '@/axios/url'
import userList from '@/components/resource/userList.vue'
export default {
  name: '',
  data() {
    return {
      addSchedule: false,
      data: [],
      loading: true,
      parameter: {
        projectId: this.$route.params.id
      }
    }
  },
  components: { AddSchedule, userList },
  methods: {
    getData() {
      ajax({ url: api.schedules, method: 'GET', params: this.parameter }).then(res => {
        console.log(res)
        this.loading = false
        this.data = res.after
      })
    }
  },
  mounted() {
    console.log(this.$route)
    this.getData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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
      cursor: pointer;
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
        .leftTime {
          width: 180px;
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
</style>
