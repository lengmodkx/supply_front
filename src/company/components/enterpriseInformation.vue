<template>
    <div class="wrap-div">
        <div class="base-info-box">
            <header>基本信息</header>
            <div class="base-info">
                <p class="little-title">企业头像</p>
                <div class="awart-box">
                    <img :src="img" alt="">
                    <!-- <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="primary" ghost>上传新头像</Button>
                    </Upload> -->
                </div>
                <p class="little-title">企业名称</p>
                <Input v-model="orgName" style="width: 420px;margin-bottom: 15px" />
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
                        <Icon type="md-contact" size='32'/>
                        <span>{{contact}}</span>
                    </div>
                    <Button type="primary" ghost>移交</Button>
                </div>
            </div>
            <div class="delete-org">
                <div class="little-title">删除企业</div>
                <p>一旦你删除了企业，企业内所有项目、部门、成员，项目中所有内容等都将会被永久删除。这是一个不可恢复的操作，请谨慎对待！</p>
                <Button type="error" >删除企业</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { orgInfo , updateOrg } from '../axios/api'
export default {
    name: "enterpriseInformation",
    data () {
        return {
            img: '',
            orgName: '',
            orgDes: '',
            orgPublick: '0',
            contact:''
        }
    },
    mounted(){
        this.getOrgInfo()
    },
    methods:{
        getOrgInfo(){
            orgInfo(localStorage.companyId).then(res=>{
                if(res.result==1){
                    this.img = res.data.organizationImage
                    this.orgName = res.data.organizationName
                    this.orgDes = res.data.organizationDes
                    this.orgPublick = res.data.isPublic+""
                    this.contact = res.data.contact
                }
            })
        },
        saveOrg(){
            let params = {
                orgName:this.orgName,
                orgDes:this.orgDes,
                isPublic:this.orgPublick,
                memberId:localStorage.userId
            }
            updateOrg(localStorage.companyId,params).then(res=>{
                if(res.result==1){
                    this.$Message.success('修改成功');
                }else{
                    this.$Message.eror('修改失败');
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
.wrap-div{
    width: 100%;
    padding-bottom: 20px;
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