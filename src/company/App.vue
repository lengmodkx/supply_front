<template>
  <div id="app">
    <div class="content-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
    };
  },
};
</script>

<style lang="less">
@import "./assets/common";
</style>
