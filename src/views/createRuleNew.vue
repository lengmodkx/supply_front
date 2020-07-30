<template>
  <div>
    <div class="rule-head">
      <Button @click="$emit('cancelRule')" size="large">取消</Button>
      <Button @click="save" type="primary" size="large">保存</Button>
    </div>
    <div class="rule-con" style="padding: 20px 10px">
      <div class="rule-item">
        <div class="rule-title">规则名称</div>
        <Input v-model="ruleData.name" size="large" />
      </div>
      <!--选择 列表、-->
      <div class="rule-item">
        <div class="rule-title">选择任务列表</div>
        <Poptip placement="bottom" transfer v-model="taskPopShow">
          <Input v-model="relationName" size="large" />
          <div slot="content" style="width:500px;height:200px;padding:8px 16px;">
            <div class="taskListPoptip" v-for="(item,index) in listList" :key="index">
              <div class="taskClassName">{{item.name}}</div>
              <ul>
                <li
                  v-for="i in item.taskMenu"
                  :key="i.relationId"
                  @click="clickList(i)"
                >{{i.relationName}}</li>
              </ul>
            </div>
          </div>
        </Poptip>
      </div>
      <div class="rule-item" v-if="ruleData.object">
        <div class="rule-title">选择条件</div>
        <Select
          v-model="ruleData.conditionName"
          size="large"
          @on-change="conditionChange"
          clearable
        >
          <Option v-for="item in conditionList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="rule-item" v-if="ruleData.conditionName=='priority'">
        <div class="rule-title">选择优先级</div>
        <Select
          v-model="ruleData.conditionValue"
          size="large"
          clearable
          @on-change="selectConditionValue"
        >
          <Option v-for="item in priorityList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="rule-item" v-if="ruleData.conditionName=='settingExecutors'">
        <div class="rule-title">选择执行者</div>
        <Select
          v-model="ruleData.conditionValue"
          size="large"
          @on-change="selectConditionValue"
          clearable
        >
          <Option
            v-for="item in projectPeople"
            :value="item.memberId"
            :key="item.memberId"
          >{{item.memberName}}</Option>
        </Select>
      </div>
      <div class="rule-item" v-if="ruleData.conditionName=='endTime'">
        <div class="rule-title">最终时间</div>
        <DatePicker
          @on-change="changeDate"
          type="date"
          placeholder="选择截止时间"
          :value="dataChange"
          size="large"
        ></DatePicker>
      </div>
      <div class="rule-item" v-if="ruleData.conditionName=='repeat'">
        <div class="rule-title">是否重复</div>
        <Select
          v-model="ruleData.conditionValue"
          size="large"
          @on-change="selectConditionValue"
          clearable
        >
          <Option v-for="item in repeatList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <!-- 选择结果 -->
      <div class="rule-item" v-if="ruleData.conditionName">
        <div class="rule-title">选择结果</div>
        <Select
          v-model="resultSelect"
          size="large"
          :label-in-value="true"
          @on-change="resultChange"
        >
          <Option :value="1">默认指派给</Option>
          <Option :value="2">自动跳转到</Option>
        </Select>
      </div>
      <div class="rule-item" v-if="resultSelect==1">
        <div class="rule-title">默认指派人</div>
        <Select v-model="ruleData.defaultAssign" size="large" clearable>
          <Option
            v-for="item in projectPeople"
            :value="item.memberId"
            :key="item.memberId"
          >{{item.memberName}}</Option>
        </Select>
      </div>
      <div class="rule-item" v-if="resultSelect==2">
        <div class="rule-title">自动跳转到</div>
        <!-- <Select v-model="ruleData.automaticJump" size="large" clearable>
          <Option
            v-for="item in listList"
            :value="item.relationId"
            :key="item.relationId"
          >{{item.relationName}}</Option>
        </Select>-->
        <Poptip placement="bottom" transfer v-model="taskPopShow2">
          <Input v-model="automaticName" size="large" />
          <div slot="content" style="width:500px;height:200px;padding:8px 16px;">
            <div class="taskListPoptip" v-for="(item,index) in listList" :key="index">
              <div class="taskClassName">{{item.name}}</div>
              <ul>
                <li
                  v-for="i in item.taskMenu"
                  :key="i.relationId"
                  @click="automaticSkip(i)"
                >{{i.relationName}}</li>
              </ul>
            </div>
          </div>
        </Poptip>
      </div>
    </div>
  </div>
</template>

<script>
import { enterTask, projectMembers } from "@/axios/api";
import { saveRule } from "@/axios/ruleApi";
export default {
  name: "createRule",
  props: ["projectId", "hasData"],
  data() {
    return {
      selCondition: false,
      option: "添加条件",
      addResult: false,
      resultType: "添加结果",
      addResult2: false,
      hasSelectList: "",
      hasSelectOption: false,
      result2: false,
      listList: [],
      showOptionVal: "",
      projectPeople: [],
      designate: "",
      actionName: "",
      actionVal: "",
      priorityList: [
        { name: "普通", id: "ordinary" },
        { name: "紧急", id: "urgent" },
        { name: "非常紧急", id: "veryUrgent" }
      ],
      ruleData: {
        object: "",
        conditionName: "",
        conditionValue: "",
        defaultAssign: "",
        automaticJump: "",
        name: "自动化任务规则",
        projectId: this.projectId,
        id: ""
      },
      conditionList: [
        { name: "被完成", id: "completed" },
        { name: "被重做", id: "redone" },
        { name: "任何条件", id: "all" },
        { name: "设置执行者", id: "settingExecutors" },
        { name: "最终时间", id: "endTime" },
        { name: "优先级", id: "priority" },
        { name: "重复", id: "repeat" }
      ],
      priorityChange: "", //优先级选择结果
      executor: "", //执行者
      resultSelect: "", //结果
      circulationTask: "", //流转任务列表
      taskStatus: "", //修改任务状态
      taskChange: "",
      assignorChange: "", // 指派人
      repeatChange: "", //是否重复
      repeatList: [
        { name: "重复", id: "true" },
        { name: "不重复", id: "false" }
      ],
      jumpChange: "", //自动跳转到
      dataChange: "", //最终时间
      relationName: "", //任务列表名称
      taskPopShow: false,
      taskPopShow2:false, //自动跳转到下拉
      automaticName:'', //自动跳转到名字
    };
  },
  mounted() {
    // console.log(this.hasData);
    this.getSelList();
    if (this.hasData) {
      this.ruleData.id = this.hasData.id;
      this.ruleData.name = this.hasData.name;
      this.ruleData.object = this.hasData.object.relationId;
      this.relationName = this.hasData.object.relationName;
      this.ruleData.conditionName = this.hasData.conditionName;
      this.ruleData.conditionValue = this.hasData.conditionValue;
      this.getPeople();
      if (this.hasData.conditionName === "endTime") {
        this.dataChange = this.$moment(this.conditionValue).format(
          "YYYY-MM-DD"
        );
      }

      if (this.hasData.automaticJump) {
        this.resultSelect = 2;
        this.ruleData.automaticJump = this.hasData.automaticJump.relationId;
        this.automaticName= this.hasData.automaticJump.relationName;
        
      } else {
        this.resultSelect = 1;
        this.ruleData.defaultAssign = this.hasData.defaultAssign.userId;
      }
    }
  },
  methods: {
    // 获取列表数据
    getSelList() {
      enterTask(this.projectId).then(res => {
        if (res.result) {
          this.listList = res.menus;
        }
      });
    },
    // 选择列表
    clickList(item) {
      this.relationName = item.relationName;
      this.ruleData.object = item.relationId;
      // 清空下面的值
      this.ruleData.conditionName = "";
      this.ruleData.conditionValue = "";
      this.ruleData.defaultAssign = "";
      this.automaticName="";
      this.ruleData.automaticJump = "";
      this.taskPopShow = false;
    },
    automaticSkip(item){
        this.automaticName= item.relationName;
        this.ruleData.automaticJump= item.relationId;
        this.taskPopShow2=false
    },
    // 选择条件 结果
    selectConditionValue(item) {
      // 清空下面的值
      this.ruleData.defaultAssign = "";
      this.automaticName="";
      this.ruleData.automaticJump = "";
      this.actionName = "";
      this.designate = "";
    },
    changeDate(value) {
      this.ruleData.conditionValue = new Date(value).getTime();
    },
    // 点击保存
    save() {
      saveRule(this.ruleData).then(res => {
        if (res.result) {
          this.$Message.success("设置成功");
          this.$emit("cancelRule");
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    //选择条件
    conditionChange() {
      //设置执行者
      if (this.ruleData.conditionName == "settingExecutors") {
        this.getPeople();
      }
    },
    //选择结果
    resultChange() {
      if (this.resultSelect == "1") {
        this.getPeople();
      }
    },
    getPeople() {
      projectMembers(this.projectId).then(res => {
        if (res.result) {
          this.projectPeople = res.data;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.rule-head {
  width: 100%;
  height: 55px;
  display: flex;
  padding: 0 10px;
  align-items: center;
  .ivu-btn {
    margin-right: 10px;
    font-size: 14px;
  }
  .ivu-btn-primary {
    background: #2cb7f5;
    border-color: #2cb7f5;
  }
}
.rule-con {
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  padding: 0 10px;
  align-items: center;
  .begin {
    height: 44px;
    width: 44px;
    line-height: 42px;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    text-align: center;
  }
  .jiantou {
    margin: 10px 0;
    font-size: 22px;
    color: #a6a6a6;
  }
  .jia {
    color: #3da8f5;
    font-size: 20px;
    height: 44px;
    width: 44px;
    border: 1px solid #3da8f5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .rule-item {
    margin-bottom: 15px;
    .rule-title {
      margin-bottom: 5px;
    }
    /deep/.ivu-input-large {
      font-size: 14px;
    }
    /deep/.ivu-select-selected-value {
      font-size: 14px !important;
    }
    .ivu-date-picker {
      width: 100%;
    }
    .ivu-poptip {
      width: 100%;

      /deep/.ivu-poptip-rel {
        width: 100%;
      }
    }
  }
}
.model-title {
  width: 270px;
  height: 35px;
  text-align: center;
  position: relative;
  line-height: 35px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  i {
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: #3da8f5;
    }
  }
}
.option-item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: gray;
  padding: 0 16px;
  font-size: 14px;
  &:hover {
    background-color: #f7f7f7;
  }
}

.square {
  height: 40px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  cursor: pointer;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  &:hover {
    color: #3da8f5;
  }
}
.zxr {
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  .circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.select-end-time {
  width: 200px;
  margin: 20px auto;
}
.taskListPoptip {
  .taskClassName {
    font-size: 12px;
    line-height: 30px;
    color: #8c8c8c;
  }
  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 30px;
    margin: 0 -15px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>