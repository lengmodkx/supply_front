<template>
  <div>
    <div class="list" ref="addIcon">
      <span class="text-content" @click="open" v-if="task.planWorkHours || task.totalWorkHours"
        >计划工时{{ task.planWorkHours }}小时，实际已用工时{{ task.totalWorkHours === null ? 0 : task.totalWorkHours }}小时</span
      >
      <Button v-else icon="ios-add" type="dashed" size="small" @click="open">待添加</Button>
    </div>
    <Modal v-model="showTag" :footer-hide="true" :width="300" @on-cancel="cancel">
      <p slot="header" class="workheader">
        <span class="work-title">计划工时</span>
        <span class="work-input">
          <Tooltip content="点击即可编辑" placement="top" v-if="showplanWorkHours">
            <div class="planWork-hours" @click="showplanWorkHours = false">{{ task.planWorkHours?task.planWorkHours+'小时':'待添加' }}</div>
          </Tooltip>
          <div class="input-content" v-else>
            <Input @on-change="change" v-model="planHour" size="small" enter-button="确定" />
            <span search @click="setPlanHour" class="sure-btn">确定</span>
          </div>
        </span>
      </p>
      <div class="content">
        <div class="work-box">
          <div class="top">
            <span class="top-title">实际工时</span>
            <span v-if="task.totalWorkHours">{{ task.totalWorkHours }}小时</span>
            <span v-else>0小时</span>
          </div>
          <div class="middle">
            <div class="data">
              <Date-picker :open="opendata" :value="dataValue" confirm type="date" @on-change="handleChange" @on-clear="handleClear" @on-ok="handleOk">
                <div href="javascript:void(0)" @click="handleClick">
                  <template v-if="dataValue === ''"
                    >今天</template
                  >
                  <template v-else>
                    {{
                      $moment(dataValue).calendar(null, {
                        sameDay: "[今天]",
                        nextDay: "[明天]",
                        lastDay: "[昨天]",
                        sameElse: "M月D日",
                      })
                    }}
                  </template>
                </div>
              </Date-picker>
            </div>

            <input type="text" v-model="hour" />
            <span class="sure" @click="setHour">确定</span>
          </div>

          <div class="bottom">
            <ul v-if="hourList.length > 0">
              <li v-for="(item, index) in hourList" :key="index">
                <div class="name">
                  <Icon type="ios-trash-outline" @click="delTimeList(item.id)" />
                  <div>
                    <span>{{ item.createName }}</span>
                    <br />
                    <span>
                      {{
                        $moment(item.hoursDate).calendar(null, {
                          sameDay: "[今天]",
                          nextDay: "[明天]",
                          lastDay: "[昨天]",
                          sameElse: "M月D日",
                        })
                      }}
                    </span>
                  </div>
                </div>
                <span class="time">{{ item.hours }} 小时</span>
              </li>
            </ul>
            <div v-else class="clockBox">
              <div class="clock"></div>
              暂无工时记录
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { allTags, addnewTag, addTagAndBind, modifyTag, searchTags, delTag, removeInfoTag, bindingTag, workHour, additionHour, getTaskWorkingHours, removeTaskWorkingHours } from "../../axios/api";
export default {
  props: ["task"],
  data() {
    return {
      opendata: false,
      dataValue: new Date(),
      hourList: [],
      hour: "", //实际工时
      planHour: "", //计划工时
      showSearch: false,
      showTag: false,
      searchTag: "",
      showdiv1: true,
      showdiv2: false,
      showdiv3: false,
      tagName: "",
      Popvisible: false,
      totalTag: [],
      isEdit: true,
      colorList: ["#3da8f5", "#75c940", "#2fbdb3", "#797ec9", "#ffaf38", "#ff4f3e"],
      checkedColor: "#3da8f5",
      tagAdd: false,
      loading: false,
      offsetLeft: 0,
      offsetTop: 0,
      tag: null, //编辑标签时使用
      tagTilte: "标签",
      btnName: "创建标签",
      showplanWorkHours: true,
    };
  },
  mounted() {
    this.showplanWorkHours=true
  },
  methods: {
    handleClick() {
      this.opendata = !this.opendata;
    },
    handleChange(date) {
      this.dataValue = date;
    },
    handleClear() {
      this.opendata = false;
    },
    handleOk() {
      this.opendata = false;
    },

    open() {
      //打开弹框
      this.showTag = true;

      this.getTimeLise();
    },
    cancel() {
      //关闭弹框
      this.showSearch = false;
      this.hour = "";
      this.planHour = "";
      this.dataValue = new Date();
      this.showplanWorkHours=true
    },
    change() {},
    //修改计划工时
    setPlanHour() {
      const data = {
        taskId: this.task.taskId,
        workingHours: this.planHour,
      };
      workHour(data).then((res) => {
        if (res.result == 1) {
          this.showplanWorkHours = true;
          this.task.planWorkHours = this.planHour;
        }else{
            this.$Message.error(res.msg);
        }
      });
    },
    //修改实际工时
    setHour() {
      const data = {
        taskId: this.task.taskId,
        hours: this.hour==''?'0':this.hour,
        hoursDate: new Date(this.dataValue).getTime(),
      };

      additionHour(data).then((res) => {
        this.getTimeLise();
      });
    },
    //获取工时列表
    getTimeLise() {
      const data = {
        taskId: this.task.taskId,
      };

      getTaskWorkingHours(data).then((res) => {
        this.hourList = res.data;
        this.hour=''
      });
    },
    delTimeList(id) {
      const data = {
        id: id,
      };

      removeTaskWorkingHours(data).then((res) => {
        this.getTimeLise();
      });
    },
  },
};
</script>
<style lang="less">
[contenteditable]:focus {
  outline: none;
}
</style>
<style scoped lang="less">
/deep/.ivu-modal-header {
  padding: 8px 16px;
}
.text-content {
  color: #262626;
  cursor: pointer;
  &:hover {
    color: #1b9aee;
  }
}
.workheader {
  height: 35px;
  display: flex;
  align-items: center;

  .work-title {
    font-size: 14px;
    font-weight: bolder;
    color: #262626;
  }
  span:nth-child(2) {
    margin: 0px 30px 0 10px;
    display: flex;
    align-items: center;
  }
  button {
    margin-right: 30px;
  }
  .work-input {
    flex: 1;
    .ivu-tooltip {
      width: 100%;
    }
    .input-content {
      border: 1px solid #dcdee2;
      display: flex;
      border-radius: 3px;
      /deep/.ivu-input {
        border: none;
        &:hover {
          border: none;
          border-color: #dcdee2;
          box-shadow: none;
        }
        &:focus {
          box-shadow: none;
        }
      }
      .sure-btn {
        padding: 0px 10px;
        font-size: 14px;
        color: #2d8cf0;
        cursor: pointer;
        margin: 0;
      }
    }
    .planWork-hours {
      font-size: 14px;
      text-align: right;
      &:hover {
        background-color: #f7f7f7;
        cursor: pointer;
      }
    }
  }
}
.work-box {
  .top {
    // padding: 0 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .top-title {
      font-size: 14px;
      font-weight: bolder;
      color: #262626;
    }
  }
  .middle {
    padding: 0px;
    border: 1px solid #e5e5e5;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    display: flex;
    .data {
      padding: 0px 2px;
      cursor: pointer;
      border-right: 1px solid #e5e5e5;
    }
    input {
      flex: 1 auto;
      border: none;
      text-indent: 10px;
      outline: none;
    }
    .sure {
      width: 60px;
      padding: 0px 10px;
      color: #2d8cf0;
      cursor: pointer;
    }
  }
  .bottom {
    .clockBox {
      display: flex;
      flex-flow: column;
      text-align: center;
      margin-bottom: 20px;
    }
    .clock {
      width: 60px;
      height: 60px;
      margin: 30px 100px 10px 100px;
      background: #fff url("~@/assets/images/clock.png") no-repeat center;
      background-size: cover;
    }
    ul {
      margin-top: 10px;

      li {
        .name {
          display: flex;
          i {
            padding-top: 13px;
            padding-right: 5px;
          }
        }
        .time {
          padding-right: 10px;
        }
        padding: 5px 0px;
        display: flex;
        justify-content: space-between;
        height: 50px;
      }
      li:hover {
        background: #f7f7f7;
      }
    }
  }
}
</style>
