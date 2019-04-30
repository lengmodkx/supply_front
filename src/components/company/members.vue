<template>
    <div class="member-box">
        <div class="member-wrap">
            <div class="members">
                <!--左侧筛选成员-->
                <div class="member-left">
                    <Input class="search" search placeholder="搜索..." />
                    <Tabs value="name1">
                        <TabPane label="组织架构" name="name1">
                            <div class="zzjg">
                                <h3>成员</h3>
                                <div class="filter-member" @click="changeMemberType(item)"
                                     :class="{checked:memberType==item}"
                                     v-for="(item, index) in allMemberType" :key="index">{{item}}</div>
                                <h3 style="margin-top: 15px">部门</h3>
                                <div class="branch-head">
                                    <Poptip v-model="branch" transfer>
                                        <div class="branch"><Icon type="md-add-circle" />创建部门</div>
                                        <div slot="content">
                                            <div class="branch-title">
                                                <span></span>创建部门
                                                <Icon @click="branch=false" type="md-close" size="20" />
                                            </div>
                                            <Input v-model="branchName" placeholder="部门名称" class="branch-name" />
                                            <Button long type="info" :loading="isCreateBranch" :disabled="branchName==''" @click="createBranch">创建</Button>
                                        </div>
                                    </Poptip>
                                    <div class="bsort"><Icon type="md-swap" />部门排序</div>
                                </div>
                                <div v-for="(item, n) in branchData" :key="item.partmentId">
                                    <div :class="{checked:bumenChecked==item.partmentId}" class="yiji-bumen" @click="getBranchMember(item)">
                                        {{item.partmentName}}
                                        <Icon v-if="isdown" type="ios-arrow-dropdown" size="20" />
                                        <Icon v-else @click="isdown=true" type="ios-arrow-dropup" size="20" />
                                    </div>
                                    <div class="erji-bumen"></div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane label="企业群组" name="name2">
                            <Poptip v-model="group" transfer>
                                <div class="branch"><Icon type="md-add-circle" />创建群组</div>
                                <div slot="content">
                                    <div class="branch-title">
                                        <span></span>创建群组
                                        <Icon @click="group=false" type="md-close" size="20" />
                                    </div>
                                    <Input v-model="groupName" placeholder="群组名称" class="branch-name" />
                                    <Button long type="info" :disabled="groupName==''" :loading="isCreateGroup" @click="createGroup">创建</Button>
                                </div>
                            </Poptip>
                            <ul>
                                <li class="group-list">
                                    <Icon type="ios-contacts" />
                                        <Tooltip style="margin-top: 5px" transfer content="Here is the prompt text">
                                            <p class="w225"></p>
                                        </Tooltip>
                                </li>
                            </ul>
                        </TabPane>
                    </Tabs>
                </div>
                <!--右侧显示成员-->
                <div class="member-right">
                    <header class="member-right-head">
                        <div style="font-size: 16px">{{memberType}} · {{peopleList.length?peopleList.length:'0'}}</div>
                        <div class="header-right">
                            <!--添加成员 按钮-->
                            <Poptip v-model="memModal">
                                <div class="branch"><Icon type="md-add-circle" />添加成员</div>
                                <div slot="content">
                                    <p @click="showAddModel">添加企业成员</p>
                                    <p @click="showAddModel(true)">添加企业外部成员</p>
                                </div>
                            </Poptip>
                            <!--创建子部门 按钮-->
                            <div v-if="nowType==='部门'" class="createZBM">
                                <Icon type="md-add-circle" />创建子部门
                            </div>
                            <!--部门 更多 按钮-->
                            <div v-if="nowType==='部门'" class="more-bumen-opearte">
                                <Icon type="ios-more" />更多
                            </div>
                        </div>
                    </header>
                    <div class="scroll-box">
                        <Loading v-if="loading"></Loading>
                        <!--点击成员显示-->
                        <ul v-if="nowType==='成员' && peopleList.length">
                            <li class="one-member" v-for="(item, index) in peopleList" :key="index">
                                <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.userEntity.image" alt="">
                                <p>{{item.userEntity.userName}}</p>
                                <span>{{item.organizationLable?'拥有者':'参与者'}}</span>
                            </li>
                        </ul>
                        <!--点击部门显示-->
                        <ul v-else-if="nowType==='部门' && peopleList.length" class="branch-show">
                            <div class="branch-header">
                                <div class="branch-people">部门成员</div>
                                <div class="position">职位</div>
                                <div class="operation">操作</div>
                            </div>
                            <li class="branch-list" v-for="(i,n) in peopleList" :key="n">
                                <div class="branch-people">
                                    <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+i.userEntity.image" alt="">
                                    <div>
                                        <p>{{i.userEntity.userName}}</p>
                                        <!--<span>243967393qq.com</span>-->
                                    </div>
                                </div>
                                <div class="position">-</div>
                                <div class="operation">
                                    <Poptip>
                                        <div class="operation-title">{{i.peopleList?'管理员':'成员'}} <Icon type="ios-arrow-down" size="20"/></div>
                                        <div slot="content">
                                            <div class="operation-body-title">
                                                部门成员菜单<Icon type="md-close" @click="operationMenu=false" />
                                            </div>
                                            <div class="operation-list">成员 <Icon v-if="!i.peopleList" type="md-checkmark" size="18" /></div>
                                            <div class="operation-list">管理员 <Icon v-if="i.peopleList" type="md-checkmark" size="18" /></div>
                                            <div class="operation-list">从部门移除成员</div>
                                            <div class="operation-list">
                                                <Poptip
                                                        class="delete-alert"
                                                        confirm
                                                        title="确定从企业中移除成员？"
                                                        @on-ok="removePeopleOk"
                                                        @on-cancel="removePeopleCancel">
                                                    <div style="color: #ff4f3e">从企业移除成员</div>
                                                </Poptip>
                                            </div>

                                        </div>
                                    </Poptip>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="no-memebers">
                            <Icon type="ios-contacts" />
                            <p>暂无成员</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--添加人员-->
        <Modal v-model="showAddPeople" width="360" footer-hide>
            <p slot="header" style="color:#000;text-align:center">
                <span>添加成员至企业</span>
            </p>
            <addPeople @add="addPeople" v-if="showAddPeople"
                       :invitUsers="peopleList" :type="nowType" :partmentId="partmentId"></addPeople>
        </Modal>
    </div>
</template>

<script>
import addPeople from '@/components/public/addPeople'
import {initOrgMember, createBranchs, getBranch, getBranchpeople} from '@/axios/companyApi'
    export default {
        name: "members",
        data () {
            return{
                branch: false,
                memberType: '所有成员',
                branchName: '',
                group: false,
                groupName: '',
                showAddPeople: false,
                peopleList: [],
                memModal: false,
                loading:true,
                isCreateBranch: false,
                allMemberType: ['所有成员','新加入的成员','未分配部门的成员','外部成员','停用的成员'],
                operationMenu: false,
                branchData: [],
                isdown: true,
                nowType: '成员',
                partmentId: '',
                bumenChecked: '',
                isCreateGroup: false,
            }
        },
        mounted () {
            this.initMember()
            this.initBranch()
        },
        components: {addPeople},
        methods: {
            // 页面初始化
            initMember(){
                initOrgMember(localStorage.companyId).then(res => {
                    if (res.result){
                        if (res.data==='无数据'){
                            this.peopleList=[]
                        }else {
                            this.peopleList=res.data
                        }
                    }
                    this.loading=false
                })
            },
            // 显示添加人员匡
            showAddModel(waibu) {
                this.memModal=false
                this.showAddPeople=true
            },
            // 添加成员 回调
            addPeople (data) {
                if (this.nowType==='成员'){
                    let people={
                        'userName': data.userEntity.userName,
                        'image': data.userEntity.image,
                        'organizationLable': data.organizationLable
                    }
                    this.peopleList.push(people)
                } else if (this.nowType==='部门') {
                    this.peopleList.push(data)
                }


            },
            // 点击左侧 成员类型
            changeMemberType (item) {
                this.nowType='成员'
                this.memberType=item
                this.loading=true
                let flag=0
                switch (item) {
                    case '未分配部门的成员':
                        flag=1
                        break;
                    case '停用的成员':
                        flag=2
                        break;
                    case '新加入的成员':
                        flag=3
                        break;
                }
                initOrgMember(localStorage.companyId,flag).then(res => {
                    this.loading=false
                    if (res.result){
                        if (res.result){
                            if (res.data==='无数据'){
                                this.peopleList=[]
                            }else {
                                this.peopleList=res.data
                            }
                        }
                    }
                })
            },
            // 创建部门
            createBranch () {
                this.isCreateBranch=true
                let data={
                    'partmentName': this.branchName
                }
                createBranchs(localStorage.companyId,data).then(res => {
                    console.log(res)
                    this.isCreateBranch=false
                    this.branch=false
                    this.branchData.push(res.data)
                })
            },
            // 初始化部门信息
            initBranch() {
                getBranch(localStorage.companyId).then(res => {
                    if (res.result){
                        this.branchData=res.data
                    }
                })
            },
            // 获取某个部门下成员
            getBranchMember(item) {
                this.nowType='部门'
                this.peopleList=[]
                this.partmentId=item.partmentId
                this.bumenChecked=item.partmentId
                this.memberType=item.partmentName
                this.loading=true
                getBranchpeople(item.partmentId).then(res => {
                    if (res.result){
                        this.peopleList=res.data
                        this.loading=false
                    }
                })
            },
            // 从企业移除成员 确定
            removePeopleOk () {
                alert('ok')
            },
            removePeopleCancel(){
                alert('取消')
            },
            // 创建群组
            createGroup () {
                this.isCreateGroup=true

            },

        }
    }
</script>

<style scoped lang="less">
@import "./css/members.less";
</style>