<template>
  <header class="header" id="header">

    <div class="left-header">
      <div class="logo" :class="header?'logo-big':'logo-small'">
        <img src="../../assets/images/download.png" alt="" />

        <span :class="header?'big':'small'">Pear Project</span>
      </div>
      <ul>
        <li :class="{hover:active==0}" @click="goOrg">
          <Icon type="ios-keypad-outline" />
          工作台
        </li>
        <li :class="{hover:active==1}" @click="projectList">
          <Icon type="ios-photos-outline" />
          项目管理
        </li>
        <li @click="goMembers" :class="{hover:active==2}">
          <Icon type="ios-contacts-outline" />
          团队成员
        </li>
        <li :class="{hover:active==3}">
          <Icon type="ios-cog" size='18' />
          系统设置
        </li>
      </ul>

    </div>
    <div class="right-header">
      <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" class="avatar" />
      <span>
        vilson.li
      </span>
    </div>

  </header>
</template>

<script>
  import { mapActions, mapState, mapMutations } from "vuex";
  import { checkPermission } from "../../axios/api.js";

  export default {
    name: "header-main",
    components: {

    },
    computed: {
      ...mapState("app", ["header"])
    },
    data() {
      return {
        companyId: '',
        active: 0,
      };
    },

    mounted() {
      this.companyId = localStorage.companyId
      //切换路由页面刷新时用
      if (this.$route.name == 'organization') {
        this.active = 0
      } else if (this.$route.name == 'prolist') {
        this.active = 1
      } else if (this.$route.name == 'members') {
        this.active = 2
      }
      
    },
    methods: {
      //去首页
      goOrg() {
        this.active = 0
        this.$router.push("/org/" + this.companyId);
      },
      projectList() {
        this.active = 1
        this.$router.push("/prolist/" + this.companyId);
      },
      // 去成员页面
      goMembers() {
        checkPermission(localStorage.companyId).then(res => {
          if (res.result == 1 && res.data == true) {
            this.active = 2
            this.$router.push("/members");
          } else {
            this.$Message.error("没有权限");
          }
        });
      },
    },
  };
</script>
<style scoped lang="less">

</style>