<template>
  <span class="addItem"
        @click="$emit('click')">
    <Icon type="android-add-circle"></Icon>
    <slot>添加</slot>
  </span>
</template>
<style lang="less" scoped>
.addItem {
  color: #2d8cf0;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    color: #2a75ab;
  }
}
</style>
