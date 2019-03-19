<template>
  <div class="mine">
     <Tabs value="name1" :animated="false" @on-click="$refs.task.updateBar();$refs.richeng.updateBar();$refs.file.updateBar();">
        <!-- 近期的事 -->
        <TabPane label="近期的事" name="name1">
          <div class="inner">
            <!-- <div class="header1"><div class="h1_title">今天的事·1</div></div> -->
            <div class="h1_title">今天的事·1</div>
            <div class="list">
                    <div class="listItem" @click="checkItem()">
                      <div class="task-mod left-color urgent">
                        <div class="check">
                          <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox>
                           <!-- <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava"> -->
                            <div class="cont">
                              根据客户给客户结构
                              <span class="taskgroup">项目一</span>
                              <span class="deadline red fr">9月2日-9月15日</span>
                            </div>
                        </div>
                      </div>
                    </div>

                <div class="listItem" @click="checkRicheng">
                      <div class="task-mod">
                        <div class="check">
                          <Icon type="calendar" size="22" style="color:#b7b7b7;margin-right:10px;"></Icon>
                          <!-- <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox> -->
                            <div class="cont">
                              根据客户给客户结构
                              <span class="taskgroup">项目一</span>
                              <span class="deadline fr">9月2日-9月15日</span>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>

          <div class="h1_title">明天的事·1</div>
            <div class="list">
                    <div class="listItem" @click="checkItem()">
                      <div class="task-mod left-color urgent">
                        <div class="check">
                          <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox>
                           <!-- <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava"> -->
                            <div class="cont">
                              根据客户给客户结构
                              <span class="taskgroup">项目一</span>
                              <span class="deadline red fr">9月2日-9月15日</span>
                            </div>
                        </div>
                      </div>
                    </div>
              </div>

          <div class="h1_title">最近五天的事·1</div>
            <div class="list">
                    <div class="listItem" @click="checkItem()">
                      <div class="task-mod left-color urgent">
                        <div class="check">
                          <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox>
                           <!-- <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava"> -->
                            <div class="cont">
                              根据客户给客户结构
                              <span class="taskgroup">项目一</span>
                              <span class="deadline red fr">9月2日-9月15日</span>
                            </div>
                        </div>
                      </div>
                    </div>
              </div>
          </div>
        </TabPane>
        <!-- 任务 -->
        <TabPane label="任务" name="name2">
          <div class="inner task">
            <Tabs value="mine1" ref="task" :animated="false" class="p20 taskTab">
              <div class="taskselect" slot="extra">
                 <Poptip placement="bottom-end" v-model="visible1">
                    <span class="showchoose">{{comStatus}}<Icon type="ios-arrow-down"></Icon></span>
                    <div slot="content">
                      <ul class="selectlist">
                        <li @click="chooseComplete(1,'未完成')">未完成<svg-icon name="right" v-if="active1==1"></svg-icon></li>
                        <li @click="chooseComplete(2,'已完成')">已完成<svg-icon name="right" v-if="active1==2"></svg-icon></li>
                      </ul>
                    </div>
                </Poptip>
                <Poptip placement="bottom-end" v-model="visible2" v-if="showOrder">
                    <span class="showchoose">{{orderStatus}}<Icon type="ios-arrow-down"></Icon></span>
                    <div slot="content">
                      <ul class="selectlist">
                        <li @click="chooseOrder(1,'按优先级排序')">按优先级排序<svg-icon name="right" v-if="active2==1"></svg-icon></li>
                        <li @click="chooseOrder(2,'按截止时间排序')">按截止时间排序<svg-icon name="right" v-if="active2==2"></svg-icon></li>
                        <li @click="chooseOrder(3,'按创建时间最近排序')">按创建时间最近排序<svg-icon name="right" v-if="active2==3"></svg-icon></li>
                        <li @click="chooseOrder(4,'按项目名称排序')">按项目名称排序<svg-icon name="right" v-if="active2==4"></svg-icon></li>
                      </ul>
                    </div>
                </Poptip>

              </div>
              <TabPane label="我执行的" name="mine1" class="innerBox">
                 <div class="list">
                    <div class="listItem" @click="checkItem()">
                      <div class="task-mod left-color warning">
                        <div class="check">
                          <Checkbox v-model="todayThing" @on-change="finishTask"></Checkbox>
                           <img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200" alt="" class="ava">
                            <div class="cont">
                              根据客户给客户结构
                              <span class="taskgroup">项目一</span>
                              <span class="deadline red fr">9月2日-9月15日</span>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
              </TabPane>
              <TabPane label="我创建的" name="mine2" class="innerBox">
              我创建的
              </TabPane>
              <TabPane label="我参与的" name="mine3" class="innerBox">我参与的</TabPane>
           </Tabs>
          </div>
        </TabPane>
        <!-- 日程 -->
        <TabPane label="日程" name="name3">
          <div class="inner richeng">
            <Tabs value="richeng1" ref="richeng" :animated="false" class="p20">
               <TabPane label="未来的日程" name="richeng1">
                 <div class="innerBox">
                   <!-- 没有日程 -->
                   <div class="hasno" style="display:none;">
                      <div><Icon type="calendar" size="45"></Icon></div>
                      <div style="margin-top:8px;">目前还没有日程</div>
                   </div>
                  <!-- 列表 -->
                  <ul class="event-date-wrap">
                    <p class="event-date">今天·1</p>
                    <li class="event clearfix" @click="checkRicheng">
                       <div class="date fl"><span>9月27日</span><span style="margin-left:5px;">17:00-18:00</span></div>
                       <div class="title fl"><span>日常成为那个</span><span class="taskName">任务名</span></div>
                    </li>
                  </ul>
                
                <ul class="event-date-wrap">
                    <p class="event-date">10月26日·1</p>
                    <li class="event clearfix" @click="checkRicheng">
                       <div class="date fl"><span>9月27日</span><span style="margin-left:5px;">17:00-18:00</span></div>
                       <div class="title fl"><span>日常成为那个</span><span class="taskName">任务名</span></div>
                    </li>
                </ul>

                  </div>
                </TabPane>
               <TabPane label="过去的日程" name="richeng2">
                 <div class="innerBox">
                   <div class="hasno" v-if="treeData.length==0">
                      <div><Icon type="calendar" size="45"></Icon></div>
                      <div style="margin-top:8px;">目前还没有日程</div>
                   </div>
                     <Collapse class="richengTree" v-model="richengShow" accordion>
                        <Panel :name="`str${index}`" v-for="(item,index) in treeData" :key="index">
                            {{item.title}}
                            <div slot="content">
                              <ul class="rclist" v-for="(i,index) in item.children" :key="index">
                                <li class="rcitem clearfix" @click="checkRicheng">
                                  <div class="date fl"><span>9月27日</span><span style="margin-left:5px;">17:00-18:00</span></div>
                                  <div class="title fl"><span>{{i.title}}</span><span class="taskName">{{i.taskName}}</span></div>
                                  </li>
                              </ul>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <!-- 文件 -->
        <TabPane label="文件" name="name4">
          <div class="inner file">
            <Tabs value="file1" ref="file" :animated="false" class="p20">
                 <TabPane label="我创建的" name="file1">
                    <div class="headerBox">
                      <div class="tool1" v-if="checkBoxList.length==0">
                        <span class="tool-name" @click="nameOrder"><span>名称</span><Icon type="arrow-down-b" :class="{show:isShow,up:isUp}"></Icon></span>
                        <span class="tool-size" @click="sizeOrder"><span>大小</span><Icon type="arrow-down-b" :class="{show:isShowsize,up:isUpsize}"></Icon></span>
                        <span class="tool-time">更新时间</span>
                      </div>
                      <div class="tool2" v-if="checkBoxList.length>0">
                        <span class="hasChoose">已选择<a style="padding:0 10px;">{{checkBoxList.length}}</a>项</span>
                        <span v-if="checkBoxList.length==1"><Icon type="ios-upload-outline" size="18"></Icon>更新</span>
                        <span><Icon type="log-out"></Icon>移动</span>
                        <span><Icon type="ios-copy-outline" size="18"></Icon>复制</span>
                        <span><Icon type="ios-heart-outline"></Icon>收藏</span>
                        <span><Icon type="ios-trash-outline" size="18"></Icon>移到回收站</span>
                      </div>
                    </div>
                    <div class="listContent">
                      <!-- 没文件时显示 -->
                      <div class="noFile" v-if="myCreateFile.length==0">
                        <div class="icon"><Icon type="ios-filing-outline"></Icon></div>
                        <div class="text">目前还没有文件</div>
                      </div>
                      <ul class="myfileList">
                        <li v-for="item in myCreateFile" :key="item.id" class="clearfix">
                          <Checkbox class="checkbox" v-model="item.checkbox" @on-change="checkFile(item.id,item.checkbox)"></Checkbox>
                          <img class="fileImg" :src="item.imgurl" alt="">
                          <span class="fileName">{{item.name}}</span>
                          <span class="fileSize">{{item.size}}</span>
                          <span class="updateTime">{{item.createTime}}</span>
                          <div class="caozuo fr">
                            <Tooltip content="下载" placement="top" transfer>
                              <Icon type="ios-download-outline" size="24"></Icon>
                            </Tooltip>
                            <Tooltip content="更新" placement="top" transfer>
                              <Icon type="ios-upload-outline" size="24"></Icon>
                            </Tooltip>
                            <Tooltip content="移动文件" placement="top" transfer>
                               <Icon type="log-out"></Icon>
                            </Tooltip>
                           <Tooltip content="重命名" placement="top" transfer>
                               <Icon type="edit"></Icon>
                            </Tooltip>
                           <Tooltip content="更多操作" placement="top" transfer>
                              <Icon type="ios-arrow-down"></Icon>
                            </Tooltip>

                          </div>
                        </li>
                      </ul>
                    </div>
                 </TabPane>
                 <TabPane label="我参与的" name="file2">
                     <div class="headerBox">
                      <div class="tool1" v-if="checkBoxList2.length==0">
                        <span class="tool-name" @click="nameOrder2"><span>名称</span><Icon type="arrow-down-b" :class="{show:isShow2,up:isUp2}"></Icon></span>
                        <span class="tool-size" @click="sizeOrder2"><span>大小</span><Icon type="arrow-down-b" :class="{show:isShowsize2,up:isUpsize2}"></Icon></span>
                        <span class="tool-creater"><span>创建者</span></span>
                        <span class="tool-time">更新时间</span>
                      </div>
                      <div class="tool2" v-if="checkBoxList2.length>0">
                        <span class="hasChoose">已选择<a style="padding:0 10px;">{{checkBoxList2.length}}</a>项</span>
                        <span v-if="checkBoxList2.length==1"><Icon type="ios-upload-outline" size="18"></Icon>更新</span>
                        <span><Icon type="log-out"></Icon>移动</span>
                        <span><Icon type="ios-copy-outline" size="18"></Icon>复制</span>
                        <span><Icon type="ios-heart-outline"></Icon>收藏</span>
                        <span><Icon type="ios-trash-outline" size="18"></Icon>移到回收站</span>
                      </div>
                    </div>

                    <div class="listContent">
                      <!-- 没文件时显示 -->
                      <div class="noFile" v-if="myJoinFile.length==0">
                        <div class="icon"><Icon type="ios-filing-outline"></Icon></div>
                        <div class="text">目前还没有文件</div>
                      </div>
                      <ul class="myfileList">
                        <li v-for="item in myJoinFile" :key="item.id" class="clearfix">
                          <Checkbox class="checkbox" v-model="item.checkbox" @on-change="checkFile2(item.id,item.checkbox)"></Checkbox>
                          <img class="fileImg" :src="item.imgurl" alt="">
                          <span class="fileName">{{item.name}}</span>
                          <span class="fileSize">{{item.size}}</span>
                          <span class="fileCreater">{{item.creater}}</span>
                          <span class="updateTime">{{item.createTime}}</span>
                          <div class="caozuo fr">
                            <Tooltip content="下载" placement="top" transfer>
                              <Icon type="ios-download-outline" size="24"></Icon>
                            </Tooltip>
                            <Tooltip content="更新" placement="top" transfer>
                              <Icon type="ios-upload-outline" size="24"></Icon>
                            </Tooltip>
                            <Tooltip content="移动文件" placement="top" transfer>
                               <Icon type="log-out"></Icon>
                            </Tooltip>
                           <Tooltip content="重命名" placement="top" transfer>
                               <Icon type="edit"></Icon>
                            </Tooltip>
                           <Tooltip content="更多操作" placement="top" transfer>
                              <Icon type="ios-arrow-down"></Icon>
                            </Tooltip>

                          </div>
                        </li>
                      </ul>
                    </div>
                 </TabPane>
            </Tabs>
          </div>
        </TabPane>
<!-- 收藏 -->
        <TabPane label="收藏" name="name5">
          <div class="inner collect">
            <!-- 头部 -->
            <div class="header1">
              <div class="h1_title">
                <Poptip placement="bottom-start" v-model="collectVisible">
                    <span class="showchoose">{{collectType}}<Icon type="ios-arrow-down" style="margin-left:6px;"></Icon></span>
                    <div slot="content">
                      <ul class="selectlist">
                        <li @click="chooseCollectType(1,'所有收藏')"><span class="myiconBox"><Icon type="ios-heart-outline"></Icon></span>所有收藏<svg-icon name="right" v-if="activeCollect==1"></svg-icon></li>
                        <li @click="chooseCollectType(2,'任务')"><span class="myiconBox"><Icon class="taskIcon" type="android-checkbox-outline"></Icon></span>任务<svg-icon name="right" v-if="activeCollect==2"></svg-icon></li>
                        <li @click="chooseCollectType(3,'分享')"><span class="myiconBox"><Icon class="shareIcon" type="ios-paper-outline"></Icon></span>分享<svg-icon name="right" v-if="activeCollect==3"></svg-icon></li>
                        <li @click="chooseCollectType(4,'文件')"><span class="myiconBox"><Icon class="fileIcon" type="document"></Icon></span>文件<svg-icon name="right" v-if="activeCollect==4"></svg-icon></li>
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
        </TabPane>
    </Tabs>
    <div class="close" @click="$emit('close')">&times;</div>

    <!-- 编辑任务模态框 -->
     <Modal v-model="showModal"
           class="myModal">
      <my-modal ref="myModal"
                :data="activeModalData"></my-modal>
    </Modal>
    <!-- 编辑日程模态框 -->
    <Modal v-model="showRCModal"
           class="myModal myRcModal">
      <rc-modal :data="richengModalData"></rc-modal>
    </Modal>
  </div>
</template>
<script>
import myModal from "@/components/project/pages/index/components/EditList"
import rcModal from "@/components/public/common/EditRicheng"
  export default{
    components:{
      myModal,
      rcModal
    },
    data () {
      return {
        showModal:false,
        activeModalData:{},
        richengModalData:{},
        showRCModal:false,
        todayThing:false,
        visible1:false,
        visible2:false,
        collectVisible:false,
        active1:'1',
        active2:'2',
        activeCollect:'1',
        comStatus:'未完成',
        orderStatus:'按截止时间排序',
        collectType:'所有收藏',
        showOrder:true,
        showList:false,
        richengShow:'-1',
        checkBoxList:[],
        checkBoxList2:[],
        isShow:false,
        isUp:false,
        isShowsize:false,
        isUpsize:false,
        isShow2:false,
        isUp2:false,
        isShowsize2:false,
        isUpsize2:false,
        flag1:0,
        flag2:0,
        flag3:0,
        flag4:0,
        treeData:[
          {
          title: '2018年9月',
          children: [
            {
              title: '第一条',
              taskName:'产品进展'
            },
            {
              title: '第二条',
              taskName:'产品进展'
            },
             {
              title: '第三条',
              taskName:'产品进展'
            },
            {
              title: '第四条',
              taskName:'产品进展'
            }
          ]
          },
           {
          title: '2018年10月',
          children: [
            {
              title: '第一条',
              taskName:'产品进展'
            },
            {
              title: '第二条',
              taskName:'产品进展'
            }
            ]
          }
      ],
      myCreateFile:[
        {
          id:1,
          name:'文件.png',
          size:"178KB",
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        },
        {
          id:2,
          name:'文件.png',
          size:"178KB",
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        },
        {
          id:3,
          name:'文件.png',
          size:"178KB",
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        }
      ],
      myJoinFile:[
         {
          id:1,
          name:'文件.png',
          size:"178KB",
          creater:'nnnnnn',
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        },
        {
          id:2,
          name:'文件.png',
          size:"178KB",
          creater:'hthmh',
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        },
        {
          id:3,
          name:'文件.png',
          size:"178KB",
          creater:'小天使是是哈哈哈',
          createTime:"8月24日",
          imgurl:"https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        }
      ]
      }
    },
    mounted () {
        this.myCreateFile.map((item,index)=>{
            this.$set(item,'checkox',false)
        })
    },
    methods:{
      checkItem (id) {
        this.showModal = true
        this.activeModalData = {
                checkbox: false,
                title: "产品列表",
                id: "2-1",
                executor: -1,
                tag: [3, 2],
                startDate: '',
                endDate: '',
                sontaskDate:'',
                sonTask: [{
                  id: '15',
                  title: '你猜我叫什么',
                  complete: false
                }],
                involveList: [3]
              }
      },
      finishTask () {
         this.showModal = false
      },
      checkRicheng () {
        this.showRCModal= true
        this.richengModalData = {
                checkbox: false,
                title: "产品列表",
                id: "2-1",
                executor: -1,
                tag: [3, 2],
                startDate: '',
                endDate: '',
                sontaskDate:'',
                sonTask: [{
                  id: '15',
                  title: '你猜我叫什么',
                  complete: false
                }],
                involveList: [3]
              }

      },
      chooseComplete (flag,text) {
        if(text=='已完成'){
          this.showOrder = false
        }else{
          this.showOrder = true
        }
        this.comStatus = text
        this.active1=flag
        this.visible1 = false
      },
      chooseOrder (flag,text) {
        this.orderStatus = text
        this.active2=flag
        this.visible2 = false
      },
      chooseCollectType (flag,text) {
         this.collectType = text
        this.activeCollect=flag
        this.collectVisible = false
      },
      checkFile (id,check) {
        if(check){
          //this.checkBoxList为选择之后的id数组
          this.checkBoxList.push(id)
        }else{
          this.checkBoxList.map((v,index)=>{
            if(v==id){
              this.checkBoxList.splice(index,1)
            }
          })
        }
      },
      checkFile2 (id,check) {
        if(check){
          //this.checkBoxList为选择之后的id数组
          this.checkBoxList2.push(id)
        }else{
          this.checkBoxList2.map((v,index)=>{
            if(v==id){
              this.checkBoxList2.splice(index,1)
            }
          })
        }
      },
      nameOrder () {
        this.isShow= true
        this.isShowsize= false
        if(this.flag1){
          this.isUp=true
          this.flag1=0
        }else{
           this.isUp=false
           this.flag1=1
        }
      },
      nameOrder2 () {
        this.isShow2= true
        this.isShowsize2= false
        if(this.flag3){
          this.isUp2=true
          this.flag3=0
        }else{
           this.isUp2=false
           this.flag3=1
        }
      },
      sizeOrder () {
        this.isShowsize= true
        this.isShow = false
        if(this.flag2){
          this.isUpsize=true
          this.flag2=0
        }else{
           this.isUpsize=false
           this.flag2=1
        }
      },
       sizeOrder2 () {
        this.isShowsize2= true
        this.isShow2 = false
        if(this.flag4){
          this.isUpsize2=true
          this.flag4=0
        }else{
           this.isUpsize2=false
           this.flag4=1
        }
      }
    }
  }
</script>
<style scoped lang="less">
@import './Mine';

</style>

