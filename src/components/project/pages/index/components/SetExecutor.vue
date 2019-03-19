<template>

  <Poptip v-model="visible"
          class="involvelistBox"
          @on-popper-hide="popHide"
          transfer>
    <slot :executor="current" :close="close">
      <svg-icon name="people"></svg-icon>

    </slot>

    <div slot="content"
         style="height:320px;">
      <Input v-model="searchvalue"
             placeholder="搜索"
             style="width:220px;margin-top:10px;height:36px;" />
      <div class="selectable">
        <ul v-if="!searchvalue">
          <li class="select-option-group">
            <div class="option-group-label"
                 v-if="!searchvalue">执行者</div>
            <ul v-if="searchvalue?(current && current.userName.indexOf(searchvalue)>=0):true">
              <li class="member-menu-item clearfix"
                  @click="itemClick(current?current.userId:-1)">
                <div class="img fl">
                  <img v-if="current&&current.image"
                       :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${current.image}`"
                       alt="">
                  <svg-icon v-else
                            name="people"></svg-icon>
                </div>
                <div class="membername fl">{{current?current.userName:'待认领' }}</div>
                <div class="tick fr">
                  <svg-icon class="right"
                            name="right"></svg-icon>
                </div>
              </li>
            </ul>
          </li>

          <li class="select-option-group">
            <div class="option-group-label"
                 v-if="!searchvalue">推荐</div>
            <ul>
              <li class="member-menu-item clearfix"
                  v-if="current && !searchvalue"
                  @click="itemClick(-1)">
                <div class="img fl">
                  <svg-icon name="people"></svg-icon>
                </div>
                <div class="membername fl">待认领</div>
              </li>
              <li class="member-menu-item clearfix"
                  @click="itemClick(i.userId)"
                  v-for="(i,index) in computedMemberList"
                  :key="index"
                  v-if="!current || (current && current.userId!=i.userId)">
                <div class="img fl"><img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${i.image}`"
                       alt=""></div>
                <div class="membername fl">{{i.userName}}</div>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 搜索出来的人员列表 -->
         <ul v-if="searchvalue">
            <li class="member-menu-item searchItem clearfix"
                  @click="itemClick(i.userId)"
                  v-for="(i,index) in computedMemberList"
                  :key="index"
                  v-if="!current || (current && current.userId!=i.userId)">
                <div class="img fl"><img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${i.image}`"
                       alt=""></div>
                <div class="membername fl">{{i.userName}}</div>
              </li>
         </ul>
      </div>


    </div>

  </Poptip>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      searchvalue: '',
      // current: null,
      memberList: [
        // {
        //   id: 1,
        //   name: "张三",
        //   imgUrl: "https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        // },
        // {
        //   id: 2,
        //   name: "李四",
        //   imgUrl: "https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"
        // }
      ]
    }
  },
  props: ['executor'],
  model: {
    event: 'choose',
    prop: 'executor'
  },
  computed: {
    ...mapState('task', ['members']),
    computedMemberList () {
      return this.memberList.filter(v => this.$containStr(this.searchvalue, v.userName))
      // return this.memberList.filter(v => v.name.indexOf(this.searchvalue) >= 0)
    },
    current(){
      return this.memberList.find(v=>v.userId==this.executor)
    }
  },
  methods: {
    ...mapActions('task', ['initMemberList']),
    itemClick (id) {
      //this.current = this.memberList.find(v => v.userId == id)
      this.$emit('choose', id)
      this.$nextTick(_ => {
        this.visible = false
      })
    },
    popHide () {
      this.searchvalue = ''
    },
    close () {
      this.itemClick(-1)
    }
  },
  mounted () {
    this.initMemberList(()=>{

        this.memberList = JSON.parse(JSON.stringify(this.members))
        //  console.log( this.memberList)
    })
  }
}
</script>
<style scoped lang="less">
.involvelistBox {
  .executor {
    cursor: pointer;
    &:hover {
      .conText {
        color: #3da8f5;
      }
    }
    .svg-people {
      vertical-align: text-bottom;
      width: 26px;
    }
  }
}
.selectable {
  height: calc(100% - 46px);
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
  .select-option-group {
    .option-group-label {
      padding: 6px 0;
      font-size: 14px;
      color: #a6a6a6;
      cursor: auto;
    }
    .member-menu-item {
      font-size: 14px;
      padding: 6px 0;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .img {
        box-sizing: border-box;
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: block;
        }
      }
      .membername {
        line-height: 32px;
        margin-left: 12px;
      }
      .tick {
      }
    }
    .disable {
      cursor: not-allowed;
    }
  }
}
.confirmBtn {
  padding: 10px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
}
.right {
  margin-right: 4px;
}
.searchItem {
  font-size: 14px;
      padding: 6px 0;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      .img {
        box-sizing: border-box;
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: block;
        }
      }
      .membername {
        line-height: 32px;
        margin-left: 12px;
      }
}
</style>

