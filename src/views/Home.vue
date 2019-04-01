<template>
  <div class="container index">
    <div class="container-title">
      <div class="search-box">
        <Input search enter-button placeholder="搜索"/>
      </div>
      <div class="filtrate-box">
        <Select
          v-model="projectType"
          @on-change="selectProjectType"
          style="width:200px"
          placeholder="我创建的项目"
        >
          <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <RadioGroup class="select-view" v-model="selectView" type="button">
          <Radio label="卡片视图"></Radio>
          <Radio label="列表视图"></Radio>
        </RadioGroup>
      </div>
    </div>

    <!--列表视图-->
    <loading v-if="loading"></loading>
    <div v-show="selectView=='列表视图'">
      <h2 class="oh" v-text="projectType">我创建的项目</h2>
      <ul>
        <li
          class="project-list"
          v-for="(item,index) in projects"
          :key="index"
          @click="path(item.projectId,item.groupId)"
        >
          <div
            class="bj-img"
            :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`"
          ></div>
          <div class="project-body">
            <div class="project-con">
              <p>{{item.projectName}}</p>
              <span>{{item.projectDes}}</span>
            </div>
            <div class="operate-box">
              <Tooltip
                class="iconpic2"
                :class="{showStar:item.collect}"
                content="星标"
                placement="top"
              >
                <span @click.stop="setStar(item.projectId)">
                  <Icon type="md-star" size="22" :class="{starOn:item.collect}"></Icon>
                </span>
              </Tooltip>
              <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                <span @click.stop="setProject(item)">
                  <Icon type="ios-settings-outline" size="22"></Icon>
                </span>
              </Tooltip>
              <Tooltip class="iconpic2" content="删除项目" placement="top">
                <span @click.stop="confirmHuishou(item)">
                  <Icon type="ios-trash-outline" size="22"/>
                </span>
              </Tooltip>
            </div>
          </div>
        </li>
        <li
          v-show="projectType=='我创建的项目'"
          class="project-list add-project"
          @click="showproject=true"
        >
          <div class="bj-img add-img">
            <Icon type="md-add"/>
          </div>
          <div class="add-project-body">创建新项目</div>
        </li>
      </ul>
      <div class="noList" v-if="projects.length==0 && projectType!='我创建的项目'">
        <img src="../assets/images/noproject.png">
        <p>暂无项目</p>
      </div>
    </div>

    <!--卡片式图-->
    <div v-show="selectView=='卡片视图'">
      <h2 class="oh" v-text="projectType">我创建的项目</h2>
      <div>
        <Row>
          <iCol span="6" v-for="(item,index) in projects" :key="index">
            <div
              @click="path(item.projectId,item.groupId)"
              class="col"
              :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`"
            >
              <h2>{{item.projectName}}</h2>
              <p>{{item.projectDes}}</p>
              <div class="iconPic">
                <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="md-settings" size="18"></Icon>
                  </span>
                </Tooltip>
                <Tooltip
                  class="iconpic2"
                  :class="{showStar:item.collect}"
                  content="星标"
                  placement="top"
                >
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="md-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                </Tooltip>
              </div>
            </div>
          </iCol>
          <iCol span="6" v-show="projectType=='我创建的项目'">
            <div class="col add-project" @click="showproject=true">
              <h1 class="center">
                <Icon type="md-add-circle"/>
              </h1>
              <h2 class="center">创建新项目</h2>
            </div>
          </iCol>
        </Row>
        <div class="noList" v-if="projects.length==0 && projectType!='我创建的项目'">
          <img src="../assets/images/noproject.png">
          <p>暂无项目</p>
        </div>
      </div>
    </div>

    <!-- 创建企业 -->
    <Modal v-model="showproject" class="newPro-modal">
      <CreateProject @hideModal="showproject=false" @getNewList="getNewList"></CreateProject>
    </Modal>
    <!-- 项目设置 -->
    <Modal v-model="projectSet" class="setPro-modal">
      <ProjectSettings
        :data="projectdata"
        @confirmguiDang="confirmguiDang"
        @confirmHuishou="confirmHuishou"
      ></ProjectSettings>
    </Modal>
    <!-- 从已归档移到回收站 -->
    <Modal class="confirmModal" v-model="modal3" title="移到回收站">
      <p
        style="padding:10px;font-size:15px;"
      >一旦将项目「{{delName}}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。</p>
      <div class="doBtn">
        <Button type="error" @click="okHuishou(delId)">移到回收站</Button>
      </div>
    </Modal>
    <!-- 取消归档 -->
    <Modal
      :mask-closable="false"
      v-model="guidangModal"
      title="取消归档项目"
      ok-text="取消归档"
      @on-ok="ok(cancelID,cancelStatus)"
      @on-cancel="cancel"
    >
      <p style="font-size:16px;margin:10px 0;padding-left:15px;">取消归档项目后，你就可以正常使用该项目了。</p>
    </Modal>

    <!-- 从回收站恢复项目 -->
    <Modal
      :mask-closable="false"
      v-model="cancelModal"
      title="恢复项目"
      @on-ok="recover(recoverId)"
      @on-cancel="cancelModal=false"
    >
      <p style="font-size:16px;margin:10px 0;padding-left:15px;">恢复项目后，你就可以正常使用该项目了。</p>
    </Modal>
    <!-- 从回收站彻底删除项目 -->
    <Modal class="confirmModal" v-model="modal4" title="移到回收站">
      <p style="padding:10px;font-size:15px;">要将项目「{{guiName}}」彻底删除吗？</p>
      <div class="doBtn">
        <Button type="error" @click="okDel(guiId)">彻底删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CreateProject from "./CreateProject.vue";
import ProjectSettings from "./projectSettings.vue";
import Loading from "../components/public/common/Loading.vue";
import { mapActions, mapState } from "vuex";
import {
  setStarProject,
  guidangProject,
  recycleProject,
  recoverProject,
  delProject
} from "@/axios/api";
export default {
  name: "index",
  components: {
    CreateProject,
    ProjectSettings,
    Loading
  },
  data() {
    return {
      //用变量承接一下要传入modal的每个id或参数
      cancelID: null,
      cancelStatus: null,
      recoverId: null,
      delId: null,
      delName: null,
      guiName: null,
      guiId: null,
      showproject: false,
      tabBox: false,
      guidangModal: false,
      cancelModal: false,
      modal3: false,
      modal4: false,
      projectSet: false,
      deleteList: [],
      projectdata: "",
      starProject: [], //星标项目
      mineCreateProject: [], //我创建的
      participationProject: [], //我参与的
      guiDangList: [], //已归档
      delLIst: [], //回收站
      user: sessionStorage.userInfo,
      projectType: "我创建的项目",
      selectView: "卡片视图",
      projectList: [
        {
          value: "我创建的项目",
          label: "我创建的项目"
        },
        {
          value: "我参与的项目",
          label: "我参与的项目"
        },
        {
          value: "星标项目",
          label: "星标项目"
        },
        {
          value: "已归档的项目",
          label: "已归档的项目"
        },
        {
          value: "回收站的项目",
          label: "回收站的项目"
        }
      ]
    };
  },
  computed: {
    ...mapState("project", ["projects", "loading", "project"])
  },
  mounted() {
    this.init("我创建的项目");
  },
  methods: {
    ...mapActions("project", ["init", "updateProject"]),
    // 选择项目类型
    selectProjectType(value) {
      this.projectType = value;
      this.$store.state.project.loading = true;
      this.init(value);
    },
    path(projectId, groupId) {
      this.$router.push(`/project/${projectId}/tasks/group/${groupId}`);
    },
    showMore() {
      this.tabBox = !this.tabBox;
    },
    ok(projectId, status) {
      guidangProject(projectId, status).then(res => {
        this.$Message.success("取消归档成功!");
        this.init(this.projectType);
      });
      this.guidangModal = false;
    },
    okHuishou(id) {
      recycleProject(id).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已移入回收站!");
          this.modal3 = false;
          this.init(this.projectType);
        }
      });
    },
    okDel(id) {
      delProject(id).then(res => {
        if (res.result == 1) {
          this.modal4 = false;
          this.$Message.success("彻底删除项目成功!");
          this.init(this.projectType);
        }
      });
    },
    cancel() {
      this.guidangModal = false;
    },

    setStar(id) {
      setStarProject(id).then(res => {
        if (res.result == 1 && res.msg == "收藏成功") {
          this.$Message.success("星标成功!");
        } else {
          this.$Message.success("取消星标成功!");
        }
        this.init("我创建的项目");
      });
    },
    getNewList(value) {
      this.init(value);
    },
    setProject(index) {
      this.projectSet = true;
      this.project = this.item;
    },
    confirmguiDang(data) {
      this.projectSet = false;
      guidangProject(data.projectId, data.projectStatus).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目归档成功!");
          this.init(this.projectType);
        }
      });
    },
    confirmHuishou(data) {
      recycleProject(data.projectId).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已移入回收站!");
          this.projectSet = false;
          this.init(this.projectType);
        }
      });
    },
    recover(id) {
      recoverProject(id).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已恢复!");
          this.init(this.projectType);
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.starOn {
  color: #ffaa31 !important;
}
.doBtn {
  padding: 15px 0;
  button {
    display: block;
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
  }
}
.container-title {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .search-box {
    width: 400px;
    height: 32px;
    margin-left: 12px;
  }
  .filtrate-box {
    height: 32px;
    display: flex;
    .select-view {
      margin-left: 10px;
      label {
        margin-left: 10px;
      }
    }
  }
}
.project-list {
  width: 1080px;
  height: 72px;
  padding: 0 20px;
  display: flex;
  margin-top: 15px;
  margin-left: 100px;
  cursor: pointer;
  &:hover .operate-box {
    display: flex !important;
  }
  &:hover p {
    color: #3da8f5;
  }
  .add-project-body {
    width: 900px;
    display: flex;
    align-items: center;
    font-size: 16px;
    transition: color 0.218s ease;
  }
  .bj-img {
    margin: 16px 20px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-position: center;
    background-size: cover;
  }
  .add-img {
    background-color: #f6f5f4;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: #aea4a1;
      font-size: 24px;
    }
  }
  .project-body {
    width: 900px;
    padding: 16px 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e7e6e3;
    .project-con {
      max-width: 750px;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        font-size: 16px;
        line-height: 24px;
      }
      span {
        font-size: 12px;
        line-height: 20px;
        color: #a6a6a6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }
    }
    .operate-box {
      width: 150px;
      height: 100%;
      display: none;
      flex-direction: row-reverse;
      align-items: center;
      transition: all 0.3s;
      i {
        margin-left: 10px;
        color: gray;
        &:hover {
          color: #3da8f5;
        }
      }
    }
  }
}
.add-project:hover .add-img {
  background-color: #e8f6fe;
}
.add-project:hover .add-img i {
  color: #4baaf6;
}
.add-project:hover .add-project-body {
  color: #3da8f5;
}
</style>
