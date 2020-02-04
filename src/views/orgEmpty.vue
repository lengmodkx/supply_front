<template>
    <div class="org-content">
        <div class="organization-is-empty-view__3GYF">
            <section class="empty-container__kCc0">
                <div class="img__371V"></div>
                <p>您目前不是任何一个企业的成员</p>
                <p>请联系您企业的管理员邀请您加入，或直接新建企业来使用 阿拉丁BIM云平台</p>
                <Button type="primary" @click="addOrgModal=true">创建企业</Button>
            </section>
        </div>
        <Modal v-model="addOrgModal" class="newOrg">
            <CreateOrg @closeCreateOrg="addOrgModal=false" v-if="addOrgModal"></CreateOrg>
        </Modal>
    </div>
</template>
<script>
import CreateOrg from "../components/public/common/CreateOrg";
export default {
    components: {
        CreateOrg
    },
    data(){
        return{
            addOrgModal:false
        }
    }
}
</script>
<style lang="less">
.org-content{
    top: 48px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
}
.organization-is-empty-view__3GYF {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    .empty-container__kCc0{
        text-align: center;
        .img__371V{
            display: inline-block;
            margin-bottom: 16px;
            width: 72px;
            height: 72px;
            background-image: url(https://g.alicdn.com/teambition/web/teambition/images/member.a8eea0ca.png);
            background-size: contain;
            background-position: 50%;
            background-repeat: no-repeat;
        }
    }
}
</style>