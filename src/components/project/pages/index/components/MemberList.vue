<template>
  <Poptip placement="bottom"
          @on-popper-hide="emitData"
          class="memberPoptip">
    <span class="add-icon">
      <Icon type="plus-circled"
            :size="28"></Icon>
    </span>
    <div slot="content">
      <Input v-model="member"
             placeholder="查找成员"
             autofocus
             style="width: 200px;margin:10px;" />
      <ul class="peopleList">
        <li @click="check(-1)"
            v-if="getUserList.length>0">
          <div>所有参与者
            <svg-icon class="right"
                      name="right"
                      v-if="checkAll"></svg-icon>
          </div>
        </li>
        <li v-for="(item,index) in getUserList"
            :key="index"
            @click="check(index,item.check)">
          <div class="avator">
            <img :src="`https://art1001-bim-5d.oss-cn-beijing.aliyuncs.com/${item.image}`">
            {{item.userName}}
            <svg-icon class="right"
                      name="right"
                      v-if="item.check"></svg-icon>
          </div>
        </li>
      </ul>
    </div>
  </Poptip>

</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      member: '',
      userList: [
        // {
        //   id: 1,
        //   avatar: '',
        //   name: '罗茜'
        // },
        // {
        //   id: 2,
        //   avatar: '',
        //   name: 'tracy'
        // }
      ]
    }
  },
  computed: {
    ...mapState('task', ['members']),
    getUserList () {
      return this.userList.filter(v => this.$containStr(this.member, v.userName))
    },
    checkAll: {
      get () {
        return !this.userList.find(v => v.check == false)
      },
      set (flag) {
        this.userList.map((v, ii) => {
          this.$set(this.userList, ii, Object.assign(this.userList[ii], { check: flag }))
        })
      }
    }
  },
  methods: {
    ...mapActions('task', ['initMemberList']),
    check (i, check) {
      if (i == -1) {
        this.checkAll = !this.checkAll
      } else {
        this.$set(this.userList, i, Object.assign(this.userList[i], { check: !check }))
      }
    },
    emitData () {
      this.$emit('change', this.userList.filter(v => v.check))
    },
    del (id) {
      this.userList.map((v, i) => {
        if (v.userId == id) {
          this.$set(this.userList, i, Object.assign(this.userList[i], { check: false }))
        }
      })
      this.emitData()
    }
  },
  mounted () {

    //获取参与者（成员）列表
    this.initMemberList(() => {
      this.userList = JSON.parse(JSON.stringify(this.members))

      this.userList.map((v, i) => {
        this.$set(this.userList, i, Object.assign(v, { check: false }))
      })
    })
  }
}
</script>
<style scoped lang="less">
.add-icon {
  color: #3da8f5;
  cursor: pointer;
  &:hover {
    color: #3696dc;
  }
}
.memberPoptip /deep/ .ivu-poptip-body {
  padding: 0;
}
.right {
  float: right;
  vertical-align: center;
  width: 20px;
}
.peopleList {
  li {
    line-height: 30px;
    font-size: 14px;
    cursor: pointer;
    text-indent: 12px;
    padding: 0 10px 0 5px;
    &:hover {
      background: #eee;
      font-weight: bold;
    }
  }
}
.avator {
  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 6px;
  }
  line-height: 35px;
}
</style>

