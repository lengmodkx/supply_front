<template>
  <div class="relationBox">
    <div class="title clearfix">
      <span class="titleText fl">关联内容</span>
      <Input class="search fl" v-model="searchVal" placeholder="搜索个人项目" icon="ios-search-strong"/>
    </div>

    <div class="Con clearfix">
        <div class="div1 fl">
          <ul class="type">
            <li :class="{on:active=='a'}" @click="firstClick('a')">
                <Icon type="ios-open-outline" />任务
            </li>
            <li :class="{on:active=='b'}" @click="firstClick('b')">
                <Icon type="ios-paper-outline" />分享
            </li>
            <li :class="{on:active=='c'}" @click="firstClick('c')">
              <Icon type="ios-calendar-outline"></Icon>日程
            </li>
            <li :class="{on:active=='d'}" @click="firstClick('d')">
              <Icon type="ios-folder-outline"></Icon>文件
            </li>
          </ul>
        </div>
        <div class="complex-div fl" ref="scrollX">
            <!--点击任务，显示的-->
            <div class="renwu-div" v-show="active=='a'">
                <div class="div2 fl">
                    <h4>个人项目</h4>
                    <ul class="project">
                        <li @click="showTask(index, item.projectId, '任务')" :class="{checked:projectI==index}" v-for="(item, index) in projectData" :key="index">{{item.projectName}}</li>
                    </ul>
                </div>
                <!--任务分组-->
                <div class="renwu1 scrolly">
                    <loading v-if="loading"></loading>
                    <h4>任务分组</h4>
                    <p v-for="(item, index) in taskDataFenzu" :class="{check:checkTAsk==index}" :key="index" @click="showAllTask(item.relationId,index)">{{item.relationName}}</p>
                    <!--<h4>智能分组</h4>-->
                    <!--<p>今天的任务</p>-->
                    <!--<p>未完成的任务</p>-->
                    <!--<p>已完成的任务</p>-->
                </div>
                <!--分组中具体的任务/子任务-->
                <div class="definite-renwu scrolly" v-if="showRenwu">
                    <loading v-if="taskLoading"></loading>
                    <div class="renwu-wrap"  v-for="(i,n) in taskData" :key="n">
                        <div>{{i.relationName}}</div>
                        <ul>
                            <li :class="{checked:checkedOneTask.n==n&&checkedOneTask.nn==nn}"
                                v-for="(ii,nn) in i.taskList" :key="nn"
                                class="renwu-list"
                                @click="showChild(n,nn,ii.taskId)">
                                <span></span>
                                <img :src="ii.executorImg?'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+ii.executorImg:morenImg" alt="">
                                <p>{{ii.taskName}}</p>
                            </li>
                        </ul>
                    </div>

                </div>
                <div class="definite-renwu scrolly" v-if="showZirenwu">
                    <ul>
                        <li @click="checkedZirenwu(index, item.taskId)"
                            :class="{checked:checkZirenwu==index}"
                            class="renwu-list"
                            v-for="(item,index) in zirenwuData" :key="index">
                            <span></span>
                            <img :src="item.executorImg?'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+item.executorImg:morenImg" alt="">
                            <p>{{item.taskName}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <!--点击分享 显示的-->
            <div class="fenxiang-div scrolly" v-show="active=='b'">
                <div class="div2 fl">
                    <h4>个人项目</h4>
                    <ul class="project">
                        <li @click="showTask(index, item.projectId, '分享')" :class="{checked:shareI==index}" v-for="(item, index) in projectData" :key="index">{{item.projectName}}</li>
                    </ul>
                </div>
                <div style="width: 440px;padding: 10px 0">
                    <loading v-if="loading"></loading>
                    <!--<div class="create-task">-->
                    <!--<Icon type="md-add-circle" size="20" />-->
                    <!--<span>创建新分享</span>-->
                    <!--</div>-->
                    <ul v-show="showShare">
                        <li :class="{checkeds:checkedShare[n].ok}"
                            class="fenxiang-list"
                            v-for="(i,n) in shareData" :key="n"
                            @click="checkShare(n, i)">
                            <Icon type="ios-paper-outline" size="20" />
                            <span>{{i.title}}</span>
                        </li>
                    </ul>
                </div>

            </div>
            <!--点击日程 显示的-->
            <div class="richeng-div scrolly" v-show="active=='c'">
                <div class="div2 fl">
                    <h4>个人项目</h4>
                    <ul class="project">
                        <li @click="showTask(index, item.projectId, '日程')" :class="{checked:scheduleI==index}" v-for="(item, index) in projectData" :key="index">{{item.projectName}}</li>
                    </ul>
                </div>
                <div style="width: 440px">
                    <loading v-if="loading"></loading>
                    <div v-show="showSchedule" style="width: 440px;padding: 10px 0">
                        <!--<div class="create-task">-->
                            <!--<Icon type="md-add-circle" size="20" />-->
                            <!--<span>创建新日程</span>-->
                        <!--</div>-->
                        <div class="weilai">未来的日程</div>
                        <ul>
                            <li :class="{checks:checkedAfterSchedule[n].ok}"
                                @click="weilaiRc(n,i.scheduleId)"
                                class="richeng-list"
                                v-for="(i,n) in shceduleAfterData" :key="n">
                                <Icon type="ios-calendar-outline" size="20" />
                                <p>{{i.scheduleName}}</p>
                                <div class="rc-time">
                                    <Time :time="i.startTime" />
                                    <span>-</span>
                                    <Time :time="i.endTime" />
                                </div>
                            </li>
                        </ul>
                        <div class="guoqu">过去的日程  <span @click="showOldRc=!showOldRc">{{showOldRc?'隐藏':'显示'}}</span></div>
                        <Collapse v-show="showOldRc" simple v-for="(i,n) in shceduleBeforData" :key="n">
                            <Panel name="1">
                                {{i.date}}
                                <div slot="content">
                                    <ul>
                                        <li :class="{checks:checkedBeforeSchedule[n][index].ok}"
                                            class="richeng-list"
                                            @click="checkSchedule(n,index, item.scheduleId)"
                                            v-for="(item,index) in i.scheduleList" :key="index">
                                            <Icon type="ios-calendar-outline" size="20" />
                                            <p>{{item.scheduleName}}</p>
                                            <div class="rc-time">
                                                <Time :time="item.startTime" />
                                                <span>-</span>
                                                <Time :time="item.endTime" />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
            <!--点击文件 显示的-->
            <div class="wenjain-div " v-show="active=='d'">
                <div class="div2 fl scrolly">
                    <h4>个人项目</h4>
                    <ul class="project">
                        <li :class="{checked:fileI==index}" @click="showTask(index, item.projectId,'文件')"  v-for="(item, index) in projectData" :key="index">{{item.projectName}}</li>
                    </ul>
                </div>
                <div class="wenjian-wrap">
                    <loading v-if="loading" style="position: absolute;top: 0;left: 50%;margin-left: -30px"></loading>
                    <div class="all-files scrolly" v-show="showFile">
                        <div :class="{checked:item.ok}"
                             class="folder"
                             v-for="(item,index) in fileData" :key="index"
                             @click="showZiwenjian(index,item.catalog, item.fileId, -1)">
                            <img v-if="item.catalog" src="@/icons/img/wjj.png" alt=""><img v-else src="@/icons/img/moren.png" alt="">
                            <span>{{item.fileName}}</span>
                        </div>
                    </div>
                    <!--子文件，文件夹-->
                    <div class="zi-files scrolly" v-for="(item,index) in ziwenjain" :key="index">
                        <div :class="{checked:i.ok}" class="folder" v-for="(i,n) in item" :key="n" @click="showZiwenjian(n,item.catalog, item.fileId, index)">
                            <img v-if="i.catalog" src="@/icons/img/wjj.png" alt=""><img v-else src="@/icons/img/moren.png" alt="">
                            <span>{{i.fileName}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
    <div class="footer">
      <Button type="primary" size="large" style="padding:6px 20px;" @click="relation">
          <span v-if="relationing">loading...</span><span v-else>确定</span>
      </Button>
    </div>
  </div>
</template>
<script>
    import loading from './Loading'
    import {getProjectList} from '@/axios/api'
    import {getFenzu, getTask,getZirenwu,getShare,getSchedule,getFile,addRelation} from '@/axios/relevanceApi'
  export default{
    props:['publicId','fromType'],
    name:"",
    data () {
      return{
        searchVal:'',
        loading: false,
        relationing:false,
        taskLoading:false,
        showRenwu:false,
        showZirenwu:false,
        active:'a',
        tabBox: false,
        showOldRc:false,
        projectData:[],
        projectI:-1,
        shareI:-1,
        scheduleI:-1,
        fileI:-1,
        projectId:'',
        taskDataFenzu: [],
        checkTAsk:-1,
        checkedOneTask:{n:'-1',nn:'-1'},
        checkedShare:[],
        checkedAfterSchedule:[{'ok':false}],
        checkedBeforeSchedule:[],
        checkedFile:null,
        morenImg:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABGlBMVEWmpqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqampqapqamtra2zs7O6urrAwMDCwsLDw8PExMTFxcXGxsbKysrMzMzS0tLY2Nje3t7f39/i4uLk5OTm5ubp6ent7e3v7+/x8fH09PT5+fn6+vr9/f3+/v7///9sumsYAAAAQHRSTlMABAUGExQWFxkaGxwlJikqTk9QUVdYW1xmaXBxcnV2enuNjo+TlJW2t7jLzM7P0NjZ2+zt7vHy8/T19vj5+vz+SWi1rwAAAhZJREFUGBmFwQ1b0mAUBuATirYyJZMCib6WikIqqUwxt6e5aeEGCoQ4Pf//byS6C8/7buB9U8LcilnZ2Ts+3tupmCtz9IzZ0pYDwdkqzdJkL78eIuHou0HpXpQtpLLKGUqxUMNEP5Yo4e0BprCWSVOwMZVdIEURzyqSkLOh8IMwDH0Xkp2jsUULgtuJ+FHXg2AtUiyzDcGL+EkAYTtDj8oQ3CFLHoRP9MCwILRZMYBgGTSyBsGNWOVDWKd72SYEnzUhhGaWiFYh+awJIa0SURWSz5oQ0hbRnAPJZY0PyTEoD1XEKg+K92RC4Q5Z5UFhUgWKkDVdKDaoDkXImj4UdWpAEbCmA0WDoHIHrIg8qAi6PguRC9UvakATstCF5ifVoTllIYCmThXo2jw2gG6DTCQMOBadQmdSHgktjrWR8IHmHeh8joXQOQZRFbqQY13oqkS0Cl2fY5ELzUciyjahCnisA1UzS/fWoQhZ6LiQ1mnEsPDE77NiGOCJZdCDMmJu0OeEYXiK2Cd6lKlhxOtEnK7bwkgtQ7GFAyAY8BTD8Dcab2gsZ+OSp7qEnSOhCFzwFBdAkRQFG61bnuCuBbtAmuUDeD1O1fNgvaOEhRrw5x8nDP4C20uUYuZzEzi7umPh7uoMaH6ZoXSvvh0COG/3rm9ub2+ue+1zAEdrr2mybKnqQHCqpSw9Yz5vbu7un5zs726a+XnS/QfUNwZ8HxlD9AAAAABJRU5ErkJggg==',
        taskData:[],
        shareData:[],
        shceduleBeforData:[],
        shceduleAfterData:[],
        fileData:[],
        zirenwuData:[],
        checkZirenwu:-1,
        showShare:false,
        showSchedule:false,
        showFile:false,
        ziwenjain:[],
        imgData:[
            {
                name:'.jpg.png.jpeg',
                src:'@/icons/img/tp.png'
            },
            {
                name:'.doc.docx',
                src:'@/icons/img/word.png'
            },
            {
                name:'.xls.xlsx.xlsm.xltx.xltm.xlsb.xlam',
                src:'@/icons/img/excel.png'
            },
            {
                name:'.pptx.pptm.ppsx.ppam',
                src:'@/icons/img/ppt.png'
            },
            {
                name:'.pdf',
                src:'@/icons/img/pdf.png'
            },
            {
                name:'.rar.zip',
                src:'@/icons/img/zip.png'
            },
            {
                name:'.txt',
                src:'@/icons/img/txt.png'
            },

        ],
        shareIdArr:[],
        scheduleIdArr:[],
        fileIdArr:[],
        guanlianData:{
            'publicId':this.publicId,
            'fromType':this.fromType,
            'bindId':'',
            'publicType':''
        }

      }
      
    },
    components: {loading},
    methods:{
      showMore() {
      this.tabBox = !this.tabBox;
    },
        // 点击最左侧 任务 分享 日程文件
    firstClick(type) {
          this.active=type
        this.showRenwu=false
        this.showShare=false
        this.showSchedule=false
        this.showFile=false
        this.projectI=-1
        this.shareI=-1
        this.scheduleI=-1
        this.fileI=-1
        this.checkTAsk=-1
        this.checkedOneTask={n:'-1',nn:'-1'}
        this.checkedShare=[]
        this.checkedAfterSchedule=[{'ok':false}]
        this.checkedBeforeSchedule=[]
        this.checkedFile=-1
    },
  // 点击具体任务 显示子任务
      showChild(n,nn,taskId){
          this.taskLoading=true
          this.checkedOneTask.n=n
          this.checkedOneTask.nn=nn
          this.guanlianData.bindId=taskId
          getZirenwu(taskId).then(res => {
             if (res.result){
                 this.showZirenwu=res.data.length
                 this.zirenwuData=res.data
                 this.$nextTick(() => {
                     this.taskLoading=false
                     this.$refs.scrollX.scrollLeft=260
                 })
             }
          })
      },
        // 点击子任务、
        checkedZirenwu(index, id){
            this.checkZirenwu=index
            this.guanlianData.bindId=id
        },
        // 点击某个项目
      showTask(index, projectId, type){
          this.projectId=projectId
          this.guanlianData.publicId=this.publicId
          this.guanlianData.bindId=''
          this.guanlianData.publicType=type
          switch(type) {
              case '任务':
                  this.projectI=index
                  this.loading=true
                  this.showRenwu=false
                  this.showZirenwu=false
                  getFenzu(this.projectId).then(res => {
                      this.showRenwu=true
                      this.loading=false
                      if (res.result){
                          this.taskDataFenzu=res.data
                      }
                  })
                  break;
              case '分享':
                  this.shareI=index
                  this.loading=true
                  getShare(projectId).then(res => {
                      this.shareData=res.data
                      for (let j=0;j<res.data.length;j++){
                          this.checkedShare.push({'ok':false})
                      }
                      this.loading=false
                      this.showShare=true
                  })
                  break;
              case '日程':
                  this.scheduleI=index
                  this.loading=true
                  getSchedule(projectId).then(res => {
                      console.log(res)
                      if (res.result){
                          this.shceduleBeforData=res.data.before
                          this.shceduleAfterData=res.data.after
                          // this.checkedAfterSchedule=new Array(res.data.after.length).fill({'ok':false})
                         for (let j=0;j<res.data.after.length;j++){
                             this.checkedAfterSchedule.push({'ok':false})
                         }
                          for (let j=0;j<res.data.before.length;j++){
                              this.checkedBeforeSchedule.push([])
                              for (let k=0; k<res.data.before[j].scheduleList.length;k++){
                                  this.checkedBeforeSchedule[j].push({'ok':false})
                              }
                          }
                          console.log(this.checkedAfterSchedule)
                          this.loading=false
                          this.showSchedule=true
                      }
                  })
                  break;
              case '文件':
                  this.fileI=index
                  this.loading=true
                  getFile(projectId).then(res => {
                     if (res.result){
                         this.fileData=res.data
                         this.loading=false
                         this.showFile=true
                         this.fileData.forEach(i => {
                             this.$set(i,'ok',false)
                         })
                         console.log(this.fileData)
                     }
                  })
                  break;
          }

      },
        // 点击子文件夹
        showZiwenjian(index, type, fileId,n){
          if (type){
              // 是文件夹
              this.loading=true
              getFile(fileId).then(res => {
                  if (res.data.length){
                      res.data.forEach(i => {
                          this.$set(i,'ok',false)
                      })
                      if (this.ziwenjain.length==0){
                          this.ziwenjain.push(res.data)
                      } else if (this.ziwenjain.length==n+1) {
                          this.ziwenjain.pop()
                          this.ziwenjain.push(res.data)

                      }else {
                          this.ziwenjain.slice(0,n+2)
                      }
                  this.loading=false
                  }
              })
          }else {
              if (n=='-1'){
                  this.fileData[index].ok=!this.fileData[index].ok
              } else {
                  this.ziwenjain[n][index].ok=!this.ziwenjain[n][index].ok
              }
              this.getBindId(this.fileIdArr,fileId)
          }
      },
        // 点击任务分组
      showAllTask(groupId,index){
          this.taskLoading=true
          this.checkTAsk=index
          getTask(groupId).then(res => {
              this.taskLoading=false
              this.taskData=res.data
          })
      },
        // bindId赋值
      getBindId(arr,id){
          if (arr.includes(id)){
              let index=arr.findIndex(val => {
                  return val==id
              })
              arr.splice(index,1)
          }else {
              arr.push(id)
          }
          this.guanlianData.bindId=arr.join(',')
      },
        // 选中 具体 分享
      checkShare (n, i) {
          this.checkedShare[n].ok=!this.checkedShare[n].ok
          this.getBindId(this.shareIdArr,i.id)
      },
        // 选中 过去 日程
      checkSchedule(n,nn,id){
          this.checkedBeforeSchedule[n][nn].ok=!this.checkedBeforeSchedule[n][nn].ok
          this.getBindId(this.scheduleIdArr,id)
      },
      // 选中未来 日程
      weilaiRc(n,id){
          this.checkedAfterSchedule[n].ok=!this.checkedAfterSchedule[n].ok
          this.getBindId(this.scheduleIdArr,id)
      },
        // 点击关联 确定按钮
      relation(){
          this.relationing=true
          addRelation(this.guanlianData).then(res => {
              if (res.result){
                  this.$emit('binkCallback')
                  this.$Message.success('关联成功');
              }
              else {
                  this.$Message.error('关联失败，请重新选择');
              }
              this.relationing=false
          })
      }
    },
    mounted () {
      // document.getElementById('relationModal').children[1].style.zIndex = '1010';
      // document.getElementById('relationModal').children[0].style.zIndex = '1010';
        getProjectList().then(res => {
           this.projectData=res.data
            console.log(res.data)
        })
    }
  }
</script>
<style scoped lang="less">
 @import "./AddRelation";
.relationBox{
  height:100%;
  .title{
    line-height:50px;
    color:gray;
    font-size:15px;
    text-indent: 15px;
    border-bottom:1px solid rgba(0,0,0,.12);
    .titleText{
      font-weight:bold;
      width:500px;
    }
    .search{
      width:220px;
      margin-top:9px;
    }
  }
  .Con{
    height:calc(100% - 51px - 69px);
    font-size: 14px;
    color:gray;
    .div1,.div2{
      width: 180px;
      height:100%;
      border-right:1px solid rgba(0,0,0,.12);
    }
    .div1{
      .on{
        background-color: #eee;
        color: #3da8f5;
      }
      .type{
        margin-top:5px;
        li{
          line-height: 36px;
          cursor: pointer;
          padding-left:15px;
          &:hover{
            background-color: #eee;
            color: #3da8f5;
          }
          i{
            margin-right:8px;
            font-size:18px;
          }
        }
      }
    }
    .div2{
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
      .action{
        background-color: #eee;
        color: #3da8f5;
      }
      h4{
        margin:10px 0;
        padding-left:15px;
      }
      .project{
        li{
          line-height: 30px;
          padding-left:15px;
          cursor: pointer;
          &:hover{
            background-color: #eee;
            color: #3da8f5;
          }
        }
        .checked{
            background-color: #eee;
            color: #3da8f5;
          }
      }
    }

  .complex-div{
    width:calc(100% - 180px);
    height:100%;
    overflow-x: auto;
    overflow-y: hidden;
    transition: all 0.3s;
    display: flex;
    &::-webkit-scrollbar {
          width: 10px;
          height: 12px;
          background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
          background-color: #cecece;
    }
  }
  }
  .footer{
    margin: 0;
    padding: 16px 20px;
    text-align: right;
    border-top: 1px solid rgba(0,0,0,.12);
  }
}
</style>

