<template>
  <div class="contentPro">
    <div class="title">创建项目</div>
    <div class="pic"></div>
    <p class="myindex">为不同的事物建立各自的项目</p>
    <Input
      class="inputbox"
      v-model.trim="proName"
      :maxlength="20"
      placeholder="项目名称（必填）"
    />
    <Input
      type="textarea"
      :rows="2"
      class="inputbox"
      v-model="proDes"
      :maxlength="50"
      placeholder="项目简介（选填）"
    />
    <Select v-model="parentProject" filterable placeholder="选择父项目">
      <Option
        v-for="item in allProject"
        :value="item.projectId"
        :key="item.projectId"
        >{{ item.projectName }}</Option
      >
    </Select>
    <div class="create-project-time">
      <DatePicker
        placeholder="开始时间"
        :value="startTime"
        type="datetime"
        @on-change="startDate"
        :options="options1"
      ></DatePicker>
      <DatePicker
        placeholder="结束时间"
        :value="endTime"
        type="datetime"
        @on-change="endDate"
        :options="options2"
      ></DatePicker>
    </div>

    <Button
      class="submitBtn"
      type="primary"
      size="large"
      :loading="loading"
      :disabled="proName == '' || startTime == '' || endTime == ''"
      @click="create"
    >
      <span v-if="!loading">完成并创建</span>
      <span v-else>正在创建...</span>
    </Button>
  </div>
</template>
<script>
import { createProject } from "@/axios/api";
import { mapState } from "vuex";
export default {
  props: ["showProject"],
  data() {
    return {
      disabled: true,
      proName: "",
      proDes: "",
      loading: false,
      startTime: "",
      endTime: "",
      options1: {},
      options2: {},
      parentProject: "",
      orgId: this.$route.params.orgid
    };
  },
  watch: {
    showProject: function(val, oldVal) {
      if (!val) {
        this.loading = true;
        this.proName = "";
        this.proDes = "";
        this.startTime = "";
        this.endTime = "";
        this.loading = false;
        this.parentProject = "";
        this.options1 = {};
        this.options2 = {};
      }
    },
    deep: true
  },
  computed: {
    ...mapState("project", ["allProject"])
  },

  methods: {
    create() {
      if (!this.startTime) {
        this.$Notice.warning({
          title: "请选择项目开始时间"
        });
        return false;
      }

      if (!this.endTime) {
        this.$Notice.warning({
          title: "请选择项目结束时间"
        });
        return false;
      }

      let data = {
        projectName: this.proName,
        projectDes: this.proDes,
        parentId: this.parentProject,
        startTime: new Date(this.startTime).getTime(),
        endTime: new Date(this.endTime).getTime(),
        orgId: this.orgId
      };
      console.log(data);
      createProject(data).then(msg => {
        if (msg.result == 1) {
          this.loading = true;
          this.proName = "";
          this.proDes = "";
          this.startTime = "";
          this.endTime = "";
          this.options1 = {};
          this.options2 = {};
          this.loading = false;
          this.$emit("getNewList", "我创建的项目");
          this.$emit("hideModal");
        }
        //创建成功后关闭modal this.$emit("hideModal")  再次请求获取项目列表
      });
    },
    startDate(date) {
      this.startTime = date;
      this.options2 = {
        disabledDate(date1) {
          return date1.valueOf() < new Date(date).getTime();
        }
      };
    },
    endDate(date) {
      this.endTime = date;
      this.options1 = {
        disabledDate(date1) {
          return date1.valueOf() > new Date(date).getTime() - 86400000;
        }
      };
    }
  },
  destoryed: function() {
    this.loading = true;
    this.proName = "";
    this.proDes = "";
    this.startTime = "";
    this.endTime = "";
    this.loading = false;
    this.parentProject = "";
  }
};
</script>
<style scoped lang="less">
// /deep/.ivu-input-icon{
//   padding-top:10px;
// }
.contentPro {
  overflow: hidden;
  .title {
    padding: 10px 10px 15px 10px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
  }
  .pic {
    width: 113px;
    height: 90px;
    margin: 30px auto;
    background: url("../assets/images/createProject.png");
    background-size: 113px 90px;
  }
  .myindex {
    text-align: center;
    color: gray;
    margin-bottom: 25px;
    font-size: 14px;
  }
  /deep/.ivu-input {
    height: 40px !important;
    line-height: 30px;
    font-size: 14px;
  }
  .inputbox {
    width: 320px;
    display: block;
    margin: 15px auto;
  }
  .submitBtn {
    display: block;
    width: 320px;
    margin: 20px auto;
  }
}
.create-project-time {
  display: flex;
  justify-content: space-between;
  width: 320px;
  margin: 15px auto;
}
.create-project-time .ivu-date-picker {
  width: 150px !important;
}
</style>
