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
                <p class="padd8"><Icon type="ios-cloud-download-outline" />
                    <a style="color: gray" :download="file.data.fileName" :href="'http://192.168.3.189:8090/files/'+file.data.fileId +'/download'" ref="xiazai">下载</a></p>
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
                                   <div class="footer-privacy-text" @click="changePrivacy">
                                       <span>隐私模式</span>
                                       <span v-if="file.data.filePrivacy=='1'">仅参与者可见</span>
                                       <span v-else>所有成员可见</span>
                                   </div>
                               </div>
                               <span v-if="file.data.filePrivacy=='1'" style="color:#3da8f5" @click="changePrivacy">已开启</span>
                               <span v-else style="color:#3da8f5" @click="changePrivacy">已关闭</span>

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
                            <AddRelation :publicId="file.data.fileId" :fromType="publicType"></AddRelation>
                        </Modal>
                    </div>
                   <!--有关联内容-->
                    <div class="has-relevance" v-for="(b,i) in file.bindings" :key="i">
                        <ul >
                            <div class="what-title" v-if="b.publicType=='任务'">关联的任务</div>
                            <div class="what-title" v-if="b.publicType=='日程'">关联的日程</div>
                            <div class="what-title" v-if="b.publicType=='分享'">关联的分享</div>
                            <div class="what-title" v-if="b.publicType=='文件'">关联的文件</div>
                            <li class="gl-task-list" >
                                <div class="gl-task-list-con">
                                    <Icon v-if="b.publicType=='任务'" type="md-checkbox-outline" size="22" />
                                    <Icon v-if="b.publicType=='分享'" class="glpop" type="ios-arrow-down" size="20" />
                                    <Icon v-if="b.publicType=='文件'" type="ios-document-outline" size="22" />
                                    <Icon v-if="b.publicType=='日程'" type="ios-calendar-outline" size="22" />
                                    <img v-if="JSON.parse(b.bindContent).userImage" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+ JSON.parse(b.bindContent).userImage" alt="执行者">
                                    <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg==">
                                    <div class="gl-con">
                                        <div class="gl-con-top" v-if="b.publicType=='任务'">
                                            <span>{{JSON.parse(b.bindContent).taskName}}</span><span>{{JSON.parse(b.bindContent).projectName}}</span>
                                        </div>
                                        <div class="gl-con-top" v-if="b.publicType=='文件'">
                                            <span>{{JSON.parse(b.bindContent).fileName}}</span><span>{{JSON.parse(b.bindContent).projectName}}</span>
                                        </div>
                                        <div class="gl-con-top" v-if="b.publicType=='日程'">
                                            <span>{{JSON.parse(b.bindContent).scheduleName}}</span><span>{{JSON.parse(b.bindContent).projectName}}</span>
                                        </div>
                                        <div class="gl-con-top" v-if="b.publicType=='分享'">
                                            <span>{{JSON.parse(b.bindContent).shareName}}</span><span>{{JSON.parse(b.bindContent).projectName}}</span>
                                        </div>
                                    </div>
                                </div>
                                <Poptip>
                                    <Icon class="glpop" type="ios-arrow-down" size="20" />
                                    <div slot="content">
                                        <div class="glpop-list">
                                            <Icon type="ios-link" size="20" /><span>复制链接</span>
                                        </div>
                                        <div class="glpop-list"  v-if="b.publicType=='任务'" @click="cancle(JSON.parse(b.bindContent).taskId)">
                                            <Icon type="md-link" size="20" /><span>取消关联</span>
                                        </div>
                                        <div class="glpop-list"  v-if="b.publicType=='分享'" @click="cancle(JSON.parse(b.bindContent).shareId)">
                                            <Icon type="md-link" size="20" /><span>取消关联</span>
                                        </div>
                                        <div class="glpop-list"  v-if="b.publicType=='日程'" @click="cancle(JSON.parse(b.bindContent).scheduleId)">
                                            <Icon type="md-link" size="20" /><span>取消关联</span>
                                        </div>
                                        <div class="glpop-list"  v-if="b.publicType=='文件'" @click="cancle(JSON.parse(b.bindContent).fileId)">
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
                    <log :logs="file.logs" :publicId="file.data.fileId" :unReadMsg="file.data.unReadMsg"></log>
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
import {changeName, downloadFile, jionPeople, removeFile, cloneFile, recycleBin, filePrivacy} from '@/axios/fileApi'
import {folderChild, getProjectList, collect, cancle, sendMsg} from '@/axios/api'
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
        // 发送消息
        sendChat () {
            let con =this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g,"")
            if (con){
                let datas={
                    'publicId':this.file.data.fileId,
                    'projectId':this.projectId,
                    'publicType':this.publicType,
                    'content':con
                }
                console.log(datas)
                sendMsg(datas).then(res => {
                    this.$refs.textarea.innerHTML=''
                })
            }
        },
        chooseEmoji (name) {
            alert(1)
            this.$refs.textarea.innerHTML+='<img src="'+name+'" />'
        },
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
        // 取消关联
        cancle(id){
            cancle(id,this.projectId,this.publicType,this.file.data.fileId).then(res => {
                if(res.result === 1){
                    this.$Message.success("已取消")
                }
            })
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
            let num=0
            if (this.file.data.filePrivacy == 1) {
                num =0
            }else {
                num =1
            }
            filePrivacy(this.file.data.fileId,num).then(res => {
                console.log(res)
            })
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
                    cloneFile(this.folderId,this.file.data.fileId).then(res => {
                        this.$Message.success('复制成功');
                        this.showMove=false
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
