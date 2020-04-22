<template>
  <header class="header" id="header">
    <Poptip placement="bottom-start" v-model="mainMenu">
      <Icon class="app-icon" type="md-apps" v-if="companyId" />
      <div slot="content">
        <ul class="app-con">
          <router-link tag="li" :to="'/org/' + companyId" class="app-li">
            <Icon type="ios-home" size="32" color="#2d8cf0" @click="mainMenu = false" />
            <p>主页</p>
          </router-link>
          <li @click="goMembers" class="app-li">
            <Icon type="md-people" size="32" color="#2d8cf0" @click="mainMenu = false" />
            <p>成员</p>
          </li>
          <li class="app-li" @click="goBackstage">
            <Icon type="md-settings" size="32" color="#2d8cf0" @click="mainMenu = false" />
            <p>管理后台</p>
          </li>
        </ul>
      </div>
    </Poptip>
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="" />
      <Icon type="code" @click="openMenu"></Icon>
    </div>
    <div class="fr menu">
      <a :class="{ activeHeaderTag: activeHeaderTag == 1 }" @click="showHeaderTag(1)"><span class="text">我的</span></a>
      <a :class="{ activeHeaderTag: activeHeaderTag == 2 }" @click="showHeaderTag(2)"><span class="text">日历</span></a>
      <a :class="{ activeHeaderTag: activeHeaderTag == 5 }" @click="showHeaderTag(6)"><span class="text">素材</span></a>
      <a :class="{ activeHeaderTag: activeHeaderTag == 4 }" @click="showHeaderTag(4)"><span class="text">下载</span></a>
      <a @click="showHeaderTag(5)" v-if="companyId"><span class="text">设计</span></a>
      <a :class="{ activeHeaderTag: activeHeaderTag == 3 }" @click="showHeaderTag(3)">
        <span class="text" style="border-right:none;">
          <Badge :count="newsCount ? newsCount : 0" overflow-count="99" type="info" :offset="[10, 0]">
            <Icon type="ios-notifications-outline" size="22" />
          </Badge>
        </span>
      </a>
      <Poptip placement="bottom-end" width="220" class="userPop" v-model="popVisible" @on-popper-show="initCompany">
        <img class="avatar" :src="defaultImage" alt="" />
        <div class="userInfo" slot="content">
          <ul class="org">
            <li
              class="addOrgPro"
              :class="hoverClass == 'create' ? 'hoverClass' : ''"
              @click="
                addOrgModal = true;
                popVisible = false;
                hoverClass = 'create';
              "
            >
              创建企业
            </li>
            <li class="addOrgPro" v-for="(item, index) in companyList" :key="index" @click="changeOrg(item)">
              {{ item.organizationName }}
              <Icon v-if="item.isSelection" type="md-checkmark" />
            </li>
          </ul>
          <ul class="admin">
            <li
              :class="hoverClass == 'person' ? 'hoverClass' : ''"
              @click="
                personal();
                popVisible = false;
              "
            >
              账号设置
            </li>
            <!-- <li > 账号设置</li> -->
          </ul>
          <ul class="logOut">
            <li @click="goout">退出登录</li>
          </ul>
        </div>
      </Poptip>
    </div>
    <div class="logoMenu" @mouseleave="mouseOut" :class="logoMenu" :style="'display: ' + display" style="display: inline-block">
      <div class="main">
        <Row>
          <iCol span="8" :class="$route.path === i.path ? 'active' : ''" v-for="(i, k) in data" :key="k">
            <div class="" @click="pathClick(i.path)">
              <p>
                <Icon :type="i.icon"></Icon>
              </p>
              <h2>{{ i.value }}</h2>
            </div>
          </iCol>
        </Row>
      </div>
    </div>
    <!-- 我的 -->
    <!-- <Mine :class="{showmine:activeHeaderTag==1}" @close="activeHeaderTag=-1"></Mine> -->
    <!-- 创建企业项目 -->
    <Modal v-model="addOrgModal" class="newOrg">
      <CreateOrg @closeCreateOrg="addOrgModal = false" v-if="addOrgModal"></CreateOrg>
    </Modal>
    <!-- 日历 -->

    <Modal v-model="tagHeader" :mask="false" fullscreen :title="title" footer-hide @on-cancel="closeTag" :styles="{ top: '50px' }" class="tab-content">
      <Mine v-if="showtag == 'Mine'"></Mine>
      <calendar v-if="showtag == 'canlender'"></calendar>
      <suCai v-else-if="showtag == 'sucai'"></suCai>
      <down v-else-if="showtag == 'down'"></down>
      <message v-else-if="showtag == 'message'"></message>
      <div slot="footer"></div>
    </Modal>
  </header>
</template>

<script>
// import Mine from './Mine'
import calendar from "./calendar"; //日历
import suCai from "./sucai"; //素材
import down from "./down"; //下载
import message from "./message"; //消息
import Mine from "./Mine"; //消息
import CreateOrg from "./common/CreateOrg";
import { mapState, mapActions, mapMutations } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { updateState, checkPermission, changeOrganization } from "../../axios/api.js";
export default {
  name: "header-main",
  components: {
    Mine, //我的
    CreateOrg,
    calendar, //日历
    suCai, //素材库
    down, //下载
    message //消息
  },
  props: ["companyId", "avatar"],
  data() {
    return {
      tagHeader: false, //显示日历
      showtag: "",
      display: "none",
      popVisible: false,
      addOrgModal: false,
      logoMenu: "",
      active: false,
      mainMenu: false,
      hoverClass: "",
      showSck: false,
      data: [
        {
          value: "阿拉丁",
          icon: "social-chrome",
          path: "/"
        },
        {
          value: "成员",
          icon: "person",
          path: "/member"
        },
        {
          value: "报告",
          icon: "clipboard",
          path: "/report"
        },
        {
          value: "统计",
          icon: "pie-graph",
          path: "/calc"
        },
        {
          value: "目标管理",
          icon: "gear-b",
          path: "/target"
        },
        {
          value: "管理后台",
          icon: "paper-airplane",
          path: "/management"
        }
      ],
      time: 0,
      title:''
    };
  },
 
  mounted() {
    this.initSocket(localStorage.userId);
    this.initCompany();
  },
  methods: {
    ...mapActions("company", ["initCompany"]),
    ...mapActions("project", ["orgProjectInit"]),
    ...mapMutations("app", ["changeHeaderTag"]),
    
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
                this.$store.dispatch("project/init", "我创建的项目");
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
    personal() {
      this.$router.push("/personal");
      this.hoverClass = "person";
    },
    pathClick(path) {
      this.$router.push(path);
      this.popVisible = false;
    },
    // 点击企业 改变当前企业
    changeOrg(org) {
      this.popVisible = false;
      localStorage.companyId = org.organizationId;
      changeOrganization(org.organizationId).then(res => {
        if (res.result == 1) {
          this.$router.push("/org/" + org.organizationId);
        }
      });
    },
    mouseOut() {
      if (this.time) return;
      this.logoMenu = "";
      setTimeout(() => {
        this.display = "none";
      }, 300);
    },
    openMenu() {
      this.time = 1;
      this.display = "inline-block";
      setTimeout(() => {
        this.logoMenu = "show";
        setTimeout(() => {
          this.time = 0;
        }, 300);
      }, 10);
    },
    getNewsCount() {
      this.$store.dispatch("news/getNewsCount");
    },
    showHeaderTag(id) {
      if (id === 1) {
        //我的
        this.tagHeader = true;
        this.showtag = "Mine";
        this.title = '我的'
      } else if (id === 2) {
        //日历
        this.tagHeader = true;
        this.showtag = "canlender";
        this.title = '日历'
      } else if (id === 3) {
        //素材
        this.tagHeader = true;
        this.showtag = "message";
        
      } else if (id === 6) {
        //素材
        this.tagHeader = true;
        this.showtag = "sucai";
        this.title = '素材'
      } else if (id === 4) {
        //下载
        this.tagHeader = true;
        this.showtag = "down";
        this.title = '下载'
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
    clickHeaderTag(id) {
      this.changeHeaderTag(id);
      if (this.$route.fullPath.includes("home") || this.$route.fullPath.includes("project")) {
        localStorage.projectRouter = this.$route.fullPath;
      }
      if (id === 1) {
        if (localStorage.mineRouter) {
          this.$router.push(localStorage.mineRouter);
        } else {
          this.$router.push("/mine/nearThing");
        }
      } else if (id === 2) {
        this.$router.push("/calendar");
      } else if (id === 3) {
        this.$router.push("/message");
      } else if (id === 4) {
        this.$router.push("/down");
      } else if (id === 5) {
        if (runPlatform == "browse") {
          this.$Message.error("设计系统必须在阿拉丁BIM云平台客户端打开");
        } else {
          ALDObj.RunALDCAD();
        }
      }
    },
    // 去管理后台页面
    goBackstage() {
      checkPermission(localStorage.companyId).then(res => {
        if (res.result == 1 && res.data == true) {
          const { href } = this.$router.resolve({
            name: "organizationAdmin",
            params: { orgId: localStorage.companyId }
          });
          window.open(href, "_blank");
        } else {
          this.$Message.error("没有权限");
        }
      });
    },
    // 去成员页面
    goMembers() {
      checkPermission(localStorage.companyId).then(res => {
        if (res.result == 1 && res.data == true) {
          this.$router.push("/members");
        } else {
          this.$Message.error("没有权限");
        }
      });
    },
    // 去素材库页面
    goSucai() {
      this.popVisible = false;
      this.$router.push("/sucai/" + localStorage.fileId);
    },
    goout() {
      localStorage.token = "";
      localStorage.companyId = "";
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState("index", ["headerImg"]),
    ...mapState("user", ["mineRouter","defaultImage"]),
    ...mapState("app", ["activeHeaderTag"]),
    ...mapState("news", ["newsCount"]),
    ...mapState("company", ["companyList"]),
    ...mapActions("project", ["init", "updateProject", "openSet"])
  },
  created() {
    this.getNewsCount();
   console.log("头像+" +this.defaultImage)
  }
};
</script>
<style scoped lang="less">
/deep/.ivu-modal-wrap {
  overflow: hidden;
}
/deep/.ivu-modal-body {
  padding: 0;
  overflow: hidden !important;
}
/deep/ .ivu-modal-content {
  box-shadow: none;
}
/deep/.ivu-modal-footer {
  border-top: none;
}
.menu .activeHeaderTag {
  color: #2d8cf0;
  background-color: #f5f5f5;
}
.showmine {
  bottom: 0;
  transition: 0.3s;
  height: calc(100% - 48px) !important;
  overflow-y: auto !important;
}
.sck {
  width: 100%;
  height: 37px;
  line-height: 37px;
  cursor: pointer;
  padding: 0 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
