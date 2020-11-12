<template>
  <div class="header-project">
    <div class="fl">
      <!-- <Breadcrumb separator=">">
        <BreadcrumbItem :to="toto">首页</BreadcrumbItem>
        <BreadcrumbItem>{{projectName}}</BreadcrumbItem>
      </Breadcrumb> -->
      <div class="headerTo">
        <a :href="toto">首页</a> <span> > {{ projectName }}</span>
      </div>
    </div>
    <!-- :class="RegExp(`${menu.pre}`).test(path) ? 'active' : ''" -->
    <div class="menu">
      <router-link v-for="(menu, index) in menus" :key="index" :to="`/project/${id}${menu.prefix}`" :class="{ 'is-active': $route.meta.active === menu.pre }">{{ menu.funcName }}</router-link>
    </div>

    <div class="fr">
      <a :class="{ activeHeaderTag: show == 1 }" @click="$emit('showBox', 1)">
        <Icon type="md-people" size="16" />
        {{ users.length }}
      </a>
      <a :class="{ activeHeaderTag: show == 3 }" @click="$emit('showBox', 3)">视图 </a>
      <a :class="{ activeHeaderTag: show == 2 }" @click="$emit('showBox', 2)" class="last">菜单 </a>

      <Poptip v-model="visible" placement="bottom-end" width="400">
        <a class="last screenPop" v-if="$route.meta.active == '/tasks'">筛选<Icon type="md-arrow-dropdown" size="16"/></a>
        <div slot="content">
          <Input prefix="ios-search" placeholder="搜索项目内任务" v-model="keyword" :clearable="closeBtn" />
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">执行者</div>
            <searchProMem :projectId="id" @ZzzUserId="ZzzUserId" :type="'zzz'"></searchProMem>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">标签</div>
            <div class="searcher-unit-body right-content">
              <Poptip v-model="visible1" placement="left">
                <Input placeholder="待选择" class="searcher-unit-body" :clearable="closeBtn" v-model="tagName" />
                <div slot="content">
                  <div class="dep-pop">
                    <Input prefix="ios-search" placeholder="搜索" class="mt10" @on-change="search" v-model="searchTag" />
                    <ul class="people-ul">
                      <CheckboxGroup v-model="tagId">
                        <li v-for="(item, index) in totalTag" :key="index">
                          <Checkbox :label="item.tagId" class="df people-check ac">
                            <div class="df">
                              <p>&nbsp; &nbsp;{{ item.tagName }}</p>
                            </div>
                          </Checkbox>
                        </li>
                      </CheckboxGroup>
                    </ul>
                    <div class="btn-content">
                      <div class="btns" @click="sureTagBtn">确定</div>
                    </div>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">截止日期</div>
            <div class="searcher-unit-body">
              <DatePicker :value="value2" format="yyyy/MM/dd" type="daterange" placement="left" placeholder="待选择" @on-change="changeDate"></DatePicker>
            </div>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">创建者</div>
            <searchProMem :projectId="id" @CjzUserId="CjzUserId" :type="'cjz'"></searchProMem>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">参与者</div>
            <searchProMem :projectId="id" @CyzUserId="CyzUserId" :type="'cyz'"></searchProMem>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">是否完成</div>
            <div class="searcher-unit-body ab-content">
              <RadioGroup v-model="completed" @on-change="changeCompleted">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
              <Icon type="ios-close-circle" @click="emptyCom" class="close-btn" size="16" color="#808695" />
            </div>
          </div>
          <div class="df ac searcher-unit">
            <div class="searcher-unit-title">优先级</div>
            <div class="searcher-unit-body ab-content">
              <CheckboxGroup v-model="priority" @on-change="changePriority">
                <Checkbox label="普通"></Checkbox>
                <Checkbox label="紧急"></Checkbox>
                <Checkbox label="非常紧急"></Checkbox>
              </CheckboxGroup>
              <Icon type="ios-close-circle" @click="emptyPri" class="close-btn" size="16" color="#808695" />
            </div>
          </div>
        </div>
      </Poptip>
    </div>
  </div>
</template>

<script>
import { menus, projectMembers, searchTaskByExamples, allTags, searchTags } from "../../axios/api.js";
import { mapState } from "vuex";
import searchProMem from "./searchProMem";
export default {
  props: ["show"],
  components: { searchProMem },
  data() {
    return {
      on: false,
      path: this.$route.path,
      id: this.$route.params.id,
      menus: [],
      projectName: "",
      companyId: localStorage.companyId,
      toto: "/org/" + localStorage.companyId,
      visible: true,
      value2: [],
      completed: "",
      priority: [],
      totalTag: [], //标签列表
      visible1: false,
      searchTag: "",
      closeBtn: true,
      tagId: [],
      tagName: "",
      keyword: "",
      param: {
        keyword: "",
        projectId: this.$route.params.id, //项目id
        executor: "", //执行者id
        tagId: "", //标签id
        startTime: "", //截止时间-开始时间
        endTime: "", //截止时间-结束时间
        memberId: "", //创建者id
        taskUid: "", //参与者id
        taskStatus: "", //是否完成 0未完成 1已完成
        priority: "", //优先级 普通 紧急 非常紧急
      },
    };
  },
  computed: {
    ...mapState("member", ["users"]),
  },
  mounted() {
    menus(this.id).then((res) => {
      this.menus = res.data.map((item, index) => {
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
    console.log(this.menus);
    this.getTagsList();
    this.searchTask()
  },
  methods: {
    push(u) {
      this.path = "/project/" + this.id + u;
      this.$router.push(this.path);
    },
    searchTask() {
      // searchTaskByExamples(this.param).then((res) => {
      //   console.log(res);
      // });
      let param = {
        groupId: this.$route.params.groupId,
        tagId: JSON.stringify([1, 2, 3]),
      };
      searchTaskByExamples(param).then((res) => {
        console.log(res);
      });
    },
    search() {
      if (this.searchTag) {
        searchTags({ key: this.searchTag, projectId: this.id }).then((res) => {
          if (res.result === 1) {
            this.totalTag = res.data;
          }
        });
      } else {
        this.getTagsList();
      }
    },
    getTagsList() {
      allTags(this.id, {}).then((res) => {
        if (res.result === 1) {
          this.totalTag = res.data;
          console.log(this.totalTag);
        }
      });
    },
    ZzzUserId(data) {
      this.param.executor = data;
      this.searchTask();
    },
    CjzUserId(data) {
      this.param.memberId = data;
      this.searchTask();
    },
    CyzUserId(data) {
      this.param.taskUid = data;
      this.searchTask();
    },
    changeDate(data) {
      this.param.startTime = new Date(data[0]).getTime();
      this.param.endTime = new Date(data[1]).getTime();
    },
    changeCompleted(data) {
      this.param.taskStatus = data;
    },
    changePriority(data) {
      this.param.priority = data;
    },
    sureTagBtn() {
      let tagNameList = [];
      this.totalTag.forEach((i) => {
        this.tagId.forEach((v) => {
          if (i.tagId == v) {
            tagNameList.push(i.tagName);
          }
        });
      });
      this.tagName = tagNameList.join(",");
      this.visible1 = false;
      this.param.tagId = this.tagId.join(",");
    },
    emptyCom() {
      this.completed = "";
      this.param.taskStatus = "";
    },
    emptyPri() {
      //清空优先级
      this.priority = [];
    },
  },
  watch: {
    priority(val) {
      this.param.priority = val.join(",");
      this.searchTask();
    },
    tagName(val) {
      this.searchTask();
    },
    tagId(val) {
      console.log(val);
    },
    value2(val) {
      this.searchTask();
    },
    completed(val) {
      this.searchTask();
    },
    keyword(val) {
      this.param.keyword = val;
      this.searchTask();
    },
  },
};
</script>
<style lang="less">
.headerTo {
  a {
    color: #495060;
  }
}
.activeHeaderTag {
  color: #2d8cf0 !important;
}
.blue {
  color: #2d8cf0 !important;
}
.header-project {
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  height: 40px;
  padding: 0 20px;
  padding-right: 0;
  position: fixed;
  top: 48px;
  left: 0;
  z-index: 999999;
  background-color: #f4f4f4;
  .menu {
    height: 40px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    a {
      display: inline-block;
      border-bottom: 3px solid transparent;
      height: 40px;
      line-height: 40px;
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
    margin-top: (40-16)/2px;
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
    margin-top: (40-16)/2px;
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
.searcher-unit-title {
  margin-right: 20px;
  margin-bottom: 0;
  padding: 12px 0;
  flex: none;
  width: 82px;
  color: #595959;
}
.ab-content {
  position: relative;
}
.searcher-unit-body {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-between;
  input {
    border: none;
    &:hover,
    &:focus {
      border-color: #ffffff;
      box-shadow: none;
    }
  }
  .ivu-dropdown,
  .ivu-date-picker,
  .ivu-radio-group,
  .ivu-checkbox-group {
    width: 100% !important;
    line-height: 45px;
    .ivu-dropdown-rel {
      width: 100%;
    }
  }
}
.right-content {
  padding: 4px 7px 4px 1px;
}
.searcher-unit {
  margin-top: 8px;
  .ivu-poptip {
    line-height: 45px;
    width: 100%;
    .ivu-poptip-rel {
      width: 100%;
    }
  }
}
.people-ul {
  width: 100%;
  margin-top: 10px;
  height: 200px;
  overflow: auto;
  .ivu-radio-group {
    width: 100%;
  }

  li {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }

    .people-check {
      align-items: center;
      width: 100%;
      display: flex !important;
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      margin-left: 12px;
    }

    i {
      font-size: 16px;
      color: #3da8f5;
    }
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
}
.btn-content {
  margin-top: auto;
  padding: 16px 0 6px;
  border-top: 1px solid #e5e5e5;
}
.btns {
  box-sizing: border-box;
  height: 36px;
  line-height: 36px;
  text-align: center;
  margin: 0;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  outline: 0;
  color: #fff;
  background-color: #57c5f7;
  cursor: pointer;
}
.close-btn {
  position: absolute;
  right: 0;
  top: 14px;
  cursor: pointer;
}
.screenPop {
  border-left: 1px solid #a6a6a6;
}
</style>
