<template>
  <div class="rightItem"
       @click="$emit('update:checked',id)">
    <slot>name</slot>
    <svg-icon v-show="checked==id"
              name="right"></svg-icon>
  </div>
</template>
<script>
export default {
  props: ['checked', 'id']
}
</script>
<style lang="less" scoped>
div.rightItem {
  position: relative;
  .svg-icon {
    position: absolute;
    top: 50%;
    right: 0;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
  }
}
</style>
