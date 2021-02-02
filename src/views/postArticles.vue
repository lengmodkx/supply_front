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
                            <!-- <Input v-model="headlinesParam.headlineContent" type="textarea" style="width: 400px" /> -->
                            <div class="talk">
                                <div class="talkinner">
                                    <div class="talkUp">
                                        <div id="inputs" style="width: 100%;height: 80px;padding: 5px 10px"
                                            ref="textarea" contenteditable="true"></div>
                                    </div>
                                    <div class="talkDown clearfix">
                                        <Emoji @choose="chooseEmoji" ref="emoji"></Emoji>
                                    </div>
                                </div>
                            </div>
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
    import Emoji from "@/components/public/common/emoji/Emoji";
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
        components: {
            Emoji
        },
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
            // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
            this.editor.customConfig.emotions = [{
                // tab 的标题
                title: '默认',
                // type -> 'emoji' / 'image'
                type: 'image',
                // content -> 数组
                content: [{
                        alt: '[坏笑]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
                    },
                    {
                        alt: '[舔屏]',
                        src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
                    },
                    {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif",
                        value: "[草泥马]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif",
                        alt: "[神马]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif",
                        alt: "[浮云]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif",
                        alt: "[给力]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif",
                        alt: "[围观]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif",
                        alt: "[威武]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif",
                        alt: "[熊猫]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif",
                        alt: "[兔子]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif",
                        alt: "[奥特曼]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif",
                        alt: "[囧]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif",
                        alt: "[互粉]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif",
                        alt: "[礼物]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif",
                        alt: "[呵呵]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif",
                        alt: "[嘻嘻]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/laugh.gif",
                        alt: "[哈哈]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/14/tza_thumb.gif",
                        alt: "[可爱]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/kl_thumb.gif",
                        alt: "[可怜]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a0/kbsa_thumb.gif",
                        alt: "[挖鼻屎]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f4/cj_thumb.gif",
                        alt: "[吃惊]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/shamea_thumb.gif",
                        alt: "[害羞]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c3/zy_thumb.gif",
                        alt: "[挤眼]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/29/bz_thumb.gif",
                        alt: "[闭嘴]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/71/bs2_thumb.gif",
                        alt: "[鄙视]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/lovea_thumb.gif",
                        alt: "[爱你]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9d/sada_thumb.gif",
                        alt: "[泪]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/19/heia_thumb.gif",
                        alt: "[偷笑]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8f/qq_thumb.gif",
                        alt: "[亲亲]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/b6/sb_thumb.gif",
                        alt: "[生病]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/mb_thumb.gif",
                        alt: "[太开心]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/17/ldln_thumb.gif",
                        alt: "[懒得理你]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/98/yhh_thumb.gif",
                        alt: "[右哼哼]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/zhh_thumb.gif",
                        alt: "[左哼哼]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a6/x_thumb.gif",
                        alt: "[嘘]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/af/cry.gif",
                        alt: "[衰]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/73/wq_thumb.gif",
                        alt: "[委屈]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/9e/t_thumb.gif",
                        alt: "[吐]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f3/k_thumb.gif",
                        alt: "[打哈欠]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/27/bba_thumb.gif",
                        alt: "[抱抱]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7c/angrya_thumb.gif",
                        alt: "[怒]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/5c/yw_thumb.gif",
                        alt: "[疑问]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/a5/cza_thumb.gif",
                        alt: "[馋嘴]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/88_thumb.gif",
                        alt: "[拜拜]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/e9/sk_thumb.gif",
                        alt: "[思考]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/24/sweata_thumb.gif",
                        alt: "[汗]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7f/sleepya_thumb.gif",
                        alt: "[困]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6b/sleepa_thumb.gif",
                        alt: "[睡觉]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/90/money_thumb.gif",
                        alt: "[钱]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0c/sw_thumb.gif",
                        alt: "[失望]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/cool_thumb.gif",
                        alt: "[酷]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/8c/hsa_thumb.gif",
                        alt: "[花心]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/49/hatea_thumb.gif",
                        alt: "[哼]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/36/gza_thumb.gif",
                        alt: "[鼓掌]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/dizzya_thumb.gif",
                        alt: "[晕]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1a/bs_thumb.gif",
                        alt: "[悲伤]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/62/crazya_thumb.gif",
                        alt: "[抓狂]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/h_thumb.gif",
                        alt: "[黑线]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6d/yx_thumb.gif",
                        alt: "[阴险]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/nm_thumb.gif",
                        alt: "[怒骂]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/hearta_thumb.gif",
                        alt: "[心]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ea/unheart.gif",
                        alt: "[伤心]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/58/pig.gif",
                        alt: "[猪头]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d6/ok_thumb.gif",
                        alt: "[ok]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d9/ye_thumb.gif",
                        alt: "[耶]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/good_thumb.gif",
                        alt: "[good]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c7/no_thumb.gif",
                        alt: "[不要]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d0/z2_thumb.gif",
                        alt: "[赞]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/40/come_thumb.gif",
                        alt: "[来]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d8/sad_thumb.gif",
                        alt: "[弱]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/91/lazu_thumb.gif",
                        alt: "[蜡烛]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6a/cake.gif",
                        alt: "[蛋糕]"
                    }, {
                        src: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/d3/clock_thumb.gif",
                        alt: "[钟]"
                    }, {
                        icon: "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/1b/m_thumb.gif",
                        value: "[话筒]"
                    }
                ]
            }, ]
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
                this.headlinesParam.headlineContent = this.$refs.textarea.innerHTML.replace(/(^\s+)|(\s+$)/g, "");
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
            },
            chooseEmoji(name) {
                this.$refs.textarea.innerHTML += '<img src="' + name + '" style="width: 26px;height: 26px;"/>';
            },
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

    .talk {
        flex: none;
        position: relative;
        border: 0 none;

        .talkinner {
            position: relative;
            min-height: 40px;
            margin: 0 20px 13px 0;
            background-color: #fff;
            border: 1px solid #d9d9d9;
            border-radius: 6px;

            .talkUp {
                position: relative;
                z-index: 1;
                max-height: 290px;
                background-color: #fff;
                // border-bottom: 1px solid #e8e8e8;

                #inputs {
                    input:hover {
                        border-color: #dddee1;
                    }
                }
            }

            .talkDown {
                line-height: 40px;
                height: 40px;


            }
        }
    }
</style>