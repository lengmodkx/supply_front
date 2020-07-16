<template>
  <div class="layout">
    <div class="layout-left">
      <Menu
        :class=" isCollapsed?'big':'small'"
        :active-name="menuActive"
        :open-names="['1']"
        :theme="'dark'"
        v-if="isCollapsed"
        @on-select="openTag"
      >
        <Submenu v-for="(item,index) in MenuList" :key="index" :name="item.name">
          <template slot="title">
            <img :src="item.icon" alt class="menuImg" />
            <span>{{item.oneName}}</span>
          </template>
          <MenuItem :name="v.name" v-for="(v,i) in item.childNode" :key="i">{{v.text}}</MenuItem>
        </Submenu>
      </Menu>
      <Menu @on-select="openTag" width="81px" v-else class="small-Menu">
        <div>
          <Dropdown
            v-for="(item,index) in MenuList"
            :key="index"
            placement="right-start"
            class="menu-dropdown"
            @on-click="openTag"
          >
            <MenuItem :name="item.name">
              <img :src="item.icon" alt class="menuImg" />
            </MenuItem>
            <DropdownMenu slot="list" class="drop">
              <DropdownItem v-for="(children, index) in item.childNode" :key="index">
                <MenuItem :name="children.name">{{ children.text }}</MenuItem>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
      <div class="trigger" @click="collapsedSider" v-if="isCollapsed">
        <Icon type="md-arrow-back" />
      </div>
      <div class="trigger" @click="collapsedSider" v-else>
        <Icon type="md-arrow-forward" />
      </div>
    </div>
    <div class="layout-right">
      <information v-if="mineTag=='1,0'"></information>
      <management v-if="mineTag=='2,0'"></management>
      <orgStructure v-if="mineTag=='2,1'"></orgStructure>
      <enterpriseAuthority v-if="mineTag=='3,0'"></enterpriseAuthority>
      <projectAuthority v-if="mineTag=='3,1'"></projectAuthority>
      <operationLog v-if="mineTag=='4,0'"></operationLog>
    </div>
  </div>
</template>
<script>
import Loading from "../components/public/common/Loading.vue";
import information from "./informationS.vue";
import management from "./managementS.vue";
import orgStructure from "./orgStructureS.vue";
import enterpriseAuthority from "./enterpriseAuthorityS.vue";
import projectAuthority from "./projectAuthorityS.vue";
import operationLog from "./operationLogS.vue";

import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    Loading,
    information,
    management,
    orgStructure,
    enterpriseAuthority,
    projectAuthority,
    operationLog
  },
  inject: ["reload"],
  data() {
    return {
      MenuList: [
        {
          oneName: "基础配置",
          name: "1",
          icon: require("../assets/images/systemSet/jichupeizhi.png"),
          childNode: [
            { text: "基础信息", name: "1,0" }
            // { text: "企业身份认证", name: "1,1" }
          ]
        },
        {
          oneName: "成员管理",
          name: "2",
          icon: require("../assets/images/systemSet/chengyuanguanli.png"),
          childNode: [
            { text: "成员", name: "2,0" },
            { text: "组织架构", name: "2,1" }
          ]
        },
        {
          oneName: "权限管理",
          name: "3",
          icon: require("../assets/images/systemSet/quanxianguanli.png"),
          childNode: [
            { text: "企业权限", name: "3,0" },
            { text: "项目权限", name: "3,1" }
          ]
        },
        {
          oneName: "安全管理",
          name: "4",
          icon: require("../assets/images/systemSet/anquanguanli.png"),
          childNode: [
            { text: "操作日志", name: "4,0" },
            { text: "到处申请", name: "4,1" }
          ]
        }
      ],
      isCollapsed: true,
      tabValue: "0", //项目列表tab栏选中项
      menuActive: "1,0", //菜单栏选中项
      mineTag: "1,0"
    };
  },
  computed: {
    ...mapState(["loading", "header"], "app")
  },
  mounted() {
    this.companyId = localStorage.companyId;
  },
  methods: {
    openTag(tagName) {
      // console.log(tagName);
      this.mineTag = tagName;
      //   if (tagName.split(",")[0] == 1) {
      //     this.tabValue = tagName.split(",")[1];
      //     this.tabChange(tagName.split(",")[1]);
      //   }
    },
    collapsedSider() {
      this.isCollapsed = !this.isCollapsed;

      this.$store.commit("app/changeHeader", this.isCollapsed);
    }
  }
};
</script>
<style scoped lang="less">
.layout {
  height: calc(100vh);
  background: #f4f3f4;
  position: relative;
  overflow: hidden;
  display: flex;
  padding-top: 48px;
}

.big {
  width: 240px;
}

.small {
  width: 80px;
}

.now {
  color: #0077ff;
}

.df {
  display: flex;
}

/* 菜单样式 */
.ivu-menu {
  transition: all 0.3s;
}

.ivu-menu-dark {
  background: #0d253f;

  .ivu-menu-opened {
    background: #000c17 !important;

    /deep/.ivu-menu-submenu-title {
      background: #04172b !important;
    }
  }

  /deep/ .ivu-menu-submenu-title {
    background: none !important;
  }
}

.ivu-menu-submenu {
  white-space: nowrap;
  overflow: hidden;
  background: #0d253f !important;

  .ivu-menu-submenu-title:hover {
    background: none !important;
  }
}

.ivu-menu-submenu-title:hover {
  background: none !important;
}

.ivu-dropdown-rel {
  .ivu-menu-item {
    background: #0d253f !important;
  }
}

.ivu-select-dropdown {
  padding: 0 !important;
}

/* // 折叠菜单 */
.menu-dropdown {
  white-space: nowrap;
  display: block;
}

.layout-left {
  height: calc(100vh - 48px);
  background: #0d253f;
  position: relative;
  transition: all 0.3s;
  .menuImg {
    width: 20px;
    height: 20px;
    vertical-align: bottom;
    margin-right: 8px;
  }
  .trigger {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    /* z-index: 999999; */
    width: 100%;
    height: 48px;
    line-height: 48px;
    font-size: 20px;
    text-align: center;
    background: #002140;

    i {
      color: #ffffff;
    }
  }

  .small-Menu {
    width: 80px;

    .drop {
      .ivu-dropdown-item {
        padding: 0;
      }

      .ivu-dropdown-item:hover {
        color: #000000;
      }

      .ivu-menu-item-active {
        background: #f5f5f5 !important;
      }

      .ivu-menu-item {
        background: #ffffff;
        color: #000000;
      }

      .ivu-menu-item:hover {
        background: #f5f5f5;
        color: #000000;
      }
    }

    li {
      padding: 14px 24px;
      position: relative;
      cursor: pointer;
      z-index: 1;
      transition: all 0.2s ease-in-out;

      i {
        color: rgba(255, 255, 255, 0.7);

        &:hover {
          cursor: pointer;
          color: #ffffff;
        }
      }
    }
  }
}

.layout-right {
  flex: 1;
  margin: 24px;
  overflow-y: auto;
  position: relative;

  .noList {
    margin-top: 10%;

    img {
      display: block;
      width: 135px;
      height: 90px;
      margin: 8px auto 16px;
    }

    p {
      text-align: center;
      color: #333333;
    }
  }
}
</style>