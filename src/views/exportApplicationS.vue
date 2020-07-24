<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>导出申请</div>
        <div class="line"></div>
      </div>
      <div class="table-content">
        <Row class="titleRow">
          <Col span="4">提交时间</Col>
          <Col span="4">完成时间</Col>
          <Col span="4">申请人</Col>
          <Col span="4">状态</Col>
        </Row>
        <div class="scroll-box">
          <Loading v-if="loading"></Loading>
          <Row
            type="flex"
            justify="space-between"
            class-name="group-people"
            v-for="(item, index) in groupPeople"
            :key="index"
          >
            <Col span="4">{{ $moment(item.commitTime).format("YYYY-MM-DD HH:mm") }}</Col>
            <Col span="4">{{ $moment(item.completeTime).format("YYYY-MM-DD HH:mm") }}</Col>
            <Col span="4">
              <div class="group-people-con">
                <div class="con-top">
                  <img :src="item.commitImg" alt />
                  <p class="userName">{{ item.commitName }}</p>
                </div>
              </div>
            </Col>
            <Col span="4">{{ item.status==0?'未完成':'已完成' }}</Col>
            <Col span="4">
              <Tooltip placement="top" transfer max-width="300">
                <span class="conditions">查看导出条件</span>
                <div slot="content">
                  <p>日期：{{ $moment(item.conditionStart).format("YYYY年MM月DD日") }}-{{ $moment(item.conditionEnd).format("YYYY年MM月DD日") }}</p>
                  <p>成员：{{item.exportName?item.exportName:'全部'}}</p>
                </div>
              </Tooltip>
            </Col>
            <Col span="4">
              <div class="iconContent">
                <Tooltip placement="top" content="下载" transfer>
                  <!-- <a
                    target="_blank"
                    download="成员日志信息表.xlsx"
                    href="http://192.168.3.254:8091/api/logs/exportLogByExcel?orgId=597176ae648841b688e2c7abe3aecdec&id=9de4b92b464943d99ea7680ebbe59de6"
                  >
                    <Icon type="ios-download" size="20" color="#8a8a8a" />
                  </a> -->
                  <Icon type="ios-download" size="20" color="#8a8a8a" @click="exportBtn(item)" />
                </Tooltip>
                <Tooltip placement="top" content="删除" transfer>
                  <Icon type="ios-trash" size="20" color="#8a8a8a" @click="deleteLog(item)" />
                </Tooltip>
              </div>
            </Col>
          </Row>
          <div class="noList" v-if="groupPeople.length == 0 ">
            <img src="../assets/images/noproject-new.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import { getExportInfo, deleteExpLog, expUserLog } from "@/axios/api";
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      groupPeople: []
    };
  },
  computed: {},
  mounted() {
    this.loading = true;
    this.getList();
  },
  methods: {
    getList() {
      getExportInfo().then(res => {
        if (res.result === 1) {
          this.groupPeople = res.data;
          this.loading = false;
        }
      });
    },
    exportBtn(item) {
      // expUserLog(localStorage.companyId, item.id).then(res => {
      //   console.log(res);
        
      // });
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_URL;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_URL;
      } else {
        url = "/api";
      }
      console.log(url)
      console.log(window.location)
      // http://192.168.3.254:8091/api/logs/exportLogByExcel?orgId=597176ae648841b688e2c7abe3aecdec&id=9de4b92b464943d99ea7680ebbe59de6
      window.location.href = url + "/logs/exportLogByExcel?orgId=" + localStorage.companyId+'&id='+item.id;
      // window.location.href=
    },
    deleteLog(item) {
      this.loading = true;
      deleteExpLog(item.id).then(res => {
        if (res.result === 1) {
          this.$Message.success("删除成功!");
          this.getList();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/operationLogS";
.table-content {
  margin-top: 20px;
}
.scroll-box {
  .ivu-tooltip {
    margin-right: 20px;
  }
}
.conditions {
  color: #8c8c8c;
}
.group-people:hover {
  .iconContent {
    display: flex;
  }
}
.iconContent {
  display: none;
}
</style>