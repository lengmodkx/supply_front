<template>
  <Drawer title="系统布局配置" v-model="isDrawer" :closable="false" size="260px" transfer>
    <div class="drawer-flex">
      <div class="drawer-item" :style="{ opacity: isStrange() ? '0.5' : '1' }">
        菜单主题 {{ layouts.subMenuTheme === "dark" ? "Dark" : "Light" }}
      </div>
      <i-switch true-value="light" false-value="dark" v-model="layouts.subMenuTheme" class="drawer-item"
        :disabled="isStrange()" @on-change="onSwitchChange"></i-switch>
    </div>
  </Drawer>
</template>

<script>
  import {
    mapState,
    mapActions
  } from "vuex";
  export default {
    name: "dropdownDrawer",
    data() {
      return {
        isDrawer: false,
        layouts: {},
      };
    },
    computed: {
      ...mapState('drawer', ["layoutConfig"]),
    },
    mounted() {
      // console.log(this.layoutConfig)
      this.layouts = this.layoutConfig;
    },
    methods: {
      ...mapActions(["setLayoutConfig"]),
      isStrange() {
        return this.layouts.layout === "strange";
      },
      openDrawer() {
        this.isDrawer = true;
      },
      onSwitchChange() {
        if (this.layouts.layout === "elegant") {
          this.layouts.isCollapse = false;
        }
        window.sessionStorage.setItem("layoutConfig", JSON.stringify(this.layouts));
        this.setLayoutConfig(this.layouts);
      },
    },
  };
</script>

<style scoped lang="less">
  .drawer-flex {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;

    .drawer-item {
      color: #666666;
    }
  }
</style>