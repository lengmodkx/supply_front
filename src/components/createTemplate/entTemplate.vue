<template>
    <div>
        <Modal v-model="modalShow" fullscreen footer-hide>
            <div slot="header" class="modal-header header60 header-box-shadow">
                <h3>企业模板管理</h3>
            </div>
            <div class="modal-content">
                <div class="main-content">
                    <div class="header-content df ac jsb">
                        <div>全部模板·1</div>
                        <div class="newBtn">
                            <Icon type="md-add-circle" color="#1b9aee" size="16" />
                            <span>新建模板</span>
                        </div>
                    </div>
                    <div class="body-content">
                        <div class="tem-list">
                            <div class="tem-item-main" v-for="item in 9">
                                <div class="tem-item"
                                    style="background-image: url('https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/project/bj.png');">
                                    <div class="mask ">
                                            <div class="mask-content df ac jsb">
                                                <div class="tem-name">模板名字</div>
                                                <Icon type="ios-trash" size="16" />
                                            </div>
                                        </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                modalShow: true,
            };
        },
        mounted() {},
        methods: {},
    };
</script>

<style lang="less" scoped>
    a {
        color: #595959;
        cursor: pointer;
        background-image: ;
    }

    .df {
        display: flex;
    }

    .jsb {
        justify-content: space-between;
    }

    .ac {
        align-items: center;
    }

    /deep/.ivu-modal-header {
        height: 60px;
        padding: 0;
        background: #ffffff;
    }

    /deep/.ivu-modal-close {
        top: 15px;
    }

    .modal-header {
        height: 100%;

        h3 {
            font-size: 14px;
            font-weight: 700;
            color: #383838;
        }

        .template-property {
            margin-right: 28px;
        }
    }

    .header60 {
        line-height: 60px;
        padding-left: 16px;
    }

    .header-box-shadow {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    /deep/.ivu-modal-content {
        background: #f7f7f7;
    }

    .modal-content {
        width: 1104px;
        max-width: 100%;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 1 1 #e5e5e5;
        border-radius: 4px;

        .header-content {
            padding: 0 20px;
            height: 52px;
            color: #595959;

            .newBtn {
                i {
                    margin-right: 8px;
                }

                span {
                    color: #1b9aee;
                    cursor: pointer;
                }
            }
        }

        .body-content {
            overflow-x: hidden;
            overflow-y: auto;
            height: calc(100vh - 140px);
            position: relative;

            .tem-list {
                display: flex;
                flex-wrap: wrap;
                padding-left: 20px;
                align-content: flex-start;
                margin-left: -16px;

                .tem-item-main {
                    width: 200px;
                    height: 132px;
                    margin: 0 0 16px 16px;
                    cursor: pointer;
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 1px 1px #e5e5e5;
                    transition: box-shadow 218ms ease;
                    border: 1px solid #f7f7f7;
                    color: #262626;
                    &:hover {
                        box-shadow: 0 6px 16px rgba(0,0,0,.1);
                    }
                }


                .tem-item {
                    height: 132px;
                    width: 200px;
                    box-shadow: 0 1px 1px #e5e5e5;

                    background-size: cover;
                    // background-position: 50%;
                    background-color: #f7f7f7;
                    position: absolute;
                    // left: 0;
                    // right: 0;
                    top: 0;
                     &:hover {
                        box-shadow: 0 6px 16px rgb(0 0 0 / 10%);

                    }

                    .mask {
                        // position: relative;
                        padding-top: 74px;
                        // border-radius: 0 0 4px 4px;

                        .mask-content {
                            padding: 8px 12px;
                            height: 58px;
                            background: linear-gradient(180deg, hsla(0, 0%, 100%, 0.76) 0%, #fff 36%, #fff);
                        }

                        .tem-name {
                            font-size: 14px;
                            font-weight: 500;
                            margin: 0 0 2px;
                            line-height: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
    }
</style>