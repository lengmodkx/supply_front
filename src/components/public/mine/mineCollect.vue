<template>
  <!-- 收藏 -->
  <div>
    <div class="inner collect">
      <!-- 头部 -->
      <Tabs value="任务" @on-click="chooseCollectType">
        <TabPane :label="item.label" :name="item.name" v-for="(item,index) in tablist" :key="index">
          <Loading v-if="loading"></Loading>
          <!-- 内容 -->
          <div class="favoriteList">
            <ul class="favoriteItem" v-if="collectList.length">
              <li v-for="(c, i) in collectList" :key="i">
                <div class="item-header">
                  <div class="create-time"><Time :time="c.createTime" /></div>
                  <div class="unfavorite" @click="cancleCollect(c.publicId)">取消收藏</div>
                </div>
                <div class="item-title clearfix">
                  <span class="myiconBox">
                    <Icon class="dayIcon" type="ios-calendar-outline"></Icon>
                  </span>
                  <span class="img" v-if="c.item.userImage"><img v-if="c.collectType !== '日程'"
                      :src="c.item.userImage" /></span>
                  <span class="img" v-else><img src="../../../assets/images/headUser.png" alt="" /></span>
                  <span
                    class="title">{{ c.item.taskName }}{{ c.item.shareName }}{{ c.item.fileName }}{{ c.item.title }}{{ c.item.scheduleName }}</span>
                  <div :class="[{'past-time':new Date().getTime() > c.item.endTime}, 'collect-time' , 'fr']"
                    v-if="c.item.endTime">
                    <div>{{$moment(c.item.endTime).format("YYYY年MM月DD日")}}&nbsp;&nbsp;截止</div>
                  </div>
                </div>
                <div class="bottom-line"></div>
              </li>
            </ul>
            <div v-else class="wu">
              <img src="../../../icons/img/no-list.png" alt="" />
              <!-- <p>还没有收藏内容</p> -->
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <!-- 编辑任务模态框 -->
    <Modal v-model="showTaskModal" class="myModal">
      <my-modal v-if="showTaskModal" ref="myModal"></my-modal>
    </Modal>
    <!--编辑日程模态框-->
    <Modal class="nopadding" class-name="vertical-center-modal" v-model="editrc" :footer-hide="true">
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
  import {
    collectList,
    cancelCollect
  } from "@/axios/api";
  import myModal from "@/components/project/pages/index/components/EditList";
  import editRicheng from "@/components/project/schedule/EditRicheng";
  import fileDetail from "@/components/project/file/fileDetail";
  import modelFileDetail from "@/components/project/file/modelFileDetail";
  export default {
    data() {
      return {
        collectType: "任务",
        collectList: [],
        loading: false,
        showTaskModal: false,
        editrc: false,
        showModelDetai: false,
        showModelFileDetail: false,
        svfUrl: "",
        tablist: [{
            label: '任务',
            name: '任务'
          },
          {
            label: '分享',
            name: '分享'
          },
          {
            label: '文件',
            name: '文件'
          },
          {
            label: '日程',
            name: '日程'
          },
        ]
      };
    },
    props: ["name", "content"],
    components: {
      myModal,
      editRicheng,
      fileDetail,
      modelFileDetail
    },
    methods: {
      chooseCollectType(name) {
        this.collectType = name;
        this.getCollect()
      },
      cancleCollect(id) {
        cancelCollect(id).then(res => {
          this.$Message.message("成功");
        });
      },
      getCollect() {
        this.loading = true;
        collectList(this.collectType).then(res => {
          if (res.result === 1) {
            this.loading = false;
            this.collectList = res.data;
          }
        });
      },
      closeModal() {
        this.editrc = false;
      },
      closeDetail() {
        this.showModelDetai = false;
      }
    },
    mounted() {
      this.getCollect('任务');
    }
  };
</script>

<style scoped lang="less">
  @import "../Mine";
</style>