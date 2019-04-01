import {
    getProjectList,
} from "../../axios/api.js";
const store = {
    namespaced: true,
    state: {
        projects: [],
        loading: true,
        project: null
    },
    mutations: {
        _init(state, data) {
            state.loading = false
            state.projects = data;
        },
        updateProject(state, data) {
            state.projects = data
        }
    },
    actions: {
        init({
            commit
        }, params) {
            getProjectList().then(res => {
                if (res.result === 1) {
                    let data = [];
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
        }
    }
}

export default store