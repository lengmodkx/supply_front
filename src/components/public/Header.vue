<template>
  <header class="header" id="header">
    <div class="left-header">
      <div class="logo" :class="header ? 'logo-big' : 'logo-small'">
        <img src="../../assets/images/download.png" alt />
      </div>
      <ul>
        <li :class="{ hover: activeHeaderTag == 0 }" @click="goOrg">工作台</li>
        <li :class="{ hover: activeHeaderTag == 1 }" @click="projectList">项目管理</li>
        <li :class="{ hover: activeHeaderTag == 2 }" @click="goMembers">企业成员</li>
        <li :class="{ hover: activeHeaderTag == 3 }" @click="goSys">系统设置</li>
        <li :class="{ hover: activeHeaderTag == 4 }" @click="myPage">我的</li>
      </ul>
    </div>
    <div class="df ac">
      <div class="menu">
        <a @click="showHeaderTag(5)">
          <span class="texttag">设计</span>
        </a>
        <a @click="showHeaderTag(6)">
          <span class="texttag">素材</span>
        </a>
        <a @click="goProList">
          <span class="texttag" style="border-right:none;">
            <Badge
              :count="newsCount ? newsCount : 0"
              overflow-count="99"
              type="info"
              :offset="[10, 0]"
            >
              <Icon type="ios-notifications-outline" size="22" />
            </Badge>
          </span>
        </a>
      </div>
      <div class="right-header">
        <Avatar
          :src="headeImg"
          class="avatar"
          @click.native="showMenu"
          v-click-outside="hideContent"
        />
      </div>
      <div class="userInfo" :style="{ display: popVisible }">
        <ul>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content1">升级</div>
          </li>
          <li class="tb-navigation-menu-divider"></li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content2" @click="checkEnter">
              <div>切换企业</div>
              <div style="font-size:12px;color:#8c8c8c">{{orgName}}</div>
            </div>
          </li>
          <li class="tb-navigation-menu-divider"></li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content3" @click="personal">账号设置</div>
          </li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content3" @click="getDown">下载ALDCAD</div>
          </li>
          <li class="tb-navigation-menu-divider"></li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content1" @click="goout">退出登陆</div>
          </li>
        </ul>
      </div>
    </div>
    <Modal
      v-model="tagHeader"
      :mask="false"
      fullscreen
      :title="title"
      footer-hide
      @on-cancel="closeTag"
      :styles="{ top: '50px' }"
      class="tab-content"
    >
      <!-- <calendar v-if="showtag == 'canlender'"></calendar> -->
      <suCai v-if="showtag == 'sucai'"></suCai>
      <!-- <down v-else-if="showtag == 'down'"></down> -->
      <div slot="footer"></div>
    </Modal>
  </header>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { checkPermission, userIsOwner } from "../../axios/api.js";
import suCai from "./sucai"; //素材
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  name: "header-main",
  components: {
    suCai //素材库
  },
  computed: {
    ...mapState("app", ["header"]),
    ...mapState("app", ["activeHeaderTag"]),
    ...mapState("news", ["newsCount"])
  },
  data() {
    return {
      // active: 0,
      popVisible: "none",
      headeImg: localStorage.userImg,
      orgName: localStorage.orgName,
      tagHeader: false, //显示日历
      showtag: "",
      title: ""
    };
  },

  mounted() {
    //切换路由页面刷新时用
    if (this.$route.name == "organization") {
      this.$store.commit("app/changeHeaderTag", 0);
    } else if (this.$route.name == "prolist") {
      this.$store.commit("app/changeHeaderTag", 1);
    } else if (this.$route.name == "members") {
      this.$store.commit("app/changeHeaderTag", 2);
    } else if (this.$route.name == "systemSettings") {
      this.$store.commit("app/changeHeaderTag", 3);
    } else if (this.$route.name == "Mine") {
      this.$store.commit("app/changeHeaderTag", 4);
    }
    this.getNewsCount();
    this.initSocket(localStorage.userId);
  },
  methods: {
    ...mapActions("company", ["initCompany"]),
    initSocket(id) {
      // 建立连接对象
      var url = "";
      if (process.env.NODE_ENV == "test") {
        url = process.env.VUE_APP_TEST_SOCKET;
      } else if (process.env.NODE_ENV == "production") {
        url = process.env.VUE_APP_SOCKET;
      } else {
        url = process.env.VUE_APP_SOCKET;
      }
      var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/user/${id}/message`, msg => {
            var result = JSON.parse(msg.body);
            switch (result.type) {
              case "I1":
                this.$store.commit("project/deleteProject", result.object);
                break;
              default:
                this.$store.commit("news/addNews", result.message);
                break;
            }
          });
        },
        err => {}
      );
    },
    //去首页
    goOrg() {
      this.$router.push("/org/" + localStorage.companyId);
      this.$store.commit("app/changeHeaderTag", 0);
    },
    projectList() {
      this.$router.push("/prolist/" + localStorage.companyId);
      this.$store.commit("app/changeHeaderTag", 1);
    },
    goSys() {
      userIsOwner(localStorage.companyId).then(res => {
        if (res.msg == 1) {
          this.$router.push("/systemSettings");
          this.$store.commit("app/changeHeaderTag", 3);
          localStorage.organizationName = res.data.organizationName;
        } else {
          this.$Message.error("没有权限");
        }
      });
    },
    checkEnter() {
      this.$router.push("/enterprisesList");
    },
    // 去成员页面
    goMembers() {
      checkPermission(localStorage.companyId).then(res => {
        if (res.result == 1 && res.data == true) {
          this.$router.push("/members");
          this.$store.commit("app/changeHeaderTag", 2);
        } else {
          this.$Message.error("没有权限");
        }
      });
    },
    personal() {
      let routeUrl = this.$router.resolve({
        path: "/personal"
      });
      window.open(routeUrl.href, "_blank");
      // this.$router.push("/personal");
      this.popVisible = "none";
    },
    goout() {
      localStorage.clear();
      this.setCookie("token", "", 0);
      // window.location.href = "https://www.aldbim.com";
      var url = "";
          if (process.env.NODE_ENV == "test") {
            url = 'http://test.art1001.com';
          } else if (process.env.NODE_ENV == "production") {
            url =  "https://www.aldbim.com";
          } else {
            url = "/";
          }
          window.location.href = url;

    },
    showMenu() {
      if (this.popVisible == "none") {
        this.popVisible = "block";
      } else {
        this.popVisible = "none";
      }
    },
    myPage() {
      this.$router.push("/mine");
      this.$store.commit("app/changeHeaderTag", 4);
    },
    hideContent() {
      this.popVisible = "none";
    },
    setCookie(cname, cvalue) {
      var d = new Date();
      d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie =
        cname + "=" + cvalue + "; " + expires + ";path=/;domain=aldbim.com";
    },
    getNewsCount() {
      this.$store.dispatch("news/getNewsCount");
    },
    goProList() {
      this.$router.push({
        path: "/prolist/" + localStorage.companyId,
        query: { from: "tips" }
      });
      this.$store.commit("app/changeHeaderTag", 1);
    },
    showHeaderTag(id) {
      // if (id === 1) {
      //   //我的
      //   this.tagHeader = true;
      //   this.showtag = "Mine";
      //   this.title = '我的'
      // } else if (id === 2) {
      //   //日历
      //   this.tagHeader = true;
      //   this.showtag = "canlender";
      //   this.title = '日历'
      // } else if (id === 3) {
      //   //素材
      //   this.tagHeader = true;
      //   this.showtag = "message";

      // } else
      if (id === 6) {
        //素材
        this.tagHeader = true;
        this.showtag = "sucai";
        this.title = "素材";
        // } else if (id === 4) {
        //   //下载
        //   this.tagHeader = true;
        //   this.showtag = "down";
        //   this.title = '下载'
      } else if (id === 5) {
        if (runPlatform == "browse") {
          this.$Message.error("设计系统必须在阿拉丁BIM云平台客户端打开");
        } else {
          ALDObj.RunALDCAD();
        }
      }
    },
    closeTag() {
      this.tagHeader = false;
      this.showtag = "";
    },
    getPath() {
      this.$store.commit("app/changeHeader", true);
    },
    getDown() {
      window.location.href =
        "https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/ALDBIM2020.exe";
    }
  },
  watch: {
    $route: "getPath"
  }
};
</script>
<style scoped lang="less"></style>
