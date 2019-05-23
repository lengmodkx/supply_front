<template>
    <!-- 近期的事 -->
    <div >
        <div class="inner">
            <!-- <div class="header1"><div class="h1_title">今天的事·1</div></div> -->
            <div class="h1_title">近期的事儿 · {{this.nearThingSchedule.length + this.nearThingTask.length}}</div>
            <div v-if="nearThingTask.length" class="list">
                <div class="listItem" v-for="task in nearThingTask" :key="task.taskId">
                    <div class="task-mod left-color urgent">
                        <div class="check" @click="showTaskDetail(task.taskId)">
                            <Checkbox v-model="todayThing"></Checkbox>
                            <!-- <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava"> -->
                            <div class="cont" v-if="task.level === 0">
                                {{task.taskName}}
                                <span class="taskgroup">{{task.project.projectName}}</span>
                                <span class="deadline red fr"><Time :time="task.startTime" /> - <Time :time="task.endTime" /></span>
                            </div>
                            <div class="cont" v-else>
                                {{task.taskName}}
                                <span class="taskgroup">所属任务:{{task.parentTask.taskName}}</span>
                                <span class="deadline red fr"><Time :time="task.startTime" /> - <Time :time="task.endTime" /></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="listItem" v-for="(schedule,index) in nearThingSchedule" :key="index">
                    <div class="task-mod">
                        <div class="check" @click="showEditRC(schedule)">
                            <Icon type="ios-calendar-outline" size="22" style="margin-left: -5px;margin-right: 10px"/>
                            <!-- <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox> -->
                            <div class="cont">
                                {{schedule.scheduleName}}
                                <span class="taskgroup">{{schedule.project.projectName}}</span>
                                <span class="deadline fr"><Time :time="schedule.startTime" /> - <Time :time="schedule.endTime" /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="wu">
                <img src="../../../icons/img/sys-msg.png" alt="">
                <p>还没有近期的事</p>
            </div>

        </div>
        <!-- 编辑任务模态框 -->
        <Modal v-model="showModal" class="myModal">
            <my-modal v-if="showModal" ref="myModal" ></my-modal>
        </Modal>
        <!--编辑日程模态框-->
        <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide='true'>
            <editRicheng @close="closeModal"></editRicheng>
        </Modal>
    </div>
</template>

<script>
import {nearThing} from '@/axios/api'
import myModal from "@/components/project/pages/index/components/EditList"
import editRicheng from "@/components/public/common/EditRicheng"
import {mapMutations, mapActions} from 'vuex'
export default {
  data () {
      return {
          todayThing:'',
          nearThingTask:[],
          nearThingSchedule:[],
          showModal: false,
          editrc: false
      }
  },
    components:{
        myModal,
        editRicheng
    },
  methods:{
      ...mapMutations('task',['setTaskId']),
      ...mapActions("schedule", ['getScheduleById']),
      //获取近期的事儿
      nearThing(){
          nearThing().then(res => {
              this.nearThingTask = res.data.task
              this.nearThingSchedule = res.data.schedule
              console.log(this.nearThingTask)
              console.log(this.nearThingSchedule)
          })
      },
      // 显示任务详情
      showTaskDetail (taskId) {
          this.setTaskId(taskId);
          this.showModal=true
      },
      // 编辑日程
      showEditRC(item){
          this.editrc=true
          this.getScheduleById(item.scheduleId)
      },
      closeModal () {
          this.editrc=false
      }
  },
  created() {
      this.nearThing()
  }
}
</script>

<style scoped lang="less">
    @import "../Mine";
</style>