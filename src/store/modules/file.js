import {
    files,
    allTags
} from "../../axios/api.js";
import {
    getTSFile,
    filePrivacy,
    getFolders,
    getFileTree,
    searchFile,
    getFileByTag,
    getFileDetails
} from '../../axios/fileApi'



const store = {
    namespaced: true,
    state: {
        files: [],
        file: {},
        joinInfoIds: [],
        treeData: [],
        tags: [],
        breadcrumb: [
            // {
            //     text: "项目文件夹",
            //     id: 'sss'
            //   }
        ],
        itemfile:{},
        createFileId:'',

    },
    mutations: {
        initFile(state, data) {
            state.files = data;
            console.log(state.files)
        },
        searchFile(state, data) {
            state.files = data;
        },
        initTag(state, data) {
            state.tags = data;
        },
        initItem(state, data) {
            state.itemfile = data;
            state.itemfile.show=true;
        },
        changeCreateFileId(state, data) {
            state.createFileId = data;
        },
        // 文件详情 赋值
        putOneFile(state, data) {
            state.file = data
            state.joinInfoIds = data.data.joinInfo.map(v => {
                return v.userId
            }).join(",");
            console.log(state.joinInfoIds)
        },
        // 推送，更改文件名称
        changeFileName(state, data) {
            state.file.fileName = data.fileName
            state.files.forEach((i, n) => {
                if (i.fileId == data.fileId) {
                    state.files[n].fileName = data.fileName
                }
            })
        },
        // 推送， 移动文件
        removeFile(state, data) {
            state.files.forEach((v, n) => {
                if (v.fileId == data[0].fileId) {
                    state.files.splice(n, 1)
                }
            });
            if (localStorage.fileParentId == data[0].parentId) {
                state.files.unshift(data[0])
            }
        },
        // 推送 复制文件
        copyFile(state, data) {

            if (data[0].parentId === localStorage.fileParentId) {
                state.files.unshift(data[0])
            }
        },
        upFiles(state, data) {
            console.log(">>>", data);
            state.files = data.data
        },
        // 推送 移入回收站
        putRecycle(state, data) {
            state.files.forEach((i, n) => {
                if (data.includes(i.fileId)) {
                    state.files.splice(n, 1)
                }
            })
        },
        // 推送 添加标签
        bindingTag(state, data) {
            state.file.data.tagList.unshift(data.tag)
        },
        // 推送 删除标签
        removeTag(state, data) {
            state.file.data.tagList.forEach((i, n) => {
                if (i.tagId == data.tagId) {
                    state.file.data.tagList.splice(n, 1)
                }
            })
        },
        // 推送 参与者
        player(state, data) {
            state.file.data.joinInfo = data
        },
        // 推送 关联
        relevance(state, data) {
            console.log("----------" + JSON.stringify(data));
            if (data.publicType === '任务') {
                state.file.data.bindTasks = state.file.data.bindTasks.concat(data.bind)
            } else if (data.publicType === '分享') {
                state.file.data.bindShares = state.file.data.bindShares.concat(data.bind)
            } else if (data.publicType === '日程') {
                state.file.data.bindSchedules = state.file.data.bindSchedules.concat(data.bind)
            } else if (data.publicType === '文件') {
                state.file.data.bindFiles = state.file.data.bindFiles.concat(data.bind)
            }
        },
        // 推送 取消关联
        cancelRelevance(state, data) {
            console.log(data.bindId)
            if (data.publicType === '任务') {
                state.file.data.bindTasks.forEach((i, n) => {
                    if (i.taskId === data.bindId) {
                        state.file.data.bindTasks.splice(n, 1)
                    }
                })
            } else if (data.publicType === '分享') {
                state.file.data.bindShares.forEach((i, n) => {
                    if (i.shareId === data.bindId) {
                        state.file.data.bindShares.splice(n, 1)
                    }
                })
            } else if (data.publicType === '日程') {
                state.file.data.bindSchedules.forEach((i, n) => {
                    if (i.scheduleId === data.bindId) {
                        state.file.data.bindSchedules.splice(n, 1)
                    }
                })
            } else if (data.publicType === '文件') {
                state.file.data.bindFiles.forEach((i, n) => {
                    if (i.fileId === data.bindId) {
                        state.file.data.bindFiles.splice(n, 1)
                    }
                })
            }
        },
        // 推送 消息
        getMsg(state, data) {
            state.file.logs.push(data)
        },
        // 推送 创建文件夹
        createWjj(state, data) {
            console.log(data)
            state.files = data
        },
        initFolders(state, data) {
            state.treeData = data
        },
        initBreadcrumb(state, data) {
            state.breadcrumb = data.reverse()
        }
    },
    actions: {
        initFile({
            commit,
        }, data) {
            return new Promise((resolve, reject) => {
                files(data.fileId).then(res => {
                    if (res.result == 1) {
                        commit("initFile", res.data);
                        resolve()
                    }
                });
            })

        },
        initItem({commit, }, data) {
            commit("initItem", data)
        },
        // 推送 上传文件
        upFiles({
            commit
        }, data) {
            getTSFile(data).then(res => {
                commit("upFiles", res)
            })
        },
        // 推送 隐私模式
        putMimi({
            commit
        }, data) {
            getTSFile(data).then(res => {
                commit("upFiles", res)
            })
        },
        initFolders({
            commit
        }, data) {
            getFolders(data.fileId, data.projectId).then(res => {
                if(res.data2){
                    commit("initBreadcrumb", res.data2)
                }
            })
            getFileTree(data.projectId).then(res => {
                commit("initFolders", res.data)
            })
        },
        //搜索文件
        searchFile({
            commit
        }, data) {
            if (data.tag) {
                //tag搜索
                searchFile(data.tag, data.projectId).then(res => {
                    commit("searchFile", res.data)
                    console.log(res)
                })
            } else {
                //搜索条
                searchFile(data.fileName, data.projectId).then(res => {
                    commit("searchFile", res.data)
                })
            }

        },
        initTag({
            commit
        }, data) {
            allTags(data).then(res => {
                console.log(res)
                commit("initTag", res.data)
            })
        },
        // 更新文件详情
        putOneFile({
            commit
        }, data) {
            getFileDetails(data).then(res => {
                console.log(res)
                commit('putOneFile', res)
            })
        },

    }
};

export default store;