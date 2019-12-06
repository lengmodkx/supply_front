<template>
    <div class="personal-box">
        <div class="loading" v-if="loading"><Loading ></Loading></div>
       <div class="personal">
            <div class="personal-left">
                <div class="titel">
                    <img  :src="`${message.defaultImage}`"  alt="" v-if="pic_show" accept="image/*">
                    <img :src="imageUrl" alt v-if="pic_hide" accept="image/*">
                    <span>{{message.userName}}</span>    
                </div>
                <ul>
                    <li :class="activeClass == index ? 'active':''" 
                    v-for="(item,index) in itemList" :key="index" @click="getItem(index,item)">
                    {{item}}</li>
                </ul>
            </div>
            <div class="personal-right" v-show="activeItem=='个人信息'">
                <div class="title">个人信息</div>
                <div class="information">
                    <Form  :model="message" :rules="rules" ref="message" :label-width="80" >	
                    <FormItem label="头像">
                        <div class="head">
                            <img alt="" :src="`${message.defaultImage}`"   v-if="pic_show" accept="image/*">
                            <img :src="imageUrl" alt v-if="pic_hide" accept="image/*">
                            <div  class="chang-head" >
                                <input type="file" ref="inputer" @change="getFile">
                                <Button class="upLoadButton" >更换头像</Button>
                            </div>
                        </div>    
                    </FormItem>               
                        <FormItem label="姓名" prop="userName">
                        <Input v-model="message.userName" placeholder="请输入姓名"></Input>
                        </FormItem>
                        <FormItem label="职位" prop="job">
                        <Input v-model="message.job" placeholder="请输入职位"></Input>
                        </FormItem>
                        <FormItem label="联系电话" prop="telephone">
                        <Input v-model="message.telephone" placeholder="请输入联系电话"></Input>
                        </FormItem>
                        <FormItem  label="生日" prop="birthday">
                        <DatePicker type="date" placeholder="请输入生日" v-model="message.birthday"></DatePicker>
                    </FormItem>
                        <FormItem label="所在地" prop="address">
                        <Input v-model="message.address" placeholder="请输入所在地"></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="email">
                        <Input v-model="message.email" placeholder="请输入邮箱"/></Input>
                        </FormItem>
                        <FormItem>
                        <Button   type="primary" @click="handleSubmit('message')">保存</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="personal-right" v-show="activeItem=='第三方账号'">
                <div class="title">第三方帐号</div>
                <div class="divide">
                    <img src="../../assets/images/weixin.png" alt="">
                    <Button type="primary" ghost  @click="weChatLogin()">去绑定</Button>
                </div>
            </div>
       </div>
    </div>
</template>
<script>
import {findUserInfo,updateUserNews,weChatLogin} from '@/axios/api';
import { mapState, mapActions, mapMutations } from "vuex";
import OSS from "ali-oss";
let client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: "LTAIP4MyTAbONGJx",
    accessKeySecret: "coCyCStZwTPbfu93a3Ax0WiVg3D4EW",
    bucket: "art1001-bim-5d"
});
export default {
    data: function () {
        return {
            loading: true,
            imageUrl: "",
            filename:"",
            fileName:"",
            dirName: "upload/avatar/",
            pic_show:true,
            pic_hide:false,
            activeClass:0,
            activeItem:'个人信息',
            itemList:["个人信息","第三方账号"],
            message:{
                userId:localStorage.userId,
                defaultImage:'',
                userName:'',
                job:'',
                telephone:'',
                birthday:'',
                address:'',
                email:'',
                wx_openId:''
            },
            yearList:[],
            monthList:[],
            dayList:[],
            //验证
            rules: {
                telephone: [
                    { validator:validatePhone, trigger: 'blur' }
                ],
                email: [
                    { validator:validateEmail,   trigger: 'blur' }
                ],
            },
        }
    },
    components: {},
    methods: {
        ...mapActions("user", [ "initSrc"]),
        weChatLogin(){
            weChatLogin("https://www.aldbim.com/personal").then(res => {
                if(res.result === 1){
                    window.location.href=res.url
                }
            })
        },
        getItem(index,item) {
            this.activeClass = index;  // 把当前点击元素的index，赋值给activeClass
            this.activeItem = item
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
        resetFile() {
            this.showupload = true;
            this.showProgress = false;
            this.uploadList = [];
            this.percentage = [];
        },
        getFile(event) {
            const files = event.target.files
            this.filename = files[0].name          //只有一个文件
            if (this.filename.lastIndexOf('.') <= 0) {
                return alert("Please add a valid image!")        //判断图片是否有效
            }
            const fileReader = new FileReader()                //内置方法new FileReader()   读取文件
            fileReader.addEventListener('load', () => {
                this.pic_show = false,
                this.pic_hide = true,
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
            //到这里后, 选择图片就可以显示出来了
            this.fileName = this.dirName + this.random_string(10) + this.get_suffix(this.filename);
            if(this.filename){
                this.message.defaultImage="https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/"+this.fileName
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.save();
                } else {
                    this.$Message.error('请填完整写个人信息');
                }
            })
        },
        save(){
            var that = this;
            if(this.pic_hide==true){
                    client.multipartUpload(this.fileName, this.image, {
                        progress: function(p) {
                        }
                    }).then(function(result){
                        console.log(result)
                    })
            }
            var dataEE=new Date(this.message.birthday).toJSON();
            var birthDay = new Date(+new Date(dataEE)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
            let data={
                userId:localStorage.userId,
                image:this.message.defaultImage,
                userName:this.message.userName,
                job:this.message.job,
                telephone:this.message.telephone,
                birthday:birthDay,
                address:this.message.address,
                email:this.message.email,
            }
            //保存
            updateUserNews(data).then(res=>{
                if(res.result==1){
                    this.$Message.info(res.msg);
                    localStorage.userImg=this.message.defaultImage
                }
            }).then(res=>{
                this.initSrc().then(res=>{

                })
            })
            
        },
        info(){
            findUserInfo(this.message.userId).then(res=>{
                //获取信息
                if(res.result==1){
                    this.loading=false;
                    this.message=res.data;
                }
            })
        }
    },
    created(){
        this.info();
    }
}
const validatePhone = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入手机号'));
    } else if (!/^1[34578]\d{9}$/.test(value)) {
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
<style socped lang="less">
.ivu-input-icon{
    margin-top:-5px;
}
.personal-box{
    width: 100%;
    min-height: 100vh;
    padding-top: 50px;
    background-color: #F0EFEC;
    .personal{
        width: 980px;
        padding:20px;
        height: auto;
        margin:0px auto;
        display: flex;
        justify-content: space-between;
    }
    .personal-left{
        width:300px;
        .titel{
            width: 100%;
            height: 100px;
            background: #ffffff;
            display: flex;
            padding:20px;
            margin-bottom: 20px;
            img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
            span{
                padding:10px;
                font-size: 16px;
                font-weight: bold;
            }
        }
        ul{
            li{
                cursor: pointer;
                padding:20px;
                background: #ffffff;
                border-bottom: 1px solid #F0EFEC;
                font-size:14px;
            }
            :hover{
                background: #fdfdfd;
            }
            .active{
                font-weight: bold
            }
        }
        
    }
    .personal-right{
        width:620px;
        min-height: 120px;
        background: #ffffff;
        padding:20px;
        .title{
            font-size: 16px; 
            font-weight: bold
        }
        .information{
            padding: 20px 0;
            h4{  
                display: block;
                text-align: right;
                float: left;
                font-size: 12px;
                color: #515a6e;
                line-height: 1;
                padding: 10px 12px 10px 0;
                box-sizing: border-box;
                font-weight: 350px !important;
                width:80px;
            }
            .head{
                display: flex;
                // margin-bottom: 40px;   
                h4{
                    padding-top:20px;
                }             
                img{
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                }
                .chang-head{
                    width: 88px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    margin:30px;
                    position: relative;      
                    &:hover {
                        .upLoadButton{
                            background: #3da8f5;
                            color: #fff;
                            border-radius: 4px;
                        }
                    }
                    .upLoadButton{
                        color: #3DA8F5;
                        width: 88px;
                        height: 30px;
                        background: #ffffff;
                        border-radius: 4px;
                        border: none;
                        border:1px solid #3DA8F5;
                        
                    }
                    input{
                        position: absolute;
                        left: 0;
                        top:0;
                        width: 88px;
                        height: 32px;
                        opacity: 0
                    }     
                }
            }
            ul li{
                    display: flex;
                    margin-bottom: 20px;    
            }
            .ivu-input{
                border:1px solid #d9d9d9 !important;
            }
        }
        
    }
}   
.divide{
    border-top: 1px solid #e5e5e5;
    height: 50px;
    img{
        width: 30px;
        height: 30px;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>