<template>
  <div class="project-main">
    <header-project @showBox="showBox" :show="show" :data="activeHeaderTag"></header-project>
    <!-- 项目成员 -->
    <ProjectMember v-transfer :class="{active:show==1,animate}" @hideBox="hideBox"></ProjectMember>
    <!-- 项目菜单 -->
    <ProjectMenu v-transfer :class="{activeMenu:show==2,animate}" @hideMenuBox="hideBox"></ProjectMenu>

    <ProjectView v-transfer :class="{activeMenu:show==3,animate}" @hideMenuBox="hideBox"></ProjectView>

    <div class="router-view-box" :class="{zhanWei:show==1||show==2||show==3}">
      <router-view />
    </div>
  </div>
</template>

<script>
import MyHeader from "@/components/public/HeaderProject.vue";
import ProjectMember from "@/components/public/ProjectMember.vue";
import ProjectMenu from "@/components/public/ProjectMenu.vue";
import ProjectView from '../../components/public/ProjectView.vue'
import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
  name: "",
  components: {
    "header-project": MyHeader,
    ProjectMember,
    ProjectMenu,
    ProjectView
  },
  data() {
    return {
      show: -1,
      animate: true,
      activeHeaderTag: -1
    };
  },
  mounted() {
    this.initSocket(this.$route.params.id);
  },
  methods: {
    showBox(i) {
      let old = this.show;
      this.show = old == i ? -1 : i;
      this.animate = old == -1;
      this.activeHeaderTag = -1;
    },
    hideBox() {
      this.animate = true;
      this.show = -1;
    },
    // showMemberBox () {
    //   this.show=!this.show
    //   this.showMenu = false
    //   this.place = this.show
    // },
    // showMenuBox () {
    //    this.place = false
    //   this.showMenu=!this.showMenu
    //   this.show = false
    //   this.place = this.showMenu
    // }
    initSocket(id) {
      // 建立连接对象
      var socket = new SockJS("http://192.168.3.189:8090/webSocketServer"); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/topic/${id}`, msg => {
            var result = JSON.parse(msg.body);
            switch (result.type) {
              case "A1":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A2":
                this.$store.dispatch("task/deleteTask", result.object)
                break;
              case "A3":
                result.object.task.taskStatus = true
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "taskStatus" })
                break;
              case "A4":
                result.object.task.taskStatus = false
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "taskStatus" })
                break;
              case "A5":
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "taskName" })
                break;
              case "A6":
                this.$store.commit("task/changeExecutor", result.object)
                break;
              case "A7":
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "startTime" })
                break;
              case "A8":
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "endTime" })
                break;
              case "A9":
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "repeat" })
                break;
              case "A12":
                this.$store.dispatch("task/changeProperty", { task: result.object.task, property: "priority" })
                break;
              case "A13":
                this.$store.dispatch("task/updateChildTask", result.object.task)
                break;
              case "A14":
                this.$store.dispatch("task/updateJoinInfo", result.object.members)
                break;
              case "A15":
                this.$store.dispatch("task/copyTask", result.object.task)
                break;
              case "A16":
                if (result.object.task.taskStatus === '完成') {
                  result.object.task.taskStatus = true
                } else {
                  result.object.task.taskStatus = false
                }
                this.$store.dispatch("task/moveTask", result.object.task)
                break;
              case "A17":
                this.$store.dispatch("task/recycle", result.object.task)
                break;
                // 关联
              case "A28":
                if (result.object.fromType === '任务') {
                  this.$store.commit("task/bind", result.object)
                }else if (result.object.fromType === '文件') {
                  this.$store.commit("file/relevance", result.object)
                  }
                break;
                // 取消关联
              case "A29":
                if (result.object.fromType === '任务') {
                  this.$store.commit("task/cancleRelation", result.object)
                }else if (result.object.fromType === '文件') {
                  this.$store.commit("file/cancelRelevance", result.object)
                }
                break;
              case "A30":
                this.$store.dispatch("task/loadFile", result.object)
                break;
                    // 创建文件夹
              case "C1":
                this.$store.commit("file/createWjj",result.object);
                // 上传文件
              case "C2":
                this.$store.dispatch("file/upFiles",result.object);
              // 修改文件名称
              case "C11":
                this.$store.commit("file/changeFileName", result.object)
                break;
                // 复制文件
              case "C10":
                this.$store.commit("file/copyFile",result.object)
                break;
              // 移动文件
              case "C12":
                this.$store.commit("file/removeFile", result.object)
                break;
                // 文件移到回收站
              case "C13":
                this.$store.commit("file/putRecycle", result.object)
                break;
                // 更改 文件隐私模式
              case "C8":
                this.$store.dispatch("file/putMimi", result.object)
                break;
                // 改变文件参与者
              case "C9":
                this.$store.commit("file/player", result.object)
                break;
              case "C3":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });

                break;
                // 添加标签
              case "E1":
                if (result.object.publicType === '任务') {
                  this.$store.dispatch("task/bindingTag", { tag: result.object.tag, taskId: result.object.publicId })
                } else if (result.object.publicType === '文件') {
                  this.$store.commit("file/bindingTag", { tag: result.object.tag, fileId: result.object.publicId })
                }
                break;
                // 移除标签
              case "E2":
                if (result.object.publicType === '任务') {
                  this.$store.dispatch("task/removeTag", { tagId: result.object.tagId, taskId: result.object.publicId })
                }else if (result.object.publicType === '文件') {
                  this.$store.commit("file/removeTag", { tagId: result.object.tagId, fileId: result.object.publicId })
                }
                // 发消息
              case "F1":
                if (result.object.type === '任务') {
                  this.$store.dispatch("task/publish", result.object.log)
                } else if (result.object.type === 'schedule') {
                  this.$store.commit("schedule/msg", result.object.log)
                } else if (result.object.type === '文件') {
                  this.$store.commit("file/getMsg", result.object.log)
                }
                break;
              case "G1":
                this.$store.commit("chat/pushMsg", { chat: result.object, userId: localStorage.userId })
                break;
              case "G2":
                this.$store.commit("chat/revoke", result.object)
                break;
            }
          });
        },
        err => { }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.project-main {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 48px;
  overflow: auto;
  background-color: #fff;
  overflow: hidden;
  .router-view-box {
    height: calc(100% - 50px);
  }
  .router-view-box.zhanWei {
    .column-main {
      right: 350px;
    }
  }
}
</style>
