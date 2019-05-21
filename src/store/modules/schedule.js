import { schedules } from "@/axios/api";
import {upRichengName, beginDate,endDate,getRicheng} from '@/axios/scheduleApi'
const store ={
    namespaced: true,
    state: {
        schedules:[],
        schedule:{},
        loading:true
    },
    mutations: {
        init (state, data){
            state.schedules=data
            state.loading = false;
        },
        // 单个日程 赋值
        oneSchedule (state, data){
            state.schedule=data
        },
        // 更新日程名称
        updateScheduleName(state, data){
          state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedules[index]=data
                }
            })

        },
        // 开始时间
        startDate (state, data) {
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.startTime=data
                    state.schedules[index]=state.schedule
                }
                console.log(state.schedules)
            })
            console.log(data,state.schedules)
        },
        // 结束时间
        endDate (state, data) {
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.endTime=data
                    state.schedules[index]=state.schedule
                }
            })
        },
        // 改变重复规则
        repeat (state, data) {
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.repeat=data
                    state.schedules[index]=state.schedule
                }
            })
        },
        // 改变地点
        vxaddress (state, data) {
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.address=data
                    state.schedules[index]=state.schedule
                }
            })
        },
        // 改变备注
        vxremarks (state, data) {
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.remarks=data
                    state.schedules[index]=state.schedule
                }
            })
        },
        // 改参与者
        changePeople(state, data){
            console.log(data)
            state.schedules.forEach((item,index)=>{
                if (item.scheduleId==state.schedule.scheduleId) {
                    state.schedule.joinInfo=data
                    state.schedules[index]=state.schedule
                }
            })
        },
        // 发送消息
        msg(state, data){
            state.schedule.logs.unshift(data)
        }
    },
    actions: {
        // 初始化所有日程
        init({commit},params){
            schedules(params).then(res=>{
                    commit('init',res.after);
            })

        },
        //获取单个日程的详情信息
        getScheduleById({dispatch,commit},scheduleId){
            getRicheng(scheduleId).then(res => {
                if(res.result === 1){
                    dispatch('init', {projectId:res.data.projectId})
                    commit('oneSchedule',res.data)
                }
            })
        }
        // 开始时间
        // startDate ({commit}, data) {
        //     console.log(data.startTime)
        //     beginDate(data.scheduleId, data.startTime).then(res => {
        //         if (res.result==1){
        //             commit('startDate', data.startTime)
        //         }
        //     })
        // },
        // 结束时间
        // endDate ({commit}, data) {
        //     endDate(data.scheduleId, data.endTime).then(res => {
        //         if (res.result==1){
        //             commit('endDate', data.endTime)
        //         }
        //     })
        // }

    }
}

export default store