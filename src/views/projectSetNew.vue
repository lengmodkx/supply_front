<template>
    <div v-if="project != null">
        <div class="title">项目设置</div>
        <div class="tabPage clearfix">
            <div class="tabs fl">
                <ul>
                    <li :class="{ tabactive: active == 1 }" @click="choose(1)">
                        概览
                    </li>
                    <!-- 先隐藏 -->
                    <!-- <li :class="{ tabactive: active == 2 }" @click="choose(2)">
                        项目偏好
                    </li>
                    <li :class="{ tabactive: active == 5 }" @click="choose(5)">
                        任务设置
                    </li> -->
                    <li :class="{ tabactive: active == 4 }" @click="choose(4)">
                        任务流转
                    </li>
                    <li :class="{ tabactive: active == 3 }" @click="choose(3)">
                        更多
                    </li>
                </ul>
            </div>
            <div class="content fl">
                <div class="div1" v-if="active == 1">
                    <div class="div1-box">
                        <div class="div1-title">项目封面</div>
                        <div class="df">
                            <div class="cover">
                                <img :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+project.projectCover" alt v-if="pic_show"  />
                                <img :src="imageUrl" alt v-if="pic_hide" accept="image/*" />
                            </div>
                            <div class="upload">
                                <div>
                                    <!-- <Button class="upLoadButton">上传新封面</Button> -->
                                    <Upload :show-upload-list="false" :max-size="2048" :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload" :action="host" :data="uploadData"
                                        :headers="headers" :on-success="handleSuccess">
                                        <Button type="primary" ghost>上传新封面</Button>
                                    </Upload>
                                    <p class="tips">
                                        最佳图片比例为300*150
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="div1-box df jsb">
                        <div class="inputContent">
                            <div class="div1-title">项目名称</div>
                            <Input v-model="project.projectName" />
                        </div>
                        <div class="inputContent">
                            <div class="div1-title">项目进度（%）</div>
                            <Input v-model="project.projectSchedule" />
                        </div>
                    </div>
                    <div class="div1-box df jsb">
                        <div class="inputContent">
                            <div class="div1-title">开始时间</div>
                            <DatePicker placeholder="开始时间" :value="project.startTime | timeFilter2" type="date"
                                @on-change="startDate" :options="options1"></DatePicker>
                        </div>
                        <div class="inputContent">
                            <div class="div1-title">结束时间</div>
                            <DatePicker placeholder="结束时间" :value="project.endTime | timeFilter2" type="date"
                                @on-change="endDate" :options="options2"></DatePicker>
                        </div>
                    </div>
                    <div class="div1-box">
                        <div class="div1-title">项目简介</div>
                        <Input v-model="project.projectDes" type="textarea" placeholder="介绍一个这个项目" />
                    </div>
                    <div class="div1-box">
                        <div class="div1-title">项目公开性</div>
                        <Select v-model="priority" size="large" style="width:100%;" @on-change="priorityChange"
                            :placeholder="project.isPublic ? '私有' : '公开'">
                            <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div class="div1-box">
                        <div class="div1-title">项目拥有者</div>
                        <div class="clearfix">
                            <div class="owner fl">
                                <img :src="project.image">
                                <span>{{project.memberName}}</span>
                            </div>
                            <!-- <div class="fr">
                                <Button class="giveBtn">移交</Button>
                            </div> -->
                        </div>
                    </div>
                    <div class="save clearfix">
                        <Button type="primary" @click="saveSet">保存</Button>
                    </div>
                </div>
                <!-- 先隐藏 -->
                <!-- <div class="div1" v-if="active == 2">
                    <div class="div1-box">
                        <div class="preTitle">看板风格</div>
                        <div class="preTitledes">切换任务看板的主题风格，内置两种风格。</div>
                        <div class="mt15">
                            <RadioGroup v-model="styleActive" vertical>
                                <Radio label="0">
                                    <span>默认</span>
                                </Radio>
                                <Radio label="1">
                                    <span>简约</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div class="line"></div>
                        <div class="df jsb">
                            <div>
                                <div class="preTitle">自动更新项目进度</div>
                                <div class="preTitledes">根据当前任务的完成情况自动计算项目进度。</div>
                            </div>
                            <iSwitch v-model="switch1" @on-change="change" />
                        </div>
                    </div>
                </div>
                <div class="div1" v-if="active == 5">
                    <div class="div1-box">
                        <div class="df jsb">
                            <div>
                                <div class="preTitle">项目ID</div>
                                <div class="preTitledes">设置项目编号，编号将作为ID前缀，用以区别项目。支持2-6位字母。</div>
                                <div class="df mt15">
                                    <Input v-model="valueId" />
                                    <Button type="primary" class="saveid-btn">保存</Button>
                                </div>
                            </div>
                            <iSwitch v-model="switch2" @on-change="change" />
                        </div>
                        <div class="line"></div>
                        <div class="df jsb">
                            <div>
                                <div class="preTitle">任务开始时间</div>
                                <div class="preTitledes">为任务设置开始时间，更科学地规划工作。</div>
                            </div>
                            <iSwitch v-model="switch3" @on-change="change" />
                        </div>
                        <div class="line"></div>
                        <div class="df jsb">
                            <div>
                                <div class="preTitle">新任务默认开启隐私模式</div>
                                <div class="preTitledes">对本项目内的新任务默认开启隐私模式，创建成功后仅参与者可见。</div>
                            </div>
                            <iSwitch v-model="switch2" @on-change="change" />
                        </div>
                        <div class="line"></div>
                    </div>
                </div> -->

                <div class="div4" v-if="active == 4">
                    <div v-if="!createRule" class="rule-list-wrap">
                        <div class="createdBtn" @click="addRule">
                            <Icon type="md-add" size="18" style="margin-right: 10px" />创建规则
                        </div>
                        <div class="rule-list" v-for="(item, index) in ruleList" :key="index">
                            <div class="rule-con" @click="clickRule(item)">
                                <div v-if="!item.isEdit" class="rule-name">{{ item.name }}</div>
                                <input v-if="item.isEdit" @blur="changeRuleName(item)" type="text" class="change-name"
                                    v-model="item.name" />
                                <div class="icon-box">
                                    <Tooltip content="编辑标题">
                                        <Icon @click.stop="item.isEdit = true" type="md-create" />
                                    </Tooltip>
                                    <Tooltip content="删除">
                                        <Icon type="ios-trash-outline" @click.stop="deleteRule(item)" />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="noList" v-if="ruleList.length == 0 ">
                            <img src="../assets/images/noproject-new.png" />
                            <p>暂无数据</p>
                        </div>
                    </div>
                    <rule v-else @cancelRule="getRuleList" :projectId="this.project.projectId" :hasData="ruleData">
                    </rule>
                </div>
                <div class="div3" v-if="active == 3">
                    <div class="div3-box">
                        <div class="div1-title">项目操作</div>
                        <p>您可以执行以下操作</p>
                        <div class="btns">
                            <Button @click="modal1 = true">归档项目</Button>
                            <Button @click="modal3 = true">退出</Button>
                            <Button type="error" @click="modal2 = true">移至回收站</Button>
                        </div>
                        <Modal class="confirmModal" v-model="modal1" title="归档项目" footer-hide>
                            <p style="padding:10px;font-size:15px;">
                                一旦将项目「{{
                            project.projectName
                          }}」归档，本项目和所含信息将会被移到「归档项目」内，其中的内容依然会被统计和搜索收录，归档项目可以随时恢复并继续使用。
                            </p>
                            <div class="doBtn">
                                <Button type="error" @click="okGuidang">归档</Button>
                            </div>
                        </Modal>
                        <Modal class="confirmModal" v-model="modal2" title="移到回收站" footer-hide>
                            <p style="padding:10px;font-size:15px;">
                                一旦将项目「{{
                            project.projectName
                          }}」移到回收站，所有与项目有关的信息将会被移到回收站，其中的内容也不会被统计和搜索收录，需要去回收站恢复后才能继续使用。
                            </p>
                            <div class="doBtn">
                                <Button type="error" @click="okHuishou">移到回收站</Button>
                            </div>
                        </Modal>
                        <Modal class="confirmModal" v-model="modal3" title="退出项目" footer-hide>
                            <p style="padding:10px;font-size:15px;">
                                一旦你退出了该项目，你将不能查看任何关于该项目的信息。退出项目后，如果想重新加入，请联系项目管理员。
                            </p>
                            <div class="doBtn">
                                <Button type="error" @click="remove">确定退出</Button>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    import {
        mapState,
        mapMutations
    } from "vuex";
    import {
        updateProject,
        recycleProject
    } from "@/axios/api";
    import {
        updataProjectPic,
        removeUser
    } from "@/axios/api2";
    import {
        getAllRule,
        ruleName,
        deleteRule,
        editRule
    } from "@/axios/ruleApi";
    import rule from "./createRuleNew";
    import {
        oss
    } from "@/axios/ossweb";
    export default {
        data() {
            return {
                fil: null,
                active: 1,
                priority: "",
                switch1: false,
                imageUrl: "",
                filename: "",
                fileName: "",
                files: [],
                dirName: "upload/project/",
                pic_show: true,
                pic_hide: false,
                modal1: false,
                modal2: false,
                createRule: false,
                ruleList: [],
                ruleData: null,
                List: [{
                        value: "0",
                        label: "公开项目 (所有人都可通过链接访问，仅项目成员可编辑)"
                    },
                    {
                        value: "1",
                        label: "私有项目 (仅项目成员可查看和编辑)"
                    }
                ],
                options1: {},
                options2: {},
                styleActive: '0', //看板风格
                switch1: false,
                valueId: '',
                modal3: false,
                uploadData: {},
                host: "",
                headers: {
                    "x-auth-token": localStorage.token
                },
                name: ""
            };
        },
        components: {
            rule
        },
        computed: {
            ...mapState("project", ["project"])
        },
        methods: {
            ...mapMutations("project", ["updatePro"]),
            resetFile() {
                this.showupload = true;
                this.showProgress = false;
                this.uploadList = [];
                this.percentage = [];
            },
            startDate(date) {
                this.project.startTime = new Date(date).getTime();
                this.options2 = {
                    disabledDate(date1) {
                        return (
                            date1 && date1.valueOf() <= new Date(date).getTime() - 86400000
                        );
                    }
                };
            },
            endDate(date) {
                this.project.endTime = new Date(date).getTime();
                this.options1 = {
                    disabledDate(date1) {
                        return date1 && date1.valueOf() >= new Date(date).getTime();
                    }
                };
            },
            handleBeforeUpload(file) {
                let dir = ''
                dir = this.dirName + this.$moment().format('YYYY-MM-DD') + "/";
                return oss(dir, file.name).then(res => {
                    this.host = res.host;
                    this.uploadData = res;
                    this.name = res.host + '/' + res.key
                    this.project.projectCover = res.key;

                });

            },
            handleSuccess() {
                this.pic_show = false
                this.pic_hide = true
                this.imageUrl = this.name;
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "超过文件大小限制",
                    desc: "文件  " + file.name + " 过大, 超过2M.",
                });
            },
            choose(flag) {
                this.active = flag;
                if (flag === 4) {
                    getAllRule(this.project.projectId).then(res => {
                        if (res.result) {
                            this.ruleList = res.data;
                            this.ruleList.map(v => {
                                this.$set(v, "isEdit", false);
                            });
                        }
                    });
                }
            },
            publishAxios() {
                return new Promise((resolve, reject) => {
                    this.$Message.loading({
                        content: "Loading...",
                        duration: 0
                    });
                    let data = {
                        projectId: this.project.projectId,
                        projectName: this.project.projectName,
                        projectDes: this.project.projectDes,
                        isPublic: this.project.isPublic,
                        projectCover: this.project.projectCover,
                        startTime: this.project.startTime,
                        endTime: this.project.endTime,
                        projectDel: this.project.projectDel,
                        projectStatus: this.project.projectStatus,
                        projectSchedule: this.project.projectSchedule
                    };
                    updateProject(data).then(res => {
                        this.$Message.destroy();
                        if (res.result == 1) {
                            this.$Message.success("保存成功!");
                            this.updatePro(res.data);
                        } else {
                            this.$Message.error("保存失败!");
                        }
                        resolve();
                    });
                });
            },

            // 选择公开性
            priorityChange(data) {
                this.project.isPublic = data;
            },
            // 点击保存按钮
            saveSet() {
                this.publishAxios().then(res => {});
            },
            okGuidang() {
                this.project.projectStatus = 1;
                this.publishAxios().then(res => {
                    this.modal1 = false;
                });
            },
            okHuishou() {
                recycleProject(this.project.projectId).then(res => {
                    if (res.result === 1) {
                        this.modal2 = false;
                        this.$emit("closesettings", false);
                        this.$Message.success("成功!");
                    } else {
                        this.$Message.error("失败!");
                    }

                });
                // this.project.projectDel = 1;
                // this.publishAxios().then(res => {
                //   this.modal2 = false;
                // });
                // if(this.$route.params.groupId){
                //   this.$router.push("/home");
                // } else{
                //     this.$emit('close-settings', false);
                // }
            },
            // 修改 规则 名称
            changeRuleName(item) {
                item.isEdit = false;
                ruleName(item.id, item.name).then(res => {
                    if (res.result) {
                        this.$Message.success("操作成功");
                    }
                });
            },
            getRuleList() {
                this.createRule = false;
                getAllRule(this.project.projectId).then(res => {
                    if (res.result) {
                        this.ruleList = res.data;
                        this.ruleList.map(v => {
                            this.$set(v, "isEdit", false);
                        });
                    }
                });
            },
            // 删除自动化规则
            deleteRule(item) {
                deleteRule(item.id).then(res => {
                    if (res.result) {
                        this.$Message.success("删除成功");
                        this.ruleList.forEach((i, n) => {
                            if (i.id === item.id) {
                                this.ruleList.splice(n, 1);
                            }
                        });
                    }
                });
            },
            // 点击规则进入 编辑规则页面
            clickRule(item) {
                editRule(item.id).then(res => {
                    this.ruleData = res.data;
                    this.createRule = true;
                });
            },
            //移除项目成员
            remove() {
                this.visible = false;
                removeUser(this.project.projectId, localStorage.userId).then(res => {
                    if (res.result === 1) {
                        this.modal3 = false;
                        this.$emit("signOut", false);
                        this.$Message.success("成功!");
                    } else {
                        this.$Notice.warning({
                            title: "移除失败"
                        });
                    }
                });
            },
            addRule() {
                this.ruleData = null;
                this.createRule = true;
            },
            change(status) {
                this.$Message.info('开关状态：' + status);
            }
        }
    };
</script>
<style scoped lang="less">
    .title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 0;
        border-bottom: 1px solid #e5e5e5;
    }

    .div1-title {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .doBtn {
        padding: 15px 0;

        button {
            display: block;
            width: 90%;
            margin: 0 auto;
            font-size: 14px;
        }
    }

    .mt15 {
        margin-top: 15px;
    }

    .tabPage {
        height: 500px;

        .tabs {
            height: 100%;

            ul {
                height: 100%;
                border-right: 1px solid #e5e5e5;

                li {
                    width: 179px;
                    line-height: 50px;
                    /* border-bottom: 1px solid #e5e5e5; */
                    border-left: 4px solid transparent;
                    color: #333333;
                    font-size: 14px;
                    /* padding-left: 15px; */
                    cursor: pointer;
                    box-sizing: border-box;
                    text-align: center;

                    &:hover {
                        color: #3da8f5;
                    }

                    i {
                        font-size: 20px;
                        margin-right: 10px;
                    }
                }
            }

            .tabactive {
                border-right: 2px solid #3da8f5;
                background: #F2FBFF;
            }
        }

        .content {
            height: 100%;
            width: calc(100% - 180px);

            .div1 {
                padding: 0 15px;
                height: 100%;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 6px;
                    height: 8px;
                    background-color: #e5e5e5;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: #cecece;
                }

                .owner {
                    img {
                        display: inline-block;
                        height: 32px;
                        width: 32px;
                        border-radius: 50%;
                        margin-right: 14px;
                        vertical-align: middle;
                    }

                    span {
                        font-size: 14px;
                    }
                }

                .giveBtn {
                    padding: 6px 20px;
                    font-size: 14px;
                    border-color: #3da8f5;
                    color: #3da8f5;
                    margin-right: 20px;
                }

                .save {
                    padding: 20px 0;
                    border-top: 1px solid #e5e5e5;
                    margin-top: 20px;

                    button {
                        float: right;
                        margin-right: 20px;
                        font-size: 14px;
                        padding: 6px 24px;
                    }
                }

                .div1-box {
                    margin-top: 20px;

                    .inputContent {
                        width: 49%;

                        .ivu-date-picker {
                            width: 100%;
                        }
                    }

                    .preTitle {
                        color: #333333;
                        font-size: 16px;
                        margin-bottom: 8px;
                    }

                    .preTitledes {
                        color: #999999;
                        font-size: 12px;
                        /* margin-bottom: 19px; */
                    }

                    .line {
                        width: 100%;
                        height: 1px;
                        background: #D8D8D8;
                        margin: 16px 0;
                    }

                    .saveid-btn {
                        margin-left: 8px;
                    }
                }

                .cover {
                    border-radius: 4px;
                    width: 200px;
                    height: 100px;

                    img {
                        display: block;
                        border-radius: 4px;
                        width: 200px;
                        height: 100px;
                    }
                }

                .upload {
                    position: relative;
                    margin-left: 20px;

                    input {
                        display: block;
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }

                    .upLoadButton {
                        width: 150px;
                        height: 40px;
                        padding: 6px 0;
                        font-size: 14px;
                        text-align: center;
                        color: #ffffff;
                        background: #2db7f5;
                    }

                    .tips {
                        font-size: 12px;
                        color: #999999;
                        margin-top: 3px;
                    }
                }
            }
        }
    }

    .div2,
    .div3 {
        padding: 0 15px;
        height: 100%;
        overflow-y: auto;
    }

    .div3-box {
        margin-top: 20px;

        p {
            margin-bottom: 20px;
            font-size: 14px;
            color: #a6a6a6;
        }

        .btns {
            button {
                font-size: 14px;
                margin-right: 20px;
                padding: 6px 18px;
            }
        }
    }

    .div4 {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 6px;
            height: 8px;
            background-color: #e5e5e5;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #cecece;
        }

        .rule-list-wrap {
            width: 100%;

            .rule-list {
                width: 100%;
                height: 56px;
                padding-left: 20px;

                &:hover {
                    background-color: #f7f7f7;
                }

                .rule-con {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #d7d7d7;
                    cursor: pointer;

                    &:hover {
                        .icon-box {
                            display: flex;
                        }
                    }

                    .change-name {
                        width: 400px;
                        border: 0 none;
                        background-color: #a6a6a6;
                    }

                    .rule-name {
                        width: 500px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .icon-box {
                        display: none;
                        flex: none;
                        color: gray;
                        font-size: 16px;

                        div {
                            margin-right: 15px;
                        }
                    }
                }
            }

            .createdBtn {
                width: 104px;
                line-height: 38px;
                text-align: center;
                border-radius: 4px;
                background-color: #2cb7f5;
                color: #ffffff;
                margin-left: 20px;
                margin-top: 20px;
            }

            .noList {
                margin-top: 10%;

                img {
                    display: block;
                    width: 135px;
                    height: 90px;
                    margin: 8px auto 16px;
                }

                p {
                    text-align: center;
                    color: #333333;
                }
            }
        }
    }

    .df {
        display: flex;
    }

    .jsb {
        justify-content: space-between;
    }
</style>