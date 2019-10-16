<template>
    <div class="message-box">
        <div class="loading" v-if="loading"><Loading ></Loading></div>
        <!--头部-->
        <header class="message-head">
            <!-- <Icon type="md-close" class="close" @click="closeMsg" /> -->
            <div class="head-con">
                <div class="head-left">
                    <span></span>
                    <!--<Badge :count="3" type="info" >-->
                    <!--<Icon class="head-left-icon" type="ios-chatbubbles" />-->
                    <!--</Badge>-->
                    <div class="msg-type">
                        <Icon type="ios-notifications-outline" />
                        <Poptip v-model="msgTypeShow">
                            <span style="cursor: pointer">{{msgType}} <Icon type="ios-arrow-down" size="14" /></span>
                            <div slot="content" class="msg-type-con">
                                <div @click="getNews">全部通知 <Icon v-if="msgType=='全部通知'" type="md-checkmark" size="16" /></div>
                                <div @click="getNews(false)">未读通知 <Icon v-if="msgType=='未读通知'" type="md-checkmark" size="16" /></div>
                                <!--<div>@我的通知 <Icon v-if="msgType=='@我的通知'" type="md-checkmark" size="16" /></div>-->
                                <p class="hline"></p>
                                <div @click="allIsRead">标记所有为已读 </div>
                                <div @click="deleteReadNews">删除所有已读消息</div>
                            </div>
                        </Poptip>
                    </div>
                </div>
                <div class="head-right">

                </div>
            </div>
        </header>
        <!--消息-->
        <div class="message-con">
            <!--左侧-->
            <ul class="message-left">
                <li class="message-list" :class="{read:n.newsHandle === 1}" v-for="n in news" @click="handle(n.newsPublicId,n.newsType,n.newsId,n.newsHandle)">
                    <header>
                        <Icon v-if="1" type="md-checkbox-outline" size="20" />
                        <Icon v-else type="ios-information-circle-outline" size="20" />
                        <span>{{n.newsName}}</span>
                        <Icon type="md-close" class="delete-msg" size="20"  @click.stop="deleteNews(n.newsId)"/>
                        <p class="mag-num" v-if="n.newsCount > 0">{{n.newsCount}}</p>
                    </header>
                    <div class="message-list-con">
                        <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${n.newsFromUser.defaultImage}`" alt="">
                        <div class="msg">
                            <p v-html="n.newsContent"></p>
                            <p class="msg-time"><Time :time="n.updateTime" /></p>
                        </div>
                    </div>
                </li>
            </ul>
            <!--右侧-->
            <div class="message-right" v-if="false">
                <!--系统消息-->
                <div class="xtxx" v-if="type=='系统消息'">
                    <img src="@/icons/img/sys-msg.png" alt="">
                    <h4>何少华将你添加进abc项目</h4>
                    <p>你可以查看该项目所有内容</p>
                    <Button class="go-project" type="info">前往项目：aaa</Button>
                </div>

            </div>
        </div>
        <Modal v-model="isShow"  :footer-hide="true">
            <editList :data="false"></editList>
        </Modal>
    </div>
</template>
<script>
    import editList from '../project/pages/index/components/EditList'
    import {getNews,deleteNews,readNews,initEditTask,deleteAllRead,allIsRead} from '@/axios/api'
    import { mapState,mapActions} from "vuex";
    export default {
        data: function () {
            return {
                msgTypeShow: false,
                msgType: '全部通知',
                type: '系统消息',
                isShow:false,
                loading: false
            }
        },
        components: {editList},
        methods: {
            closeMsg () {
                this.$router.push(localStorage.projectRouter)
            },
            deleteNews(id){
                this.$store.dispatch("news/deleteNews",id).then(() => {
                    this.msgTypeShow = false
                    this.getNewsCount()
                })
            },
            deleteReadNews(){
                deleteAllRead().then(res => {
                    if(res.result === 1){
                        this.$store.dispatch("news/getNewsList")
                        this.msgTypeShow = false
                        this.getNewsCount()
                    } else{
                        this.$Message.error("删除失败!")
                    }
                })
            },
            getNews(isRead,userId){
                let obj={
                    isRead:isRead,
                    userId:userId
                }
                if(!isRead){
                    this.msgType = '未读通知'
                    this.$store.dispatch("news/getNewsList",obj)
                } else{
                    this.msgType = '全部通知'
                    this.$store.dispatch("news/getNewsList",obj)
                }
                this.msgTypeShow = false
            },
            allIsRead(){
                allIsRead().then(res => {
                    if(res.result === 1){
                        this.news.forEach((n,i) => {
                            this.news[i].newsHandle = 1
                            this.news[i].newsCount = 0
                        })
                        this.getNewsCount()
                        this.msgTypeShow = false
                    }
                })
            },
            getNewsCount(){
                this.$store.dispatch("news/getNewsCount")
            },
            handle(publicId,publicType,id,isHandle){
                this.loading=true
                readNews(id,isHandle).then(res => {
                    if(res.result === 1){
                        if(isHandle === 0){
                            this.news.forEach((n,i) => {
                                if(n.newsId === id){
                                    this.news[i].newsHandle = 1
                                    this.news[i].newsCount = 0
                                }
                            })
                        }
                        if(publicType === '任务'){
                            this.$store.dispatch('task/editTask', publicId).then(() => {
                              //  debugger
                                this.loading=false
                                this.task = res.data
                                this.isShow = true
                            })
                        }
                        this.getNewsCount()
                    }
                })
            }
        },
        computed:{
            ...mapState("news",["news"]),
            ...mapState('task', ['task'])
        },
        created(){
            this.getNews(false,localStorage.userId)
            console.log(localStorage.userId)
        }
    }
</script>
<style socped lang="less">
    @import "./message";
</style>