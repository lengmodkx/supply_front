<template>
    <div class="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <div class="conetent-tit">正文</div>
                </div>
                <div class="article-content">
                    <div class="article-tit">
                        {{infoList.acId==1?infoList.articleTitle:infoList.acId==2?'微头条':infoList.videoName}}</div>
                    <div class="article-info df ac">
                        <img :src="infoList.acId==1?iconList.videoIcon:infoList.acId==2?iconList.ttIcon:iconList.textIcon"
                            class="createImg">
                        <span class="createText">{{infoList.acId==1?'文章':infoList.acId==2?'微头条':'视频'}}</span>

                        <a :href="'/articleCenter?type=other&id='+infoList.memberId" target="_blank"
                            v-if="from!='adminPage'" rel="noopener noreferrer" class="art-a"><img
                                :src="infoList.memberImage" alt="" class="createImg b50"></a>
                        <img :src="infoList.memberImage" alt="" v-else class="createImg b50">
                        <a class="art-a" :href="'/articleCenter?type=other&id='+infoList.memberId"
                                        v-if="from!='adminPage'" target="_blank"
                                        rel="noopener noreferrer">{{infoList.userName}}</a>
                                    <span class="createText" v-else>{{infoList.userName}}</span>
                        <div class="time">{{infoList.createTime}}</div>
                    </div>
                    <div class="article-text" v-if="infoList.acId==1">
                        <div v-html="infoList.articleContent"></div>
                    </div>
                    <div class="article-text" v-if="infoList.acId==2">
                        <div class="article-text-content" v-html="infoList.headlineContent"></div>
                        <div v-for="item in infoList.headlineImages.split(',')">
                            <img :src="item" alt="">
                        </div>
                    </div>
                    <div class="article-text" v-if="infoList.acId==3">
                        <div v-for="item in infoList.videoAddress.split(',')">
                            <video :src="item" controls="controls"
                                style="height:500px;display: block;margin:auto;">您的浏览器不支持 video 标签。</video>
                        </div>
                    </div>
                </div>
                <div class="comment-content">
                    <div v-if="from!='adminPage'">
                        <Input v-model="param.commentName" type="textarea" placeholder="写下您的评论……" :rows="5" />
                        <Button type="primary" @click="saveComment" class="saveBtn">评论</Button>
                    </div>
                    <div class="comment-list">
                        <div class="comment-item" v-for="item in commentList">
                            <a :href="'/articleCenter?type=other&id='+item.memberId" target="_blank"
                                v-if="from!='adminPage'" rel="noopener noreferrer"><img :src="item.memberImage"
                                    alt=""></a>
                            <img :src="item.memberImage" alt="" v-else>
                            <div class="comment-info">
                                <div>
                                    <a class="name" :href="'/articleCenter?type=other&id='+item.memberId"
                                        v-if="from!='adminPage'" target="_blank"
                                        rel="noopener noreferrer">{{item.memberName}}</a>
                                    <span class="name" v-else>{{item.memberName}}</span>
                                    <Time :time="item.createTime" />
                                </div>
                                <p class="content">{{item.commentName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        commentListByArticleId,
        commentAdd
    } from '@/axios/api'
    export default {
        props: ['from'],
        data() {
            return {
                iconList: {
                    videoIcon: require('../assets/images/articles/video.png'),
                    ttIcon: require('../assets/images/articles/tt.png'),
                    textIcon: require('../assets/images/articles/text.png'),
                },
                infoList: {},
                param: {
                    commentName: '',
                    articleId: ''
                },
                commentParam: {
                    pageNum: 1,
                    commentState: 1,
                    articleId: ""
                },
                commentList: [],
                total: '',
                flag: true, //下拉加载开关
            }
        },
        mounted() {
            this.infoList = JSON.parse(localStorage.getItem('articleInfoList'))
            this.param.articleId = this.infoList.articleId
            this.commentParam.articleId = this.infoList.articleId
            this.getCommentList()
            let _this = this;
            window.onscroll = function () {
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollTop + windowHeight == scrollHeight && _this.flag == true) {
                    _this.commentParam.pageNum++;
                    _this.getCommentList()
                }
            }
        },
        methods: {
            getCommentList() {
                commentListByArticleId(this.commentParam).then(response => {
                    this.commentList = response.data.records
                    this.total = response.data.total
                    if (response.data.records.length < 20) {
                        this.flag = false
                    }
                })
            },
            saveComment() {
                commentAdd(this.param).then(response => {
                    this.$Message.success("发布评论成功！审核中");
                    this.param.commentName = ''
                    this.getCommentList()
                })
            }
        }

    }
</script>

<style lang="less" scoped>
    @import "../assets/css/commonRight.less";

    .container {
        height: 100%;

        .content {
            min-height: 100%;
        }
    }

    .article-content {
        padding: 30px 20px;
        color: #666666;

        .article-tit {
            text-align: center;
            margin-bottom: 28px;
            font-size: 18px;
        }

        .article-info {
            justify-content: center;
            color: #808080;
            padding-bottom: 26px;
            border-bottom: 1px solid #d5d5d5;

            .createImg {
                width: 16px;
                height: 16px;
            }

            .b50 {
                border-radius: 50%;
            }

            .createText {
                margin: 0 15px 0 10px;
            }

            .art-a {
                display: flex;
                color: #808080;
            }
            .time {
                margin-left: 10px;
            }
        }

        .article-text {
            padding: 30px 180px;

            .article-text-content {
                text-align: center;
                margin-bottom: 30px;
            }

            img {
                display: block;
                margin: auto;
                height: 300px;
                margin-bottom: 20px;
            }
        }
    }

    .comment-content {
        padding: 0 50px;

        .saveBtn {
            margin-top: 10px;
        }

        .comment-list {
            margin-top: 22px;
            border-top: 1px solid #f2f2f2;

        }

        .comment-item {
            display: flex;
            padding: 14px 0;

            img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-right: 14px;
            }

            .comment-info {
                .name {
                    margin-right: 5px;
                    color: #406599;
                }

                .content {
                    font-size: 14px;
                    line-height: 22px;
                    color: #222;
                }
            }
        }
    }
</style>