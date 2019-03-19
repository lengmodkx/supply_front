<template>
  <Poptip placement="top"
          v-model="popVisible"
          @on-popper-hide = "popHide">
    <span class="text">
      <Icon type="ios-people-outline"></Icon>
      <span>成员的任务</span>
    </span>

    <div slot="content"
         class="listBox">
      <Input v-model="searchMember"
             placeholder="查找成员" />
      <div class="listWrapper">
        <ul class="list">
          <li class="clearfix"
              v-for="item in computedMemberList"
              :key="item.id"
              @click="chooseMember(item.id)">
            <div class="avatar fl"><img src="https://striker.teambition.net/thumbnail/110t1838b6ce486c4fa137b0a4b08ad4104e/w/200/h/200"></div>
            <div class="name fl">{{item.username}}</div>
            <div class="choose fr"
                 v-if="item.id==data.checkedMember">
              <svg-icon name="right"></svg-icon>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </Poptip>
</template>
<script>
export default {

  data () {
    return {
      popVisible: false,
      searchMember: '',
      data: {
        checkedMember: '',
        member: [
          {
            id: 1,
            username: '罗茜',
            avartar: ""
          },
          {
            id: 2,
            username: '张三',
            avartar: ""
          }
        ]

      }
    }
  },
  computed: {
    computedMemberList () {
      return this.data.member.filter(v => this.$containStr(this.searchMember, v.username))
    }
  },
  methods: {
    popHide () {
      setTimeout(_=>{
        this.searchMember = ''
      },300)
    },
    chooseMember (id) {
      this.popVisible = false
      this.$emit('showmodal', id)
      this.data.checkedMember = id
    }
  }
}
</script>
<style scoped lang="less">
.avatar {
  width: 24px;
  height: 30px;
  margin-right: 6px;
  padding-top: 4px;
  img {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
}
.choose {
  height: 30px;
  margin-top: 4px;
  svg {
    width: 20px;
    height: 20px;
  }
}
.text {
  i {
    font-size: 22px;
    vertical-align: text-top;
    color: #a6a6a6;
    margin-right: 4px;
  }
}
.listBox {
  height: 240px;
  /deep/.ivu-input {
    height: 34px;
    width: 200px;
    margin-top: 10px;
  }
  .listWrapper {
    height: calc(100% - 44px);
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      background-color: #e5e5e5;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cecece;
    }
  }
}
.list {
  padding: 10px 0;
  li {
    line-height: 40px;
    font-size: 14px;
    color: gray;
    &:hover {
      font-weight: bold;
    }
    .name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

