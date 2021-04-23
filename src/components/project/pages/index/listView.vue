<template>
  <div class="list-view-wrap">
    <div class="list-view">
      <Loading v-if="loading"></Loading>

      <div class="list-header list-view-con">
        <Row style="width:100%;" justify="end" type="flex">
          <Col span="1">
          </Col>
          <Col span="17">
          <div>任务名</div>
          </Col>
          <Col span="4">
          <div>任务结束时间</div>
          </Col>
          <!-- <Col span="4">
          <div>父任务</div>
          </Col> -->
          <Col span="2">
          <div>任务执行者</div>
          </Col>
        </Row>
      </div>
      <header class="list-view-head">共 {{ listData.length ? listData.length : 0 }} 个任务</header>
      <div class="list-view-con" v-for="(item, index) in listData" :key="index"
        @click="initTask(item.parentTask ? item.parentTask.taskId : item.taskId)">
        <Row style="width:100%;">
          <Col span="1">
          <Checkbox class="check-box" v-model="single" disabled size="default"></Checkbox>
          </Col>
          <Col span="17">
          <div class="task-con">
            <Tooltip class="task-name" width="300" placement="bottom-start">
              <span slot="content" style="white-space: normal;">{{item.taskName}}</span>
              <div class="task-name">{{ item.taskName }}</div>
            </Tooltip>
          </div>
          </Col>
          <Col span="4">
          <div class="task-time">
            <Time v-if="item.endTime" :time="item.endTime" :interval="60" />
            <div v-else>-</div>
          </div>
          </Col>

          <!-- <Col span="4">
          <Tooltip v-if="!item.parentTask" :content="item.taskMenuName">
            <span class="task-menu">{{ item.taskMenuName }}</span>
          </Tooltip>
          <Tooltip placement="top-end" v-if="item.parentTask" class="long-task-menu"
            :content="item.parentTask.taskName"> 属于任务：{{ item.parentTask.taskName }} </Tooltip>
          </Col> -->

          <Col span="2">
          <img v-if="item.executorImg" class="zxz-touxiang" :src="item.executorImg" alt="" />
          <Icon v-else type="md-contact" class="zxz-touxiang" size="24" />
          </Col>
        </Row>
      </div>
    </div>
    <!-- 点击列表出来的弹框。编辑列表 -->
    <Modal v-model="showModal" class="myModal">
      <my-modal v-if="showModal"></my-modal>
    </Modal>
  </div>
</template>

<script>
  import {
    getListView
  } from "@/axios/api2";
  import {
    selectTaskByExamples
  } from "@/axios/api";
  import myModal from "./components/EditList";
  import {
    mapMutations
  } from "vuex";
  export default {
    name: "listView",
    components: {
      myModal
    },
    props: ["viewId", "taskGroupId"],
    data() {
      return {
        single: "",
        projectId: this.$route.params.id,
        listData: [],
        showModal: false,
        loading: false,
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      ...mapMutations("task", ["setTaskId"]),
      // 初始化
      init() {
        if (this.viewId == null) {
          this.loading = true;
          getListView(this.projectId).then((res) => {
            if (res.result) {
              this.listData = res.data;
              this.loading = false;
            }
          });
        } else {
          selectTaskByExamples(this.viewId, this.taskGroupId, this.projectId).then((res) => {
            this.listData = res.data;
            this.loading = false;
          });
        }
      },
      //打开任务详情
      initTask(taskId) {
        this.showModal = true;
        this.setTaskId(taskId);
      },
    },
    watch: {
      viewId(val) {
        this.init();
      },
    }
  };
</script>

<style scoped lang="less">
  .list-view-wrap {
    width: 100%;
    height: 100%;
    background-color: rgb(245, 245, 245);
    padding: 20px 0;

    .list-view {
      width: 1000px;
      max-height: 100%;
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: white;

      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #cecece;
      }

      .list-view-head {
        width: 100%;
        height: 44px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        color: #a6a6a6;
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }

  .list-view-con {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 24px;
    cursor: pointer;

    .check-box {
      flex: none;
      margin-right: 16px;
    }

    .task-con {
      // width: 636px;
      display: flex;
      align-items: center;
      margin-right: 40px;

      .task-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        /deep/.ivu-tooltip-rel {
          width: 100%;
        }
      }
    }

    .task-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex-shrink: 1;
    }

    .task-time {
      width: 150px;
      flex: none;
      color: #3da8f5;
    }

    .task-menu {
      margin-left: 20px;
      width: 60px;
      color: #a6a6a6;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: none;
    }

    .zxz-touxiang {
      flex: none;
      width: 24px;
      height: 24px;
      margin-left: 20px;
    }
  }

  .long-task-menu {
    flex: none;
    width: 200px;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #a6a6a6;
    margin-left: 20px;
  }

  .list-header {
    font-weight: 900;
    font-size: 14px;
  }
</style>