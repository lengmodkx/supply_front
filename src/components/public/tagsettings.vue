<template>
  <div class="tag-con">
    <div class="tag-left">
      <Poptip  class="creat-tag" v-model="createTag" transfer>
        <div class="creat-tag-show"><Icon type="md-add-circle" />新标签</div>
        <div slot="content">
          <createTag @closeTag="createTag=false"></createTag>
        </div>
      </Poptip>
      <ul class="tag-ul">
        <li class="tag-li" :class="{checked:nowIndex===index}"
            v-for="(tag,index) in tags" :key="index" >
          <div class="tag-con" @click="showTagDetail(tag,index)">
            <span :style="{background:tag.bgColor}"></span>
            <p>{{tag.tagName}}</p>
          </div>
          <Poptip @click.stop  v-model="tag.showOpearte" transfer @on-popper-hide="closeOpearte(index)">
            <Icon class="tag-opearte" type="ios-arrow-down" size="20" />
            <div slot="content">
              <div v-show="tagOpearte==='a'" class="tag-menus">
                <div class="headers">标签菜单<Icon class="close-opearte" @click="closeOpearte(index)" type="md-close" size="20"></Icon></div>
                <p @click="tagOpearte='b'"><Icon type="md-create" />编辑标签</p>
                <p @click="tagOpearte='c'"><Icon type="ios-trash" />移到回收站</p>
              </div>
              <div v-show="tagOpearte==='b'">
                <createTag :isEdit="true" :tag="tag" :tagNames="tag.tagName" @returnTag="tagOpearte='a'" @closeTag="closeOpearte(index)"></createTag>
              </div>
              <div style="width: 210px" v-show="tagOpearte==='c'">
                <div class="headers">
                  <Icon @click="tagOpearte='a'" class="return-tag" type="ios-arrow-back" size="20" ></Icon>
                  移到回收站<Icon class="close-opearte" @click="closeOpearte(index)" type="md-close" size="20"></Icon>
                </div>
                <p style="margin: 10px 0">您确定要把该标签移到回收站吗？</p>
                <Button type="error" long :loading="btnLoading" @click="removeTag(tag, index)">移到回收站</Button>
              </div>
            </div>
          </Poptip>
        </li>
      </ul>
    </div>
    <div class="tag-right" v-if="nowTag">
      <div class="tag-right-title">
        <p style="margin-right: 10px"><span :style="{background:nowTag.bgColor}"></span>{{nowTag.tagName}}</p>
        <p>{{nowTag.taskList.length}}项任务，</p> <p>{{nowTag.scheduleList.length}}个日程，</p> <p>{{nowTag.shareList.length}}篇分享，</p> <p>{{nowTag.fileList.length}}个文件</p>
      </div>
      <div class="tag-right-con">
        <!--任务-->
        <div class="tag-right-view" v-if="nowTag.taskList.length">
          <h3>任务 ・ {{nowTag.taskList.length}}</h3>
          <ul class="right-view-ul">
            <li class="task-li" v-for="(i,n) in nowTag.taskList" :key="n">
              <div class="tiao"></div>
              <Checkbox  v-model="i.complete"></Checkbox>
              <img src="" alt="">
              <p class="task-name">{{i.taskName}}</p>
              <p class="gray-color">我是任务分组</p>
            </li>
          </ul>
        </div>
        <!--日程-->
        <div class="tag-right-view" v-if="nowTag.scheduleList.length">
          <h3>日程 ・ {{nowTag.scheduleList.length}}</h3>
          <ul class="right-view-ul">
            <li class="schedule-li" v-for="(i,n) in nowTag.scheduleList" :key="n">
              <p>{{i.scheduleName}}</p>
              <p class="gray-color">5月18日-5月19日</p>
            </li>
          </ul>
        </div>
        <!--分享-->
        <div class="tag-right-view" v-if="nowTag.shareList.length">
          <h3>分享 ・ {{nowTag.shareList.length}}</h3>
          <ul class="right-view-ul">
            <li class="share-li" v-for="(i,n) in nowTag.shareList" :key="n">
              <p>{{i.title}}</p>
              <p class="gray-color">5月18日-5月19日</p>
            </li>
          </ul>
        </div>
        <!--文件-->
        <div class="tag-right-view" v-if="nowTag.fileList.length">
          <h3>文件 ・ {{nowTag.fileList.length}}</h3>
          <ul class="right-view-ul">
            <li class="file-li"  v-for="(i,n) in nowTag.fileList" :key="n">
              <div>
                <img src="@/icons/img/moren.png" alt="">
                <span>{{i.fileName}}</span>
              </div>
              <p class="gray-color">5月18日-5月19日</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import createTag from './createTag'
import { mapState, mapActions, mapMutations} from "vuex";
import {receclyTag} from '@/axios/api'
export default {
  data() {
    return {
      createTag:false,
      tagOpearte: 'a',
      nowIndex: -1,
      nowTag: null,
      btnLoading:false,
    };
  },
  components: {createTag},
  mounted() {
    this.getTags(this.$route.params.id);
  },
  computed: {
    ...mapState("tag", ["tags"])
  },
  methods: {
    ...mapActions("tag", ["getTags"]),
    ...mapMutations('tag', ['closeMenu','removeTagBin']),
    // 关闭标签 菜单框
    closeOpearte (n) {
      this.closeMenu(n)
      setTimeout(() => {
        this.tagOpearte='a'
      },300)
    },
    // 点击左侧标签
    showTagDetail (tag, i) {
      console.log(tag)
      this.nowIndex=i
      this.nowTag=tag
    },
    // 标签移到回收站
    removeTag (tag,index) {
      this.btnLoading=true
      receclyTag (tag.tagId).then(res => {
        if (res.result){
          this.btnLoading=false
          this.closeOpearte(index)
          this.removeTagBin(tag.tagId)
        }
      })
    },
  }
};
</script>

<style scoped lang="less">
@import "./tagsettings";
</style>

