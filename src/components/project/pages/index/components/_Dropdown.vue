<template>
  <Dropdown trigger="custom"
            :visible="visible"
            class="dropBox">
    <DropdownMenu slot="list"
                  class="aaa">
      <div class="dropdownTitle">
        添加筛选
        <span @click="$emit('update:visible',false)">
          <svg-icon class="closePop"
                    name="close"></svg-icon>
        </span>
      </div>
      <DropdownItem v-for="(item,i) in list"
                    :key="i"
                    @click.native="item.checked=!item.checked">
        {{item.name}}
        <svg-icon v-if="item.checked"
                  class="right"
                  name="right"></svg-icon>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
export default {
  props: ["visible", "list"],
  data () {
    return {

    };
  },
  methods: {

  }
};
</script>
<style scoped lang="less">
.dropBox {
  .aaa {
    width: 250px;
  }
  .right {
    float: right;
    vertical-align: center;
    width: 20px;
  }
  .dropdownTitle {
    border-bottom: 1px solid #eee;
    font-size: 16px;
    color: #555;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    .closePop {
      // fill:#3da8f5;
      vertical-align: middle;
      width: 18px;
      height: 18px;
      fill: #8a8a8a;
      &:hover {
        fill: #3da8f5;
      }
    }
    span {
      display: inline-block;
      // font-size:20px;
      float: right;
      margin-right: 20px;
    }
  }
  .ivu-select-dropdown {
    top: 160px;
    left: 5px;
    margin-left: 20px;
    width: 250px !important;
  }
  .ivu-dropdown-item {
    width: 100%;
    font-size: 15px !important;
  }
}
</style>
