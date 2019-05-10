<template>
  <header class="header" id="header">
    <Poptip v-model="mainMenu">
      <Icon class="app-icon" type="md-apps" />
      <div slot="content">
        <ul class="app-con">
          <router-link tag="li" to="/home" class="app-li">
            <img @click="mainMenu=false" src="http://ald.art1001.com/favicon.ico" alt="">
            <p>主页</p>
          </router-link>
          <router-link tag="li" to="/members" class="app-li">
            <img @click="mainMenu=false" src="https://dn-st.teambition.net/appstore/images/basic_app_members.png" alt="">
            <p>成员</p>
          </router-link>
        </ul>
      </div>
    </Poptip>
    <div class="logo">
      <img src="../../assets/images/logo.png" alt="">
      <Icon type="code" @click="openMenu"></Icon>
    </div>
    <div class="fr menu">
      <a :class="{activeHeaderTag:activeHeaderTag==1}" @click="clickHeaderTag(1)"><span class="text">我的</span></a>
      <a :class="{activeHeaderTag:activeHeaderTag==2}" @click="clickHeaderTag(2)">
        <span class="text">
          <Badge dot :offset=[5,0]><span>日历</span></Badge>
        </span>
      </a>
      <a :class="{activeHeaderTag:activeHeaderTag==3}" @click="clickHeaderTag(3)">

        <span class="text" style="border-right:none;">
          <Badge :count="newsCount?newsCount:0" overflow-count="99" type="info" :offset=[10,0]>
            <Icon type="ios-notifications-outline" size="22" />
          </Badge>
        </span>
      </a>
      <!-- <a :class="{activeHeaderTag:activeHeaderTag==4}" @click="clickHeaderTag(4)" class="last-child">消息</a> -->
      <Poptip placement="bottom-end" width="220" class="userPop" v-model="popVisible">
        <img class="avatar" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+src" alt="">
        <div class="userInfo" slot="content">
          <ul class="org">
            <div class="createdOrg" @click="addOrgModal=true;popVisible=false;">创建企业</div>
            <li class="addOrgPro" v-for="(item, index) in companyList" :key="index">
              {{item.organizationName}}
              <Icon type="md-checkmark" />
            </li>
          </ul>
          <ul class="admin">
            <li>账号设置</li>
          </ul>
          <ul class="logOut">
            <router-link tag="li" to="/">退出登录</router-link>
          </ul>
        </div>
      </Poptip>

    </div>
    <div class="logoMenu" @mouseleave="mouseOut" :class="logoMenu" :style="'display: '+display" style="display: inline-block">
      <div class="main">
        <Row>
          <iCol span="8" :class="$route.path === i.path ? 'active' :'' " v-for="(i, k) in data" :key="k">
            <div class="" @click="pathClick(i.path)">
              <p>
                <Icon :type="i.icon"></Icon>
              </p>
              <h2>{{i.value}}</h2>
            </div>
          </iCol>
        </Row>
      </div>
    </div>
    <!-- 我的 -->
    <!-- <Mine :class="{showmine:activeHeaderTag==1}" @close="activeHeaderTag=-1"></Mine> -->
    <!-- 创建企业项目 -->
    <Modal v-model="addOrgModal" class="newOrg">
      <CreateOrg @closeCreateOrg="addOrgModal=false" v-if="addOrgModal"></CreateOrg>
    </Modal>
  </header>
</template>

<script>
// import Mine from './Mine'
import CreateOrg from "./common/CreateOrg";
import { mapState, mapActions, mapMutations } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
export default {
  name: "header-main",
  components: {
    // Mine,
    CreateOrg
  },
  data() {
    return {
      display: "none",
      popVisible: false,
      addOrgModal: false,
      logoMenu: "",
      active: false,
      mainMenu: false,
      src: localStorage.userImg,
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
      time: 0
    };
  },
  mounted() {
    this.initSocket(localStorage.userId);
    this.initCompany();
  },
  methods: {
    ...mapState("user", ["mineRouter", "users"]),
    ...mapActions("company", ["initCompany"]),
    ...mapMutations('app',['changeHeaderTag']),
    initSocket(id) {
      // 建立连接对象
      var url =
        process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_SOCKET
          : process.env.VUE_APP_SOCKET;
      var socket = new SockJS(url); //连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/user/${id}/message`, msg => {
            var result = JSON.parse(msg.body);
            this.$store.commit("news/addNews", result.message);
          });
        },
        err => {}
      );
    },
    pathClick(path) {
      this.$router.push(path);
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
    clickHeaderTag(id) {
      this.changeHeaderTag(id)
      if (
        this.$route.fullPath.includes("home") ||
        this.$route.fullPath.includes("project")
      ) {
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
      }
    }
  },
  computed: {
    ...mapState('app', ['activeHeaderTag']),
    ...mapState("news", ["newsCount"]),
    ...mapState("company", ["companyList"])
  },
  created() {
    this.getNewsCount();
  }
};
</script>
<style scoped lang="less">
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
</style>
