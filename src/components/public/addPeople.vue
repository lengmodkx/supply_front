<template>
        <div style="text-align:center;height:400px">
            <div>
                <Input search enter-button placeholder="请输入手机号查找"
                       @on-search="searchUser" v-model="searchWord" @on-keyup="searchInput" />
            </div>
            <loading v-if="loading"></loading>
            <div class="people-wrap" >
                <ul v-if="invitUsers.length && !isSearch">
                   
                </ul>
                <!--搜索显示的-->
                <div v-if="isSearch">
                    <ul>
                        <li v-for="(people,index) in searchPeople" :key="index" class="invit-user">
                            <div class="member-info">
                                <img :src="`${people.image}`">
                                <span>{{people.userName}}</span>
                            </div>
                            <Button type="primary" @click="adduser(people.userId)">添加</Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
</template>

<script>
    import {searchMembers, addPeople, addBranchPeople} from '@/axios/companyApi'
    export default {
        props: ["invitUsers",'type','partmentId'],
        name: "addPeople",
        data () {
            return {
                loading: false,
                searchWord: '',
                searchPeople: [],
                isSearch: false,
            }
        },
        methods: {
            adduser(id){
                // 添加企业成员
                if (this.type==='成员'){
                    let data={
                        'orgId': localStorage.companyId,
                        'memberId': id
                    }
                    addPeople(data).then(res => {
                        if (res.result){
                            this.$Message.success('添加成功');
                            this.$emit('add',res.data)
                        }
                    })
                } else if (this.type==='部门') {
                    alert('bumen')
                    let data={
                        'memberId':id
                    }
                    addBranchPeople(this.partmentId,data).then(res => {
                        this.$Message.success('添加成功');
                        this.$emit('add',res.data)
                        console.log(res)
                    })
                }

            },
            // 搜索 成员
            searchUser(value){
                this.loading=true
                searchMembers(value, localStorage.companyId).then(res => {
                    if(res.result==1){
                        this.searchPeople=res.data
                    }
                    this.isSearch=true
                    this.loading=false
                })
            },
            searchInput () {
                if (this.searchWord==''){
                    this.isSearch=false
                    this.searchPeople=[]
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
    .member-info {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 32px;
            height: 32px;
        }
        span {
            font-size: 14px;
            margin-left: 10px;
        }
    }
}
</style>