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
                                <Poptip v-model="branch" transfer>
                                    <div class="branch"><Icon type="md-add-circle" />创建部门</div>
                                    <div slot="content">
                                        <div class="branch-title">
                                            <span></span>创建部门
                                            <Icon @click="branch=false" type="md-close" size="20" />
                                        </div>
                                        <Input v-model="branchName" placeholder="部门名称" class="branch-name" />
                                        <Button long type="info" :disabled="branchName==''">创建</Button>
                                    </div>
                                </Poptip>
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
                                    <Button long type="info" :disabled="groupName==''">创建</Button>
                                </div>
                            </Poptip>
                            <ul>
                                <li class="group-list">
                                    <Icon type="ios-contacts" />
                                        <Tooltip style="margin-top: 5px" transfer content="Here is the prompt text">
                                            <p class="w225">名称啊安达市大所阿斯顿撒阿萨达所多阿萨达所多奥术大师大所阿萨德啊啊</p>
                                        </Tooltip>
                                </li>
                            </ul>
                        </TabPane>
                    </Tabs>
                </div>
                <!--右侧显示成员-->
                <div class="member-right">
                    <header class="member-right-head">
                        <div style="font-size: 16px">{{memberType}} · {{peopleList.length?peopleList.length:0}}</div>
                        <Poptip v-model="memModal">
                            <div class="branch"><Icon type="md-add-circle" />添加成员</div>
                            <div slot="content">
                                <p @click="showAddModel">添加企业成员</p>
                                <p @click="showAddModel(true)">添加企业外部成员</p>
                            </div>
                        </Poptip>
                    </header>
                    <Loading v-if="loading"></Loading>
                    <ul v-if="peopleList.length">
                        <li class="one-member" v-for="(item, index) in peopleList" :key="index">
                            <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.userEntity.image" alt="">
                            <p>{{item.userEntity.userName}}</p>
                            <span>{{item.organizationLable?'拥有者':'参与者'}}</span>
                        </li>
                    </ul>
                    <div v-else class="no-memebers">
                        <Icon type="ios-contacts" />
                        <p>暂无成员</p>
                    </div>
                </div>
            </div>
        </div>
        <!--添加人员-->
        <Modal v-model="showAddPeople" width="360" footer-hide>
            <p slot="header" style="color:#000;text-align:center">
                <span>添加成员至企业</span>
            </p>
            <addPeople @add="addPeople" v-if="showAddPeople" :invitUsers="peopleList"></addPeople>
        </Modal>
    </div>
</template>

<script>
import addPeople from '@/components/public/addPeople'
import {initOrgMember} from '@/axios/companyApi'
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
                allMemberType: ['所有成员','新加入的成员','未分配部门的成员','外部成员','停用的成员']
            }
        },
        mounted () {
            this.initMember()
        },
        components: {addPeople},
        methods: {
            // 页面初始化
            initMember(){
                initOrgMember(localStorage.companyId).then(res => {
                    console.log(1111111,res)
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
                if (waibu){

                }
                this.memModal=false
                this.showAddPeople=true
            },
            // 添加成员 回调
            addPeople (data) {
                let people={
                    'userName': data.userEntity.userName,
                    'image': data.userEntity.image,
                    'organizationLable': data.organizationLable
                }
                this.peopleList.push(people)
            },
            // 点击左侧 成员类型
            changeMemberType (item) {
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
                    console.log(res.data)
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

        }
    }
</script>

<style scoped lang="less">
@import "./css/members.less";
</style>