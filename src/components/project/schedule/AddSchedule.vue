<template>
  <Modal class="addSchedule" v-model="modal" width="600" @on-ok="clone" @on-cancel="clone">
    <div class="add-schedule-head">
      <slot name="projectName">没有项目名称</slot>
    </div>
    <div class="direct">
      <textarea class="textarea" v-model="title" placeholder="请输入日程标题"></textarea>
      <div class="time">
        <Checkbox v-model="checkbox">
          <span>全天</span>
        </Checkbox>
        <Icon type="md-calendar" />
        <DatePicker v-if="checkbox" confirm class="datePicker" @on-ok="openDate = !openDate" @on-change="DatePicker" :open="openDate" v-model="datetime" type="daterange" format="yyyy-MM-dd">
          <span class="timeText" @click="openDate = !openDate">{{ datetime[0] ? datetime[0].Format("yyyy-MM-dd") : "开始日期" }}</span>
          <span class="timeText">-</span>
          <span class="timeText" @click="openDate = !openDate">{{ datetime[1] ? datetime[1].Format("yyyy-MM-dd") : "结束日期" }}</span>
        </DatePicker>
        <DatePicker v-if="!checkbox" class="datePicker" @on-ok="openDate = !openDate" @on-change="DatePicker" :open="openDate" v-model="datetime" type="datetimerange" format="yyyy-MM-dd hh:mm">
          <span class="timeText" @click="openDate = !openDate">{{ datetime[0] ? datetime[0].Format("yyyy-MM-dd hh:mm") : "开始日期" }}</span>
          <span class="timeText">-</span>
          <span class="timeText" @click="openDate = !openDate">{{ datetime[1] ? datetime[1].Format("yyyy-MM-dd hh:mm") : "结束日期" }}</span>
        </DatePicker>
        <Dropdown trigger="click" @on-click="Dropdown">
          <a href="javascript:void(0)" class="repetition">
            <span>{{ repetition_data }}</span>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(i, k) in repetition" :name="i" :key="k"
              >{{ i }}
              <Icon type="checkmark" v-if="repetition_data === i"></Icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <!-- <Dropdown
          trigger="click"
          @on-click="
            name => {
              remind_data = name;
            }
          "
        >
          <a href="javascript:void(0)" class="repetition">
            <Icon type="android-alarm-clock"></Icon> <span>{{ remind_data }}</span>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(i, k) in remind" :name="i" :key="k"
              >{{ i }}
              <Icon type="checkmark" v-if="remind_data === i"></Icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
      </div>
      <!-- <div class="examine">
        <Icon type="checkmark-circled"></Icon> 所有人都有时间
      </div> -->
      <div style="margin-bottom:20px">
        <scheduleMember ref="scheduleMember" :projectId="projectId"></scheduleMember>
      </div>
    </div>
    <div slot="footer">
      <div class="fl" v-if="!locked" @click="locked = !locked">
        <p><Icon type="unlocked"></Icon> 隐私模式</p>
        <p>所有成员可见</p>
      </div>
      <div class="fl" v-if="locked" @click="locked = !locked">
        <p><Icon type="locked"></Icon> 隐私模式</p>
        <p>仅参与者可见</p>
      </div>
      <Button type="info" size="large" :loading="loading" @click="addSchedules">创建</Button>
    </div>
  </Modal>
</template>

<script>
import scheduleMember from "./InvolveMember.vue";
import { addSchedule } from "@/axios/api";
import { mapActions } from "vuex";
export default {
  components: {
    scheduleMember
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      projectId: this.$route.params.id,
      showUserList: false,
      title: "",
      repetition: ["不重复", "每天重复", "每周重复", "每月重复", "每年重复", "工作日重复"],
      repetition_data: "不重复",
      remind: ["不提醒", "5分钟前", "15分钟前", "30分钟前", "1小时前", "2小时前", "1天前"],
      remind_data: "不提醒",
      locked: false,
      modal: false,
      loading: false,
      checkbox: false,
      openDate: false,
      memberIds: [],
      tx: [],
      datetime: ["", ""]
    };
  },
  mounted() {
    this.inits();
  },
  watch: {
    value(newValue, oldValue) {
      this.modal = newValue;
    }
  },
  methods: {
    select(i) {
      console.log(i);
      if (this.memberIds.indexOf(i.userId) === -1) {
        this.tx.push(i.defaultImage);
        this.memberIds.push(i.userId);
      }
    },
    DatePicker(time) {
      console.log("time", time);
    },
    Dropdown(name) {
      // console.log(name)
      this.repetition_data = name;
    },
    inits() {
      this.modal = this.value;
    },
    clone() {
      this.$emit("input", false);
    },
    addSchedules() {
      this.loading = true;
      let data = {
        projectId: this.projectId,
        scheduleName: this.title,
        startTime: this.datetime[0] ? this.datetime[0].getTime().toString() : new Date().getTime().toString(),
        endTime: this.datetime[1] ? this.datetime[1].getTime().toString() : new Date().getTime().toString(),
        repeat: this.repetition_data,
        // remind: this.remind_data,
        memberIds: this.$refs.scheduleMember.getIds().join(","),
        privacy: this.locked ? "1" : "0",
        isAllday: this.checkbox ? 1 : 0
      };
      addSchedule(data).then(res => {
        this.loading = false;
        this.clone();
        this.clear();
        if (res.result == 1) {
          this.$Message.success("创建成功");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    clear() {
      this.title = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.add-schedule-head {
  display: flex;
  align-items: center;
  padding: 0 18px;
  font-size: 14px;
  padding-top: 13px;
}
.cyz {
  display: flex;
  flex-wrap: wrap;
}
.member-avatar {
  .ava {
    margin-right: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    img {
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .close {
      display: none;
    }
  }
}
.member-avatar:not(:nth-child(1)) {
  .ava {
    margin-right: 5px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 50%;
    &:hover {
      border: 2px solid #a6a6a6;
      .close {
        display: block;
      }
    }
    img {
      display: block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .close {
      position: absolute;
      font-size: 14px;
      top: -3px;
      right: 1px;
      width: 12px;
      height: 12px;
      line-height: 12px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      background-color: #a6a6a6;
      display: none;
      &:hover {
        background-color: #3da8f5;
      }
    }
  }
}
.addSchedule {
  .repetition span {
    font-size: 12px;
    float: left;
    line-height: 26px;
    margin-left: 5px;
  }
  .ivu-modal-footer {
    display: block;
  }
  .participant {
    .title {
      font-size: 14px;
      font-weight: 700;
    }
    .user {
      // overflow: hidden;
      height: 30px;
      padding-top: 5px;
    }
    .ivu-icon {
      font-size: 24px;
      float: left;
      color: #3696dc;
      cursor: pointer;
    }
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 0;
      float: none;
    }
  }
  .direct {
    padding: 15px 18px;
  }
  .examine {
    font-size: 13px;
    color: grey;
    line-height: 20px;
    border-bottom: 1px solid rgb(224, 224, 224);
    padding-bottom: 20px;
    margin-bottom: 20px;
    .ivu-icon {
      color: #75c940;
      font-size: 20px;
      float: left;
      margin-right: 7px;
    }
  }
  .time {
    width: 100%;
    padding: 10px 0;
    color: grey;
    overflow: hidden;
    font-size: 14px;
    .ivu-dropdown {
      float: left;
    }
    .ivu-dropdown-rel {
      overflow: hidden;
    }
    .ivu-icon-android-refresh {
      margin-top: 4px;
    }
    .ivu-icon-checkmark {
      float: right !important;
      font-size: 13px !important;
    }
    .ivu-icon {
      // margin-left: 15px;
      font-size: 20px;
      float: left;
      cursor: pointer;
      margin-top: 1px;
    }
    .ivu-date-picker {
      float: left;
      .ivu-date-picker-rel {
        height: 25px;
      }
    }
    .ivu-checkbox-wrapper,
    .timeText {
      float: left;
      line-height: 25px;
      margin-left: 5px;
    }
    .ivu-checkbox-wrapper {
      transform: scale(1.2, 1.2);
      margin-left: 5px;
      margin-right: 0;
    }
  }
  .textarea {
    height: 60px;
    width: 100%;
    padding: 10px 15px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    min-height: 60px;
    max-height: 60px;
    font-size: 14px;
  }
  .ivu-modal-footer .fl {
    text-align: left;
    cursor: pointer;
  }
  .ivu-icon-ios-arrow-forward:before {
    content: "";
  }
  .ivu-icon-ios-arrow-back:before {
    content: "";
  }
  .ivu-date-picker-prev-btn-arrow-double {
    margin-left: 0px;
  }
}
</style>
