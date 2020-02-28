import {
  getTree
} from '../../axios/fileApi'

const store = {
  namespaced: true,
  state: {
    fileTree: [],
    // tooltree:[
    //   { id:1, pId:0, name:"Custom Icon 01", open:true, iconOpen:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/004e879c347daab8eb60e00a938f7dc.png", iconClose:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/004e879c347daab8eb60e00a938f7dc.png"},
    //   { id:11, pId:1, name:"leaf node 01", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:12, pId:1, name:"leaf node 02", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:13, pId:1, name:"leaf node 03", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:2, pId:0, name:"Custom Icon 02", open:true, icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:21, pId:2, name:"leaf node 01", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:22, pId:2, name:"leaf node 02", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    //   { id:23, pId:2, name:"leaf node 03", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/wx_app_icon/2c4d11307f486c71aa6212926ea85a3.png"},
    // ]
    showView: 'view',
    slider: ''
  },
  mutations: {
    // 改变列表状态
    changeShowView(state, data) {
      state.showView = data
    },
    // 改变缩放
    changeSlider(state, data) {
      state.slider = data
    },
    //树
    initFolders(state, data) {
      state.fileTree = data
    }
  },
  actions: {
    // 改变列表状态
    changeShowView({
      commit
    }, value) {
      commit('changeShowView', value)
    },

    // 改变缩放
    changeSlider({
      commit
    }, value) {
      commit('changeSlider', value)
    },
    //获取树
    initFolders({
      commit
    }, data) {
      // 初始化树
      getTree(data).then(res => {
        commit("initFolders", res.data)
      })
    }
  }
}

export default store