<template>
  <Tooltip :content="remind? remind:'添加提醒规则'"
           placement="top"
           transfer>
    <Dropdown trigger="click"
              transfer
              @on-click="itemClick">
      <slot :remind="curRepeat">
        <Icon type="ios-alarm-outline" size="20"></Icon>
      </slot>
      <DropdownMenu slot="list"
                    class="aaaaaab">
        <DropdownItem v-for="item in list" :selected="item.name === remind"
                      :key="item.name"
                      :name="item.name">
          {{item.name}}
            <Icon type="md-checkmark" size="20" v-if="item.name === remind" class="right" />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Tooltip>
</template>
<script>
  export default {
    props: ['remind'],
    data () {
      return {
        visible: false,
        curRepeat: { id: 0, name: '不提醒' },
        list: [{ id: 0, name: '不提醒' }, { id: 1, name: '任务开始时提醒' }, { id: 2, name: '任务截止时提醒' }]
      }
    },
    methods: {
      itemClick (name) {
        this.$emit('updateRepeat', name)
      },
    }
    // mounted () {
    //   this.repeat && this.itemClick(this.repeat)
    // }
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
