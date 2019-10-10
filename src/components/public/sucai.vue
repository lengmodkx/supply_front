<template>
     <div class="file">
        <div :class="show?'file-side-show':'file-side'">
        <v-jstree  :data="treeData"  @item-click="treeClick"></v-jstree>
        </div>
        <div class="file-button" @click='show=!show'>
        <div class="root__3UYM" :class="show?'left':'right'">
            <i class="left__1DdF"></i>
            <i class="indicator__1TO8"></i>
        </div>
        </div>

        <div class="file-view-wrap fade in">
        <header class="file-header">
            <div class="file-header-title">
            <!-- <span v-show='breadcrumb.length' @click="breadcrumbClick(item.fileId)" v-for="(item) in breadcrumb" :key="item.fileId">{{item.fileName}}＞</span> -->
            素材库
            </div>           
        </header>

         <div class="input-box" style="padding:10px 20px 10px 20px;">
            <div class="input-box-left">
            <Input search enter-button placeholder="请输入搜索" style="width:350px;margin-right:20px;" @on-search="search" v-model="searched" />
            
            </div>
            <div class="icon-box">
            <Icon type="ios-apps" @click="view='view'" />
            <Icon type="ios-list" @click="view='list'" />
            </div>
        </div>
        <Loading v-if="loading"></Loading>

         <div class="file-home">
        <div class="main-content">
            <div v-if="isSearch" style="width: 100%">
                <!--缩略图模式搜索-->
                <ul v-show="view==='view'" class="view-file-box">
                    <li v-for="(file, index) in searchData" :key="index" @click="goNext(file.catalog, file.fileId)" :class="{'cur':file.catalog}">
                        <Poptip trigger="hover" @click.stop class="poptip" width="200" @on-popper-hide="popHid" @on-popper-show="fileName=file.fileName">
                            <Icon class="deletes" type="ios-arrow-dropdown" size="20" />
                            <div slot="title" style="text-align: center">
                                <Icon class="go-return" v-show="opearteShow!=='文件菜单'" type="ios-arrow-back" @click="opearteShow='文件菜单'" />
                                {{opearteShow}}
                            </div>
                            <div slot="content">
                                <div class="opearte-list" v-show="opearteShow==='文件菜单'">
                                    <p @click="opearteShow='修改文件名称'">修改文件名称</p>
                                    <p @click="downLoad(file.fileId)">下载文件</p>
                                    <p @click="opearteShow='删除文件'">删除文件</p>
                                </div>
                                <div class="change-name" v-show="opearteShow==='修改文件名称'">
                                    <Input v-model="fileName" />
                                    <Button @click="changeFileName(file.fileId)" style="margin-top: 10px;display: block" type="info" long>确定</Button>
                                </div>
                                <!-- <div class="change-name" v-show="opearteShow==='删除文件'">
                                    <p>您确定要删除该文件吗</p>
                                    <Button @click.stop="deleteFile(file.fileId)" style="margin-top: 10px" type="error" long>删除</Button>
                                </div> -->
                            </div>
                        </Poptip>

                        <div class="top-img" v-if="file.catalog">
                            <img src=' @/assets/images/folder.png'>
                        </div>
                        <div class="top-img" v-else>
                            <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                            <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
                            <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
                            <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
                            <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
                            <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
                            <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
                            <img v-else src="@/icons/img/moren.png" alt="">
                        </div>
                        <p class="bottom-font">{{file.fileName}}</p>
                    </li>
                </ul>
                <!--列表模式搜索-->
                <ul v-show="view==='list'" class="list-file-box">
                    <div class="list-file-title">
                        <span>名称</span>
                        <span>大小</span>
                        <span>创建者</span>
                        <span>更新时间</span>
                    </div>
                    <li v-for="(file, index) in searchData" :key="index" >
                        <div class="list-file-part" @click="goNext(file.catalog, file.fileId)">
                            <div class="list-file-img" v-if="file.catalog">
                                <img src='@/assets/images/folder.png'>
                            </div>
                            <div class="list-file-img" v-else>
                                <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                                <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
                                <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
                                <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
                                <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
                                <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
                                <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
                                <img v-else src="@/icons/img/moren.png" alt="">
                            </div>
                            <p>{{file.fileName}}</p>
                        </div>
                        <div class="list-file-part">{{file.size}}</div>
                        <div class="list-file-part">平台</div>
                        <div class="list-file-part">{{file.updateTime | timeFilter}}</div>
                        <div class="list-file-part opeart-icon">
                            <Tooltip v-if="!file.catalog" content="下载" style="margin-right: 15px">
                                <Icon type="md-arrow-down" @click="downLoad(file.fileId)" />
                            </Tooltip>
                            <!-- <Tooltip content="删除">
                                <Icon type="ios-trash-outline"  @click.stop="deleteFile(file.fileId)" />
                            </Tooltip> -->


                        </div>

                    </li>
                </ul>
            </div>
            <div v-else style="width: 100%;">
                <!--缩略图模式-->
                <ul v-if="view==='view'" class="view-file-box">
                    <li v-for="(file, index) in allFile" :key="index" @click="goNext(file.catalog, file.fileId)" :class="{'cur':file.catalog}">
                        <Icon class="xiazai" v-if="!file.catalog" @click="downLoad(file.fileId)" type="md-cloud-download" />
                        <div class="top-img" v-if="file.catalog">
                            <img src='@/assets/images/folder.png'>
                        </div>
                        <div class="top-img" v-else>
                            <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                            <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
                            <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
                            <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
                            <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
                            <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
                            <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
                            <img v-else src="@/icons/img/moren.png" alt="">
                        </div>
                        <p class="bottom-font">{{file.fileName}}</p>
                    </li>
                </ul>
                <!--列表模式-->
                <ul v-if="view==='list'" class="list-file-box">
                    <div class="list-file-title">
                        <span>名称</span>
                        <span>大小</span>
                        <span>创建者</span>
                        <span>更新时间</span>
                    </div>
                    <li v-for="(file, index) in allFile" :key="index" >
                        <div class="list-file-part" @click="goNext(file.catalog, file.fileId)">
                            <div class="list-file-img" v-if="file.catalog">
                                <img src='@/assets/images/folder.png'>
                            </div>
                            <div class="list-file-img" v-else>
                                <img v-if="file.fileThumbnail" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${file.fileThumbnail}`" />
                                <img v-else-if="'.txt'.includes(file.ext)" src="@/icons/img/txt.png" alt="">
                                <img v-else-if="'.doc'.includes(file.ext)||'.docx'.includes(file.ext)" src="@/icons/img/word.png" alt="">
                                <img v-else-if="'.xls'.includes(file.ext)||'.xlsx'.includes(file.ext)" src="@/icons/img/excel.png" alt="">
                                <img v-else-if="'.pdf'.includes(file.ext)" src="@/icons/img/pdf.png" alt="">
                                <img v-else-if="'.pp'.includes(file.ext)" src="@/icons/img/ppt.png" alt="">
                                <img v-else-if="'.zip'.includes(file.ext)||'.rar'.includes(file.ext)" src="@/icons/img/zip.png" alt="">
                                <img v-else src="@/icons/img/moren.png" alt="">
                            </div>
                            <p>{{file.fileName}}</p>
                        </div>
                        <div class="list-file-part">{{file.size}}</div>
                        <div class="list-file-part">平台</div>
                        <div class="list-file-part">{{file.updateTime | timeFilter}}</div>
                        <div class="list-file-part opeart-icon">
                            <Tooltip v-if="!file.catalog" content="下载" style="margin-right: 15px">
                                <Icon type="md-arrow-down" @click="downLoad(file.fileId)" />
                            </Tooltip>
                            <!-- <Tooltip content="删除">
                                <Icon type="ios-trash-outline"  @click.stop="deleteFile(file.fileId)" />
                            </Tooltip> -->
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!--分页-->
        <div class="page">
            <Page :page-size="10"  :current="pageNum"  :total="total" @on-change="clickPage" />
        </div>
      </div>
        </div>
        <div class="finish-down" id='finishDown'>
          
        已下载
       </div>
  </div>

</template>
<script>
import VJstree from "vue-jstree";
import {getSuCaiTreeDate,getSucai,getSuCaiTree,getSucaiSearch} from '@/axios/fileApi'
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
    export default {
        data () {
            return {
                searched: "",
                loading: true,
                show: true,
                showModel: false,
                showCommon: false,
                fileId:this.$route.params.id,
                projectId: '',
                showAddFolder: false,
                folderName: '',
                wjj: 0,
                allFile:[],
                total: 0,
                pageNum: 1,
                view: 'view',
                searchFont: '',
                isSearch: false,
                searchData: [],
                opearteShow: '文件菜单',
                fileName: '',
                treeData:[],
                flagTree:false,
                treeId:'',
                
            }
        },
        components : {
              VJstree,
        },
        mounted () {
           
            this.init();
            // this.treeInit();
        },
        computed: {
             ...mapState("file", ["files", "filePath", "tags", "breadcrumb"])
        },
        watch: {
            '$route'(to, from) {
              
                if(to.params.id != from.params.id){
                    this.fileId=to.params.id
                      this.pageNum=1
                      this.init();//重新加载数据
                }
            },

            searched: function(val, oldVal) {            
                if(val!=oldVal){
                  this.pageNum=1
                }              
             },
             deep: true

        },
        updated:function(){

          //  this.$nextTick(function(){
          //   var button = document.getElementById('finishDown');
          //   var file=document.getElementsByClassName("file")[0]
          //  console.log(file.scrollHeight)
          //   })
            
        },
        methods: {
          // 选中要移动到哪
          treeClick(node) {
            
              this.searched='';//重置搜索
              this.flagTree=true;
              this.treeId=node.data.id
              getSuCaiTreeDate(this.treeId,this.page-1).then(res => {
                this.allFile =res.data
                this.total = res.totle
                this.page=res.page+1
                this.pageNum=res.page+1
              });
          },
            // treeInit(){
            // },
            // 分页
            clickPage (data) {
                this.pageNum=data
                if(this.flagTree){
                    //树形分页
                    getSuCaiTreeDate(this.treeId,this.pageNum-1).then(res => {                    
                    this.allFile =res.data
                    this.total = res.totle
                    this.pageNum=res.page+1
                  });
                  return
                }
               
               if(this.searched){
                  //搜索
                 this.search(this.searched)
                 return
               }              
                 getSucai(this.fileId,this.pageNum-1).then(res => {
                    if (res.result) {
                        this.loading = false;
                        this.allFile =res.data.records
                        this.total = res.data.total
                        this.pageNum=res.data.pages+1
                    }
                });
              
            },

            // 初始化 页面信息和分页
            init () {
                getSucai(this.fileId,this.pageNum-1).then(res => {
                    if (res.result) {
                        this.loading = false;
                        this.allFile =res.data.records
                        this.total = res.data.total
                        // this.pageNum=res.data.pages+1
                    }
                });
                 getSuCaiTree('ef6ba5f0e3584e58a8cc0b2d28286c93').then(res => {
                    this.treeData=res.data;
                })             
            },
           // 搜索文件
            search(value) {
                 
                if (value !== "") {
                    this.loading = true;
                    getSucaiSearch(value,this.pageNum-1).then(res => {
                        if (res.result) {
                            this.loading = false;
                            this.allFile =res.data
                            this.total = res.totle
                        }
                    });
                  
                } else {
                     this.$Notice.warning({
                        title: "请输入搜索关键字"
                      });
               }
            },

            // 点击的是文件夹
            goNext (type, id) {
                if (type){
                    this.$router.push(`/sucai/${id}`)
                }
            },
            

            // 下载文件
            downLoad (fileId) {
                window.location.href =
                    process.env.NODE_ENV == "development"
                        ? "/api/files/" + fileId + "/download"
                        : process.env.VUE_APP_URL + "/files/" + fileId + "/download";
            },
            popHid() {
                setTimeout(() => {
                    this.opearteShow='文件菜单'
                }, 300);
            },
          
        }
    }
</script>
<style scoped lang="less">
@import "./file";
    .file-home{
      padding-top:20px;
    }
    .main-content{
        width: 100%;
        display: flex;
        min-height: calc(100vh - 480px) ;
        position: relative;
        .left-tree{
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 200px;
            flex: none;
            border-right: 1px solid #f5f5f5;
            /deep/ .tree-anchor{
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    @media screen and (max-width:1440px){
          
            .main-content{
               min-height: calc(100vh - 480px) ;
            }
          
        }

    .bth-box{
        display: flex;
        margin-bottom: 40px;
        justify-content: space-between;
        padding: 20px 20px 0 20px;
        button{
            margin-right: 20px;
        }
        .search-file{
            width: 400px;
            margin-left: -250px;
        }
        .icon-box{
            display: flex;
            align-items: center;
            i{
                color: gray;
                margin-left: 15px;
                cursor: pointer;
            }
            .now-view{
                color: #2d8cf0;
            }
        }
    }
    .list-file-box{
        width: 100%;
       
        display: flex;
        flex-direction: column;
        align-items: center;
        .list-file-title{
            width: 90%;
            height: 50px;
            display: flex;
            span{
                height: 100%;
                line-height: 50px;
                font-size: 14px;
                text-align: center;
                width: 15%;
            }
            span:nth-of-type(1){
                width: 40%;
                text-align: left;
            }
        }
        li{
            width: 90%;
            height: 50px;
            border-bottom: 1px solid #e5e5e5;
            list-style: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            &:hover{
                background-color: #f5f5f5;
                .opeart-icon{
                    display: flex;
                }
            }
            .list-file-part{
                text-align: center;
                width: 15%;
                display: flex;
                align-items: center;
                justify-content: center;
                .list-file-img{
                    width: 32px;
                    height: 32px;
                    margin-right: 10px;
                    flex: none;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                p{
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .list-file-part:nth-of-type(1){
                width: 40%;
                text-align: left;
                justify-content: left;
            }
            .opeart-icon{
                display: none;
                i{
                    font-size: 20px;
                    &:hover{
                        color: #2db7f5;
                    }
                }
            }

        }
    }
    .view-file-box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 0 20px;
        .cur{
            cursor: pointer;
        }
        li{
            width: 165px;
            height: 200px;
            margin-right: 16px;
            margin-bottom: 16px;
            list-style: none;
            position: relative;
            &:hover{
                .deletes{
                    display: block;
                }
                .xiazai{
                    display: block;
                }
            }
            .xiazai{
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 24px;
                cursor: pointer;
                color: gray;
                display: none;
                &:hover{
                    color: #3da8f5;
                }
            }
            .poptip{
                position: absolute;
                top: 2px;
                right: 2px;
            }
            .deletes{
                display: none;
                cursor: pointer;
                &:hover{
                    color: #2db7f5;
                }
                /*i{*/
                /*cursor: pointer;*/
                /*font-size: 20px;*/
                /*color: #2db7f5;*/
                /*&:hover{*/
                /*color: #ed4014;*/
                /*}*/
                /*}*/
            }
            .top-img{
                width: 165px;
                height: 165px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #e5e5e5;
                img{
                    max-width: 90%;
                    max-height: 90%;
                }
            }
            .bottom-font{
                margin-top: 5px;
                height: 30px;
                width: 100%;
                font-size: 12px;
                line-height: 30px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

         @media screen and (max-width:1440px){
          
         
                  li{
                width: 150px;
                height: 150px;
                
                .top-img{
                    width: 106px;
                    height:106px;
                }
                .bottom-font{
                margin-top: 5px;
                height: 30px;
                width: 106px;
                font-size: 12px;
                line-height: 30px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

        }
    }

    
        
    .page{
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .opearte-list p{
        width: 100%;
        height: 30px;
        padding: 0 8px;
        line-height: 30px;
        cursor: pointer;
        color: #333;
        &:hover{
            background-color: #f5f5f5;
        }
    }
    .go-return{
        position: absolute;
        left: 0;
        font-size: 20px;
        cursor: pointer;
        &:hover{
            color: #2db7f5;
        }
    }
    .view-file-box{
        /deep/ .ivu-poptip-body{
            padding: 8px 0 !important;
        }
    }
    .change-name{
        width: 170px;
        margin: 0 auto;
    }

.file{
    padding-top:50px;
}

    .input-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .input-box-left {
    display: flex;
    .circle {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      float: left;
      margin: 5px 5px 0 0;
    }
  }
  .icon-box {
    color: #2d8cf0;
    line-height: 22px;
    font-size: 22px;
    i {
      cursor: pointer;
      padding-left: 10px;
    }
    i:last-child {
      font-size: 34px;
      font-weight: bold;
    }
  }
}

.can-see-modal {
  /deep/ .ivu-modal-body {
    padding: 0 !important;
    height: 480px;
  }
}

.no-files {
  width: 100%;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
  i {
    font-size: 40px;
  }
  p {
    font-size: 14px;
    margin-top: 10px;
  }
}
.project-main {
  background: #f7f7f7;
}
.file-view-wrap {
  width: 1000px;
  min-height: 300px;
  border-radius: 4px;
  background-color: #ffffff;
  margin: 0 auto;
}

.fade.in {
  opacity: 1;
}
.fade {
  opacity: 0;
  transition: opacity 0.15s linear;
}
.file-header {
  height: 60px;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
}
.file-header-title {
  font-size: 18px;
  line-height: 60px;
  float: left;
  display: flex;
  span {
    margin-right: 10px;
    cursor: pointer;
  }
}
.file-header-add {
  float: right;
  line-height: 60px;
}
.file-header-add a {
  font-size: 16px;
  margin-left: 15px;
  .icon-file {
    margin-right: 5px;
    vertical-align: middle;
  }
}
.folder-add {
  border: 1px solid #e5e5e5;
  width: 164px;
  height: 164px;
  text-align: center;
  line-height: 164px;
  .icon-folder {
    font-size: 32px;
  }
}
.ivu-dropdown-menu {
  width: 180px;
}
.folderName {
  width: 320px;
  margin-bottom: 15px;
  margin-top: 10px;
  margin-left: 0px;
}
.file-operate {
  line-height: 60px;
}

.file-content-wrap {
  // display: flex;
  // flex-wrap: wrap;
 //justify-content: flex-start;
  height: calc(100vh - 250px);
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  li {
      float: left;
    height: 200px;
    position: relative;
    .important{
      position: absolute;
      font-size: 12px;
      bottom: 0;
      right: 0;
      transform: rotate(-45deg);
      z-index: 300;
      width: 26px;
      height: 26px;
      line-height: 30px;
      color: white;
      &:after{
        position: absolute;
        bottom: 2px;
        right: -7px;
        content: '';
        width: 0;
        height: 0;
        border-width: 20px;
        border-style: solid;
        z-index: -1;
        border-color: #ed4014 #ed4014 transparent transparent;
        transform: rotate(135deg);
      }
    }
  }
  .file-content-filename {
    height: 30px;
    margin-left: 20px;
    text-align: center;
    line-height: 30px;
    &:hover {
      background: #f7f7f7;
    }
  }
  .file-content-view {
    border: 1px solid #e5e5e5;
    height: 160px;
    width: 160px;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .file-content-view-checkbox {
      position: absolute;
      left: 3px;
      display: block;
    }
    .ivu-icon-folder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .file-content-opt {
      position: absolute;
      display: flex;
      width: 25px;
      height: 25px;
      top: 0;
      right: 0;
      justify-content: space-between;
      i {
        display: none;
      }
    }
    &:hover i {
      display: block;
    }
  }
}
.ivu-checkbox-large .ivu-checkbox-inner {
  width: 24px;
  height: 24px;
}
.footer {
  .footer-left {
    display: flex;
  }

  display: flex;
  justify-content: space-between;
  .footer-privacy-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .ivu-icon {
    margin-right: 10px;
  }
}

.file-handler {
  height: 40px;
  font-size: 14px;
  padding-left: 15px;
  line-height: 40px;
  &:hover {
    background: #f7f7f7;
  }
}
.optactive {
  display: block;
  position: absolute;
  bottom: 0;
  width: 160px;
  height: 25px;
  text-align: center;
  .arrow_down {
    margin-right: 10px;
  }
  svg {
    width: 20px;
    height: 20px;
  }
}
.move-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.move-and-mobile-file {
  display: flex;
}
.flex-static {
  flex-shrink: 0;
}
.column-projects {
  width: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 438px;
  border-right: 1px solid #e5e5e5;
  .project-title {
    font-size: 14px;
    color: gray;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
  }
  .project-list {
    height: 30px;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
    padding-left: 14px;
  }
}
.selected {
  background: #3da8f5;
  color: white;
  height: 30px;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 30px;
  padding-left: 10px;
}
.unselected {
  &:hover {
    background: #eee;
  }
  height: 30px;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 30px;
  padding-left: 10px;
}

.file-folder-opt {
  li {
    height: 35px;
    line-height: 35px;
    padding-left: 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #e5e5e5;
    }
  }
}
.picker-column {
  display: flex;
  flex-direction: column;
  min-width: 0%;
  background-color: #fff;
}
.flex-fill {
  flex: 1 1 auto;
}
.menu-file-title {
  height: 40px;
  line-height: 40px;
}
.menu-file {
  margin-right: 15px;
  i {
    cursor: pointer;
    font-size: 20px;
    &:hover {
      color: #3da8f5;
    }
  }
  /deep/ .ivu-poptip-body {
    padding: 0;
  }
  .footer {
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
    .footer-left {
      display: flex;
    }

    display: flex;
    justify-content: space-between;
    .footer-privacy-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .ivu-icon {
      margin-right: 10px;
    }
  }
}
.rublish {
  padding-bottom: 15px;
  .rublish-input {
    margin: 15px 0;
  }
  .rublish-header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e5e5e5;
    i {
      color: grey;
      font-size: 20px;
      font-weight: 400;
      cursor: pointer;
    }
  }
  p {
    margin: 15px 0;
    font-size: 14px;
  }
}
.nopadding {
  /deep/ .ivu-modal-body {
    padding: 0;
  }
  /deep/ .ivu-modal-close {
    z-index: 999999;
  }
}
.finish-down{
   width:60px;
   height: 60px;
   border-radius: 50%;
   position: fixed;
   bottom: 30px;
   right: 30px;
   text-align: center;
   line-height: 60px;
   color:#2d8cf0; 
   border:2px solid #2d8cf0;
}

</style>