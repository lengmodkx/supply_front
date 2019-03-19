<template>
  <Poptip class="task-menuwrapper"
          placement="bottom"
          transfer
          v-model="visible">
    <Button type="text"
            style="outline:none !important;box-shadow:none !important;padding:0;">
      <Icon type="ios-more"
            style="font-size: 20px;
          color: #a6a6a6;"></Icon>
    </Button>
    <div slot="content"
         class="task-menuwrapper-content">
      <div class="dropdownTitle">
        <span class="back">
          <span v-if="active!=-1"
                @click="active=-1">
            <svg-icon class="backicon"
                      name="back"></svg-icon>
          </span>
        </span>
        {{topTitle}}
        <span class="guanbi"
              @click="visible=false">
          <svg-icon class="closePop"
                    name="close"></svg-icon>
        </span>
      </div>
      <div class="task-menu-list"
           v-if="active==-1">
        <div class="menuItem"
             @click="listItemClick(0,'编辑任务分组')">
          <svg-icon class="svgicon"
                    name="edit"
                    style="width:18px;height:20px;top:6px;"></svg-icon>编辑任务分组</div>
        
        <div class="menuItem"
             @click="listItemClick(3,'复制任务分组')">
          <svg-icon class="svgicon"
                    name="time"></svg-icon>复制任务分组</div>
        <div class="menuItem"
             @click="listItemClick(4,'移动任务分组')">
          <svg-icon class="svgicon"
                    name="moveTo"></svg-icon>移动任务分组</div>
        <div class="menuItem"
             @click="listItemClick(5,'移到回收站')">
          <svg-icon class="svgicon"
                    name="delete"></svg-icon>移到回收站</div>
      </div>

      <!-- 内容部分的盒子： -->
      <div class="task-menu-detail">
        <div class="con1"
             v-if="active==0">
          <div>
            <Input :autofocus="true"
                   placeholder="任务分组名称" />
            <br> <br>
            <Input type="textarea"
                   placeholder="任务分组描述"
                   :autosize="{minRows: 2,maxRows: 5}" />
            <br><br>
          </div>
          <div>
            <Button type="primary"
                    size="large"
                    long>保存</Button>
          </div>
        </div>
        
        <div class="con5"
             v-if="active==3">
          <Input v-model="value1" placeholder="查找项目"/>
          <div class="project-itemlist">
              <ul>
                <li class="project-item clearfix" v-for="(i,index) in projectList" :key="index">
                  <span>{{i.name}}</span>
                  <span><Icon type="android-alert"></Icon></span>
                  <span class="fr"><svg-icon class="right" name="right"></svg-icon></span>
                </li>
          </ul>
          </div>
          <div calss="foot">
            <p>标题、子任务、备注将被复制</p>
            <Button type="primary" long style="margin-top:10px;">确定</Button>
          </div>
          
        </div>
        <div class="con5"
             v-if="active==4">
          <Input v-model="value1" placeholder="查找项目"/>
          <div class="project-itemlist" style=" height:calc(100% - 32px - 10px - 86px);">
              <ul>
                <li class="project-item clearfix" v-for="(i,index) in projectList" :key="index">
                  <span>{{i.name}}</span>
                  <span><Icon type="android-alert"></Icon></span>
                  <span class="fr"><svg-icon class="right" name="right"></svg-icon></span>
                </li>
          </ul>
          </div>
          <div calss="foot">
            <p>跨项目移动时，部分参与者信息不会保留</p>
            <Button type="primary" long style="margin-top:10px;">确定</Button>
          </div>
        </div>
        <div class="con8"
             v-if="active==5">
          <div class="candelete">
            <h5>分组「任务组名」内所有阶段和任务将被移到回收站，确定移入吗？</h5>
            <Button type="error"
                    long>移到回收站</Button>
          </div>
        </div>
      </div>

    </div>

  </Poptip>

</template>
<script>
export default {
  props: ['data'],
  data () {
    return {
      visible: false,
      active: -1,
      newTask: '',
      curTopTitle: '分组菜单',
      title: this.data.title,
      findMember: '',
      findPro: '',
      notice: [],
      checkedTaskType: null,
      value1:'',
      value2:'',
      projectList:[
        {
          id:1,
          name:"项目一"
        },
        {
          id:2,
          name:"项目二"
        },
        {
          id:3,
          name:"项目三"
        }
      ]
    }
  },
  computed: {
    topTitle () {
      return this.active != -1 ? this.curTopTitle : '分组菜单'
    }
  },
  methods: {
    listItemClick (index, title) {
      this.active = index
      this.curTopTitle = title
    },
    clearAll () {

    },
  }
}
</script>
<style lang="less">
@import './poptipMenu';
</style>

