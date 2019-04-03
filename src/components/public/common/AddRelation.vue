<template>
  <div class="relationBox">
    <div class="title clearfix">
      <span class="titleText fl">关联内容</span>
      <Input class="search fl" v-model="searchVal" placeholder="搜索个人项目" icon="ios-search-strong"/>
    </div>

    <div class="Con clearfix">
        <div class="div1 fl">
          <ul class="type">
            <li :class="{on:active=='a'}" @click="active='a'">
                <Icon type="ios-open-outline" />任务
            </li>
            <li :class="{on:active=='b'}" @click="active='b'">
                <Icon type="ios-paper-outline" />分享
            </li>
            <li :class="{on:active=='c'}" @click="active='c'">
              <Icon type="ios-calendar-outline"></Icon>日程
            </li>
            <li :class="{on:active=='d'}" @click="active='d'">
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
                    <h4>智能分组</h4>
                    <p>今天的任务</p>
                    <p>未完成的任务</p>
                    <p>已完成的任务</p>
                </div>
                <!--分组中具体的任务/子任务-->
                <div class="definite-renwu scrolly" v-if="showRenwu">
                    <loading v-if="taskLoading"></loading>
                    <div class="renwu-wrap"  v-for="(i,n) in taskData" :key="n">
                        <div>{{i.relationName}}</div>
                        <ul>
                            <li :class="{checked:checkedOneTask.n==n&&checkedOneTask.nn==nn}" v-for="(ii,nn) in i.taskList" :key="nn" class="renwu-list" @click="showChild(n,nn,ii.taskId)">
                                <span></span>
                                <img :src="ii.executorImg?'https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/'+ii.executorImg:morenImg" alt="">
                                <p>{{ii.taskName}}</p>
                            </li>
                        </ul>
                    </div>

                </div>
                <div class="definite-renwu scrolly" v-if="showZirenwu">
                    <ul>
                        <li @click="checkedZirenwu(index)" :class="{checked:checkZirenwu==index}" class="renwu-list" v-for="(item,index) in zirenwuData" :key="index">
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
                        <li :class="{checkeds:checkedShare==n}" class="fenxiang-list" v-for="(i,n) in shareData" :key="n" @click="checkShare(n)">
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
                            <li class="richeng-list" v-for="(i,n) in shceduleAfterData" :key="n">
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
                                        <li class="richeng-list" @click="checkSchedule($event)" v-for="(item,index) in i.scheduleList" :key="index">
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
            <div class="wenjain-div scrolly" v-show="active=='d'">
                <div class="div2 fl">
                    <h4>个人项目</h4>
                    <ul class="project">
                        <li @click="showTask(index, item.projectId)" :class="{checked:projectI==index}" v-for="(item, index) in projectData" :key="index">{{item.projectName}}</li>
                    </ul>
                </div>
                <div>
                    <Tree show-checkbox multiple expand></Tree>
                </div>

            </div>
        </div>

    </div>
    <div class="footer">
      <Button type="primary" size="large" style="padding:6px 20px;">确定</Button>
    </div>
  </div>
</template>
<script>
    import loading from './Loading'
    import {getProjectList} from '@/axios/api'
    import {getFenzu, getTask,getZirenwu,getShare,getSchedule} from '@/axios/relevanceApi'
  export default{
    name:"",
    data () {
      return{
        searchVal:'',
        loading: false,
        taskLoading:false,
        showRenwu:false,
        showZirenwu:false,
        active:'a',
        tabBox: false,
        showOldRc:false,
        projectData:[],
        projectI:null,
        shareI:null,
        scheduleI:null,
        fileI:null,
        projectId:'',
        taskDataFenzu: [],
        checkTAsk:null,
        checkedOneTask:{n:'',nn:''},
        checkedShare:null,
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
        checkZirenwu:null,
        showShare:false,
        showSchedule:false,
        showFile:false,

      }
      
    },
    components: {loading},
    methods:{
      showMore() {
      this.tabBox = !this.tabBox;
    },
  // 点击具体任务 显示子任务
      showChild(n,nn,taskId){
          this.checkedOneTask.n=n
          this.checkedOneTask.nn=nn
          getZirenwu(taskId).then(res => {
             if (res.result){
                 this.showZirenwu=res.data.length
                 this.zirenwuData=res.data
                 this.$nextTick(() => {
                     this.$refs.scrollX.scrollLeft=260
                 })
             }
          })


      },
        // 点击某个项目
      showTask(index, projectId, type){
          this.projectId=projectId
          switch(type) {
              case '任务':
                  this.projectI=index
                  this.loading=true
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
                          this.checkedAfterSchedule=new Array(res.data.after.length).fill({'ok':false})
                          this.checkedBeforeSchedule==new Array(res.data.before.length).fill([])

                          for (let j=0;j<res.data.before.length;j++){
                              for (let k=0; k<res.data.before[i])
                          }
                          this.loading=false
                          this.showSchedule=true
                      }
                  })
                  break;
              case '文件':
                  break;
          }

      },
        // 点击任务分组
      showAllTask(groupId,index){
          this.taskLoading=true
          this.checkTAsk=index
          console.log(groupId)
          getTask(groupId).then(res => {
              this.taskLoading=false
              this.taskData=res.data
          })
      },
      // 点击子任务、
      checkedZirenwu(index){
          this.checkZirenwu=index
      },
        // 选中 具体 分享
      checkShare (n) {
          this.checkedShare=n
      },
        // 选中 日程
      checkSchedule(e){
          console.log(e.target)
      }
    },
    mounted () {
        // this.projectI=''
        // this.checkTAsk=''
        // this.checkedOneTask.n=''
        // this.checkedOneTask.nn=''
      document.getElementById('relationModal').children[1].style.zIndex = '1010';
      document.getElementById('relationModal').children[0].style.zIndex = '1010';
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

