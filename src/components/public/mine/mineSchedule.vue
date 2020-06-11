<template>
  <!-- 日程 -->
  <div>
    <div class="inner richeng">
      <div class="h1_title">日程&nbsp;&nbsp;&nbsp;<span class="list-number">  {{ name == 1?this.scheduleList.length:timeoutNum  }}</span></div>
      <!-- <div class="rc-head">
        <div class="rc-head-left">
          <span :class="{ now: scheduleType == 1 }" @click="changeType(1)">未来的日程</span>
          <span :class="{ now: scheduleType == 2 }" @click="changeType(2)">过去的日程</span>
        </div>
      </div> -->
      <Loading v-if="loading"></Loading>
      <div class="rc-con">
        <div class="weilai-rc" v-if="name == 1">
          <div v-if="scheduleList.length" class="weilai-rc">
            <div class="weilai-rc" v-for="(s, n) in scheduleList" :key="n">
              <ul>
                <div class="waht-day">
                  <span>{{ s.date }}</span
                  ><span>&nbsp;·&nbsp;{{ s.scheduleList.length }}</span>
                </div>
                <li @click="showEditRC(schedule)" class="weilai-rc-list" v-for="schedule in s.scheduleList" :key="schedule.scheduleId">
                  <div class="rc-time" v-if="schedule.startTime && schedule.endTime"><Time :time="schedule.startTime" /> - <Time :time="schedule.endTime" /></div>
                  <div class="rc-xm">
                    <p>{{ schedule.scheduleName }}</p>
                    <span>{{ schedule.project.projectName }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="wu">
            <img src="../../../icons/img/no-list.png" alt="" />
            <!-- <p>还没有未来的日程</p> -->
          </div>
        </div>

        <div v-if="name == 2" class="guoqu-rc">
          <div v-if="month.length">
            <Collapse v-model="guoquRC" @on-change="getScheduleByMonth()" :accordion="accordion" simple>
              <Panel v-for="m in month" :name="m.date" :key="m.date">
                {{ m.date }}
                <ul slot="content">
                  <li @click="showEditRC(s)" class="weilai-rc-list" v-for="s in monthSchedule" :key="s.scheduleId">
                    <div class="rc-time" v-if="s.startTime && s.endTime">
                      {{ s.date }}
                    </div>
                    <div class="rc-xm">
                      <p>{{ s.scheduleName }}</p>
                      <span>{{ s.project.projectName }}</span>
                    </div>
                  </li>
                </ul>
              </Panel>
            </Collapse>
          </div>

          <div v-else class="wu">
            <img src="../../../icons/img/no-list.png" alt="" />
            <p>还没有过去的日程</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑日程模态框 -->
    <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide="true">
      <editRicheng @close="closeModal"></editRicheng>
    </Modal>
  </div>
</template>

<script>
import editRicheng from "@/components/project/schedule/EditRicheng";
import { getMeAfterSchedule, getScheduleByMonth, getMonth } from "@/axios/api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      guoquRC: "",
      showRCModal: false,
      richengModalData: "",
      scheduleList: [],
      month: [],
      accordion: true,
      monthSchedule: [],
      scheduleType: 1,
      loading: true,
      editrc: false,
      timeoutNum:0
    };
  },
  props: ["name"],
  methods: {
    ...mapActions("schedule", ["getScheduleById"]),
    changeType(n) {
      this.scheduleType = n;
      if (n == 1) {
        this.getMeAfterSchedule();
      }
      if (n == 2) {
        this.getMonth();
      }
    },
    getMeAfterSchedule() {
      getMeAfterSchedule().then(res => {
        if (res.result === 1) {
          this.scheduleList = res.data;
          this.loading = false;
        }
      });
    },
    getMonth() {
      getMonth().then(res => {
        if (res.result === 1) {
          this.month = res.data;
          this.loading = false;
          this.timeoutNum=0
          this.month.map(p => {
            this.timeoutNum+=parseInt(p.timeoutNum)
          });
        }
      });
    },
    getScheduleByMonth(key) {
      if (!this.guoquRC[0]) {
        return false;
      } else {
        getScheduleByMonth(this.guoquRC).then(res => {
          if (res.result === 1) {
            this.monthSchedule = res.data;
            this.loading = false;
          }
        });
      }
    },
    // 编辑日程
    showEditRC(item) {
      this.editrc = true;
      this.getScheduleById(item.scheduleId);
    },
    closeModal() {
      this.editrc = false;
    }
  },
  created() {
      if (this.name == 1) {
        this.getMeAfterSchedule();
      }else {
        this.getMonth();
      }
     
  },
  components: {
    editRicheng
  },
  watch:{
    'name':function(val){
      this.changeType(val);
    }
  }
};
</script>

<style scoped lang="less">
@import "../Mine";
</style>
