<template>
  <div class="project-main">
    <header-project @showBox="showBox" :show="show" :data="activeHeaderTag"></header-project>
    <!-- 项目成员 -->
    <ProjectMember v-transfer :class="{active:show==1,animate}" @hideBox="hideBox"></ProjectMember>
    <!-- 项目菜单 -->
    <ProjectMenu v-transfer :class="{activeMenu:show==2,animate}" @hideMenuBox="hideBox"></ProjectMenu>

    <div class="router-view-box" :class="{zhanWei:show==1||show==2}">
      <router-view />
    </div>
  </div>
</template>

<script>
import MyHeader from "@/components/public/HeaderProject.vue";
import ProjectMember from "@/components/public/ProjectMember.vue";
import ProjectMenu from "@/components/public/ProjectMenu.vue";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
  name: "",
  components: {
    "header-project": MyHeader,
    ProjectMember,
    ProjectMenu
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
      var socket = new SockJS("http://192.168.31.238:8090/webSocketServer"); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
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
                this.$store.dispatch("task/deleteTask",result.object)
                break;
              case "A3":
                result.object.task.taskStatus = true
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"taskStatus"})
                    break;
              case "A4":
                result.object.task.taskStatus = false
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"taskStatus"})
                    break;
              case "A5":
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"taskName"})
                break;
              case "A7":
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"startTime"})
                break;
              case "A8":
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"endTime"})
                break;
              case "A9":
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"repeat"})
                break;
              case "A12":
                this.$store.dispatch("task/changeProperty",{task:result.object.task,property:"priority"})
                break;
              case "A13":
                  this.$store.dispatch("task/updateChildTask",result.object.task)
                break;
              case "A14":
                this.$store.dispatch("task/updateJoinInfo",result.object.members)
                break;
                case "A15":
                  this.$store.dispatch("task/copyTask",result.object.task)
                break;
              case "A16":
                if(result.object.task.taskStatus === '完成'){
                  result.object.task.taskStatus = true
                } else{
                  result.object.task.taskStatus = false
                }
                this.$store.dispatch("task/moveTask",result.object.task)
                break;
              case "A17":
                this.$store.dispatch("task/recycle",result.object.task)
                break;
              case "C1":
              case "C2":
              case "C3":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                break;
              case "E1":
                if(result.object.publicType === '任务'){
                  this.$store.dispatch("task/bindingTag",{tag:result.object.tag,taskId:result.object.publicId})
                }
                break;
              case "E2":
                if(result.object.publicType === '任务'){
                  this.$store.dispatch("task/removeTag",{tagId:result.object.tagId,taskId:result.object.publicId})
                }
                case "F1":
                    if(result.object.type === 'task'){
                        this.$store.dispatch("task/publish",result.object.log)
                    }else if (result.object.type === 'schedule') {
                        this.$store.commit("schedule/msg",result.object.log)
                    }
                    break;
            }
          });
        },
        err => {}
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
