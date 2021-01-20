<template>
    <div class="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <span>问答详情</span>
                    <div class="line"></div>
                </div>
                <div class="reply-content">
                        <div class="reply-title"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        replyAdd
    } from "@/axios/api";
    export default {
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {


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
            padding: 20px;

            .title {
                border-bottom: 1px solid #d5d5d5;
                padding: 0 0 15px 30px;
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

                .icon-content {
                    i {
                        margin-right: 30px;
                    }
                }
            }



        }
    }
</style>