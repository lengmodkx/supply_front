<template>
    <!-- 收藏 -->
    <div >
        <div class="inner collect">
            <!-- 头部 -->
            <div class="header1">
                <div class="h1_title">
                    <Poptip placement="bottom-start" v-model="collectVisible" @on-popper-hide="getCollect">
                        <span class="showchoose">{{collectType}}<Icon type="ios-arrow-down" style="margin-left:6px;"></Icon></span>
                        <div slot="content">
                            <ul class="selectlist">
                                <li @click="chooseCollectType(1,'所有收藏')"><span class="myiconBox"><Icon type="ios-heart-outline"></Icon></span>所有收藏<Icon class="gou" type="md-checkmark" v-if="activeCollect==1"/></li>
                                <li @click="chooseCollectType(2,'任务')"><span class="myiconBox"><Icon type="md-checkbox-outline" /></span>任务<Icon class="gou" type="md-checkmark" v-if="activeCollect==2"/></li>
                                <li @click="chooseCollectType(3,'分享')"><span class="myiconBox"><Icon class="shareIcon" type="ios-paper-outline"></Icon></span>分享<Icon class="gou" type="md-checkmark" v-if="activeCollect==3"/></li>
                                <li @click="chooseCollectType(4,'文件')"><span class="myiconBox"><Icon type="ios-document-outline" /></span>文件<Icon class="gou" type="md-checkmark" v-if="activeCollect==4"/></li>
                                <li @click="chooseCollectType(5,'日程')"><span class="myiconBox"><Icon class="dayIcon" type="ios-calendar-outline"></Icon></span>日程<Icon class="gou" type="md-checkmark" v-if="activeCollect==5"/></li>
                            </ul>
                        </div>
                    </Poptip>
                </div>
            </div>
            <Loading v-if="loading"></Loading>
            <!-- 内容 -->
            <div class="favoriteList">
                <ul class="favoriteItem" v-if="collectList.length">
                    <li v-for="(c,i) in collectList" :key="i">
                        <div class="item-header">
                            <div class="create-time"><Time :time="c.createTime" /></div>
                            <div class="unfavorite">取消收藏</div>
                        </div>
                        <div class="item-title clearfix">
                            <span class="myiconBox"><Icon class="dayIcon" type="ios-calendar-outline"></Icon></span>
                            <span class="img"><img v-if="c.collectType !== '日程'" :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${c.item.userImage}`" /></span>
                            <span class="title">{{c.item.taskName}}{{c.item.fileName}}{{c.item.title}}{{c.item.scheduleName}}</span>
                            <!--<span class="update fr">已更新</span>-->
                        </div>
                    </li>
                </ul>
                <div v-else class="wu">
                    <img src="../../../icons/img/sys-msg.png" alt="">
                    <p>还没有收藏内容</p>
                </div>
            </div>
        </div>
        <!-- 编辑任务模态框 -->
        <Modal v-model="showTaskModal" class="myModal">
            <my-modal v-if="showTaskModal" ref="myModal" ></my-modal>
        </Modal>
        <!--编辑日程模态框-->
        <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide='true'>
            <editRicheng @close="closeModal"></editRicheng>
        </Modal>
        <!--文件详情-->
        <Modal v-model="showModelDetai" fullscreen :footer-hide="true" class-name="model-detail" :closable="false">
            <fileDetail @close="closeDetail" v-if="showModelDetai"></fileDetail>
        </Modal>
        <!--模型文件详情-->
        <Modal class="nopadding" v-model="showModelFileDetail" fullscreen :footer-hide="true" class-name="model-detail">
            <modelFileDetail :url="svfUrl" v-if="showModelFileDetail"></modelFileDetail>
        </Modal>
    </div>
</template>

<script>
import {collectList} from "@/axios/api"
import myModal from "@/components/project/pages/index/components/EditList"
import editRicheng from "@/components/public/common/EditRicheng"
import fileDetail from "@/components/project/file/fileDetail";
import modelFileDetail from "@/components/project/file/modelFileDetail";
export default {
  data () {
      return {
          collectType:'所有收藏',
          activeCollect:1,
          collectVisible: false,
          collectList:[],
          loading:false,
          showTaskModal: false,
          editrc: false,
          showModelDetai: false,
          showModelFileDetail: false,
          svfUrl:'',
      }
  },
    components:{
        myModal,
        editRicheng,
        fileDetail,
        modelFileDetail
    },
  methods: {
      chooseCollectType (i,name) {
          this.activeCollect=i
          this.collectType=name
          this.collectVisible=false
      },
      getCollect(){
          this.loading = true
          let type=null
          if(this.collectType !== '所有收藏'){
              type=this.collectType
          }
          collectList(type).then(res => {
              if(res.result === 1){
                  this.loading = false
                  this.collectList = res.data
              }
          })
      },
      closeModal () {
          this.editrc=false
      },
      closeDetail() {
          this.showModelDetai = false;
      },
  },
  mounted(){
      this.getCollect()
  }
}
</script>

<style scoped lang="less">
@import "../Mine";
</style>