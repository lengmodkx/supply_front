<template>
  <header
    class="header"
    id="header"
  >
    <div class="logo">
      <img
        src="../../assets/images/logo.png"
        alt=""
      >
      <Icon
        type="code"
        @click="openMenu"
      ></Icon>
    </div>
    <div class="fr menu">
      <a
        :class="{activeHeaderTag:activeHeaderTag==1}"
        @click="clickHeaderTag(1)"
      ><span class="text">我的</span></a>
      <a
        :class="{activeHeaderTag:activeHeaderTag==2}"
        @click="clickHeaderTag(2)"
      >
        <span class="text">
          <Badge dot :offset=[5,0]><span>日志</span></Badge>
        </span>
      </a>
      <a
        :class="{activeHeaderTag:activeHeaderTag==3}"
        @click="clickHeaderTag(3)"
      >
        <span
          class="text"
          style="border-right:none;"
        >
          <Badge dot :offset=[5,0]><span>消息</span></Badge>
        </span>
      </a>
      <!-- <a :class="{activeHeaderTag:activeHeaderTag==4}" @click="clickHeaderTag(4)" class="last-child">消息</a> -->
      <Poptip
        placement="bottom-end"
        width="220"
        class="userPop"
        v-model="popVisible"
      >
        <img
          class="avatar"
          src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
          alt=""
        >
        <div
          class="userInfo"
          slot="content"
        >
          <ul class="org">
            <li
              class="addOrgPro"
              @click="addOrgModal=true;popVisible=false;"
            >创建企业</li>
            <li>个人项目</li>
            <li>企业项目</li>
          </ul>
          <ul class="admin">
            <li>账号设置</li>
          </ul>
          <ul class="logOut">
            <li>退出登录</li>
          </ul>
        </div>
      </Poptip>

    </div>
    <div
      class="logoMenu"
      @mouseleave="mouseOut"
      :class="logoMenu"
      :style="'display: '+display"
      style="display: inline-block"
    >
      <div class="main">
        <Row>
          <iCol
            span="8"
            :class="$route.path === i.path ? 'active' :'' "
            v-for="(i, k) in data"
            :key="k"
          >
            <div
              class=""
              @click="pathClick(i.path)"
            >
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
    <Modal
      v-model="addOrgModal"
      class="newOrg"
    >
      <CreateOrg v-if="addOrgModal"></CreateOrg>
    </Modal>
  </header>
</template>

<script>
// import Mine from './Mine'
import CreateOrg from "./common/CreateOrg";
import {mapState} from 'vuex'
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
      activeHeaderTag: -1,
      active: false,
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
  methods: {
    ...mapState('user',['mineRouter']),
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
    clickHeaderTag(id) {
      this.activeHeaderTag =
        id == this.activeHeaderTag ? (this.activeHeaderTag = -1) : (this.activeHeaderTag = id);
      if (this.mineRouter()){
        this.$router.push(this.mineRouter())
      } else {
        this.$router.push('/mine/nearThing')
      }

    }
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
