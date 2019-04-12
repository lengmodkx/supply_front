<template>
  <div class="mine">
      <ul class="mine-nav">
          <router-link tag="li" to="nearThing">近期的事</router-link>
          <router-link tag="li" to="task">任务</router-link>
          <router-link tag="li" to="schedule">日程</router-link>
          <router-link tag="li" to="file">文件</router-link>
          <router-link tag="li" to="collect">收藏</router-link>
      </ul>
      <router-view></router-view>
    <div class="close" @click="$emit('close')">&times;</div>

  </div>
</template>
<script>

  export default{
    data () {
      return {
      }
    },
    mounted () {
    },
    methods:{
    }
  }
</script>
<style scoped lang="less">
@import './Mine';

</style>

