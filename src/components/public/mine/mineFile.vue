<template>
    <!-- 文件 -->
    <div >
        <div class="inner file">
            <div class="file-head">
                <span class="now">我创建的</span><span>我参与的</span>
            </div>
            <div class="file-title">
                <!--没选文件时-->
                <div v-if="checkedFile.length=='0'" class="select-no">
                    <div>
                        <div v-show="moShi=='liebiao'" class="file-title-left">
                            <div class="check-box"></div>
                            <div class="file-con">
                                <div class="file-name">名称</div>
                            </div>
                            <div class="file-size">大小</div>
                            <div class="file-time">更新时间</div>
                        </div>
                    </div>

                    <div class="file-title-right">
                        <Tooltip content="列表模式">
                            <Icon :class="{now:moShi=='liebiao'}" @click="moShi='liebiao'" type="ios-list-box-outline" />
                        </Tooltip>
                        <Tooltip content="缩略图模式">
                            <Icon :class="{now:moShi=='tupian'}" @click="moShi='tupian'" type="ios-keypad-outline" />
                        </Tooltip>

                    </div>
                </div>
                <!--选了文件-->
                <div v-else class="select-has">
                    <div class="select-has-left">
                        <p>已选择{{checkedFile.length}}项</p>
                        <div @click="removeClone('移动')"><Icon type="ios-log-out" />移动</div>
                        <div @click="removeClone('复制')"><Icon type="md-copy" />复制</div>
                        <div @click="collectFile"> <Icon type="ios-archive-outline" />收藏</div>
                        <div><Icon type="ios-trash-outline" />删除</div>
                    </div>
                </div>
            </div>
            <div class="file-content">
                <!--列表模式-->
                <CheckboxGroup v-model="checkedFile" @on-change="checkedClick">
                    <ul v-if="moShi==='liebiao'" class="liebiao">
                        <li v-for="(f,n) in files" :key="n">
                            <div class="check-box">
                                <Checkbox  :label="f.fileId" size="default"><span> </span></Checkbox>
                            </div>
                            <div @click="fileDetail(f.fileId,f)" class="file-con">
                                <img v-if="f.ext==='.jpg' || f.ext==='.png' " :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${f.fileUrl}`" alt="">
                                <img v-else src="@/icons/img/moren.png" alt="">

                                <Tooltip class="file-name" :content="f.fileName">
                                    {{f.fileName}}
                                </Tooltip>
                            </div>
                            <div class="file-size">{{f.size}}</div>
                            <div class="file-time"><Time :time="f.updateTime" /></div>
                            <Icon type="ios-cloud-download-outline" />
                            <Icon type="ios-arrow-dropdown" @click="showFileMenu($event,'0', f.fileId)"></Icon>
                        </li>
                    </ul>
                </CheckboxGroup>

                <!--图片模式-->
                <CheckboxGroup v-model="checkedFile" @on-change="checkedClick">
                    <ul v-if="moShi==='tupian'" class="tupian">
                        <li v-for="f in files" :class="{checked:checkedFile.includes(f.fileId)}" :key="f.fileId">
                            <div @click="fileDetail(f.fileId,f)" class="file-img-box">
                                <img  v-if="f.ext==='.jpg' || f.ext==='.png' " :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${f.fileUrl}`" alt="">
                                <img v-else src="@/icons/img/moren.png" alt="">
                                <div @click.stop class="check-box">
                                    <Checkbox  :label="f.fileId" size="default"><span> </span></Checkbox>
                                </div>
                                <div class="xiazai"><Icon type="ios-cloud-download-outline" /></div>
                                <div class="gengduo"><Icon type="ios-arrow-dropdown" @click.stop="showFileMenu($event,'110', f.fileId)"></Icon></div>
                            </div>
                            <div class="file-name-box">
                                <Tooltip content="Here is the prompt text">
                                    <input type="text" v-model="f.fileName">
                                </Tooltip>
                            </div>
                        </li>
                    </ul>
                </CheckboxGroup>

            </div>
        </div>
        <mineFileMenu @closeFileMenu="closeFileMenu" @openMenu="removeClone" v-if="visible" class="mine-file-menu" :data="fileData" :style="{left:left,bottom:top}"></mineFileMenu>

        <!--文件详情-->
        <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail" :closable="false">
            <fileDetail @close="closeDetail" v-if="showModelDetai"></fileDetail>
        </Modal>
        <!--模型文件详情-->
        <Modal class="nopadding" v-model="showModelFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
            <modelFileDetail :url="svfUrl" v-if="showModelFileDetail"></modelFileDetail>
        </Modal>
        <!--复制、移动 模态框-->
        <Modal v-model="showMove" :z-index=11111 class-name="vertical-center-modal" width="800" @on-visible-change="changeVisible" class="show-move">
            <div slot="header">
                <span style="font-size:18px">{{caozuo}}文件至</span>
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
                    <Loading v-show="loading"></Loading>
                    <v-jstree :data="asyncData" show-checkbox :multiple=false whole-row @item-click="itemClick" ref="jstree" children-field-name="child"></v-jstree>
                </div>

            </div>
            <div slot="footer" class="move-footer">
                <span>跨项目{{caozuo}}时，部分信息不会被保留。</span>
                <div class="move-footer-btn">
                    <Button type="default" size="large" @click="cancelRemoveClone">取消</Button>
                    <Button type="primary" size="large" @click="removeCloneFile">确定</Button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
import VJstree from "vue-jstree";
import mineFileMenu from './mineFileMenu'
import fileDetail from "@/components/project/file/fileDetail";
import modelFileDetail from "@/components/project/file/modelFileDetail";
import {files, createFolder, getProjectList, folderChild, collect, getMeFile} from "@/axios/api.js";
import { getFileDetails, getChildFiles, removeFile, cloneFile } from "@/axios/fileApi";
import {mapMutations} from 'vuex'
export default {
    data () {
      return {
          moShi: 'liebiao',
          single:'',
          left:0,
          top:0,
          files:[],
          checkedFile:[],
          fileData:{
              privacyPattern:'',
              collect:''
          },
          visible:false,
          showModelDetai: false,
          showModelFileDetail: false,
          svfUrl: "",
          showMove: false,
          caozuo: "",
          projects: [],
          loading: false,
          asyncData: [],
          folderId: "",
          rublish: false,
          thisFileId: "",
      }
    },
    components:{ mineFileMenu, fileDetail, modelFileDetail, VJstree },
    methods: {
        ...mapMutations("file", ["putOneFile"]),
        showFileMenu(e, n, id){
            this.left=e.clientX-120+'px'
            this.top=e.clientY-n+'px'
            this.visible=true
            this.thisFileId = id;
        },
        closeFileMenu(){
            this.visible=false
        },
        closeDetail() {
            this.showModelDetai = false;
        },
        getMeFile(){
            getMeFile().then(res => {
                if(res.result === 1){
                    this.files = res.data
                }
            })
        },
        // 点击复选框，选中文件
        checkedClick () {
            this.thisFileId=this.checkedFile.join(',')
        },
        // 点击文件、文件夹进入详情
        fileDetail(id, file) {
            if (".svf".includes(file.ext)) {
                // 模型文件
                getFileDetails(id).then(res => {
                    this.svfUrl = res.data.fileUrl;
                    this.showModelFileDetail = true;
                });
            } else {
                // 普通文件
                    this.loading = true;
                    getFileDetails(id).then(res => {
                        this.loading = false;
                        this.putOneFile(res);
                        this.showModelDetai = true;
                    });
            }
        },
        // 选中要移动到哪
        itemClick(node) {
            this.folderId = node.data.id;
            console.log(node.data.id);
        },
        // 取消 移动复制
        cancelRemoveClone() {
            this.folderId = "";
            this.showMove = false;
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
            alert(this.thisFileId)
            if (this.folderId) {
                if (this.caozuo === "移动") {
                    removeFile(this.folderId, this.thisFileId, this.projectId).then(
                        res => {
                            console.log(res)
                            if (res.result) {
                                this.$Message.success("移动成功");
                                this.showMove = false;
                            }else {
                                this.$Message.error("目标文件夹已存在该文件");
                            }
                        }
                    );
                } else if (this.caozuo === "复制") {
                    cloneFile(this.folderId, this.thisFileId).then(res => {
                        this.$Message.success("复制成功");
                        this.showMove = false;
                    });
                }
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
        // 改变选择的项目
        changeProject(projectId) {
            this.loading = true;
            this.items = [];
            this.projectId = projectId;
            folderChild(this.projectId).then(res => {
                this.asyncData = res.data;
                this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
                this.loading = false;
            });
        },
        // 收藏文件
        collectFile () {
            // let data = {
            //     projectId: this.projectId,
            //     publicId: this.thisFileId,
            //     collectType: "文件"
            // };
            // collect(data).then(res => {
            //     if (res.result) {
            //         this.$Message.success("收藏成功");
            //     }
            // });
        }
    },
    created(){
        this.getMeFile()
    }
}
</script>

<style scoped lang="less">
@import "../Mine";
    .mine-file-menu{
        position: fixed;
        z-index: 999;
        background-color: white;
    }
.move-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.move-and-mobile-file {
    display: flex;
}
.flex-static {
    flex-shrink: 0;
}
.column-projects {
    width: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    height: 438px;
    border-right: 1px solid #e5e5e5;
    .project-title {
        font-size: 14px;
        color: gray;
        font-weight: 700;
        height: 40px;
        line-height: 40px;
        padding-left: 14px;
    }
    .project-list {
        height: 30px;
        font-size: 13px;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        line-height: 30px;
        padding-left: 14px;
    }
}
.selected {
    background: #3da8f5;
    color: white;
    height: 30px;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
    padding-left: 10px;
}
.unselected {
    &:hover {
        background: #eee;
    }
    height: 30px;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
    padding-left: 10px;
}
</style>