<template>
  <div id="app">
    <header-main v-if="hasHeader" :companyId="companyId" :avatar="avatar"></header-main>
    <div class="content-main">
      <router-view v-if="isRouterAlive" :key="$route.fullPath" />
      <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    </div>
  </div>
</template>

<script>
import Header from "./components/public/Header.vue";

export default {
  name: "App",
  components: {
    "header-main": Header
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      hasHeader: true,
      companyId: "",
      avatar: ""
    };
  },
  created() {
    this.renderHeader();
    console.log(this.companyId);
  },
  watch: {
    $route() {
      this.renderHeader();
    }
  },
  methods: {
    renderHeader() {
      this.hasHeader =
        this.$route.path !== "/" &&
        this.$route.path.indexOf("/management") < 0 &&
        this.$route.path !== "/register" &&
        this.$route.path !== "/bind" &&
        this.$route.path.indexOf("/statisticsDetail") < 0 &&
        this.$route.path !== "/forget" &&
        this.$route.path.indexOf("/organization-admin") < 0&&
        this.$route.path.indexOf("/material") < 0;
      // this.hasHeader = this.$route.path !== '/management'
      this.companyId = localStorage.companyId;
      this.avatar = localStorage.userImg;
    },
    reload() {
      console.log("xxxxxxx");
      this.isRouterAlive = false;
      //在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="less">
@import "assets/css/font.less";
@import "assets/css/app.less";
* {
  user-select: none;
  outline: none;
}
.ivu-checkbox-large .ivu-checkbox-inner {
  transform: scale(1.5);
}
.file-vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.mytaskModal {
  .ivu-modal {
    width: 600px !important;
  }
}
.tag,
.tags {
  .tagtitle {
    cursor: pointer;
  }
  .list {
    white-space: normal;
  }
}
.myRcModal {
  .ivu-modal-close {
    .ivu-icon-ios-close-empty {
      color: #7fd4fb !important;
    }
  }
}
.demo-spin-container {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  border: 1px solid #eee;
  z-index: 999999999;
}
</style>
