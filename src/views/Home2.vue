<template>
  <div class="wrap-box">
    <Row class-name="page-header">
      <Col span="24">
      <div class="header-title">
        『 为遇一人而入红尘，人去我亦去，此生不留尘。』 —— 《魔道祖师》
      </div>
      <div class="header-contant">
        <div class="left-contant">
          <div>
            <Avatar :src="userInfo.image" class="avatar" />
          </div>
          <div>
            <div class="title">下午好，{{userInfo.userName}}，祝你开心每一天！</div>
            <div class="team">{{userInfo.job}}|{{userInfo.partmemt}}</div>
          </div>
        </div>
        <div class="right-contant">
          <div class="contant-item">
            <div class="title">
              团队人数
            </div>
            <div class="number">
              {{teamList.length}}
            </div>
          </div>
          <div class="contant-item">
            <div class="title">
              项目总数
            </div>
            <div class="number">
              {{projects.length}}
            </div>
          </div>
        </div>

      </div>
      </Col>
    </Row>
    <div class="page-wrapper">
      <Row :gutter="24">
        <Col span="16">
        <Card style="width:100%; ">
          <p slot="title">
            进行中的项目
          </p>
          <a href="#" class="font-bold" slot="extra" @click.prevent="changeLimit">
            全部项目
          </a>
          <ul class="porject-contant">
            <li v-for="(item, index) in projects" :key="index" @click="path(item)">
              <div class="title">
                <Avatar :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover}`"
                  class="avatar" />
                <Icon type="md-star" size="15"></Icon>
                <span>{{item.projectName}}</span>
              </div>
              <div class="description">
                <span>{{item.projectDes}}</span>
                <Progress :percent="item.projectSchedule" hide-info :stroke-width="2" />
              </div>
              <div class="datetime">
                <span>{{item.memberName}}</span>
                <span>{{$moment(item.createTime).format("MM-DD HH:mm") }}</span>
              </div>
            </li>
          </ul>
        </Card>
        <Card style="width:100%;margin:1.5em 0">
          <p slot="title">
            动态
          </p>
          <List class="dynamic-contant">
            <ListItem v-for="(item, index) in dynamicList" :key="index">
              <ListItemMeta :avatar="item.memberImg" :title="item.content"
                :description="$moment(item.createTime).format('MM-DD HH:mm')+' - '+item.projectName" />
              <template slot="action">
                <li>
                  <a href="" class="font-bold" @click.prevent="path(item)">「{{item.taskName}}」</a>
                </li>
              </template>
            </ListItem>
          </List>
        </Card>
        </Col>

        <Col span="8">
        <Card style="width:100%; ">
          <p slot="title">
            我的任务 · {{tasktotal}}
          </p>

          <Select slot="extra" v-model="classify" class="selectBox" style="width:93px; margin-top:-5px;"
            @on-change="changeSelect">
            <Option v-for="item in classifyList" :value="item.value" :key="item.name">{{ item.name }}</Option>
          </Select>

          <div class="task-contant-waper">
            <Tabs value="1" @on-click="changeType">
              <TabPane label="我执行的" icon="ios-apps-outline " name="1">
                <ul class="task-contant">
                  <li v-for='(item,index) in taskList' :key="index" @click="path(item)">
                    <div class="task-item df jsb">
                      <div class="task-item-left">
                        <div class="level">普通</div>
                        <Tooltip :content="`${item.taskName}`" max-width="200" placement="bottom">
                          <span>{{item.taskName}}</span>
                        </Tooltip>
                      </div>
                      <div class="task-item-right">{{item.projectName}}</div>
                    </div>
                  </li>
                </ul>
                <div class="task-page">
                  <Page :total="tasktotal" @on-change="changePages" />
                </div>
              </TabPane>
              <TabPane label="我参于的" icon="ios-contacts-outline " name="3">
                <ul class="task-contant">
                  <li v-for='(item,index) in taskList' :key="index" @click="path(item)">
                    <div class="task-item df jsb">
                      <div class="task-item-left">
                        <div class="level">普通</div>
                        <Tooltip :content="`${item.taskName}`" max-width="200" placement="bottom">
                          <span>{{item.taskName}}</span>
                        </Tooltip>
                      </div>
                      <div class="task-item-right">{{item.projectName}}</div>
                    </div>
                  </li>
                </ul>
                <div class="task-page">
                  <Page :total="tasktotal" @on-change="changePages" />
                </div>
              </TabPane>
              <TabPane label="我创建的" icon="md-clipboard" name="2">
                <ul class="task-contant">
                  <li v-for='(item,index) in taskList' :key="index" @click="path(item)">
                    <div class="task-item df jsb">
                      <div class="task-item-left">
                        <div class="level">普通</div>
                        <Tooltip :content="`${item.taskName}`" max-width="200" placement="bottom">
                          <span>{{item.taskName}}</span>
                        </Tooltip>
                      </div>
                      <div class="task-item-right">{{item.projectName}}</div>
                    </div>
                  </li>
                </ul>
                <div class="task-page">
                  <Page :total="tasktotal" @on-change="changePages" />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        <Card style="width:100%; margin-top:1.5em">
          <p slot="title">
            团队 · {{teamList.length}}
          </p>

          <ul class="team-contant">
            <li v-for='(item,index) in teamList' :key="index">
              <Avatar :src="item.image" class="avatar" />
              <span>{{item.userName}}</span>
            </li>
          </ul>
        </Card>
        </Col>
      </Row>
    </div>





  </div>
</template>

<script>
  import Loading from "../components/public/common/Loading.vue";
  import {
    mapActions,
    mapState,
    mapMutations
  } from "vuex";
  import {
    getPhoneCode,
    bindPhone,
    showBindPhone,
    getMeTask,
    getUserInfo,
    getTeamInfo,
    getMyDynamic
  } from "@/axios/api";
  import {
    setStarProject,
    guidangProject,
    recycleProject,
    recoverProject,
    delProject,
    searchProjects,
    getProjectTree
  } from "@/axios/api";
  export default {
    name: "index",
    components: {
      Loading
    },
    inject: ["reload"],
    data() {
      return {
        companyId: this.$route.params.orgid,
        classify: '1',
        classifyList: [{
          name: "已完成",
          value: '1'
        },
        {
          name: "未完成",
          value: '0'
        },
        ],
        taskType: 1,
        type: "execute",
        isDone: 1,
        order: "priority",
        taskList: [],
        pageSize: '10', //条数
        pageNum: '1', //页数
        tasktotal: 100, //总任务数
        tabName: '1',
        userInfo: [], //个人信息
        teamList: [], //团队信息
        dynamicList: [], //动态
      };
    },
    computed: {
      ...mapState("project", ["projects", "loading", "project"])
    },
    mounted() {
      document.cookie = "orgId" + "=" + localStorage.companyId + ";" + "path=/";
      document.cookie = "userId" + "=" + localStorage.userId + ";" + "path=/";
      this.$store.state.project.loading = true;
      this.orgProjectInit({
        id: this.companyId,
        type: "全部项目"
      });
      this.changeType('1')
      this.getUser() //获取信息
      this.getTeam()
      this.getDynamic()
    },
    methods: {
      ...mapActions("project", ["init", "updateProject", "openSet", "orgProjectInit"]),
      ...mapMutations("project", ["setName"]),
      path(item) {
        this.setName(item.projectName);
        localStorage.projectName = item.projectName;
        localStorage.taskId=item.taskId
        // if (item.taskId) {
        //   this.$router.push(`/project/${item.projectId}/tasks/group/${item.groupId}/${item.taskId}`);
        // } else {
        //   this.$router.push(`/project/${item.projectId}/tasks/group/${item.groupId}/false`);
        // }
          this.$router.push(`/project/${item.projectId}/tasks/group/${item.groupId}`);

      },

      //右侧任务
      changeType(n) {
        this.tabName = n
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
        // this.loading = true;
        getMeTask(this.isDone, this.order, this.type, this.pageSize, this.pageNum).then(res => {
          // if (res.result === 1) {
          // this.loading = false;
          // this.taskList = res.data;
          this.taskList = res.data.list;
          this.tasktotal = res.data.total
          // }
        });
      },
      changePages(num) {
        this.pageNum = num
        this.changeType(this.tabName)
      },
      changeSelect(value) {
        this.isDone = value
        this.changeType(this.tabName)
      },
      getUser() {
        getUserInfo(localStorage.companyId).then(res => {
          if (res.result === 1) {
            this.userInfo = res.data
          }
        });
      },
      getTeam() {
        getTeamInfo(localStorage.companyId).then(res => {
          if (res.result === 1) {
            this.teamList = res.data
          }
        });
      },
      getDynamic() {
        getMyDynamic().then(res => {
          if (res.result === 1) {
            this.dynamicList = res.data
          }
        });
      },

    },
  };
</script>