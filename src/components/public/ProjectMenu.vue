<template>
  <div class="projectMenu">
    <div class="head">
      项目菜单
      <span class="close"
            @click="$emit('hideMenuBox')">
        <Icon type="close-round"></Icon>
      </span>
    </div>

  </div>

</template>
<script>
export default {
  name: "",
  data () {
    return {

    }
  }
};
</script>
<style scoped lang="less">
.projectMenu {
  position: fixed;
  top: 98px;
  right: -352px;
  z-index: 888;
  width: 350px;
  height: calc(100% - 98px);
  background-color: #f7f7f7;
  transition: 0;
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.1);
  &.animate {
    transition: 0.1s;
  }
  .head {
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    position: relative;
    font-weight: bold;
    width: 320px;
    margin: 0 15px;
    border-bottom: 1px solid #e5e5e5;
    .close {
      cursor: pointer;
      color: lightgray;
      font-size: 20px;
      width: 20px;
      height: 40px;
      position: absolute;
      top: 0;
      right: 0;
      &:hover {
        color: #3da8f5;
      }
    }
  }
}
.activeMenu {
  right: 0px;
}
</style>
