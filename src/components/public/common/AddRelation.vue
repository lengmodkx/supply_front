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
              <Icon type="android-checkbox-outline"></Icon>任务
            </li>
            <li :class="{on:active=='b'}" @click="active='b'">
              <Icon type="ios-paper-outline"></Icon>分享
            </li>
            <li :class="{on:active=='c'}" @click="active='c'">
              <Icon type="ios-calendar-outline"></Icon>日程
            </li>
            <li :class="{on:active=='d'}" @click="active='d'">
              <Icon type="ios-folder-outline"></Icon>文件
            </li>
          </ul>
        </div>
        <div class="div2 fl">
          <h4>个人项目</h4>
          <ul class="project">
            <li>项目项目一</li>
            <li>项目项目二</li>
            <li>项目项目三</li>
            <li>项目项目四</li>
          </ul>
        </div>
        <div class="div3 fl clearfix">
          <!-- 选中任务的时候 -->
            <div class="task-group fl" v-if="active=='a'">
                <div class="taskList">
                    <h4>任务分组</h4>
                    <ul class="project">
                      <li>项目项目一</li>
                      <li>项目项目二</li>
                      <li>项目项目三</li>
                      <li>项目项目四</li>
                    </ul>
                </div>
                <div class="smart-group">
                    <h4>智能分组</h4>
                    <ul class="project">
                      <li>今天的任务</li>
                      <li>未完成的任务</li>
                      <li>已完成的任务</li>
                    </ul>
                </div>
            </div>
          <div class="task-item fl" v-if="active=='a'"></div>
        <!-- 选中分享的时候 -->
          <div class="share" v-if="active=='b'">
              <div class="addShare"><Icon type="plus-circled"></Icon>创建新分享</div>
              <ul class="shareList">
                <li><Icon type="ios-paper-outline"></Icon>用 Teambition 为新产品发布计划建立一个公示板吧</li>
              </ul>
          </div>

        <!-- 选中日程的时候 -->
          <div class="schedule" v-if="active=='c'">
            <div class="addSchedule"><Icon type="plus-circled"></Icon>创建新日程</div>
            <div class="schedule-count">过去的日程 · 10<span class="toggleHide" @click="showMore">{{tabBox?'隐藏':'显示'}}</span></div>
            <div class="schedule-box" v-show="tabBox">
                这里面放日程list
            </div>
          </div>
        <!-- 选中文件的时候 -->
          <div class="file clearfix" v-if="active=='d'">
            <div class="file-inner1 fl">
                <div class="file-picker-handlers">
                  上传文件 创建文件夹
                </div>
            </div>
            <div class="file-inner2 fl"></div>
          </div>


        </div>
    </div>
    <div class="footer">
      <Button type="primary" size="large" style="padding:6px 20px;">确定</Button>
    </div>
  </div>
</template>
<script>
  export default{
    name:"",
    data () {
      return{
        searchVal:'',
        active:'a',
        tabBox: false
        
      }
      
    },
    methods:{
      showMore() {
      this.tabBox = !this.tabBox;
    }
    },
    mounted () {
      document.getElementById('relationModal').children[1].style.zIndex = '1010';
      document.getElementById('relationModal').children[0].style.zIndex = '1010';
    }
  }
</script>
<style scoped lang="less">
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
      }
    }

  .div3{
    width:calc(100% - 360px);
    height:100%;
    overflow-y: auto;
    .task-group{
      width: 180px;
      height:100%;
      border-right:1px solid rgba(0,0,0,.12);
      overflow-y: auto;
      .taskList{
        margin-bottom:30px;
      }
      .taskList,.smart-group{
        
        h4{
        padding-top:10px;
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
      }
      }
    }
    .task-item{
      width: calc(100% - 180px);
      height:100%;
      overflow-y: auto;
    }

    .share{
      height:100%;
      font-size:14px;
      .addShare{
        line-height: 30px;
        padding-top: 10px;
        margin-bottom:15px;
        padding-left:15px;
        color: #3da8f5;
        cursor: pointer;
        i{
           font-size: 22px;
            margin-top:2px;
            margin-right:10px;
            vertical-align: text-bottom;
        }
      }
      .shareList{
        li{
          line-height: 36px;
          padding-left:15px;
          color:#555;
          cursor: pointer;
           &:hover{
            background-color: #eee;
            color: #3da8f5;
          }
          i{
            margin-right:10px;
            font-size:20px;
          }
        }
      }
    }
    .schedule{
      height:100%;
      font-size:14px;
      .addSchedule{
        line-height: 30px;
        padding-top: 10px;
        margin-bottom:15px;
        padding-left:15px;
        color: #3da8f5;
        cursor: pointer;
        i{
           font-size: 22px;
            margin-top:2px;
            margin-right:10px;
            vertical-align: text-bottom;
        }
      }
      .schedule-count{
        font-size:12px;
        padding-left:15px;
        .toggleHide{
          color:#3da8f5;
          cursor: pointer;
          margin-left:10px;
        }
      }
    }
    .file{
       height:100%;
      font-size:14px;
      .file-inner1,.file-inner2{
        width:50%;
        height:100%;
        overflow-y: auto;
      }
      .file-inner1{
        border-right:1px solid rgba(0, 0, 0, 0.12)
      }
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

