<template>
    <div class="list-view-wrap">
        <div class="list-view">
            <Loading v-if="loading"></Loading>
            <header class="list-view-head">共 {{listData.length?listData.length:0}} 个任务</header>
            <div class="list-view-con" v-for="(item, index) in listData" :key="index" @click="initTask(item.parentTask?item.parentTask.taskId:item.taskId)">
                <Checkbox class="check-box" v-model="single" disabled size="default"></Checkbox>
                <div class="task-con">
                    <Tooltip class="task-name" :content="item.taskName">
                        {{item.taskName}}
                    </Tooltip>
                </div>
                <div class="task-time">
                    <Time v-if="item.startTime" :time="item.startTime" :interval="60" />
                    <span v-if="item.startTime && item.endTime" style="margin: 0 5px">—</span>
                    <Time v-if="item.endTime" :time="item.endTime" :interval="60" />
                </div>
                <Tooltip  v-if="!item.parentTask" :content="item.taskMenuName">
                    <span class="task-menu">{{item.taskMenuName}}</span>
                </Tooltip>
                <Tooltip  placement="top-end" v-if="item.parentTask" class="long-task-menu" :content="item.parentTask.taskName">
                    属于任务：{{item.parentTask.taskName}}
                </Tooltip>
                <img v-if="item.executorImg" class="zxz-touxiang" :src="'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.executorImg" alt="">
                <Icon v-else type="md-contact" class="zxz-touxiang" size="24" />
            </div>
        </div>
        <!-- 点击列表出来的弹框。编辑列表 -->
        <Modal v-model="showModal" class="myModal">
            <my-modal v-if="showModal"></my-modal>
        </Modal>
    </div>
</template>

<script>
    import {getListView} from '@/axios/api2'
    import myModal from "./components/EditList";
    import {mapMutations} from 'vuex'
    export default {
        name: "listView",
        components: {myModal},
        data () {
            return {
                single: '',
                projectId: this.$route.params.id,
                listData: [],
                showModal: false,
                loading: false,
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            ...mapMutations("task", ["setTaskId"]),
            // 初始化
            init() {
                this.loading=true
                getListView(this.projectId).then(res => {
                    if (res.result){
                        this.listData=res.data
                        this.loading=false
                    }
                })
            },
            //打开任务详情
            initTask(taskId) {
                this.showModal = true;
                this.setTaskId(taskId);
            },
        }
    }
</script>

<style scoped lang="less">
.list-view-wrap{
    width: 100%;
    height: 100%;
    background-color: rgb(245,245,245);
    padding: 20px 0;
    .list-view{
        width: 1000px;
       max-height: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: white;
        &::-webkit-scrollbar {
            width: 6px;
            height: 8px;
            background-color: #e5e5e5;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #cecece;
        }
        .list-view-head{
            width: 100%;
            height: 44px;
            padding: 0 24px;
            display: flex;
            align-items: center;
            color: #a6a6a6;
            border-bottom: 1px solid #e5e5e5;
        }
    }
}
.list-view-con{
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 24px;
    cursor: pointer;
    .check-box{
        flex: none;
        margin-right: 16px;
    }
    .task-con{
        width: 636px;
        display: flex;
        align-items: center;
        margin-right: 40px;
        .task-name{
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 15px;
        }
    }
    .task-time{
        width: 150px;
        flex: none;
        color: #3da8f5;
    }
    .task-menu{
        margin-left: 20px;
        width: 60px;
        color: #a6a6a6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: none;
    }
    .zxz-touxiang{
        flex: none;
        width: 24px;
        height: 24px;
        margin-left: 20px;
    }
}
.long-task-menu{
    flex: none;
    width: 200px;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #a6a6a6;
    margin-left: 20px;
}
</style>