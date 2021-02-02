<template>
    <div class="layout-right">
        <div class="content">
            <div class="tabContent">
                <Tabs value="1" @on-click="chenckTab">
                    <TabPane :label="item.name" :name="item.acId" v-for="(item, index) in tabTypeList" :key="index">
                        <div class="loading" v-if="loading">
                            <Loading></Loading>
                        </div>
                        <div class="listData" v-else>
                            <Table :columns="columnsList1" :data="listData" class="reuqire-table">
                                <template slot-scope="{ row }" slot="commentCount">
                                    <div>{{ row.commentCount ? row.commentCount : 0 }}</div>
                                </template>
                                <template slot-scope="{ row }" slot="createTime">
                                    <div>{{ row.createTime }}</div>
                                </template>
                                <template slot-scope="{ row, index }" slot="action">
                                    <Button type="primary" ghost @click="goArticleInfo(row)">查看</Button>
                                    <Button type="error" style="margin-left: 10px"
                                        @click="showDel(row,index)">删除</Button>
                                </template>
                            </Table>
                            <div class="page-content" v-if="totalSize != 0">
                                <Page :total="totalSize" :page-size="20" @on-change="nextPage" show-total />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <Modal v-model="delModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定删除吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="deleteArticle">删除</Button>
            </div>
        </Modal>
        <Modal v-model="modalDetail" fullscreen footer-hide>
            <articleDetails v-if="modalDetail" :from="'adminPage'"></articleDetails>
        </Modal>
    </div>
</template>

<script>
    import Loading from "../../../components/public/common/Loading.vue";
    import articleDetails from '../../../views/articleDetails.vue'
    import {
        allArtile,
        deleteArticle
    } from '@/axios/api'
    import {
        contentAudit
    } from "@/axios/admin"

    export default {
        name: "",
        components: {
            Loading,
            articleDetails
        },
        data() {
            return {
                loading: false,
                tabTypeList: [{
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
                    pageNum: '1',
                    pageSize: '20',
                    state: 0,
                    acId:'1'
                },
                columnsList1: [{
                        title: "封面",
                        render: (h, params) => {
                            if (params.row.coverImages || params.row.headlineImages || params.row.videoCover) {
                                return h("img", {
                                    attrs: {
                                        src: params.row.acId == "1" ? params.row.coverImages : params
                                            .row.acId == "2" ? params.row.headlineImages.split(',')[0] :
                                            params.row.videoCover
                                    },
                                    style: {
                                        width: '120px',
                                        height: '70px',
                                        borderRadius: '0'
                                    }
                                })
                            } else {
                                return h("span", '无')
                            }
                        },
                    },
                    {
                        title: "标题",
                        render: (h, params) => {
                            return h(
                                "span", {
                                    domProps: {
                                        innerHTML: params.row.acId == "1" ? params.row.articleTitle : params
                                            .row.acId == "2" ?
                                            params.row.headlineContent : params.row.videoName
                                    }
                                }

                            );
                        },
                    },
                    {
                        title: "评论数量",
                        slot: "commentCount",
                    },
                    {
                        title: "创建时间",
                        slot: "createTime",
                    },
                    {
                        title: "审核",
                        render: (h, params) => {
                            return h(
                                "i-switch", {
                                    props: {
                                        value: params.row.state == "2",
                                    },
                                    on: {
                                        'on-change': (value) => {
                                            console.log(value)
                                            contentAudit({
                                                articleId: params.row.articleId
                                            }).then(response => {
                                                this.$Message.success('审核通过');
                                                this.$set(this.listData[params.index], 'state',
                                                    "2")
                                                this.$nextTick(() => {
                                                    this.listData.splice(params.index,
                                                        1)
                                                })
                                            })
                                        }
                                    }
                                }
                            );
                        },
                    },
                    {
                        title: "操作",
                        slot: "action",
                        width: 200,
                        align: "center",
                    },
                ],
                requireItem: {},
                requireIndex: '',
                modal_loading: false,
                delModal: false,
                modalDetail: false
            };
        },
        mounted() {
            this.loading = true
            this.getArticleList()
        },
        methods: {
            getArticleList() {
                allArtile(this.articleParam).then(response => {
                    this.loading = false
                    this.listData = response.data.records
                    this.totalSize = response.data.total
                })
            },
            chenckTab(name) {
                this.loading = true
                if (name == 0) {
                    this.articleParam.acId = ''
                } else {
                    this.articleParam.acId = name
                }
                this.listData = []
                this.getArticleList()
            },
            nextPage(num) {
                this.articleParam.pageNum = num
                this.getArticleList()

            },
            deleteArticle() {
                this.modal_loading = true
                deleteArticle({
                    'articleId': this.requireItem.articleId
                }).then(response => {
                    this.$Message.success("删除成功");
                    this.modal_loading = false
                    this.delModal = false
                    this.listData.splice(this.requireIndex, 1)
                    this.totalSize -= 1
                })
            },
            showDel(item, index) {
                this.delModal = true
                this.requireItem = item
                this.requireIndex = index
            },
            //文章详情
            goArticleInfo(item) {
                this.modalDetail = true
                localStorage.setItem('articleInfoList', JSON.stringify(item))
            },
        }
    };
</script>

<style lang="less" scoped>
    .layout-right {
        height: 100%;
    }

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
                        background: #9b3434;
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
                        img {
                            width: 86px;
                            height: 86px;
                            border-radius: 0;
                        }
                    }

                    .list-item-right {
                        text-align: right;

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
        }
    }
</style>