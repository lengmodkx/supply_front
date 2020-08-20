<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>操作日志</div>
        <div class="icon-content">
          <div class="r-jump" @click="expApplication">
            <Icon type="md-download" size="20" />
            <span>导出</span>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="search">
        <Row :gutter="20">
          <Col span="7">
            <div class="secrch-title">日期</div>
            <DatePicker
              type="daterange"
              placement="bottom-end"
              v-model="timeValue"
              format="yyyy/MM/dd"
              @on-change="screen"
              placeholder="选择开始日期和结束日期"
            ></DatePicker>
          </Col>
          <Col span="7">
            <div class="secrch-title">成员</div>
            <Select v-model="memberValue" @on-change="screen">
              <Option
                v-for="item in peopleList"
                :value="item.userEntity.userId"
                :key="item.userEntity.userId"
              >{{ item.userEntity.userName }}</Option>
            </Select>
          </Col>
          <!-- <Col span="7">
            <div class="secrch-title">操作类型</div>
            <Select v-model="model1">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Col>-->
        </Row>
      </div>
      <div class="table-content">
        <Row class="titleRow">
          <Col span="4">用户</Col>
          <Col span="4">操作</Col>
          <Col span="8">内容</Col>
          <Col span="4" offset="1">项目</Col>
          <Col span="3">时间</Col>
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
            <Col span="4">
              <div class="group-people-con">
                <div class="con-top">
                  <img :src="item.memberImg" alt />
                  <p class="userName">{{ item.memberName }}</p>
                </div>
                <div class="userPhone">{{item.phone}}</div>
              </div>
            </Col>
            <Col span="4">{{ item.content }}</Col>
            <Col span="8" class-name="log-content">{{ item.content }}</Col>
            <Col span="4" offset="1">{{ item.projectName }}</Col>
            <Col span="3">{{ $moment(item.createTime).format("YYYY-MM-DD") }}</Col>
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
import axios from "axios";
import { initOrgMember } from "@/axios/companyApi";
import { getLoglist, ExportApplication } from "@/axios/api";
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      groupPeople: [],
      timeValue: [new Date(),new Date()],
      cityList: [],
      model1: "",
      peopleList: [],
      memberValue: "" //成员筛选
    };
  },
  computed: {},
  mounted() {
    this.getUserList();
    this.screen();
  },
  methods: {
    getUserList() {
      initOrgMember(localStorage.companyId).then(res => {
        if (res.result === 1) {
          this.peopleList = res.data;
        }
      });
    },
    screen() {
      this.loading = true;
      let data = {
        memberId: this.memberValue,
        startTime: this.timeValue[0]?this.timeValue[0].getTime():'',
        endTime: this.timeValue[1]?this.timeValue[1].getTime():''
      };
      getLoglist(localStorage.companyId, data).then(res => {
        if (res.result == 1) {
          this.groupPeople = res.data;
          this.loading = false;
        }
      });
    },
    expApplication() {
      ExportApplication(
        localStorage.companyId,
        this.memberValue,
        this.timeValue[0].getTime(),
        this.timeValue[1].getTime()
      ).then(res => {
        if (res.result == 1) {
          this.$Message.success("导出请求成功，前往导出申请查看!");
        }
      });
    },
    
  }
};
</script>
<style lang="less" scoped>
@import "../assets/css/operationLogS";
</style>