<template>
  <div class="layout-right">
    <information v-if="mineTag=='8,0'"></information>
    <management v-if="mineTag=='8,1'"></management>
    <orgStructure v-if="mineTag=='8,2'"></orgStructure>
    <enterpriseAuthority v-if="mineTag=='8,3'"></enterpriseAuthority>
    <projectAuthority v-if="mineTag=='8,4'"></projectAuthority>
    <operationLog v-if="mineTag=='8,5'"></operationLog>
    <exportApplication v-if="mineTag=='8,6'"></exportApplication>
  </div>
</template>
<script>
  import Loading from "../components/public/common/Loading.vue";
  import information from "./informationS.vue";
  import management from "./managementS.vue";
  import orgStructure from "./orgStructureS.vue";
  import enterpriseAuthority from "./enterpriseAuthorityS.vue";
  import projectAuthority from "./projectAuthorityS.vue";
  import operationLog from "./operationLogS.vue";
  import exportApplication from "./exportApplicationS.vue";
  import {
    mapActions,
    mapState,
    mapMutations
  } from "vuex";
  export default {
    components: {
      Loading,
      information,
      management,
      orgStructure,
      enterpriseAuthority,
      projectAuthority,
      operationLog,
      exportApplication
    },
    inject: ["reload"],
    data() {
      return {
        tabValue: "0", //项目列表tab栏选中项
        menuActive: "1,0", //菜单栏选中项
        mineTag: "1,0",
        openNames: ["1"]
      };
    },
    computed: {
      ...mapState(["loading", "header"], "app"),
      ...mapState('drawer', ["layoutConfig"]),
    },
    mounted() {
      this.companyId = localStorage.companyId;
    },
    created() {
      if (this.$route.query.from == "members") {
        this.openNames = ["2"];
        this.menuActive = "2,0";
        this.mineTag = "2,0";
      }else {
              this.openTag(this.$route.query.checkTagName)

      }
    },
    methods: {
      openTag(tagName) {
        this.mineTag = tagName;
      },
    }
  };
</script>
<style scoped lang="less">
  @import "../assets/css/menu.less";

  .layout-right {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    position: relative;
    min-height: 100%;
    .noList {
      margin-top: 10%;

      img {
        display: block;
        width: 135px;
        height: 90px;
        margin: 8px auto 16px;
      }

      p {
        text-align: center;
        color: #333333;
      }
    }
  }
</style>