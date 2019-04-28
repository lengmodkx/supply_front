<template>
    <div class="list-view-wrap">
        <div class="list-view">
            <header class="list-view-head">共 12 个任务</header>
            <div class="list-view-con">
                <Checkbox class="check-box" v-model="single" disabled size="default"></Checkbox>
                <div class="task-con">
                    <Tooltip class="task-name" content="Here is the prompt text">
                        任务名称
                    </Tooltip>
                    <Tooltip class="task-name" content="Here is the prompt text">
                        属于任务：啊啊啊啊
                    </Tooltip>
                </div>
                <div class="task-time">
                    <Time :time="new Date().getTime()" :interval="60" />
                    <span style="margin: 0 5px">—</span>
                    <Time :time="new Date().getTime()" :interval="60" />
                </div>
                <Tooltip content="Here is the prompt text">
                    <span class="task-menu">任务分组</span>
                </Tooltip>
                <img class="zxz-touxiang" src="" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "listView",
        data () {
            return {
                single: ''
            }
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
        width: 625px;
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
        background-color: red;
    }
}
</style>