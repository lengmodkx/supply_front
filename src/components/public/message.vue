<template>
    <div class="message-box">
        <!--头部-->
        <header class="message-head">
            <Icon type="md-close" class="close" @click="closeMsg" />
            <div class="head-con">
                <div class="head-left">
                    <Badge :count="3" type="info" >
                        <Icon class="head-left-icon" type="ios-chatbubbles" />
                    </Badge>
                    <div class="msg-type">
                        <Icon type="ios-notifications-outline" />
                        <Poptip v-model="msgTypeShow">
                            <span style="cursor: pointer">{{msgType}} <Icon type="ios-arrow-down" size="14" /></span>
                            <div slot="content" class="msg-type-con">
                                <div>全部通知 <Icon v-if="msgType=='全部通知'" type="md-checkmark" size="16" /></div>
                                <div>未读通知 <Icon v-if="msgType=='未读通知'" type="md-checkmark" size="16" /></div>
                                <div>@我的通知 <Icon v-if="msgType=='@我的通知'" type="md-checkmark" size="16" /></div>
                                <p class="hline"></p>
                                <div>标记所有为已读 </div>
                                <div>删除所有已读消息</div>
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
                <li class="message-list">
                    <header>
                        <Icon v-if="1" type="md-checkbox-outline" size="20" />
                        <Icon v-else type="ios-information-circle-outline" size="20" />
                        <span>任务名称</span>
                        <Icon type="md-close" class="delete-msg" size="20" />
                    </header>
                    <div class="message-list-con">
                        <img src="" alt="">
                        <div class="msg">
                            <p>何少华将你添加到何少华的西安航母</p>
                            <p class="msg-time">3月30日 12:00</p>
                        </div>
                    </div>
                </li>
            </ul>
            <!--右侧-->
            <div class="message-right">
                <!--系统消息-->
                <div class="xtxx" v-if="type=='系统消息'">
                    <img src="@/icons/img/sys-msg.png" alt="">
                    <h4>何少华将你添加进abc项目</h4>
                    <p>你可以查看该项目所有内容</p>
                    <Button class="go-project" type="info">前往项目：aaa</Button>
                </div>
                <!--任务消息-->
                <div class="rwxx" v-if="type=='任务消息'">
                    <!--<editList :data="data"></editList>-->
                </div>

            </div>
        </div>

    </div>
</template>
<script>
    import editList from '../project/pages/index/components/EditList'
    export default {
        data: function () {
            return {
                msgTypeShow: false,
                msgType: '全部通知',
                type: '系统消息',
                data:{}
            }
        },
        components: {editList},
        methods: {
            closeMsg () {
                console.log(localStorage.projectRouter)
                this.$router.push(localStorage.projectRouter)
            }
        }
    }
</script>
<style socped lang="less">
@import "./message";
</style>