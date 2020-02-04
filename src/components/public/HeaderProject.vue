<template>
  <div class="header-project">
    <div class="fl">
      <!-- <Breadcrumb separator=">">
        <BreadcrumbItem :to="toto">首页</BreadcrumbItem>
        <BreadcrumbItem>{{projectName}}</BreadcrumbItem>
      </Breadcrumb> -->
      <div><a :href="toto">首页</a> <span> > {{projectName}}</span></div>
    </div>
    <!-- :class="RegExp(`${menu.pre}`).test(path) ? 'active' : ''" -->
    <div class="menu">
      <router-link v-for="(menu, index) in menus" :key="index" :to="`/project/${id}${menu.prefix}`" :class="{'is-active':$route.meta.active === menu.pre}">{{menu.funcName}}</router-link>
    </div>

    <div class="fr">
      <a :class="{activeHeaderTag:show==1}" @click="$emit('showBox',1);">
        <Icon type="md-people" size="20" />
        {{users.length}}
      </a>

      <a :class="{activeHeaderTag:show==3}" @click="$emit('showBox',3);">
        <Icon type="eye"></Icon>视图
      </a>
      <a :class="{activeHeaderTag:show==2}" @click="$emit('showBox',2);" class="last">
        <Icon type="navicon"></Icon>菜单
      </a>
    </div>
  </div>
</template>

<script>
import { menus } from "../../axios/api.js";
import { mapState } from "vuex";
export default {
  props: ["show"],
  data() {
    return {
      on: false,
      path: this.$route.path,
      id: this.$route.params.id,
      menus: [],
      projectName: "",
      companyId: localStorage.companyId,
      toto: '/org/'+localStorage.companyId
    };
  },
  computed: {
    ...mapState("member", ["users"])
  },
  mounted() {
    menus(this.id).then(res => {
      this.menus = res.data.map((item, index) => {
        // console.log(">>>>>>>", this.path);
        switch (item.funcName) {
          case "任务":
            item.prefix = "/tasks/group/" + item.suffix; //this.$route.params.groupId;
            item.pre = "/tasks";
            break;
          case "分享":
            item.prefix = "/shares";
            item.pre = "/shares";
            break;
          case "文件":
            item.prefix = "/files/" + item.suffix;
            item.pre = "/files";
            break;
          case "日程":
            item.prefix = "/schedules";
            item.pre = "/schedules";
            break;
          case "群聊":
            item.prefix = "/groupChat";
            item.pre = "/groupChat";
            break;
          case "统计":
            item.prefix = "/statistics";
            item.pre = "/statistics";
            break;
        }
        return item;
      });
      this.projectName = res.project.projectName;
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
      &.is-active,
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
