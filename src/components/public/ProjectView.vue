<template>
  <div class="projectMember">
    <div class="head">
      项目视图
      <span class="close" @click="$emit('hideMenuBox')">
        <Icon type="md-close"></Icon>
      </span>
    </div>
    <!-- <div class="searchBox">
        <Input v-model.trim="keyword" search enter-button  placeholder="搜索任务" @on-search="filterTask"/>
    </div> -->
    <!-- <Input class="search" v-model="keyword" placeholder="搜索任务" @on-search="filterTask" /> -->
    <div style="font-size:16px;margin-left:15px"> </div>
    <Select v-model="model" style="width:320px;margin-left:15px" transfer size="large" @on-change="viewChange">
      <Option value="看板视图">看板视图</Option>
      <Option value="列表视图">列表视图</Option>
      <Option value="时间视图">时间视图</Option>
      <Option value="成员视图">成员视图</Option>
    </Select>
  </div>
</template>
<script>
  import {mapMutations,mapActions} from 'vuex'
export default {
  data() {
    return {
      model: '看板视图',
      keyword: '',
      projectId:this.$route.params.id
    }
  },
  methods: {
    ...mapActions("task", ["init","init2"]),
    ...mapMutations('app', ["updateView"]),
    //搜索任务
    filterTask() {
      var data = {projectId:this.projectId,name:this.keyword}
      this.init2(data);
    },
    // 视图方式改变、
    viewChange(value) {
      this.updateView(value)
    }
  }
}
</script>
<style scoped lang="less">
.projectMember {
  position: fixed;
  top: 98px;
  right: -352px;
  z-index: 888;
  width: 350px;
  height: calc(100% - 98px);
  background-color: #f7f7f7;
  transition: 0;
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.1);
    .searchBox{
      width: 320px;
      margin:10px auto;
    }
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
.search {
  width: 320px;
  margin: 10px auto;
  display: block;

  /deep/.ivu-input {
    height: 40px !important;
    font-size: 14px;

    &:focus {
      border-color: #a6a6a6;
      box-shadow: 0 0 0 0;
    }

    &:hover {
      border-color: #a6a6a6;
    }
  }
}
.activeMenu {
  right: 0px;
}
</style>

