<template>
    <Poptip class="task-menuwrapper"
            placement="bottom"
            transfer
            v-model="visible"
            @on-popper-hide="popHide">
        <Icon type="ios-arrow-down" size="20" />
        <!-- <Icon type="ios-arrow-down"
              size="20"></Icon> -->
        <div slot="content"
             class="task-menuwrapper-content"
             v-if="initCom">
            <div class="dropdownTitle">
        <span class="back">
          <span v-if="active!=''" @click="active='';reset(true)">
            <svg-icon class="backicon" name="back"></svg-icon>
          </span>
        </span>
                {{topTitle}}
        <span class="guanbi" @click="visible=false">
             <svg-icon class="closePop" name="close"></svg-icon>
        </span>
            </div>
            <div class="task-menu-list"
                 v-if="active==''">
                <div class="menuItem"
                     @click="listItemClick('b','复制到')">
                    <Icon type="ios-paper-outline" />复制{{name}}</div>
                <div class="menuItem"
                     @click="listItemClick('a','移动到')">
                    <Icon type="ios-log-out" />移动{{name}}</div>
                <div class="menuItem" @click="collectTask">
                    <Icon type="md-clipboard" />{{data.isCollect ? '取消收藏':'收藏'+name}}</div>

                <div class="menuItem"
                     @click="listItemClick('c','移到回收站')">
                    <Icon type="ios-trash-outline" />移到回收站</div>
                <div class="privacy">
                    <div class="p_left fl clearfix"
                         @click="privacyChange">
                        <div v-if="data.privacyPattern" style="overflow:hidden;">
                            <Icon type="unlocked"
                                  class="fl"></Icon>
                            <div class="p_title fl">
                                <h5>隐私模式</h5>
                                <p>所有成员可见</p>
                            </div>
                        </div>

                        <div v-if="!data.privacyPattern" style="overflow:hidden;">
                            <Icon type="locked"
                                  class="fl"></Icon>
                            <div class="p_title fl">
                                <h5>隐私模式</h5>
                                <p>仅参与者可见</p>
                            </div>
                        </div>
                    </div>
                    <div class="p_right fr">
                        <span>{{data.privacyPattern==1?"已关闭":"已开启"}}</span>
                    </div>
                </div>
            </div>

            <!-- 内容部分的盒子： -->
            <div class="task-menu-detail">
                <div class="con5" v-if="active=='a'" style="height: auto">
                    <div class="con5item1">
                        <span>项目</span>
                        <Select v-model="model7" style="width:100px" @on-open-change="getProjectList" @on-change="getGroupList">
                            <OptionGroup label="星标项目">
                                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName}}</Option>
                            </OptionGroup>
                            <OptionGroup label="非星标项目">
                                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
                            </OptionGroup>
                        </Select>

                    </div>
                    <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
                    <Button type="primary" long style="margin-top:8px;" @click="removeRc">确定</Button>
                </div>
                <div class="con6"
                     v-if="active=='b'">
                    <div class="con5item1">
                        <span>项目</span>
                        <Select v-model="model7" style="width:150px" placeholder="选择项目" @on-open-change="getProjectList" @on-change="getGroupList">
                            <OptionGroup label="星标项目">
                                <Option v-for="item in starProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
                            </OptionGroup>
                            <OptionGroup label="非星标项目">
                                <Option v-for="item in notStarProject" :value="item.projectId" :key="item.projectId">{{ item.projectName }}</Option>
                            </OptionGroup>
                        </Select>
                    </div>
                    <div class="con5tip">参与者、评论不会被复制到新日程</div>
                    <Button type="primary"
                            long @click="copyTask">确定</Button>

                </div>
                <div class="con7"
                     v-if="active=='c'">
                    <div class="ask">您确定要把列表下的所有任务移到回收站吗？</div>
                    <Button type="error" @click="recycle"
                            long>移到回收站</Button>

                </div>

            </div>

        </div>

    </Poptip>

</template>
<script>
    import Clipboard from 'clipboard'
    import {copyRc, removeRc, recycleRc, privacy} from '@/axios/scheduleApi'
    import {collectTask,cancelCollect,getStarProjectList,getGroupList,getMenuList} from "@/axios/api";

    export default {
        props: ['data','name'],
        data () {
            return {
                link:'https://www.baidu.com',
                initCom: true,
                visible: false,
                unlock: 1,
                active: '',
                newTask: '',
                curTopTitle: '任务菜单',
                title: this.data.title,
                findMember: '',
                findPro: '',
                notice: [],
                starProject: [],
                notStarProject: [],
                currProjectId:'',
                currGroupId:'',
                currMenuId:'',
                groupList: [],
                menuList:[],
                model7: '',
                model9:'',
                model10:''
            }
        },
        computed: {
            topTitle () {
                return this.active ? this.curTopTitle : '任务菜单'
            }
        },
        mounted () {

        },
        methods: {
            copylink () {
                var clipboard = new Clipboard('.tasklink')
                clipboard.on('success', e => {
                    alert('复制成功')
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制')
                    clipboard.destroy()
                })
            },
            saveTitle () {
                this.visible = false;
                //发请求修改标题
            },
            //获取项目数据
            getProjectList(){
                getStarProjectList().then(res => {
                    if(res.result === 1){
                        this.notStarProject = res.notStarProject
                        this.starProject = res.starProject
                    }
                })
            },
            //获取分组数据
            getGroupList(projectId){
                this.currProjectId = projectId
                getGroupList(projectId).then(res => {
                    if(res.result === 1){
                        this.groupList = res.data
                    }
                })
            },
            //获取菜单数据
            getMenuLists(groupId){
                this.currGroupId = groupId
                getMenuList(groupId).then(res => {
                    if(res.result === 1){
                        this.menuList = res.data
                    }
                })
            },
            //获取选中菜单id
            getMenuId(menuId){
                this.currMenuId = menuId
            },
            listItemClick (index, title) {
                this.active = index
                this.curTopTitle = title
            },
            clearAll () {

            },
            changeTitle () {
                this.active = '';
            },
            //项目选择框触发时间
            createNew () {
                this.active = '';
            },
            // 收藏日程
            collectTask() {
                console.log(this.data)
                if(this.data.isCollect){
                    cancelCollect(this.data.scheduleId).then(res => {
                        if(res.result === 1){
                            this.$Message.success(res.msg)
                            this.data.isCollect=!this.data.isCollect
                        }
                    })
                } else{
                    collectTask(this.data.projectId,this.data.scheduleId,'日程').then(res => {
                        if(res.result === 1){
                            this.$Message.success(res.msg)
                            this.data.isCollect=!this.data.isCollect
                        }
                    })
                }
            },
            //复制日程
            copyTask(){
                copyRc(this.data.scheduleId,this.currProjectId).then(res => {
                    if(res.result === 1){
                        this.$Message.success('复制成功')
                    }
                })
            },
            // 移动日程
            removeRc(){
                removeRc(this.data.scheduleId,this.currProjectId).then(res => {
                    if (res.result){
                        this.$Message.success('移动成功')
                    }
                })
            },
            //任务移入回收站
            recycle() {
                var data={
                        publicId:this.data.scheduleId,
                        publicType:'schedule',
                        projectId:this.data.projectId,
                        action:'move'
                    }
                    recycleRc(data).then(res => {
                        if (res.result){
                        this.$Message.success('已移到回收站')
                        this.visible=false
                        this.$emit('closeMenu')
                    }
                     });


                // recycleRc(this.data.scheduleId).then(res => {
                //     if (res.result){
                //         this.$Message.success('已移到回收站')
                //         this.visible=false
                //         this.$emit('closeMenu')
                //     }
                // })
            },
            // 更新隐私模式
            privacyChange(){
                if (this.data.privacyPattern){
                    this.data.privacyPattern=0
                } else {
                    this.data.privacyPattern=1
                }
                console.log(this.data)
                privacy(this.data.scheduleId,this.unlock).then(res => {
                    console.log(res)
                })
            },
            reset (flag) {
                Object.assign(this.$data, this.$options.data())
                this.visible = flag
                this.title = this.data.title
            },
            popHide () {
                setTimeout(_ => {
                    this.reset()
                }, 300)
            }
        }
    }
</script>
<style lang="less">
    @import './poptipMenu';
</style>

