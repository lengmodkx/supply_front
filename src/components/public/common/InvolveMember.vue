<template>

  <Poptip v-model="visible"
          class="involvelistBox"
          @on-popper-show="popShow"
          transfer>
    <span class="button">
      <Icon type="md-add-circle" @click="addMembers" class="fl" size="28" style="color: #1B8BEE;cursor: pointer;margin-top: 0"/>
    </span>

    <div slot="content"
         style="height:320px;position: relative">
      <div class="loading" v-if="!memberList.length">
        <Icon  type="ios-loading" size="28" />
      </div>
      <Input v-model="searchvalue"
             placeholder="搜索"
             style="width:220px;margin-top:10px;height:36px;" />
      <div class="selectable">
        <ul>
          <li class="select-option-group"
              v-if="!searchvalue">
            <div class="option-group-label">参与者</div>
            <ul>
              <li class="member-menu-item clearfix"
                  :class="curUserId==item.userId?'disable':''"
                  v-for="(item, index) in memberList"
                  :key="item.userId"
                  v-if="checkedList.indexOf(item.userId)>=0"
                  @click="checkUser(index)">
                <div class="img fl">
                  <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.image}`"
                       v-if="item.image" />
                  <svg-icon v-else
                            style="margin-top:3px;"
                            name="allMember"></svg-icon>
                </div>
                <div class="membername fl">{{item.userName}}</div>
                <div class="tick fr">
                  <Icon type="md-checkmark" class="right"
                        v-show="item.checked"/>
                </div>
              </li>
            </ul>
          </li>

          <li class="select-option-group">
            <div class="option-group-label">推荐</div>
            <ul>
              <li class="member-menu-item clearfix"
                  v-for="(item, index) in memberList"
                  :key="item.userId"
                  v-if="checkedList.indexOf(item.userId)<0"
                  @click="checkUser(index)">
                <div class="img fl">
                  <img v-if="item.image"
                       :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.image}`"
                       alt="">
                  <svg-icon v-else
                            style="margin-top:3px;"
                            name="allMember"></svg-icon>
                </div>
                <div class="membername fl">{{item.userName}}</div>
                <div class="tick fr">
                  <Icon type="md-checkmark" class="right"
                        v-show="item.checked"/>
                </div>
              </li>
            </ul>
          </li>
        </ul>

      </div>

      <div class="confirmBtn">
        <Button type="primary"
                long
                @click="save">确定</Button>
      </div>
    </div>

  </Poptip>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getmemberList,members } from '@/axios/api'
export default {
  props: ['checkedList', 'projectId'],
  data () {
    return {
      visible: false,
      aaa:false,
      searchvalue: '',
      memberList: []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    // ...mapState('task', ['members']),
    curUserId () {
      //从vuex取当前登录用户id
      return this.user.userId
    },
    computedMemberList () {
      return 1
    }
    // return this.memberList.filter(v => this.$containStr(this.searchvalue, v.userName))
  },
  methods: {
    ...mapActions('task', ['initMemberList']),
    // 获取项目成员
    addMembers () {
      members(this.projectId).then(res => {
        this.memberList=res.data
        this.popShow()
      })
    },
    
    checkUser (index) {
      if (this.memberList[index].userId == this.curUserId) return//当前用户不可点击
      this.$set(this.memberList[index], 'checked', !this.memberList[index].checked)
    },
    save () {

      let list =this.memberList.filter(v => {
        return v.checked==true
      })
     let list1=list.map(item => {
        return item.userId
      })
      let detailList=list1.join(',')

      console.log(detailList)
      this.$emit('save', detailList)
      this.visible=false
      // let all = this.memberList.find(v => v.userId == -1)
      // let allChecked = all.checked
      // this.memberList.map(v => {
      //   if ((allChecked || v.checked) && v.userId != -1) {
      //     list.push(v.userId)
      //     detailList.push(v)
      //   }
      // })
      // this.$nextTick(_ => {
      //   this.visible = false
      //   this.$emit('save', list,detailList)
      //   this.searchvalue = ''
      //   // Object.assign(this.$data, this.$options.data())
      // })
    },
    popShow () {
      this.memberList.forEach(v => {
        // v.checked = this.checkedList.indexOf(v.id) >= 0
        this.$set(v, 'checked', this.checkedList.indexOf(v.userId) >= 0)
      })
    }
  },
  mounted () {
    // this.initMemberList(() => {
    //   this.popShow()
    //   this.memberList = this.members.filter(v => v.userId != this.user.userId)
    //   this.memberList.unshift({
    //     userId: -1,
    //     userName: '所有项目成员'
    //   })
    //   this.memberList.unshift(JSON.parse(JSON.stringify(this.user)))
    // })
  }
}
</script>
<style scoped lang="less">
  .loading{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    i{
      animation: zhuan 1s infinite;
    }
    @keyframes zhuan{
      from {transform:rotate(0deg);}
      to {transform:rotate(360deg)}
    }
  }
.involvelistBox {
  .button {
    cursor: pointer;
    line-height: 24px;
    display: inline-block;
    i {
      font-size: 24px;
      color: #3da8f5;
      margin-top: 2px;
      &:hover {
        color: #2d8cf0;
      }
    }
  }
}
.selectable {
  height: calc(100% - 46px - 63px);
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
        line-height: 32px;
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
</style>

