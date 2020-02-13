<template>
  <div class="file-tools">
            <div class="left">
                   <div class="pull-box">
                          <div class="pull" @click="showAddFolder=true">
                            <img src="../../../assets/images/wjj.png" alt="">
                            <span>新建文件夹</span>
                          </div>
                    </div>                  
                    <div class="pull-box">
                      <div class="pull">
                        <img src="../../../assets/images/view6.png" alt="">
                        <span>上传</span>
                          <Poptip placement="bottom" width="200" v-model="visibleTip">
                            <button class="pull-icon"><img src="../../../assets/images/button.png" alt=""></button>
                            <div class="pull-pop" slot="content">
                              <ul>
                                <li v-for="(item,index) in pullList" :key='index' @click="upload(item)">
                                  <img :src="item.src" alt=""> {{item.name}}
                                </li>
                              </ul>
                            </div>
                          </Poptip>
                      </div>
                    </div>
                    <div class="pull-box"  v-show="itemfile.show">
                          <div    class="pull" @click="downLoad(itemfile.fileId)">
                            <img src="../../../assets/images/view9.png" alt="">
                            <span>下载</span>
                          </div>
                          <!-- <div class="pull clear-border">
                            <img src="../../../assets/images/view5.png" alt="">
                            <span>分享</span>
                          </div> -->
                           <div class="pull clear-border"  @click="removeClone('移动')">
                            <img src="../../../assets/images/view12.png" alt="">
                            <span>移动</span>
                          </div>
                           <div class="pull clear-border"  @click="removeClone('复制')">
                            <img src="../../../assets/images/view13.png" alt="">
                            <span>复制</span>
                          </div>
                          <div class="pull clear-border"  @click="showFileEdit=true;modalTitle='修改文件名称'">
                            <img src="../../../assets/images/view7.png" alt="">
                            <span>重命名</span>
                          </div>
                          <div class="pull clear-border"   @click="rublish=true;modalTitle='移到回收站'">
                            <img src="../../../assets/images/view8.png" alt="">
                            <span>删除</span>
                          </div>
                    </div>
            </div>
            <div  class="right">

               <!-- 缩放 -->
                <Poptip placement="bottom" width="204"   >
                  <div class="view" ><img src="../../../assets/images/view11.png" alt=""></div>
                  <div class="silder-box" slot="content">
                       <Slider class="silder" v-model="sliderValue" :max='64' :tip-format="hideFormat"></Slider>
                  </div>
                </Poptip>

                <!-- 排序 -->
                <!-- <Poptip placement="bottom" >
                  <div class="view" ><img src="../../../assets/images/view1.png" alt=""></div>
                  <div class="view-pop" slot="content">
                          <ul>
                            <li v-for="(item,index) in sortList" :key='index'>
                              <img v-show='item.src' :src="item.src" alt=""> 
                              {{item.name}}
                            </li>
                          </ul>
                  </div>
                </Poptip> -->
                <!-- 列表 -->
                <div class="view"  @click="changeShowView('list')"><img src="../../../assets/images/view3.png" alt=""></div>
                <!-- 缩略图 -->
                <div class="view " @click="changeShowView('view')" ><img src="../../../assets/images/view2.png" alt=""></div>
            </div>
            <Modal v-model="showModelFile" title="上传模型文件"  class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
                <model-file  @close="showModelFile=false" :fileId="itemfile.fileId" ></model-file>
            </Modal> 
            <Modal v-model="showCommonFile" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
              <common-file  @close="showCommonFile=false"    :fileId="itemfile.fileId" :projectId="projectId"></common-file>
            </Modal>
            

             <!--创建文件夹 模态框-->
            <Modal v-model="showAddFolder" :footer-hide="true" title="创建文件夹" class-name="file-vertical-center-modal" :width="350">
              <Input v-model="folderName" placeholder="请输入文件夹名称" class="folderName" ref="input" @keyup.enter.native="handleSave" />
              <div>
                <Button type="info" long @click="handleSave">确定</Button>
              </div>
            </Modal>
            <Modal v-model="rublish" :width="350" :footer-hide="true" class-name="vertical-center-modal">
                <div class="rublish">
                        <p>您确定要把该文件移到回收站吗？</p>
                        <Button long type="error" @click="putRecyclebin(itemfile.fileId)">移到回收站</Button>
                </div>
            </Modal>
            <Modal v-model="showFileEdit" :width="350" :footer-hide="true" class-name="vertical-center-modal">
                      <div  class="rublish">
                        <div class="rublish-input">
                          <Input v-model.trim="editFileName"/>
                        </div>
                        <Button long type="primary" @click='fileEdit(itemfile.fileId)'>确定</Button>
                      </div>
            </Modal>   

            <!--复制、移动 模态框-->
            <Modal v-model="showMove" :z-index=11111 class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
              <div slot="header">
                <span style="font-size:18px">移动文件{{fileName}}至</span>
              </div>
              <div class="move-and-mobile-file">
                <div class="column-projects flex-static thin-scroll">
                  <div class="project-title">项目</div>
                  <ul>
                    <li v-for="(project, index) in projects" :key="index" :class="{ selected:project.projectId==projectId,unselected:project.projectId!=projectId }" @click="changeProject(project.projectId)">
                      <span>{{project.projectName}}</span>
                    </li>
                  </ul>
                </div>
                <div class="picker-column thin-scroll flex-fill flex-vert">
                  <Loading v-show="loading1"></Loading>
                  <v-jstree :data="asyncData1" show-checkbox :multiple=false whole-row  ref="jstree" children-field-name="child"></v-jstree>
                </div>

              </div>
              <div slot="footer" class="move-footer">
                <span>{{footerTxt}}</span>
                <div class="move-footer-btn">
                  <Button type="default" size="large" @click="cancelRemoveClone">取消</Button>
                  <Button type="primary" size="large" @click="removeCloneFile">确定</Button>
                </div>
              </div>
            </Modal>       
  </div>
</template>
<script>
import commonFile from '@/components/project/file/commonfile.vue'  //上传普通文件
import modelFile from '@/components/project/file/model.vue'  //上传模型文件

import { mapState, mapActions, mapMutations } from "vuex";
import VJstree from "vue-jstree";
import {createFolder,getProjectList,folderChild,} from "../../../axios/api.js";


import {
  changeName,
  downloadFile,
  jionPeople,
  removeFile,
  cloneFile,
  recycleBin,
  filePrivacy
} from "@/axios/fileApi";


export default {
  components: {commonFile,modelFile, VJstree,},
  data () {
    return {
      asyncData1:[
        {
            "text": "Same but with checkboxes",
            "child": [
              {
                "text": "initially selected",
                "selected": true
              },]
        },
        
      ],
      asyncData2:[
        {
            "id": "66fae9757ff940cea6da111d925335f7",
            "name": null,
            "text": "测试文件夹2",
            "open": null,
            "selected": null,
            "projectId": "950065c9ef444daea3103bf8eee4ad0f",
            "children": null,
            "child": [{
                "id": "907add74f48b4fd3afa3641e89f180ea",
                "name": null,
                "text": "测试子文件夹",
                "open": null,
                "selected": null,
                "projectId": "950065c9ef444daea3103bf8eee4ad0f",
                "children": null,
                "child": null,
                "pid": "66fae9757ff940cea6da111d925335f7"
            }, {
                "id": "89e14006d30043fe8a0be462520e1ed1",
                "name": null,
                "text": "测试子文件夹",
                "open": null,
                "selected": null,
                "projectId": "950065c9ef444daea3103bf8eee4ad0f",
                "children": null,
                "child": null,
                "pid": "66fae9757ff940cea6da111d925335f7"
            }],
            "pid": "e6113e7763554732a150fdfdb69a01cb"
        }, {
            "id": "784441f1072a41479b24bc5b5aa651a5",
            "name": null,
            "text": "测试文件夹",
            "open": null,
            "selected": null,
            "projectId": "950065c9ef444daea3103bf8eee4ad0f",
            "children": null,
            "child": null,
            "pid": "e6113e7763554732a150fdfdb69a01cb"
        }, {
            "id": "f0adef061e4a4216be552de0abac005f",
            "name": null,
            "text": "公共模型库",
            "open": null,
            "selected": null,
            "projectId": "950065c9ef444daea3103bf8eee4ad0f",
            "children": null,
            "child": null,
            "pid": "e6113e7763554732a150fdfdb69a01cb"
        }
      ],
      
      pullList:[
        {name:'上传普通文件',src:require('../../../assets/images/view6.png')},
        {name:'上传模型文件',src:require('../../../assets/images/view6.png')}
      ],
      sortList:[
        {name:'名称',src:require('../../../assets/images/view10.png')},
        {name:'类型'},
        {name:'大小'},
        {name:'修改时间'},
        {name:'递增',src:require('../../../assets/images/view10.png')},
        {name:'递减'}
      ],

       showCommonFile:false,
       showModelFile:false,
       showmodelMove:false,//移动弹窗
       moveTitel:'',
       visibleTip: false,
       sliderValue: 21,
       fileId: this.$route.params.fileId,
       projectId: this.$route.params.id,
       showAddFolder: false,//新建文件夹
       folderName: "",
       rublish: false,
       modalTitle:"文件菜单",
       showFileEdit: false,
       editFileName: "",
         showMove: false,
          fileName: "",
       projects: [],
         loading1: false,
          asyncData: [],
           footerTxt: "跨项目移动时，部分信息不会被保留。",
          }
  },
  computed: {
    ...mapState("tree", ["showView","slider"]),
     ...mapState("file", ["files","itemfile",'createFileId']),
   },
  methods: {
      ...mapActions("tree", ["changeShowView","changeSlider"]),
      // 打开弹窗
      upload(item){
        this.visibleTip=false;
        if(item.name=='上传普通文件'){
             this.showCommonFile=true

        }else if(item.name=='上传模型文件'){
              this.showModelFile=true
        }
      },
      // 缩放
      hideFormat () {
            this.changeSlider(this.sliderValue)
            return null;
      },
      //移动
      move(){
          this.showmodelMove=true
          this.moveTitel='移动文件至'
      },
      //创建文件夹
       handleSave() {
            if (this.folderName == null || this.folderName == "") {
              this.$Notice.warning({
                title: "请输入文件夹名称"
              });
              this.$refs.input.focus();
              return false;
            }
            let params = {
              projectId: this.projectId,
              folderName: this.folderName
            };
            createFolder(this.createFileId, params).then(res => {
              if (res.result == 1) {
                this.$Notice.success({
                  title: "创建成功"
                });
                this.showAddFolder = false;
                this.folderName = "";
              }
            });

      },
      // 下载
       downLoad(fileId) {
          window.location.href =
            process.env.NODE_ENV == "test"
              ? "/api/files/" + fileId + "/download"
              : process.env.VUE_APP_URL + "/files/" + fileId + "/download";
        },
      //点击 移动、复制文件
      removeClone(caozuo) {
        this.caozuo = caozuo;
        this.showMove = true;
        this.footerTxt = "跨项目移动时，部分信息不会被保留。";
        this.asyncData = [this.$refs.jstree.initializeLoading()];
        folderChild(this.projectId).then(res => {
          this.asyncData = res.data;
          this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
        });
      },
      // 移动、复制文件的确定按钮
      removeCloneFile() {
          if (this.caozuo === "移动") {
            removeFile(this.folderId, this.thisFileId, this.projectId).then(
              res => {
                if (res.result) {
                  this.$Message.success("移动成功");
                  this.showMove = false;
                }
              }
            );
          } else if (this.caozuo === "复制") {
            cloneFile(this.folderId, this.thisFileId).then(res => {
              this.$Message.success("复制成功");
              this.showMove = false;
            });
          }
        
      },
      // 移到回收站
      putRecyclebin(fileId) {
        console.log(fileId)
        recycleBin(fileId, this.projectId).then(res => {
          if (res.result) {
            this.$Message.success("成功移到回收站");
            this.popHid();
          }
        });
      },
       //文件修改名
      fileEdit(id) {
        if (this.editFileName == "") {
          this.$Message.info("请输入名称");
        }
        changeName(id, this.editFileName).then(res => {
          this.showFileEdit = false;
          this.$Message.info("修改名称成功");
          this.editFileName=''
        });
      },
      // 移动、赋值文件框打开关闭
      changeVisible(bool) {
        if (bool) {
          this.projectId = this.$route.params.id;
          this.projectList();
        } else {
          this.projects = [];
          this.items = [];
        }
      },
        // 获取项目列表
        projectList() {
          getProjectList().then(res => {
            if (res.result == 1) {
              this.projects = res.data;
            }
          });
        },
        
       // 改变选择的项目
      changeProject(projectId) {
        this.loading1 = true;
        this.items = [];
        this.projectId = projectId;
        folderChild(this.projectId).then(res => {
          this.asyncData = res.data;
          this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
          this.loading1 = false;
        });
      },
      // 取消 移动复制
      cancelRemoveClone() {
        this.folderId = "";
        this.showMove = false;
      },
      
  },
}

</script>
<style lang="less">
  .file-tools{
      width: 100vm;
      height: 35px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      
      .left{
            display: flex;
            .pull-box{
                margin-right: 10px;
                .pull{   
                    float: left;       
                    height: 24px;
                    line-height: 24px;
                    display: flex;
                    border:1px solid #dddddd;
                    cursor: pointer;
                    img{
                      width: 16px;
                      height: 16px;
                      margin: 3px 10px;
                    }
                    span{
                      margin-right: 15px;
                    }
                    .pull-icon{
                      width: 32px;
                      height: 22px;
                      border: none;
                      border-left: 1px solid #dddddd;
                      margin-left: 10px;
                      background: #fff;
                      cursor: pointer;
                      img{
                        width: 8px;
                        height: 5px;
                      }
                    }
                   .pull-pop{
                      li{
                          display: flex;
                          align-items:center;
                          margin:5px 0px;
                      }
                    }
                  }
                  .clear-border{
                        border-left: none
                  } 
              }       
      }
      .right{
        margin-right: 10px;
        .view{
          cursor: pointer;
          float: right;
          padding:4px 5px 2px;
          border: 1px solid #dddddd;
        }
        .silder-box{
          padding-left: 10px;
        }
        .view-pop{
                li{ 
                    cursor: pointer;
                    line-height: 25px;
                    position: relative;
                    padding-left: 30px;
                    img{
                      position: absolute;
                      left: 0;
                      top:5px;
                    }
                 }
        }
        .silder{
          width: 150px;;
        }
      }
      
}

.folderName {
          width: 320px;
          margin-bottom: 15px;
          margin-top: 5px;
          margin-left: 0px;
}
</style>