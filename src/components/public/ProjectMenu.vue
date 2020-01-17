<template>
  <div class="projectMenu">
    <div class="head">
      项目菜单
      <span class="close" @click="$emit('hideMenuBox')">
        <Icon type="md-close" size="20"></Icon>
      </span>
    </div>
    <ul>
      <li>
        <div class="munu-set" @click="projectSetting">
          <Icon type="ios-settings-outline" size="20"/>
          <p>项目设置</p>
        </div>
      </li>
      <li>
        <div class="munu-set" @click="perset=true">
          <Icon type="ios-settings-outline" size="20"/>
          <p>权限设置</p>
        </div>
      </li>
      <li>
        <div class="munu-set" @click="tagSet=true">
          <Icon type="ios-pricetag-outline" size="20"/>
          <p>标签设置</p>
        </div>
      </li>
      <li>
        <div class="munu-set" @click="lookRecycle=true">
          <Icon type="ios-trash-outline" size="20" />
          <p>查看回收站</p>
        </div>
      </li>
    </ul>
    <!-- 项目设置 -->
    <Modal v-model="projectSet" class="setPro-modal">
      <projectsetting></projectsetting>
    </Modal>
    <!--标签-->
    <Modal class="nopadding" :footer-hide="true" class-name="vertical-center-modal" v-model="tagSet" width="800">
      <p slot="header" style="text-align:center;font-size:16px">
        <span>标签</span>
      </p>
      <tagsettings></tagsettings>
    </Modal>
    <!--回收站-->
    <Modal class="nopadding" class-name="vertical-center-modal" v-model="lookRecycle" width="800" :footer-hide="true">
      <p slot="header" style="text-align:center;font-size: 16px;font-weight: 600">查看回收站</p>
      <recycleBin v-if="lookRecycle"></recycleBin>
    </Modal>
    <Modal v-model="perset" class-name="vertical-center-modal" width="1200" :footer-hide="true" title="项目权限" class="permset">
        <permSettings v-if="perset"></permSettings>
    </Modal>
  </div>
</template>
<script>
import ProjectSettings from "../../views/projectSettings.vue";
import TagSettings from "./tagsettings.vue";
import recycleBin from './recycleBin'
import permSettings from './project-jurisdiction.vue'
import { mapActions } from "vuex";
export default {
  components: { projectsetting: ProjectSettings, tagsettings: TagSettings, recycleBin,permSettings },
  data() {
    return {
      projectSet: false,
      tagSet: false,
      lookRecycle: false,
      perset:false
    };
  },
  methods: {
    ...mapActions("project", ["openSet"]),
    projectSetting() {
      this.projectSet = true;
      this.openSet(this.$route.params.id);
    }
  }
};
</script>
<style scoped lang="less">
.projectMenu {
  position: fixed;
  top: 98px;
  right: -352px;
  z-index: 888;
  width: 350px;
  height: calc(100% - 98px);
  background-color: #f7f7f7;
  transition: 0;
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.1);
  &.animate {
    transition: 0.1s;
  }
  .head {
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    position: relative;
    font-weight: bold;
    width: 320px;
    margin: 0 15px;
    border-bottom: 1px solid #e5e5e5;
    .close {
      cursor: pointer;
      color: lightgray;
      font-size: 20px;
      width: 20px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      &:hover {
        color: #3da8f5;
      }
    }
  }
}
.activeMenu {
  right: 0px;
}

.munu-set {
  display: flex;
  align-items: center;
  color: #111111;
  font-weight: 600;
  padding: 10px;
  &:hover {
    background-color: #e5e5e5;
  }
  margin-top: 8px;
  cursor: pointer;
  p {
    margin-left: 10px;
  }
}
  .nopadding{
    /deep/ .ivu-modal-body{
      padding: 0;
    }
  }
.permset{
    /deep/ .ivu-modal-body{
      padding: 0;
    }
  }
</style>
