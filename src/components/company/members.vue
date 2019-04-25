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
                                <div class="filter-member">所有成员</div>
                                <div class="filter-member">新加入的成员</div>
                                <div class="filter-member">未分配部门的成员</div>
                                <div class="filter-member">外部成员</div>
                                <div class="filter-member">停用的成员</div>
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
                        <div style="font-size: 16px">所有成员 · 1</div>
                        <Poptip v-model="memModal">
                            <div class="branch"><Icon type="md-add-circle" />添加成员</div>
                            <div slot="content">
                                <p @click="showAddModel">添加企业成员</p>
                                <!--<p>添加企业外部成员</p>-->
                            </div>
                        </Poptip>
                    </header>
                    <ul>
                        <li class="one-member">
                            <img src="" alt="">
                            <p>亚索</p>
                            <span>拥有者</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--添加人员-->
        <Modal v-model="showAddPeople" width="360" footer-hide>
            <p slot="header" style="color:#000;text-align:center">
                <span>添加成员至企业</span>
            </p>
            <addPeople v-if="showAddPeople" :invitUsers="peopleList"></addPeople>
        </Modal>
    </div>
</template>

<script>
import addPeople from '@/components/public/addPeople'
import {getMembers} from '@/axios/companyApi'
    export default {
        name: "members",
        data () {
            return{
                branch: false,
                branchName: '',
                group: false,
                groupName: '',
                showAddPeople: false,
                peopleList: [],
                memModal: false
            }
        },
        components: {addPeople},
        methods: {
            showAddModel() {
                this.memModal=false
                getMembers(localStorage.companyPhone,localStorage.companyId).then(res => {
                    console.log(res)
                    this.peopleList=res.data
                    this.showAddPeople=true

                })

            }
        }
    }
</script>

<style scoped lang="less">
@import "./css/members.less";
</style>