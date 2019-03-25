import {
    enterTask,
    getmemberList,
    gettagList,
    addTask,
    initEditTask
} from "../../axios/api.js";
const store = {
    namespaced: true,
    state: {
        simpleTasks: [],
        tasks: [],
        currentProjectId: null,
        sort: '1',
        curTaskGroupId: 1,
        taskGroup: [{
                id: 1,
                name: '任务1',
                desc: '描述任务1',
                urgency1: 2,
                urgency2: 1,
                urgency3: 1,
                urgency4: 1,
                total: 5,
                done: 1
            },
            {
                id: 2,
                name: '任务2',
                desc: '2222222222222222222222222222222222222222',
                urgency1: 0,
                urgency2: 1,
                urgency3: 1,
                urgency4: 0,
                total: 2,
                done: 0
            }
        ],
        tags: [],
        members: []
    },
    getters: {
        curTaskGroup: (state, getters) => {
            let cur = state.taskGroup.filter(v => v.id === state.curTaskGroupId)
            cur = cur.length > 0 ? cur[0] : {}
            return cur
        },
        getTaskByName: (state) => (name) => {
            return state.taskGroup.filter(v => v.name.indexOf(name) >= 0)
        },
        getTaskById:(state) => (data) =>{
            for (var i = 0;i < state.tasks.length;i++){
                if(state.tasks[i].task.taskId === data){
                    return state.tasks[i]
                }
            }
            // return state.tasks.filter(taskvo => {
            //     return taskvo.task.taskId === data
            // })
        },
        abc: (state) =>(num) =>{
            return state.sort+num
        }
    },
    mutations: {
        initTask(state, data) {
            state.simpleTasks = data
        },
        initEditTask(state, data){
            state.tasks.push(data)
        },
        changeTask(state, data) {
            state.simpleTasks = data
        },
        changeProperty(state,data) {
            for(var i = 0;i < state.tasks.length;i++){
                if(state.tasks[i].task.taskId === data.taskId){
                    state.tasks[i].task.priority = data.priority
                }
            }
            console.log(">>>>>>>>>>>>>>>>>", data.taskId);
            for(var i = 0;i < state.simpleTasks.length;i++){
                for(var j = 0;i < state.simpleTasks[j].taskList.length;j++){
                    if(state.simpleTasks[i].taskList[j].taskId === data.taskId){
                        state.simpleTasks[i].taskList[j].priority = data.priority
                    }
                }
            }
        },
        deleteTask(state, data) {
          state.simpleTasks.map(item => {
              const a =item.taskList.filter(task => {
                  return task.taskId !== data
              });
          })
        },
        updateSort(state, data) {
            state.sort = data
        },
        updateCurTaskGroupId(state, id) {
            state.curTaskGroupId = id
        },
        updateTags(state, data) {
            // data.unshift({
            //   id: -1,
            //   name: '无标签',
            //   color: '#a6a6a6'
            // })
            state.tags = data
        },
        updateMemberList(state, data) {
            state.members = data
        }
    },
    actions: {
        init({
            commit
        }, data) {
            enterTask(data).then(res => {
                if (res.result === 1) {
                    res.menus.map(v => {
                        if (v.taskList) {
                            v.taskList.map(vv => {
                                vv.checkStatus = vv.taskStatus != "未完成";
                                return vv;
                            });
                        }
                        return v;
                    });
                    commit('initTask', res.menus)
                }
            });
        },
        initEditTask({commit},data){
            return new Promise((resolve,reject) =>{
                initEditTask(data).then(res => {
                    if (res.data.task.taskStatus === "未完成") {
                        res.data.task.taskStatus = false
                    } else {
                        res.data.task.taskStatus = true
                    }
                    commit('initEditTask',res.data)
                    resolve()
                })
            })

        },
        changeTask({
            commit
        }, data) { //任务数据改变时调用
            commit('changeTask', data)
        },
        changeProperty({commit},data) {
            commit('changeProperty',data)
        },
        //删除任务时候调用
        deleteTask({commit},data){
          commit('deleteTask',data)
        },
        updateSort({
            commit
        }, data) {
            commit('updateSort', data)
        },
        initTags({ //初始化标签列表
            commit,
            state
        }, callback) {
            //axios获取新的tags,提交mutation
            gettagList(state.currentProjectId).then(res => {

                commit('updateTags', res.tagList)
                callback()
            })
        },
        initMemberList({
            commit,
            state
        }, callback) {
            getmemberList(state.currentProjectId).then(res => {
                // console.log(res)
                commit('updateMemberList', res.data)
                callback()
            })

        }
    }
}

export default store