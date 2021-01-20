<template>
    <div class="layout-right">
        <div class="container">
            <div class="content">
                <div class="title">
                    <Dropdown trigger="click" style="margin-left: 5px" @on-click="changType">
                        <div style="cursor: pointer">
                            {{ clickTypeAcName }}
                            <Icon type="ios-arrow-down"></Icon>
                        </div>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="item in classList" :key="item.acId" :name="item.acName">
                                {{ item.acName }}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div class="line"></div>
                </div>
                <div class="editor-content" v-show="clickTypeAcName == '文章'">
                    <div>
                        <div id="toolbar-container" class="toolbar"></div>
                        <div class="text-content">
                            <Input placeholder="请输入文章标题（1-30个字）" maxlength="30" show-word-limit size="large"
                                v-model="param.articleTitle" />
                            <div id="text-container" class="text"></div>
                        </div>
                    </div>
                    <Form :model="param" :label-width="120">
                        <FormItem label="展示封面">
                            <div>
                                <RadioGroup v-model="param.coverShow">
                                    <Radio label="1">单图</Radio>
                                    <Radio label="0">无封面</Radio>
                                </RadioGroup>
                            </div>
                            <div class="demo-upload-list" v-if="uploadList.length > 0">
                                <template v-for="item in uploadList">
                                    <img :src="item" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                            </div>
                            <Upload ref="upload" :show-upload-list="false" :max-size="2048"
                                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :action="host"
                                style="display: inline-block; width: 164px; margin-top: 10px" type="drag"
                                v-if="param.coverShow == 1 && uploadList.length == 0">
                                <div style="width: 164px; height: 110px; line-height: 110px">
                                    <Icon type="ios-add" size="20" />
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="save" :loading="btn_loading">发布</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="video-content" v-if="clickTypeAcName == '视频'">
                    <div class="video-upload">
                        <Upload type="drag" :action="host" :format="['mp4', 'avi']" accept="video/mp4,video/avi"
                            :show-upload-list="true" :before-upload="videoBeforeUpload" ref="videoUpload"
                            :max-size="10240" :on-exceeded-size="videoMaxSize">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击上传或将文件拖入此区域</p>
                            </div>
                        </Upload>
                        <div class="video-list df ac" v-for="(item, index) in videoList">
                            <template>
                                <div>{{ item.fileName }}</div>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                <div class="video-list-cover">
                                    <Icon type="ios-trash-outline" @click.native="handleRemoveVideo(item, index)"
                                        size="20">
                                    </Icon>
                                </div>
                            </template>
                        </div>
                    </div>
                    <Form :model="videoParam" :label-width="120">
                        <FormItem label="标题">
                            <Input v-model="videoParam.videoName" style="width: 400px"></Input>
                        </FormItem>
                        <FormItem label="封面" prop="videoCover">
                            <div class="demo-upload-list" v-if="videoCover.length > 0">
                                <template v-for="item in videoCover">
                                    <img :src="item" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </template>
                            </div>
                            <Upload ref="upload" :show-upload-list="false" :max-size="2048"
                                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :action="host"
                                style="display: inline-block; width: 164px; margin-top: 10px" type="drag"
                                v-if="videoCover.length == 0">
                                <div style="width: 164px; height: 110px; line-height: 110px">
                                    <Icon type="ios-add" size="20" />
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="saveVideo" :loading="btn_loading">发布</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="headlines-content" v-if="clickTypeAcName == '微头条'">
                    <Form :model="headlinesParam" :label-width="120">
                        <FormItem label="内容">
                            <Input v-model="headlinesParam.headlineContent" type="textarea" style="width: 400px" />
                        </FormItem>
                        <FormItem label="图片">
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
                                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :action="host"
                                multiple style="display: inline-block; width: 100px; margin-top: 10px" type="drag"
                                v-if="headlinesImg.length != 9">
                                <div style="width: 100px; height: 100px; line-height: 100px">
                                    <Icon type="ios-add" size="20" />
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="saveHeadlines" :loading="btn_loading">发布</Button>
                        </FormItem>
                    </Form>
                </div>
                <div class="qa-content" v-if="clickTypeAcName == '问答'">
                    <div class="text-content">
                        <Input v-model="qaParam.questionContent" placeholder="请输入问题（最多30个字）" maxlength="30"
                            show-word-limit size="large" />
                        <div class="line"></div>
                        <Input v-model="qaParam.questionDepict" type="textarea" :rows="5" placeholder="请输入描述（选填）" />
                        <div class="line"></div>
                    </div>
                    <Form :model="qaParam" :label-width="120">
                        <FormItem label="图片">
                            <div class="headlines-upload-list" v-if="qaImgList.length > 0">
                                <div v-for="(item, index) in qaImgList" class="headlines-upload-item">
                                    <img :src="item" />
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-trash-outline" @click.native="handleRemoveVideo(item, index)">
                                        </Icon>
                                    </div>
                                </div>
                            </div>
                            <Upload ref="upload" :show-upload-list="false" :max-size="2048"
                                :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :action="host"
                                multiple style="display: inline-block; width: 100px; margin-top: 10px" type="drag"
                                v-if="qaImgList.length != 3">
                                <div style="width: 100px; height: 100px; line-height: 100px">
                                    <Icon type="ios-add" size="20" />
                                </div>
                            </Upload>
                        </FormItem>
                        <FormItem label="是否匿名">
                            <Checkbox v-model="qaParam.isIncognito" :true-value="1" :false-value="0"></Checkbox>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="saveQa" :loading="btn_loading">提问</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Editor from "wangeditor";
    import {
        article,
        articleClass,
        editArticle,
        questionAdd
    } from "@/axios/api";
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
                btn_loading: false,
                param: {
                    articleTitle: "",
                    articleContent: "",
                    acId: "1",
                    coverShow: "1",
                    coverImages: "",
                    articlePureContent: "", //不带html标签的文本
                },
                imgName: "",
                visible: false,
                uploadList: [],
                host: "",
                classList: [],
                clickTypeAcName: "文章",
                videoList: [],
                percentage: 0,
                videoParam: {
                    acId: "3",
                    videoName: "",
                    videoAddress: "",
                    videoCover: "",
                },
                videoCover: [],
                videoAddress: [],
                headlinesParam: {
                    acId: "2",
                    headlineContent: "",
                    headlineImages: "",
                },
                headlinesImg: [],
                qaParam: {
                    questionContent: "", //提出的问题
                    questionDepict: "", //问题描述
                    questionDepictImages: "", // 问题描述图片
                    isIncognito: '0', // 是否匿名（0否 1是）
                    isDraft: '0', // 是否草稿（0否1是）
                },
                qaImgList: []
            };
        },
        mounted() {
            const E = window.wangEditor;
            this.editor = new Editor("#toolbar-container", "#text-container");
            this.editor.create();
            this.getArticleClass();
            if (this.$route.params.type == "edit") {
                this.editMethod();
            }
        },
        methods: {
            getArticleClass() {
                articleClass().then((response) => {
                    this.classList = response.data;
                });
            },
            changType(name) {
                this.clickTypeAcName = name;
            },
            handleRemove(file) {
                if (this.clickTypeAcName == "文章") {
                    this.uploadList = [];
                } else if (this.clickTypeAcName == "视频") {
                    this.videoCover = [];
                }
            },
            handleRemoveVideo(item, index) {
                if (this.clickTypeAcName == "视频") {
                    this.videoList.splice(this.videoList.indexOf(item), 1);
                    this.videoAddress.splice(index, 1);
                } else if (this.clickTypeAcName == "微头条") {
                    this.headlinesImg.splice(index, 1);
                } else if (this.clickTypeAcName == "问答") {
                    this.qaImgList.splice(index, 1);
                }
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "超过文件大小限制",
                    desc: "文件  " + file.name + " 过大, 超过2M.",
                });
            },
            videoMaxSize(file) {
                this.$Notice.warning({
                    title: "超过文件大小限制",
                    desc: "文件  " + file.name + " 过大, 超过10M.",
                });
            },
            handleBeforeUpload(file) {
                console.log(file);
                let fileName = ''
                fileName = "upload/content/" + this.random_string(10) + this.get_suffix(file.name);
                var _this = this;
                client
                    .multipartUpload(fileName, file)
                    .then(function (result) {
                        console.log(result);
                        if (_this.clickTypeAcName == "文章") {
                            let Img1 = _this.getCaption(result.res.requestUrls[0]);
                            _this.uploadList.push(Img1);
                        } else if (_this.clickTypeAcName == "视频") {
                            let Img3 = _this.getCaption(result.res.requestUrls[0]);
                            _this.videoCover.push(Img3);
                        } else if (_this.clickTypeAcName == "微头条") {
                            let Img2 = _this.getCaption(result.res.requestUrls[0]);
                            _this.headlinesImg.push(Img2);
                        } else if (_this.clickTypeAcName == "问答") {
                            let Img4 = _this.getCaption(result.res.requestUrls[0]);
                            _this.qaImgList.push(Img4);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            videoBeforeUpload(file) {
                var _this = this;
                let obj = {
                    percentage: 0,
                    showProgress: true,
                    fileName: file.name,
                };
                _this.videoList.push(obj);
                let fileName = ''
                fileName = "upload/content/" + this.random_string(10) + this.get_suffix(file.name);
                client
                    .multipartUpload(fileName, file)
                    .then(function (result) {
                        let videoLink = _this.getCaption(result.res.requestUrls[0]);
                        _this.videoAddress.push(videoLink);
                        _this.videoList[_this.videoList.length - 1].percentage = 100;
                        setTimeout(() => {
                            _this.videoList[_this.videoList.length - 1].showProgress = false;
                        }, 500);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            save() {
                this.param.articleContent = this.editor.txt.html();
                this.param.articlePureContent = this.editor.txt.text();
                this.param.coverImages = this.uploadList[0];
                if (this.param.articleTitle == "") {
                    this.$Message.warning("标题不能为空");
                } else if (this.param.articleContent == "") {
                    this.$Message.warning("正文内容不能为空");
                } else if (
                    this.param.coverShow == 1 &&
                    this.param.coverImages == undefined
                ) {
                    this.$Message.warning("请选择封面");
                } else {
                    this.saveAxios(this.param)
                }
            },
            getCaption(obj) {
                var index = obj.indexOf("?");
                if (index != "-1") {
                    obj = obj.substring(0, index + 1);
                }
                return obj;
            },
            saveVideo() {
                this.videoParam.videoCover = this.videoCover[0];
                this.videoParam.videoAddress = this.videoAddress.join(",");
                if (this.videoParam.videoName == "") {
                    this.$Message.warning("标题不能为空");
                } else if (this.videoParam.videoAddress == "") {
                    this.$Message.warning("请选择需要上传的视频");
                } else if (this.videoParam.videoCover == undefined) {
                    this.$Message.warning("请选择封面");
                } else {
                    this.saveAxios(this.videoParam)
                }
            },
            saveHeadlines() {
                this.headlinesParam.headlineImages = this.headlinesImg.join(",");
                if (this.headlinesParam.headlineContent == "") {
                    this.$Message.warning("内容不能为空");
                } else if (this.headlinesParam.headlineImages == "") {
                    this.$Message.warning("请选择图片");
                } else {
                    this.saveAxios(this.headlinesParam)
                }
            },
            editMethod() {
                let item = this.$route.params.item;
                console.log(item)

                if (item.acId == 1) {
                    this.clickTypeAcName = "文章";
                    this.param.articleId = item.articleId;
                    this.param.articleTitle = item.articleTitle;
                    this.editor.txt.html(item.articleContent);
                    if (item.coverShow == 1) {
                        this.uploadList.push(item.coverImages);
                    }
                } else if (item.acId == 2) {
                    this.clickTypeAcName = "微头条";
                    this.headlinesParam.articleId = item.articleId;
                    this.headlinesParam.headlineContent = item.headlineContent;
                    this.headlinesImg = item.headlineImages.split(",");
                } else {
                    this.clickTypeAcName = "视频";
                    this.videoParam.articleId = item.articleId;
                    this.videoParam.videoName = item.videoName;
                    this.videoCover.push(item.videoCover);
                    this.videoAddress = item.videoAddress.split(",");
                    let obj = {
                        percentage: 100,
                        showProgress: false,
                        fileName: '',
                    };
                    for (let i of this.videoAddress) {
                        obj.fileName = i
                        this.videoList.push(obj)
                    }
                    console.log(item.videoAddress.split(","))
                }
            },
            saveAxios(param) {
                this.btn_loading = true
                if (this.$route.params.type == "edit") {
                    editArticle(param).then((response) => {
                        if (response.result == 1) {
                            this.$Message.success("发布成功");
                            this.btn_loading = false
                            this.$router.push("/contentMan");
                        }
                    });
                } else {
                    article(param).then((response) => {
                        if (response.result == 1) {
                            this.$Message.success("发布成功");
                            this.btn_loading = false
                            this.$router.push("/contentMan");
                        }
                    });
                }
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
            saveQa() {
                if (this.qaImgList.length != 0) {
                    this.qaParam.questionDepictImages = this.qaImgList.join(",");
                }
                if (this.qaParam.questionContent == "") {
                    this.$Message.warning("问题不能为空");
                } else {
                    this.btn_loading = true
                    questionAdd(this.qaParam).then(response => {
                        this.$Message.success("提问成功");
                        this.btn_loading = false
                        this.$router.push("/org/" + localStorage.companyId);
                    })
                }
            }
        },
    };
</script>
<style lang="less" scoped>
    .container {
        width: 100%;
        color: #333333;
        font-size: 14px;

        .content {
            background: #ffffff;
            padding-bottom: 20px;
            margin-bottom: 20px;

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

                .icon-content {
                    i {
                        margin-right: 30px;
                    }
                }
            }

            .toolbar {
                border: none;
                background: #fafafa;
                padding: 10px 0;
                justify-content: center;
            }

            .text-content {
                padding: 0 30px;

                /deep/.ivu-input {
                    border-color: #ffffff;
                    border-bottom-color: #d5d5d5;
                    margin: 10px 0;

                    &:focus {
                        outline: none;
                    }

                    &:hover {
                        border-color: #ffffff;
                    }
                }
            }

            .text {
                border: none;
                border-bottom: 1px solid #d5d5d5;
                min-height: 300px;

                /deep/.w-e-text {
                    position: absolute;
                }
            }
        }
    }

    .ivu-form {
        margin-top: 10px;
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

    /deep/.ivu-select-dropdown {
        z-index: 10002;
    }

    .video-upload {
        margin-left: 120px;
        margin-top: 20px;
        width: 600px;

        .ivu-upload {
            width: 400px;
        }

        .video-list {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
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

    .qa-content {
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
</style>