import {
    getProjectList,
    getProject
} from "../../axios/api.js";
import {
    getAllProject
} from '../../axios/companyApi'
const store = {
    namespaced: true,
    state: {
        projects: [],
        loading: true,
        project: null,
        projectName: null,
        allProject: [],
    },
    mutations: {
        _init(state, data) {
            state.loading = false
            state.projects = data;
        },
        updateProject(state, data) {
            state.projects = data
        },
        setName(state, data) {
            state.projectName = data
        },
        // 打开项目设置
        openSet(state, data) {
            state.project = data
        },
        // 局部更新项目
        updatePro(state, data) {
            let tmp = state.projects.find((i) => i.projectId === data.projectId)
            Object.assign(tmp, data)
        },
        // 获取全部项目
        projectTotle(state, data) {
            state.allProject = data
        },
        deleteProject(state,data){
            state.projects = state.projects.filter(v=>v.projectId!==data);
        },
    },
    actions: {
        init({
            commit
        }, params) {
            getProjectList().then(res => {
                if (res.result === 1) {
                    let data = [];
                    commit('projectTotle', res.data)
                    switch (params) {
                        case "我创建的项目":
                            data = res.data.filter(v => {
                                return (
                                    v.memberLabel == 1 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "我参与的项目":
                            data = res.data.filter(v => {
                                return (
                                    v.memberLabel == 0 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "星标项目":
                            data = res.data.filter(v => {
                                return (
                                    v.collect == 1 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "已归档的项目":
                            data = res.data.filter(v => {
                                return v.projectStatus == 1 && v.projectDel == 0;
                            });
                            break;
                        case "回收站的项目":
                            data = res.data.filter(v => {
                                return v.projectDel == 1;
                            });
                            break;
                    }
                    commit('_init', data);
                }
            })
        },
        updateProject({
            commit
        }, data) {
            commit('updateProject', data)
        },
        openSet({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                getProject(data).then(res => {
                    if (res.result === 1) {
                        commit('openSet', res.data)
                        resolve()
                    }
                });
            })

        },
        // 初始化企业的项目列表
        orgProjectInit({
            commit
        }, params) {
            getAllProject(params.id).then(res => {
                if (res.result === 1) {
                    let data = [];
                    switch (params.type) {
                        case "全部项目":
                            data = res.data.filter(v => {
                                return (
                                    v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "我创建的项目":
                            data = res.data.filter(v => {
                                return (
                                    v.memberLabel == 1 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "我参与的项目":
                            data = res.data.filter(v => {
                                return (
                                    v.memberLabel == 0 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "星标项目":
                            data = res.data.filter(v => {
                                return (
                                    v.collect == 1 && v.projectDel == 0 && v.projectStatus == 0
                                );
                            });
                            break;
                        case "已归档的项目":
                            data = res.data.filter(v => {
                                return v.projectStatus == 1 && v.projectDel == 0;
                            });
                            break;
                        case "回收站的项目":
                            data = res.data.filter(v => {
                                return v.projectDel == 1;
                            });
                            break;
                    }
                    commit('_init', data);
                }
            })
        }
    }
}

export default store