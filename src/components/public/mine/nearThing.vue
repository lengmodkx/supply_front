<template>
  <!-- 近期的事 -->
  <div>
    <div class="inner">
      <!-- <div class="h1_title">近期的事儿&nbsp;&nbsp;&nbsp;<span class="list-number">  {{  name==2?this.nearThingSchedule.length:this.nearThingTask.length }}</span></div> -->
      <!-- <div v-if="nearThingTask.length && name==1" class="list">
        <div class="listItem" v-for="task in nearThingTask" :key="task.taskId">
          <div class="task-mod left-color urgent">
            <div class="check" @click="showTaskDetail(task.taskId)">
              <Checkbox v-model="todayThing"></Checkbox>
              <div class="cont" v-if="task.level === 0">
                {{ task.taskName }}
                <span class="taskgroup">{{ task.project.projectName }}</span>
                <span :class="[{'past-time':new Date().getTime() >task.endTime}, 'deadline','red' , 'fr']">
                  <div>{{$moment(task.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                </span>
              </div>
              <div class="cont" v-else>
                {{ task.taskName }}
                <span class="taskgroup">所属任务:{{ task.parentTask.taskName }}</span>
                <span :class="[{'past-time':new Date().getTime() >task.endTime}, 'deadline','red' , 'fr']">
                  <div>{{$moment(task.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                </span>
              </div>
              <div class="bottom-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="nearThingSchedule.length && name==2" class="list">
        <div class="listItem" v-for="(schedule, index) in nearThingSchedule" :key="index">
          <div class="task-mod">
            <div class="check" @click="showEditRC(schedule)">
              <Icon type="ios-calendar-outline" size="22" style="margin-left: -5px;margin-right: 10px" />
              <div class="cont">
                {{ schedule.scheduleName }}
                <span class="taskgroup">{{ schedule.project.projectName }}</span>
                <span :class="[{'past-time':new Date().getTime() >schedule.endTime}, 'deadline','red' , 'fr']">
                  <div>{{$moment(schedule.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                </span>
              </div>
              <div class="bottom-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="wu">
        <img src="../../../icons/img/no-list.png" alt="" />
      </div> -->



      <Tabs value="1" @on-click="changeTab">
        <TabPane label="任务" name="1">
          <div class="list">
            <div class="listItem" v-for="task in nearThingTask" :key="task.taskId">
              <div class="task-mod left-color urgent">
                <div class="check" @click="showTaskDetail(task.taskId)">
                  <Checkbox v-model="todayThing"></Checkbox>
                  <div class="cont" v-if="task.level === 0">
                    {{ task.taskName }}
                    <span class="taskgroup">{{ task.project.projectName }}</span>
                    <span :class="[{'past-time':new Date().getTime() >task.endTime}, 'deadline','red' , 'fr']">
                      <div>{{$moment(task.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                    </span>
                  </div>
                  <div class="cont" v-else>
                    {{ task.taskName }}
                    <span class="taskgroup">所属任务:{{ task.parentTask.taskName }}</span>
                    <span :class="[{'past-time':new Date().getTime() >task.endTime}, 'deadline','red' , 'fr']">
                      <div>{{$moment(task.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                    </span>
                  </div>
                  <div class="bottom-line"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="nearThingTask.length==0" class="wu">
            <img src="../../../icons/img/no-list.png" alt="" />
          </div>
        </TabPane>
        <TabPane label="日程" name="2">
          <div class="list">
            <div class="listItem" v-for="(schedule, index) in nearThingSchedule" :key="index">
              <div class="task-mod">
                <div class="check" @click="showEditRC(schedule)">
                  <Icon type="ios-calendar-outline" size="22" style="margin-left: -5px;margin-right: 10px" />
                  <div class="cont">
                    {{ schedule.scheduleName }}
                    <span class="taskgroup">{{ schedule.project.projectName }}</span>
                    <span :class="[{'past-time':new Date().getTime() >schedule.endTime}, 'deadline','red' , 'fr']">
                      <div>{{$moment(schedule.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                    </span>
                  </div>
                  <div class="bottom-line"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="nearThingSchedule.length==0" class="wu">
            <img src="../../../icons/img/no-list.png" alt="" />
          </div>
        </TabPane>

      </Tabs>
    </div>
    <!-- 编辑任务模态框 -->
    <Modal v-model="showModal" class="myModal">
      <my-modal v-if="showModal" ref="myModal"></my-modal>
    </Modal>
    <!--编辑日程模态框-->
    <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide="true">
      <editRicheng @close="closeModal"></editRicheng>
    </Modal>
  </div>
</template>

<script>
  import {
    nearThing,
    nearThingByTask
  } from "@/axios/api";
  import myModal from "@/components/project/pages/index/components/EditList";
  import editRicheng from "@/components/project/schedule/EditRicheng";
  import {
    mapMutations,
    mapActions
  } from "vuex";
  export default {
    data() {
      return {
        todayThing: "",
        nearThingTask: [],
        nearThingSchedule: [],
        showModal: false,
        editrc: false
      };
    },
    components: {
      myModal,
      editRicheng
    },
    methods: {
      ...mapMutations("task", ["setTaskId"]),
      ...mapActions("schedule", ["getScheduleById"]),
      // 显示任务详情
      showTaskDetail(taskId) {
        this.setTaskId(taskId);
        this.showModal = true;
      },
      // 编辑日程
      showEditRC(item) {
        this.editrc = true;
        this.getScheduleById(item.scheduleId);
      },
      closeModal() {
        this.editrc = false;
      },
      changeTab(name) {
        if (name == 1) {
          nearThingByTask().then(res => {
            this.nearThingTask = res.data;
          });
        } else {
          nearThing().then(res => {
            this.nearThingSchedule = res.data;
          });
        }
      },
    },
    mounted() {
      this.changeTab('1');
    },
  };
</script>

<style scoped lang="less">
  @import "../Mine";
</style>