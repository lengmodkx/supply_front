<template>
    <div class="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <span>发布竞标</span>
                    <div class="line"></div>
                </div>
                <div class="editor-content">
                    <div class="text-content">
                        <Input v-model="param.details" type="textarea" :rows="5" placeholder="请输入服务详情" />
                        <div class="line"></div>
                    </div>
                    <Form :model="param" :label-width="100" ref="formValidate" :rules="ruleValidate">
                        <FormItem label="作品展示">
                            <div class="headlines-upload-list" v-if="headlinesImg.length > 0">
                                <div v-for="(item, index) in headlinesImg" class="headlines-upload-item">
                                    <img :src="item" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-trash-outline" @click.native="handleRemoveVideo(item, index)">
                                        </Icon>
                                    </div>
                                </div>
                            </div>
                            <Upload ref="upload" :show-upload-list="false" :max-size="2048"
                                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload"
                                :action="host" :data="uploadData" :headers="headers" :on-success="handleSuccess"
                                multiple style="display: inline-block; width: 100px; margin-top: 10px" type="drag"
                                v-if="headlinesImg.length != 9">
                                <div style="width: 100px; height: 100px; line-height: 100px">
                                    <Icon type="ios-add" size="20" />
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem label="出价" prop="bid">
                            <Input v-model="param.bid" type="number" class="priceInput">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="save('formValidate')">确认报价</Button>
                            <div class="tips">在您确认报价之后系统需要您支付一定费用用于担保您不是恶意报价，在竞标结束之后此费用将直接返还到您的账户中。</div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        joinBidding
    } from "@/axios/api";
    import {
        oss
    } from "../axios/ossweb";
    export default {
        data() {
            return {
                param: {
                    demandId: '',
                    orgId: '',
                    details: '',
                    detailImages: '',
                    bid: ""
                },
                headlinesImg: [],
                classList: [],
                ruleValidate: {
                    bid: [{
                        required: true,
                        message: '必填项',
                        trigger: 'blur',
                    }],

                },
                uploadData: {},
                host: "",
                headers: {
                    "x-auth-token": localStorage.token
                },
                name:""
            };
        },
        mounted() {
            this.param.demandId = this.$route.query.demandId
            this.param.orgId = localStorage.companyId
        },
        methods: {
            handleBeforeUpload(file) {
                let dir = ''
                dir = "upload/exhibition/" + this.$moment().format('YYYY-MM-DD') + "/";
                return oss(dir, file.name).then(res => {
                    this.host = res.host;
                    this.uploadData = res;
                    this.name = res.host + '/' + res.key
                });
            },
            handleSuccess(res, file) {
                    this.headlinesImg.push(this.name);
            },
            handleRemoveVideo(item, index) {
                this.headlinesImg.splice(index, 1);
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "超过文件大小限制",
                    desc: "文件  " + file.name + " 过大, 超过2M.",
                });
            },
            getCaption(obj) {
                var index = obj.indexOf("?");
                if (index != "-1") {
                    obj = obj.substring(0, index + 1);
                }
                return obj;
            },
            random_string(len) {
                len = len || 32;
                var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
                var maxPos = chars.length;
                var pwd = "";
                for (var i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            },
            get_suffix(filename) {
                var pos = filename.lastIndexOf(".");
                var suffix = "";
                if (pos !== -1) {
                    suffix = filename.substring(pos);
                }
                return suffix;
            },
            save(name) {
                if (this.param.demandDetails == '') {
                    this.$Message.error('服务详情不能为空!');
                } else {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.release()
                        }
                    })
                }

            },
            release() {
                if (this.headlinesImg.length != 0) {
                    this.param.detailImages = this.headlinesImg.join(',')
                }

                joinBidding(this.param).then(response => {
                    this.$Message.success('参与竞标成功!');
                    //跳支付
                    this.$router.push("/ipostedit");
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

            .text-content {
                padding: 0 30px;

                .line {
                    border-bottom: 1px solid #d5d5d5;
                }

                /deep/.ivu-input {
                    border: none;
                    margin: 10px 0;

                    &:focus {
                        outline: none;
                        box-shadow: 0 0 0 2px transparent;
                    }

                    &:hover {
                        border-color: #ffffff;
                    }
                }

                /deep/ .ivu-input-word-count {
                    bottom: 11px;
                }

            }

        }
    }

    .ivu-form {
        margin-top: 10px;

        /deep/.ivu-select {
            width: 240px;
        }

        /deep/.ivu-input {
            width: 240px;
        }

        .ivu-input-group {
            width: 240px;

        }
    }

    .demo-upload-list {
        display: inline-block;
        width: 164px;
        height: 110px;
        text-align: center;
        line-height: 110px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        margin: 0 2px;
    }

    .headlines-upload-list {
        display: inline-block;

        .headlines-upload-item {
            height: 100px;
            width: 100px;
            display: inline-block;
            margin-right: 10px;
            position: relative;

            &:hover {
                .demo-upload-list-cover {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            i {
                color: #fff;
                font-size: 30px;
                cursor: pointer;
                margin: 0 2px;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .priceInput {
        /deep/.ivu-input {
            color: #FF2020;
        }
    }

    .tips {

        font-size: 12px;

        color: #999999;
    }
</style>