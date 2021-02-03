<template>
    <div class="layout-right">
        <div class="content">
            <div class="tabContent">
                <Tabs value="0" @on-click="chenckTab">
                    <TabPane :label="item.name" :name="item.acId" v-for="(item, index) in tabTypeList" :key="index">
                        <div class="loading" v-if="loading">
                            <Loading></Loading>
                        </div>
                        <div class="listData" v-else>
                            <div class="search-content">
                                <DatePicker v-model="dateValue" type="daterange" placeholder="开始日期 ~ 结束日期"
                                    style="width: 200px"></DatePicker>
                                <div class="search-input">
                                    <Input search enter-button placeholder="搜索关键词" @on-search="searchData"
                                        v-model="articleParam.keyword" />
                                </div>
                            </div>
                            <div class="totalSize">共{{totalSize}}条内容</div>
                            <div class="list-item" v-for="(item, index) in listData" :key="item.userId">
                                <div class="list-item-left" v-if="item.acId == 1 || item.acId == 3">
                                    <img :src="item.acId == 1 ? item.coverImages : item.videoCover" alt=""
                                        class="coverImg"
                                        v-if="item.coverImages || item.headlineImages || item.videoCover" />
                                    <div>
                                        <div class="article-tit">
                                            {{ item.acId == 1 ? item.articleTitle : item.videoName }}
                                        </div>
                                        <div class="article-tip">
                                            评论 {{ item.commentCount?item.commentCount:0 }}
                                        </div>
                                    </div>
                                </div>
                                <div class="list-item-two" v-if="item.acId == 2">
                                    <div class="article-tit" v-html="item.headlineContent"></div>
                                    <div class="img-content">
                                        <img v-for="(item,index) in item.headlineImages.split(',')" :src="item"
                                            alt="" />
                                    </div>
                                    <!-- <img :src="item.headlineImages.split(',')[0]" alt="" /> -->
                                </div>
                                <div class="list-item-right">
                                    <div>{{item.createTime}}</div>
                                    <div class="btn-content">
                                        <Button type="text" @click="goArticleInfo(item)">查看</Button>
                                        <Button type="text" @click="editArticle(item)">修改</Button>
                                        <Button type="text" @click="deleteArticle(item,index)">删除</Button>

                                    </div>
                                </div>
                            </div>
                            <div class="page-content" v-if="totalSize !=0">
                                <Page :total="totalSize" :page-size="20" @on-change="nextPage" />
                            </div>
                        </div>

                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import Loading from "../components/public/common/Loading.vue";
    import {
        myArticle,
        deleteArticle
    } from '@/axios/api'
    export default {
        name: "",
        components: {
            Loading,
        },
        data() {
            return {
                loading: false,
                tabTypeList: [{
                        acId: "0",
                        name: "全部",
                    },
                    {
                        acId: "1",
                        name: "文章",
                    },
                    {
                        acId: "2",
                        name: "微头条",
                    },
                    {
                        acId: "3",
                        name: "视频",
                    },
                ],
                listData: [],
                totalSize: 0,
                articleParam: {
                    pageNum: 1,
                    acId: '',
                    keyword: '',
                    startTime: '',
                    endTime: '',
                    memberId: localStorage.userId
                },
                dateValue: []
            };
        },
        mounted() {
            this.loading = true
            this.getMyArticle()
        },
        methods: {
            getMyArticle() {
                myArticle(this.articleParam).then(response => {
                    this.loading = false
                    this.listData = response.data.records
                    this.totalSize = response.data.total
                })
            },
            searchData() {
                if (this.dateValue.length != 0) {
                    this.articleParam.startTime = new Date(this.dateValue[0]).getTime()
                    this.articleParam.endTime = new Date(this.dateValue[1]).getTime()
                }
                this.getMyArticle()
            },
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
            nextPage(num) {
                this.articleParam.pageNum = num
                this.getMyArticle()

            },
            deleteArticle(item, index) {
                deleteArticle({
                    'articleId': item.articleId
                }).then(response => {
                    this.$Message.success("删除成功");
                    this.listData.splice(index, 1);
                    this.totalSize -= 1
                })
            },
            editArticle(item) {
                this.$router.push({
                    name: "postArticles",
                    params: {
                        type: 'edit',
                        item: item
                    }
                });
            },
            //文章详情
            goArticleInfo(item) {
                this.$router.push("/articleDetails")
                localStorage.setItem('articleInfoList', JSON.stringify(item))
            },
        }
    };
</script>

<style lang="less" scoped>
    .content {
        background: #ffffff;
        height: 100%;

        .tabContent {
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
                        // background: #9b3434;
                        border-radius: 50%;
                        margin-right: 25px;
                    }

                    .btns {
                        width: 65px;
                        line-height: 28px;
                        text-align: center;
                        border-radius: 1px;
                        font-size: 12px;
                        color: #ffffff;
                        cursor: pointer;
                    }

                    .no {
                        background: #999999;
                    }

                    .yes {
                        background: #2cb7f5;
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


                    .list-item-two {
                        .img-content {
                            display: flex;
                            flex-wrap: wrap;

                            img {
                                width: 86px;
                                height: 86px;
                                border-radius: 0;
                                margin-right: 5px;
                            }
                        }

                    }

                    .list-item-right {
                        text-align: right;
                        min-width: 150px;

                        .btn-content {
                            margin-right: -15px;
                        }
                    }
                }

                .no-more {
                    padding: 20px 0;
                    text-align: center;
                    color: #555555;
                }

                .totalSize {
                    padding-left: 30px;
                    margin-top: 12px;
                    margin-bottom: 6px;
                    color: #666666;
                }

                .search-content {
                    padding-bottom: 16px;
                    text-align: right;
                    display: flex;
                    justify-content: flex-end;
                    border-bottom: 1px solid #d5d5d5;

                    .search-input {
                        margin-left: 14px;
                    }
                }
            }

            .page-content {
                padding-top: 15px;
                text-align: right;
            }
        }

        .loading {
            width: 100%;
            height: 0;
        }
    }
</style>