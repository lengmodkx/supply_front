<template>
    <div class="layout-right" id="layout-right">
        <div class="container">
            <div class="content">
                <Tabs v-model="showValue" @on-click="checkTab">
                    <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tabList" :key="index">
                        <div class="table-content">
                            <Loading v-show="loading"></Loading>
                            <Table :columns="columnsList" :data="requirementsList" class="reuqire-table">
                                <template slot-scope="{ row }" slot="demandName">
                                    <div>{{ row.demandName }}</div>
                                </template>
                                <template slot-scope="{ row }" slot="createTime">
                                    <div>{{ row.createTime }}</div>
                                </template>
                                <template slot-scope="{ row }" slot="bid">
                                    <div>{{ row.bid }}</div>
                                </template>
                                <template slot-scope="{ row, index }" slot="action">
                                    <Button type="primary" ghost style="margin-right:10px">查看</Button>
                                    <Button type="primary" ghost style="margin-right:10px" @click="editRequire(row)"
                                        v-if="showValue==1">编辑</Button>
                                    <Button type="error" style="margin-right: 10px" @click="showDel(row,index)"
                                        v-if="showValue==1">删除</Button>
                                </template>
                            </Table>
                        </div>
                        <div class="pagingContent" v-if="total!=0">
                            <Page :total="total" show-total @on-change="changePage" />
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
                <p>确定删除这条需求吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="delRequire">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Loading from "../components/public/common/Loading.vue";

    import {
        demandList,
        demandRemove
    } from "@/axios/api";
    export default {
        name: "",
        components: {
            Loading,
        },
        data() {
            return {
                loading: false,
                tabList: [{
                        label: '我发布的',
                        name: "1"
                    },
                    {
                        label: '我竞标的',
                        name: "2"
                    },
                    {
                        label: '我中标的',
                        name: "3"
                    },

                ],
                columnsList: [{
                        title: "需求标题",
                        slot: "demandName",
                    },
                    {
                        title: "发布时间",
                        slot: "createTime",
                    },
                    {
                        title: "金额",
                        slot: "bid",
                    },
                    {
                        title: "审核状态",
                        render: (h, params) => {
                            return h(
                                "span",
                                params.row.isCheck == "1" ? "审核通过" : "未通过审核"
                            );
                        },
                    },
                    {
                        title: "操作",
                        slot: "action",
                        width: 300,
                        align: "center",
                    },
                ],
                flag: false,
                requirementsList: [],
                demandParam: {
                    pageNum: 1,
                    type: 1,
                },
                delModal: false,
                modal_loading: false,
                requireItem: {},
                showValue: '1',
                total: 0
            };
        },
        mounted() {
            this.loading = true;
            this.getList();
            // document.querySelector('#layout-right').onscroll = function () {
            //     let scrollTop = document.querySelector('#layout-right').scrollTop || document.body.scrollTop;
            //     let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            //     let scrollHeight = document.querySelector('#layout-right').scrollHeight || document.body
            //         .scrollHeight;
            //     if (scrollTop + windowHeight == scrollHeight + 48 && _this.flag == true) {
            //         _this.demandParam.pageNum++;
            //         _this.getList()

            //     }
            // }
        },
        methods: {
            getList() {
                demandList(this.demandParam).then((response) => {
                    // if (response.data.records.length < 20) {
                    //     this.flag = false
                    // } else {
                    //     this.flag = true
                    // }
                    // response.data.records.forEach((item) => {
                    //     this.requirementsList.push(item)
                    // })
                    this.requirementsList = response.data.records
                    this.total = response.data.total
                    this.loading = false
                });
            },
            editRequire(item) {
                localStorage.setItem("editRequire", JSON.stringify(item));
                this.$router.push({
                    path: "/requirements",
                    query: {
                        type: "edit",
                    },
                });
            },
            showDel(item, index) {
                this.delModal = true
                this.requireItem = item
                this.requireIndex = index
            },
            delRequire() {
                this.modal_loading = true
                demandRemove({
                    demandId: this.requireItem.demandId
                }).then(response => {
                    this.$Message.success('删除成功');
                    this.modal_loading = false
                    this.delModal = false
                    this.requirementsList.splice(this.requireIndex, 1)
                })
            },
            checkTab(name) {
                this.requirementsList = []
                this.demandParam.type = name
                this.loading = true;
                this.getList();
            },
            changePage(num) {
                this.demandParam.pageNum = num
                this.getList()
            }

        },
    };
</script>

<style lang="less" scoped>
    @import "../assets/css/demandList.less";
</style>