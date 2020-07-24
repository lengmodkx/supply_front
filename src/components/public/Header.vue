<template>
  <header class="header" id="header">
    <div class="left-header">
      <div class="logo" :class="header ? 'logo-big' : 'logo-small'">
        <img src="../../assets/images/download.png" alt />

        <!-- <span :class="header ? 'big' : 'small'">Ald Bim</span> -->
      </div>
      <ul>
        <li :class="{ hover: active == 0 }" @click="goOrg">工作台</li>
        <li :class="{ hover: active == 1 }" @click="projectList">项目管理</li>
        <li :class="{ hover: active == 2 }" @click="goMembers">团队成员</li>
        <li :class="{ hover: active == 3 }" @click="goSys">系统设置</li>
        <li :class="{ hover: active == 4 }">我的</li>
      </ul>
    </div>
    <div>
      <div class="right-header">
        <Avatar
          :src="headeImg"
          class="avatar"
          @click.native="showMenu"
          v-click-outside="popVisible=='none'"
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
              <div style="font-size:12px;color:#8c8c8c">我的企业</div>
            </div>
          </li>
          <li class="tb-navigation-menu-divider"></li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content3" @click="personal">账号设置</div>
          </li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content3">下载ALDCAD</div>
          </li>
          <li class="tb-navigation-menu-divider"></li>
          <li class="tab-menu-item">
            <div class="tab-menu-item-content1" @click="goout">退出登陆</div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { checkPermission, userIsOwner } from "../../axios/api.js";

export default {
  name: "header-main",
  components: {},
  computed: {
    ...mapState("app", ["header"])
  },
  data() {
    return {
      active: 0,
      popVisible: "none",
      headeImg: localStorage.userImg
    };
  },

  mounted() {
    //切换路由页面刷新时用
    if (this.$route.name == "organization") {
      this.active = 0;
    } else if (this.$route.name == "prolist") {
      this.active = 1;
    } else if (this.$route.name == "members") {
      this.active = 2;
    }
  },
  methods: {
    ...mapActions("company", ["initCompany"]),
    //去首页
    goOrg() {
      this.active = 0;
      this.$router.push("/org/" + localStorage.companyId);
    },
    projectList() {
      this.active = 1;
      this.$router.push("/prolist/" + localStorage.companyId);
    },
    goSys() {
      userIsOwner(localStorage.companyId).then(res => {
        console.log(res);
        if (res.msg == 1) {
          this.active = 3;
          this.$router.push("/systemSettings");
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
          this.active = 2;
          this.$router.push("/members");
        } else {
          this.$Message.error("没有权限");
        }
      });
    },
    personal() {
      let routeUrl = this.$router.resolve({
        path: "/personal"
        // query: { id: 96 }
      });
      window.open(routeUrl.href, "_blank");
      // this.$router.push("/personal");
      this.popVisible = "none";
    },
    goout() {
      localStorage.clear();
      this.$router.push("/");
    },
    showMenu() {
      if (this.popVisible == "none") {
        this.popVisible = "block";
      } else {
        this.popVisible = "none";
      }
    }
  },
  watch: {
    $route(to, from) {
      console.log(to);
      // if()
    }
  }
};
</script>
<style scoped lang="less"></style>
