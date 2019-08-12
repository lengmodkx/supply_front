<template>
    <div class="file-home" style="padding-top: 60px">
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
                                <div class="change-name" v-show="opearteShow==='删除文件'">
                                    <p>您确定要删除该文件吗</p>
                                    <Button @click.stop="deleteFile(file.fileId)" style="margin-top: 10px" type="error" long>删除</Button>
                                </div>
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
                            <Tooltip content="删除">
                                <Icon type="ios-trash-outline"  @click.stop="deleteFile(file.fileId)" />
                            </Tooltip>


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
                            <Tooltip content="删除">
                                <Icon type="ios-trash-outline"  @click.stop="deleteFile(file.fileId)" />
                            </Tooltip>


                        </div>

                    </li>
                </ul>
            </div>
        </div>

        <!--分页-->
        <div class="page">
            <Page :page-size="50" :total="total" @on-change="clickPage" />
        </div>
    </div>
</template>
<script>
import {getSucai} from '@/axios/fileApi'
    export default {
        data () {
            return {
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
            }
        },
        components : {
        },
        mounted () {
            this.init()

        },
        watch: {
            '$route'(to, from) {
                if(to.params.id != from.params.id){
                    this.fileId=to.params.id
                    this.init();//重新加载数据
                }
            }
        },
        methods: {
            // 分页
            clickPage (data) {
                this.pageNum=data
                this.init()
            },
            // 点击的是文件夹
            goNext (type, id) {
                if (type){
                    this.$router.push(`/sucai/${id}`)
                }
            },
            // 初始化 页面信息
            init () {
                getSucai(this.fileId,this.pageNum).then(res => {
                    if (res.result) {
                        this.allFile =res.data.records
                        this.total = res.data.total
                    }
                })
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
    .file-home{
    }
    .main-content{
        width: 100%;
        display: flex;
        min-height: calc(100vh - 94px) ;
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
        width: calc(100% - 220px) ;
        margin-left: 220px;
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

</style>