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
            <Col span="4">{{ item.a }}</Col>
            <Col span="4">{{ item.b }}</Col>
            <Col span="4">
              <div class="group-people-con">
                <div class="con-top">
                  <img :src="item.memberImg" alt />
                  <p class="userName">{{ item.memberName }}</p>
                </div>
              </div>
            </Col>
            <Col span="4">{{ item.c }}</Col>
            <Col span="4">
              <Tooltip placement="top" transfer>
                <span class="conditions">查看导出条件</span>
                <div slot="content">
                  <p>日期：2019/10/10-2020/10/10</p>
                  <p>成员：全部</p>
                </div>
              </Tooltip>
            </Col>
            <Col span="4" >
              <div class="iconContent">
                <Tooltip placement="top" content="下载" transfer>
                  <Icon type="ios-download" size="20" color="#8a8a8a" />
                </Tooltip>
                <Tooltip placement="top" content="删除" transfer>
                  <Icon type="ios-trash" size="20" color="#8a8a8a" />
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
import { getLoglist } from "@/axios/api";
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      groupPeople: [
        { a: "11", b: "bb", c: "cc", d: "dd", memberImg: "", memberName: "12" }
      ]
    };
  },
  computed: {},
  mounted() {
    // this.getUserList();
  },
  methods: {
    getUserList() {
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result === 1) {
          this.groupPeople = res.data;
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