<template>
  <!-- 任务 -->
  <div>
    <Loading v-if="loading"></Loading>
    <div class="inner task">
      <div class="head-right-btns">
        <Select v-model="isDone" placeholder="已完成" @on-change="getMeTask">
          <Option value="1">已完成</Option>
          <Option value="0">未完成</Option>
        </Select>
        <Select v-model="order" placeholder="按优先级排序" @on-change="getMeTask">
          <Option value="priority">按优先级排序</Option>
          <Option value="dueDate">按截止时间排序</Option>
          <Option value="created">按创建时间排序</Option>
        </Select>
      </div>
      <Tabs value="1" @on-click="changeType">
        <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tablist" :key="index">
          <ul class="task-con" v-if="taskList.length">
            <li @click.stop="showTaskDetail(task.taskId)" class="task-list" v-for="task in taskList" :key="task.taskId">
              <div :class="{lineRed: taskType==2 ,line:true}"></div>
              <Checkbox v-model="task.checkbox"></Checkbox>
              <img v-if="task.executorImg && taskType==2" :src="task.executorImg" alt />
              <img v-else-if="!task.executorImg&& taskType==2"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg=="
                alt />
              <div class="rw-xm">
                <div v-if="!task.level && task.parentTask ==null " class="rw">
                  <p class="taskName">{{task.taskName}}</p>
                  <span class="xm">{{task.projectName}}</span>
                </div>
                <div v-else class="zrw">
                  <span>{{task.taskName}}</span>
                  <p>属于任务：{{task.parentTask.taskName}}</p>
                </div>
              </div>
              <div v-if="task.endTime" :class="[{'past-time':new Date().getTime() >task.endTime}, 'task-time']">
                <div>{{$moment(task.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
              </div>
              <div class="bottom-line"></div>
            </li>
          </ul>
          <div v-else class="wu">
            <img src="../../../icons/img/no-list.png" alt />
          </div>
        </TabPane>
      </Tabs>


    </div>
    <!-- 编辑任务模态框 -->
    <Modal v-model="showModal" class="myModal">
      <my-modal v-if="showModal" ref="myModal"></my-modal>
    </Modal>
  </div>
</template>

<script>
  import myModal from "@/components/project/pages/index/components/EditList";
  import {
    getMeTask
  } from "@/axios/api";
  import {
    mapMutations
  } from "vuex";
  export default {
    name: "nearThing",
    data() {
      return {
        type: "execute",
        isDone: 1,
        order: "priority",
        taskList: [],
        project: [],
        showModal: false,
        activeModalData: "",
        taskType: 1,
        loading: false,
        taskListNew: [], //带checkbox的列表
        tablist: [{
            label: '我执行的',
            name: '1'
          },
          {
            label: '我创建的',
            name: '2'
          },
          {
            label: '我参与的',
            name: '3'
          },
        ]
      };
    },
    components: {
      myModal
    },
    methods: {
      ...mapMutations("task", ["setTaskId"]),
      changeType(n) {
        this.taskType = n;
        if (n == 1) {
          this.type = "execute";
          this.getMeTask();
        }
        if (n == 2) {
          this.type = "created";
          this.getMeTask();
        }
        if (n == 3) {
          this.type = "join";
          this.getMeTask();
        }
      },
      //获取任务数据
      getMeTask() {
        this.loading = true;
        getMeTask(this.isDone, this.order, this.type).then(res => {
          this.loading = false;
          this.taskList = res.data;
          this.taskList.map(p => {
            p.taskList = false;
          });
        });
      },
      // 显示任务详情、
      showTaskDetail(taskId) {
        this.setTaskId(taskId);
        this.showModal = true;
      }
    },
    created() {
      this.changeType('1');
    },
  };
</script>

<style scoped lang="less">
  @import "../Mine";
</style>