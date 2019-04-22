<template>
    <div style="width: 100%;height: 100%">
        <header class="f-header">
            <Icon class="close" @click="$emit('close')" type="md-close" />
            <Tooltip content="点击编辑">
                <input type="text" class="f-header-left" @blur="changeFileName" v-model="file.data.fileName" />
            </Tooltip>

            <div class="f-header-right">
                <Dropdown trigger="click" class="upload-file" @on-click="showFileChoose($event)">
                    <p class="padd8"><Icon type="ios-cloud-upload-outline" />更新版本</p>
                    <DropdownMenu slot="list">
                        <DropdownItem name="model">上传模型文件</DropdownItem>
                        <DropdownItem name="commonfile">上传普通文件</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <p @click="downLoad" class="padd8"><Icon type="ios-cloud-download-outline" />下载</p>
                <!--<p><Icon type="ios-link-outline" />复制文件链接</p>-->
                <Poptip class="menu-file"  v-model="menuShow" @on-popper-hide="popHid">
                    <Icon type="ios-more" class="mr0" />
                    <div slot="content">
                        <div  v-show="rublish" class="rublish">
                            <div class="rublish-header">
                                <Icon @click="rublish=false" type="ios-arrow-back" />
                                移到回收站
                                <Icon @click="menuShow=false" type="ios-close" />
                            </div>
                            <p>您确定要把该文件移到回收站吗？</p>
                            <Button long type="error" @click="putRecyclebin">移到回收站</Button>
                        </div>
                       <div v-show="!rublish">
                           <div class="menu-file-title" style="text-align:center;font-size:16px">
                               <span>文件菜单</span>
                           </div>
                           <section class="file-folder-opt">
                               <ul>
                                   <li @click="showModels('移动')">移动文件</li>
                                   <li @click="showModels('复制')">复制文件</li>
                                   <li @click="collectFile">收藏文件</li>
                                   <li @click="rublish=true">移到回收站</li>
                               </ul>
                           </section>
                           <div class="footer" >
                               <div class="footer-left">
                                   <i class="ivu-icon ivu-icon-unlocked"></i>
                                   <div class="footer-privacy-text">
                                       <span>隐私模式</span>
                                       <span>{{privacyTxt}}</span>
                                   </div>
                               </div>
                               <span style="color:#3da8f5" @click="changePrivacy">{{privacyStatus}}</span>
                           </div>
                       </div>

                    </div>
                </Poptip>

            </div>
        </header>
        <div class="f-content">
            <div class="f-content-left">
                <div class="img-look-box" v-if="file.data.ext.includes('jpg') ||
                            file.data.ext.includes('jpeg') ||
                            file.data.ext.includes('gif') ||
                            file.data.ext.includes('bmp') ||
                           file.data.ext.includes('png')">
                    <div class="big-small-box">
                        <Tooltip content="放大">
                            <Icon @click="changeImgSize(1)" type="ios-add-circle-outline" />
                        </Tooltip>
                        <span>{{Math.floor(imgSize*100)}}%</span>
                        <Tooltip content="缩小">
                            <Icon  @click="changeImgSize(0)" type="ios-remove-circle-outline" />
                        </Tooltip>

                    </div>
                    <img :style="{transform:'scale('+imgSize+')'}" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.data.fileUrl" alt="">
                </div>

                <iframe v-else-if="file.data.ext.includes('doc') ||
                              file.data.ext.includes('docx') ||
                              file.data.ext.includes('docm') ||
                              file.data.ext.includes('dotx') ||
                              file.data.ext.includes('dotm') ||
                              file.data.ext.includes('xls') ||
                              file.data.ext.includes('xlsm') ||
                              file.data.ext.includes('xltx') ||
                              file.data.ext.includes('xltm') ||
                              file.data.ext.includes('xlsb') ||
                              file.data.ext.includes('xlam') ||
                              file.data.ext.includes('xlsx') ||
                              file.data.ext.includes('pptx') ||
                              file.data.ext.includes('pptm') ||
                              file.data.ext.includes('ppsx') ||
                              file.data.ext.includes('potx')"
                        :src="'https://view.officeapps.live.com/op/view.aspx?src=https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.data.fileUrl" width='100%' height='100%' frameborder='1'>
                </iframe>

                <iframe v-else :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+file.data.fileUrl" width='100%' height='100%' frameborder='1'>
                </iframe>
            </div>
            <div class="f-content-right">
                <div class="padd16">
                    <div class="bbxx">
                        <div>
                            <Icon type="ios-folder-open-outline" size="18" />版本信息
                        </div>
                        <div class="sp-bw">
                            <p>
                                <Icon type="ios-information-circle-outline" size="18" />
                                <span>{{file.version.length?file.version[file.version.length-1].info:''}}</span>
                            </p>
                            <p>{{file.data.size}}</p>
                        </div>
                    </div>
                    <!--标签-->
                    <div class="tags">
                        <span class="name"><Icon type="ios-pricetags-outline"></Icon>标签</span>
                        <!-- 取到data.tag了再添加孙子辈组件 -->
                        <Tags :taglist="file.data.tagList" :publicId="file.data.fileId" :publicType="publicType" :projectId="file.data.projectId" ></Tags>
                    </div>
                    <!--关联-->
                    <div class="relevance">
                        <p class="name"><Icon type="ios-link-outline" />关联内容</p>
                        <div class="addLink" @click="relationModal=true;">
                            <Icon type="ios-add-circle-outline" />添加关联</div>
                        <Modal v-model="relationModal" class="relationModal" id="relationModal" :footer-hide="true">
                            <AddRelation :publicId="file.data.fileId"></AddRelation>
                        </Modal>
                    </div>
                    <div class="has-relevance">
                        <ul>
                            <div class="what-title">被以下任务关联</div>
                            <li class="gl-task-list">
                                <div class="gl-task-list-con">
                                    <Icon type="md-checkbox-outline" size="22" />
                                    <Icon type="ios-list-box-outline" size="22" />
                                    <Icon type="ios-calendar-outline" size="22" />
                                    <Icon type="ios-document-outline" size="22" />
                                    <img src="" alt="">
                                    <div class="gl-con">
                                        <div class="gl-con-top">
                                            <span>关联人物名称</span><span>关联项目名称</span>
                                        </div>
                                        <div class="gl-con-bottom">2018-12-12 12:00</div>
                                    </div>
                                </div>
                                <Poptip v-model="glPop">
                                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                                    <div slot="content">
                                        <div class="glpop-list">
                                            <Icon type="ios-link" size="20" /><span>复制链接</span>
                                        </div>
                                        <div class="glpop-list">
                                            <Icon type="md-link" size="20" /><span>取消关联</span>
                                        </div>
                                    </div>
                                </Poptip>
                            </li>
                        </ul>
                    </div>
                    <div class="line"></div>
                    <!-- 设置参与者 -->
                    <div class="participator">
                        <h5>
                            参与者 · {{file.data.joinInfo?file.data.joinInfo.length:0}}
                            <Tooltip content="参与者将会收到评论和任务更新通知" placement="right" transfer>
                                <Icon type="ios-help"></Icon>
                            </Tooltip>
                        </h5>
                        <div class="involve-list clearfix">
                            <div class="member-avatar fl" v-for="(item,index) in file.data.joinInfo" :key="index">
                                <Tooltip :content="item.userName" placement="top" transfer>
                                    <div class="ava">
                                        <!-- 删除需要加在关闭按钮上 -->
                                        <img v-if="item.image" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/' + item.image" alt="">
                                        <span class="close" @click="deleteInvolve(item.userId)">×</span>
                                    </div>
                                </Tooltip>

                            </div>
                            <div class="addButton fl">
                                <InvolveMember ref="involveMember" :checkedList="joinInfoIds" :projectId="file.data.projectId" @save="saveInvolveMember"></InvolveMember>
                            </div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <!--所有动态-->
                    <log :logs="task.logs" :publicId="task.taskId" :unReadMsg="task.unReadMsg"></log>
                </div>
                <!--发消息-->
                <div class="talk">
                    <div class="talkinner">
                        <div class="talkUp" >
                            <div id="input"
                                 style="width: 100%;height: 40px;padding: 5px 10px"
                                 ref="textarea"
                                 placeholder="按Enter快速发布"
                                 contenteditable="true"
                                 @keyup.enter="sendChat">
                            </div>
                        </div>
                        <div class="talkDown clearfix">
                            <Tooltip content="上传附件" class="fl">
                                <Icon @click="showCommon=true" class="up-file" type="md-attach" />
                            </Tooltip>
                            <!-- 表情包组件 -->
                            <Emoji @choose="chooseEmoji"
                                   ref="emoji"></Emoji>
                            <div class="send fr" >
                                <Button type="primary" @click="sendChat">发布</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--移动、复制文件-->
        <Modal v-model="showMove" width="800" @on-visible-change="changeVisible" class="show-move"  class-name="vertical-center-modal">
            <div slot="header">
                <span style="font-size:18px">{{caozuo}}文件{{file.data.fileName}}至</span>
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
                <span>{{footerTxt}}</span>
                <div class="move-footer-btn">
                    <Button type="default" size="large" @click="cancelRemoveClone">取消</Button>
                    <Button type="primary" size="large" @click="removeCloneFile">确定</Button>
                </div>
            </div>
        </Modal>
        <!--上传模型文件-->
        <Modal title="上传模型文件" v-model="showModel" class-name="file-vertical-center-modal" :width="500" transfer footer-hide>
            <model ref="model" @close="showModel=false" :fileId="file.data.fileId"></model>
        </Modal>
        <!--上传普通文件-->
        <Modal v-model="showCommon" title="上传普通文件" class-name="file-vertical-center-modal" footer-hide transfer :width="500">
            <common-file @close="showCommon=false" :fileId="file.data.fileId" :projectId="projectId"></common-file>
        </Modal>
    </div>
</template>

<script>
import Tags from "@/components/project/pages/index/components/task/Tags";
import AddRelation from "@/components/public/common/AddRelation";
import log from '@/components/public/log'
import Emoji from '@/components/public/common/emoji/Emoji'
import model from "./model.vue";
import commonFile from "./commonfile.vue";
import {mapState} from 'vuex'
import {changeName, downloadFile, jionPeople, removeFile, cloneFile, recycleBin} from '@/axios/fileApi'
import {folderChild, getProjectList, collect} from '@/axios/api'
import VJstree from "vue-jstree";
export default {
    props: ['fid'],
    name: "fileDetail",
    data () {
        return {
            relationModal:false,
            publicType: '文件',
            glPop: false,
            task: {},
            showCommon: false,
            menuShow:false,
            isPrivacy: 1,
            privacyTxt: "所有成员可见",
            privacyStatus: "未开启",
            rublish:false,
            showMove: false,
            footerTxt: '',
            asyncData: [],
            projects: [],
            items: [],
            caozuo: '',
            fileId: this.$route.params.fileId,
            projectId: this.$route.params.id,
            loading: false,
            folderId: '',
            imgSize: 1,
            showModel: false,
        }
    },
    components: {Tags, AddRelation, log, Emoji, VJstree, model, commonFile},
    computed: {
        ...mapState('file', ['file','joinInfoIds'])
    },
    methods: {
        sendChat () {},
        chooseEmoji () {},
        popHid () {
            setTimeout(() => {
                this.rublish=false
            },300)
        },
        // 更改文件名称
        changeFileName(){
            changeName(this.file.data.fileId,this.file.data.fileName).then(res => {
                this.$Message.success('修改成功');
            })
        },
        // 更新文件
        showFileChoose(data) {
            console.log(data);
            if (data === "model") {
                this.showModel = !this.showModel;
            } else {
                this.showCommon = !this.showCommon;
            }
        },
        // 放大缩小图片
        changeImgSize(n){
            if (n){
                this.imgSize=this.imgSize+0.1
                console.log( this.imgSize)
            } else {
                this.imgSize=this.imgSize-0.1
                console.log( this.imgSize)
            }
        },
        // 下载文件
        downLoad () {
            downloadFile(this.file.data.fileId).then(res => {
                console.log(res)
            })
        },
        // 添加参与者
        saveInvolveMember (detailList) {
            jionPeople(this.file.data.fileId, detailList).then(res => {
                console.log(res)
            })
        },
        // 收藏文件
        collectFile () {
            let data={
                'projectId': this.projectId,
                'publicId': this.file.data.fileId,
                'collectType': '文件'
            }
            collect(data).then(res => {
                if (res.result){
                    this.$Message.success('收藏成功');
                }
            })
        },
        // 移到回收站
        putRecyclebin () {
            recycleBin(this.file.data.fileId, this.projectId).then(res => {
                if (res.result){
                    this.$Message.success('成功移到回收站');
                    this.popHid()
                }
            })
        },
        // 更改隐私模式
        changePrivacy() {
            if (this.isPrivacy == 1) {
                this.privacyTxt = "所有成员可见";
                this.isPrivacy = 2;
                this.privacyStatus = "未开启";
            } else {
                this.privacyTxt = "仅参与者可见";
                this.isPrivacy = 1;
                this.privacyStatus = "已开启";
            }
        },
        // 移动、赋值文件框打开关闭
        changeVisible(bool) {
            if (bool) {
                this.projectList();
            } else {
                this.projects = [];
                this.items = [];
            }
        },
        // 移动、复制文件的确定按钮
        removeCloneFile () {
            if (this.folderId) {
                if (this.caozuo==='移动') {
                    removeFile(this.folderId,this.file.data.fileId).then(res => {
                        if (res.result){
                            this.$Message.success('移动成功');
                            this.showMove=false
                        }
                    })
                }else if (this.caozuo==='复制') {
                    let data={
                        folderId: this.folderId,
                        fileIds: this.file.data.fileId
                    }
                    cloneFile(this.folderId,this.file.data.fileId).then(res => {
                        console.log('复制',res)
                    })
                }
            }

        },
        // 取消 移动复制
        cancelRemoveClone () {
            this.folderId=''
            this.showMove=false
        },
        // 点击 移动、赋值文件
        showModels (caozuo) {
            this.caozuo=caozuo
            this.showMove = true;
            this.footerTxt = `跨项目${caozuo}时，部分信息不会被保留。`;
            this.asyncData = [this.$refs.jstree.initializeLoading()];
            folderChild(this.projectId).then(res => {
                this.asyncData = res.data;
                this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
            });
        },
        // 改变选择的项目
        changeProject(projectId) {
            this.loading=true
            this.items = [];
            this.projectId = projectId;
            folderChild(this.projectId).then(res => {
                this.asyncData = res.data;
                this.$refs.jstree.handleAsyncLoad(this.asyncData, this.$refs.jstree);
                this.loading=false
            });
        },
        // 获取项目列表
        projectList() {
            getProjectList().then(res => {
                if (res.result == 1) {
                    this.projects = res.data;
                }
            });
        },
        // 选中要移动到哪
        itemClick(node) {
            this.folderId=node.data.id
            console.log(node.data.id);
        },
    }
}
</script>

<style scoped lang="less">
    @import "./fileDetail";
</style>
