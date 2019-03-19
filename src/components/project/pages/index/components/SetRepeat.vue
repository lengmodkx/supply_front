<template>
  <Tooltip content="点击设置任务重复"
           placement="top"
           transfer>
    <Dropdown trigger="click"
              transfer
              @on-click="itemClick"
              @on-visible-change="visibleChange">
      <slot :repeat="curRepeat">
        <Icon type="ios-color-filter-outline"
              size="20"></Icon>
      </slot>
      <DropdownMenu slot="list"
                    class="aaaaaab">
        <DropdownItem v-for="item in list"
                      :key="item.id"
                      :name="item.name">
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
      curRepeat: { id: 0, name: '不重复' },
      list: [{ id: 0, name: '不重复' }, { id: 1, name: '每天重复' }, { id: 2, name: '每周重复' }, { id: 3, name: '每月重复' }, { id: 4, name: '每年重复' }, { id: 5, name: '工作日重复' }]
    }
  },
  methods: {
    itemClick (name) {
      this.curRepeat = this.list.find(v => v.name == name)
      this.$emit('update:repeat', this.curRepeat.name)
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
  vertical-align: center;
  width: 20px;
}
.ivu-dropdown-menu {
  min-width: 150px;
}
</style>
