<template>
  <Tooltip content="添加提醒"
           placement="top"
           transfer>
    <Dropdown trigger="click"
              transfer
              @on-click="itemClick"
              @on-visible-change="visibleChange">
      <slot :repeat="curRepeat">
        <Icon type="ios-alarm-outline"
                  size="20"></Icon>
      </slot>
      <DropdownMenu slot="list"
                    class="aaaaaab">
        <DropdownItem v-for="item in list"
                      :key="item.id"
                      :name="item.id">
          {{item.name}}
          <svg-icon v-if="item.id==curRepeat.id"
                    class="right"
                    name="right"></svg-icon>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Tooltip>
</template>
<script>
export default {
  props: ['repeat'],
  data () {
    return {
      visible: false,
      curRepeat: { id: 0, name: '关闭提醒' },
      list: [{ id: 0, name: '关闭提醒' }, { id: 1, name: '开始时提醒' }, { id: 2, name: '5分钟前' }, { id: 3, name: '15分钟前' }, { id: 4, name: '30分钟前' }, { id: 5, name: '1小时前' }, { id: 6, name: '2小时前' },{ id: 7, name: '1天前' }]
    }
  },
  methods: {
    itemClick (id) {
      this.curRepeat = this.list.find(v => v.id == id)
      this.$emit('update:repeat', this.curRepeat.id)
    },
    visibleChange (visible) {
      this.$nextTick(_ => {
        this.visible = visible
      })
    }
  },
  mounted () {
    this.repeat && this.itemClick(this.repeat)
  }
}
</script>
<style scoped lang="less">

.right {
  float: right;
  vertical-align: middle;
  width: 20px;
}
.ivu-dropdown-menu {
  min-width: 150px;
}
.myDropdown{
  ::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: #e5e5e5;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #cecece;
  }
}
</style>
