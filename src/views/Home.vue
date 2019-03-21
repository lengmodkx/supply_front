<template>
  <div class="container index">
    <div v-if="starProject.length>0">
      <h2 class="oh">星标项目</h2>
      <div>
        <Row>
          <iCol span="6" v-for="(item,index) in starProject" :key="index">
            <div @click="path(item.projectId,item.groupId)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
              <h2>{{item.projectName}}</h2>
              <p>{{item.projectDes}}</p>
              <div class="iconPic">
                <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="edit" size="18"></Icon>
                  </span>

                </Tooltip>
                <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="android-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                </Tooltip>
              </div>
            </div>
          </iCol>
        </Row>
      </div>
    </div>

    <div>
      <h2 class="oh">我创建的项目</h2>
      <div>
        <Row>
          <iCol span="6" v-for="(item,index) in mineCreateProject" :key="index">
            <div @click="path(item.projectId,item.groupId)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
              <h2> {{item.projectName}}</h2>
              <p>{{item.projectDes}}</p>
              <div class="iconPic">
                <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="edit" size="18"></Icon>
                  </span>

                </Tooltip>
                <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="android-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                </Tooltip>

              </div>
            </div>

          </iCol>
          <iCol span="6">
            <div class="col add-project" @click="showproject=true">
              <h1 class="center">
                <Icon type="android-add-circle"></Icon>
              </h1>
              <h2 class="center">创建新项目</h2>
            </div>
          </iCol>
        </Row>
      </div>
    </div>

    <div v-if="participationProject.length>0">
      <h2 class="oh">我参与的项目</h2>
      <div>
        <Row>
          <iCol span="6" v-for="(item,index) in participationProject" :key="index">
            <div @click="path(item.projectId,item.groupId)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
              <h2>{{item.projectName}}</h2>
              <p>{{item.projectDes}}</p>
              <div class="iconPic">
                <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="edit" size="18"></Icon>
                  </span>

                </Tooltip>
                <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="android-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                </Tooltip>

              </div>
            </div>

          </iCol>
        </Row>
      </div>
    </div>

    <div style="min-height:300px;">
      <h2 class="oh">
        更多项目
        <span class="showOrhide" @click="showMore">{{tabBox?'隐藏':'显示'}}</span>
      </h2>
      <div class="moreProject" v-show="tabBox">

        <Row style="margin-top:10px;">
          <iCol span="24" class="demo-tabs-style1" style="">
            <Tabs type="card">
              <TabPane label="已归档">
                <Row v-if="guiDangList.length>0">
                  <iCol span="6" v-for="(item,index) in guiDangList" :key="index">
                    <div @click="path(item.projectId,item.groupId)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
                      <h2>{{item.projectName}}</h2>
                      <p>{{item.projectDes}}</p>
                      <div class="iconPic">
                        <Tooltip content="取消归档" placement="top">
                          <span style="margin-right:6px;" @click.stop="guidangModal = true;cancelID=item.projectId;cancelStatus=item.projectStatus;">
                            <Icon type="ios-refresh-empty" size="22"></Icon>
                          </span>

                        </Tooltip>
                        <Tooltip content="移至回收站" placement="top">
                          <span class="" @click.stop="modal3 = true;delId=item.projectId;delName=item.projectName;">
                            <Icon type="ios-trash-outline" size="20" />
                          </span>
                        </Tooltip>
                      </div>
                    </div>

                  </iCol>
                </Row>

                <div class="noList" v-if="guiDangList.length==0">
                  <img src="../assets/images/noproject.png">
                  <p>暂无已归档项目</p>
                </div>
              </TabPane>
              <TabPane label="回收站">
                <Row v-if="delLIst.length>0">
                  <iCol span="6" v-for="(item,index) in delLIst" :key="index">
                    <div @click="path(item.projectId,item.groupId)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
                      <h2>{{item.projectName}}</h2>
                      <p>{{item.projectDes}}</p>
                      <div class="iconPic">
                        <Tooltip content="恢复项目" placement="top">
                          <span style="margin-right:5px;" @click.stop="cancelModal=true;recoverId=item.projectId;">
                            <Icon type="ios-refresh-empty" size="22"></Icon>
                          </span>

                        </Tooltip>
                        <Tooltip content="归档项目" placement="top">
                          <span @click.stop="modal4=true;guiName=item.projectName;guiId=item.projectId;">
                            <Icon type="archive" size="18"></Icon>
                          </span>
                        </Tooltip>
                      </div>
                    </div>

                  </iCol>
                </Row>
                <div class="noList" v-if="delLIst.length==0">
                  <img src="../assets/images/noproject.png">
                  <p>回收站暂无项目</p>
                </div>
              </TabPane>

            </Tabs>
          </iCol>
        </Row>
      </div>
    </div>
    <!-- 创建企业 -->
    <Modal v-model="showproject" class="newPro-modal">
      <CreateProject @hideModal="showproject=false" @getNewList="getNewList"></CreateProject>
    </Modal>
    <!-- 项目设置 -->
    <Modal v-model="projectSet" class="setPro-modal">
      <ProjectSettings :data="projectdata" @confirmguiDang="confirmguiDang" @confirmHuishou="confirmHuishou"></ProjectSettings>
    </Modal>
    <!-- 从已归档移到回收站 -->
    <Modal class="confirmModal" v-model="modal3" title="移到回收站">
      <p style="padding:10px;font-size:15px;">一旦将项目「{{delName}}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。</p>
      <div class="doBtn">
        <Button type="error" @click="okHuishou(delId)">移到回收站</Button>
      </div>
    </Modal>
    <!-- 取消归档 -->
    <Modal :mask-closable="false" v-model="guidangModal" title="取消归档项目" ok-text="取消归档" @on-ok="ok(cancelID,cancelStatus)" @on-cancel="cancel">
      <p style="font-size:16px;margin:10px 0;padding-left:15px;">取消归档项目后，你就可以正常使用该项目了。</p>
    </Modal>

    <!-- 从回收站恢复项目 -->
    <Modal :mask-closable="false" v-model="cancelModal" title="恢复项目" @on-ok="recover(recoverId)" @on-cancel="cancelModal=false">
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
import CreateProject from "./CreateProject";
import ProjectSettings from "./projectSettings";
import {
  getProjectList,
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
    ProjectSettings
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
      user: sessionStorage.userInfo
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    path(projectId, groupId) {
      this.$router.push(`/project/${projectId}/tasks/group/${groupId}`);
    },
    showMore() {
      this.tabBox = !this.tabBox;
    },
    ok(projectId, status) {
      guidangProject(projectId, status).then(res => {
        this.$Message.success("取消归档成功!");
        this.getData();
      });
      this.guidangModal = false;
    },
    okHuishou(id) {
      recycleProject(id).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已移入回收站!");
          this.modal3 = false;
          this.getData();
        }
      });
    },
    okDel(id) {
      delProject(id).then(res => {
        if (res.result == 1) {
          this.modal4 = false;
          this.getData();
          this.$Message.success("彻底删除项目成功!");
        }
      });
    },
    cancel() {
      this.guidangModal = false;
    },
    getData() {
      //更新列表
      getProjectList().then(res => {
        this.starProject = res.data.filter(v => {
          return v.collect == 1 && v.projectDel == 0 && v.projectStatus == 0;
        });
        this.mineCreateProject = res.data.filter(v => {
          return (
            v.memberLabel == 1 && v.projectDel == 0 && v.projectStatus == 0
          );
        });
        this.participationProject = res.data.filter(v => {
          return (
            v.memberLabel == 0 && v.projectDel == 0 && v.projectStatus == 0
          );
        });
        this.guiDangList = res.data.filter(v => {
          return v.projectStatus == 1 && v.projectDel == 0;
        });
        this.delLIst = res.data.filter(v => {
          return v.projectDel == 1;
        });
      });
    },
    setStar(id) {
      setStarProject(id).then(res => {
        if (res.result == 1 && res.msg == "收藏成功") {
          this.$Message.success("星标成功!");
          this.getData();
        } else {
          this.getData();
          this.$Message.success("取消星标成功!");
        }
      });
    },
    getNewList() {
      getProjectList().then(res => {
        this.mineCreateProject = res.data.filter(v => {
          return v.memberLabel == 1;
        });
      });
    },
    setProject(data) {
      this.projectSet = true;
      this.projectdata = data;
    },
    confirmguiDang(data) {
      this.projectSet = false;
      guidangProject(data.projectId, data.projectStatus).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目归档成功!");
          this.getData();
        }
      });
    },
    confirmHuishou(data) {
      recycleProject(data.projectId).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已移入回收站!");
          this.projectSet = false;
          this.getData();
        }
      });
    },
    recover(id) {
      recoverProject(id).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已恢复!");
          this.getData();
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
</style>
