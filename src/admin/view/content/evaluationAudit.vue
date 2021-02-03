<template>
    <div class="layout-right" id="layout-right">
        <div class="tabContent">
            <Tabs value="1" @on-click="chenckTab" :animated="false">
                <TabPane :label="item.name" :name="item.acId" v-for="(item,index) in tabTypeList" :key="index">
                    <div class="loading" v-if="loading">
                        <Loading></Loading>
                    </div>
                    <Row>
                        <Col span="8">
                        <div class="listData">
                            <div class="list-item" v-for="(item,index) in listData" :key="item.userId"
                                @click="checkItem(index,item)" :class="{'checkValue':check==index}">
                                <div class="item-content">
                                    <div class="list-item-left">
                                        <img :src="item.acId==1?item.coverImages:item.acId==2?item.headlineImages.split(',')[0]:item.videoCover"
                                            alt="" class="coverImg"
                                            v-if="item.coverImages ||item.headlineImages || item.videoCover">
                                        <div>
                                            <div class="article-tit"
                                                v-html="item.acId==1?item.articleTitle:item.acId==2?item.headlineContent:item.videoName">
                                            </div>
                                            <div class="article-tip">总评论
                                                {{item.commentCount?item.commentCount:0}}条&nbsp;&nbsp;&nbsp;
                                                待审核{{item.commentNotCheckCount?item.commentNotCheckCount:0}}条
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                            </div>
                            <Loading v-if="leftLoading"></Loading>
                        </div>
                        </Col>
                        <Col span="16">
                        <div class="comment-content">
                            <div class="comment-item" v-for="(item,index) in commentList">
                                <div class="check-content" :class="{'check':checkCommentIndex==index}"
                                    @click="toExamine(item,index)">
                                    <Icon
                                        :type="checkCommentIndex==index?'md-checkmark-circle-outline':'md-radio-button-off'"
                                        size="19" color="#ffffff" />
                                </div>
                                <div class="right-content">
                                    <div class="df ac">
                                        <img :src="item.memberImage" alt="">
                                        <span class="name">{{item.memberName}}</span>
                                    </div>
                                    <p class="content">{{item.commentName}}</p>
                                    <div class="df ac jsb">
                                        <div class="time">{{item.createTime}}</div>
                                        <div class="icon-content df ac">
                                            <div class="df ac icon-item" @click="showdelModal(item,index)">
                                                <Icon type="ios-trash" class="svgIcon" size="20" />删除
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="noList" v-if="commentList.length == 0 ">
                                <img src="../../../assets/images/noproject-new.png" />
                                <p>暂无数据</p>
                            </div>
                        </div>
                        </Col>
                    </Row>


                </TabPane>

            </Tabs>
        </div>
        <Modal v-model="deleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定删除此条评论吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="deleteComment">Delete</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Vue from "vue";
    import Loading from "../../../components/public/common/Loading.vue";

    import {
        allArtile,
        commentListByArticleId,
        removeComment
    } from '@/axios/api'
    import {
        updateCommentState
    } from "@/axios/admin"
    export default {
        components: {
            Loading
        },

        data() {
            return {
                loading: false,
                leftLoading: false,
                // 分类id 1文章 2微头条 3视频
                tabTypeList: [{
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
                    // {
                    //     acId: '4',
                    //     name: '问答'
                    // },
                ],
                articleParam: {
                    pageNum: 1,
                    acId: '1',
                    state: '1', // 0 未通过审核  1已通过审核
                },
                listData: [],
                check: -1,
                param: {
                    articleId: '',
                    pageNum: 1,
                    state: 0
                },
                commentList: [],
                deleteModal: false,
                delItem: {
                    index: "",
                    item: {}
                },
                modal_loading: false,
                replyText: "",
                replyIndex: '',
                flag: false,
                commenrFlag: false,
                checkCommentIndex: -1,
                tobeComment: 0, //点击的文章的待评论数
            }
        },
        mounted() {
            this.loading = true
            this.getMyArticle().then(res => {
                return this.checkItem(0, this.listData[0]);
            })
            let _this = this
            document.querySelector('#layout-right').onscroll = function () {
                let scrollTop = document.querySelector('#layout-right').scrollTop || document.body.scrollTop;
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let scrollHeight = document.querySelector('#layout-right').scrollHeight || document.body
                    .scrollHeight;
                if (scrollTop + windowHeight == scrollHeight + 48) {
                    if (_this.flag) {
                        _this.articleParam.pageNum++;
                        _this.getMyArticle()
                    }
                    if (_this.commenrFlag) {
                        _this.param.pageNum++;
                        _this.getCommentList()
                    }

                }
            }
        },
        methods: {
            chenckTab(name) {
                this.loading = true
                this.leftLoading = true
                this.articleParam.acId = name
                this.listData = []
                this.getMyArticle()
            },
            getMyArticle() {
                return new Promise((resolve, reject) => {
                    allArtile(this.articleParam).then(response => {
                        if (response.data.records.length < 20) {
                            this.flag = false
                        } else {
                            this.flag = true
                        }
                        response.data.records.forEach((item) => {
                            this.listData.push(item)
                        })
                        this.loading = false
                        this.leftLoading = false
                        resolve();
                    })
                })
            },
            checkItem(index, item) {
                this.check = index
                this.tobeComment = item.commentNotCheckCount
                this.param.articleId = item.articleId
                this.commentList = []
                this.getCommentList()
            },
            getCommentList() {
                commentListByArticleId(this.param).then(response => {
                    if (response.data.records.length < 20) {
                        this.commenrFlag = false
                    } else {
                        this.commenrFlag = true
                    }
                    response.data.records.forEach((item) => {
                        this.commentList.push(item)
                    })
                })
            },
            showdelModal(item, index) {
                this.delItem.index = index
                this.delItem.item = item
                this.deleteModal = true
            },
            deleteComment() {
                this.modal_loading = true
                removeComment({
                    commentIds: this.delItem.item.commentId
                }).then(response => {
                    this.deleteModal = false
                    this.$Message.success('删除评论成功！');
                    this.commentList.splice(this.delItem.index, 1);
                    //左侧文章评论数-1
                    Vue.set(this.listData[this.check], 'commentNotCheckCount', this.listData[this.check]
                        .commentNotCheckCount - 1)
                })
            },
            toExamine(item, index) {
                this.checkCommentIndex = index
                updateCommentState({
                    commentId: item.commentId
                }).then(response => {
                    this.$Message.success('审核通过');
                    this.$set(this.listData[this.check], 'commentNotCheckCount', this.tobeComment - 1)
                    this.$nextTick(() => {
                        this.commentList.splice(index, 1);
                        this.checkCommentIndex = -1
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .tabContent {
        background: #ffffff;
        padding: 15px;

        /deep/.ivu-tabs-bar {
            margin-bottom: 0;
        }

        /deep/.ivu-tabs-nav-scroll {
            padding-left: 22px;
        }

        .listData {
            min-height: 500px;
            border-right: 1px solid #d5d5d5;

            .list-item {
                position: relative;

                .item-content {
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 30px 14px;
                    // border-bottom: 1px solid #d5d5d5;
                    flex: 1;
                    cursor: pointer;
                    border-left: 2px solid #ffffff;

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
                }

                .line {
                    border-bottom: 1px solid #d5d5d5;
                    margin-left: 22px;
                }
            }

            .checkValue {
                .item-content {
                    background: #FAFAFA;
                    border-left-color: #57a3f3;
                }
            }

            .no-more {
                padding: 20px 0;
                text-align: center;
                color: #555555;
            }


        }

        .comment-content {
            padding-left: 20px;

            .comment-item {
                // padding: 20px 0;
                border-bottom: 1px solid #d5d5d5;
                display: flex;
                position: relative;
                margin-top: 1px;
                .check-content {
                    background: #d8d8d8;
                    height: 100%;
                    width: 30px;
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    i {
                        cursor: pointer;
                    }
                }

                .check {
                    background: #57a3f3;
                }

                .right-content {
                    flex: 1;
                    padding: 20px 0;
                    padding-left: 40px;
                }

                img {
                    width: 28px;
                    height: 28px;
                    margin-right: 8px;
                    border-radius: 50%;
                }

                .name {
                    margin-right: 5px;

                    color: #666666;
                }

                .content {
                    font-size: 14px;
                    line-height: 22px;
                    color: #333333;
                    margin-bottom: 8px;
                }

                .time {
                    color: #999999;
                }

                .icon-content {
                    .svgIcon {
                        margin-right: 4px;
                    }

                    .icon-item {
                        margin-right: 22px;
                        cursor: pointer;
                    }
                }

                .talk {
                    margin-top: 26px;
                    flex: none;
                    position: relative;
                    border: 0 none;
                    border-top: 1px solid #e5e5e5;

                    .talkinner {
                        position: relative;
                        min-height: 40px;
                        margin: 20px 20px 13px 15px;
                        background-color: #fff;
                        border: 1px solid #d9d9d9;
                        border-radius: 6px;

                        .talkUp {
                            position: relative;
                            z-index: 1;
                            max-height: 290px;
                            background-color: #fff;
                            // border-bottom: 1px solid #e8e8e8;

                            #input {
                                input:hover {
                                    border-color: #dddee1;
                                }
                            }
                        }

                        .talkDown {
                            line-height: 40px;
                            height: 40px;

                            .send {
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }

            .noList {
                margin-top: 10%;

                img {
                    display: block;
                    width: 135px;
                    height: 90px;
                    margin: 8px auto 16px;
                }

                p {
                    text-align: center;
                    color: #333333;
                }
            }
        }
    }

    .df {
        display: flex;
    }

    .ac {
        align-items: center;
    }

    .jsb {
        justify-content: space-between;
    }
</style>