<template>
  <header class="header" id="header">
    
    <div class="left-header">
      <div  class="logo" :class="header?'logo-big':'logo-small'">
              <img src="../../assets/images/download.png" alt="" />
        
              <span :class="header?'big':'small'" >Pear Project</span>
      </div>
      <ul>
         <li class="hover">
           <Icon type="ios-keypad-outline" />
            工作台
         </li>
          <li>
            <Icon type="ios-photos-outline"/>                      
            项目管理
          </li>
           <li>
            <Icon type="ios-contacts-outline"/>          
            团队成员
          </li>
           <li>
             <Icon type="ios-cog" size='18'/>        
            系统设置
          </li>
      </ul>

    </div>
    <div class="right-header">
       <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar"/>
        <span>
          vilson.li
        </span>
    </div>
    
  </header>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "header-main",
  components: {
   
  },
   computed: {
        ...mapState("app", ["header"])
   },
  data() {
    return { };
    },
 
  mounted() {
    
  },
  methods: {
   
  },
 
  created() {
     
  }
};
</script>
<style scoped lang="less">

</style>
