<template>
  <div class="project-main">
    <header-project @showBox="showBox" :show="show" :data="activeHeaderTag"></header-project>
    <!-- 项目成员 -->
    <ProjectMember v-transfer :class="{ active: show == 1, animate }" @hideBox="hideBox"></ProjectMember>
    <!-- 项目菜单 -->
    <ProjectMenu v-transfer :class="{ activeMenu: show == 2, animate }" @hideMenuBox="hideBox"></ProjectMenu>
    <ProjectView v-transfer :class="{ activeMenu: show == 3, animate }" @hideMenuBox="hideBox"></ProjectView>
    <div class="router-view-box" :class="{ zhanWei: show == 1 || show == 2 || show == 3 }">
      <router-view />
    </div>
  </div>
</template>
<script>
import MyHeader from "@/components/public/HeaderProject.vue";
import ProjectMember from "@/components/public/ProjectMember.vue";
import ProjectMenu from "@/components/public/ProjectMenu.vue";
import ProjectView from "../../components/public/ProjectView.vue";
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
      timer:'',
      animate: true,
      activeHeaderTag: -1
    };
  },
  created() {
    this.reconnection(this.$route.params.id)
  },
  destroyed() {
    this.stompClient.disconnect(function() {
      console.log("断开socket连接");
    });
  },
  methods: {
    showBox(i) {
      let old = this.show;
      this.show = old == i ? -1 : i;
      this.animate = old == -1;
      this.activeHeaderTag = -1;
    },
    clickHandler() {
      this.$router.push({ path: "/home" });
      this.$Notice.close("project_del");
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
    reconnection(){
        this.initSocket(this.$route.params.id);
        let self = this;
        // 断开重连机制,尝试发送消息,捕获异常发生时重连
        this.timer = setInterval(() => {
            try {
                self.stompClient.send("test");
            } catch (err) {
                console.log("断线了: " + err);
                self.initSocket(this.$route.params.id);
            }
        }, 1000*10);
    },
    initSocket(id) {
      // 建立连接对象
      var url = "";
      
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_SOCKET;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_SOCKET;
      } else {
        url = process.env.VUE_APP_SOCKET;
       //url='http://192.168.3.112:8080/webSocketServer'
      }
      var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      //this.stompClient.debug = function(str) {};
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/topic/${id}`, msg => {
            var result = JSON.parse(msg.body);
        
            console.log(result.type);
            
            
            switch (result.type) {
              case "A1": //创建任务
                this.$store.dispatch("task/init", result.object);
                break;
              case "A2":
                this.$store.dispatch("task/deleteTask", result.object);
                break;
              case "A3":
                this.$store.dispatch("task/updateStatus", result.object);
                break;
              case "A4":
                this.$store.dispatch("task/updateStatus", result.object);
                break;
              case "A5":
              case "A6":
              case "A7":
              case "A8":
              case "A9":
              case "A11":
              case "A12":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A13":
                this.$store.dispatch("task/editTask", result.object.taskId);
                this.$store.dispatch("task/init", result.object.projectId);
                break;
              case "A14":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A15":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A16":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A17":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              case "A18":
                this.$store.dispatch("task/loadIndex", result.object);
                break;
              case "A20":
                this.$store.dispatch("task/changeTask", result.object);
              case "A27":
                this.$store.dispatch("task/init", result.object);
                break;
              // 关联
              case "A28":
                if (result.object.fromType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.fromType === "文件") {
                  this.$store.commit("file/relevance", result.object);
                } else if (result.object.fromType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.fromType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 取消关联
              case "A29":
                if (result.object.fromType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.fromType === "文件") {
                  this.$store.commit("file/cancelRelevance", result.object);
                } else if (result.object.fromType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.fromType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              case "A30":
                this.$store.dispatch("task/changeTask", result.object);
                break;
              // 修改工时
               case "A31":

                this.$store.dispatch("task/changeTask", result.object);
               break;
              // 添加分享
              case "B1":
                this.$store.dispatch("share/init", result.object);
                break;
              // 编辑分享
              case "B2":
                this.$store.dispatch("share/init", result.object.projectId);
                this.$store.dispatch("share/changeShares", result.object.id);
                break;
              // 移动分享
              case "B5":
                this.$store.dispatch("share/init", result.object);
                break;
              // 隐私模式
              case "B8":
                this.$store.dispatch("share/changeShares", result.object);
                break;
              // 分享移到回收站
              case "B6":
                this.$store.dispatch("share/init", result.object);
                // this.$store.dispatch("share/deleteSahre", result.object);
                break;
              // 添加参与者
              case "B10":
                this.$store.dispatch("share/changeShares", result.object);
                break;
              case "B3":
              case "B4":
              case "B7":
                this.$store.dispatch("share/init", result.object);
                break;
              // 创建文件夹
              case "C1":
                this.$store.dispatch("file/createWjj", result.object);
                break;
              // 上传文件
              case "C2":
                this.$store.dispatch("file/upFiles", result.object);
                break;
              // 修改文件名称
              case "C11":
                this.$store.commit("file/changeFileName", result.object);
                break;
              // 复制文件
              case "C10":
                this.$store.dispatch("file/initFile", result.object);
                break;
              // 移动文件
              case "C12":
                this.$store.dispatch("file/initFile", {fileId:result.object});
                break;
              // 文件移到回收站
              case "C13":
                this.$store.commit("file/putRecycle", result.object);
                break;
              // 更改 文件隐私模式
              case "C8":
                this.$store.dispatch("file/putMimi", result.object);
                this.$store.dispatch("tree/initTree",result.object);
                break;
              // 改变文件参与者
              case "C9":
                this.$store.commit("file/player", result.object);
                break;
              case "C3":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                break;
              case "C4":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                this.$store.dispatch("file/putOneFile", result.object.fileId);
                break;
              case "C7":
                this.$store.dispatch("file/initFile", {
                  fileId: result.object.parentId
                });
                break;
              //新建日程
              case "D9":
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              //修改日程名称
              case "D1":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //修改日程的开始时间
              case "D2":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //修改日程的结束时间
              case "D3":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程地点
              case "D4":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程备注
              case "D5":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程参与者
              case "D6":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
              //更新了日程重复性
              case "D7":
                this.$store.dispatch("schedule/getScheduleById", result.object);
                break;
                case "K1":
                  this.$store.dispatch("member/initUser", result.object.projectId);
                break;
              //复制日程
              case "D10":
              case "D11":
              case "D12":
              case "D13":
                console.log("xxxxxxxxx")
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              // 添加标签
              case "D14":
                // this.$store.dispatch("schedule/init", {
                //   projectId: result.object
                // });
                  console.log(result)
                  this.$store.dispatch("file/initFile", {
                      fileId: result.object
                  });
                break;
              case "D15":
                console.log("xxxxxxxxx")
                this.$store.dispatch("schedule/init", {
                  projectId: result.object
                });
                break;
              case "E1":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.commit("file/bindingTag", {
                    tag: result.object.tag,
                    fileId: result.object.publicId
                  });
                } else if (result.object.publicType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 移除标签
              case "E2":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.commit("file/removeTag", {
                    tagId: result.object.tagId,
                    fileId: result.object.publicId
                  });
                } else if (result.object.publicType === "分享") {
                  this.$store.dispatch("share/changeShares", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
              // 添加新标签并绑定
              case "E3":
                if (result.object.publicType === "任务") {
                  this.$store.dispatch("task/changeTask", result.object.publicId);
                } else if (result.object.publicType === "文件") {
                  this.$store.dispatch("file/putOneFile", result.object.publicId);
                } else if (result.object.publicType === "日程") {
                  this.$store.dispatch("schedule/getScheduleById", result.object.publicId);
                }
                break;
                 
              // 发消息
              case "F1":
                if (result.object.type === "任务") {
                  this.$store.dispatch("task/publish", result.object.log);
                } else if (result.object.type === "schedule") {
                  this.$store.commit("schedule/msg", result.object.log);
                } else if (result.object.type === "文件") {
                  this.$store.commit("file/getMsg", result.object.log);
                } else if (result.object.type === "分享") {
                  this.$store.commit("share/sendMsg", result.object.log);
                } else if (result.object.type === "日程") {
                  this.$store.commit("schedule/msg", result.object.log);
                }
                break;
              case "G1":
                this.$store.commit("chat/pushMsg", {
                  chat: result.object,
                  userId: localStorage.userId
                });
                break;
              case "G2":
                this.$store.commit("chat/revoke", result.object);
                break;
              case "H1":
              case "H2":
              case "H3":
              case "H4":
              case "H5":
              case "H6":
              case "H7":
              case "H8":
                  this.$store.dispatch("task/init", result.object);
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
  top: 65px;
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
