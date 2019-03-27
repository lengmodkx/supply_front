<template>
  <Modal class="addSchedule" v-model="modal" width="600" @on-ok="clone" @on-cancel="clone">
    <p slot="header">
      添加日程到 - 阿拉丁bug管理系统
    </p>
    <div class="direct">
      <textarea class="textarea" v-model="title" placeholder="日程标题"></textarea>
      <div class="time">
        <Checkbox v-model="checkbox">
          <span>全天</span>
        </Checkbox>
        <Icon type="md-calendar" />
        <DatePicker v-if="checkbox" confirm class="datePicker" @on-ok="openDate=!openDate" @on-change="DatePicker" :open="openDate" v-model="datetime" type="daterange" format="yyyy-MM-dd">
          <span class="timeText" @click="openDate=!openDate">{{datetime[0]?datetime[0].Format('yyyy-MM-dd'):'开始日期'}}</span>
          <span class="timeText">-</span>
          <span class="timeText" @click="openDate=!openDate">{{datetime[1]?datetime[1].Format('yyyy-MM-dd'):'结束日期'}}</span>
        </DatePicker>
        <DatePicker v-if="!checkbox" class="datePicker" @on-ok="openDate=!openDate" @on-change="DatePicker" :open="openDate" v-model="datetime" type="datetimerange" format="yyyy-MM-dd hh:mm">
          <span class="timeText" @click="openDate=!openDate">{{datetime[0]?datetime[0].Format('yyyy-MM-dd hh:mm'):'开始日期'}}</span>
          <span class="timeText">-</span>
          <span class="timeText" @click="openDate=!openDate">{{datetime[1]?datetime[1].Format('yyyy-MM-dd hh:mm'):'结束日期'}}</span>
        </DatePicker>
        <Dropdown trigger="click" @on-click='Dropdown'>
          <a href="javascript:void(0)" class='repetition'>
             <span>{{repetition_data}}</span>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for='(i, k) in repetition' :name='i' :key="k">{{i}}
              <Icon type="checkmark" v-if='repetition_data===i'></Icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown trigger="click" @on-click='name=>{remind_data=name}'>
          <a href="javascript:void(0)" class="repetition">
            <Icon type="android-alarm-clock"></Icon> <span>{{remind_data}}</span>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem v-for='(i, k) in remind' :name='i' :key="k">{{i}}
              <Icon type="checkmark" v-if='remind_data===i'></Icon>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <!-- <div class="examine">
        <Icon type="checkmark-circled"></Icon> 所有人都有时间
      </div> -->
      <div class="participant">
        <p class="title">参与者 · {{memberIds.length}}</p>
        <div class="user">
          <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+tx[k]" alt="" :key="k" v-for="(i, k) in memberIds">
          <Icon type="md-add-circle" @click.native="showUserList=!showUserList" />
          <Modal v-model="showUserList" transfer mask-closable width="300">
            <userList :id='id' @select='select'></userList>
          </Modal>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div class="fl" v-if='!locked' @click='locked=!locked'>
        <p>
          <Icon type="unlocked"></Icon> 隐私模式
        </p>
        <p>所有成员可见</p>
      </div>
      <div class="fl" v-if='locked' @click='locked=!locked'>
        <p>
          <Icon type="locked"></Icon> 隐私模式
        </p>
        <p>仅参与者可见</p>
      </div>
      <Button type="info" size="large" :loading="loading" @click="addSchedules">创建</Button>
    </div>
  </Modal>
</template>

<script>
import { addSchedule } from "@/axios/api";
import userList from "@/components/resource/userList.vue";
export default {
  name: "",
  components: { userList },
  data() {
    return {
      showUserList: false,
      title: "",
      repetition: [
        "不重复",
        "每天重复",
        "每周重复",
        "每月重复",
        "每年重复",
        "工作日重复"
      ],
      repetition_data: "不重复",
      remind: [
        "不提醒",
        "5分钟前",
        "15分钟前",
        "30分钟前",
        "1小时前",
        "2小时前",
        "1天前"
      ],
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
  props: {
    id: String,
    value: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    value(newValue, oldValue) {
      console.log(">>>>>>", newValue);
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
    init() {
      this.modal = this.value;
      console.log("<<<<<<<<<<", this.modal);
    },
    clone() {
      this.$emit("input", false);
    },
    addSchedules() {
      this.loading = true;
      let data = {
        projectId: this.id,
        scheduleName: this.title,
        startTime: this.datetime[0]
          ? this.datetime[0].getTime().toString()
          : new Date().getTime().toString(),
        endTime: this.datetime[1]
          ? this.datetime[1].getTime().toString()
          : new Date().getTime().toString(),
        repeat: this.repetition_data,
        remind: this.remind_data,
        memberIds: this.memberIds.join(","),
        privacy: this.locked ? "1" : "0"
      };
      console.log(this.datetime);
      addSchedule(data)
        .then(res => {
          console.log(res);
          this.loading = false;
          this.$Message.info("成功");
          this.clone();
          setTimeout(() => {
            window.location.reload();
          }, 10);
        })
        .catch(err => {
          this.loading = false;
          this.$Message.info("失败");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
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
      float: left;
      border-radius: 50%;
      margin-right: 10px;
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
      margin-left: 15px;
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
}
</style>
