<template>
  <div id="app">
    <header-main v-if="hasHeader"></header-main>
    <div class="content-main">
      <router-view v-if="isRouterAlive"/>
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
      hasHeader: true
    };
  },
  created() {
    this.renderHeader();
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
        this.$route.path.indexOf("/statisticsDetail") < 0 &&
        this.$route.path !== "/forget";
      // this.hasHeader = this.$route.path !== '/management'
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
    /deep/.ivu-tag-text {
      color: #fff;
    }
    /deep/.ivu-icon-ios-close-empty {
      color: #fff !important;
    }
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
