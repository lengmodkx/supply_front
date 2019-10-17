<template>
  <div class="mine">
      <ul class="mine-nav">
          <li :class="hover=='nearThing'?'router-link-active':''" @click="openTag('nearThing')">近期的事</li>
          <li :class="hover=='task'?'router-link-active':''"  @click="openTag('task')">任务</li>
          <li :class="hover=='schedule'?'router-link-active':''"  @click="openTag('schedule')">日程</li>
          <li :class="hover=='file'?'router-link-active':''"  @click="openTag('file')">文件</li>
          <li :class="hover=='collect'?'router-link-active':''"  @click="openTag('collect')">收藏</li>
          <!-- <router-link tag="li" to="nearThing">近期的事</router-link>
          <router-link tag="li" to="task">任务</router-link>
          <router-link tag="li" to="schedule">日程</router-link>
          <router-link tag="li" to="file">文件</router-link>
          <router-link tag="li" to="collect">收藏</router-link> -->
      </ul>
      <!-- <router-view></router-view> -->
    <!-- <div class="close" @click="closeMine">&times;</div> -->
    <nearThing v-if="mineTag=='nearThing'"></nearThing>
    <task v-else-if="mineTag=='task'"></task>
    <schedule v-else-if="mineTag=='schedule'"></schedule>
    <file v-else-if="mineTag=='file'"></file>
    <collect v-else-if="mineTag=='collect'"></collect>

  </div>
</template>
<script>
import nearThing from './mine/nearThing';
import task from './mine/mineTask';
import schedule from './mine/mineSchedule';
import file from './mine/mineFile';
import collect from './mine/mineCollect';



import {mapMutations,mapState} from 'vuex'
  export default{
    components:{
      nearThing,//近期的事
      task,//任务
      schedule,//日程
      file,//文件
      collect//收藏
    },
    data () {
      return {
        hover:'nearThing',
        mineTag:'nearThing'
      }
    },
    mounted () {
    },
    methods:{
        ...mapMutations('user',["changeMineRouter","changeProjectRouter"]),
        ...mapState('user',['projectRouter']),
        closeMine(){
            this.$router.push(localStorage.projectRouter)
        },
        //切换TAG
        openTag(tagName){
          
            this.mineTag=tagName;
            this.hover=tagName
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

