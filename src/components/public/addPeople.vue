<template>
        <div style="text-align:center;height:400px">
            <div>
                <Input search enter-button placeholder="请输入手机号查找"
                       @on-search="searchUser" v-model="searchWord" @on-keyup="searchInput" />
            </div>
            <loading v-if="loading"></loading>
            <div class="people-wrap" >
                <ul v-if="invitUsers.length && !isSearch">
                    <li v-for="(user,index) in invitUsers" :key="index" class="invit-user">
                        <div class="invit-user-name">
                            <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${user.user.image}`">
                            <p>{{user.user.userName}}</p>
                        </div>
                        <Button type="primary" :disabled="user.isExist" @click="adduser(user.user.userId)">添加</Button>
                    </li>
                </ul>
                <!--搜索显示的-->
                <div class="invit-user" v-if="isSearch">
                    <div class="invit-user-name">
                        <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${searchPeople.user.image}`">
                        <p>{{searchPeople.user.userName}}</p>
                    </div>
                    <Button type="primary" :disabled="searchPeople.isExist" @click="adduser(searchPeople.user.userId)">添加</Button>
                </div>
            </div>
        </div>
</template>

<script>
    import {searchMembers, addPeople} from '@/axios/companyApi'
    export default {
        props: ["invitUsers"],
        name: "addPeople",
        data () {
            return {
                loading: false,
                searchWord: '',
                searchPeople: {},
                isSearch: false,
            }
        },
        methods: {
            // 添加企业成员
            adduser(id){
                let data={
                    'orgId': localStorage.companyId,
                    'memberId': id
                }
                console.log(data)
                addPeople(data).then(res => {
                    console.log(res)
                    if (res.result){
                        this.$Message.success('添加成功');
                        this.$emit('add',res.data)
                    }
                })
            },
            // 搜索 成员
            searchUser(value){
                if(!(/^1[34578]\d{9}$/.test(value))){
                    this.$Message.error('手机号格式错误，请重新输入');
                }else {
                    this.loading=true
                    searchMembers(value, localStorage.companyId).then(res => {
                        this.isSearch=true
                        this.loading=false
                        this.searchPeople=res.data
                    })
                }
            },
            searchInput () {
                if (this.searchWord==''){
                    this.isSearch=false
                    this.searchPeople={}
                }
            },
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