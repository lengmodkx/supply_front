<template>
  <!-- 日程 -->
  <div>
    <div class="inner richeng">
      <!-- <div class="rc-head">
        <div class="rc-head-left">
          <span :class="{ now: scheduleType == 1 }" @click="changeType(1)">未来的日程</span>
          <span :class="{ now: scheduleType == 2 }" @click="changeType(2)">过去的日程</span>
        </div>
      </div>-->

      <Tabs value="1" @on-click="changeType">
        <TabPane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name">
          <Loading v-if="loading"></Loading>
          <div class="rc-con">
            <div>
              <Row class="schedule-content" v-if="scheduleList.length" :gutter="15">
                <Col :xs="12" :sm="8" :md="8" :lg="8" :xl="6" :xxl="4" v-for="(s, n) in scheduleList" :key="n">
                <div class="schedule-item" @click="showEditRC(s)">
                  <div class="schedule-header df jsb">
                    <div class="schedule-time">{{$moment(s.startTime).format("MM月DD日 dddd")}}</div>
                    <Tooltip :content="s.userName" placement="bottom">
                      <img :src="s.img" alt />
                    </Tooltip>
                  </div>
                  <div class="schedule-bottom">
                    <div class="schedule-bl df jsb">
                      <div>{{$moment(s.startTime).format("ah:mm")}}</div>
                      <div>{{$moment(s.endTime).format("ah:mm")}}</div>
                    </div>
                    <div class="schedule-br df jsb">
                      <div class="schedule-name">{{s.scheduleName}}</div>
                      <span class="project-name">{{s.project.projectName}}</span>
                    </div>
                  </div>
                </div>
                </Col>
              </Row>
              <div v-else class="wu">
                <img src="../../../icons/img/no-list.png" alt />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>






    </div>
    <!-- 编辑日程模态框 -->
    <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide="true">
      <editRicheng @close="closeModal"></editRicheng>
    </Modal>
  </div>
</template>

<script>
  import editRicheng from "@/components/project/schedule/EditRicheng";
  import {
    getMeAfterSchedule,
    getScheduleByMonth,
    getMonth
  } from "@/axios/api";
  import {
    mapActions
  } from "vuex";
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
        timeoutNum: 0,
        tabList: [{
            label: '未来的日程',
            name: '1'
          },
          {
            label: '过去的日程',
            name: '2'
          },
        ]
      };
    },
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
            this.scheduleList = res.data;
            this.loading = false;
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
        this.getMeAfterSchedule();
    },
    components: {
      editRicheng
    },
  };
</script>

<style scoped lang="less">
  @import "../Mine";
</style>