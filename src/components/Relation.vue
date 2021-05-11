<template>
  <div class="relation-modal">
    <header class="relation-header">
      <div class="relation-title">
        <span>关联内容</span>
        <Icon type="ios-close" size="31" @click.native="close" />
      </div>
    </header>
    <section class="relation-content">
      <ul class="relation-picker-menu">
        <li :class="{ actived: chooseType == 'task' }" @click="choose('task')"><Icon type="ios-open-outline" size="20" />任务</li>
        <li :class="{ actived: chooseType == 'share' }" @click="choose('share')"><Icon type="ios-paper-outline" size="20" />分享</li>
        <li :class="{ actived: chooseType == 'schedule' }" @click="choose('schedule')"><Icon type="ios-calendar-outline" size="20"></Icon>日程</li>
        <li :class="{ actived: chooseType == 'file' }" @click="choose('file')"><Icon type="ios-folder-outline" size="20"></Icon>文件</li>
      </ul>
      <div class="relation-picker-body flex-fill">
        <ul class="object-menu">
          <li><span>当前项目</span></li>
          <li v-for="(project, index) in projectList" @click="showData(index, project.projectId)" :class="{ choose: projectIdnex == index }" :key="index">
            <p>{{ project.projectName }}</p>
          </li>
        </ul>
        <div class="object-content flex-fill">
          <div class="object-picker-tasks-view" ref="objectContent" v-if="chooseType == 'task'">
            <ul class="tasklist-list">
              <li><span>任务分组</span></li>
              <li v-for="(relation, index) in relationList" :class="{ actived: relationIndex == index }" :key="index" @click="showAllTask(index, relation.relationId)">
                <p>{{ relation.relationName }}</p>
              </li>
            </ul>
            <ul class="tasks-list-wrapper">
              <li class="column" v-for="(data, index) in taskData" :key="index">
                <div v-for="(item, k) in data" :key="k">
                  <p class="column-group-name">{{ item.relationName }}</p>
                  <ul class="column-group-task">
                    <li v-for="(task, i) in item.taskList" :key="i" @click="showSub(task, index, i)" class="column-task-name" :class="{ choose: checkedOneTask.level == index && checkedOneTask.index == i, disabled: task.taskId == publicId }">
                      <div>
                        <Avatar icon="ios-person" :src="task.executorImg" class="avatar" />
                      </div>
                      <Tooltip :content="task.taskName" max-width="220" placement="top" class="tooltip" transfer>
                        <p>{{ task.taskName }}</p>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div class="object-picker-share-view" v-if="chooseType == 'share'">
            <ul class="share-list">
              <li :class="{ choose: shareIndex == index, disabled: share.id == publicId }" v-for="(share, index) in shareData" :key="index" @click="checkShare(share, index)">
                <Icon type="ios-paper-outline" size="20" />
                <span>{{ share.title }}</span>
              </li>
            </ul>
          </div>
          <div class="object-picker-schedule-view" v-if="chooseType == 'schedule'">
            <div class="schedule-title">未来的日程·{{ shceduleAfterData.length }}</div>
            <ul class="future-schedule">
              <li :class="{ choose: afterScheduleIndex == index, disabled: schedule.scheduleId == publicId }" @click="checkSchedule(-1, index, schedule)" v-for="(schedule, index) in shceduleAfterData" :key="index">
                <span>
                  <Icon type="ios-calendar-outline" size="20" />
                  <span style="margin-left: 10px;">{{ schedule.scheduleName }}</span>
                </span>
                <div class="rc-time">
                  <Time :time="schedule.startTime" type="date" />
                </div>
              </li>
            </ul>
            <div class="schedule-title">
              过去的日程·{{ shceduleBeforData.length }}
              <span @click="showOldRc = !showOldRc">{{ showOldRc ? "隐藏" : "显示" }}</span>
            </div>
            <Collapse v-show="showOldRc" simple v-for="(i, n) in shceduleBeforData" :key="n">
              <Panel name="1"
                >{{ i.date }}
                <div slot="content">
                  <ul class="future-schedule">
                    <li :class="{ choose: beforeIndex.n == n && beforeIndex.index == index, disabled: item.scheduleId == publicId }" @click="checkSchedule(n, index, item)" v-for="(item, index) in i.scheduleList" :key="index">
                      <span>
                        <Icon type="ios-calendar-outline" size="20" />
                        <span style="margin-left: 10px;">{{ item.scheduleName }}</span>
                      </span>
                      <div class="rc-time">
                        <Time :time="item.startTime" type="date" />
                      </div>
                    </li>
                  </ul>
                </div>
              </Panel>
            </Collapse>
          </div>
          <div class="object-picker-file-view" v-if="chooseType == 'file'" ref="fileContent">
            <ul class="file-list-wrapper">
              <li class="file-column" v-for="(item, index) in fileData">
                <ul class="file-column-content">
                  <li class="file-group-name">文件夹</li>
                  <li v-for="(file, i) in item" v-if="file.catalog == 1" @click="showFile(file, index, i)" :class="{ choose: checkedOneFile.level == index && checkedOneFile.index == i }">
                    <Icon type="md-folder" v-if="file.catalog" size="24" color="#3da8f5" />
                    <img v-else src="@/icons/img/moren.png" alt="" />
                    <Tooltip :content="file.fileName" max-width="220" placement="top" transfer style="height:30px">
                      <span>{{ file.fileName }}</span>
                    </Tooltip>
                  </li>
                  <li class="file-group-name">文件</li>
                  <li v-for="(file, i) in item" v-if="file.catalog == 0" @click="showFile(file, index, i)" :class="{ choose: checkedOneFile.level == index && checkedOneFile.index == i, disabled: file.fileId == publicId }">
                    <img src="@/icons/img/moren.png" alt="" />
                    <Tooltip :content="file.fileName" max-width="220" placement="top" transfer style="height:30px">
                      <span>{{ file.fileName }}</span>
                    </Tooltip>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <footer class="relation-footer">
      <Button type="primary" @click="relation" :disabled="btnDisabled" class="relation-footer-btn">
        确定
      </Button>
    </footer>
  </div>
</template>
<script>
import { getProjectList } from "@/axios/api";
import { getFenzu, getTask, getChildTask, shares, schedules, files, addRelation } from "@/axios/relevanceApi";
export default {
  props: ["publicId", "fromType"],
  data() {
    return {
      orgId: localStorage.companyId,
      chooseType: "task",
      projectList: [],
      projectIdnex: -1,
      projectId: this.$route.params.id,
      relationIndex: -1,
      relationList: [],
      taskData: [],
      showMenus: false,
      checkedOneTask: { level: -1, index: -1 },
      checkedOneFile: { level: -1, index: -1 },
      relationData: {
        publicId: this.publicId,
        fromType: this.fromType,
        bindId: "",
        publicType: "",
        projectId: this.$route.params.id,
      },
      shareData: [],
      shareIndex: -1,
      afterScheduleIndex: -1,
      beforeIndex: { n: -1, index: -1 },
      shceduleAfterData: [],
      shceduleBeforData: [],
      showOldRc: false,
      fileData: [],
      btnDisabled: true,
    };
  },
  mounted() {
    this.projects();
  },
  methods: {
    //项目列表
    projects() {
      getProjectList(this.orgId).then((res) => {
        if (res.result == 1) {
          this.projectList = res.data;
          this.projectIdnex = this.projectList.findIndex((project) => project.projectId == this.projectId);
          this.relations(this.projectId);
        } else {
          this.$Message.error("获取项目失败");
        }
      });
    },
    //分组列表
    relations(projectId) {
      getFenzu(projectId).then((res) => {
        if (res.result == 1) {
          this.relationList = res.data;
        } else {
          this.$Message.error("获取任务分组失败");
        }
      });
    },
    close() {
      this.$emit("close");
    },
    choose(type) {
      this.chooseType = type;
      this.relationData.bindId = "";
      this.relationIndex = -1;
      this.btnDisabled = true;
      if (type == "task") {
        this.taskData.splice(0, this.taskData.length);
        this.relationData.publicType = "任务";
        this.relations(this.projectId);
      } else if (type == "file") {
        this.relationData.publicType = "文件";
        this.fileData.splice(0, this.fileData.length);
        files(this.projectId).then((res) => {
          if (res.result == 1) {
            this.fileData.push(res.data);
          }
        });
      } else if (type == "schedule") {
        this.relationData.publicType = "日程";
        schedules(this.projectId).then((res) => {
          if (res.result == 1) {
            this.shceduleBeforData = res.data.before;
            this.shceduleAfterData = res.data.after;
          }
        });
      } else {
        this.relationData.publicType = "分享";
        shares(this.projectId).then((res) => {
          if (res.result == 1) {
            this.shareData = res.data;
          }
        });
      }
    },
    showData(index, projectId) {
      this.projectIdnex = index;
      this.projectId = projectId;
      this.relationIndex = -1;
      this.btnDisabled = true;
      if (this.chooseType == "task") {
        this.taskData.splice(0, this.taskData.length);
        this.relationData.publicType = "任务";
        this.relations(projectId);
      } else if (this.chooseType == "file") {
        this.relationData.publicType = "文件";
        this.fileData.splice(0, this.fileData.length);
        files(projectId).then((res) => {
          if (res.result == 1) {
            this.fileData.push(res.data);
          }
        });
      } else if (this.chooseType == "schedule") {
        this.relationData.publicType = "日程";
        schedules(projectId).then((res) => {
          if (res.result == 1) {
            this.shceduleBeforData = res.data.before;
            this.shceduleAfterData = res.data.after;
          }
        });
      } else {
        this.relationData.publicType = "分享";
        shares(projectId).then((res) => {
          if (res.result == 1) {
            this.shareData = res.data;
          }
        });
      }
    },
    showAllTask(index, relationId) {
      this.relationIndex = index;
      this.showMenus = true;
      this.taskData.splice(0, this.taskData.length);
      getTask(relationId).then((res) => {
        this.taskData.push(res.data);
      });
    },
    showSub(item, index, i) {
      this.checkedOneTask.level = index;
      this.checkedOneTask.index = i;
      this.btnDisabled = false;
      this.relationData.bindId = item.taskId;
      this.relationData.publicType = "任务";
      if (item.level == index) {
        this.taskData.splice(index + 1, this.taskData.length - (index + 1));
        getChildTask(item.taskId).then((res) => {
          if (res.result == 1) {
            this.taskData.splice(index + 1, 1, res.data);
            this.$nextTick(() => {
              this.$refs.objectContent.scrollLeft = this.$refs.objectContent.scrollWidth;
            });
          }
        });
      }
    },
    showFile(file, index, i) {
      this.checkedOneFile.level = index;
      this.checkedOneFile.index = i;
      if (file.catalog == 1 && file.level == index + 1) {
        this.relationData.bindId = "";
        this.btnDisabled = true;
        this.fileData.splice(index + 1, this.fileData.length - (index + 1));
        files(file.fileId).then((res) => {
          if (res.result == 1) {
            this.fileData.splice(index + 1, 1, res.data);
            this.$nextTick(() => {
              this.$refs.fileContent.scrollLeft = this.$refs.fileContent.scrollWidth;
            });
          }
        });
      } else {
        this.btnDisabled = false;
        this.relationData.bindId = file.fileId;
      }
    },
    checkShare(share, index) {
      this.shareIndex = index;
      this.relationData.bindId = share.id;
      this.btnDisabled = false;
    },
    checkSchedule(n, index, schedule) {
      this.btnDisabled = false;
      console.log(n);
      if (n == -1) {
        this.afterScheduleIndex = index;
      } else {
        this.beforeIndex.n = n;
        this.beforeIndex.index = index;
      }
      this.relationData.bindId = schedule.scheduleId;
    },
    relation() {
      console.log(this.relationData);
      addRelation(this.relationData).then((res) => {
        if (res.result == 1) {
          this.$emit("close");
          this.$Message.success("关联成功");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.relation-modal {
  height: 540px;
  .relation-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    .relation-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      margin: 0;
      padding: 15px;
      font-size: 15px;
      font-weight: 700;
      color: #595959;
      i {
        &:hover {
          background-color: #ecf6fe;
          color: #1b9aee;
          border-radius: 4px;
        }
      }
    }
  }
  .relation-content {
    height: 436px;
    display: flex;
    .relation-picker-menu {
      width: 180px;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      overflow-y: auto;
      padding: 8px 0;

      li {
        height: 34px;
        line-height: 34px;
        list-style: none;
        cursor: pointer;
        &:hover {
          color: #3da8f5;
          background-color: #f0f0f0;
        }
        i {
          margin-left: 15px;
          margin-right: 15px;
        }
      }
    }
    .relation-picker-body {
      display: flex;
      .choose {
        color: #ffffff;
        background-color: #3da8f5;
      }
      .object-menu {
        width: 180px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        overflow-x: hidden;
        overflow-y: auto;
        li:first-child {
          color: #595959;
          font-size: 13px;
          font-weight: 700;
          display: block;
          padding: 5px 15px;
          overflow: hidden;
        }
        li {
          list-style: none;
          cursor: pointer;
          p {
            display: block;
            padding: 5px 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              color: #3da8f5;
              background-color: #f0f0f0;
            }
          }
        }
      }
      .object-content {
        display: flex;
        overflow: hidden;
        width: 100%;
        .object-picker-tasks-view {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          align-items: stretch;
          flex-direction: row;
          display: flex;
          .tasks-list-wrapper {
            width: 260px;
          }
          .tasklist-list {
            width: 180px;
            height: 100%;
            border-right: 1px solid rgba(0, 0, 0, 0.12);
            li:first-child {
              color: #595959;
              font-size: 13px;
              font-weight: 700;
              display: block;
              padding: 5px 15px;
              overflow: hidden;
            }
            li {
              list-style: none;
              cursor: pointer;
              p {
                display: block;
                padding: 5px 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover {
                  color: #3da8f5;
                  background-color: #f0f0f0;
                }
              }
            }
          }
        }
        .object-picker-share-view {
          width: 100%;
          .choose {
            color: #3da8f5;
            background-color: #f0f0f0;
          }
          .share-list {
            li {
              list-style: none;
              display: block;
              padding: 5px 15px;
              overflow: hidden;
              &:hover {
                color: #3da8f5;
                background-color: #f0f0f0;
              }
              span {
                margin-left: 10px;
              }
            }
          }
        }
        .object-picker-schedule-view {
          width: 100%;
          .schedule-title {
            padding: 5px 15px;
            span {
              color: #3da8f5;
              cursor: pointer;
            }
          }
          .future-schedule {
            width: 100%;
            li {
              list-style: none;
              display: flex;
              align-items: center;
              padding: 5px 15px;
              overflow: hidden;
              justify-content: space-between;
              &:hover {
                color: #3da8f5;
                background-color: #f0f0f0;
              }
            }
          }
        }
        .object-picker-file-view {
          display: flex;
          flex: 1;
          min-width: 0%;
          width: 485px;
          .file-list-wrapper {
            display: flex;
            justify-content: stretch;
            white-space: nowrap;
            overflow-y: hidden;
            overflow-x: auto;
            flex-direction: row;
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .flex-fill {
      flex: 1 1 auto;
    }
  }
  .relation-footer {
    height: 53px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    padding-right: 10px;
    position: relative;
    .relation-footer-btn {
      width: 100px;
      position: absolute;
      right: 10px;
    }
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: #e5e5e5;
  border-left: 2px solid transparent;
}

::-webkit-scrollbar-thumb {
  border-left: 2px solid transparent;
  background-color: #8c8c8c;
}

.column {
  display: inline-block;
  vertical-align: top;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid #e5e5e5;
  flex-shrink: 0;
  flex-direction: column;
  list-style: none;
  height: 100%;
  width: 260px;
  .column-group-task {
    .choose {
      color: #3da8f5;
      background-color: #f0f0f0;
    }
    .disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.6;
    }
  }
  .column-group-name {
    color: #595959;
    font-size: 13px;
    font-weight: 700;
    display: block;
    padding: 5px 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .column-task-name {
    padding: 5px 5px;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      color: #3da8f5;
      background-color: #f0f0f0;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 200px;
    }
    .avatar {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
    .tooltip {
      width: 200px;
    }
  }
}
.file-column {
  overflow-x: hidden;
  overflow-y: auto;
  width: 220px;
  min-width: 220px;
  border-right: 1px solid #e5e5e5;
  .file-column-content {
    .file-group-name {
      color: #595959;
      font-size: 13px;
      font-weight: 700;
      display: block;
      padding: 5px 15px;
      overflow: hidden;
    }
    li:not(.file-group-name) {
      display: flex;
      align-items: center;
      list-style: none;
      cursor: pointer;
      padding: 5px 15px;
      img {
        width: 24px;
        height: 25px;
      }
      &:hover {
        color: #3da8f5;
        background-color: #f0f0f0;
      }
      span {
        display: block;
        padding: 5px 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
      }
    }
  }
}
.actived {
  color: #3da8f5;
  background-color: #f0f0f0;
}
</style>
