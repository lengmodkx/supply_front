<template>
    <div class="layout-right" id="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <span>我发布的</span>
                    <div class="line"></div>
                </div>
                <div class="table-content">
                    <Loading v-show="loading"></Loading>

                    <Table :columns="columnsList" :data="requirementsList" class="reuqire-table">
                        <template slot-scope="{ row }" slot="demandName">
                            <div>{{ row.demandName }}</div>
                        </template>
                        <template slot-scope="{ row }" slot="createTime">
                            <div>{{ row.createTime }}</div>
                        </template>
                        <template slot-scope="{ row }" slot="demandBudget">
                            <div>{{ row.demandBudget }}</div>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" ghost size="small" style="margin-right: 5px">查看</Button>
                            <Button type="primary" ghost size="small" style="margin-right: 5px"
                                @click="editRequire(row)">编辑</Button>
                            <Button type="error" size="small" style="margin-right: 5px"
                                @click="showDel(row,index)">删除</Button>
                        </template>
                    </Table>
                </div>
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
                        slot: "demandBudget",
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
                flag:false,
                requirementsList: [],
                demandParam: {
                    pageNum: 1,
                    type: 2,
                },
                delModal: false,
                modal_loading: false,
                requireItem: {}
            };
        },
        mounted() {
            this.loading = true;
            this.getList();
            document.querySelector('#layout-right').onscroll = function () {
                let scrollTop = document.querySelector('#layout-right').scrollTop || document.body.scrollTop;
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let scrollHeight = document.querySelector('#layout-right').scrollHeight || document.body.scrollHeight;
                if (scrollTop + windowHeight==scrollHeight + 48 && _this.flag == true) { 
                        _this.demandParam.pageNum++;
                        _this.getList()
                   
                }
            }
        },
        methods: {
            getList() {
                demandList(this.demandParam).then((response) => {
                    if (response.data.records.length < 20) {
                        this.flag = false
                    }else {
                        this.flag = true
                    }
                    response.data.records.forEach((item) => {
                        this.requirementsList.push(item)
                    })
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
                    this.delModal=false
                    this.requirementsList.splice(this.requireIndex,1)
                })
            }

        },
    };
</script>

<style lang="less" scoped>
    .container {
        width: 100%;
        color: #333333;
        font-size: 14px;
        min-height: 100%;
        background: #ffffff;

        .content {
            background: #ffffff;
            padding: 20px;

            .title {
                border-bottom: 1px solid #d5d5d5;
                padding: 15px 30px;
                position: relative;
                display: flex;
                justify-content: space-between;

                .line {
                    width: 56px;
                    height: 2px;
                    background: #2b85e4;
                    position: absolute;
                    bottom: 0;
                }
                
            }
            .table-content {
                    margin-top: 20px;
                }
        }
    }
</style>