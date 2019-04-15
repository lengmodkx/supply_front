<template>
    <!-- 日程 -->
    <div >
        <div class="inner richeng">
            <div class="rc-head">
                <span :class="{now: scheduleType==1}" @click="changeType(1)">未来的日程</span>
                <span :class="{now: scheduleType==2}" @click="changeType(2)">过去的日程</span>
            </div>
            <Loading v-if="loading"></Loading>
            <div class="rc-con">
                <div v-if="scheduleType === 1" class="weilai-rc" v-for="(s) in scheduleList">
                    <ul>
                        <div class="waht-day">
                            <span>{{s.date}}</span><span>&nbsp;·&nbsp;{{s.scheduleList.length}}</span>
                        </div>
                        <li class="weilai-rc-list" v-for="schedule in s.scheduleList">
                            <div class="rc-time" v-if="schedule.startTime && schedule.endTime">
                                <Time :time="schedule.startTime" /> - <Time :time="schedule.endTime" />
                            </div>
                            <div class="rc-xm">
                                <p>{{schedule.scheduleName}}</p>
                                <span>{{schedule.project.projectName}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="scheduleType === 2" class="guoqu-rc">
                    <Collapse v-model="guoquRC" @on-change="getScheduleByMonth()" :accordion="accordion" simple>
                        <Panel v-for="m in month" :name="m" :key="m">
                            {{m}}
                            <ul slot="content">
                                <li class="weilai-rc-list" v-for="s in monthSchedule">
                                    <div class="rc-time" v-if="s.startTime && s.endTime">
                                        {{s.date}}
                                    </div>
                                    <div class="rc-xm">
                                        <p>{{s.scheduleName}}</p>
                                        <span>{{s.project.projectName}}</span>
                                    </div>
                                </li>
                            </ul>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </div>
        <!-- 编辑日程模态框 -->
        <Modal v-model="showRCModal"
               class="myModal myRcModal">
            <rc-modal :data="richengModalData"></rc-modal>
        </Modal>
    </div>
</template>

<script>
import rcModal from "@/components/public/common/EditRicheng"
import {getMeAfterSchedule,getScheduleByMonth,getMonth} from "@/axios/api"
export default {
  data () {
    return{
        guoquRC:'',
        showRCModal: false,
        richengModalData:'',
        scheduleList:[],
        month:[],
        accordion:true,
        monthSchedule:[],
        scheduleType:1,
        loading:true
    }
  },
  methods:{
      changeType(n){
          this.scheduleType=n
          if(n === 1){
              this.getMeAfterSchedule()
          }
          if(n === 2){
              this.getMonth()
          }
      },
      getMeAfterSchedule(){
          getMeAfterSchedule().then(res => {
              if(res.result === 1){
                  this.scheduleList = res.data
                  this.loading = false
              }
          })
      },
      getMonth(){
          getMonth().then(res => {
              if(res.result === 1){
                  this.month = res.data
                  this.loading = false
              }
          })
      },
      getScheduleByMonth(){
          if(!this.guoquRC[0]){
              return false
          }else {
              getScheduleByMonth(this.guoquRC).then(res => {
                  if(res.result === 1){
                      this.monthSchedule = res.data
                      this.loading = false
                  }
              })
          }
      }
  },
  created(){
      this.getMeAfterSchedule()
  },
  components: {
      rcModal
  }
}
</script>

<style scoped lang="less">
@import "../Mine";
</style>