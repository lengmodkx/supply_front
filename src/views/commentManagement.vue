<template>
    <div class="layout-right" id="layout-right">
        <div class="tabContent">
            <Tabs value="0" @on-click="chenckTab" :animated="false">
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
                                            <div class="article-tip">评论 {{item.commentIsCheckCount?item.commentIsCheckCount:0}}
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
                                <div class="df ac">
                                    <a :href="'/articleCenter?type=other&id='+item.memberId" target="_blank"
                                        rel="noopener noreferrer"><img :src="item.memberImage" alt=""></a>
                                    <a class="name" :href="'/articleCenter?type=other&id='+item.memberId"
                                        target="_blank" rel="noopener noreferrer">{{item.memberName}}</a>
                                </div>
                                <p class="content">{{item.commentName}}</p>
                                <div class="df ac jsb">
                                    <div class="time">{{item.createTime}}</div>
                                    <div class="icon-content df ac">
                                        <!-- <div class="df ac icon-item" @click="reply(index)">
                                            <svg-icon name="hf" class="svgIcon"></svg-icon>回复
                                        </div>
                                        <div class="df ac icon-item">
                                            <svg-icon name='zan' class="svgIcon"></svg-icon>赞
                                        </div>
                                        <div class="df ac icon-item">
                                            <svg-icon name='ding' class="svgIcon"></svg-icon>置顶
                                        </div> -->
                                        <div class="df ac icon-item" @click="showdelModal(item,index)">
                                            <svg-icon name='artDel' class="svgIcon">
                                            </svg-icon>删除
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="talk">
                                    <div class="talkinner">
                                        <div class="talkUp">
                                            <div id="input" style="width: 100%;height: 80px;padding: 5px 10px"
                                                :ref="'textarea'+index" placeholder="按Enter快速发布" contenteditable="true"
                                                @keyup.enter="sendChat"></div>
                                        </div>
                                        <div class="talkDown clearfix">
                                            <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
                                            <div class="send fr">
                                                <Button type="primary" >发布</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                            <div class="noList" v-if="commentList.length == 0 ">
                                <img src="../assets/images/noproject-new.png" />
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
                <Button type="error" size="large" long :loading="modal_loading" @click="deleteComment">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Vue from "vue";
    import Emoji from "@/components/public/common/emoji/Emoji";

    import {
        myArticle,
        commentListByArticleId,
        removeComment
    } from '@/axios/api'
    export default {
        components: {
            Emoji
        },

        data() {
            return {
                loading: false,
                leftLoading: false,
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
                    {
                        acId: '4',
                        name: '问答'
                    },
                ],
                articleParam: {
                    pageNum: 1,
                    acId: '',
                    memberId: localStorage.userId
                },
                listData: [],
                check: -1,
                param: {
                    articleId: '',
                    pageNum: 1
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
                if (name == 0) {
                    this.articleParam.acId = ''
                } else {
                    this.leftLoading = true
                    this.articleParam.acId = name
                }
                this.listData = []
                this.getMyArticle()
            },
            getMyArticle() {
                return new Promise((resolve, reject) => {
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
                        this.leftLoading = false
                        resolve();
                    })
                })
            },
            checkItem(index, item) {
                this.check = index
                this.param.articleId = item.articleId
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
                    commentIds: this.delItem.item.commentId,
                    articleId:this.param.articleId
                }).then(response => {
                    this.deleteModal = false
                    this.$Message.success('删除评论成功！');
                    this.commentList.splice(this.delItem.index, 1);
                    //左侧文章评论数-1
                    Vue.set(this.listData[this.check], 'commentCount', this.listData[this.check]
                        .commentCount - 1)
                })
            },
            reply(index) {
                this.replyIndex = index
            },
            chooseEmoji(name) {
                this.$refs['textarea' + this.replyIndex][0].innerHTML += '<img src="' + name + '" />';
            },
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
                padding: 20px 0;
                border-bottom: 1px solid #d5d5d5;

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
                        width: 18px;
                        height: 18px;
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
</style>