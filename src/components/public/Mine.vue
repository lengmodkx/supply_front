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
    <div class="close" @click="closeMine">&times;</div>

  </div>
</template>
<script>
import {mapMutations,mapState} from 'vuex'
  export default{
    data () {
      return {
      }
    },
    mounted () {
    },
    methods:{
        ...mapMutations('user',["changeMineRouter","changeProjectRouter"]),
        ...mapState('user',['projectRouter']),
        closeMine(){
            this.$router.push(localStorage.projectRouter)
        }
    }, 
    beforeRouteLeave(to, from, next){
        localStorage.mineRouter=from.fullPath
        next(vm => {
            // vm.changeMineRouter(from.fullPath)
        })
    }
    // beforeRouteEnter(to, from, next){
    //     localStorage.projectRouter=from.fullPath
    //     next(vm => {
    //         // vm.changeProjectRouter(from.fullPath)
    //
    //     })
    // },
  }
</script>
<style scoped lang="less">
@import './Mine';

</style>

