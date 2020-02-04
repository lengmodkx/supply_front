<template>
  <div class="wrap-box">
    <!--树形结构-->
    <!-- <div class="project-tree" v-if="selectView==='列表视图'">
      <p>项目树</p>
      <Tree :data="treeData" :load-data="loadData" empty-text="暂无项目"></Tree>
    </div> -->
    <div class="container index">
      <div class="container-title">
        <div class="search-box">
          <Input v-model.trim="searchWords" search enter-button
                 placeholder="请输入项目名称关键字进行搜索"
                 @on-search="searchProject" @on-keyup="searchNo" />
        </div>
        <div class="filtrate-box">
          <Select v-model="projectType" @on-change="selectProjectType" style="width:200px" placeholder="我创建的项目">
            <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <RadioGroup class="select-view" v-model="selectView" type="button" @on-change="changeView">
            <Radio label="卡片视图"></Radio>
            <Radio label="列表视图"></Radio>
          </RadioGroup>
          <Button type="primary" style="margin-left:10px" @click="showproject=true">创建新项目</Button>
        </div>
      </div>
      <Loading v-if="searchLoading"></Loading>
      <!--列表视图-->
      <loading v-if="loading"></loading>
      <div v-show="selectView=='列表视图'">
        <h2 class="oh" v-text="projectType">我创建的项目</h2>
        <!--搜索项目-->
        <ul v-if="searchData.length">
          <li class="project-list" v-for="(item,index) in searchData" :key="index" @click="path(item)">
            <div class="bj-img" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`"></div>
            <div class="project-body">
              <div class="project-con">
                <p>{{item.projectName}}</p>
                <span>{{item.projectDes}}</span>
              </div>
              <div class="operate-box">
                <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
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
                  <Icon type="ios-trash-outline" size="22" />
                </span>
                </Tooltip>
              </div>
            </div>
          </li>
        </ul>
        <!--正常显示-->
        <ul v-else-if="!loading && !isSearch">
          <li class="project-list" v-for="(item,index) in projects" :key="index" @click="path(item)">
            <div class="bj-img" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`"></div>
            <div class="project-body">
              <div class="project-con">
                <p>{{item.projectName}}</p>
                <span>{{item.projectDes}}</span>
              </div>
              <div class="operate-box" v-if="projectType!='回收站的项目'">
                <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
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
                    <Icon type="ios-trash-outline" size="22" />
                  </span>
                </Tooltip>
              </div>
              <div v-else class="operate-box">
                  <Tooltip class="iconpic2" content="恢复项目" placement="top">
                    <span @click.stop="recover(item.projectId)">
                      <Icon type="md-refresh" size="22"/>
                    </span>
                  </Tooltip>
              </div>
            </div>
          </li>
          <li v-show="projectType=='我创建的项目'" class="project-list add-project" @click="showproject=true">
            <div class="bj-img add-img">
              <Icon type="md-add" />
            </div>
            <div class="add-project-body">创建新项目</div>
          </li>
        </ul>
        <div class="noList" v-if="projects.length==0 && !loading && projectType!='我创建的项目'">
          <img src="../assets/images/noproject.png">
          <p>暂无项目</p>
        </div>
      </div>

      <!--卡片式图-->
      <div v-show="selectView=='卡片视图'">
        <h2 class="oh" v-text="projectType">我创建的项目</h2>
        <div>
          <!--搜索项目-->
          <Row v-if="searchData.length">
            <iCol span="6" v-for="(item,index) in searchData" :key="index">
              <div @click="path(item)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
                <h2>{{item.projectName}}</h2>
                <p>{{item.projectDes}}</p>
                <div class="iconPic" v-if="projectType!='回收站的项目'">
                  <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="md-settings" size="18"></Icon>
                  </span>
                  </Tooltip>
                  <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="md-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                  </Tooltip>
                </div>
              </div>
            </iCol>
          </Row>
          <!--正常显示-->
          <Row v-else-if="!loading && !isSearch" >
            <iCol span="6" v-for="(item,index) in projects" :key="index">
              <div @click="path(item)" class="col" :style="`background-image: url(https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.projectCover})`">
                <h2>{{item.projectName}}</h2>
                <p>{{item.projectDes}}</p>
                <div class="iconPic"  v-if="projectType!='回收站的项目'">                
                  <Tooltip class="iconpic2" :class="{showStar:item.collect}" content="星标" placement="top">
                  <span @click.stop="setStar(item.projectId)">
                    <Icon type="md-star" size="18" :class="{starOn:item.collect}"></Icon>
                  </span>
                  </Tooltip>
                   <Tooltip class="iconpic1" content="打开项目设置" placement="top">
                  <span @click.stop="setProject(item)">
                    <Icon type="md-settings" size="18"></Icon>
                  </span>
                  </Tooltip>
                </div>
                <div v-else class="iconPic">
                  <Tooltip class="iconpic2" content="恢复项目" placement="top">
                    <span @click.stop="recover(item.projectId)">
                      <Icon type="md-refresh" size="22"/>
                    </span>
                  </Tooltip>
                </div>
              </div>
            </iCol>
            <iCol span="6" v-show="projectType=='我创建的项目'">
              <div class="col add-project" @click="showproject=true">
                <h1 class="center">
                  <Icon type="md-add-circle" />
                </h1>
                <h2 class="center">创建新项目</h2>
              </div>
            </iCol>
          </Row>
          <div class="noList" v-if="projects.length==0 && !loading && projectType!='我创建的项目'">
            <img src="../assets/images/noproject.png">
            <p>暂无项目</p>
          </div>
        </div>
      </div>

      <!-- 创建项目 -->
      <Modal v-model="showproject" class="newPro-modal" :mask-closable="false">
        <CreateProject :showProject='showproject' @hideModal="showproject=false" @getNewList="getNewList"></CreateProject>
      </Modal>
      <!-- 项目设置 -->
      <Modal v-model="projectSet" class="setPro-modal">
        <ProjectSettings  @close-settings="closeSettings" ></ProjectSettings>
      </Modal>

      <Modal class="confirmModal" v-model="showBin" title="移到回收站">
        <p style="padding:10px;font-size:15px;">一旦将项目「{{this.binName}}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。</p>
        <div class="doBtn">
          <Button type="error" @click="okHuishou" >移到回收站</Button>
        </div>
      </Modal>
    </div>
  </div>

</template>

<script>
import CreateProject from "./CreateProject.vue";
import ProjectSettings from "./projectSettings.vue";
import Loading from "../components/public/common/Loading.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import { getPhoneCode, bindPhone,showBindPhone } from "@/axios/api";
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
    CreateProject,
    ProjectSettings,
    Loading
  },
  data() {
    return {
      dis:true,  //取消显示状态
      showCodeButton:true,//验证码倒计时  
      count: '',
       timer: null,      
      showFirst:false,//显示第一次手机号验证框
      //用变量承接一下要传入modal的每个id或参数
      showBin:false,//显示回收站
      binName:'',//回收站项目名称
      binProjectId:'',
      cancelID: null,
      searchWords: '',
      isSearch: false,
      searchData: [],
      cancelStatus: null,
      searchLoading: false,
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
      companyId: this.$route.params.orgid,
      projectType: "我创建的项目",
      selectView: "卡片视图",
      treeData: [
        {
          title: 'parent',
          loading: false,
          children: []
        }
      ],
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
    this.orgProjectInit({'id': this.companyId,'type':'我创建的项目'})
  },
  created:function(){
      //this.showFirstBox();
  },
  methods: {
    ...mapActions("project", ["init", "updateProject", "openSet",'orgProjectInit']),
    ...mapMutations("project", ["setName"]),
    // 选择项目类型
    selectProjectType(value) {
      this.projectType = value;
      this.$store.state.project.loading = true;
      //this.init(value);
      this.orgProjectInit({'id': this.companyId,'type':value})
    },
    path(item) {
      this.setName(item.projectName);
      localStorage.projectName=item.projectName
      this.$router.push(
        `/project/${item.projectId}/tasks/group/${item.groupId}`
      );
    },
    showMore() {
      this.tabBox = !this.tabBox;
    },
    setStar(id) {
      setStarProject(id).then(res => {
        if (res.result == 1 && res.msg == "收藏成功") {
          this.$Message.success("星标成功!");
        } else {
          this.$Message.success("取消星标成功!");
        }
        //this.init("我创建的项目");
        this.orgProjectInit({'id': this.companyId,'type':'我创建的项目'})
      });
    },
    getNewList(value) {
      //this.init(value);
      this.orgProjectInit({'id': this.companyId,'type':value})
      if (this.selectView==='列表视图'){
        getProjectTree('').then(res => {
          this.treeData=res.data
        })
      }
      
    },
    //打开项目设置
    setProject(item) {
      this.projectSet = true;
      this.openSet(item.projectId);
    },
    recover(id) {
      recoverProject(id).then(res => {
        if (res.result == 1) {
          this.$Message.success("项目已恢复!");
          //this.init(this.projectType);
          this.orgProjectInit({'id': this.companyId,'type':this.projectType})
        }
      });
    },
    // 搜索项目
    searchProject(value) {
      if(value==''){
        //this.init(this.projectType);
        this.orgProjectInit({'id': this.companyId,'type':this.projectType})
        return
      }
      
      let arr={
        '我创建的项目':'created',
        '我参与的项目': 'join',
        '星标项目': 'star'
      }
      this.searchLoading=true
      this.isSearch=true
      searchProjects(value,arr[this.projectType]).then(res => {
        this.searchLoading=false
        this.searchData=res.data
      })
    },
    searchNo(){
      if (this.searchWords==''){
        this.searchData=[]
        this.isSearch=false
      }
    },
  
     closeSettings:function(data){
        this.projectSet=data
    },
    //删除项目
    confirmHuishou:function(data){
      this.showBin=true;
      this.binName=data.projectName
      this.binProjectId=data.projectId
    },
    okHuishou(){
       recycleProject(this.binProjectId).then(res=>{
          if(res.result=='1'){
              this.showBin=false
          }       
      })

    },
    // 卡片，列表视图切换
    changeView (data) {
      if (data==='列表视图') {
        getProjectTree('').then(res => {
          this.treeData=res.data
        })
      }
    },
    // 加载树形 子项目
    loadData (item, callback) {
      getProjectTree(item.id).then(res => {
        callback(res.data);
      })
      setTimeout(() => {
        const data = [
          {
            title: 'children',
            loading: false,
            children: []
          },
          {
            title: 'children',
            loading: false,
            children: []
          }
        ];

      }, 1000);
    }
  }

};

 const validatePhone = (rule, value, callback) => {
  if (!value) {
      return callback(new Error('请输入手机号'));
  } else if (!/^1[34578]\d{9}$/.test(value)) {
      callback('手机号格式不正确');
  } else {
      callback();
  }   
}
</script>
<style scoped lang="less">

.boundBox{
  padding-bottom: 40px;
  .boundInput{
    button{
    margin-left: 20px;
   }
  }
  .boundButton{
    float: right;
    button{
      margin-right: 10px;
    }
  }
}
.wrap-box{
  width: 100%;
  display: flex;
  .project-tree{
    width: 250px;
    height: 100vh ;
    flex: none;
    padding: 70px 10px 10px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
    /deep/ .ivu-tree-title{
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
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
    }
  }
}

.project-list {
  width: calc(100% - 100px) ;
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