<template>
  <div class="mine">
    <div class="content">
      <Menu
        theme="dark"
        accordion
        width="240px"
        :class="fold?'':'foldMenuWidth'"
        @on-select="openTag"
        active-name="nearThing,1" 
        :open-names="['nearThing,1']"
      >
        <!-- 展开菜单 -->
        <div v-if="showFold" ref="openMenu">
          <Submenu v-for="(item,index) in MenuList" :key="index" :name="item.name" >
            <template slot="title">
              <Icon :type="item.icon" />
              <span>{{item.oneName}}</span>
            </template>
            <MenuItem :name="v.name" v-for="(v,i) in item.childNode" :key="i">{{v.text}}</MenuItem>
          </Submenu>
          <div class="foldMenuBtn">
            <MenuItem name="foldMenu">
              <Icon type="md-arrow-back" color="#ffffff"/>
            </MenuItem>
          </div>
        </div>
        <!-- 折叠菜单 -->
        <div v-else>
          <div>
            <Dropdown
              v-for="(item,index) in MenuList"
              :key="index"
              placement="right-start"
              class="menu-dropdown"
            >
              <MenuItem :name="item.name" >
                <Icon :type="item.icon" />
              </MenuItem>
              <DropdownMenu slot="list" class="drop">
                <DropdownItem v-for="(children, index) in item.childNode" :key="index">
                  <MenuItem :name="children.name">{{ children.text }}</MenuItem>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="foldMenuBtn">
            <MenuItem name="openMenu">
              <Icon type="md-arrow-forward" @click="openMenu"  color="#ffffff"/>
            </MenuItem>
          </div>
        </div>
      </Menu>
      <Content class="mainContent">
        <nearThing v-if="mineTag=='nearThing'" :name="name?name:1"></nearThing>
        <task v-else-if="mineTag=='task'" :name="name"></task>
        <schedule v-else-if="mineTag=='schedule'" :name="name"></schedule>
        <file v-else-if="mineTag=='file'" :name="name"></file>
        <collect v-else-if="mineTag=='collect'" :name="name" :content="content"></collect>
      </Content>
    </div>
  </div>
</template>
<script>
import nearThing from "./mine/nearThing";
import task from "./mine/mineTask";
import schedule from "./mine/mineSchedule";
import file from "./mine/mineFile";
import collect from "./mine/mineCollect";

import { mapMutations, mapState } from "vuex";
export default {
  components: {
    nearThing, //近期的事
    task, //任务
    schedule, //日程
    file, //文件
    collect //收藏
  },
  data() {
    return {
      hover: "nearThing",
      mineTag: "nearThing",
      showFold: true,
      fold: true,
      MenuList: [
        {
          oneName: "近期的事",
          name: "nearThing,1",
          icon: "ios-albums-outline",
          childNode: [
            { text: "任务", name: "nearThing,1" },
            { text: "日程", name: "nearThing,2" }
          ]
        },
        {
          oneName: "任务",
          name: "task,1",
          icon: "ios-list-box-outline",
          childNode: [
            { text: "我执行的", name: "task,1" },
            { text: "我创建的", name: "task,2" },
            { text: "我参与的", name: "task,3" }
          ]
        },
        {
          oneName: "日程",
          name: "schedule,1",
          icon: "ios-calendar-outline",
          childNode: [
            { text: "未来的日程", name: "schedule,1" },
            { text: "过去的日程", name: "schedule,2" }
          ]
        },
        {
          oneName: "文件",
          name: "file,1",
          icon: "ios-folder-outline",
          childNode: [
            { text: "我创建的", name: "file,1" },
            { text: "我参与的", name: "file,2" },
            { text: "我下载的", name: "file,3" }
          ]
        },
        {
          oneName: "收藏",
          name: "collect,2,任务",
          icon: "ios-star-outline",
          childNode: [
            // { text: "所有收藏", name: "collect,1,所有收藏" },
            { text: "任务", name: "collect,2,任务" },
            { text: "分享", name: "collect,3,分享" },
            { text: "文件", name: "collect,4,文件" },
            { text: "日程", name: "collect,5,日程" }
          ]
        }
      ],
      name: "",
      content: "" // 收藏需要传的值
    };
  },
  mounted() {},
  methods: {
    ...mapMutations("user", ["changeMineRouter", "changeProjectRouter"]),
    ...mapState("user", ["projectRouter"]),
    closeMine() {
      this.$router.push(localStorage.projectRouter);
    },
    //切换TAG
    openTag(tagName) {
      if (tagName == "foldMenu") {
        this.foldMenu();
      } else if (tagName == "openMenu") {
        this.openMenu();
      } else {
        this.name = tagName.split(",")[1];
        this.mineTag = tagName.split(",")[0];
        this.hover = tagName.split(",")[0];
        if (this.mineTag == "collect") {
          this.content = tagName.split(",")[2];
        }
      }
    },
    //折叠菜单
    foldMenu() {
      this.fold = false;
      this.showFold = false;
      this.$store.commit("app/changeHeader", false);
    },
    //收起菜单
    openMenu() {
      this.$store.commit("app/changeHeader", true);
      this.fold = true;
      setTimeout(() => {
        this.showFold = true;
      }, 300);
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.mineRouter = from.fullPath;
    next(vm => {
      // vm.changeMineRouter(from.fullPath)
    });
  }
  // beforeRouteEnter(to, from, next){
  //     localStorage.projectRouter=from.fullPath
  //     next(vm => {
  //         // vm.changeProjectRouter(from.fullPath)
  //
  //     })
  // },
};
</script>
<style scoped lang="less">
@import "./Mine";
</style>