<template>
  <Tooltip :content="repeat ? repeat : '添加重复规则'" placement="top" transfer>
    <Dropdown trigger="click"  @on-click="itemClick" >
      <slot :repeat="curRepeat">
        <Icon type="md-repeat" size="20" v-if="repeat != '不重复'" color="#8c8c8c" style="margin-right:15px;cursor: pointer;"></Icon>
        <Icon type="md-repeat" size="20" v-else style="margin-right:15px;cursor: pointer;" color="#8c8c8c"></Icon>
      </slot>
      <DropdownMenu slot="list" class="aaaaaab">
        <DropdownItem v-for="item in list" :selected="item.name === repeat" :key="item.name" :name="item.name">
          {{ item.name }}
          <Icon type="md-checkmark" size="20" v-if="item.name === repeat" class="right" />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </Tooltip>
</template>
<script>
export default {
  props: ["repeat"],
  data() {
    return {
      visible: false,
      curRepeat: { id: 0, name: "不重复" },
      list: [{ id: 0, name: "不重复" }, { id: 1, name: "每天重复" }, { id: 2, name: "每周重复" }, { id: 3, name: "每月重复" }, { id: 4, name: "每年重复" }, { id: 5, name: "工作日重复" }],
    };
  },
  methods: {
    itemClick(name) {
      this.$emit("updateRepeat", name);
    },
    selectReapeat(data) {
      this.$emit("changeRepeat", data);
    },
    visibleChange(visible) {
      this.$nextTick((_) => {
        this.visible = visible;
      });
    },
  },
  // mounted () {
  //   this.repeat && this.itemClick(this.repeat)
  // }
};
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
/deep/.ivu-select-dropdown {
  max-height: 220px !important;
}
</style>
