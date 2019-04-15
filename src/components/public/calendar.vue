<template>
    <div class="calendar-wrap">
        <header class="calendar-header">
            <Icon @click="close" class="close" type="md-close" />
        </header>
        <div class="calendar-con">
            <div class="left-filter">
                <p>选择要查看的人员</p>
                <div class="member-list">
                    <img src="" alt="">
                    <span>名字</span>
                    <Icon type="md-checkmark" size="20" />
                </div>
            </div>
            <full-calendar
                    :config="config"
                    :events="fcEvents"
            @changeMonth="changeMonths"
            @eventClick="clickEvent"
            @dayClick="clickDay">
            </full-calendar>
        </div>
        <ul class="create" v-show="showCreate" :style="{left:left,top:top}">
            <Loading v-if="loading"></Loading>
            <li @click="showCreateTask">
                <Icon type="md-checkbox-outline" size="20"/>创建任务
            </li>
            <li @click="showCreateRc">
                <Icon type="ios-calendar-outline" size="20" />创建日程
            </li>
        </ul>
        <!--创建任务-->
        <Modal v-model="creatTask" :footer-hide=true title="创建任务" width="360">
            <div class="what-task">
                <span>请选择项目：</span>
                <Select v-model="project" style="width:300px">
                    <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <textarea class="taskInput" v-model="taskTitle" type="text" placeholder="任务标题"></textarea>
            <Button type="info" long>创建</Button>
        </Modal>
        <!--创建日程-->
        <AddSchedule :projectTypes="projectTypes" :value="createRc"></AddSchedule>
    </div>
</template>

<script>
import AddSchedule from './calendar/AddSchedule'
import {getProjectList} from '@/axios/api'
export default {
    name: "calendar",
    components: {AddSchedule},
    data() {
        return {
            showCreate: false,
            left:0,
            top:0,
            creatTask: false,
            createRc: false,
            projectId: '',
            project: '',
            taskTitle: '',
            projectTypes: [],
            loading: false,
            projectList: [
                {
                    value: '项目a',
                    label: '项目a'
                },
            ],
            fcEvents:[
                {
                    title : '郭靖的病假',
                    start : '2019-04-16',
                    end : '2019-04-17'
                },
                {
                    title : '郭靖的任务',
                    start : '2019-04-01',
                    end : '2019-04-17'
                }
            ],
            config: {
                locale: 'zh-cn',
                firstDay:'1',
                header: {
                    left: 'prev, next, today',
                    center: 'title',
                    right: 'custom'
                }
            }
        }
    },
    methods: {
        changeMonths(start, end, current){
            console.log('start:',start)
            console.log('end:',end)
            console.log('current:',current)
        },
        clickEvent(event, jsEvent, pos){
            console.log('event:',event)
            console.log('jsEvent:',jsEvent)
            console.log('pos:',pos)
        },
        clickDay(day, jsEvent){
            this.showCreate=!this.showCreate;
            this.left=jsEvent.clientX+'px'
            this.top=jsEvent.clientY+'px'
            console.log('day:',day)
            console.log('jsEvent:',jsEvent)
        },
        showCreateTask(){
            this.creatTask=true
        },
        showCreateRc(){
            this.loading=true
            getProjectList().then(res => {
                res.data.forEach((i,n) => {
                    this.projectTypes.push({'projectId':i.projectId, 'projectName':i.projectName})
                });
                this.createRc=true
                this.loading=false
            })
        },
        close(){
            this.$router.push(localStorage.projectRouter)
        }
    }
}
</script>

<style scoped lang="less">
.calendar-wrap{
    width: 100%;
    padding-top: 50px;
}
.calendar-header{
    width: 100%;
    height: 50px;
    position: relative;
    background-color: #eee;
    border-bottom: 1px solid #d9d9d9;
    padding: 0 20px;
    .close{
        position: absolute;
        top: 12px;
        right: 20px;
        cursor: pointer;
        font-size: 22px;
        color: gray;
        z-index: 99;
        &:hover{
            color: #3da8f5;
        }
    }
}
.calendar-con{
    width: 1220px;
    position: absolute;
    top: 50px;
    left: 50%;
    margin-left: -610px;
    display: flex;
    .left-filter{
        width: 250px;
        flex: none;
        height: calc(100vh - 50px) ;
        padding: 60px 10px 10px 10px;
        p{
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        .member-list{
            width: 100%;
            height: 34px;
            display: flex;
            align-items: center;
            cursor: pointer;
            img{
                width: 24px;
                height: 24px;
                margin-right: 10px;
                flex: none;
            }
            span{
                width: 100%;
                font-size: 14px;
                color: gray;
                &:hover{
                    color: #3da8f5;
                }
            }
        }
    }
    .comp-full-calendar{
        width: 100%;
        background-color: transparent;
        padding-top: 0;
        /deep/ .full-calendar-header{
            height: 50px;
            font-size: 16px;
        }
        /deep/ .header-center{
            margin-left: -250px;
        }
    }
}
.create{
    position: fixed;
    background-color: white;
    padding: 5px 0;
    width: 200px;
    border-radius: 4px;
    box-shadow: 0 7px 21px rgba(0,0,0,.1);
    z-index: 10;
    li{
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-size: 14px;
        cursor: pointer;
        color: gray;
        &:hover{
            background-color: #f7f7f7;
        }
        i{
            margin-right: 10px;
        }
    }
}
.what-task{
    display: flex;
    align-items: center;
    width: 100%;
    span{
        flex: none;
    }
}
.taskInput{
    width: 100%;
    height: 60px;
    padding: 5px 10px;
    border: 1px solid rgba(0,0,0,.1);
    margin: 16px 0;
}
</style>