<template>
  <div class="recycle-con">
    <ul class="recycle-left">
      <li :class="{ checked: nowChecked === 'task' }" @click="changeNav('task')"><Icon type="md-checkbox-outline" />任务</li>
      <li :class="{ checked: nowChecked === 'share' }" @click="changeNav('share')"><Icon type="ios-paper-outline" />分享</li>
      <li :class="{ checked: nowChecked === 'schedule' }" @click="changeNav('schedule')"><Icon type="ios-calendar-outline" />日程</li>
      <li :class="{ checked: nowChecked === 'file' }" @click="changeNav('file', '文件')"><Icon type="ios-document-outline" />文件</li>
      <li :class="{ checked: nowChecked === 'folder' }" @click="changeNav('folder', '文件夹')"><Icon type="ios-folder-outline" />文件夹</li>
      <!-- <li :class="{ checked: nowChecked === 'group' }" @click="changeNav('group')"><Icon type="ios-paper-outline" />分组</li> -->
      <li :class="{ checked: nowChecked === 'tag' }" @click="changeNav('tag')"><Icon type="ios-pricetag-outline" />标签</li>
    </ul>
    <div class="recycle-right" v-if="dataList">
      <div v-if="dataList.length>0" class="has-con">
        <header class="recycle-head"><span>名称</span><span>修改时间</span></header>
        <div class="recycle-list" v-for="(info, index) in dataList" :key="index">
          <div class="name"><span>{{ info.publicName }}</span><span v-if="info.ext">{{info.ext}}</span></div>
          <p class="time">{{ $moment(info.updateTime).format("YYYY-MM-DD") }}</p>
          <Poptip class="task-menuwrapper" placement="bottom" transfer trigger="hover">
            <div slot="content" class="task-menuwrapper-content">
              <div class="recyTitle">
                恢复内容
                <!-- <Icon type="md-close"  class="closePop" @click="closePop" /> -->
              </div>
              <div v-if="nowChecked === 'task'">
                <div class="con6">
                  <div class="con5item2" @on-open-change="getProjectList" @on-change="getGroupList">
                    <span>项目</span>
                    <Select v-model="model1" style="width:150px" placeholder="当前项目" @on-open-change="getProjectList" @on-change="getGroupList">
                      <OptionGroup label="星标项目">
                        <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
                      </OptionGroup>
                      <OptionGroup label="非星标项目">
                        <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
                      </OptionGroup>
                    </Select>
                  </div>
                  <div class="con5item2">
                    <span>分组</span>
                    <template>
                      <Select style="width:150px" placeholder="当前分组" @on-change="getMenuLists">
                        <Option v-for="item in groupList" :value="item.relationId" :key="item.relationId">{{ item.relationName }}</Option>
                      </Select>
                    </template>
                  </div>
                  <div class="con5item2">
                    <span>列表</span>
                    <template>
                      <Select style="width:150px" placeholder="当前列表" @on-change="getMenuId">
                        <Option v-for="item in menuList" :value="item.relationId" :key="item.relationId">{{ item.relationName }}</Option>
                      </Select>
                    </template>
                  </div>
                  <div class="con5tip">你可以在任务板中添加和修改任务分组及任务列表</div>
                  <Button type="primary" long @click="recycleTask(info.id)">确定</Button>
                </div>
              </div>
              <div v-else>
                <div class="con5tip">恢复内容后将移动至根目录，确认恢复内容？</div>
                <Button type="primary" long @click="recycleSure(info.id)">确定</Button>
              </div>
            </div>

            <div><Icon type="md-refresh" />恢复内容</div>
          </Poptip>
          <div  @click="deleteForever(info.id)" style="cursor:pointer"><Icon type="ios-trash-outline" />彻底删除</div>
        </div>
      </div>
      <div v-else class="no-con">
        <img src="../../icons/img/recycle.png" alt="" />
        <p>回收站暂无内容</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  collectTask,
  updateTaskPrivacy,
  cancelCollect,
  taskToRecycle,
  getStarProjectList,
  getGroupList,
  getMenuList,
  copyTask,
  moveTask,
  delProject,
  delRWProject,
  delFXProject,
  delRCProject,
  delWJProject,
  delFZProject,
  delBQProject
} from "../../axios/api.js";
import { recycle } from "../../axios/recycleBinApi";
import { getRecycle } from "../../axios/setAndTag";
export default {
  data: function() {
    return {
      dataList: [],
      nowChecked: "task",
      projectId: this.$route.params.id,

      starProject: [],
      notStarProject: [],
      currProjectId: "",
      currGroupId: "",
      currMenuId: "",
      groupList: [],
      menuList: [],
      model1: ""
    };
  },
  mounted() {
    getRecycle(this.projectId, "task").then(res => {
      this.dataList = res.data;
    });
  },
  methods: {
    changeNav(type, filetype) {
      this.nowChecked = type;
      let fileType;
      let nowType = type;
      if (filetype === "文件") {
        fileType = 0;
      } else if (filetype === "文件夹") {
        fileType = 1;
      }
      getRecycle(this.projectId, nowType, fileType).then(res => {
        this.dataList = res.data;
      });
    },
    // 恢复内容
    recoverIt(id) {
      if (this.nowChecked == "task") {
      }
    },
    // 彻底删除
    deleteForever(id) {
      // 后端 在删除这给了7接口。所以要判断一下
      if (this.nowChecked === "task") {
        console.log("任务");
        delRWProject(id).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
      if (this.nowChecked === "share") {
        console.log("分享");
        delFXProject(id).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            console.log(this.dataList);
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
            console.log(this.dataList);
          }
        });
      }
      if (this.nowChecked === "schedule") {
        console.log("日程");
        delRCProject(id).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
      if (this.nowChecked === "file" || this.nowChecked ==='folder') {
        console.log("文件");
        delWJProject(id, this.projectId).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
      if (this.nowChecked === "group") {
        console.log("分组");
        delFZProject(id).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
      if (this.nowChecked === "tag") {
        console.log("标签");
        delBQProject(id).then(res => {
          if (res.result === 1) {
            this.$Message.success("彻底删除成功");
            this.dataList.forEach((i, n) => {
              if (i.id === id) {
                this.dataList.splice(n, 1);
              }
            });
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    recycleTask(publicId) {
      if (this.nowChecked === "task") {
        recycle(publicId, this.nowChecked, this.currProjectId, this.currGroupId, this.currMenuId).then(res => {
          if (res.result === 1) {
            getRecycle(this.projectId, this.nowChecked).then(res => {
              this.dataList = res.data;
            });
            this.$Message.success("成功");
          }
        });
      } else {
        recycle(publicId, this.nowChecked).then(res => {
          if (res.result === 1) {
            getRecycle(this.projectId, this.nowChecked).then(res => {
              this.dataList = res.data;
            });
            this.$Message.success("成功");
          }
        });
      }
    },
    //恢复文件
    recycleSure(publicId) {
      
      recycle(publicId, this.nowChecked, this.projectId).then(res => {
        if (res.result === 1) {
          var fileType = 0;
          getRecycle(this.projectId, this.nowChecked, fileType).then(res => {
            this.dataList = res.data;
          });
          this.$Message.success("恢复成功");
        }
      });
    },

    //获取项目数据
    getProjectList() {
      getStarProjectList().then(res => {
        if (res.result === 1) {
          this.notStarProject = res.notStarProject;
          this.starProject = res.starProject;
        }
      });
    },
    //获取分组数据
    getGroupList(projectId) {
      this.currProjectId = projectId;
      getGroupList(projectId).then(res => {
        if (res.result === 1) {
          this.groupList = res.data;
        }
      });
    },
    //获取菜单数据
    getMenuLists(groupId) {
      this.currGroupId = groupId;
      getMenuList(groupId).then(res => {
        if (res.result === 1) {
          this.menuList = res.data;
        }
      });
    },
    //获取选中菜单id
    getMenuId(menuId) {
      this.currMenuId = menuId;
    },
    closePop() {}
  }
};
</script>
<style socped lang="less">
.task-menuwrapper-content {
  .con5tip {
    white-space: pre-wrap;
    font-size: 12px;
    font-weight: normal;
    color: #555;
    margin: 8px 0;
  }
}

.recyTitle {
  color: #555;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #eee;

  position: relative;
  .closePop {
    position: absolute;
    top: 10px;
    right: 5px;
    font-size: 22px;
    color: #8a8a8a;
  }
}
.recycle-con {
  width: 100%;
  height: 100%;
  display: flex;
  .recycle-left {
    width: 180px;
    height: 100%;
    border-right: 1px solid #e5e5e5;
    .checked {
      background-color: #f7f7f7;
      color: #3da8f5;
    }
    li {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      cursor: pointer;
      color: gray;
      font-size: 14px;
      &:hover {
        background-color: #f7f7f7;
        color: #3da8f5;
      }
      i {
        font-size: 20px;
        margin-right: 8px;
      }
    }
  }
  .recycle-right {
    width: 620px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
  }
}
.has-con {
  width: 100%;
  .recycle-head,
  .recycle-list {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 16px;
    font-size: 14px;
    color: #a6a6a6;
  }
  .recycle-list {
    position: relative;
    display: flex;
    .name {
      color: #383838;
      width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .operate {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 230px;
      height: 100%;
      align-items: center;
      background-color: #f7f7f7;
      div {
        width: 100px;
        height: 50px;
        margin-right: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
          color: #3da8f5;
        }
      }
      i {
        font-size: 18px;
        margin-right: 5px;
      }
    }
    &:hover {
      background-color: #f7f7f7;
      .operate {
        display: flex;
      }
    }
  }
}
.no-con {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 72px;
    height: 72px;
    margin-bottom: 15px;
  }
  p {
    font-size: 16px;
    color: #a6a6a6;
    text-align: center;
  }
}
</style>
