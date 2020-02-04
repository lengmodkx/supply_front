
import {findUserInfo} from '@/axios/api';
import {
  getTSFile,
  filePrivacy,
  getFolders,
  getFileTree,
  searchFile,
  getFileByTag,
  getFileDetails,
  getTree,
} from '../../axios/fileApi'

const store = {
  namespaced: true,
  state: {
      fileTree:[],
      userTree:[],
      tooltree:[
      { id:0, pId:0, name:"工具",open:true },
      { id:1, pId:0, name:"最近文档", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree5.png"},
      { id:2, pId:0, name:"回收站", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree8.png"},
       ],
       typetree:[
      { id:0, pId:0, name:"文件类型",open:true },
      { id:1, pId:0, name:"文档", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree9.png"},
      { id:2, pId:0, name:"图片", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree10.png"},
      { id:3, pId:0, name:"音乐", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree11.png"},
      { id:4, pId:0, name:"视频", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree12.png"},
      { id:5, pId:0, name:"压缩包", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree13.png"},
      { id:6, pId:0, name:"其它", icon:"https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/upload/tree-icon/tree14.png"},
       ],
      showView:'view',
      slider:'',
  },

  mutations: {
       // 改变列表状态
      changeShowView(state, data){
        state.showView=data
      },
      // 改变缩放
      changeSlider(state, data){
         state.slider=data
      },
      //树
      initFolders(state, data) {
    
        state.fileTree=data.fileTree
        state.userTree=data.userTree
      },   
  },
  actions: {
      // 改变列表状态
      changeShowView({commit}, value){
          commit('changeShowView', value) 
      },

       // 改变缩放
       changeSlider({commit}, value){
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
     },
     
  }
}

export default store
