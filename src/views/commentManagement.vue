<template>
    <div class="layout-right">
        <div class="tabContent">
            <Tabs value="0" @on-click="chenckTab">
                <TabPane :label="item.name" :name="item.acId" v-for="(item,index) in tabTypeList" :key="index">
                    <!-- <div class="loading" v-if="loading">
                    <Loading></Loading>
                </div> -->
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
                                            <div class="article-tit">
                                                {{item.acId==1?item.articleTitle:item.acId==2?item.headlineContent:item.videoName}}
                                            </div>
                                            <div class="article-tip">评论 {{item.commentCount}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="line"></div>
                            </div>
                        </div>
                        </Col>
                        <Col span="16">
                        <div class="comment-content">
                            <div class="comment-item" v-for="item in commentList">
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
                                        <div class="df ac icon-item">
                                            <svg-icon name="hf" class="svgIcon"></svg-icon>回复
                                        </div>
                                        <div class="df ac icon-item">
                                            <svg-icon name='zan' class="svgIcon"></svg-icon>赞
                                        </div>
                                        <div class="df ac icon-item">
                                            <svg-icon name='ding' class="svgIcon"></svg-icon>置顶
                                        </div>
                                        <div class="df ac icon-item">
                                            <svg-icon name='artDel' class="svgIcon"></svg-icon>删除
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </Col>
                    </Row>


                </TabPane>

            </Tabs>
        </div>

    </div>
</template>

<script>
    import {
        myArticle,
        commentListByArticleId
    } from '@/axios/api'
    export default {
        data() {
            return {
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
                check: 0,
                param: {
                    articleId: '',
                    pageNum: 1
                },
                commentList: []
            }
        },
        mounted() {
            this.getMyArticle()
        },
        methods: {
            chenckTab(name) {
                this.loading = true
                if (name == 0) {
                    this.articleParam.acId = ''
                } else {
                    this.articleParam.acId = name
                }
                this.listData = []
                this.getMyArticle()
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
                    // this.loading = false
                })
            },
            checkItem(index, item) {
                this.check = index
                this.param.articleId = item.articleId
                commentListByArticleId(this.param).then(response => {
                    this.commentList = response.data.records
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .tabContent {
        margin-top: 14px;
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
            }
        }
    }
</style>