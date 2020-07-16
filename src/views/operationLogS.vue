<template>
  <div class="container">
    <div class="content">
      <div class="title">
        <div>操作日志</div>
        <div class="icon-content">
          <div class="r-jump">
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
            <DatePicker type="daterange" placement="bottom-end" :value="value2" format="yyyy/MM/dd"></DatePicker>
          </Col>
          <Col span="7">
            <div class="secrch-title">日期</div>
            <DatePicker type="daterange" placement="bottom-end" :value="value2" format="yyyy/MM/dd"></DatePicker>
          </Col>
          <Col span="7">
            <div class="secrch-title">操作类型</div>
            <Select v-model="model1">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </Col>
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
                  <img :src="item.image" alt />
                  <p class="userName">{{ item.userName }}</p>
                </div>
                <div class="userPhone">{{item.phone}}</div>
              </div>
            </Col>
            <Col span="4">{{ item.cz }}</Col>
            <Col span="8" class-name='log-content'>{{ item.content }}</Col>
            <Col span="4" offset="1">{{ item.gantt_project }}</Col>
            <Col span="3">{{ item.time }}</Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
export default {
  components: {
    Loading
  },
  data() {
    return {
      groupPeople: [
        {
          userName: "樊",
          phone: "18744404610",
          cz: "修改角色名称",
          content: "将什么人物「彩玉Z和sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss」？从简单了解移至快速入门",
          gantt_project: "新手引导",
          time: "2020年7月30日"
        },
        {
          userName: "美",
          phone: "18744404610",
          cz: "修改角色名称",
          content: "将什么人物「彩玉Z和」？从简单了解移至快速入门",
          gantt_project: "新手引导",
          time: "2020年7月30日"
        },
        {
          userName: "玲",
          phone: "18744404610",
          cz: "修改角色名称",
          content: "将什么人物「彩玉Z和」？从简单了解移至快速入门",
          gantt_project: "新手引导",
          time: "2020年7月30日"
        }
      ],
      value2: [new Date(), new Date()],
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model1: ""
    };
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
@import "../assets/css/operationLogS";
</style>