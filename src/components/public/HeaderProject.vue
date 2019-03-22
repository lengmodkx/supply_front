<template>
  <div class="header-project">
    <div class="fl">
      <Breadcrumb separator="<i class='breadcrumb-separator ivu-icon ivu-icon-chevron-right'></i>">
        <BreadcrumbItem to="/">首页</BreadcrumbItem>
        <BreadcrumbItem>研发</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="menu">
      <a
        @click="push(menu.prefix)"
        v-for="(menu, index) in menus"
        :key="index"
        :class="RegExp(`${menu.pre}`).test(path) ? 'active' : ''"
        v-if="menu.open"
      >{{menu.funcName}}</a>
    </div>

    <div class="fr">
      <a
        :class="{activeHeaderTag:show==1}"
        @click="$emit('showBox',1);"
      >
        <Icon type="android-people"></Icon>
        3
      </a>
      <a>
        <Icon type="eye"></Icon>
        视图
      </a>
      <a
        :class="{activeHeaderTag:show==2}"
        @click="$emit('showBox',2);"
        class="last"
      >
        <Icon type="navicon"></Icon>
        菜单
      </a>
    </div>
  </div>
</template>

<script>
import { menus } from "../../axios/api.js";
export default {
  props: ["show"],
  data() {
    return {
      on: false,
      path: this.$route.path,
      id: this.$route.params.id,
      menus: []
    };
  },
  mounted() {
    menus(this.id).then(res => {
      this.menus = res.data.map((item, index) => {
        switch (item.funcName) {
          case "任务":
            item.prefix = "/tasks/group/" + this.$route.params.groupId;
            item.pre = "tasks";
            break;
          case "分享":
            item.prefix = "/shares";
            item.pre = "shares";
            break;
          case "文件":
            item.prefix = "/files/" + item.suffix;
            item.pre = "files";
            break;
          case "日程":
            item.prefix = "/schedules";
            item.pre = "schedules";
            break;
          case "统计":
            item.prefix = "/statistics";
            item.pre = "statistics";
            break;
        }
        return item;
      });
    });
  },
  methods: {
    push(u) {
      this.path = "/project/" + this.id + u;
      this.$router.push(this.path);
    }
  }
};
</script>
<style lang="less">
.activeHeaderTag {
  color: #2d8cf0 !important;
}
.blue {
  color: #2d8cf0 !important;
}
.header-project {
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  height: 50px;
  padding: 0 20px;
  padding-right: 0;
  position: fixed;
  top: 48px;
  left: 0;
  z-index: 999999;
  background-color: #f4f4f4;
  .menu {
    height: 50px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    a {
      display: inline-block;
      border-bottom: 3px solid transparent;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      color: #495060;
      margin: 0 15px;
      transition: all 0.3s;
      &.active,
      &:hover {
        border-bottom: 3px solid #2d8cf0;
      }
    }
  }
  .ivu-breadcrumb {
    font-size: 16px;
  }
  .fl {
    margin-top: 13px;
  }
  .breadcrumb-separator,
  .ivu-icon-chevron-down {
    color: #495060;
    font-size: 12px;
  }
  * {
    font-weight: 100 !important;
  }
  .fr {
    margin-top: (50-16)/2px;
    .last {
      border-right: 0;
    }
    a {
      padding: 0 20px;
      color: #495060;
      font-size: 16px;
      border-right: 1px solid #a6a6a6;
      height: 16px;
      line-height: 16px;
      display: inline-block;
    }
  }
}
</style>
