<template>
        <div style="text-align:center;height:400px">
            <div>
                <Input search enter-button placeholder="请输入手机号/邮箱查找" @on-search="searchUser" v-model="searchWord" />
            </div>
            <loading v-if="loading"></loading>
            <div class="people-wrap" >
                <ul>
                    <!--<li v-for="(user,index) in invitUsers" :key="index" class="invit-user">-->
                        <!--<div class="invit-user-name">-->
                            <!--<img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.user.image}`">-->
                            <!--<p>{{user.user.userName}}</p>-->
                        <!--</div>-->
                        <!--<Button type="primary" :disabled="user.isExist" @click="adduser(user.user.userId)">添加</Button>-->
                    <!--</li>-->
                </ul>
            </div>
        </div>
</template>

<script>
    export default {
        props: ["invitUsers"],
        name: "addPeople",
        data () {
            return {
                loading: false,
                searchWord: ''
            }
        },
        methods: {
            adduser(){

            },
            searchUser(value){
                alert(value)
            }
        }
    }
</script>

<style scoped lang="less">
.people-wrap{
    width: 100%;
    height: 360px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 10px;
    &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #cecece;
    }
}
.invit-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    .invit-user-name {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 32px;
            height: 32px;
        }
        p {
            font-size: 14px;
            margin-left: 10px;
        }
    }
}
</style>