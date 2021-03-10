<template>
    <div class="wrap-div">
        <div class="base-info-box">
            <header>基本信息</header>
            <div class="base-info">
                <p class="little-title">企业头像</p>
                <div class="awart-box">
                    <img alt="" :src="img"   v-if="pic_show" accept="image/*">
                    <img :src="img" alt v-if="pic_hide" accept="image/*">
                    <input type="file"
                           ref="fileInput"
                           accept="image/*"
                           style="display: none"
                           @change="getFile">
                    <Button class="upLoadButton" @click="onPickFile">更换头像</Button>
                </div>
                <p class="little-title">企业名称</p>
                <Input v-model="orgName" style="width: 420px;margin-bottom: 15px" />
                 <p class="little-title">企业规模</p>
                <Select class="selectBox" v-model="selectmodel1" placeholder="企业规模" style="width: 420px;margin-bottom: 15px" >
                    <Option v-for="item in sizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p class="little-title">企业简介</p>
                <Input v-model="orgDes" type="textarea" :rows="3" placeholder="介绍一下这个企业" style="width: 420px;margin-bottom: 15px" />
                <p class="little-title">企业公开性</p>

                <Select v-model="orgPublick" style="width:420px">
                    <Option value="1">公开企业（访客可以查看企业中的公开项目和成员）</Option>
                    <Option value="0">私有企业（仅企业成员可见）</Option>
                </Select>
                <div>
                    <Button type="primary" style="margin-top: 15px" @click="saveOrg">确定</Button>
                </div>
            </div>
        </div>
        <div class="more-operate">
            <header>更多操作</header>
            <div class="org-vest">
                <div class="little-title">企业归属</div>
                <div class="org-vest-con">
                    <div class="org-vest-con-left">
                        <img :src="userImg" alt="">
                        <span>{{contact}}</span>
                    </div>
                    <Button type="primary" ghost @click="getTransfer()">移交</Button>
                </div>
            </div>
            <div class="delete-org">
                <div class="little-title">删除企业</div>
                <p>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容等都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</p>
                <Button type="error" @click="showDel=true" >删除企业</Button>
            </div>
        </div>
         <Modal v-model="showTransfer" class="transfer" title="移交企业"  :width="500" transfer footer-hide>
               <span>选择一个企业成员作为新的企业拥有者，移交后你的角色将变为成员</span>
               <Select v-model="transferId"  clearable style="width:470px;margin-bottom:20px">
                         <Option v-for="item in transferList" :value="item.userId" :key="item.userId">{{item.userName }}</Option>
              </Select>
              <Button type="error" long @click="surTransfer">确认移交</Button>
         </Modal>
         <Modal v-model="showDel" class="transfer" title="删除企业"  :width="500" transfer footer-hide>
               <span>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容等都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</span>
               <Button type="error" long  @click="sureDel">确认删除</Button>
         </Modal> 
    </div>
</template>

<script>
import { orgInfo , updateOrg, delOrg,getAllTransfer,postTransfer} from '../axios/api'

export default {
    name: "enterpriseInformation",
    data () {
        return {
            orgId: localStorage.companyId,
             selectmodel1: "",
             sizeList: [
                {
                value: "1-10人",
                label: "1-10人"
                },
                {
                value: "10-50人",
                label: "10-50人"
                },
                {
                value: "50-100人",
                label: "50-100人"
                },
                {
                value: "100-300人",
                label: "100-300人"
                },
                {
                value: "300-1000人",
                label: "300-1000人"
                },
                {
                value: "1000人以上",
                label: "1000人以上"
                }
            ],
            img: '',
            userImg:'',
            postUrl: "",
            pic_show:true,
            pic_hide:false,
            orgName: '',
            orgDes: '',
            orgPublick: '0',
            contact:'',
            ownerId:'',//拥有者id
            //删除
            showDel:false,
            //移交
            showTransfer:false,
            transferId:'',
            transferList: []
        }
    },
    mounted(){
        this.getOrgInfo()
    },
    methods:{
        get_suffix(filename) {
            var pos = filename.lastIndexOf(".");
            var suffix = "";
            if (pos !== -1) {
                suffix = filename.substring(pos);
            }
            return suffix;
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
        onPickFile () {
            this.$refs.fileInput.click()
        },
        getFile(event) {
            var that = this;
            const files = event.target.files
            this.filename = files[0].name          //只有一个文件
            if (this.filename.lastIndexOf('.') <= 0) {
                return alert("Please add a valid image!")        //判断图片是否有效
            }
            const fileReader = new FileReader()                //内置方法new FileReader()   读取文件
            fileReader.addEventListener('load', () => {
                this.pic_show = false,
                    this.pic_hide = true,
                    this.img = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.image = files[0]
            //到这里后, 选择图片就可以显示出来了
            this.fileName = this.dirName + this.random_string(10) + this.get_suffix(this.filename);

            if(this.filename){
                client.multipartUpload("/orgImg/"+this.fileName, this.image, {
                    progress: function(p) {
                    }
                }).then(function(result){
                })
            }
            let params = {
                orgImg:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/orgImg/"+this.fileName,
            }
            updateOrg(localStorage.companyId,params).then(res=>{
                if(res.result === 1){
                    this.$Message.success('修改成功');
                }else{
                    this.$Message.eror('修改失败');
                }
            })
        },
        getOrgInfo(){
            orgInfo(localStorage.companyId).then(res=>{
                console.log(res)
                if(res.result==1){
                    this.img = res.data.organizationImage
                    this.orgName = res.data.organizationName
                    this.selectmodel1=res.data.organizationDes
                    this.orgDes = res.data.organizationIntro
                    this.orgPublick = res.data.isPublic+""
                    this.contact = res.data.contact
                    this.ownerId=res.data.organizationMember
                    this.userImg=res.data.userImg
                }
            })
        },
        //移交
        surTransfer(){
                postTransfer(localStorage.companyId,this.ownerId,this.transferId).then(res=>{
                        if(res.result==1){
                            this.$Message.success('移交成功');
                            this.$router.push('/')
                        }else{
                            this.$Message.error('移交失败');
                            console.log(res.msg)
                        }
               })
        },
        //获取移交成员
        getTransfer(){
            this.showTransfer=true
                getAllTransfer(localStorage.companyId).then(res=>{
                        if(res.result==1){
                        
                            this.transferList=res.data
                        }else{
                            this.$Message.error(res.msg);
                            console.log(res.msg)
                        }
               })
        },
        //删除企业
        sureDel(){
             this.showDel=false;
             
             delOrg(localStorage.companyId).then(res=>{
                if(res.result==1){
                    this.$Message.success('删除企业成功');
                     this.$router.push("/delOrg");
                }else{
                    this.$Message.error('删除企业失败');
                }
            })

        },

        saveOrg(){
            let params = {
                orgImg:this.img,
                orgName:this.orgName,
                orgDes:this.selectmodel1,
                orgIntro:this.orgDes,
                isPublic:this.orgPublick,
                memberId:localStorage.userId,
            }
            updateOrg(localStorage.companyId,params).then(res=>{
                if(res.result==1){
                    this.$Message.success('修改成功');
                }else{
                    this.$Message.eror('修改失败');
                }
            })
        }
    },
    created() {
        
    },
}
</script>

<style scoped lang="less">
.wrap-div{
    width: 100%;
    padding-bottom: 20px;
   
}
 .transfer{
        span{
            margin-bottom: 20px;
            display: block;
        }
       
    }
.base-info-box{
    width: 100%;
    background-color: white;
    margin-bottom: 10px;
    header{
        width: 100%;
        height: 70px;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 24px;
        line-height: 70px;
        font-size: 16px;
    }
    .base-info{
        width: 100%;
        padding: 24px;
        .little-title{
            margin-bottom: 10px;
            font-size: 14px;
        }
        .awart-box{
            width: 100%;
            height: 96px;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            img{
                width: 96px;
                height: 96px;
                margin-right: 20px;
                border-radius: 50%;
            }
        }
    }
}
.more-operate{
    width: 100%;
    background-color: white;
    header{
        width: 100%;
        height: 70px;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 24px;
        line-height: 70px;
        font-size: 16px;
    }
    .org-vest{
        width: 100%;
        padding: 24px;
        border-bottom: 1px solid #e5e5e5;
        .little-title{
            margin-bottom: 16px;
            font-size: 14px;
        }
        .org-vest-con{
            display: flex;
            align-items: center;
            width: 100%;
            height: 40px;
            justify-content: space-between;
            .org-vest-con-left{
                display: flex;
                align-items: center;
                font-size: 14px;
                img{
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    margin-right: 25px;
                }
            }
        }
    }
    .delete-org{
        width: 100%;
        padding: 24px;
        .little-title{
            margin-bottom: 16px;
            font-size: 14px;
        }
        p{
            margin-bottom: 20px;
            color: #808080;
            font-size: 14px;
        }
    }
}
</style>