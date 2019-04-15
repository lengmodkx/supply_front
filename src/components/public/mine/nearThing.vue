<template>
    <!-- 近期的事 -->
    <div >
        <div class="inner">
            <!-- <div class="header1"><div class="h1_title">今天的事·1</div></div> -->
            <div class="h1_title">近期的事儿 · {{this.nearThingSchedule.length + this.nearThingTask.length}}</div>
            <div class="list">
                <div class="listItem" v-for="task in nearThingTask">
                    <div class="task-mod left-color urgent">
                        <div class="check">
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

                <div class="listItem" v-for="schedule in nearThingSchedule">
                    <div class="task-mod">
                        <div class="check">
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
            <!--<div class="h1_title">最近五天的事·1</div>-->
            <!--<div class="list">-->
                <!--<div class="listItem" >-->
                    <!--<div class="task-mod left-color urgent">-->
                        <!--<div class="check">-->
                            <!--<Checkbox v-model="todayThing"></Checkbox>-->
                            <!--&lt;!&ndash; <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava"> &ndash;&gt;-->
                            <!--<div class="cont">-->
                                <!--根据客户给客户结构-->
                                <!--<span class="taskgroup">项目一</span>-->
                                <!--<span class="deadline red fr">9月2日-9月15日</span>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
import {nearThing} from '@/axios/api'
export default {
  data () {
      return {
          todayThing:'',
          nearThingTask:[],
          nearThingSchedule:[]
      }
  },
  methods:{
      //获取近期的事儿
      nearThing(){
          nearThing().then(res => {
              this.nearThingTask = res.data.task
              this.nearThingSchedule = res.data.schedule
          })
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