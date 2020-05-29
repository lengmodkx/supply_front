<template>
  <div>
    <div class="task-header">
      <div class="details-scenario-config"><span class="task-header-flag">任务</span></div>
      <div class="task-header-handle">
        <Dropdown trigger="click" placement="bottom-end">
          <Tooltip content="视频讨论" placement="top" transfer>
            <Icon type="ios-videocam-outline" size="26" style="margin-right:10px" />
          </Tooltip>

          <DropdownMenu slot="list">
            <DropdownItem>立即发起</DropdownItem>
            <DropdownItem>预约</DropdownItem>
            <DropdownItem>加入ID</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Icon type="ios-more" size="31" style="margin-right:10px" />
        <Icon type="ios-close" size="31" @click.native="closeModal" />
      </div>
    </div>
    <div class="task-content">
      <div class="task-content-left">
        <Tooltip content="点击即可编辑" placement="top">
          <div class="task-title">
            <div contenteditable="true" @blur="updateTaskName()" class="task-title-input" ref="taskName">{{ task.taskName }}</div>
          </div>
        </Tooltip>
        <div class="task-basic-attrs-view">
          <div class="multi-rows-on-mini object-field-list__uJ45">
            <div class="component-mount task-status">
              <div class="object-field__1cNl">
                <div class="object-field__left">
                  <svg-icon name="task-status" class="task-img"></svg-icon>
                  <span class="object-field__name">状态</span>
                </div>
                <div class="object-field__right">
                  <Dropdown trigger="click" @on-click="taskStatusChange">
                    <div class="task-is-finish">
                      <svg-icon name="task-not-finish" class="task-not-finish" v-if="task.taskStatus == false"></svg-icon>
                      <svg-icon name="task-not-finish-hover" class="task-not-finish-hover" v-if="task.taskStatus == false"></svg-icon>
                      <svg-icon name="task-finish" class="task-finish" v-if="task.taskStatus == true"></svg-icon>
                      <svg-icon name="task-finish-hover" class="task-finish-hover" v-if="task.taskStatus == true"></svg-icon>
                      <span v-if="task.taskStatus == false">未完成</span>
                      <span v-else class="task-status-title">已完成</span>
                    </div>
                    <DropdownMenu slot="list">
                      <DropdownItem name="未完成">
                        <div class="task-status-title_01">
                          <span>未完成</span>
                          <Icon type="ios-checkmark" size="20" v-if="task.taskStatus == false" />
                        </div>
                      </DropdownItem>
                      <DropdownItem name="已完成"
                        ><div class="task-status-title_01">
                          <span style="color:#038a24">已完成</span>
                          <Icon type="ios-checkmark" size="20" v-if="task.taskStatus == true" /></div
                      ></DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div class="component-mount task-executor">
              <div class="object-field__1cNl">
                <div class="object-field__left">
                  <svg-icon name="task-executor" class="task-img"></svg-icon>
                  <span class="object-field__name">执行者</span>
                </div>
                <div class="object-field__right">
                 <div class="remove-shortcut__2G3s">
                      <span class="remove"></span>
                      <div class="content__3gKP circle">
                        <div class="executor__2pBD">
                          <div class="executor-handler not-assigned">
                            <svg-icon name="task-executor-avatar" class="task-img"></svg-icon>
                            <span class="name">待认领</span>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div class="component-mount task-date-range"></div>
          </div>
        </div>
      </div>
      <div class="task-content-right"></div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/public/common/Loading.vue";
import { mapState, mapActions } from "vuex";
import {} from "../../../../../axios/api.js";
export default {
  components: {
    Loading,
  },
  props: ["taskId"],
  data() {
    return {
      selectValue: "未完成",
    };
  },
  created() {
    this.editTask(this.taskId);
  },
  computed: {
    ...mapState("task", ["task", "joinInfoIds", "images_suffix"]),
    vuexTask() {
      return this.$store.state.task.joinInfo;
    },
  },
  mounted() {},
  methods: {
    ...mapActions("task", ["editTask"]),
    closeModal() {
      this.$emit("close");
    },
    //修改任务名称
    updateTaskName() {
      console.log(this.$refs.taskName.innerHTML);
    },
    //修改任务状态
    taskStatusChange() {},
  },
};
</script>
<style lang="less" scoped>
@import "./taskdetail";
.task-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8eaec;
  height: 60px;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  .details-scenario-config {
    background: #f2fbff;
    border-radius: 4px;
    padding: 4px 8px 4px 4px;
    cursor: not-allowed;
    width: 64px;
    height: 28px;
    text-align: center;
    .task-header-flag {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #1b9aee;
      font-weight: 500;
    }
  }
  .task-header-handle {
    i {
      color: "#999";
      &:hover {
        background-color: #ecf6fe;
        color: #1b9aee;
        border-radius: 4px;
      }
    }
  }
}
.task-content {
  display: flex;
  .task-content-left {
    flex: 6;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 20px;
    padding-top: 20px;
    .task-title {
      width: 655px;
      .task-title-input {
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        color: #262626;
        position: relative;
        word-break: break-word;
        font-size: 16px;
        &:not(.readonly):not(.disabled):focus {
          background-color: #f7f7f7;
          width: 655px;
        }
        &:not(.readonly):not(.disabled):hover {
          background-color: #f7f7f7;
          width: 655px;
        }
      }
    }
  }
  .task-content-right {
    flex: 4;
    border-left: 1px solid #e5e5e5;
  }
}
</style>
