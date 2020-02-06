
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
      fileTree:[      
            { id: "0400a7ff96c044f68cfc8130a2f0cc1b", name: "首页", tagsName: null, ext: ".jpg", },
            { id: "0f8cdfd987164d249593aa8cd27d0ce9",pId:"0400a7ff96c044f68cfc8130a2f0cc1b", name: "未标题-1", tagsName: null, ext: ".jpg", },
            { id: "12f77e914a6e4fc7839d32ba79faaa91",pId:"0f8cdfd987164d249593aa8cd27d0ce9", name: "321", tagsName: null, ext: null, fileUrl: null, },
            { id: "205d12ceb6654a1da57a6dab88c531e4",pId:"12f77e914a6e4fc7839d32ba79faaa91", name: "17：22", tagsName: null, ext: null, },
            { id: "3616f123b55644e890b7a238c3dddbda",pId:"205d12ceb6654a1da57a6dab88c531e4", name: "全家福", tagsName: null, ext: ".jpg", },
            { id: "3d78d845da86441e9e75d4291a2c5238", pId:"3616f123b55644e890b7a238c3dddbda", name: "公共模型库", tagsName: null, ext: null, },
            { id: "4140c6e4911d4836a43011961534effb", name: "全家福", tagsName: null, ext: ".jpg", },
            { id: "4c7de7f2a6884583af9103501dc44d70", name: "2020-1-19", tagsName: null, ext: null, },
            { id: "63c26362df0b4ab2a6c57a2e0031f1aa",pId:"4c7de7f2a6884583af9103501dc44d70", name: "1111", tagsName: null, ext: null, },
            { id: "64d38371deb44fec9e9b1b3c1b732f91", name: "全家福", tagsName: null, ext: ".jpg", },
            { id: "71ad71223ed14e738fbcf4e130b1da66", name: "77777777777", tagsName: null, ext: null, },
            { id: "8018ee418a35450ea164220086e429a5", name: "12121212", tagsName: null, ext: null, },
            { id: "83653b19d2554083889d11c73e8ee4ba", name: "全家福", tagsName: null, ext: ".jpg", },
            { id: "8aa3bb7a8d51428c8b92b8d451bc75a7", name: "789765456465", tagsName: null, ext: null, },
            { id: "96665fb797db45a69f091dc5ea669412", name: "123132", tagsName: null, ext: null, },
            { id: "96ee042c43224a169ef5a8c854720bc7", name: "369", tagsName: null, ext: null, fileUrl: null, }
      ],     
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
