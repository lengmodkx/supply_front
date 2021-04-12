<template>
    <div class="personal-box">
        <div class="loading" v-if="loading">
            <Loading></Loading>
        </div>
        <div class="personal">
            <div class="personal-left">
                <div class="titel">
                    <img :src="`${message.defaultImage}`" alt="" v-if="pic_show" accept="image/*">
                    <img :src="imageUrl" alt v-if="pic_hide" accept="image/*">
                    <span>{{message.userName}}</span>
                </div>
                <ul>
                    <li :class="activeClass == index ? 'active':''" v-for="(item,index) in itemList" :key="index"
                        @click="getItem(index,item)">
                        {{item}}</li>
                </ul>
            </div>
            <div class="personal-right" v-show="activeItem=='个人信息'">
                <div class="title">
                    <div>个人信息</div>
                    <div class="line"></div>
                </div>
                <div class="information">
                    <Form :model="message" ref="message" :label-width="80">
                        <FormItem label="头像">
                            <div class="head">
                                <img alt="" :src="`${message.defaultImage}`" v-if="pic_show" accept="image/*">
                                <img :src="imageUrl" alt v-if="pic_hide" accept="image/*">
                                <div class="chang-head">
                                    <!-- <input type="file" ref="inputer" @change="getFile">
                                    <Button class="upLoadButton">更换头像</Button> -->
                                    <Upload :show-upload-list="false" :max-size="2048" :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload" :action="host" :data="uploadData"
                                        :headers="headers" :on-success="handleSuccess">
                                        <Button type="primary" ghost>更换头像</Button>
                                    </Upload>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="姓名">
                            <Input v-model="message.userName" placeholder="请输入姓名"></Input>
                        </FormItem>
                        <FormItem label="昵称">
                            <Input v-model="message.nickName" placeholder="请输入昵称"></Input>
                        </FormItem>
                        <FormItem label="职位">
                            <Input v-model="message.job" placeholder="请输入职位"></Input>
                        </FormItem>
                        <FormItem label="联系电话">
                            <Input v-model="message.telephone" placeholder="请输入联系电话"></Input>
                        </FormItem>
                        <FormItem label="生日">
                            <DatePicker type="date" placeholder="请输入生日" v-model="message.birthday"></DatePicker>
                        </FormItem>
                        <FormItem label="所在地">
                            <Input v-model="message.address" placeholder="请输入所在地"></Input>
                        </FormItem>
                        <FormItem label="邮箱">
                            <Input v-model="message.email" placeholder="请输入邮箱" /></Input>
                        </FormItem>
                        <FormItem label="个性签名">
                            <Input v-model="message.signature" placeholder="请输入签名" /></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit()" class="saveBtn">保存</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="personal-right" v-show="activeItem=='第三方账号'">
                <div class="title">
                    <div>第三方帐号</div>
                    <div class="line"></div>
                </div>
                <div class="divide">
                    <img src="../../assets/images/weixin.png" alt="">
                    <Button type="primary" ghost @click="bind()"
                        v-if="message.wxOpenId==''||message.wxOpenId==null">绑定</Button>
                    <Button type="error" ghost v-else @click="notBind()">解除绑定</Button>
                </div>
            </div>
            <div class="personal-right" v-show="activeItem=='账号密码'" style="background:#F0EFEC; ">
                <div class="title" style="background: #ffffff;">
                    <div>账号密码</div>
                    <div class="titTips">所有登录帐号都可用于登录，主邮箱帐号可收取通知。</div>
                    <div class="line"></div>
                </div>
                <div class="information" style="background: #ffffff;">
                    <div class="account-content">
                        <div class="textContent">邮箱账号</div>
                        <Input v-model="emailAddress" placeholder="请输入邮箱地址"></Input>
                        <Button type="primary" class="saveBtn" @click="bindMailbox">确认绑定</Button>
                    </div>
                    <div class="account-content">
                        <div class="textContent">手机账号</div>
                        <div class="userPhone">{{message.telephone}}</div>
                        <Button type="error" ghost @click="unbundling" v-if='message.telephone'>解除绑定</Button>
                        <div class="userPhone" v-else>暂未绑定</div>
                    </div>

                </div>
                <div class="title2" style="background: #ffffff;">更改密码</div>
                <div class="information" style="background: #ffffff;">
                    <Form :model="password" ref="password" :rules="rulesPassword" :label-width="80">
                        <FormItem label="原密码" prop="old">
                            <Input v-model="password.old" type="password" placeholder="请输入原密码"></Input>
                        </FormItem>
                        <FormItem label="新密码" prop="new">
                            <Input v-model="password.new" type="password" placeholder="请输入新密码"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="moreNew">
                            <Input v-model="password.moreNew" type="password" placeholder="请输入新密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="submitPassword('password')"
                                style="background-color: rgba(44, 183, 245, 1);border-color: #2CB7F5;">确认</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="personal-right" v-show="activeItem=='加入企业'">
                <div class="title">
                    <div>加入企业</div>
                    <div class="line"></div>
                </div>
                <div class="divide" v-for="(item, index) in companyList" :key="index">
                    <div> {{ item.organizationName }}</div>
                    <Button type="primary" ghost @click="goBackstage(item)"
                        v-if="item.organizationLabel==1">前往后台</Button>
                    <Button type="error" ghost v-else @click="modal3=true,companyId=item.organizationId">退出企业</Button>
                </div>
            </div>

        </div>
        <Modal class="confirmModal" v-model="modal3" title="退出企业" footer-hide>
            <p style="padding:10px;font-size:15px;">
                确定退出企业吗？
            </p>
            <div class="doBtn">
                <Button type="error" @click="signOut">确定退出</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {
        findUserInfo,
        updateUserNews,
        weChatLogin,
        bindWx,
        notBindWx,
        changePassword,
        changeOrganization,
        removeOrgUser,
        notBindPhone
    } from '@/axios/api';
    import {
        getAllOrg
    } from '@/axios/companyApi'
    import {
        mapState,
        mapActions,
        mapMutations
    } from "vuex";
    import {
        oss
    } from "@/axios/ossweb";
    export default {
        data: function () {
            return {
                password: {
                    old: '',
                    new: '',
                    moreNew: ''
                },
                //验证
                rulesPassword: {
                    old: [{
                        required: true,
                        message: "请输入旧密码",
                        trigger: "blur"
                    }],
                    new: [{
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    }],
                    moreNew: [{
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    }],
                },
                loading: true,
                imageUrl: "",
                filename: "",
                fileName: "",
                dirName: "upload/avatar/",
                pic_show: true,
                pic_hide: false,
                activeClass: 0,
                activeItem: '个人信息',
                itemList: ["个人信息", "账号密码", "第三方账号", "加入企业"],
                message: {
                    userId: localStorage.userId,
                    defaultImage: '',
                    userName: '',
                    job: '',
                    accountName: '',
                    birthday: '',
                    address: '',
                    email: '',
                    wxOpenId: '',
                    nickName: ''
                },
                userId: localStorage.userId,
                yearList: [],
                monthList: [],
                dayList: [],
                //验证
                rules: {
                    accountName: [{
                        required: false,
                        validator: validatePhone,
                        trigger: 'blur'
                    }],
                    email: [{
                        required: false,
                        validator: validateEmail,
                        trigger: 'blur'
                    }],
                },
                emailAddress: '', //邮箱地址    
                modal3: false,
                companyId: '',
                uploadData: {},
                host: "",
                headers: {
                    "x-auth-token": localStorage.token
                },
                name: ""
            }
        },
        computed: {
            ...mapState("company", ["companyList"]),
        },
        methods: {
            ...mapActions("user", ["initSrc", "defaultImage"]),
            ...mapActions("company", ["initCompany"]),

            // 确认密码
            submitPassword(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.savePassword();

                    } else {
                        this.$Message.error('填写不正确');
                    }
                })
            },
            savePassword() {
                changePassword(this.password.old, this.password.new).then(res => {
                    if (res.result == 1) {
                        this.$Message.success("修改密码成功");
                        this.password.old = ''
                        this.password.new = ''
                        this.password.moreNew = ''

                    }
                })
            },
            bind() {
                weChatLogin("https://work.aldbim.com/personal").then(res => {
                    if (res.result === 1) {
                        window.location.href = res.data
                    }
                })
            },
            notBind() {
                notBindWx(this.message.userId).then(res => {
                    if (res.result == 1) {
                        this.message.wxOpenId = ''
                        this.$Message.success(res.msg);
                    }
                })
            },
            getItem(index, item) {
                this.activeClass = index; // 把当前点击元素的index，赋值给activeClass
                this.activeItem = item
            },
            resetFile() {
                this.showupload = true;
                this.showProgress = false;
                this.uploadList = [];
                this.percentage = [];
            },
            handleBeforeUpload(file) {
                let dir = ''
                dir = "upload/personal/" + this.$moment().format('YYYY-MM-DD') + "/";
                return oss(dir, file.name).then(res => {
                    this.host = res.host;
                    this.uploadData = res;
                    this.name = res.host + '/' + res.key
                });

            },
            handleSuccess() {
                let data = {
                    userId: localStorage.userId,
                    image: this.name,
                }
                //保存
                updateUserNews(data).then(res => {
                    if (res.result == 1) {
                        this.message.defaultImage = this.name
                        this.imageUrl = this.name
                        localStorage.userImg = this.message.defaultImage;
                        this.initSrc(this.message.defaultImage);
                        this.$Message.success(res.msg);
                    }else {
                        this.$Message.error(res.msg);
                    }
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "超过文件大小限制",
                    desc: "文件  " + file.name + " 过大, 超过2M.",
                });
            },
            handleSubmit() {
                if (this.message.accountName != null && this.message.accountName != "") {
                    if (!/^1[345789]\d{9}$/.test(this.message.accountName)) {
                        this.$Message.error('手机号格式不正确');
                        return;
                    }
                }

                if (this.message.email != null && this.message.email != "") {
                    if (!/^.*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.message.email)) {
                        this.$Message.error('邮箱格式不正确');
                        return;
                    }
                }
                if (this.message.nickName == '') {
                    this.$Message.error('请输入昵称');
                    return;
                }
                this.save();
            },
            save() {
                var that = this;
                if (this.message.birthday != null && this.message.birthday != "") {
                    var dataEE = new Date(this.message.birthday).toJSON();
                    var birthDay = new Date(new Date(dataEE).getTime() + 8 * 3600 * 1000).toISOString().replace(/T/g,
                        ' ').replace(/\.[\d]{3}Z/, '');
                }

                let data = {
                    userId: localStorage.userId,
                    image: this.message.defaultImage,
                    userName: this.message.userName,
                    job: this.message.job,
                    telephone: this.message.telephone,
                    birthday: birthDay,
                    address: this.message.address,
                    email: this.message.email,
                    signature: this.message.signature,
                    nickname:this.message.nickName
                }
                //保存
                updateUserNews(data).then(res => {
                    if (res.result == 1) {
                        this.$Message.info(res.msg);
                    } else {
                        this.$Message.warning(res.msg);
                    }
                });

            },
            info() {
                findUserInfo(this.message.userId).then(res => {
                    //获取信息
                    if (res.result == 1) {
                        this.loading = false;
                        this.message = res.data;
                    }
                })
            },
            
            //验证邮箱
            verifyMailbox(email) {
                var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                return reg.test(email);
            },
            bindMailbox() {
                if (this.verifyMailbox(this.emailAddress)) {
                    let data = {
                        userId: localStorage.userId,
                        email: this.emailAddress,
                    }
                    //保存
                    updateUserNews(data).then(res => {
                        if (res.result == 1) {
                            this.$Message.info(res.msg);
                            this.emailAddress = ''
                        }
                    });
                } else {
                    this.$Message.error('邮箱格式不正确');
                }
            },
            goBackstage(item) {
                localStorage.companyId = item.organizationId;
                changeOrganization(item.organizationId).then(res => {
                    if (res.result == 1) {
                        this.$router.push('/systemSettings')
                    }
                });
            },
            signOut() {
                removeOrgUser(localStorage.userId, this.companyId, localStorage.userId).then(res => {
                    if (res.result === 1) {
                        this.modal3 = false
                        this.$Message.success('退出成功');
                        this.initCompany();
                    } else {
                        this.$Notice.warning({
                            title: "退出失败"
                        });
                    }
                });
            },
            unbundling() {
                notBindPhone().then(res => {
                    if (res.result == 1) {
                        this.$Message.success('解绑成功');
                        this.info();
                    }
                })
            }
        },
        beforeRouteEnter(to, from, next) {
            console.log("to====from",to,from);
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            var code = theRequest.code
            next(vm => {
                if(code){
                    bindWx(code, this.userId).then(res => {
                        if (res.result == 1) {
                            this.$Message.success(res.msg);
                        }
                    })
                }
            })
        },
        created() {
            this.info();
            this.initCompany();
        }
    }
    const validatePhone = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('请输入手机号'));
        } else if (!/^1[345789]\d{9}$/.test(value)) {
            callback('手机号格式不正确');
        } else {
            callback();
        }
    }
    const validateEmail = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('请输入邮箱'));
        } else if (!/^.*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
            callback('邮箱格式不正确');
        } else {
            callback();
        }
    }
</script>
<style scoped lang="less">
    .personal-box {
        padding: 15px;

        .ivu-input-icon {
            margin-top: -5px;
        }

        color: #333333;
        flex: 1;
        min-height: 100%;
        background-color: #f0efec;
        overflow: auto;

        .personal {
            height: auto;
            margin: 0px auto;
            display: flex;
            justify-content: space-between;
        }

        .personal-left {
            width: 240px;
            height: auto;
            background: #ffffff;

            .titel {
                width: 100%;
                height: 60px;
                background: #ffffff;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #d5d5d5;
                padding-left: 26px;

                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 28px;
                }

                span {
                    padding: 10px;
                    font-size: 16px;
                }
            }

            ul {
                padding-top: 12px;
                background: #ffffff;

                li {
                    cursor: pointer;
                    background: #ffffff;
                    font-size: 14px;
                    line-height: 38px;
                    padding-left: 26px;
                }

                :hover {
                    background: #f2fbff;
                }

                .active {
                    background: #f2fbff;
                }
            }
        }

        .personal-right {
            flex: 1;
            min-height: 120px;
            background: #ffffff;
            /* padding: 20px; */

            .title {
                border-bottom: 1px solid #d5d5d5;
                padding: 0 30px;
                position: relative;
                /* margin-bottom: 34px; */
                display: flex;
                height: 60px;
                align-items: center;

                .line {
                    width: 56px;
                    height: 2px;
                    background: #2b85e4;
                    position: absolute;
                    bottom: 0;
                }

                .titTips {
                    font-size: 12px;
                    color: #999999;
                    margin-left: 24px;
                }
            }

            .title2 {
                margin-top: 20px;
                padding: 0 30px;
                position: relative;
                display: flex;
                height: 60px;
                align-items: center;
            }

            .information {
                padding: 20px 33px;

                h4 {
                    display: block;
                    text-align: right;
                    float: left;
                    font-size: 12px;
                    color: #515a6e;
                    line-height: 1;
                    padding: 10px 12px 10px 0;
                    box-sizing: border-box;
                    font-weight: 350px !important;
                    width: 80px;
                }

                .head {
                    display: flex;

                    // margin-bottom: 40px;
                    h4 {
                        padding-top: 20px;
                    }

                    img {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                    }

                    .chang-head {
                        width: 88px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        margin: 30px;
                        position: relative;

                        &:hover {
                            .upLoadButton {
                                background: #3da8f5;
                                color: #fff;
                                border-radius: 4px;
                            }
                        }

                        .upLoadButton {
                            color: #3da8f5;
                            width: 88px;
                            height: 30px;
                            background: #ffffff;
                            border-radius: 4px;
                            border: none;
                            border: 1px solid #3da8f5;
                        }

                        input {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 88px;
                            height: 32px;
                            opacity: 0;
                        }
                    }
                }

                ul li {
                    display: flex;
                    margin-bottom: 20px;
                }

                .ivu-input {
                    border: 1px solid #d9d9d9 !important;
                }

                .saveBtn {
                    width: 148px;
                    background-color: rgba(44, 183, 245, 1);
                    border-color: #2cb7f5;
                }

                .account-content {
                    display: flex;
                    align-items: center;
                    margin-bottom: 30px;

                    .textContent {
                        text-align: right;
                        vertical-align: middle;
                        /* float: left; */
                        font-size: 14px;
                        color: #515a6e;
                        line-height: 1;
                        padding: 10px 12px 10px 0;
                        box-sizing: border-box;
                        width: 80px;
                    }

                    .userPhone {
                        margin-right: 20px;
                    }

                    .ivu-input-wrapper {
                        width: 300px;
                        margin-right: 20px;
                    }
                }
            }
        }
    }

    .personal-box::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
    }

    .personal-box::-webkit-scrollbar-thumb {
        background-color: #cecece;
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

    .divide {
        border-bottom: 1px solid #d5d5d5;
        margin: 0 25px;
        padding: 14px 0;

        img {
            width: 30px;
            height: 30px;
        }

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>