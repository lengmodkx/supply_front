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
    <Button
      class="submitBtn"
      type="primary"
      size="large"
      :disabled="proName==''"
      @click="create"
    >完成并创建</Button>
  </div>
</template>
<script>
import { createProject } from "@/axios/api";
export default {
  data() {
    return {
      disabled: true,
      proName: "",
      proDes: ""
    };
  },
  methods: {
    create() {
      let data = {
        projectName: this.proName,
        projectDes: this.proDes
      };

      createProject(data).then(msg => {
        if (msg.result == 1) {
          this.$emit("hideModal");
          this.proName = "";
          this.proDes = "";
          this.$emit("getNewList");
        }
        //创建成功后关闭modal this.$emit("hideModal")  再次请求获取项目列表
      });
    }
  }
};
</script>
<style scoped lang="less">
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
</style>

