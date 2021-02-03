<template>
    <div class="layout-right" id="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <span>问答详情</span>
                    <div class="line"></div>
                </div>
                <div class="reply-content">
                    <div class="reply-title">{{ replyInfo.questionContent }}</div>
                    <div class="reply-tip">{{ replyInfo.questionDepict }}</div>
                    <div class="img-content" v-if="replyInfo.questionDepictImages">
                        <img v-for="(item, index) in replyInfo.questionDepictImages" :src="item" :key="index" />
                    </div>
                    <div class="icon-content df">
                        <div class="df ac">
                            <img :src="iconList.wdIcon" alt="" class="createImg">
                            <span class="createText">问答 {{replyInfo.replyCount}}</span>
                            <img :src="replyInfo.questionMemberImage" alt="" class="createImg b50">
                            <span class="createText">{{replyInfo.questionMemberName}}</span>
                        </div>
                        <!-- <span class="right-icon-content">
                            <div class="icon-content">
                                <svg-icon name="bi"></svg-icon><span>邀请回答</span>
                            </div>
                        </span> -->
                    </div>
                </div>
                <div class="editor-content">
                    <div id="toolbar-container" class="toolbar"></div>
                    <div id="text-container" class="text"></div>
                    <div class="btns-content">
                        <!-- <Button type="info" ghost style="margin-right:10px;" :loading="btn_loading"
                            @click="save('0')">存草稿</Button> -->
                        <Button type="info" @click="save('1')" :loading="btn_loading">发布</Button>
                    </div>
                </div>
                <div class="title" style="margin-top:30px;">
                    <span>共{{total}}个回答</span>
                    <div class="line"></div>
                </div>
                <div class="comment-list" id="">
                    <div class="comment-item" v-for="item in qaList">
                        <a :href="'/articleCenter?type=other&id='+item.replyMemberId" target="_blank"
                            rel="noopener noreferrer"><img :src="item.replyMemberImage" alt=""></a>

                        <div class="comment-info">
                            <div>
                                <a class="name" :href="'/articleCenter?type=other&id='+item.replyMemberId"
                                    target="_blank" rel="noopener noreferrer">{{item.replyMemberName}}</a>
                            </div>
                            <p class="contents" v-html="item.replyContent"></p>
                            <div class="icon-content df ac">
                                <div class="time">{{item.createTime}}</div>
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
        replyAdd,
        getReplyListByQuetionId
    } from "@/axios/api";
    import Editor from "wangeditor";
    import OSS from "ali-oss";
    import {
        oss
    } from "../axios/ossweb";
    let client = new OSS({
        region: "oss-cn-beijing",
        accessKeyId: "LTAIP4MyTAbONGJx",
        accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
        bucket: "art1001-bim-5d",
    });
    export default {
        data() {
            return {
                replyInfo: {},
                param: {
                    questionId: "", //问题id
                    replyContent: "", // 回答内容
                    isIncognito: "0", // 是否匿名0否1是
                    isDraft: 0, //是否草稿0否1是
                },
                iconList: {
                    wdIcon: require('../assets/images/articles/wd.png'),
                },
                btn_loading: false,
                commParam: {
                    questionId: '',
                    pageNum: 1
                },
                total: 0,
                qaList: [],
                dirName: "upload/reply/",
                uploadList: [],
                flag: false,
            };
        },
        mounted() {
            this.replyInfo = JSON.parse(localStorage.getItem("replyInfoList"));
            this.param.questionId = this.replyInfo.questionId
            this.commParam.questionId = this.replyInfo.questionId
            this.getQAlist()
            this.initEditor()
            let _this = this
            document.querySelector('#layout-right').onscroll = function () {
                let scrollTop = document.querySelector('#layout-right').scrollTop || document.body.scrollTop;
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                let scrollHeight = document.querySelector('#layout-right').scrollHeight || document.body
                    .scrollHeight;
                if (scrollTop + windowHeight == scrollHeight + 48) {
                    if (_this.flag) {
                        _this.commParam.pageNum++;
                        _this.getQAlist()
                    }
                }
            }
        },
        methods: {
            save(num) {
                this.param.isDraft = num
                this.param.replyContent = this.editor.txt.html();
                if (this.param.replyContent == '') {
                    this.$Message.warning("回答不能为空");
                } else {
                    this.btn_loading = true
                    replyAdd(this.param).then(response => {
                        this.btn_loading = false
                        this.$Message.success("发布成功");
                        this.editor.txt.clear()
                        this.getQAlist()
                    })
                }
            },
            getQAlist() {
                getReplyListByQuetionId(this.commParam).then(response => {
                    this.total = response.data.total
                    if (response.data.records.length < 20) {
                        this.flag = false
                    } else {
                        this.flag = true
                    }
                    response.data.records.forEach((item) => {
                        this.qaList.push(item)
                    })
                })
            },
            initEditor() {
                const E = window.wangEditor;
                this.editor = new Editor("#toolbar-container", "#text-container");
                this.editor.customConfig.menus = [
                    'undo', // 撤销
                    'redo', // 重复
                    'head', // 标题
                    'bold', // 粗体
                    'fontSize', // 字号
                    'fontName', // 字体
                    'underline', // 下划线
                    'foreColor', // 文字颜色
                    'justify', // 对齐方式
                    'quote', // 引用
                    'image', // 插入图片
                    'video', // 插入视频
                    'link', // 插入链接
                ]
                this.editor.customConfig.zIndex = 1;
                // 将图片大小限制为 2M
                this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024
                var that = this;
                // this.editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
                this.editor.customConfig.customUploadImg = function (files, insert) {
                    // files 是 input 中选中的文件列表
                    // insert 是获取图片 url 后，插入到编辑器的方法
                    that.uploadList = files
                    that.uploadList.forEach((file, index) => {
                        var fileName = that.dirName + that.random_string(10) + that.get_suffix(file.name);
                        client.multipartUpload(fileName, file).then(function (result) {
                                let Img1 = that.getCaption(result.res.requestUrls[0]);
                                // 上传代码返回结果之后，将图片插入到编辑器中
                                insert(Img1)
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    });
                }
                this.editor.create();
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
            getCaption(obj) {
                var index = obj.indexOf("?");
                if (index != "-1") {
                    obj = obj.substring(0, index + 1);
                }
                return obj;
            },
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

            .reply-content {
                padding: 30px 30px 0;

                .reply-title {
                    font-size: 16px;
                    font-weight: 400;
                    color: #000000;
                }

                .reply-tip {
                    font-size: 14px;
                    font-weight: 400;
                    color: #808080;
                }

                .img-content {
                    display: flex;
                    margin: 10px 0;

                    img {
                        width: 100px;
                        height: 100px;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
                }

                .icon-content {
                    justify-content: space-between;
                    color: #808080;
                    align-items: center;

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

                    .right-icon-content {
                        svg {
                            width: 16px;
                            height: 16px;
                            margin-right: 5px;
                        }

                        .icon-content {
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }

            .editor-content {
                margin-top: 20px;
                position: relative;

                .toolbar {
                    border-color: #d5d5d5;
                    border-bottom: none;
                    background: #fafafa;
                    padding: 10px 0;
                    justify-content: center;
                }

                .text {
                    border-color: #d5d5d5;
                    border-top: none;
                    min-height: 200px;
                }

                .btns-content {
                    position: absolute;
                    bottom: 10px;
                    right: 20px;
                    z-index: 2;
                }
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

                    .contents {
                        font-size: 14px;
                        line-height: 22px;
                        color: #222;
                        margin: 10px 0;
                    }

                    .icon-content {
                        .time {
                            font-size: 14px;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>