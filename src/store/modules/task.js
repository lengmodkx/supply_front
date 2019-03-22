import { enterTask,getmemberList,gettagList,addTask } from "../../axios/api.js";
const store = {
  namespaced: true,
  state: {
    tasks:[],
    currentProjectId:null,
    sort: '1',
    curTaskGroupId: 1,
    taskGroup: [
      {
        id: 1,
        name: '任务1',
        desc: '描述任务1',
        urgency1: 2,
        urgency2: 1,
        urgency3: 1,
        urgency4:1,
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
        urgency4:0,
        total: 2,
        done: 0
      }
    ],
    tags: [],
    members:[]
  },
  getters: {
    curTaskGroup: (state, getters) => {
      let cur = state.taskGroup.filter(v => v.id === state.curTaskGroupId)
      cur = cur.length > 0 ? cur[0] : {}
      return cur
    },
    getTaskByName: (state) => (name) => {
      return state.taskGroup.filter(v => v.name.indexOf(name) >= 0)
    }
  },
  mutations: {
    initTask(state,data){
      state.tasks = data
    },
    addTask(state,data){
      state.tasks = data
    },
    updateSort (state, data) {
      state.sort = data
    },
    updateCurTaskGroupId (state, id) {
      state.curTaskGroupId = id
    },
    updateTags (state, data) {
      // data.unshift({
      //   id: -1,
      //   name: '无标签',
      //   color: '#a6a6a6'
      // })
      state.tags = data
    },
    updateMemberList(state, data){
        state.members=data
    }
  },
  actions: {
    init({commit},data){
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
          console.log(res.menus)
          commit('initTask', res.menus)
        }
      });
    },
    addTask({commit},data){
      console.log('>>>>>',data)
      commit('addTask', data)
    },
    updateSort ({
      commit
    }, data) {
      commit('updateSort', data)
    },
    initTags({   //初始化标签列表
      commit,state
    }, callback) {
       //axios获取新的tags,提交mutation
      gettagList(state.currentProjectId).then(res=>{
        
        commit('updateTags', res.tagList)
        // console.log(res.tagList)
        callback()
      })
    },
    initMemberList({
      commit,state
    },callback) {
      getmemberList(state.currentProjectId).then(res=>{
        // console.log(res)
        commit('updateMemberList', res.data)
        callback()
      })

    }
  }
}

export default store
