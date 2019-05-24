<template>
  <div id="app">
    <div class="content-main">
      <header id="header">
        <div class="header-left">
          <Tooltip :content="isExtend?'点击收起导航':'点击展开导航'" placement="right">
            <Icon @click="isExtend=!isExtend" class="icon-menu" type="md-menu" />
          </Tooltip>
          <img src="https://dn-st.teambition.net/teambition/images/logo1.a6464e9c.jpg" alt="">
          <span>lijian</span>
        </div>
        <img class="header-right" src="https://dn-st.teambition.net/teambition/images/logo1.a6464e9c.jpg" alt="">
      </header>
      <div class="content">
        <div v-show="isExtend" class="left-nav">
          <Menu active-name="1" width="278px">
            <MenuGroup title="基础">
              <MenuItem name="1" to="/information">
                <Icon type="md-print" size="16" />
                企业信息
              </MenuItem>
              <MenuItem name="2" to="/company-jurisdiction">
                <Icon type="ios-ribbon-outline" size="16" />
                企业权限
              </MenuItem>
              <MenuItem name="3" to="/project-jurisdiction">
                <Icon type="logo-buffer" size="16" />
                项目权限
              </MenuItem>
            </MenuGroup>
          </Menu>
        </div>
        <div v-show="isExtend" class="left-zhanwei"></div>
        <div class="right-con">
          <router-view></router-view>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      isExtend: true,
    };
  },
};
</script>

<style lang="less">
@import "./assets/common";
</style>
