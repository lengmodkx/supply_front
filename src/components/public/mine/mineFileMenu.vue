<template>
    <div placement="bottom"
            @on-popper-hide="popperHide">
        <!--<Icon class="sanjiao"-->
        <!--type="ios-arrow-dropdown"-->
        <!--size="20"-->
        <!--&gt;</Icon>-->
        <div slot="content" class="file-menu-box">
            <div class="file-menu-title">
                {{topTitle}}
                <Icon type="md-close" size="20" @click="closeMenu"/>
            </div>
            <div class="task-menu-list"
                 v-show="active==''">
                <div class="menuItem"
                     @click="listItemClick('','复制')">
                    <Icon type="ios-paper-outline" />复制{{name}}</div>
                <div class="menuItem"
                     @click="listItemClick('','移动')">
                    <Icon type="ios-log-out" />移动{{name}}</div>
                <div class="menuItem" @click="collectTask">
                    <Icon type="md-clipboard" />{{data.collect ? '取消收藏':'收藏'+name}}
                </div>
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
                <div class="con5" v-show="active=='a'" style="height: auto">
                    <div class="con5item1">
                        <span>文件夹</span>
                        <Dropdown trigger="click">
                            <a href="javascript:void(0)" class="wjj">
                                {{wjj}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>豆汁儿</DropdownItem>
                                <Dropdown placement="right-start">
                                    <DropdownItem>
                                        北京烤鸭
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>挂炉烤鸭</DropdownItem>
                                        <DropdownItem>焖炉烤鸭</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div class="con5tip">跨项目移动时，部分参与者信息不会保留</div>
                    <Button type="primary" long style="margin-top:8px;" @click="removeRc">确定</Button>
                </div>
                <div class="con6"
                     v-show="active=='b'">
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
                    <div class="con5item1">
                        <span>文件夹</span>
                        <Dropdown trigger="click">
                            <a href="javascript:void(0)" class="wjj">
                                {{wjj}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem>豆汁儿</DropdownItem>
                                <Dropdown placement="right-start">
                                    <DropdownItem>
                                        北京烤鸭
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>挂炉烤鸭</DropdownItem>
                                        <DropdownItem>焖炉烤鸭</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div class="con5tip">跨项目复制时，全部参与者信息不会被保留。</div>
                    <Button type="primary"
                            long @click="copyTask">确定</Button>

                </div>
                <div class="con7"
                     v-show="active=='c'">
                    <div class="ask">您确定要把列表下的所有任务移到回收站吗？</div>
                    <Button type="error" @click="recycle"
                            long>移到回收站</Button>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data'],
        data () {
            return {
                visible: false,
                unlock: 1,
                active: '',
                newTask: '',
                link:'https://www.baidu.com',
                name:'文件',
                curTopTitle: '',
                starProject: [],
                notStarProject: [],
                model7: '',
                wjj:'选择文件夹'
            }
        },
        computed: {
            topTitle () {
                return this.active ? this.curTopTitle : '文件菜单'
            }
        },
        mounted () {
            this.active=''
        },
        methods: {
            closeMenu(){
                this.$emit('closeFileMenu')
            },
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
                if (index===''){
                    this.$emit('openMenu',title)
                }
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
                if(this.data.collect){
                    cancelCollect(this.data.task.taskId).then(res => {
                        if(res.result === 1){
                            this.$Message.success(res.msg)
                            this.data.collect = false
                        }
                    })
                } else{
                    collectTask(this.data.task.projectId,this.data.task.taskId,'任务').then(res => {
                        if(res.result === 1){
                            this.$Message.success(res.msg)
                            this.data.collect = true
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
                        window.location.reload()
                    }
                })
            },
            //任务移入回收站
            recycle() {
                recycleRc(this.data.scheduleId).then(res => {
                    if (res.result){
                        this.$Message.success('已移到回收站')
                        window.location.reload()
                    }
                })
            },
            // 更新隐私模式
            privacyChange(){
                if (this.data.privacyPattern){
                    this.data.privacyPattern=0
                } else {
                    this.data.privacyPattern=1
                }
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
            },
            popperHide(){
                setTimeout(_ => {
                    this.active=''
                }, 300)

            }
        }
    }
</script>

<style scoped lang="less">
    @import "../common/poptipMenu";
    .file-menu-box{
        width: 250px;
        background-color: white;
    }
    /deep/ .ivu-poptip-body{
        padding: 0 !important;
    }
    .file-menu-title{
        width: 218px;
        height: 50px;margin: 0 auto;
        border-bottom: 1px solid #EEEDEB;
        text-align: center;
        line-height: 50px;
        position: relative;
        font-size: 16px;
        font-weight: 600;
        i{
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 15px;
        }
    }
    .sanjiao{
        color: #a6a6a6;
        cursor: pointer;
        &:hover{
            color: #3da8f5;
        }
    }
    .menuItem{
        width: 100%;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-size: 14px;
        &:hover{
            background-color: #f5f5f5;
        }
        i{
            margin-right: 10px;
            font-size: 16px;
        }
    }
    .privacy{
        padding: 0 10px;
    }
    .con6,.con5,.con7{
        padding: 10px;
    }
    .con5item1{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .con5tip{
        margin: 10px 0;
    }
    .wjj{
        color: #c5c8ce !important;
        padding-right: 8px;
    }
    .ask{
        margin-bottom: 10px;
    }
</style>