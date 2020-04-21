import { files, allTags } from "../../axios/api.js";
import { getTSFile, filePrivacy, getFolders, searchFile, getFileDetails } from "../../axios/fileApi";
const store = {
  namespaced: true,
  state: {
    files: [],
    file: {},
    joinInfoIds: [],
    treeData: [],
    tags: [],
    breadcrumb: [],
    fileIds: [], //选中的文件id列表
    createFileId: "",
    //菜单栏
    crumbs: [],
    crumbsCache: [],
    crumbsIndex: "",
    toolsShow: false,
    sFile: null,
  },
  mutations: {
    //初始化导航条
    initCrumbs(state, data) {
      const json = JSON.parse(JSON.stringify(data).replace(/name/g, "fileName"));
      state.crumbs = [json];
      state.crumbsCache.push(...state.crumbs);
      state.crumbsIndex = state.crumbsCache.length;
      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
    },
    // 回到首页导航条
    crumbsHome(state) {
      state.crumbs = state.crumbsCache.slice(0, 1);
      state.crumbsIndex = 1;
      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
    },
    //点击文件夹
    crumbsAdd(state, data) {
      const json = JSON.parse(JSON.stringify(data).replace(/fileId/g, "id"));
      console.log("crumbsAdd=========", json);
      state.crumbs.push(json);
      console.log("crumbsAdd=========", state.crumbs);
      state.crumbsCache = state.crumbs;
      state.crumbsIndex = state.crumbsCache.length;
      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
    },
    //单击导航条
    crumbsClick(state, data) {
      console.log("crumbsClick", data.index);
      var location = data.index + 1;
      state.crumbs = state.crumbsCache.slice(0, location);
      state.crumbsIndex = state.crumbs.length;
      console.log("crumbsClick====", state.crumbs);
      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
    },
    //后退
    crumbsBack(state, data) {
      state.crumbsIndex -= 1;
      if (state.crumbsIndex == 0) {
        state.crumbsIndex = 1;
        return;
      }
      console.log("队列：", state.crumbsCache, state.crumbsIndex);
      state.crumbs = state.crumbsCache.slice(0, state.crumbsIndex);
      console.log(state.crumbs);
      //取最后一个值 用ID刷新面--start
      const curId = state.crumbs[state.crumbs.length - 1];
      console.log(curId);
      state.createFileId = curId.id;
      console.log(state.createFileId);
      //取最后一个值 用ID刷新面--end
    },
    //前进
    crumbsForward(state, data) {
      state.crumbsIndex += 1;
      console.log("队列：", state.crumbsCache);
      console.log("位置：", state.crumbsIndex);
      if (state.crumbsIndex > state.crumbsCache.length) {
        state.crumbsIndex = state.crumbsCache.length - 1;
        console.log(state.crumbsIndex);
        return;
      }
      state.crumbs = state.crumbsCache.slice(0, state.crumbsIndex);

      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
      //取最后一个值 用ID刷新面--start
      const curId = state.crumbs[state.crumbs.length - 1];
      console.log("crumbsForward：", curId);
      state.createFileId = curId.id;
      console.log(state.createFileId);
      //取最后一个值 用ID刷新面--end
    },
    //单击树型菜单改
    crumbsTree(state, data) {
      state.crumbsCache = [];
      state.crumbsIndex = "";
      const json = JSON.parse(JSON.stringify(data).replace(/name/g, "fileName"));
      state.crumbs = json;
      state.crumbsCache.push(...state.crumbs);
      state.crumbsIndex = state.crumbsCache.length;
      console.log("队列：", state.crumbsCache, "位置：", state.crumbsIndex);
    },
    initFile(state, data) {
      state.files = data;
      state.files.forEach((v) => (v.checked = false));
    },
    searchFile(state, data) {
      state.files = data;
    },
    initTag(state, data) {
      state.tags = data;
    },
    initItem(state, data) {
      state.fileIds = data;
    },
    changeToolsShow(state, data) {
      state.toolsShow = data;
    },
    changeCreateFileId(state, data) {
      state.createFileId = data;
    },
    // 文件详情 赋值
    putOneFile(state, data) {
      state.file = data;
      state.joinInfoIds = data.joinInfo
        .map((v) => {
          return v.userId;
        })
        .join(",");
    },
    // 推送，更改文件名称
    changeFileName(state, data) {
      state.file.fileName = data.fileName;
      state.files.forEach((i, n) => {
        if (i.fileId == data.fileId) {
          state.files[n].fileName = data.fileName;
        }
      });
    },
    // 推送， 移动文件
    removeFile(state, data) {
      state.files.forEach((v, n) => {
        changeCreateFileId;
        if (v.fileId == data[0].fileId) {
          state.files.splice(n, 1);
        }
      });
      if (localStorage.fileParentId == data[0].parentId) {
        state.files.unshift(data[0]);
      }
    },
    // 推送 复制文件
    copyFile(state, data) {
      if (data[0].parentId === localStorage.fileParentId) {
        state.files.unshift(data[0]);
      }
    },
    upFiles(state, data) {
      state.files = data.data;
    },
    // 推送 移入回收站
    putRecycle(state, data) {
      state.files.forEach((i, n) => {
        if (data.includes(i.fileId)) {
          state.files.splice(n, 1);
        }
      });
    },
    // 推送 添加标签
    bindingTag(state, data) {
      state.file.tagList.unshift(data.tag);
    },
    // 推送 删除标签
    removeTag(state, data) {
      state.file.tagList.forEach((i, n) => {
        if (i.tagId == data.tagId) {
          state.file.tagList.splice(n, 1);
        }
      });
    },
    // 推送 参与者
    player(state, data) {
      state.file.joinInfo = data;
    },
    // 推送 关联
    relevance(state, data) {
      if (data.publicType === "任务") {
        state.fil.bindTasks = state.file.bindTasks.concat(data.bind);
      } else if (data.publicType === "分享") {
        state.file.bindShares = state.file.bindShares.concat(data.bind);
      } else if (data.publicType === "日程") {
        state.file.bindSchedules = state.file.bindSchedules.concat(data.bind);
      } else if (data.publicType === "文件") {
        state.file.bindFiles = state.file.bindFiles.concat(data.bind);
      }
    },
    // 推送 取消关联
    cancelRelevance(state, data) {
      if (data.publicType === "任务") {
        state.file.bindTasks.forEach((i, n) => {
          if (i.taskId === data.bindId) {
            state.file.bindTasks.splice(n, 1);
          }
        });
      } else if (data.publicType === "分享") {
        state.file.bindShares.forEach((i, n) => {
          if (i.shareId === data.bindId) {
            state.file.bindShares.splice(n, 1);
          }
        });
      } else if (data.publicType === "日程") {
        state.file.bindSchedules.forEach((i, n) => {
          if (i.scheduleId === data.bindId) {
            state.file.bindSchedules.splice(n, 1);
          }
        });
      } else if (data.publicType === "文件") {
        state.file.bindFiles.forEach((i, n) => {
          if (i.fileId === data.bindId) {
            state.file.bindFiles.splice(n, 1);
          }
        });
      }
    },
    // 推送 消息
    getMsg(state, data) {
      state.file.logs.push(data);
    },
    // 推送 创建文件夹
    createWjj(state, data) {
      state.files = data;
    },
    initFolders(state, data) {
      state.treeData = data;
    },
    initBreadcrumb(state, data) {
      state.breadcrumb = data.reverse();
    },
    setSFile(state, data) {
      state.sFile = data;
    },
  },
  actions: {
    initFile({ commit }, data) {
      return new Promise((resolve, reject) => {
        files(data.fileId).then((res) => {
          if (res.result == 1) {
            commit("initFile", res.data);
            resolve(res.data);
          }
        });
      });
    },
    //创建文件夹
    createWjj({ commit }, data) {
      files(data).then((res) => {
        if (res.result == 1) {
          commit("initFile", res.data);
        }
      });
    },
    initItem({ commit }, data) {
      commit("initItem", data);
    },
    // 推送 上传文件
    upFiles({ commit }, data) {
      getTSFile(data).then((res) => {
        commit("upFiles", res);
      });
    },
    // 推送 隐私模式
    putMimi({ commit }, data) {
      getTSFile(data).then((res) => {
        commit("upFiles", res);
      });
    },
    initFolders({ commit }, data) {
      getFolders(data.fileId, data.projectId).then((res) => {
        if (res.data2) {
          commit("initBreadcrumb", res.data2);
        }
      });
    },
    //搜索文件
    searchFile({ commit }, data) {
      if (data.tag) {
        //tag搜索
        searchFile(data.tag, data.projectId).then((res) => {
          commit("searchFile", res.data);
        });
      } else {
        //搜索条
        searchFile(data.fileName, data.projectId).then((res) => {
          commit("searchFile", res.data);
        });
      }
    },
    initTag({ commit }, data) {
      allTags(data).then((res) => {
        commit("initTag", res.data);
      });
    },
    // 更新文件详情
    putOneFile({ commit }, data) {
      getFileDetails(data).then((res) => {
        console.log(res.data);
        commit("putOneFile", res.data);
      });
    },
  },
};

export default store;
