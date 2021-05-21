<template>
  <div class="creat-list">
    <Input v-model="textarea" maxlength="100" show-word-limit type="textarea" placeholder="输入标题以新建任务" ref="textarea" />
    <div class="creat-bottom">
      <div></div>
      <div>
        <Button :disabled="textarea == ''" @click="createTask(1)">完成并创建下一个</Button>
        <Button :disabled="textarea == ''" type="primary" @click="createTask(2)">完成</Button>
      </div>
    </div>

  </div>
</template>
<script>
  import {
    createTemplateTask
  } from "@/axios/template.js";
  import {
    mapState,
    mapActions,
    mapMutations
  } from "vuex";
  export default {
    props: ['projectId', 'taskMenuId', 'taskGroupId'],
    data() {
      return {
        textarea: "",
      };
    },
    mounted() {
      this.$refs.textarea.focus();
    },
    methods: {
      // 创建任务
      createTask(type) {
        console.log(type)
        if (this.textarea == "") {
          this.$Message.error("输入标题以新建任务");
          return;
        }
        this.isCreateTask = true; //打开loading
        let data = {
          taskName: this.textarea,
          relationId: this.taskMenuId,
        };
        createTemplateTask(data).then(res => {
          if (res.result === 1) {
            this.textarea = "";
            this.isCreateTask = false;
            if (type == '2') {
              this.$emit("close");
              this.$emit('success')
            }
          }
        });
      },
      popHide() {
        this.searchvalue = "";
      },


    },
    created: function () {

      console.log(this.userInfo)

    }
  };
</script>
<style scoped lang="less">
  .creat-list {
    line-height: 26px;

    textarea {
      width: 100%;
      min-height: 60px;
      padding: 0px;
      border: none;
      border-radius: 3px;
    }

    .img-box {
      display: flex;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 10px;
      }

      padding:10px 0px;
    }

    .creatMember {
      background: #ff0000;
      display: flex;
      align-items: center;
    }

    .list-head {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 10px;
      float: left;
    }

    .creat-bottom {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;

      button {
        margin-left: 10px;
      }

      // .creat-button{
      //   padding:2px 10px;
      //   border:1px solid #bfbfbf;
      //   color: #bfbfbf;
      //    border-radius: 5px;
      // }
    }


  }
</style>