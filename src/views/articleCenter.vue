<template>
    <div class="center-box" id="center-box">
        <div class="center-content">
            <Row :gutter="18">
                <Col span="18">
                <div class="center-left">
                    <div class="profile-header">
                        <img src="../assets/images/articles/center.png" class="bg-header">
                        <div class="white-content">
                            <div class="left-content">
                                <img :src="userInfo.image" class="avatar">
                                <div class="userName">{{userInfo.nickName}}</div>
                            </div>
                            <div class="right-btns" v-if="showBtnContent">
                                <Button type="primary" v-if="!showfollowbtns" @click="FollowAuthor" icon="md-add">关注</Button>
                                <Button type="info" v-else icon="md-checkmark" @click="FollowAuthor">已关注</Button>
                            </div>
                        </div>
                    </div>
                    <div class="tabContent">
                        <Tabs value="0" @on-click="chenckTab" v-if="center">
                            <TabPane :label="item.name" :name="item.acId" v-for="(item,index) in tabTypeList"
                                :key="index">
                                <div class="loading" v-if="loading">
                                    <Loading></Loading>
                                </div>
                                <div class="listData">
                                    <div class="list-item" v-for="(item,index) in listData" :key="item.userId">
                                        <div class="list-item-left" v-if="item.acId==1 || item.acId==3">
                                            <img :src="item.acId==1?item.coverImages:item.videoCover" alt=""
                                                class="coverImg"
                                                v-if="item.coverImages ||item.headlineImages || item.videoCover">
                                            <div>
                                                <div class="article-tit">
                                                    {{item.acId==1?item.articleTitle:item.videoName}}
                                                </div>
                                                <div class="article-tip">评论 {{item.commentCount}}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;<Time :time="item.createTime" /></div>
                                            </div>

                                        </div>
                                        <div class="list-item-two" v-if="item.acId==2">
                                            <div class="article-tit">{{item.headlineContent}}</div>
                                            <img :src="item.headlineImages.split(',')[0]" alt="">
                                        </div>
                                        <div class="deleteBtns" @click="deleteArticle(item)" v-if="pageType != 'other'">
                                            删除</div>
                                    </div>
                                </div>
                            </TabPane>

                        </Tabs>
                        <Tabs :value="typeShow" @on-click="chenckTab" v-else>
                            <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index">
                                <div class="loading" v-if="loading">
                                    <Loading></Loading>
                                </div>
                                <div class="listData">
                                    <div class="list-item" v-for="(item,index) in listData" :key="item.userId">
                                        <div class="list-item-left">
                                            <img :src="item.image" alt="">
                                            <div>{{item.userName}}</div>
                                        </div>
                                        <div class="btns" :class="item.isAttention==0?'no':'yes'"
                                            v-if="pageType != 'other'" @click="operation(item,index)">
                                            {{item.isAttention==0?'未关注':'已关注'}}</div>
                                    </div>
                                    <div class="no-more" v-if="!flag">没有更多了</div>
                                </div>
                            </TabPane>

                        </Tabs>
                    </div>
                </div>
                </Col>
                <Col span="6">
                <div class="center-right">
                    <div class="relation">
                        <dl class="">
                            <dt>
                                <h3 @click="showfollow('2')">{{userInfo.followCount}}</h3>
                                <p>关注</p>
                            </dt>
                            <dd>
                                <h3 @click="showfollow('1')">{{userInfo.fansCount}}</h3>
                                <p>粉丝</p>
                            </dd>
                        </dl>
                    </div>
                    <p class="intro-info">简介：{{userInfo.signature}}</p>
                </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    import Loading from "../components/public/common/Loading.vue";
    import Vue from "vue";
    import {
        allConnectionUser,
        attentionUserStatus,
        myArticle,
        deleteArticle,
        workBenchInfo,
        judgeIsAttention
    } from '@/axios/api'
    export default {
        data() {
            return {
                loading: false,
                userInfo: {},
                param: {
                    type: '2',
                    pageNum: 1,
                    memberId: ''
                },
                tabList: [{
                        name: '2',
                        label: '关注'
                    },
                    {
                        name: '1',
                        label: '粉丝'
                    }
                ],
                typeShow: '2',
                // 分类id 1文章 2微头条 3视频
                tabTypeList: [{
                        acId: '0',
                        name: '全部'
                    },
                    {
                        acId: '1',
                        name: '文章'
                    },
                    {
                        acId: '2',
                        name: '微头条'
                    },
                    {
                        acId: '3',
                        name: '视频'
                    },
                ],
                listData: [],
                flag: true, //下拉加载开关
                follow: true,
                center: true, // 显示文章还是粉丝
                articleParam: {
                    pageNum: 1,
                    acId: '',
                    memberId: ''
                },
                pageType: '',
                showBtnContent:false,
                showfollowbtns: true,
            }
        },
        components: {
            Loading
        },
        mounted() {
            this.loading = true
            this.pageType = this.$route.query.type
            if (this.pageType == 'other') {
                this.param.memberId = this.$route.query.id
                let userId=localStorage.getItem('userId')
                if(this.param.memberId==userId){
                    this.showBtnContent=false
                }else {
                    this.showBtnContent=true
                    this.attentionPaid()
                }
                this.articleParam.memberId = this.$route.query.id
                this.getUser()
            } else {
                this.showBtnContent=false  //我自己的个人主页,不显示关注按钮
                this.userInfo = this.$route.params.userInfo
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            }
            this.getMyArticle()
            let _this = this;
            document.querySelector('#center-box').onscroll = function () {
                let scrollTop = document.querySelector('#center-box').scrollTop || document.body.scrollTop;
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let scrollHeight = document.querySelector('#center-box').scrollHeight || document.body.scrollHeight;
                if (scrollTop + windowHeight == scrollHeight + 48 && _this.flag == true) {
                    if (_this.center) {
                        _this.articleParam.pageNum++;
                        _this.getMyArticle()
                    } else {
                        _this.param.pageNum++;
                        _this.getList()
                    }
                }
            }
        },
        methods: {
            getList() {
                allConnectionUser(this.param).then(response => {
                    if (response.data.length < 20) {
                        this.flag = false
                    }
                    response.data.forEach((item) => {
                        this.listData.push(item)
                    })
                    this.loading = false
                })
            },
            getMyArticle() {
                myArticle(this.articleParam).then(response => {
                    if (response.data.records.length < 20) {
                        this.flag = false
                    } else {
                        this.flag = true
                    }
                    response.data.records.forEach((item) => {
                        this.listData.push(item)
                    })
                    this.loading = false
                })
            },
            chenckTab(name) {
                this.loading = true
                if (this.center) {
                    if (name == 0) {
                        this.articleParam.acId = ''
                    } else {
                        this.articleParam.acId = name
                    }
                    this.listData = []
                    this.getMyArticle()
                } else {
                    this.param.type = name
                    this.listData = []
                    this.getList()
                }

            },
            operation(item, index) {
                attentionUserStatus({
                    'memberId': item.userId
                }).then(response => {
                    if (this.listData[index].isAttention == 1) {
                        Vue.set(this.listData[index], 'isAttention', 0)
                    } else {
                        Vue.set(this.listData[index], 'isAttention', 1)

                    }
                })
            },
            deleteArticle(item) {
                deleteArticle({
                    'articleId': item.articleId
                }).then(response => {
                    this.$Message.success("删除成功");
                    this.listData = []
                    this.getMyArticle()
                })
            },
            showfollow(num) {
                this.listData = []
                this.typeShow = num
                this.center = false
                this.loading = true
                this.getList()
            },
            getUser() {
                let param = {
                    orgId: localStorage.companyId,
                    memberId: this.param.memberId
                }
                workBenchInfo(param).then(res => {
                    if (res.result == 1) {
                        this.userInfo = res.data;
                    }
                });
            },
            FollowAuthor() {
                attentionUserStatus({
                    'memberId': this.param.memberId
                }).then(response => {
                    this.showfollowbtns=!this.showfollowbtns
                })
            },
            attentionPaid(){
                judgeIsAttention({
                    'memberId': this.param.memberId
                }).then(response => {
                    console.log(response.data)
                    this.showfollowbtns=response.data
                })
            }

        },



    }
</script>
<style scoped lang="less">
    .center-box {
        padding: 15px;
        background-color: #F0EFEC;
        color: #333333;
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        overflow: auto;
        flex: 1;

        .center-left {
            .profile-header {
                position: relative;

                .bg-header {
                    display: block;
                    width: 100%;
                    height: 154px;
                    background: #e8e8e8;
                }

                .white-content {
                    display: flex;
                    height: 56px;
                    width: 100%;
                    padding: 0 24px;
                    box-sizing: border-box;
                    background: #FFFFFF;
                    position: absolute;
                    bottom: 0;
                    justify-content: space-between;

                    .left-content {
                        display: flex;

                        .avatar {
                            width: 52px;
                            height: 52px;
                            border-radius: 50%;
                            margin-top: -26px;
                            margin-right: 20px;
                            background: #ffffff;
                        }

                        .userName {
                            font-weight: 400;
                            color: #333333;
                            font-size: 14px;
                        }
                    }

                    .right-btns {
                        margin-top: -16px;

                        .ivu-btn-info {
                            color: #999;
                            background: #e8e8e8;
                            border-color: #e8e8e8;
                        }
                    }
                }
            }

            .tabContent {
                margin-top: 14px;
                background: #ffffff;
                padding: 15px;

                .listData {
                    min-height: 500px;

                    .list-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 14px 30px 14px;
                        border-bottom: 1px solid #d5d5d5;

                        &:hover {
                            .deleteBtns {
                                display: block;
                            }
                        }


                        .list-item-left {
                            display: flex;
                            align-items: center;

                        }

                        img {
                            width: 44px;
                            height: 44px;
                            background: #9B3434;
                            border-radius: 50%;
                            margin-right: 25px;
                        }



                        .btns {
                            width: 65px;
                            line-height: 28px;
                            text-align: center;
                            border-radius: 1px;
                            font-size: 12px;
                            color: #FFFFFF;
                            cursor: pointer;
                        }

                        .no {
                            background: #999999;
                        }

                        .yes {

                            background: #2CB7F5;
                        }

                        .coverImg {
                            width: 120px;
                            height: 70px;
                            border-radius: 0;
                        }

                        .article-tit {
                            font-size: 16px;
                            color: #333333;
                            font-weight: 600;
                            margin-bottom: 12px;
                        }

                        .article-tip {
                            font-size: 12px;
                        }

                        .deleteBtns {
                            color: #333333;
                            display: none;
                            cursor: pointer;
                        }

                        .list-item-two {
                            img {
                                width: 86px;
                                height: 86px;
                                border-radius: 0;
                            }
                        }
                    }

                    .no-more {
                        padding: 20px 0;
                        text-align: center;
                        color: #555555;
                    }


                }
            }

            .loading {
                width: 100%;
                height: 0;
            }
        }

        .center-right {
            background: #FFFFFF;

            .relation {
                border-bottom: 1px solid #d5d5d5;

                dl {
                    display: table;
                    width: 100%;
                    background: #fff;
                    position: relative;

                    dt,
                    dd {
                        display: table-cell;
                        width: 50%;
                        text-align: center;
                        padding: 36px 0 14px;
                        position: relative;
                        cursor: pointer;

                    }

                    p {
                        font-size: 14px;
                        line-height: 22px;
                        color: #777;
                        margin-top: 2px;
                    }
                }
            }

            .intro-info {
                padding: 14px 20px 16px;
                margin-bottom: 20px;
                font-size: 14px;
                line-height: 22px;
            }
        }
    }
</style>