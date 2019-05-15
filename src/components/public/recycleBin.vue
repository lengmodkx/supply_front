<template>
    <div class="recycle-con">
        <ul class="recycle-left">
            <li :class="{checked: nowChecked==='task'}" @click="changeNav('task')">
                <Icon type="md-checkbox-outline" />任务
            </li>
            <li :class="{checked: nowChecked==='share'}" @click="changeNav('share')">
                <Icon type="ios-paper-outline" />分享
            </li>
            <li :class="{checked: nowChecked==='schedule'}" @click="changeNav('schedule')">
                <Icon type="ios-calendar-outline" />日程
            </li>
            <li :class="{checked: nowChecked==='file'}" @click="changeNav('file','文件')">
                <Icon type="ios-document-outline" />文件
            </li>
            <li :class="{checked: nowChecked==='fileJ'}" @click="changeNav('fileJ','文件夹')">
                <Icon type="ios-folder-outline" />文件夹
            </li>
            <li :class="{checked: nowChecked==='group'}" @click="changeNav('group')">
                <Icon type="ios-paper-outline" />分组
            </li>
            <li :class="{checked: nowChecked==='tag'}" @click="changeNav('tag')">
                <Icon type="ios-pricetag-outline" />标签
            </li>
        </ul>
        <div class="recycle-right">
            <div v-if="dataList.length" class="has-con">
                <header class="recycle-head">
                    <span>名称</span><span>修改时间</span>
                </header>
                <div class="recycle-list" v-for="(item, index) in dataList" :key="index">
                    <p class="name">{{item.name}}</p>
                    <p class="time">{{item.updateTime | timeFilter}}</p>
                    <div class="operate">
                        <div><Icon type="md-refresh" @click="recoverIt(item.id)" />恢复内容</div>
                        <div><Icon type="ios-trash-outline" @click="deleteForever(item.id)" />彻底删除</div>

                    </div>
                </div>
            </div>
            <div v-else class="no-con">
                <img src="../../icons/img/recycle.png" alt="">
                <p>回收站暂无内容</p>
            </div>
        </div>
    </div>
</template>
<script>
    import {getRecycle} from '@/axios/setAndTag'
    export default {
        data: function () {
            return {
                dataList: [],
                nowChecked: 'task',
                projectId:this.$route.params.id
            }
        },
        mounted() {
            getRecycle(this.projectId, 'task').then(res => {
                this.dataList=res.data
            })
        },
        methods: {
            changeNav (type, filetype) {
                this.nowChecked=type
                let fileType
                let nowType=type
                if (filetype==='文件'){
                    fileType=0
                } else if (filetype==='文件夹'){
                    fileType=1
                    nowType='file'
                }
                getRecycle(this.projectId, nowType, fileType).then(res => {
                    this.dataList=res.data
                })
            },
            // 恢复内容
            recoverIt (id) {
                alert(id)
            },
            // 永久删除
            deleteForever (id) {
                alert(id)
            },
        }
    }
</script>
<style socped lang="less">
.recycle-con{
    width: 100%;
    height: 100%;
    display: flex;
    .recycle-left{
        width: 180px;
        height: 100%;
        border-right: 1px solid #e5e5e5;
        .checked{
            background-color: #f7f7f7;
            color: #3da8f5;
        }
        li{
            width: 100%;
            height: 44px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            cursor: pointer;
            color: gray;
            font-size: 14px;
            &:hover{
                background-color: #f7f7f7;
                color: #3da8f5;
            }
            i{
                font-size: 20px;
                margin-right: 8px;
            }
        }
    }
    .recycle-right{
        width: 620px;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 6px;
            height: 8px;
            background-color: #e5e5e5;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #cecece;
        }
    }
}
.has-con{
    width: 100%;
    .recycle-head,.recycle-list{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e5e5e5;
        padding: 0 16px;
        font-size: 14px;
        color: #a6a6a6;
    }
    .recycle-list{
        position: relative;
        .name{
            color: #383838;
            max-width: 550px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .operate{
            display: none;
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            align-items: center;
            background-color: #f7f7f7;
            div{
                margin-right: 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                &:hover{
                    color: #3da8f5;
                }
            }
            i{
                font-size: 18px;
                margin-right: 5px;
            }
        }
        &:hover{
            background-color: #f7f7f7;
            .operate{
                display: flex;
            }
        }
    }
}
.no-con{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
        width: 72px;
        height: 72px;
        margin-bottom: 15px;
    }
    p{
        font-size: 16px;
        color: #a6a6a6;
        text-align: center;
    }
}
</style>