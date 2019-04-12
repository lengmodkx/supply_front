<template>
    <!-- 收藏 -->
    <div >
        <div class="inner collect">
            <!-- 头部 -->
            <div class="header1">
                <div class="h1_title">
                    <Poptip placement="bottom-start" v-model="collectVisible">
                        <span class="showchoose">{{collectType}}<Icon type="ios-arrow-down" style="margin-left:6px;"></Icon></span>
                        <div slot="content">
                            <ul class="selectlist">
                                <li @click="chooseCollectType(1,'所有收藏')"><span class="myiconBox"><Icon type="ios-heart-outline"></Icon></span>所有收藏<svg-icon name="right" v-if="activeCollect==1"></svg-icon></li>
                                <li @click="chooseCollectType(2,'任务')"><span class="myiconBox"><Icon type="md-checkbox-outline" /></span>任务<svg-icon name="right" v-if="activeCollect==2"></svg-icon></li>
                                <li @click="chooseCollectType(3,'分享')"><span class="myiconBox"><Icon class="shareIcon" type="ios-paper-outline"></Icon></span>分享<svg-icon name="right" v-if="activeCollect==3"></svg-icon></li>
                                <li @click="chooseCollectType(4,'文件')"><span class="myiconBox"><Icon type="ios-document-outline" /></span>文件<svg-icon name="right" v-if="activeCollect==4"></svg-icon></li>
                                <li @click="chooseCollectType(5,'日程')"><span class="myiconBox"><Icon class="dayIcon" type="ios-calendar-outline"></Icon></span>日程<svg-icon name="right" v-if="activeCollect==5"></svg-icon></li>
                            </ul>
                        </div>
                    </Poptip>
                </div>
            </div>
            <!-- 内容 -->
            <div class="favoriteList">
                <ul class="favoriteItem">
                    <li>
                        <div class="item-header">
                            <div class="create-time">9月26日</div>
                            <div class="unfavorite">取消收藏</div>
                        </div>
                        <div class="item-title clearfix">
                            <span class="myiconBox"><Icon class="dayIcon" type="ios-calendar-outline"></Icon></span>
                            <span class="img"><img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" /></span>
                            <span class="title">哈哈哈哈哈</span>
                            <span class="update fr">已更新</span>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
export default {
  data () {
      return {
          collectType:'所有收藏'
      }
  }
}
</script>

<style scoped lang="less">
@import "../Mine";
</style>