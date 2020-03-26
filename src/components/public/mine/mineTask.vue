<template>
    <!-- 任务 -->
    <div>
        <Loading v-if="loading"></Loading>
        <div class="inner task">
            <div class="task-head">
                <div class="task-head-left">
                    <span :class="{now: taskType==1}" @click="changeType(1)">我执行的</span>
                    <span :class="{now: taskType==2}" @click="changeType(2)">我创建的</span>
                    <span :class="{now: taskType==3}" @click="changeType(3)">我参与的</span>
                </div>
                <div class="task-head-right">
                    <Select v-model="isDone" placeholder="已完成" @on-change="getMeTask">
                        <Option value=1 >已完成</Option>
                        <Option value=0 >未完成</Option>
                    </Select>
                    <Select v-model="order" placeholder="按优先级排序" @on-change="getMeTask">
                        <Option value="priority" >按优先级排序</Option>
                        <Option value="dueDate">按截止时间排序</Option>
                        <Option value="created" >按创建时间排序</Option>
                        <!--<Option value="project">按项目名称排序</Option>-->
                    </Select>
                </div>
            </div>
            <ul class="task-con" v-if="taskList.length">
                <li @click="showTaskDetail(task.taskId)" class="task-list" v-for="task in taskList" :key="task.taskId">
                    <div class="line"></div>
                    <div class="check-box"></div>
                    <img v-if="task.executorImg" :src="task.executorImg" alt="">
                    <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg==" alt="">
                    <div class="rw-xm">
                        <div v-if="!task.level" class="rw">
                            <span>{{task.taskName}}</span>
                            <span class="xm">{{task.project.projectName}}</span>
                        </div>
                        <div v-else class="zrw">
                            <span>{{task.taskName}}</span>
                            <p>属于任务：{{task.parentTask.taskName}}</p>
                        </div>
                    </div>
                    <div class="task-time" v-if="task.startTime && task.endTime">
                        <Time :time="task.startTime" />
                        <span>—</span>
                        <Time :time="task.endTime" />
                    </div>
                </li>
            </ul>
            <div v-else class="wu">
                <img src="../../../icons/img/sys-msg.png" alt="">
                <p>还没有任务</p>
            </div>
        </div>
        <!-- 编辑任务模态框 -->
        <Modal v-model="showModal" class="myModal">
            <my-modal v-if="showModal" ref="myModal" ></my-modal>
        </Modal>
    </div>
</template>

<script>
 import myModal from "@/components/project/pages/index/components/EditList"
 import {getMeTask} from "@/axios/api"
 import {mapMutations} from 'vuex'
export default {
  name: "nearThing",
  data () {
    return {
        type:'execute',
        isDone:1,
        order:'priority',
        taskList:[],
        project:[],
        showModal: false,
        activeModalData:'',
        taskType:1,
        loading:false
    }
  },
  components:{
      myModal
  },
  methods: {
      ...mapMutations('task',['setTaskId']),
      changeType(n){
          this.taskType=n
          if(n === 1){
              this.type = 'execute'
              this.getMeTask()
          }
          if(n === 2){
              this.type = 'created'
              this.getMeTask()
          }
          if(n === 3){
              this.type = 'join'
              this.getMeTask()
          }
      },
      //获取任务数据
      getMeTask(){
          this.loading=true
          getMeTask(this.isDone,this.order,this.type).then(res => {
              console.log(res)
              if(res.result === 1){
                  this.loading=false
                  this.taskList = res.data
              }
          })
      },
      // 显示任务详情、
      showTaskDetail (taskId) {
          this.setTaskId(taskId);
          this.showModal=true
      }
  },
  created(){
      this.getMeTask()
  }

}
</script>

<style scoped lang="less">
@import "../Mine";
</style>